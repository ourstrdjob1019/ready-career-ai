import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { RESILIENCE_QUESTIONS, RESILIENCE_DOMAINS, RESILIENCE_LEVELS, RESILIENCE_ORDER } from "../../data/resilienceData";

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
  { value: 5, label: "맞아, 나도 그래!", bg: "bg-white", text: "text-gray-700", border: "border-gray-200", hover: "hover:border-gray-300 shadow-sm", point: "bg-gray-200" },
  { value: 1, label: "아직은 잘 안 돼", bg: "bg-white", text: "text-gray-700", border: "border-gray-200", hover: "hover:border-gray-300 shadow-sm", point: "bg-gray-200" },
];

export const ResilienceTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(RESILIENCE_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<any>(null);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < RESILIENCE_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, RESILIENCE_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < RESILIENCE_QUESTIONS.length - 1) {
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
    RESILIENCE_ORDER.forEach((k: string) => {
      sum[k] = 0;
      cnt[k] = 0;
    });

    RESILIENCE_QUESTIONS.forEach((q: any, i: number) => {
      const v = q.r ? 6 - finalAnswers[i] : finalAnswers[i];
      sum[q.d] += v;
      cnt[q.d]++;
    });

    const pct: any = {};
    RESILIENCE_ORDER.forEach((k: string) => {
      pct[k] = Math.round(((sum[k] - cnt[k]) / (cnt[k] * 4)) * 100);
    });

    setLastScores(pct);

    setTimeout(() => {
      const avg = Math.round(RESILIENCE_ORDER.reduce((a, k) => a + pct[k], 0) / RESILIENCE_ORDER.length);
      const lv = RESILIENCE_LEVELS.find((x: any) => avg >= x.min && avg <= x.max) || RESILIENCE_LEVELS[0];
      
      const rank = [...RESILIENCE_ORDER].sort((a, b) => pct[b] - pct[a] || RESILIENCE_ORDER.indexOf(a) - RESILIENCE_ORDER.indexOf(b));

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
            if (t.id === "test-resilience") {
              return {
                ...t,
                status: "completed",
                resultType: lv.title,
                scoreSummary: `회복탄력성 지수: ${avg}점`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[회복탄력성 프로파일] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / RESILIENCE_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-sm border border-[#dddddd]">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🌿</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tighter text-black mb-3 tracking-tight">회복탄력성 역량<br/>분석 중!</h2>
          <p className="text-sm text-[#707070] font-medium leading-relaxed">어려움을 마주했을 때의 회복과<br/>적응 자원을 분석합니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const strong = finalRank[0];
    const low = finalRank[finalRank.length - 1];

    const strongDomain = (RESILIENCE_DOMAINS as any)[strong];
    const lowDomain = (RESILIENCE_DOMAINS as any)[low];

    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-green-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-green-50 text-green-600 font-semibold tracking-tighter text-xs rounded-full mb-4">
              나의 회복탄력성 상태
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter text-black mb-3">{currentLevel?.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{currentLevel?.summary}</p>
            
            <div className="flex items-end justify-center gap-2 mt-4">
              <div className="text-5xl font-semibold tracking-tighter text-green-600 leading-none">{overallAvg}</div>
              <div className="text-sm font-medium tracking-tight text-[#707070] pb-1">/ 100 · 회복탄력성 프로파일 지수</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              나의 5가지 회복 자원
            </h3>
            <p className="text-xs text-[#707070] mb-5 leading-relaxed">점수는 또래 백분위가 아니라 이번 응답을 100점 기준으로 환산한 자기보고형 프로파일입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (RESILIENCE_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-semibold tracking-tighter text-black shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full" style={{ width: `${lastScores[k]}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs font-semibold tracking-tighter text-[#707070]">{lastScores[k]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              지금 잘 쓰는 힘과 가장 먼저 보완할 힘
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-[#dddddd] p-4">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-green-800 mb-2">강점 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-green-700">{strongDomain.strong}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#dddddd] p-4">
                <div className="text-2xl mb-1">{lowDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-black mb-2">NEXT · {lowDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-[#707070]">{lowDomain.change}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              내 회복을 가장 늦추는 지점
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm">
              <div className="text-[10px] font-semibold tracking-tighter text-orange-600 mb-2">{lowDomain.icon} {lowDomain.name}</div>
              <h4 className="text-base font-semibold tracking-tighter text-black mb-2">{lowDomain.leak}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{lowDomain.change}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              회복할 때 기억할 3가지
            </h3>
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4">
                <div className="text-black font-semibold tracking-tighter mb-1 text-xs">① 감정은 없애는 게 아님</div>
                <div className="text-xs text-gray-600 leading-relaxed">흔들리는 건 자연스럽고, 중요한 건 다시 균형을 찾는 방법입니다.</div>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <div className="text-black font-semibold tracking-tighter mb-1 text-xs">② 방법은 바꿔도 됨</div>
                <div className="text-xs text-gray-600 leading-relaxed">원래 계획이 틀어져도 목표를 향한 다른 길을 선택할 수 있습니다.</div>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <div className="text-black font-semibold tracking-tighter mb-1 text-xs">③ 도움도 회복 자원임</div>
                <div className="text-xs text-gray-600 leading-relaxed">혼자 버티는 것보다 필요한 사람과 정보를 활용하는 것도 회복탄력성입니다.</div>
              </div>
            </div>
          </div>

          <div className="bg-green-600 rounded-2xl p-7 shadow-lg">
            <h2 className="text-lg font-semibold tracking-tighter text-black mb-2 text-center">
              🎯 오늘 바로 해볼 것
            </h2>
            <p className="text-green-50 text-sm text-center mb-6 leading-relaxed">
              {lowDomain.mission}
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

  const currentQ = RESILIENCE_QUESTIONS[qIndex] as any;
  const typeInfo = (RESILIENCE_DOMAINS as any)[currentQ.d];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-semibold tracking-tighter text-black tracking-tight">회복탄력성 프로파일</div>
          <div className="text-xs font-semibold tracking-tighter text-black bg-gray-100 px-3 py-1 rounded-full">
            {qIndex + 1} / {RESILIENCE_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-10 relative flex flex-col items-center">
          <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-100 p-8 rounded-[40px] shadow-sm relative w-full text-center">
            <img src={hero.defaultImageUrl} alt="mentor" className="w-24 h-24 object-contain drop-shadow-md mx-auto mb-4" />
            <span className="text-xs font-semibold tracking-tighter text-orange-600 bg-white px-4 py-1.5 rounded-full mb-4 inline-block shadow-sm">
              {typeInfo.name}
            </span>
            <p className="text-xl font-medium tracking-tight text-black leading-snug break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="space-y-4">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={`w-full p-6 rounded-[32px] border-2 font-semibold tracking-tighter text-lg transition-all flex items-center justify-center ${opt.bg} ${opt.text} ${opt.border} ${opt.hover} ${isSelected ? 'ring-4 ring-orange-300 ring-offset-2' : ''}`}
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
