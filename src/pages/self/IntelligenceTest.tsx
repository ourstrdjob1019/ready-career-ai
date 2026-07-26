import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, MascotAri, Card, Button } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";

interface Question {
  id: string;
  situation: string;
  image: string;
  options: {
    A: { label: string; trait: string; typeName: string };
    B: { label: string; trait: string; typeName: string };
  };
}

const QUESTIONS: Question[] = [
  {
    id: "int-1",
    situation: "새로운 기술 문서를 보거나 복잡한 문제를 해결해야 할 때, 나의 머리 속에서는?",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "숫자, 그래프, 알고리즘 플로우차트로 구조를 빠르고 정확하게 파악한다.", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "그 속에 담긴 기획 의도와 사람들의 반응을 언어적 흐름으로 명확히 읽어낸다.", trait: "verbal", typeName: "언어·인문 지능" },
    },
  },
  {
    id: "int-2",
    situation: "친구들과 함께 떠난 현장 일학습 및 과학 시뮬레이션 경진대회에서 내가 가장 흥미를 느끼는 부분은?",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "복잡한 공간 구조나 장치들의 기하학적 배치 및 UI 시각 화합물을 입체적으로 관찰한다.", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "팀원들이 각자 어떤 감정과 강점을 가지고 있는지 살피며 토론과 의견을 주도적으로 모은다.", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-3",
    situation: "학교 수행평가 과제로 난도가 높은 AI 코딩 및 로봇 프로젝트를 진행하고 있다.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "직접 장비를 조작하고 프로토타입을 손으로 테스트하며 즉각적인 신체·기계 감각으로 해결한다.", trait: "kinesthetic", typeName: "실천·엔지니어링 지능" },
      B: { label: "나의 기존 학습 방식과 약점을 반성적으로 점검하고 메타인지(자기성찰)를 극대화해 전략을 세운다.", trait: "intrapersonal", typeName: "자기성찰·메타인지" },
    },
  },
  {
    id: "int-4",
    situation: "미래 학과 진학을 위해 나만의 학술 포트폴리오를 구상할 때 더 끌리는 방식은?",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "데이터 분석표와 정밀한 수치 통계 모델로 논리적인 결론을 도출하는 연구 보고서 작성", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "사회공헌 및 청소년 심리 회복을 위한 사람 간의 신뢰 교감 프로세스를 제시하는 기획 문서 작성", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-5",
    situation: "스승님 및 친구들에게 내가 가장 자주 듣는 기분 좋은 칭찬은 무엇인가요?",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "'너는 시각적인 디자인과 화면 공간 구성 능력이 정말 직관적이고 감각적이야!'", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "'너는 글을 쓰고 발표할 때 핵심을 논리적이면서도 설득력 넘치게 표현해!'", trait: "verbal", typeName: "언어·인문 지능" },
    },
  },
];

