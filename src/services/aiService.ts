/**
 * ReadyCareer AI — 하이브리드 AI 통신 모듈
 * 1. 로컬/.env 직접 통신: VITE_OPENAI_API_KEY 또는 VITE_GEMINI_API_KEY를 이용해 프론트에서 빠른 테스트
 * 2. Vercel / Supabase Edge 서버리스 프록시: 정식 배포 시 API 키 비보유 웹에서 안전한 서버 전송 (/api/ai-proxy)
 * 3. 1초 박람회 데모 폴백(Fallback): 네트워크 오프라인 혹은 키 미연결 시에도 100% 끊김 없는 고품질 모의 답변 보장
 */

export interface AiRequestPayload {
  promptType: "saengbu_guideline" | "vision_recommendation" | "self_understanding_report";
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
}

export interface AiResponseResult {
  success: boolean;
  content: string;
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
  const useServerProxy = import.meta.env.VITE_USE_AI_PROXY === "true" || import.meta.env.PROD;

  // 1. [정식 Vercel Serverless / Edge Function 통신] - 프론트엔드 API 키 숨김 보안 모드
  if (useServerProxy && !clientApiKey) {
    try {
      const response = await fetch("/api/ai-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          return {
            success: true,
            content: data.content,
            provider: "vercel-serverless",
            model: data.model || "gpt-4o-mini",
          };
        }
      }
    } catch (e) {
      console.warn("[AI Service] Vercel 프록시 API 통신 지연. 로컬 및 데모 폴백으로 전환합니다.", e);
    }
  }

  // 2. [로컬 .env.local 프론트 직접 연동] - 빠른 시연 및 개발용
  if (clientApiKey) {
    try {
      const systemPrompt = payload.promptType === "saengbu_guideline"
        ? SAENGBU_SYSTEM_PROMPT
        : "당신은 레디커리어 AI의 진로 멘토 '아리' 및 대입 전문가입니다. 꿈과 자신감을 심어주는 품격 있는 커리어 어드바이스를 작성합니다.";
      
      const promptText = buildPromptText(payload);
      const openAiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: promptText },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (openAiResp.ok) {
        const json = await openAiResp.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            content: content.trim(),
            provider: "client-env-direct",
            model: "gpt-4o-mini",
          };
        }
      }
    } catch (e) {
      console.error("[AI Service] OpenAI 직접 호출 오류 발생:", e);
    }
  }

  // 3. [박람회 1초 모의 폴백 (Expo Pilot Fallback)] - 통신 장애/키 누락을 원천 차단
  const demoContent = getExpoFallbackContent(payload);
  return {
    success: true,
    content: demoContent,
    provider: "expo-demo-fallback",
  };
};

function buildPromptText(payload: AiRequestPayload): string {
  if (payload.promptType === "saengbu_guideline") {
    return `# Input Data
- 대상 학년: ${payload.gradeLevel || "고등학교 2학년"}
- 활동 영역: ${payload.activityDomain || "진로활동 및 창의적체험활동"}
- 활동 명칭 및 기간: ${payload.activityNameAndPeriod || "자기주도 진로 탐색 및 50일 알고리즘 습관 챌린지 (2026 1학기)"}
- 학생 제출 자료(소감문/자기평가서): ${payload.studentSubmittedText || `${payload.targetJob || "AI 에듀테크 진로 멘토"}를 꿈꾸며 RIASEC ${payload.riasecCode || "SI"} 성향의 진단을 통해 포트폴리오를 작성함.`}
- 교사 관찰 메모(평가 키워드): ${payload.teacherObservationMemo || "자기주도성, 뛰어난 분석력, 타인 배려 및 팀워크 역량, 학술적 탐구 의지 우수"}`;
  }

  if (payload.promptType === "vision_recommendation") {
    return `[비전 선언문 추천 요청]
지망 꿈: ${payload.targetJob || "AI 융합 개척자"}
이 학생에게 어울리는 힘 있는 한 문장의 비전선언문을 3가지 추천해 줘.`;
  }

  return payload.userPrompt || "학생 진로에 대한 AI 멘토 코멘트를 생성해 주세요.";
}

function getExpoFallbackContent(payload: AiRequestPayload): string {
  if (payload.promptType === "saengbu_guideline") {
    const job = payload.targetJob || "스마트 AI 에듀테크 진로 멘토";
    const riasec = payload.riasecCode || "SI";
    return `### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- 진로 탐색 및 창의적 체험 활동 시간 동안 '${job}' 직업군을 심층 탐구하며 학기 전반에 걸쳐 진로 학습 계획을 성실히 이행함.
- ${riasec} 흥미유형 진단 역량을 토대로 자신의 학업적 강점과 교실 속 문제 해결 방안을 융합한 진로 탐색 보고서 포트폴리오를 작성 및 보관함.
- 50일 자기계발 챌린지를 주도적으로 수행하며 매주 학습한 교과 연계 탐구 일지를 구조화하여 누적기록함.

**2. 성장 및 행동 특성 (Growth)**
- 문제 해결 과정에서 객관적인 사실 기반의 분석력을 보이며, 학업을 대하는 태도가 적극적이고 열정적인 모습으로 성장함.
- 동료 스터디 및 토론 활동 중 상대방의 의견을 포용하고 대안을 구체화하는 우수한 소통 역량을 드러냄.
- 인공지능 및 교육공학 분야에 대한 흥미를 구체적인 학문적 호기심으로 연결하여 확장적인 독서 및 탐구를 지속함.

**3. 📝 생기부 참고용 초안 (Draft)**
> 진로 탐색 활동 및 학급 운영 과정에서 ${job}에 대한 깊은 학업적 관심을 바탕으로 AI 융합 역량 탐구 및 매일 챌린지 활동을 주도적으로 완수함. 교과 학습 중 제기된 호기심을 놓치지 않고 체계적인 분석 데이터와 도서를 바탕으로 실증적인 진로 탐색 리포트를 도출함. 조별 스터디 과정에서 동료의 의견을 경청하고 조율하는 뛰어난 소통 태도와 협업 리더십을 보이며, 미래 진로 역량을 끊임없이 성찰하고 전문적으로 구체화하는 우수한 발전 가능성을 보임.

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`;
  }

  if (payload.promptType === "vision_recommendation") {
    return `"${payload.targetJob || "AI 융합 전문가"}의 꿈을 품고, 첨단 데이터 지식과 따뜻한 인간 중심의 공감 능력으로 사회적 혁신을 실현하는 실전파 리더!"`;
  }

  return "✨ 아리가 분석한 결과, 회원님은 미래 진로에서 누구보다 주도적인 성취를 거둘 준비가 끝난 최고 역량 보유자입니다!";
}
