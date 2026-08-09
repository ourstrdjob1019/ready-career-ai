import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { CAREER_QUESTIONS, CAREER_DOMAINS, CAREER_LEVELS, CAREER_ORDER, CAREER_GROUPS } from "../../data/careerMaturityData";

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
  { value: 5, label: "맞아요, 그 길로 가고 있어요 🧭", bg: "bg-gradient-to-r from-blue-50 to-sky-50", text: "text-blue-900", border: "border-blue-200", hover: "hover:scale-[1.01] hover:border-blue-400 shadow-sm", point: "bg-blue-500 ring-4 ring-blue-100" },
  { value: 1, label: "아직은 그 위치가 아니에요 🛑", bg: "bg-white", text: "text-gray-600", border: "border-slate-200", hover: "hover:bg-white hover:border-slate-300 shadow-sm", point: "bg-slate-200 ring-4 ring-slate-50" },
];

export const CareerMaturityTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(CAREER_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [lastScores, setLastScores] = useState<any>(null);
  const [groupScores, setGroupScores] = useState<any>(null);
  const [finalRank, setFinalRank] = useState<string[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<any>(null);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < CAREER_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, CAREER_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < CAREER_QUESTIONS.length - 1) {
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
    CAREER_ORDER.forEach((k: string) => {
      sum[k] = 0;
      cnt[k] = 0;
    });

    CAREER_QUESTIONS.forEach((q: any, i: number) => {
      const v = q.r ? 6 - finalAnswers[i] : finalAnswers[i];
      sum[q.d] += v;
      cnt[q.d]++;
    });

    const pct: any = {};
    CAREER_ORDER.forEach((k: string) => {
      pct[k] = Math.round(((sum[k] - cnt[k]) / (cnt[k] * 4)) * 100);
    });

    setLastScores(pct);

    setTimeout(() => {
      const avg = Math.round(CAREER_ORDER.reduce((a, k) => a + pct[k], 0) / CAREER_ORDER.length);
      const lv = CAREER_LEVELS.find((x: any) => avg >= x.min && avg <= x.max) || CAREER_LEVELS[0];
      
      const rank = [...CAREER_ORDER].sort((a, b) => pct[b] - pct[a] || CAREER_ORDER.indexOf(a) - CAREER_ORDER.indexOf(b));

      const gscore: any = {};
      CAREER_GROUPS.forEach((g: string) => {
        const ks = CAREER_ORDER.filter((k: string) => (CAREER_DOMAINS as any)[k].group === g);
        gscore[g] = Math.round(ks.reduce((a, k) => a + pct[k], 0) / ks.length);
      });

      setGroupScores(gscore);
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
            if (t.id === "test-career-maturity") {
              return {
                ...t,
                status: "completed",
                resultType: lv.title,
                scoreSummary: `진로성숙도 지수: ${avg}점`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[진로성숙도 프로파일] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / CAREER_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-sm border border-[#dddddd]">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🧭</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tighter text-black mb-3 tracking-tight">진로성숙도<br/>분석 중!</h2>
          <p className="text-sm text-[#707070] font-medium leading-relaxed">태도, 능력, 행동의 3영역과<br/>8가지 세부 역량을 종합 분석합니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const strong = finalRank[0];
    const low = finalRank[finalRank.length - 1];

    const strongDomain = (CAREER_DOMAINS as any)[strong];
    const lowDomain = (CAREER_DOMAINS as any)[low];

    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-blue-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-semibold tracking-tighter text-xs rounded-full mb-4">
              나의 진로성숙도 상태
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter text-black mb-3">{currentLevel?.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{currentLevel?.summary}</p>
            
            <div className="flex items-end justify-center gap-2 mt-4">
              <div className="text-5xl font-semibold tracking-tighter text-blue-600 leading-none">{overallAvg}</div>
              <div className="text-sm font-medium tracking-tight text-[#707070] pb-1">/ 100 · 진로성숙도 지수</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              태도 · 능력 · 행동
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CAREER_GROUPS.map((g: string) => (
                <div key={g} className="bg-white rounded-2xl border border-[#dddddd] p-4 text-center flex flex-col justify-between">
                  <div className="text-xs font-semibold tracking-tighter text-black mb-2">{g}</div>
                  <div className="text-3xl font-semibold tracking-tighter text-blue-600 mb-2">{groupScores[g]}</div>
                  <div className="text-[10px] text-[#707070] leading-tight">
                    {g === '태도' ? '진로를 계획하고 책임 있게 바라보는 기본 태도' : g === '능력' ? '나와 직업을 이해하고 정보를 비교해 선택하는 힘' : '생각을 실제 탐색과 준비로 옮기는 힘'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              나의 8가지 진로성숙 역량
            </h3>
            <p className="text-xs text-[#707070] mb-5 leading-relaxed">점수는 커리어넷 공식 규준점수가 아니라 이번 응답을 100점 기준으로 환산한 박람회용 자기보고 프로파일입니다.</p>
            <div className="space-y-4">
              {finalRank.map((k) => {
                const d = (CAREER_DOMAINS as any)[k];
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-28 text-xs font-semibold tracking-tighter text-black shrink-0">{d.icon} {d.name}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" style={{ width: `${lastScores[k]}%` }} />
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
              잘하고 있는 것과 가장 먼저 보완할 것
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
                <div className="text-2xl mb-1">{strongDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-blue-800 mb-2">강점 · {strongDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-blue-700">{strongDomain.strong}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#dddddd] p-5">
                <div className="text-2xl mb-1">{lowDomain.icon}</div>
                <div className="text-xs font-semibold tracking-tighter text-black mb-2">NEXT · {lowDomain.name}</div>
                <div className="text-[11px] leading-relaxed text-[#707070]">{lowDomain.change}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              지금 가장 먼저 할 진로 행동
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm">
              <div className="text-[10px] font-semibold tracking-tighter text-orange-600 mb-2">{lowDomain.icon} {lowDomain.name}</div>
              <h4 className="text-base font-semibold tracking-tighter text-black mb-2">{lowDomain.mission}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">진로성숙은 직업을 빨리 결정해서 끝나는 것이 아니라, 필요한 순간마다 자신을 이해하고 정보를 찾고 선택하고 행동하는 힘을 계속 키워가는 과정입니다.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              진로가 막막할 때는 이 순서로
            </h3>
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4">
                <div className="text-amber-600 font-semibold tracking-tighter mb-1 text-xs">1. 나 보기</div>
                <div className="text-xs text-gray-600 leading-relaxed">내 흥미·강점·가치 중 지금 가장 중요한 단서 하나 찾기</div>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <div className="text-amber-600 font-semibold tracking-tighter mb-1 text-xs">2. 정보 보기</div>
                <div className="text-xs text-gray-600 leading-relaxed">관심 분야의 직업·학과·경로를 실제 정보로 확인하기</div>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <div className="text-amber-600 font-semibold tracking-tighter mb-1 text-xs">3. 비교하기</div>
                <div className="text-xs text-gray-600 leading-relaxed">내 기준에 맞춰 여러 선택지의 장단점을 비교하기</div>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <div className="text-amber-600 font-semibold tracking-tighter mb-1 text-xs">4. 해보기</div>
                <div className="text-xs text-gray-600 leading-relaxed">검색·질문·체험·기록 중 작은 행동 하나를 실제로 실행하기</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-7 shadow-lg">
            <h2 className="text-lg font-semibold tracking-tighter text-black mb-2 text-center">
              🎯 이번 주 진로 미션
            </h2>
            <p className="text-blue-50 text-sm text-center mb-6 leading-relaxed">
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

  const currentQ = CAREER_QUESTIONS[qIndex] as any;
  const typeInfo = (CAREER_DOMAINS as any)[currentQ.d];
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-semibold tracking-tighter text-black tracking-tight">진로성숙도 프로파일</div>
          <div className="text-xs font-semibold tracking-tighter text-black bg-gray-100 px-3 py-1 rounded-full">
            {qIndex + 1} / {CAREER_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-10 relative flex flex-col items-center">
          <div className="bg-[#F8FAFC] border-[3px] border-blue-100 p-8 pt-10 rounded-[40px] shadow-sm relative w-full text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-blue-100 rounded-b-full flex items-end justify-center pb-1">
              <span className="text-[10px] font-semibold tracking-tighter text-blue-500 uppercase tracking-widest">N</span>
            </div>
            <img src={hero.defaultImageUrl} alt="mentor" className="w-20 h-20 object-contain drop-shadow-md mx-auto mb-4" />
            <span className="text-[11px] font-semibold tracking-tighter text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
              현재 위치: {typeInfo.name}
            </span>
            <p className="text-xl font-medium tracking-tight text-black leading-snug break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="space-y-4 relative">
          {/* Path Line connecting options */}
          <div className="absolute left-6 top-6 bottom-6 w-1 bg-gray-200 rounded-2xl z-0"></div>
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={`w-full p-5 rounded-2xl border-2 font-semibold tracking-tighter text-lg transition-all flex items-center justify-start gap-5 relative z-10 ${opt.bg} ${opt.text} ${opt.border} ${opt.hover} ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
              >
                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-blue-600 ring-4 ring-blue-200' : opt.point}`}></div>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