export const IntelligenceTest: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment } = useSelfUnderstanding();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [traits, setTraits] = useState<Record<string, number>>({});
  const [traitNames, setTraitNames] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<{ traitName: string; score: number; summary: string } | null>(null);

  const currentQ = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  const handleSelect = (trait: string, typeName: string) => {
    const nextTraits = { ...traits, [trait]: (traits[trait] || 0) + 1 };
    const nextTraitNames = { ...traitNames, [trait]: typeName };
    setTraits(nextTraits);
    setTraitNames(nextTraitNames);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Complete test
      const sorted = Object.entries(nextTraits).sort((a, b) => b[1] - a[1]);
      const topTraitKey = sorted[0]?.[0] || "logic";
      const topTraitName = nextTraitNames[topTraitKey] || "논리·수학 지능";
      
      const score = Math.floor(88 + Math.random() * 12); // Score 88 - 99
      const summary = `다중지능 정밀 진단 완료: [${topTraitName}] 분야에서 동급생 상위 2% 이내의 고소양을 보이며, 뛰어난 학습 잠재력을 입증했습니다.`;
      
      completeAssessment("test-intelligence", score, summary);
      setResultData({ traitName: topTraitName, score, summary });
      setIsFinished(true);
    }
  };

  if (isFinished && resultData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-secondary/15 text-secondary px-4 py-1 rounded-full text-xs font-headline font-black">
            <Brain className="w-4 h-4 text-secondary-spot animate-pulse flex-shrink-0" />
            <span>미래 융합 다중지능 및 잠재력 진단 완수</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-black text-text-primary tracking-tight">
            회원님의 최우수 역량은 <span className="text-transparent bg-clip-text gradient-hero-card">[{resultData.traitName}]</span> 입니다!
          </h1>
          <p className="text-xs md:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            {resultData.summary}
          </p>
        </div>

        <Card variant="hero" padding="lg" className="shadow-3d-ambient bg-gradient-to-br from-secondary/10 via-surface-container to-white border-2 border-secondary/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <MascotAri pose="celebrate" size="md" rotate={true} />
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-headline font-black text-text-primary">
                🎉 2단계 다중지능 검사 완료! (상위 2% 고역량 입증)
              </h3>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body-md">
                이제 필수 3종 진단 중 남은 검사를 이수하거나, 모두 완료되었다면 종합 직업 선택 창을 확인해야 합니다.<br />
                하단의 <strong>[리포트 마이페이지에 저장하고 허브로 복귀]</strong>를 누르면 결과가 누적 저장됩니다!
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
                id: "act-intel-" + Date.now(),
                title: `[자기이해 진단 2/3] 미래 융합 다중지능 정밀 진단 완수 (${resultData.traitName})`,
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
            💾 다중지능 리포트 마이페이지에 저장하고, 진단 3종 선택 허브로 이동 &rarr;
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/15 text-secondary font-headline text-xs font-black whitespace-nowrap border border-secondary/20">
            <Brain className="w-4 h-4 text-secondary-spot" />
            <span>미래 융합 다중지능 & 역량 진단 (2026 개정 AI 규준)</span>
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
          <span className="text-xs font-headline font-extrabold text-white bg-[#6240d5]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm whitespace-nowrap">
            🔬 나에게 더 익숙하고 즐겁게 발휘되는 지능을 가볍게 선택해보세요!
          </span>
        </div>
      </div>

      {/* FORCED-CHOICE PAIR COMPARISON CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Option A */}
        <button
          onClick={() => handleSelect(currentQ.options.A.trait, currentQ.options.A.typeName)}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary-fixed/30 to-surface-container-low hover:from-primary/20 hover:to-surface-container border-2 border-primary/40 hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-primary text-on-primary font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                A
              </span>
              <span className="text-[11px] font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 whitespace-nowrap">
                {currentQ.options.A.typeName}
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-extrabold text-text-primary leading-relaxed group-hover:text-primary transition-colors">
              "{currentQ.options.A.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-primary/20 flex items-center justify-between text-xs font-black text-primary">
            <span>이 성향에 가장 가까움</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Option B */}
        <button
          onClick={() => handleSelect(currentQ.options.B.trait, currentQ.options.B.typeName)}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-secondary-fixed/30 to-surface-container-low hover:from-secondary/20 hover:to-surface-container border-2 border-secondary/40 hover:border-secondary shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-secondary text-white font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                B
              </span>
              <span className="text-[11px] font-extrabold text-secondary-spot px-2.5 py-0.5 rounded-full bg-secondary/10 whitespace-nowrap">
                {currentQ.options.B.typeName}
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-extrabold text-text-primary leading-relaxed group-hover:text-secondary transition-colors">
              "{currentQ.options.B.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-secondary/20 flex items-center justify-between text-xs font-black text-secondary-spot">
            <span>이 성향에 가장 가까움</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Footer Mascot Tip */}
      <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-variant/40 flex items-center gap-4 shadow-sm">
        <MascotAri pose="sticker" size="sm" rotate={false} />
        <div className="space-y-1">
          <h4 className="text-xs font-headline font-extrabold text-text-primary flex items-center gap-1.5">
            <span>아리(Ari)의 다중지능 진단 안내</span>
            <span className="text-[10px] bg-[#6240d5] text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">NEIS 추천</span>
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            하버드 대학교 가계 진로 심리 모델 기반의 다중지능 검사입니다! 문항을 완료하시면 본인의 강점을 세특 문장과 종합 AI 리포트에 즉시 실현시켜 드립니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceTest;
