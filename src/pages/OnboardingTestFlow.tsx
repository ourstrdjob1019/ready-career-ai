import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JOB_CHARACTER_MASTER_LIST } from "../assets/jobCharacterData";
import { getJobCharacterImage, getJobCharacterTitle } from "../assets/mascotData";
import { RIASEC_QUESTIONS, RIASEC_TYPES, RIASEC_PROFILES } from "../data/riasecData";

// 2가지 선택 (색깔 대비)
const LIKERT_OPTIONS = [
  { value: 5, label: "네, 완전 공감해요! 👍", color: "indigo" },
  { value: 1, label: "아니요, 저랑은 안 맞아요 🙅", color: "rose" },
];

export const OnboardingTestFlow: React.FC = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(RIASEC_QUESTIONS.length).fill(0));
  const [currentView, setCurrentView] = useState<"questions" | "calculating" | "tie" | "result">("questions");

  // 점수 상태
  const [lastScores, setLastScores] = useState<any>(null);
  const [tieState, setTieState] = useState<any>(null);
  const [finalCode, setFinalCode] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleSelectAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = val;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (qIndex < RIASEC_QUESTIONS.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        processResults(newAnswers);
      }
    }, 400); // 딜레이를 주어 버튼 애니메이션 후 넘어감
  };

  const processResults = (finalAnswers: number[]) => {
    setCurrentView("calculating");
    const totals: any = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts: any = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const high5: any = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const high4: any = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    RIASEC_QUESTIONS.forEach((q, i) => {
      const v = finalAnswers[i];
      totals[q.t] += v;
      counts[q.t]++;
      if (v === 5) high5[q.t]++;
      if (v >= 4) high4[q.t]++;
    });

    const scores: any = {};
    Object.keys(totals).forEach((k) => {
      scores[k] = { sum: totals[k], avg: totals[k] / counts[k], five: high5[k], four: high4[k] };
    });

    setLastScores(scores);

    setTimeout(() => {
      const rank = Object.keys(scores).sort(
        (a, b) => scores[b].sum - scores[a].sum || scores[b].five - scores[a].five || scores[b].four - scores[a].four
      );

      const top = rank[0];
      const second = rank[1];
      const sameTop = Object.keys(scores).filter(
        (k) => scores[k].sum === scores[top].sum && scores[k].five === scores[top].five && scores[k].four === scores[top].four
      );

      if (sameTop.length > 1) {
        setTieState({ position: 0, candidates: sameTop, chosen: [] });
        setCurrentView("tie");
        return;
      }

      const sameSecond = Object.keys(scores).filter(
        (k) =>
          k !== top &&
          scores[k].sum === scores[second].sum &&
          scores[k].five === scores[second].five &&
          scores[k].four === scores[second].four
      );

      if (sameSecond.length > 1) {
        setTieState({ position: 1, candidates: sameSecond, chosen: [top] });
        setCurrentView("tie");
        return;
      }

      setFinalCode(top + second);
      setCurrentView("result");
    }, 1500);
  };

  const resolveTie = (selected: string) => {
    const scores = lastScores;
    const rank = Object.keys(scores).sort(
      (a, b) => scores[b].sum - scores[a].sum || scores[b].five - scores[a].five || scores[b].four - scores[a].four
    );

    if (tieState.position === 0) {
      const rest = tieState.candidates.filter((x: string) => x !== selected);
      const newRank = [selected, ...rank.filter((x) => x !== selected)];
      const second = newRank[1];
      const sameSecond = rest.filter(
        (k: string) =>
          scores[k].sum === scores[second].sum &&
          scores[k].five === scores[second].five &&
          scores[k].four === scores[second].four
      );
      if (sameSecond.length > 1) {
        setTieState({ position: 1, candidates: sameSecond, chosen: [selected] });
        return;
      }
      setFinalCode(selected + second);
      setCurrentView("result");
    } else {
      setFinalCode(tieState.chosen[0] + selected);
      setCurrentView("result");
    }
  };

  const selectFinalJob = (jobName: string) => {
    localStorage.setItem("readycareer_selected_job", jobName);
    localStorage.setItem("readycareer_student_xp_v1", "0");
    navigate("/");
  };

  const progress = Math.round(((qIndex + 1) / RIASEC_QUESTIONS.length) * 100);

  if (currentView === "calculating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">🤖</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">AI 멘토가<br/>결과를 분석중이에요!</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">수만 개의 직업 데이터를<br/>조합하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (currentView === "tie" && tieState) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-12 p-6">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block py-1.5 px-3 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs mb-3">
              동점자 타이브레이커
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">
              둘 다 비슷하게 끌리네요.<br />지금 당장 딱 하나만 고른다면?
            </h1>
          </div>
          <div className="space-y-4">
            {tieState.candidates.map((code: string) => {
              const typeInfo = (RIASEC_TYPES as any)[code];
              return (
                <button
                  key={code}
                  onClick={() => resolveTie(code)}
                  className="w-full text-left bg-white border-2 border-indigo-50 p-5 rounded-2xl shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-black text-indigo-600">{code}</span>
                    <span className="font-bold text-slate-800">{typeInfo.name}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-1">{typeInfo.prompt}</p>
                  <p className="text-xs text-slate-500">{typeInfo.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "result") {
    const profile = (RIASEC_PROFILES as any)[finalCode] || {
      title: "융합형 크리에이터",
      summary: "두 가지 성향이 조화롭게 섞여 새로운 가능성을 만들어내는 타입입니다.",
      traits: ["새로운 시도를 즐깁니다.", "나만의 방식을 중요하게 생각합니다."],
      strength: "예측 불가능한 융합적 상황에서 창의적인 해결책을 제시합니다.",
      caution: "때로는 한 가지 방향을 정하는 결단력이 필요합니다.",
      fields: ["융합기술", "창작기획", "미래산업"],
    };

    const primary = finalCode[0];
    const secondary = finalCode[1];
    const pInfo = (RIASEC_TYPES as any)[primary];
    const sInfo = (RIASEC_TYPES as any)[secondary];

    // 내 성향에 맞는 직업 찾기 (1순위 또는 2순위 코드가 매칭되는 직업)
    const matchingJobs = JOB_CHARACTER_MASTER_LIST.filter(
      (job) => job.riasecCode === primary || job.riasecCode === secondary
    );

    return (
      <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-5">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-black text-xs rounded-full mb-4">
              나의 진로흥미 코드 · {finalCode}
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">{profile.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{profile.summary}</p>
            
            <div className="flex items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-center flex-1">
                <div className="text-2xl font-black text-indigo-600 mb-1">{primary}</div>
                <div className="text-xs font-bold text-slate-700">{pInfo.name}</div>
              </div>
              <div className="text-slate-300 font-black">+</div>
              <div className="text-center flex-1">
                <div className="text-2xl font-black text-blue-500 mb-1">{secondary}</div>
                <div className="text-xs font-bold text-slate-700">{sInfo.name}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/60">
            <h2 className="text-lg font-black text-slate-800 mb-4 text-center">
              내 성향에 딱 맞는 직업 선택하기
            </h2>
            <p className="text-slate-500 text-xs text-center mb-6 font-medium break-keep">
              추천된 {matchingJobs.length}개의 캐릭터 중 가장 끌리는 하나를 골라 여정을 시작하세요!
            </p>
            <div className="grid grid-cols-2 gap-4">
              {matchingJobs.slice(0, 10).map((job) => (
                <button
                  key={job.jobName}
                  onClick={() => setSelectedJob(job)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col items-center transition-all group shadow-sm hover:shadow-md"
                >
                  <img src={job.defaultImageUrl} alt={job.jobName} className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-3 drop-shadow-sm group-hover:scale-110 transition-transform" />
                  <span className="text-base sm:text-lg font-black text-slate-700">{job.jobName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Selection Popup */}
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 animate-fadeIn">
            <div className="bg-white rounded-[32px] p-6 sm:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-center">
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-5 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full font-bold text-xl transition-colors"
              >
                ✕
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-left mb-10 bg-slate-50 p-6 sm:p-8 rounded-[24px] border border-slate-100">
                <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 relative">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-50" />
                  <img src={selectedJob.defaultImageUrl} alt={selectedJob.jobName} className="w-full h-full object-contain relative z-10 drop-shadow-xl" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">{selectedJob.jobName}</h2>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium break-keep">
                    {selectedJob.description || "이 직업과 함께 나의 커리어 여정을 시작해보세요!"}
                  </p>
                </div>
              </div>

              {/* Lv.1 ~ Lv.5 진화 UI */}
              <div className="mb-10 text-left">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> 성장 로드맵 엿보기
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { lv: "Lv.1", badge: "지식 융합", name: "초보" },
                    { lv: "Lv.2", badge: "챌린지", name: "리더" },
                    { lv: "Lv.3", badge: "포폴 왕", name: "전문가" },
                    { lv: "Lv.4", badge: "차세대 고수", name: "엑스퍼트" },
                    { lv: "Lv.5", badge: "마스터", name: "마스터" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-[24px] bg-slate-50 p-4 border border-slate-200 hover:border-indigo-400 transition-all flex flex-col items-center justify-between space-y-3 group">
                      <div className="w-full flex flex-col items-center space-y-1">
                        <span className="text-xs font-black bg-white px-3 py-0.5 rounded-full shadow-xs border border-slate-200">{item.lv}</span>
                        <span className="text-[11px] font-bold text-slate-500">{item.badge}</span>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-white p-2 border border-slate-100 flex items-center justify-center my-2 group-hover:scale-105 transition-transform shadow-xs">
                        <img src={getJobCharacterImage(selectedJob.jobName, i + 1)} alt="stage" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                      <strong className="text-[11px] font-black text-slate-800 text-center w-full bg-white rounded-xl py-2 px-1 border border-slate-200/80 shadow-xs truncate">
                        {getJobCharacterTitle(selectedJob.jobName, i + 1, item.name)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => selectFinalJob(selectedJob.jobName)}
                className="w-full max-w-md mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg sm:text-xl py-5 rounded-[20px] shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>이 직업으로 여정 시작하기</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 문항 풀이 화면
  const currentQ = RIASEC_QUESTIONS[qIndex];
  const typeInfo = (RIASEC_TYPES as any)[currentQ.t];

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
      {/* 헤더 & 진행바 */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-base font-black text-slate-800 tracking-tight">K-RIASEC 진로흥미검사</div>
          <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {qIndex + 1} / {RIASEC_QUESTIONS.length}
          </div>
        </div>
        <div className="max-w-md mx-auto h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* 메인 뷰 */}
      <main className="flex-1 max-w-md w-full mx-auto p-5 pb-32 flex flex-col justify-center">
        {/* 질문 영역 (캐릭터 이미지 제외) */}
        <div className="mb-10 relative flex flex-col items-center">
          <div className="bg-white border border-slate-200/60 p-8 md:p-10 rounded-[32px] shadow-sm relative w-full text-center">
            <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full mb-5 inline-block shadow-sm">
              {typeInfo.name} 질문
            </span>
            <p className="text-xl md:text-2xl font-bold text-slate-800 leading-snug break-keep">"{currentQ.q}"</p>
          </div>
        </div>

        {/* 2가지 선택 버튼 (가로 배치) */}
        <div className="grid grid-cols-2 gap-3">
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
                className={`w-full py-8 px-4 rounded-2xl border-2 font-black text-lg md:text-xl transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected ? selectedClass : colorClass
                }`}
              >
                <span>{opt.label.split(' ')[0]} {opt.label.split(' ').slice(1).join(' ')}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
