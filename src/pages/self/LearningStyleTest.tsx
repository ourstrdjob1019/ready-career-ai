import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, MascotAri, Card, Button } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface Question {
  id: string;
  situation: string;
  image: string;
  options: {
    A: { label: string; trait: string; styleName: string };
    B: { label: string; trait: string; styleName: string };
  };
}

const QUESTIONS: Question[] = [
  {
    id: "learn-1",
    situation: "시험이나 수행평가를 앞두고 낯선 암기 내용을 머릿속에 확실히 정리할 때 나만의 노하우는?",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "형형색색의 형광펜, 마인드맵 표, 다이어그램 시각 자료로 눈에 확실히 찍어둔다.", trait: "visual", styleName: "시각적 구조화 학습자" },
      B: { label: "소리 내어 읽어보거나 친구와 서로 문제를 내며 말하고 토론하면서 이해한다.", trait: "auditory", styleName: "청각·토론 대화 학습자" },
    },
  },
  {
    id: "learn-2",
    situation: "하루 공부 계획을 세울 때 나에게 더 효율적인 시간 관리 스타일은 무엇인가요?",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "45분 빡빡한 집중 후 10분 휴식 등 스톱워치로 시간을 정밀하게 쪼개서 실행한다.", trait: "timer", styleName: "분할 몰입 타이머 전략" },
      B: { label: "시간에 얽매이지 않고 한 과목이나 퀘스트의 끝장을 볼 때까지 쭉 이어서 달린다.", trait: "flow", styleName: "장시간 과제 끝장 몰입형" },
    },
  },
  {
    id: "learn-3",
    situation: "어려운 수학 개념이나 고단계 탐구 과목의 개념 원리를 습득할 때 편한 접근 방식은?",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "핵심 공식과 교재 기본 개념부터 완벽히 암기 및 정독한 후 기출 문제를 푼다.", trait: "deductive", styleName: "개념 선행 정독형" },
      B: { label: "일단 문제부터 부딪히며 해설과 거꾸로 비교해 실전에서 적용 방식을 익힌다.", trait: "inductive", styleName: "실전 문제 해결 귀납형" },
    },
  },
  {
    id: "learn-4",
    situation: "자기주도 동아리 활동 보고서를 작성하거나 수행평가 보고서를 제출해야 할 때?",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "제출 기한 며칠 전부터 명확한 목차를 짜고 계획대로 나누어 차근차근 마감한다.", trait: "planned", styleName: "계획 실천 주도형" },
      B: { label: "마감 직전 최고의 영감과 엄청난 에너지가 샘솟을 때 한 번에 집중해 완결시킨다.", trait: "spontaneous", styleName: "탄력적 고밀도 몰입형" },
    },
  },
];

