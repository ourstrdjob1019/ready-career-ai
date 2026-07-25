import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, ProgressBar, MascotAri } from "../components";
import { Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface Question {
  id: number;
  category: string;
  question: string;
  hint?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "R (현실형) & I (탐구형)",
    question: "복잡한 과학적 현상이나 소프트웨어의 뼈대가 되는 원리를 해부해 보고 실험하는 일을 좋아하나요?",
    hint: "단순히 보는데 그치지 않고 왜 그런지 탐구하고 만들어보는 행동과 관련이 높아요!"
  },
  {
    id: 2,
    category: "A (예술형) & E (진취형)",
    question: "남들이 생각하지 못한 아이디어를 글, 그림, 기획서나 영상을 통해 새롭게 표현하여 매료시키고 싶나요?",
    hint: "유행을 리드하고 감수성과 커뮤니케이션 능력을 발휘하는 능력을 뜻합니다."
  },
  {
    id: 3,
    category: "S (사회형) & C (관습형)",
    question: "친구들의 고민을 진심으로 들어주고, 체계적인 규칙 속에서 갈등을 부드럽게 조정해 나가는 데 보람을 느끼나요?",
    hint: "공공의 복지와 교육, 조직의 조화와 정확한 프로세스 준수에 관한 성향이에요."
  },
  {
    id: 4,
    category: "AI 융합 미래 역량",
    question: "인공지능, 로봇공학, 데이터 분석 도구를 적극 활용하여 인류가 당면한 기후나 자원 문제를 해결하고 싶나요?",
    hint: "ReadyCareer AI가 가장 주목하는 융합적 미래 문제해결 잠재력 지수입니다!"
  }
];

export const InterestTest: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQ = QUESTIONS[currentIdx];

  const handleNext = () => {
    if (selectedScore !== null) {
      const newAnswers = { ...answers, [currentQ.id]: selectedScore };
      setAnswers(newAnswers);
      
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedScore(newAnswers[QUESTIONS[currentIdx + 1].id] || null);
      } else {
        // Test finished, redirect to result
        navigate("/test-result");
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedScore(answers[QUESTIONS[currentIdx - 1].id] || null);
    }
  };

  const scaleOptions = [
    { value: 1, label: "전혀 그렇지 않다", color: "hover:bg-error-container/40" },
    { value: 2, label: "그렇지 않은 편", color: "hover:bg-surface-container" },
    { value: 3, label: "보통이다", color: "hover:bg-primary/10" },
    { value: 4, label: "그런 편이다", color: "hover:bg-secondary/15" },
    { value: 5, label: "매우 그렇다!", color: "hover:bg-primary/25" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
      {/* Progress & Header */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-label-sm text-text-muted">
          <span className="font-headline font-bold text-primary flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-secondary-spot" />
            AI 진로 탐색 무대 (3D 진도)
          </span>
          <span className="font-bold text-base text-text-primary">
            {currentIdx + 1} / {QUESTIONS.length}
          </span>
        </div>
        <ProgressBar
          value={currentIdx + 1}
          max={QUESTIONS.length}
          variant="gradient"
          showLabel={false}
        />
      </div>

      {/* Main Question Card */}
      <Card variant="activity" padding="lg" className="w-full shadow-3d-ambient min-h-[400px] flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center self-start gap-2 bg-secondary/10 text-secondary px-4 py-1 rounded-full text-xs font-headline font-extrabold">
            {currentQ.category}
          </div>
          
          <h2 className="text-headline-md md:text-headline-lg font-headline font-bold text-text-primary leading-snug">
            {currentQ.question}
          </h2>

          {/* Scale Options */}
          <div className="flex flex-col gap-3 mt-4">
            {scaleOptions.map((opt) => {
              const isSelected = selectedScore === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedScore(opt.value)}
                  className={`w-full p-4 md:py-5 rounded-2xl border flex items-center justify-between font-headline transition-all duration-200 ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary font-extrabold shadow-3d-base translate-x-1"
                      : `bg-surface-container-low border-surface-variant/40 text-text-primary ${opt.color}`
                  }`}
                >
                  <span className="text-base md:text-lg pl-2">{opt.label}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    isSelected ? "bg-white text-primary border-white" : "border-text-muted/40"
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-surface-variant/30">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={currentIdx === 0 ? "opacity-40 pointer-events-none" : ""}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            이전
          </Button>

          <Button
            type="button"
            variant={selectedScore !== null ? "primary" : "secondary"}
            size="md"
            onClick={handleNext}
            disabled={selectedScore === null}
            className={selectedScore === null ? "opacity-50 pointer-events-none" : "px-8"}
          >
            {currentIdx === QUESTIONS.length - 1 ? "결과 보고서 생성" : "다음 질문"}
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </Card>

      {/* Ari AI Hint */}
      {currentQ.hint && (
        <MascotAri
          pose="avatar"
          size="sm"
          bubbleTitle="Ari's AI 분석 힌트"
          bubbleMessage={currentQ.hint}
          className="max-w-2xl mx-auto w-full"
        />
      )}
    </div>
  );
};
