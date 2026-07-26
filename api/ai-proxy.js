/**
 * Vercel Serverless API Proxy for ReadyCareer AI
 * 클라이언트에 OpenAI / Gemini API 키를 노출하지 않는 보안 백엔드 엔드포인트 (/api/ai-proxy)
 * Vercel Dashboard 환경변수 설정: OPENAI_API_KEY 또는 GEMINI_API_KEY
 */

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

export default async function handler(req, res) {
  // CORS 기본 헤더 설정
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Vercel 환경변수(OPENAI_API_KEY)가 설정되지 않았습니다. Vercel Project Settings > Environment Variables에서 등록해 주세요.",
    });
  }

  try {
    const { promptType, studentName, riasecCode, targetJob, activities, userPrompt, gradeLevel, activityDomain, activityNameAndPeriod, studentSubmittedText, teacherObservationMemo } = req.body;

    let systemPrompt = "당신은 레디커리어 AI의 수석 커리어 멘토 '아리' 및 대입 생기부 자율/세특 설계 전문가입니다. 품격 있고 신뢰감 있는 문체로 답변하세요.";
    let prompt = userPrompt;

    if (promptType === "saengbu_guideline") {
      systemPrompt = SAENGBU_SYSTEM_PROMPT;
      prompt = `# Input Data\n- 대상 학년: ${gradeLevel || "고등학교 2학년"}\n- 활동 영역: ${activityDomain || "진로활동 및 창의적체험활동"}\n- 활동 명칭 및 기간: ${activityNameAndPeriod || "자기주도 진로 탐색 및 50일 알고리즘 습관 챌린지 (2026 1학기)"}\n- 학생 제출 자료(소감문/자기평가서): ${studentSubmittedText || `${targetJob || "AI 에듀테크 진로 멘토"}를 꿈꾸며 RIASEC ${riasecCode || "SI"} 성향의 진단을 통해 포트폴리오를 작성함.`}\n- 교사 관찰 메모(평가 키워드): ${teacherObservationMemo || "자기주도성, 뛰어난 분석력, 타인 배려 및 팀워크 역량, 학술적 탐구 의지 우수"}`;
    } else if (promptType === "vision_recommendation") {
      prompt = `[비전선언문 멘트 제안]\n지망 직업군: ${targetJob || "AI 융합 전문가"}\n해당 꿈을 지닌 중고교 학생에게 걸맞는 당찬 1문장 비전 선언문을 추천해 주십시오.`;
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt || "안녕, 진로 조언 부탁해!" },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await openAiResponse.json();
    if (!openAiResponse.ok) {
      throw new Error(data.error?.message || "OpenAI API 응답 실패");
    }

    const generatedContent = data.choices?.[0]?.message?.content;
    return res.status(200).json({ content: generatedContent, model: data.model || "gpt-4o-mini" });
  } catch (error) {
    console.error("Vercel AI Proxy Error:", error);
    return res.status(500).json({ error: error.message || "서버 통신 중 오류가 발생했습니다." });
  }
}