export const LearningStyleTest: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment } = useSelfUnderstanding();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [styles, setStyles] = useState<Record<string, number>>({});
  const [styleNames, setStyleNames] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<{ styleName: string; score: number; summary: string } | null>(null);

  const currentQ = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  const handleSelect = (trait: string, styleName: string) => {
    const nextStyles = { ...styles, [trait]: (styles[trait] || 0) + 1 };
    const nextStyleNames = { ...styleNames, [trait]: styleName };
    setStyles(nextStyles);
    setStyleNames(nextStyleNames);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finish
      const sorted = Object.entries(nextStyles).sort((a, b) => b[1] - a[1]);
      const topKey = sorted[0]?.[0] || "visual";
      const topName = nextStyleNames[topKey] || "시각적 구조화 학습자";

      const score = Math.floor(90 + Math.random() * 10);
      const summary = `학습 스타일 진단 완료: [${topName}] 루틴이 가장 최적화되어 있으며, 자기주도 학습 세특 항목에서 뛰어난 집중 효율을 기록합니다.`;

      completeAssessment("test-learning", score, summary);
      setResultData({ styleName: topName, score, summary });
      setIsFinished(true);
    }
  };

  if (isFinished && resultData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-4 py-1 rounded-full text-xs font-headline font-black">
            <BookOpen className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
            <span>메모리 & 집중력 최적화 학습 스타일 진단 완수</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-black text-text-primary tracking-tight">
            회원님의 학습 스타일은 <span className="text-transparent bg-clip-text gradient-hero-card">[{resultData.styleName}]</span> 입니다!
          </h1>
          <p className="text-xs md:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            {resultData.summary}
          </p>
        </div>

        <Card variant="hero" padding="lg" className="shadow-3d-ambient bg-gradient-to-br from-primary/10 via-surface-container to-white border-2 border-primary/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <MascotAri pose="celebrate" size="md" rotate={true} />
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-headline font-black text-text-primary">
                🏆 3단계 학습스타일 검사 완료! (집중 효율 상위 10%)
              </h3>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body-md">
                이제 필수 3종 진단이 모두 완료되었다면 종합 분석 기반 직업 선택 창이 100% 열립니다.<br />
                하단의 <strong>[리포트 마이페이지에 저장하고 허브로 복귀]</strong>를 눌러 완료된 3종 종합 창을 확인해 보세요!
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            variant="teal"
            size="lg"
            onClick={() => {
              // 마이페이지 실천 기록부에 활동 저장
              const existingActs = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
              const newAct = {
                id: "act-learn-" + Date.now(),
                title: `[자기이해 진단 3/3] 메모리 최적화 학습스타일 완수 (${resultData.styleName})`,
                category: "자기이해 진단",
                exp: "+50 EXP",
                date: new Date().toLocaleDateString("ko-KR"),
                reflection: resultData.summary
              };
              localStorage.setItem("readycareer_student_activities_v1", JSON.stringify([newAct, ...existingActs]));

              navigate("/self-understanding?onboarding=true");
            }}
            icon={<ArrowRight className="w-5 h-5 flex-shrink-0" />}
            className="font-headline font-extrabold px-8 py-5 shadow-2xl hover:scale-105 transition-transform text-base whitespace-nowrap"
          >
            💾 리포트 마이페이지에 최종 저장하고, 진단 3종 선택 허브로 이동 &rarr;
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fadeIn">
      {/* Top Header & Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-headline text-xs font-black whitespace-nowrap border border-primary/20">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>메모리 & 집중력 최적화 학습 스타일 진단</span>
          </span>
          <span className="text-xs font-headline font-black text-text-muted whitespace-nowrap">
            문항 {currentIdx + 1} / {QUESTIONS.length} ({progressPercent}%)
          </span>
        </div>

        <ProgressBar value={progressPercent} max={100} variant="teal" />
        <h1 className="text-2xl md:text-3xl font-headline font-black text-text-primary leading-tight text-center pt-2">
          {currentQ.situation}
        </h1>
      </div>

      {/* Situation Image Illustration */}
      <div className="w-full h-52 md:h-64 rounded-3xl overflow-hidden shadow-sm relative bg-surface-container border border-surface-variant/40">
        <img
          src={currentQ.image}
          alt="상황 일러스트"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1626]/90 via-transparent to-transparent flex items-end p-4">
          <span className="text-xs font-headline font-extrabold text-white bg-[#006970]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm whitespace-nowrap">
            💡 억지 정답은 ZERO! 내가 평소에 공부할 때 마음이 편했던 스타일을 선택해 주세요!
          </span>
        </div>
      </div>

      {/* FORCED-CHOICE PAIR COMPARISON CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Option A */}
        <button
          onClick={() => handleSelect(currentQ.options.A.trait, currentQ.options.A.styleName)}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary-fixed/30 to-surface-container-low hover:from-primary/20 hover:to-surface-container border-2 border-primary/40 hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-primary text-on-primary font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                A
              </span>
              <span className="text-[11px] font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 whitespace-nowrap">
                {currentQ.options.A.styleName}
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-extrabold text-text-primary leading-relaxed group-hover:text-primary transition-colors">
              "{currentQ.options.A.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-primary/20 flex items-center justify-between text-xs font-black text-primary">
            <span>이 학습 방식 선택</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Option B */}
        <button
          onClick={() => handleSelect(currentQ.options.B.trait, currentQ.options.B.styleName)}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-secondary-fixed/30 to-surface-container-low hover:from-secondary/20 hover:to-surface-container border-2 border-secondary/40 hover:border-secondary shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-secondary text-white font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                B
              </span>
              <span className="text-[11px] font-extrabold text-secondary-spot px-2.5 py-0.5 rounded-full bg-secondary/10 whitespace-nowrap">
                {currentQ.options.B.styleName}
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-extrabold text-text-primary leading-relaxed group-hover:text-secondary transition-colors">
              "{currentQ.options.B.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-secondary/20 flex items-center justify-between text-xs font-black text-secondary-spot">
            <span>이 학습 방식 선택</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Footer Mascot Tip */}
      <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-variant/40 flex items-center gap-4 shadow-sm">
        <MascotAri pose="sticker" size="sm" rotate={false} />
        <div className="space-y-1">
          <h4 className="text-xs font-headline font-extrabold text-text-primary flex items-center gap-1.5">
            <span>아리(Ari)의 맞춤 공부법 팁</span>
            <span className="text-[10px] bg-[#006970] text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">학업 역량</span>
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            학습 스타일 검사를 통해 본인에게 잘 맞는 '공간적 필기 루틴'과 '집중 주기'를 확인하면 생활기록부 학업역량 세부능력 평가 시 구체적 모범사례로 제시할 수 있어요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningStyleTest;
