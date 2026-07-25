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
}

export interface AiResponseResult {
  success: boolean;
  content: string;
  provider: "vercel-serverless" | "client-env-direct" | "expo-demo-fallback";
  model?: string;
}

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
            {
              role: "system",
              content:
                "당신은 레디커리어 AI의 진로 멘토 '아리' 및 학교생활기록부 대입 전문가입니다. 대한민국 교육부 생기부 기재 요령을 준수하며 사설 명칭이나 교외 수상 실적을 배제한 세특 가이드안과 꿈을 주는 커리어 멘트를 작성합니다.",
            },
            { role: "user", content: promptText },
          ],
          temperature: 0.7,
          max_tokens: 600,
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

// 프롬프트 빌더 Helper
function buildPromptText(payload: AiRequestPayload): string {
  if (payload.promptType === "saengbu_guideline") {
    return `[생기부 가이드안 추출 요청]
학생 실명: ${payload.studentName || "김수진"}
흥미 유형: ${payload.riasecCode || "SI"}
목표 꿈/직업: ${payload.targetJob || "AI 에듀테크 진로 멘토"}
누적 활동 및 포트폴리오 요약:
${(payload.activities || []).map((a) => `- ${a}`).join("\n")}

위 내용을 토대로 학교생활기록부 '진로활동 및 행특'에 직접 참고할 수 있는 400자 내외의 품격 있고 학업 역량이 드러나는 세부능력 및 특기사항 예시본 가이드안을 작성해 줘.`;
  }

  if (payload.promptType === "vision_recommendation") {
    return `[비전 선언문 추천 요청]
지망 꿈: ${payload.targetJob || "AI 융합 개척자"}
이 학생에게 어울리는 힘 있는 한 문장의 비전선언문을 3가지 추천해 줘.`;
  }

  return payload.userPrompt || "학생 진로에 대한 AI 멘토 코멘트를 생성해 주세요.";
}

// 1초 박람회 고품질 모의 텍스트 생성 Helper
function getExpoFallbackContent(payload: AiRequestPayload): string {
  if (payload.promptType === "saengbu_guideline") {
    return `[진로 및 역량 탐구 영역] ${payload.targetJob || "스마트 AI 에듀테크 진로 멘토"}를 향한 확고한 꿈을 바탕으로, 매주 꾸준히 50일 습관 챌린지를 완수하고 논리적 탐구 프로젝트를 진행함. 특히 6유형 RIASEC 진단에서 ${payload.riasecCode || "SI"} 성향의 탁월한 강점을 바탕으로, 학교 생활 및 동아리 과제 수행 과정에서 복잡한 문제 해결 능력과 타인을 배려하는 소통의 포용력을 드러냄. 자기 주도적으로 도서를 읽고 실무 보고서 포트폴리오를 작성하며 학급 전체의 진로 분위기를 드높인 모범적인 학생임.`;
  }

  if (payload.promptType === "vision_recommendation") {
    return `"${payload.targetJob || "AI 융합 전문가"}의 꿈을 품고, 첨단 데이터 지식과 따뜻한 인간 중심의 공감 능력으로 사회적 혁신을 실현하는 실전파 리더!"`;
  }

  return "✨ 아리가 분석한 결과, 회원님은 미래 진로에서 누구보다 주도적인 성취를 거둘 준비가 끝난 최고 역량 보유자입니다!";
}
