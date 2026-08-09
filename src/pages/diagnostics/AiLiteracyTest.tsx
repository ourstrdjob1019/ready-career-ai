import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { AI_QUESTIONS, AI_DOMAINS, AI_PAIRS, AI_ORDER } from "../../data/aiLiteracyData";

// 랜덤 캐릭터 멘토 셔플
const shuffleArray = (array: any[]) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const makeOrders = () => {
  return AI_QUESTIONS.map(q => {
    const a = (q as any).o.map((_: any, i: number) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
};

export const AiLiteracyTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(AI_QUESTIONS.length).fill(-1));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [optionOrders, setOptionOrders] = useState<number[][]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);
  const [resultPair, setResultPair] = useState<string[]>([]);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < AI_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, AI_QUESTIONS.length));
    setOptionOrders(makeOrders());
  }, []);

  const handleSelectAnswer = (origIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = origIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < AI_QUESTIONS.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        processResults(newAnswers);
      }
    }, 400);
  };

  const baselines = () => {
    const mean: any = {};
    const sd: any = {};
    AI_ORDER.forEach((k: string, j: number) => {
      let m = 0, variance = 0;
      AI_QUESTIONS.forEach(q => {
        const vals = (q as any).o.map((o: any) => o[1][j]);
        const qm = vals.reduce((a: number, b: number) => a + b, 0) / vals.length;
        m += qm;
        variance += vals.reduce((a: number, b: number) => a + Math.pow(b - qm, 2), 0) / vals.length;
      });
      mean[k] = m;
      sd[k] = Math.sqrt(variance) || 1;
    });
    return { mean, sd };
  };

  const processResults = (finalAnswers: number[]) => {
    setCurrentView("calculating");

    const raw: any = {};
    AI_ORDER.forEach((k: string) => raw[k] = 0);
    AI_QUESTIONS.forEach((q: any, i: number) => {
      const vec = q.o[finalAnswers[i]][1];
      AI_ORDER.forEach((k: string, j: number) => raw[k] += vec[j]);
    });

    const BASE = baselines();
    const p: any = {};
    AI_ORDER.forEach((k: string) => {
      const z = (raw[k] - BASE.mean[k]) / BASE.sd[k];
      p[k] = Math.round(Math.max(5, Math.min(95, 50 + z * 15)));
    });

    const rank = [...AI_ORDER].sort((a, b) => p[b] - p[a] || AI_ORDER.indexOf(a) - AI_ORDER.indexOf(b));
    const a = rank[0];
    const b = rank[1];
    
    // Sort pair alphabetically to match PAIRS keys or try both orders
    let pairKey = `${a}|${b}`;
    let pair = (AI_PAIRS as any)[pairKey];
    if (!pair) {
      pairKey = `${b}|${a}`;
      pair = (AI_PAIRS as any)[pairKey];
    }
    if (!pair) {
      pair = ['균형형 AI 사용자', '여러 기준을 상황에 맞게 고르게 활용하는 편이에요.'];
    }

    setLastScores(p);
    setFinalRank(rank);
    setResultPair(pair);

    setTimeout(() => {
      setCurrentView("result");
      
      // Update diagnostic status in localStorage
      const saved = localStorage.getItem("readycareer_6_diagnostics_v1");
      if (saved) {
        try {
          let tests = JSON.parse(saved);
          tests = tests.map((t: any) => {
            if (t.id === "test-ai-literacy") {
              return {
                ...t,
                status: "completed",
                resultType: pair[0],
                scoreSummary: `강점: ${(AI_DOMAINS as any)[a].name}`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[AI 디지털 리터러시 진단] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / AI_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-sm border border-[#dddddd]">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🤖</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tighter text-black mb-3 tracking-tight">AI 활용 프로파일<br/>분석 중!</h2>
          <p className="text-sm text-[#707070] font-medium leading-relaxed">나의 AI 활용 기준과<br/>디지털 행동 패턴을 찾고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const a = finalRank[0];
    const b = finalRank[1];
    const low = finalRank[finalRank.length - 1];

    const strongDomain = (AI_DOMAINS as any)[a];
    const lowDomain = (AI_DOMAINS as any)[low];

    const bullets = [
      ...strongDomain.bullets.slice(0, 2),
      (AI_DOMAINS as any)[b].bullets[0]
    ];

    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-300/60 text-center">
            <div className="inline-block px-3 py-1 bg-gray-100 text-black font-semibold tracking-tighter text-xs rounded-full mb-4">
              나의 AI 활용 프로파일
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter text-black mb-3">{resultPair[0]}</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{resultPair[1]}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left">
              <div className="bg-white rounded-2xl border border-[#dddddd] p-4">
                <div className="text-[10px] font-semibold tracking-tighter text-indigo-800 mb-2">가장 자주 드러난 기준</div>
                <div className="text-base font-semibold tracking-tighter text-indigo-900 mb-1">{strongDomain.icon} {strongDomain.name}</div>
                <div className="text-xs text-black/80 leading-relaxed">{strongDomain.desc}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#dddddd] p-4">
                <div className="text-[10px] font-semibold tracking-tighter text-[#707070] mb-2">함께 자주 드러난 기준</div>
                <div className="text-base font-semibold tracking-tighter text-black mb-1">{(AI_DOMAINS as any)[b].icon} {(AI_DOMAINS as any)[b].name}</div>
                <div className="text-xs text-[#707070] leading-relaxed">{(AI_DOMAINS as any)[b].desc}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              나의 5가지 AI 활용 기준
            </h3>
            <p className="text-[10px] text-[#707070] mb-5 leading-relaxed">이 숫자는 시험 점수나 또래 백분위가 아닙니다. 각 선택지에서 어떤 기준을 상대적으로 더 자주 우선했는지를 보기 쉽게 환산한 프로파일 지수입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (AI_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-semibold tracking-tighter text-black shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-full" style={{ width: `${lastScores[k]}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs font-semibold tracking-tighter text-[#707070]">{lastScores[k]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              너 이런 편이지?
            </h3>
            <div className="space-y-3">
              {bullets.map((b: string, i: number) => (
                <div key={i} className="flex gap-3 bg-white rounded-2xl p-4">
                  <div className="text-black font-semibold tracking-tighter">✓</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{b}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              지금 잘하고 있는 것과 다음에 챙길 기준
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-indigo-800 mb-2">잘 드러난 기준 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-black">{strongDomain.strong}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
                <div className="text-2xl mb-1">{lowDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-black mb-2">다음에 한 번 더 · {lowDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-[#707070]">{lowDomain.next}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              AI 리터러시는 정답 하나가 아니에요
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              어떤 상황에서는 빠른 창작이 중요하고, 어떤 상황에서는 검증이나 개인정보 보호가 더 중요할 수 있어요. 핵심은 <b>상황에 따라 어떤 기준을 더 우선해야 하는지 스스로 판단하고 조절하는 것</b>입니다.
            </p>
          </div>

          <div className="bg-black rounded-2xl p-7 shadow-lg">
            <h2 className="text-lg font-semibold tracking-tighter text-black mb-2 text-center">
              🎯 오늘의 작은 미션
            </h2>
            <p className="text-indigo-50 text-sm text-center mb-6 leading-relaxed">
              다음에 AI를 사용할 때 시작하기 전에 5초만 생각해보세요. <b>“이번에는 검증, 창작, 관리, 이해, 안전 중 무엇을 가장 먼저 챙겨야 할까?”</b>
            </p>
            <button
              onClick={() => navigate("/self-understanding")}
              className="w-full bg-[#F5F5F5] text-black font-semibold tracking-tighter py-4 rounded-2xl hover:bg-gray-800 border border-gray-200 transition-colors"
            >
              진단 센터로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = AI_QUESTIONS[qIndex] as any;
  const currentOrders = optionOrders[qIndex] || [];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-semibold tracking-tighter text-black tracking-tight">AI 리터러시 프로파일</div>
          <div className="text-xs font-semibold tracking-tighter text-black bg-gray-100 px-3 py-1 rounded-full">
            {qIndex + 1} / {AI_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-10 relative flex flex-col items-center">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative -mt-4 w-full text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
            <img src={hero.defaultImageUrl} alt="mentor" className="w-20 h-20 object-contain drop-shadow-sm mb-4 mx-auto" />
            <span className="text-[10px] font-mono text-black bg-cyan-900/50 px-3 py-1 rounded-sm mb-3 inline-block border border-cyan-500/30">
              AI 리터러시 진단
            </span>
            <p className="text-lg font-semibold tracking-tighter text-black leading-relaxed break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentOrders.map((origIndex: number, idx: number) => {
            const isSelected = answers[qIndex] === origIndex;
            return (
              <button
                key={origIndex}
                onClick={() => handleSelectAnswer(origIndex)}
                className={`w-full p-4 rounded-2xl border font-medium tracking-tight text-sm transition-all flex items-center gap-4 text-left ${
                  isSelected 
                    ? "bg-white border-cyan-400 text-cyan-50 shadow-sm transform scale-[1.02]" 
                    : "bg-white border-slate-200 text-gray-600 hover:border-cyan-300 hover:bg-cyan-50/30 hover:shadow-sm"
                }`}
              >
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-mono shrink-0 border ${isSelected ? 'bg-black border-cyan-400 text-slate-900' : 'bg-white border-slate-200 text-[#707070]'}`}>
                  0{idx + 1}
                </div>
                <span className="flex-1 leading-snug">{currentQ.o[origIndex][0]}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
