/**
 * Vercel Serverless API Proxy for ReadyCareer AI
 * 클라이언트에 OpenAI / Gemini API 키를 노출하지 않는 보안 백엔드 엔드포인트 (/api/ai-proxy)
 * Vercel Dashboard 환경변수 설정: OPENAI_API_KEY 또는 GEMINI_API_KEY
 */

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
    const { promptType, studentName, riasecCode, targetJob, activities, userPrompt } = req.body;

    let prompt = userPrompt;
    if (promptType === "saengbu_guideline") {
      prompt = `[생기부 기재 가이드안 생성 요청]\n학생명: ${studentName || "김수진"}\n흥미코드: ${riasecCode || "SI"}\n꿈/지망직업: ${targetJob || "AI 진로 멘토"}\n활동기록:\n${(activities || []).map((a) => `- ${a}`).join("\n")}\n\n위 자산을 기반으로 교육부 생활기록부 작성 가이드를 따르는 고품격 학업/진로 세트 가이드안을 400자 내외로 작성해 주십시오.`;
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
          {
            role: "system",
            content: "당신은 레디커리어 AI의 수석 커리어 멘토 '아리' 및 대입 생기부 자율/세특 설계 전문가입니다. 품격 있고 신뢰감 있는 문체로 답변하세요.",
          },
          { role: "user", content: prompt || "안녕, 진로 조언 부탁해!" },
        ],
        temperature: 0.7,
        max_tokens: 600,
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
