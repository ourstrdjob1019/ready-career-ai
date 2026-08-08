import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { TM_QUESTIONS, TM_DOMAINS, TM_LEVELS, TM_ORDER } from "../../data/timeManagementData";

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
  { value: 5, label: "네, 완전 공감해요! 👍", color: "indigo" },
  { value: 1, label: "아니요, 저랑은 안 맞아요 🙅", color: "rose" },
];

export const TimeManagementTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(TM_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<any>(null);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < TM_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, TM_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < TM_QUESTIONS.length - 1) {
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
    TM_ORDER.forEach((k: string) => {
      sum[k] = 0;
      cnt[k] = 0;
    });

    TM_QUESTIONS.forEach((q: any, i: number) => {
      const v = q.r ? 6 - finalAnswers[i] : finalAnswers[i];
      sum[q.d] += v;
      cnt[q.d]++;
    });

    const pct: any = {};
    TM_ORDER.forEach((k: string) => {
      pct[k] = Math.round(((sum[k] - cnt[k]) / (cnt[k] * 4)) * 100);
    });

    setLastScores(pct);

    setTimeout(() => {
      const avg = Math.round(TM_ORDER.reduce((a, k) => a + pct[k], 0) / TM_ORDER.length);
      const lv = TM_LEVELS.find((x: any) => avg >= x.min && avg <= x.max) || TM_LEVELS[0];
      
      const rank = [...TM_ORDER].sort((a, b) => pct[b] - pct[a] || TM_ORDER.indexOf(a) - TM_ORDER.indexOf(b));

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
            if (t.id === "test-time-management") {
              return {
                ...t,
                status: "completed",
                resultType: lv.title,
                scoreSummary: `시간관리 지수: ${avg}점`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[시간관리 역량 프로파일] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / TM_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">시간관리 역량<br/>분석 중!</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">시간이 어디에서 새고 있는지<br/>우선순위부터 점검까지 분석합니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const strong = finalRank[0];
    const low = finalRank[finalRank.length - 1];

    const strongDomain = (TM_DOMAINS as any)[strong];
    const lowDomain = (TM_DOMAINS as any)[low];

    return (
      <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-amber-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-600 font-black text-xs rounded-full mb-4">
              나의 시간관리 상태
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-3">{currentLevel?.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{currentLevel?.summary}</p>
            
            <div className="flex items-end justify-center gap-2 mt-4">
              <div className="text-5xl font-black text-amber-600 leading-none">{overallAvg}</div>
              <div className="text-sm font-bold text-slate-400 pb-1">/ 100 · 시간관리 지수</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              나의 4가지 시간관리 역량
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">점수는 또래 백분위가 아니라 이번 응답을 100점 기준으로 환산한 자기보고형 프로파일입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (TM_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-black text-slate-700 shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" style={{ width: `${lastScores[k]}%` }} />
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
              잘 쓰는 힘과 가장 먼저 바꿀 것
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-black text-amber-800 mb-2">강점 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-amber-700">{strongDomain.strong}</div>
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
              내 시간이 가장 많이 새는 지점
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm">
              <div className="text-[10px] font-black text-orange-600 mb-2">{lowDomain.icon} {lowDomain.name}</div>
              <h4 className="text-base font-black text-slate-800 mb-2">{lowDomain.leak}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{lowDomain.change}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              할 일을 실제 행동으로 바꾸는 4단계
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 bg-slate-50 rounded-2xl p-4">
                <div className="text-indigo-600 font-black">1. 꺼내기</div>
                <div className="text-xs text-slate-600 leading-relaxed">머릿속에서 기억하려 하지 말고 해야 할 일을 한곳에 적기</div>
              </div>
              <div className="flex gap-3 bg-slate-50 rounded-2xl p-4">
                <div className="text-indigo-600 font-black">2. 명확히</div>
                <div className="text-xs text-slate-600 leading-relaxed">‘준비하기’가 아니라 바로 할 수 있는 다음 행동으로 바꾸기</div>
              </div>
              <div className="flex gap-3 bg-slate-50 rounded-2xl p-4">
                <div className="text-indigo-600 font-black">3. 배치하기</div>
                <div className="text-xs text-slate-600 leading-relaxed">중요한 일은 마감일만 적지 말고 실제 시간을 먼저 확보하기</div>
              </div>
              <div className="flex gap-3 bg-slate-50 rounded-2xl p-4">
                <div className="text-indigo-600 font-black">4. 다시 보기</div>
                <div className="text-xs text-slate-600 leading-relaxed">상황이 바뀌면 목록과 일정을 업데이트하고 지금 할 일을 다시 고르기</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-600 rounded-3xl p-7 shadow-lg">
            <h2 className="text-lg font-black text-white mb-2 text-center">
              🎯 오늘 바로 해볼 것
            </h2>
            <p className="text-amber-50 text-sm text-center mb-6 leading-relaxed">
              {lowDomain.mission}
            </p>
            <button
              onClick={() => navigate("/self-understanding")}
              className="w-full bg-white text-amber-600 font-black py-4 rounded-2xl hover:bg-amber-50 transition-colors shadow-sm"
            >
              진단 센터로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = TM_QUESTIONS[qIndex] as any;
  const typeInfo = (TM_DOMAINS as any)[currentQ.d];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-black text-slate-800 tracking-tight">시간관리 역량 프로파일</div>
          <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {qIndex + 1} / {TM_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-8 relative flex flex-col items-center">
          <img src={hero.defaultImageUrl} alt="mentor" className="w-32 h-32 object-contain drop-shadow-xl z-10" />
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm relative -mt-4 w-full text-center">
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mb-2 inline-block">
              {typeInfo.name}
            </span>
            <p className="text-base font-bold text-slate-800 leading-snug break-keep">"{currentQ.q}"</p>
          </div>
        </div>

                <div className="space-y-3">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            const colorClass = opt.color === "indigo" 
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400" 
              : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-400";
            
            const selectedClass = opt.color === "indigo"
              ? "bg-indigo-500 border-indigo-600 text-white shadow-lg transform scale-[1.02]"
              : "bg-rose-500 border-rose-600 text-white shadow-lg transform scale-[1.02]";

            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={`w-full p-5 rounded-2xl border-2 font-black text-base transition-all flex items-center justify-center ${
                  isSelected ? selectedClass : colorClass
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
