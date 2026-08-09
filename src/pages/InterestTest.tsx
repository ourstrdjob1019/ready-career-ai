import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, MascotAri } from "../components";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";
import configData from "../data/assessment_config.json";

export const InterestTest: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0,
  });

  const questions = configData.items || [];
  const currentQ = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const handleSelect = (chosenType: string) => {
    const nextScores = { ...scores, [chosenType]: (scores[chosenType] || 0) + 1 };
    setScores(nextScores);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const sorted = Object.entries(nextScores).sort((a, b) => b[1] - a[1]);
      const topCode = `${sorted[0][0]}${sorted[1][0]}`;
      const primaryType = sorted[0][0];
      
      localStorage.setItem("riasec_result_scores", JSON.stringify(nextScores));
      localStorage.setItem("riasec_result_code", topCode);
      localStorage.setItem("riasec_primary", primaryType);
      
      navigate("/test-result");
    }
  };

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      
      {/* Top Header & Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary font-headline text-xs font-semibold tracking-tighter whitespace-nowrap border border-secondary/20 shadow-sm">
            <Brain className="w-4 h-4 text-secondary-spot flex-shrink-0" />
            <span>Holland RIASEC 실전 18문항 양자택일 진단</span>
          </span>
          <span className="text-xs font-headline font-semibold tracking-tighter text-text-muted whitespace-nowrap">
            문항 {currentIdx + 1} / {questions.length} ({progressPercent}%)
          </span>
        </div>

        <ProgressBar value={progressPercent} max={100} variant="teal" />
        <h1 className="text-2xl md:text-3xl font-headline font-semibold tracking-tighter text-text-primary leading-tight text-center pt-2">
          {currentQ.situation}
        </h1>
      </div>

      {/* Situation Image Illustration */}
      <div className="w-full h-52 md:h-64 rounded-3xl overflow-hidden shadow-3d-base relative bg-surface-container border border-surface-variant/40">
        <img
          src={currentQ.image}
          alt="상황 일러스트"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent flex items-end p-4">
          <span className="text-xs font-headline font-semibold tracking-tighter text-text-primary bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full border border-surface-variant/30 shadow-sm">
            🎨 터치하거나 좌우 버튼(A vs B)을 선택해 내 진행 성향을 발견해 보세요!
          </span>
        </div>
      </div>

      {/* FORCED-CHOICE PAIR COMPARISON CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        
        {/* Option A */}
        <button
          onClick={() => handleSelect(currentQ.options.A.type)}
          className="p-6 md:p-8 rounded-3xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-primary text-on-primary font-headline font-semibold tracking-tighter text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                A
              </span>
              <span className="text-[11px] font-semibold tracking-tighter text-primary px-2.5 py-0.5 rounded-full bg-primary/10 whitespace-nowrap">
                선택지 &larr; (좌 화살표)
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-semibold tracking-tighter text-text-primary leading-relaxed group-hover:text-primary transition-colors">
              "{currentQ.options.A.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-primary/20 flex items-center justify-between text-xs font-semibold tracking-tighter text-primary">
            <span>이 행동 방식을 선택</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Option B */}
        <button
          onClick={() => handleSelect(currentQ.options.B.type)}
          className="p-6 md:p-8 rounded-3xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-secondary text-white font-headline font-semibold tracking-tighter text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                B
              </span>
              <span className="text-[11px] font-semibold tracking-tighter text-secondary-spot px-2.5 py-0.5 rounded-full bg-secondary/10 whitespace-nowrap">
                (우 화살표) &rarr; 선택지
              </span>
            </div>
            <p className="text-base md:text-lg font-headline font-semibold tracking-tighter text-text-primary leading-relaxed group-hover:text-secondary transition-colors">
              "{currentQ.options.B.label}"
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-secondary/20 flex items-center justify-between text-xs font-semibold tracking-tighter text-secondary-spot">
            <span>이 생각 방식을 선택</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>

      {/* Footer Mascot Tip */}
      <div className="p-4 bg-surface-container-low rounded-3xl border border-surface-variant/40 flex items-center gap-4">
        <MascotAri pose="sticker" size="sm" rotate={false} />
        <div>
          <h4 className="text-xs font-headline font-semibold tracking-tighter text-text-primary">아리(Ari)의 검사 코칭 Tip</h4>
          <p className="text-xs text-text-muted">
            정답이나 더 좋은 성격은 없어요! 조별과제나 첨단 기기를 다룰 때 본능적으로 가장 마음이 편한 선택을 터치해 주시면 가장 정확한 커리어 클러스터가 생성됩니다.
          </p>
        </div>
      </div>

    </div>
  );
};

export default InterestTest;
