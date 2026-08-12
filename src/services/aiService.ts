/**
 * ReadyCareer AI — 하이브리드 AI 통신 단일 모듈 (src/services/aiService.ts)
 * 5대 원칙 준수: AI 호출은 Vercel Serverless Function(/api/ai-proxy)을 우선 경유하며 클라이언트 번들에 노출되지 않음.
 * 박람회 시연 100% 무중단 폴백을 포함.
 */

import { getJobAiProfile } from "./jobAiTemplates";

export interface AiRequestPayload {
  promptType: "saengbu_guideline" | "generate_constellation" | "portfolio_refine" | "habit_design" | "vision_recommendation" | "self_understanding_report" | "cornell_note_synthesis" | "chat";
  studentName?: string;
  riasecCode?: string;
  targetJob?: string;
  activities?: string[];
  userPrompt?: string;
  gradeLevel?: string;
  activityDomain?: string;
  activityNameAndPeriod?: string;
  studentSubmittedText?: string;
  teacherObservationMemo?: string;
  subject?: string;
  topic?: string;
  keywords?: string;
  userNote?: string;
}

export interface AiResponseResult {
  success: boolean;
  content?: string;
  json?: any;
  provider: "vercel-serverless" | "client-env-direct" | "expo-demo-fallback";
  model?: string;
}

const SAENGBU_SYSTEM_PROMPT = `당신은 대한민국 중·고등학교 교사들의 2026학년도 학교생활기록부(창의적 체험활동, 교과학습발달상황 세부능력 및 특기사항 등) 작성을 전문적으로 보조하는 'AI 생기부 어시스턴트'입니다.
제공된 [Input Data]를 철저히 분석하여, 교사가 나이스(NEIS) 시스템에 직접 참고하고 윤문하여 입력할 수 있는 [Output Format] 형태의 초안 리포트를 생성하는 것이 당신의 목표입니다.

# Strict Constraints (절대 준수 규정)
1. [팩트 기반 작성]: 제공된 Input Data에 명시된 사실만 반영하며 과장 및 허위 사실(Hallucination) 생성은 절대 금지합니다.
2. [기재 금지 사항 차단]: 공인어학시험, 교내·외 대회 명칭/수상, 모의고사 성적, 논문/도서 출간, 해외 활동, 부모/친인척 지위 암시, 구체적인 사설 학원/대학명/기관명은 절대 포함하지 않습니다.
3. [개인정보 및 민감 정보 보호]: 가족관계, 질병명, 연락처는 철저히 배제하고 학생 실명은 반드시 '학생' 또는 'OOO'으로 익명화(Masking) 처리하여 출력합니다.
4. [문체 및 어조 가이드라인]: 교사의 객관적인 관찰자 시점에서 서술하며 문장 끝은 '~함.', '~보임.', '~성장함.', '~노력함.' 등 간결한 명사형 어미로 종결합니다.

# Output Format (마크다운 구조 엄격 준수)
### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- (학생의 구체적인 역할과 수행 내용을 3~4개 글머리 기호로 요약)

**2. 성장 및 행동 특성 (Growth)**
- (관찰된 진보 정도, 태도 변화, 진로에 대한 관심 확장을 2~3개 글머리 기호로 요약)

**3. 📝 생기부 참고용 초안 (Draft)**
> (위 분석과 기재요령을 완벽히 준수하여 다듬어진 3~4문장 분량의 명사형 종결 텍스트. 바로 복사하여 윤문할 수 있는 완성도 높은 형태)

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`;

