import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { GM_QUESTIONS, GM_DOMAINS, GM_LEVELS, GM_ORDER } from "../../data/growthMindsetData";

// 랜덤 캐릭터 멘토 셔플
const shuffleArray = (array: any[]) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LIKERT_OPTIONS = [
  { value: 5, label: "이거 완전 내 얘기야! 🚀", bg: "bg-emerald-500", text: "text-[#000000]", border: "border-transparent", hover: "hover:bg-emerald-600 shadow-lg shadow-emerald-200", width: "w-full" },
  { value: 1, label: "아직은 좀 어려워 😅", bg: "bg-white", text: "text-[#555555]", border: "border-slate-200", hover: "hover:bg-slate-50 hover:border-slate-400 shadow-sm", width: "w-[90%]" },
];

export const GrowthMindsetTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(GM_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<any>(null);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < GM_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, GM_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < GM_QUESTIONS.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        processResults(newAnswers);
      }
    }, 400);
  };

  const processResults = (finalAnswers: number[]) => {
    setCurrentView("calculating");

    const sum: any = {};
    const cnt: any = {};
    GM_ORDER.forEach((k: string) => {
      sum[k] = 0;
      cnt[k] = 0;
    });

    GM_QUESTIONS.forEach((q, i) => {
      // Reverse scoring is applied in HTML: q.r ? 6 - answers[i] : answers[i]
      const v = q.r ? 6 - finalAnswers[i] : finalAnswers[i];
      sum[q.d] += v;
      cnt[q.d]++;
    });

    const pct: any = {};
    GM_ORDER.forEach((k: string) => {
      pct[k] = Math.round(((sum[k] - cnt[k]) / (cnt[k] * 4)) * 100);
    });

    setLastScores(pct);

    setTimeout(() => {
      const avg = Math.round(GM_ORDER.reduce((a, k) => a + pct[k], 0) / GM_ORDER.length);
      const lv = GM_LEVELS.find((x: any) => avg >= x.min && avg <= x.max) || GM_LEVELS[0];
      
      const rank = [...GM_ORDER].sort((a, b) => pct[b] - pct[a] || GM_ORDER.indexOf(a) - GM_ORDER.indexOf(b));

      setOverallAvg(avg);
      setCurrentLevel(lv);
      setFinalRank(rank);
      setCurrentView("result");
      
      // Update diagnostic status in localStorage
      const saved = localStorage.getItem("readycareer_6_diagnostics_v1");
      if (saved) {
        try {
          let tests = JSON.parse(saved);
          tests = tests.map((t: any) => {
            if (t.id === "test-growth-mindset") {
              return {
                ...t,
                status: "completed",
                resultType: lv.title,
                scoreSummary: `마인드셋 지수: ${avg}점`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[성장 마인드셋 프로파일] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / GM_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-[#102135] flex items-center justify-center p-6">
        <div className="bg-white rounded-none p-10 max-w-sm w-full text-center shadow-[0_0_12px_rgba(35,48,59,0.25)] border border-[#dddddd]">
          <div className="w-20 h-20 bg-[#f8f8f8] rounded-none mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-2xl font-black text-[#000000] mb-3 tracking-tight">마인드셋<br/>지수 계산 중!</h2>
          <p className="text-sm text-[#707070] font-medium leading-relaxed">능력에 대한 믿음부터<br/>도전과 피드백 수용도까지 분석합니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const strong = finalRank[0];
    const low = finalRank[finalRank.length - 1];

    const lowTitleMap: any = {
      BELIEF: '결과를 내 능력 전체로 단정하는 습관',
      CHALLENGE: '실패 가능성이 보이면 시도를 줄이는 습관',
      STRATEGY: '막힐 때 방법보다 노력량만 늘리는 습관',
      FEEDBACK: '틀림과 피드백을 평가처럼 받아들이는 습관'
    };
    const lowTitle = lowTitleMap[low];

    const strongDomain = (GM_DOMAINS as any)[strong];
    const lowDomain = (GM_DOMAINS as any)[low];

    return (
      <div className="min-h-screen bg-[#102135] pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-none p-7 shadow-sm border border-emerald-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-xs rounded-full mb-4">
              나의 성장 마인드셋 상태
            </div>
            <h1 className="text-2xl font-black text-[#000000] mb-3">{currentLevel?.title}</h1>
            <p className="text-sm text-[#555555] leading-relaxed mb-6">{currentLevel?.summary}</p>
            
            <div className="flex items-end justify-center gap-2 mt-4">
              <div className="text-5xl font-black text-emerald-600 leading-none">{overallAvg}</div>
              <div className="text-sm font-bold text-[#707070] pb-1">/ 100 · 마인드셋 지수</div>
            </div>
          </div>

          <div className="bg-white rounded-none p-7 shadow-[0_0_12px_rgba(35,48,59,0.25)] border border-[#dddddd]">
            <h3 className="font-black text-[#000000] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              나의 4가지 성장 반응
            </h3>
            <p className="text-xs text-[#707070] mb-5 leading-relaxed">점수는 또래 백분위가 아니라 이번 응답을 100점 기준으로 환산한 자기보고형 프로파일입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (GM_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-black text-[#000000] shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2 bg-[#12273d] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" style={{ width: `${lastScores[k]}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs font-black text-[#707070]">{lastScores[k]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-none p-7 shadow-[0_0_12px_rgba(35,48,59,0.25)] border border-[#dddddd]">
            <h3 className="font-black text-[#000000] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              지금 잘하고 있는 것과 가장 먼저 바꿀 것
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#f8f8f8] rounded-none border border-[#dddddd] p-4">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-black text-emerald-800 mb-2">강점 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-emerald-700">{strongDomain.strong}</div>
              </div>
              <div className="bg-[#f8f8f8] rounded-none border border-[#dddddd] p-4">
                <div className="text-2xl mb-1">{lowDomain.icon}</div>
                <div className="text-xs font-black text-[#000000] mb-2">NEXT · {lowDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-[#707070]">{lowDomain.change}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f8f8f8] rounded-none p-7 shadow-[0_0_12px_rgba(35,48,59,0.25)] border border-[#dddddd]">
            <h3 className="font-black text-[#000000] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              지금 변해야 할 점
            </h3>
            <div className="bg-white rounded-none p-5 border border-orange-200 shadow-sm">
              <div className="text-[10px] font-black text-orange-600 mb-2">가장 먼저 바꿔볼 반응</div>
              <h4 className="text-base font-black text-[#000000] mb-2">{lowTitle}</h4>
              <p className="text-xs text-[#555555] leading-relaxed">{lowDomain.change}</p>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-none p-7 shadow-lg">
            <h2 className="text-lg font-black text-[#000000] mb-2 text-center">
              🎯 이번 주에 딱 하나
            </h2>
            <p className="text-emerald-50 text-sm text-center mb-6 leading-relaxed">
              {lowDomain.mission}
            </p>
            <button
              onClick={() => navigate("/self-understanding")}
              className="w-full bg-[#102135] text-[#40e2de] font-black py-4 rounded-none hover:bg-[#0c1a29] border border-[#40e2de] transition-colors"
            >
              진단 센터로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = GM_QUESTIONS[qIndex];
  const typeInfo = (GM_DOMAINS as any)[currentQ.d];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#102135] flex flex-col">
      <header className="sticky top-0 z-20 bg-[#0c1a29]/90 backdrop-blur-md border-b border-[#244161] px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-black text-[#d7dfe6] tracking-tight">성장 마인드셋 프로파일</div>
          <div className="text-xs font-black text-[#d7dfe6] bg-[#12273d] px-3 py-1 rounded-full">
            {qIndex + 1} / {GM_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-2 bg-[#12273d] rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-[#40e2de] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-8 relative flex flex-col items-center">
          <div className="w-full bg-white rounded-none p-6 pt-16 mt-12 border-t-4 border-[#40e2de] relative text-center shadow-[0_0_12px_rgba(35,48,59,0.25)]">
            <img src={hero.defaultImageUrl} alt="mentor" className="w-28 h-28 object-contain drop-shadow-xl absolute -top-14 left-1/2 -translate-x-1/2" />
            <span className="text-[11px] font-black text-[#40e2de] bg-[#f8f8f8] px-3 py-1 rounded-full mb-3 inline-block">
              {typeInfo.name} 마인드셋
            </span>
            <p className="text-xl font-black text-[#000000] leading-tight break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3 w-full">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={`${opt.width} p-5 rounded-[20px] border-2 font-black text-base transition-all flex items-center justify-between px-6 ${opt.bg} ${opt.text} ${opt.border} ${opt.hover} ${isSelected ? 'ring-4 ring-emerald-300 ring-offset-2 scale-[1.02]' : ''}`}
              >
                <span>{opt.label}</span>
                <span className="text-xl opacity-50">›</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
