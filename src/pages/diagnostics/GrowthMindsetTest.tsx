import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "매우 그렇다" },
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
                scoreSummary: \`마인드셋 지수: \${avg}점\`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / GM_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">마인드셋<br/>지수 계산 중!</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">능력에 대한 믿음부터<br/>도전과 피드백 수용도까지 분석합니다...</p>
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
      <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-emerald-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-xs rounded-full mb-4">
              나의 성장 마인드셋 상태
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-3">{currentLevel?.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{currentLevel?.summary}</p>
            
            <div className="flex items-end justify-center gap-2 mt-4">
              <div className="text-5xl font-black text-emerald-600 leading-none">{overallAvg}</div>
              <div className="text-sm font-bold text-slate-400 pb-1">/ 100 · 마인드셋 지수</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              나의 4가지 성장 반응
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">점수는 또래 백분위가 아니라 이번 응답을 100점 기준으로 환산한 자기보고형 프로파일입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (GM_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-black text-slate-700 shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" style={{ width: \`\${lastScores[k]}%\` }} />
                    </div>
                    <div className="w-8 text-right text-xs font-black text-slate-500">{lastScores[k]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              지금 잘하고 있는 것과 가장 먼저 바꿀 것
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-black text-emerald-800 mb-2">강점 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-emerald-700">{strongDomain.strong}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="text-2xl mb-1">{lowDomain.icon}</div>
                <div className="text-xs font-black text-slate-700 mb-2">NEXT · {lowDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-slate-500">{lowDomain.change}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50/50 rounded-3xl p-7 shadow-sm border border-orange-100/60">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              지금 변해야 할 점
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm">
              <div className="text-[10px] font-black text-orange-600 mb-2">가장 먼저 바꿔볼 반응</div>
              <h4 className="text-base font-black text-slate-800 mb-2">{lowTitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{lowDomain.change}</p>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-7 shadow-lg">
            <h2 className="text-lg font-black text-white mb-2 text-center">
              🎯 이번 주에 딱 하나
            </h2>
            <p className="text-emerald-50 text-sm text-center mb-6 leading-relaxed">
              {lowDomain.mission}
            </p>
            <button
              onClick={() => navigate("/self-understanding")}
              className="w-full bg-white text-emerald-600 font-black py-4 rounded-2xl hover:bg-emerald-50 transition-colors shadow-sm"
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
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-black text-slate-800 tracking-tight">성장 마인드셋 프로파일</div>
          <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {qIndex + 1} / {GM_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: \`\${progress}%\` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-8 relative flex flex-col items-center">
          <img src={hero.defaultImageUrl} alt="mentor" className="w-32 h-32 object-contain drop-shadow-xl z-10" />
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm relative -mt-4 w-full text-center">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-2 inline-block">
              {typeInfo.name} 태도
            </span>
            <p className="text-base font-bold text-slate-800 leading-snug break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={\`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-between \${
                  isSelected 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md transform scale-[1.02]" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-slate-50"
                }\`}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="text-emerald-500 font-black">✓</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