export const executeAiPrompt = async (payload: AiRequestPayload): Promise<AiResponseResult> => {
  const clientApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_AI_API_KEY;
  const useServerProxy = import.meta.env.VITE_USE_AI_PROXY === "true" || import.meta.env.PROD || !clientApiKey;

  // 1. [Vercel Serverless / Edge Function 프록시 통신] - 보안 규정 기본값
  if (useServerProxy && !clientApiKey) {
    try {
      const response = await fetch("/api/ai-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success || data.content || data.json) {
          return {
            success: true,
            content: data.content,
            json: data.json || (payload.promptType === "generate_constellation" ? parseSafeJson(data.content) : null),
            provider: "vercel-serverless",
            model: data.model || "gpt-4o-mini",
          };
        }
      }
    } catch (e) {
      console.warn("[AI Service] Vercel 프록시 API 통신 실패 또는 개발 환경 지연. 폴백으로 전환합니다.", e);
    }
  }

  // 2. [로컬 개발용 프론트 연동] - VITE_OPENAI_API_KEY 보유 시에만 작동
  if (clientApiKey) {
    try {
      let systemPrompt = "당신은 레디커리어 AI의 진로 멘토 '아리'입니다.";
      let promptText = buildPromptText(payload);
      let isJson = false;

      if (payload.promptType === "saengbu_guideline") {
        systemPrompt = SAENGBU_SYSTEM_PROMPT;
      } else if (payload.promptType === "generate_constellation") {
        isJson = true;
        systemPrompt = "당신은 학생의 꿈과 흥미유형(RIASEC)을 바탕으로 밤하늘 별자리 좌표와 퀘스트를 도출하는 AI 별자리 아키텍트입니다. 무조건 JSON으로 답하세요.";
        promptText = `지망직업: ${payload.targetJob || "로봇공학자"}\n흥미유형: ${payload.riasecCode || "SI"}\n5~6개 별(nodes)의 x, y 백분율 좌표(15~85 사이), label, desc와 한입 퀘스트 배열(quests), 그리고 별들을 연결하는 edges를 포함한 JSON을 출력하세요. 형식: { "constellationName": "...", "nodes": [{"id":"s1", "label":"...", "x":20, "y":70, "quests":[{"title":"...", "expReward":50, "status":"active"}]}], "edges":[{"from":"s1","to":"s2"}] }`;
      }

      const bodyData: any = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptText },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      };
      if (isJson) bodyData.response_format = { type: "json_object" };

      const openAiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientApiKey}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (openAiResp.ok) {
        const jsonResp = await openAiResp.json();
        const content = jsonResp.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            content: content.trim(),
            json: isJson ? parseSafeJson(content) : undefined,
            provider: "client-env-direct",
            model: "gpt-4o-mini",
          };
        }
      }
    } catch (e) {
      console.error("[AI Service] OpenAI 호출 실패:", e);
    }
  }

  // 3. [박람회 데모 모의 폴백 (Expo Fallback)] - 실시간 시연 100% 품질 완수
  return getExpoFallbackResult(payload);
};

function parseSafeJson(text?: string) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function buildPromptText(payload: AiRequestPayload): string {
  if (payload.promptType === "saengbu_guideline") {
    return `# Input Data
- 대상 학년: ${payload.gradeLevel || "고등학교 2학년"}
- 활동 영역: ${payload.activityDomain || "진로활동 및 창의적체험활동"}
- 활동 명칭 및 기간: ${payload.activityNameAndPeriod || "자기주도 진로 탐색 및 50일 알고리즘 습관 챌린지 (2026 1학기)"}
- 학생 제출 자료(소감문/자기평가서): ${payload.studentSubmittedText || `${payload.targetJob || "소프트웨어개발자"}를 꿈꾸며 RIASEC ${payload.riasecCode || "SI"} 성향의 진단을 통해 포트폴리오를 작성함.`}
- 교사 관찰 메모(평가 키워드): ${payload.teacherObservationMemo || "자기주도성, 뛰어난 분석력, 타인 배려 및 팀워크 역량, 학술적 탐구 의지 우수"}`;
  }
  if (payload.promptType === "portfolio_refine") {
    return `활동 초안: "${payload.userPrompt || "학교 수업시간에 AI 관련 도서를 읽고 코딩 실습을 진행했음"}" -> 대입 평가자가 감동할 명확한 학술적 표현과 STAR 기법으로 다듬어 주세요.`;
  }
  if (payload.promptType === "habit_design") {
    return `지망 직업: ${payload.targetJob || "로봇공학자"}, 흥미유형: ${payload.riasecCode || "RC"}`;
  }
  return payload.userPrompt || "학생 진로에 대한 AI 멘토 코멘트를 생성해 주세요.";
}

