import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { MI_QUESTIONS, MI_TYPES, MI_COMBOS, MI_ORDER } from "../../data/multipleIntelligencesData";

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

export const MultipleIntelligencesTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(MI_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < MI_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, MI_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < MI_QUESTIONS.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        processResults(newAnswers);
      }
    }, 400);
  };

  const processResults = (finalAnswers: number[]) => {
    setCurrentView("calculating");

    const scores: any = {};
    MI_ORDER.forEach((k: string) => {
      scores[k] = { sum: 0, count: 0, five: 0, four: 0 };
    });

    MI_QUESTIONS.forEach((q, i) => {
      const v = finalAnswers[i];
      scores[q.t].sum += v;
      scores[q.t].count++;
      if (v === 5) scores[q.t].five++;
      if (v >= 4) scores[q.t].four++;
    });

    MI_ORDER.forEach((k: string) => {
      scores[k].avg = scores[k].sum / scores[k].count;
    });

    setLastScores(scores);

    setTimeout(() => {
      const rank = [...MI_ORDER].sort(
        (a, b) =>
          scores[b].sum - scores[a].sum ||
          scores[b].five - scores[a].five ||
          scores[b].four - scores[a].four ||
          MI_ORDER.indexOf(a) - MI_ORDER.indexOf(b)
      );

      setFinalRank(rank);
      setCurrentView("result");
      
      // Update diagnostic status in localStorage
      const saved = localStorage.getItem("readycareer_6_diagnostics_v1");
      if (saved) {
        try {
          let tests = JSON.parse(saved);
          tests = tests.map((t: any) => {
            if (t.id === "test-multiple-intelligences") {
              const p1 = rank[0];
              const p2 = rank[1];
              const comboKey = [p1, p2].sort((x, y) => MI_ORDER.indexOf(x) - MI_ORDER.indexOf(y)).join("|");
              const combo = (MI_COMBOS as any)[comboKey];
              return {
                ...t,
                status: "completed",
                resultType: combo?.title || "강점 프로파일 도출 완료",
                scoreSummary: \`1위: \${(MI_TYPES as any)[p1].name}\`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[다중지능 강점 프로파일] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const percent = (avg: number) => Math.round((avg / 5) * 100);

  const progress = Math.round(((qIndex + 1) / MI_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🤖</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">AI 멘토가<br/>결과를 분석중이에요!</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">다중지능 패턴을 분석하여<br/>최적 강점을 도출합니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const p1 = finalRank[0];
    const p2 = finalRank[1];
    const p3 = finalRank[2];
    
    // Sort keys based on MI_ORDER for COMBOS matching
    const comboKey = [p1, p2].sort((x, y) => MI_ORDER.indexOf(x) - MI_ORDER.indexOf(y)).join("|");
    const combo = (MI_COMBOS as any)[comboKey];
    
    const type1 = (MI_TYPES as any)[p1];
    const type2 = (MI_TYPES as any)[p2];
    const type3 = (MI_TYPES as any)[p3];

    return (
      <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-black text-xs rounded-full mb-4">
              나의 다중지능 강점 프로파일
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-3">{combo?.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">{combo?.summary}</p>
            
            <div className="flex gap-3 justify-center mb-6">
              {[p1, p2, p3].map((k, idx) => {
                const t = (MI_TYPES as any)[k];
                return (
                  <div key={k} className={\`flex-1 p-3 rounded-2xl border \${idx === 0 ? 'bg-indigo-50 border-indigo-200 shadow-sm transform scale-105' : 'bg-white border-slate-100'}\`}>
                    <div className="text-2xl mb-1">{['🥇', '🥈', '🥉'][idx]}</div>
                    <div className="text-[10px] font-black text-slate-700">{t.icon} {t.name}</div>
                    <div className="text-lg font-black text-indigo-600">{percent(lastScores[k].avg)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              대표 강점 조합
            </h3>
            <div className="flex items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
              <div className="text-center flex-1">
                <div className="text-2xl mb-1">{type1.icon}</div>
                <div className="text-xs font-bold text-slate-700">1위 · {type1.name}</div>
              </div>
              <div className="text-slate-300 font-black">+</div>
              <div className="text-center flex-1">
                <div className="text-2xl mb-1">{type2.icon}</div>
                <div className="text-xs font-bold text-slate-700">2위 · {type2.name}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{combo?.strength}</p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              너 이런 편이지?
            </h3>
            <ul className="space-y-3">
              {combo?.traits.map((t: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="text-indigo-500 font-bold">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
              이것만 신경 써보기
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{combo?.caution}</p>
          </div>
          
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              그리고 하나 더 👀
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="font-bold text-sm mb-2">{type3.icon} 3위 · {type3.name} 지능도 꽤 잘 드러났어요.</div>
              <p className="text-xs text-slate-600 mb-2">{type3.extra}</p>
              <div className="text-xs font-bold text-indigo-600 mt-2">💡 활용 아이디어: {type3.use}</div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-7 shadow-lg">
            <h2 className="text-lg font-black text-white mb-2 text-center">
              🎯 오늘의 작은 미션
            </h2>
            <p className="text-indigo-100 text-sm text-center mb-6">
              {combo?.mission}
            </p>
            <button
              onClick={() => navigate("/self-understanding")}
              className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-sm"
            >
              진단 센터로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = MI_QUESTIONS[qIndex];
  const typeInfo = (MI_TYPES as any)[currentQ.t];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-black text-slate-800 tracking-tight">다중지능 강점 프로파일</div>
          <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {qIndex + 1} / {MI_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: \`\${progress}%\` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-8 relative flex flex-col items-center">
          <img src={hero.defaultImageUrl} alt="mentor" className="w-32 h-32 object-contain drop-shadow-xl z-10" />
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm relative -mt-4 w-full text-center">
            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full mb-2 inline-block">
              {typeInfo.name} 지능
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
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                }\`}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="text-indigo-500 font-black">✓</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
