import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rewardXP } from "../../services/expService";
import { JOB_CHARACTER_MASTER_LIST } from "../../assets/jobCharacterData";
import { VIA_QUESTIONS, VIA_VORDER } from "../../data/viaStrengthsData";

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
  { value: 5, label: "완전 딱 제 모습이에요", bg: "bg-white", text: "text-gray-700", border: "border-gray-200", hover: "hover:border-gray-300 shadow-sm", point: "bg-gray-200" },
  { value: 1, label: "저랑은 좀 거리가 멀어요", bg: "bg-white", text: "text-gray-700", border: "border-gray-200", hover: "hover:border-gray-300 shadow-sm", point: "bg-gray-200" },
];

export const ViaStrengthsTest: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(VIA_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "result">("questions");

  const [randomMentors, setRandomMentors] = useState<any[]>([]);
  const [scoredStrengths, setScoredStrengths] = useState<any[]>([]);
  const [virtueScores, setVirtueScores] = useState<any>({});
  const [virtueRank, setVirtueRank] = useState<string[]>([]);

  useEffect(() => {
    let pool = [...JOB_CHARACTER_MASTER_LIST];
    while (pool.length < VIA_QUESTIONS.length) {
      pool = [...pool, ...JOB_CHARACTER_MASTER_LIST];
    }
    setRandomMentors(shuffleArray(pool).slice(0, VIA_QUESTIONS.length));
  }, []);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < VIA_QUESTIONS.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        processResults(newAnswers);
      }
    }, 400);
  };

  const processResults = (finalAnswers: number[]) => {
    setCurrentView("calculating");

    const grouped: any = {};
    VIA_QUESTIONS.forEach((q: any, i: number) => {
      if (!grouped[q.id]) {
        grouped[q.id] = { ...q, vals: [], first: i };
      }
      grouped[q.id].vals.push(finalAnswers[i]);
    });

    const scored = Object.values(grouped).map((s: any) => {
      const raw = s.vals.reduce((a: number, b: number) => a + b, 0) / s.vals.length;
      return {
        ...s,
        raw,
        score: Math.round(((raw - 1) / 4) * 100),
        idx: s.first
      };
    });

    scored.sort((a, b) => b.raw - a.raw || a.idx - b.idx);

    const virtues: any = {};
    VIA_VORDER.forEach((v: string) => { virtues[v] = []; });
    scored.forEach((s: any) => { virtues[s.virtue].push(s.raw); });

    const vscore: any = {};
    VIA_VORDER.forEach((v: string) => {
      vscore[v] = Math.round(((virtues[v].reduce((a: number, b: number) => a + b, 0) / virtues[v].length - 1) / 4) * 100);
    });

    const vrank = [...VIA_VORDER].sort((a, b) => vscore[b] - vscore[a] || VIA_VORDER.indexOf(a) - VIA_VORDER.indexOf(b));

    setScoredStrengths(scored);
    setVirtueScores(vscore);
    setVirtueRank(vrank);

    setTimeout(() => {
      setCurrentView("result");
      
      // Update diagnostic status in localStorage
      const saved = localStorage.getItem("readycareer_6_diagnostics_v1");
      if (saved) {
        try {
          let tests = JSON.parse(saved);
          tests = tests.map((t: any) => {
            if (t.id === "test-via-strengths") {
              return {
                ...t,
                status: "completed",
                resultType: "대표 성격강점 도출 완료",
                scoreSummary: `1위: ${scored[0].name}`,
              };
            }
            return t;
          });
          localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(tests));
          rewardXP(50, "[VIA 성격강점] 진단 완료!");
        } catch (e) {}
      }
    }, 1500);
  };

  const progress = Math.round(((qIndex + 1) / VIA_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-sm border border-[#dddddd]">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tighter text-black mb-3 tracking-tight">강점 프로파일<br/>분석 중!</h2>
          <p className="text-sm text-[#707070] font-medium leading-relaxed">24가지 성격강점 중<br/>자연스럽게 드러나는 힘을 찾고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const top = scoredStrengths.slice(0, 5);
    const top3 = top.slice(0, 3);
    const low = scoredStrengths[scoredStrengths.length - 1];
    const sentence = `${top[0].name}과(와) ${top[1].name}이(가) 특히 자연스럽게 드러나고, ${top[2].name}도 함께 자주 사용하는 사람`;

    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-rose-200/60 text-center">
            <div className="inline-block px-3 py-1 bg-rose-50 text-rose-600 font-semibold tracking-tighter text-xs rounded-full mb-4">
              나의 대표 성격강점 TOP 5
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter text-black mb-3">{top[0].icon} {top[0].name}이 가장 자연스럽게 드러나요</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{sentence}으로 볼 수 있어요. 강점은 ‘잘하는 기술’만이 아니라 내가 생각하고 느끼고 행동할 때 자연스럽게 자주 꺼내 쓰는 좋은 힘입니다.</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {top.map((s, i) => (
                <span key={s.id} className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-tighter ${i === 0 ? 'bg-rose-500 text-black shadow-md' : 'bg-slate-100 text-black'}`}>
                  {s.icon} {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              나를 가장 잘 보여주는 강점 3가지
            </h3>
            <div className="space-y-3">
              {top3.map((s, i) => (
                <div key={s.id} className={`rounded-2xl p-4 border ${i === 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold tracking-tighter text-black">{i + 1}. {s.icon} {s.name}</div>
                    <div className="text-xs font-semibold tracking-tighter text-[#707070]">{s.score}</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-3 leading-relaxed">{s.desc}</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-white rounded-2xl p-3 border border-slate-100">
                      <div className="text-[10px] font-semibold tracking-tighter text-black mb-1">💡 이 강점 써보기</div>
                      <div className="text-xs text-[#707070] leading-relaxed">{s.use}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-slate-100">
                      <div className="text-[10px] font-semibold tracking-tighter text-black mb-1">⚠️ 너무 세게 쓰이면</div>
                      <div className="text-xs text-[#707070] leading-relaxed">{s.caution}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              6가지 큰 강점 영역
            </h3>
            <p className="text-[10px] text-[#707070] mb-5 leading-relaxed">VIA의 24개 강점은 지혜·용기·인간애·정의·절제·초월의 6개 덕목 영역으로 묶입니다. 아래 숫자는 이번 자기보고 응답의 환산값입니다.</p>
            <div className="space-y-4">
              {virtueRank.map((v) => (
                <div key={v} className="flex items-center gap-3">
                  <div className="w-16 text-xs font-semibold tracking-tighter text-black shrink-0">{v}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-300 to-rose-500 rounded-full" style={{ width: `${virtueScores[v]}%` }} />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold tracking-tighter text-[#707070]">{virtueScores[v]}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              강점을 더 잘 쓰는 방법
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm">
              <div className="text-[10px] font-semibold tracking-tighter text-rose-600 mb-2">TOP 강점 활용하기</div>
              <h4 className="text-base font-semibold tracking-tighter text-black mb-2">{top[0].name}을 실제 행동으로 꺼내보기</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{top[0].use} 강점은 ‘가지고 있는 것’보다 상황에 맞게 직접 써볼 때 더 분명하게 느껴집니다.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#dddddd]">
            <h3 className="font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              덜 자주 쓰는 강점도 내 안에 있어요
            </h3>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-[10px] font-semibold tracking-tighter text-[#707070] mb-2">숨은 강점 후보 · {low.icon} {low.name}</div>
              <h4 className="text-base font-semibold tracking-tighter text-black mb-2">낮은 순위 = 약점은 아니에요</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{low.desc} 지금 응답에서는 상대적으로 덜 자주 드러났지만 필요할 때 의식적으로 꺼내볼 수 있는 강점입니다. 이번 주 한 번만 이 강점을 써볼 장면을 찾아보세요.</p>
            </div>
          </div>

          <div className="bg-rose-600 rounded-2xl p-7 shadow-lg">
            <h2 className="text-lg font-semibold tracking-tighter text-black mb-2 text-center">
              🎯 오늘의 작은 미션
            </h2>
            <p className="text-rose-50 text-sm text-center mb-6 leading-relaxed">
              오늘 하루가 끝나기 전에 <b>{top[0].name}</b>을 실제로 사용한 순간 하나를 떠올려보세요. "나는 언제 이 강점을 가장 자연스럽게 쓰는가?"를 알면 자기이해가 훨씬 선명해집니다.
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

  const currentQ = VIA_QUESTIONS[qIndex] as any;
  const hero = randomMentors[qIndex] || JOB_CHARACTER_MASTER_LIST[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-semibold tracking-tighter text-black tracking-tight">성격강점 프로파일</div>
          <div className="text-xs font-semibold tracking-tighter text-black bg-gray-100 px-3 py-1 rounded-full">
            {qIndex + 1} / {VIA_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        <div className="mb-10 relative flex flex-col items-center">
          <div className="bg-transparent p-8 pt-12 mt-10 rounded-[32px] relative w-full text-center">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-amber-200 to-yellow-500 rounded-full p-1 shadow-sm z-10">
              <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                <img src={hero.defaultImageUrl} alt="mentor" className="w-20 h-20 object-contain drop-shadow-sm" />
              </div>
            </div>
            <span className="text-[10px] font-semibold tracking-tighter text-amber-900 bg-amber-300 px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
              {currentQ.virtue} 덕목
            </span>
            <p className="text-xl sm:text-2xl font-semibold tracking-tighter text-black leading-tight break-keep mt-2 text-shadow-sm">"{currentQ.q}"</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[qIndex] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectAnswer(opt.value)}
                className={`w-full p-5 rounded-2xl border-2 font-semibold tracking-tighter text-[15px] sm:text-lg transition-all flex flex-col items-center justify-center gap-4 text-center shadow-sm hover:shadow-md ${
                  isSelected 
                    ? 'bg-rose-500 border-rose-600 text-white ring-2 ring-rose-400 ring-offset-2' 
                    : 'bg-white border-rose-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex-shrink-0 transition-all border-2 flex items-center justify-center ${isSelected ? 'bg-white border-white' : 'bg-transparent border-rose-300'}`}>
                   {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>}
                </div>
                <span className="break-keep leading-snug">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