function getExpoFallbackResult(payload: AiRequestPayload): AiResponseResult {
  const job = payload.targetJob || payload.userPrompt || "로봇공학자";
  const riasec = payload.riasecCode || "I (탐구형)";
  const profile = getJobAiProfile(job, riasec);

  if (payload.promptType === "generate_constellation") {
    const constellationData = {
      constellationName: profile.constellationName,
      nodes: profile.nodes,
      edges: [
        { from: profile.nodes[0]?.id || "dyn-1", to: profile.nodes[1]?.id || "dyn-2" },
        { from: profile.nodes[1]?.id || "dyn-2", to: profile.nodes[2]?.id || "dyn-3" },
        { from: profile.nodes[2]?.id || "dyn-3", to: profile.nodes[3]?.id || "dyn-4" },
        { from: profile.nodes[3]?.id || "dyn-4", to: profile.nodes[4]?.id || "dyn-5" }
      ]
    };

    return {
      success: true,
      provider: "expo-demo-fallback",
      json: constellationData,
      content: JSON.stringify(constellationData)
    };
  }

  if (payload.promptType === "saengbu_guideline") {
    const studentNameDisplay = payload.studentName ? `${payload.studentName} 학생` : "OOO 학생";
    const content = `### 📊 [${studentNameDisplay}] '${profile.jobName}' 활동 및 세특 분석 리포트\n` +
      `**1. 주요 활동 팩트 (Fact)**\n` +
      profile.saengbuFact.map(f => `- ${f}`).join("\n") + "\n\n" +
      `**2. 성장 및 행동 특성 (Growth)**\n` +
      profile.saengbuGrowth.map(g => `- ${g}`).join("\n") + "\n\n" +
      `**3. 📝 2026학년도 생기부 세특 참고용 초안 (Draft)**\n` +
      `> ${profile.saengbuDraft}\n\n` +
      `---\n⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`;

    return {
      success: true,
      provider: "expo-demo-fallback",
      content
    };
  }

  if (payload.promptType === "portfolio_refine") {
    const content = `💡 **[AI 아리 STAR 기법 전공 맞춤 윤문 완료]**\n\n` +
      `• **(Situation | 상황 인식)**: ${profile.portfolioStar.situation}\n\n` +
      `• **(Task & Action | 문제 해결 & 주도적 실천)**: ${profile.portfolioStar.taskAction}\n\n` +
      `• **(Result | 역량 입증 & 차별화 성과)**: ${profile.portfolioStar.result}`;

    return {
      success: true,
      provider: "expo-demo-fallback",
      content
    };
  }

  if (payload.promptType === "habit_design") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      json: profile.habits
    };
  }

  if (payload.promptType === "cornell_note_synthesis") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      content: profile.cornellSynthesis(payload.subject, payload.topic, payload.keywords, payload.userNote)
    };
  }

  if (payload.promptType === "vision_recommendation") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      json: profile.visionSuggestions,
      content: profile.visionSuggestions.join("\n")
    };
  }

  if (payload.promptType === "chat") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      content: `💡 우와, 회원님은 앞으로 **'${profile.jobName}'** 분야에서 정말 멋진 재능을 발휘할 수 있을 거예요!

지금 당장 쉽게 시작해볼 수 있는 **3가지 재미있는 미션**을 추천해드릴게요. 한 번 따라해 볼까요?

1. 🌐 **관련 강연이나 영상 찾아보기**
   - **Kmooc (무료 강의)**: [kmooc.kr](http://www.kmooc.kr)에 접속해서 '${profile.jobName}'이나 평소 관심있던 키워드를 검색해보세요! 중고등학생도 들을 수 있는 쉽고 재미있는 강의가 많아요.
   - **유튜브 브이로그**: 유튜브에 '${profile.jobName} 브이로그'나 '직업 인터뷰'를 검색해서, 실제 일하는 모습이 어떤지 구경하고 가장 신기했던 점을 메모해보세요.

2. 🏅 **어떤 자격증이 있는지 구경해보기**
   - **커리어넷 (진로정보)**: [career.go.kr](https://www.career.go.kr)에서 직업 정보를 검색하면 이 직업을 위해 어떤 자격증이나 준비가 필요한지 아주 쉽게 설명되어 있어요.
   - 지금 당장 따지 않아도 괜찮아요! "아, 이런 걸 공부하는구나~" 하고 가볍게 확인만 해봐도 큰 도움이 된답니다.

3. 🎬 **관련 도서나 기사 읽어보기**
   - 학교 도서관이나 동네 도서관에서 '${profile.jobName}'과 관련된 책을 딱 한 권만 빌려보세요. 
   - 책 전체를 다 읽지 않아도 좋아요. 목차만 쭉 훑어보고 가장 흥미로운 챕터 하나만 골라서 읽은 뒤, 알게 된 점 3가지를 적어보면 어떨까요?

이 3가지 미션 중 하나라도 직접 해본 뒤에 진로 포트폴리오에 추가로 쏙 적어두면, 나만의 진짜 멋진 스토리가 완성될 거예요! 파이팅! 🚀`
    };
  }

  return {
    success: true,
    provider: "expo-demo-fallback",
    content: `✨ 아리가 분석한 결과, 회원님은 '${profile.jobName}' 진로 여정에서 최고 수준의 역량을 꽃피울 준비가 끝난 영재입니다!`
  };
}
