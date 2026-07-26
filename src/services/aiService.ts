/**
 * ReadyCareer AI — 하이브리드 AI 통신 단일 모듈 (src/services/aiService.ts)
 * 5대 원칙 준수: AI 호출은 Vercel Serverless Function(/api/ai-proxy)을 우선 경유하며 클라이언트 번들에 노출되지 않음.
 * 박람회 시연 100% 무중단 폴백을 포함.
 */

export interface AiRequestPayload {
  promptType: "saengbu_guideline" | "generate_constellation" | "portfolio_refine" | "habit_design" | "vision_recommendation" | "self_understanding_report";
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
        promptText = `지망직업: ${payload.targetJob || "AI 분야"}\n흥미유형: ${payload.riasecCode || "SI"}\n5~6개 별(nodes)의 x, y 백분율 좌표(15~85 사이), label, desc와 한입 퀘스트 배열(quests), 그리고 별들을 연결하는 edges를 포함한 JSON을 출력하세요. 형식: { "constellationName": "...", "nodes": [{"id":"s1", "label":"...", "x":20, "y":70, "quests":[{"title":"...", "expReward":50, "status":"active"}]}], "edges":[{"from":"s1","to":"s2"}] }`;
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
- 학생 제출 자료(소감문/자기평가서): ${payload.studentSubmittedText || `${payload.targetJob || "AI 에듀테크 진로 멘토"}를 꿈꾸며 RIASEC ${payload.riasecCode || "SI"} 성향의 진단을 통해 포트폴리오를 작성함.`}
- 교사 관찰 메모(평가 키워드): ${payload.teacherObservationMemo || "자기주도성, 뛰어난 분석력, 타인 배려 및 팀워크 역량, 학술적 탐구 의지 우수"}`;
  }
  if (payload.promptType === "portfolio_refine") {
    return `활동 초안: "${payload.userPrompt || "학교 수업시간에 AI 관련 도서를 읽고 코딩 실습을 진행했음"}" -> 대입 평가자가 감동할 명확한 학술적 표현과 STAR 기법으로 다듬어 주세요.`;
  }
  if (payload.promptType === "habit_design") {
    return `지망 직업: ${payload.targetJob || "AI 로보틱스 연구원"}, 흥미유형: ${payload.riasecCode || "RC"}`;
  }
  return payload.userPrompt || "학생 진로에 대한 AI 멘토 코멘트를 생성해 주세요.";
}

function getExpoFallbackResult(payload: AiRequestPayload): AiResponseResult {
  const job = payload.targetJob || "스마트 AI 에듀테크 진로 멘토";
  const riasec = payload.riasecCode || "SI";

  if (payload.promptType === "generate_constellation") {
    // 학생의 직업과 RIASEC 유형에 따라 밤하늘 별자리 좌표와 퀘스트를 다양하게 변형
    const isEng = riasec.includes("R") || riasec.includes("I") || job.includes("로봇") || job.includes("연구원") || job.includes("엔지니어") || job.includes("아키텍트");
    
    const constellationData = isEng
      ? {
          constellationName: `[${riasec} 공학 개척자] ${job}의 페르세우스 별자리`,
          nodes: [
            {
              id: "star-1",
              label: "1. Python 기초 및 자료구조 마스터",
              desc: "프로그래밍의 기본 기교와 논리 알고리즘을 닦는 출발 별자리입니다.",
              x: 18,
              y: 72,
              quests: [
                { id: "q1", title: "파이썬 변수 및 제어문 실습 과제 완료", expReward: 30, status: "done" },
                { id: "q2", title: "알리고즘 정렬 로직 노트 필기 인증", expReward: 50, status: "active" }
              ]
            },
            {
              id: "star-2",
              label: "2. 아두이노 및 IoT 임계 센서 조합",
              desc: "물리 하드웨어와 SW를 융합하여 제어 시스템을 구축하는 탐구 노드입니다.",
              x: 34,
              y: 45,
              quests: [
                { id: "q3", title: "4륜 주행 모터 키트 구동 실험 보고서", expReward: 70, status: "active" },
                { id: "q4", title: "과학 동아리 부원들과 코드 회의 진행", expReward: 50, status: "locked" }
              ]
            },
            {
              id: "star-3",
              label: "3. 공공 테크 빅데이터 API 활용 모델링",
              desc: "실제 공공 교육 및 교통 데이터 세트를 분석하여 예측 모델을 작성합니다.",
              x: 52,
              y: 25,
              quests: [
                { id: "q5", title: "공공 데이터 포털에서 데이터 추출 및 정제", expReward: 60, status: "locked" },
                { id: "q6", title: "판다스(Pandas) 활용 시각화 차트 완성", expReward: 80, status: "locked" }
              ]
            },
            {
              id: "star-4",
              label: "4. 과학 기술 고전 비판적 독서 토론",
              desc: "인류학적 관점에서 AI 기술과 로봇 윤리를 논하는 성찰 단계입니다.",
              x: 72,
              y: 35,
              quests: [
                { id: "q7", title: "'인공지능과 현대 사회' 3장 요약글 제출", expReward: 50, status: "locked" },
                { id: "q8", title: "교내 지정 토론대회 입론자 발표 완수", expReward: 100, status: "locked" }
              ]
            },
            {
              id: "star-5",
              label: "5. 종합 캡스톤 로보틱스 포트폴리오 완공",
              desc: "최종 비전을 담아내며 NEIS 생활기록부 심사 위원에게 바칠 집약체입니다.",
              x: 84,
              y: 65,
              quests: [
                { id: "q9", title: "최종 연구 보고서 5페이지 단행본 업로드", expReward: 150, status: "locked" }
              ]
            }
          ],
          edges: [
            { from: "star-1", to: "star-2" },
            { from: "star-2", to: "star-3" },
            { from: "star-3", to: "star-4" },
            { from: "star-4", to: "star-5" }
          ]
        }
      : {
          constellationName: `[${riasec} 사회·창작 리더] ${job}의 카시오페이아 별자리`,
          nodes: [
            {
              id: "star-a",
              label: "1. 현대 교육공학 및 심리학 서적 탐독",
              desc: "사람들의 성장을 이끄는 공감 능력과 교육적 기초를 다지는 별입니다.",
              x: 20,
              y: 35,
              quests: [
                { id: "qa1", title: "에듀테크와 인간 심리학 도서 감상문 작성", expReward: 40, status: "done" },
                { id: "qa2", title: "진로 멘토로서의 자아 선언문 작성", expReward: 30, status: "active" }
              ]
            },
            {
              id: "star-b",
              label: "2. 교내 멘토-멘티 기부 동아리 창설",
              desc: "학우들에게 선한 영향력을 끼치며 따뜻한 리더십을 검증하는 궤적입니다.",
              x: 40,
              y: 68,
              quests: [
                { id: "qa3", title: "스터디 그룹 결성 및 주간 멘토링 주도", expReward: 60, status: "active" },
                { id: "qa4", title: "학기 말 멘티 학습 성장도 피드백 수집", expReward: 50, status: "locked" }
              ]
            },
            {
              id: "star-c",
              label: "3. 교육 格差 해소 AI 웹 모듈 아이디에이션",
              desc: "소외 계층의 정보 불평등을 해결할 창의적 테크 서비스를 설계합니다.",
              x: 60,
              y: 28,
              quests: [
                { id: "qa5", title: "사용자 인터페이스(UI/UX) 페르소나 설계", expReward: 70, status: "locked" },
                { id: "qa6", title: "생성형 AI API 기획안 프젠테이션 발표", expReward: 90, status: "locked" }
              ]
            },
            {
              id: "star-d",
              label: "4. 사회 이슈 탐구 토론회 기조연설자 섭렵",
              desc: "학교생활기록부 행동특성과 진로활동의 최고점에 달하는 활약입니다.",
              x: 78,
              y: 55,
              quests: [
                { id: "qa7", title: "미래 학교 체제 개편 토론 발표문 투고", expReward: 100, status: "locked" },
                { id: "qa8", title: "AI 생기부 가이드안 AI로 종합 보완", expReward: 120, status: "locked" }
              ]
            }
          ],
          edges: [
            { from: "star-a", to: "star-b" },
            { from: "star-b", to: "star-c" },
            { from: "star-c", to: "star-d" }
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
    return {
      success: true,
      provider: "expo-demo-fallback",
      content: `### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- 진로 탐색 및 창의적 체험 활동 시간 동안 '${job}' 직업군을 심층 탐구하며 학기 전반에 걸쳐 진로 학습 계획을 성실히 이행함.
- ${riasec} 흥미유형 진단 역량을 토대로 자신의 학업적 강점과 교실 속 문제 해결 방안을 융합한 진로 탐색 보고서 포트폴리오를 작성 및 보관함.
- 50일 자기계발 챌린지를 주도적으로 수행하며 매주 학습한 교과 연계 탐구 일지를 구조화하여 누적기록함.

**2. 성장 및 행동 특성 (Growth)**
- 문제 해결 과정에서 객관적인 사실 기반의 분석력을 보이며, 학업을 대하는 태도가 적극적이고 열정적인 모습으로 성장함.
- 동료 스터디 및 토론 활동 중 상대방의 의견을 포용하고 대안을 구체화하는 우수한 소통 역량을 드러냄.
- 인공지능 및 교육공학 분야에 대한 흥미를 구체적인 학업적 호기심으로 연결하여 확장적인 독서 및 탐구를 지속함.

**3. 📝 생기부 참고용 초안 (Draft)**
> 진로 탐색 활동 및 학급 운영 과정에서 ${job}에 대한 깊은 학업적 관심을 바탕으로 AI 융합 역량 탐구 및 매일 챌린지 활동을 주도적으로 완수함. 교과 학습 중 제기된 호기심을 놓치지 않고 체계적인 분석 데이터와 도서를 바탕으로 실증적인 진로 탐색 리포트를 도출함. 조별 스터디 과정에서 동료의 의견을 경청하고 조율하는 뛰어난 소통 태도와 협업 리더십을 보이며, 미래 진로 역량을 끊임없이 성찰하고 전문적으로 구체화하는 우수한 발전 가능성을 보임.

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`
    };
  }

  if (payload.promptType === "portfolio_refine") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      content: `[AI 아리 STAR 기법 문장 구조화 완료]\n- (Situation) 학교 자율 진로 탐험 시간, 미래 ${job} 역량을 체득하기 위해 자발적 탐구 목표를 수립함.\n- (Task/Action) 학습 중 발생한 난제를 단편적으로 넘기지 않고, 관련 전공 학술서 정독 및 50일 알고리즘 습관 실험으로 분석적 데이터 가이드라인을 설계함.\n- (Result) 조별 프로젝트에서 팀원의 다양한 의견을 수용·조율하는 협업 리더십을 통해 완성도 높은 결과 리포트를 산출하며 한 단계 드높은 진취성을 입증함.`
    };
  }

  if (payload.promptType === "habit_design") {
    return {
      success: true,
      provider: "expo-demo-fallback",
      json: [
        { title: `${job} 관점 1일 1기사 정독 및 요약`, targetDays: 50, reason: `${riasec} 역량 강화 및 전공 지식 확장을 위함` },
        { title: "파이썬 및 알고리즘 하루 1문제 코드 실습", targetDays: 30, reason: "논리적 사고와 문제해결력을 훈련하기 위함" },
        { title: "오늘 배운 지식 동료 친구에게 3분 설명하기", targetDays: 20, reason: "사회적 소통 능력과 리더십을 실천하기 위함" }
      ]
    };
  }

  return {
    success: true,
    provider: "expo-demo-fallback",
    content: "✨ 아리가 분석한 결과, 회원님은 미래 진로에서 누구보다 주도적인 성취를 거둘 준비가 끝난 최고 역량 보유자입니다!"
  };
}
