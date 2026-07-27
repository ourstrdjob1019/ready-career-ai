import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MascotAri } from "../components";
import { Award, ArrowRight, Brain, Plus, CheckCircle2, Sparkles, Compass, BarChart3, Star, ShieldCheck } from "lucide-react";
import configData from "../data/assessment_config.json";
import { useSelfUnderstanding } from "../context";

interface JobData {
  name: string;
  image: string;
  category: string;
  summary?: string;
}

export const TestResult: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment, assessments } = useSelfUnderstanding();
  const [resultCode, setResultCode] = useState("SI");
  const [primaryType, setPrimaryType] = useState("S");
  const [customJob, setCustomJob] = useState("");
  const [savedJobs, setSavedJobs] = useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem("riasec_result_code") || "SI";
    const primary = localStorage.getItem("riasec_primary") || "S";
    setResultCode(code);
    setPrimaryType(primary);
    localStorage.setItem("readycareer_interest_type", primary);
    localStorage.setItem("riasec_result_code", code);

    const clusters: JobData[] = (configData.job_clusters as any)[primary] || (configData.job_clusters as any)["I"] || [];
    setSavedJobs(clusters);
    if (clusters.length > 0) {
      setSelectedJob(clusters[0]);
    }

    // 진단 허브 1번 항목(흥미무드) 완료 실시간 동기화
    completeAssessment("test-interest", 100, `Holland RIASEC [${code}] 흥미무드 진단 완수 (${primary} 유형)`);
  }, []);

  // 남은 2종 진단까지 모두 완료했는지 체크 (테스트 2, 3번이 완료됨 상태인지)
  const otherTestsDone = assessments.filter(a => a.id !== "test-interest").every(a => a.status === "완료됨");
  const allTestsDone = otherTestsDone; // 흥미검사는 현재 페이지 진입 시 완료됨

  const interpText = (configData.interpretation_templates as any)[primaryType] || configData.interpretation_templates.S;

  // 6유형 실전 점수 및 설명 로드 (Bento Grid 리포트용)
  const rawScores = JSON.parse(localStorage.getItem("riasec_result_scores") || "{}");
  const defaultScores: Record<string, number> = { R: 18, I: 24, A: 20, S: 28, E: 21, C: 16 };
  const riasecScores: Record<string, number> = Object.keys(rawScores).length > 0 ? rawScores : defaultScores;
  const maxScore = Math.max(...Object.values(riasecScores), 30);

  const hollandInfo: Record<string, { title: string; subtitle: string; desc: string; color: string; badge: string }> = {
    R: { title: "R 현실형", subtitle: "Doers · 현장 실천 역량", desc: "도구와 사물, 정교한 시스템을 실용적으로 다루며 즉각적이고 구체적인 성과를 도출해 내는 현장 실전형 역량입니다.", color: "from-blue-600 to-cyan-500", badge: "bg-[#EBF3FF] text-[#0C3D91] border-[#81AEF9]" },
    I: { title: "I 탐구형", subtitle: "Thinkers · 아이디어 분석 역량", desc: "논리적인 분석, AI 원리 파악 및 복잡한 데이터 이슈를 심도 있게 탐구하여 해답을 찾아내는 전문 학문 역량입니다.", color: "from-purple-600 to-indigo-500", badge: "bg-[#F0ECFF] text-[#3E1A9E] border-[#A991EE]" },
    A: { title: "A 예술형", subtitle: "Creators · 독창적 크리에이터", desc: "자유로운 상상력과 차별화된 방식으로 미적 직관, 감동적인 스토리텔링, 디자인 콘텐츠를 기획하는 창의 역량입니다.", color: "from-pink-600 to-rose-500", badge: "bg-[#FFEAF1] text-[#8E103E] border-[#F88BB4]" },
    S: { title: "S 사회형", subtitle: "Helpers · 따뜻한 소통 리더십", desc: "사람들과 친밀하게 소통하고 봉사와 교육, 멘토링을 통해 구성원 모두의 동반 성장을 헌신적으로 이끄는 사회 역량입니다.", color: "from-amber-500 to-orange-500", badge: "bg-[#FFF6E5] text-[#8C5A00] border-[#FFCA6A]" },
    E: { title: "E 진취형", subtitle: "Persuaders · 비전 주도 챔피언", desc: "조직의 명확한 목표를 제시하고 열정적인 설득과 주도력을 발휘하여 프로젝트의 기회를 창출해 내는 도전 역량입니다.", color: "from-emerald-600 to-teal-500", badge: "bg-[#E8FCF1] text-[#0A6032] border-[#75DDA4]" },
    C: { title: "C 관습형", subtitle: "Organizers · 완벽한 체계 관리자", desc: "정확한 데이터 검증과 체계적인 질서 유지, 매뉴얼 준수와 책임감으로 조직의 깊은 신뢰를 유지하는 관리 역량입니다.", color: "from-sky-600 to-blue-600", badge: "bg-[#E8F6FF] text-[#0D5482] border-[#70BFEF]" },
  };

  const handleAddCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJob.trim()) return;
    const newJob: JobData = {
      name: customJob.trim(),
      image: "🌟",
      category: "나만의 직접 입력",
      summary: "내가 스스로 주도하여 개척하기로 결심한 2026 맞춤형 융합 커리어 비전 목표입니다.",
    };
    setSavedJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    setIsConfirmed(false);
    setCustomJob("");
  };

  const handleConfirmCareer = () => {
    setIsConfirmed(true);
    if (selectedJob) {
      localStorage.setItem("confirmed_career_goal", JSON.stringify(selectedJob));
      localStorage.setItem("my_interested_jobs", JSON.stringify(savedJobs));
    }
  };

  const handleFinish = () => {
    localStorage.setItem("my_interested_jobs", JSON.stringify(savedJobs));
    localStorage.setItem("readycareer_interest_type", primaryType);
    localStorage.setItem("riasec_result_code", resultCode);
    
    // 마이페이지에 활동 리포트 실천 내역으로 자동 저장
    const existingActs = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
    const newAct = {
      id: "act-riasec-" + Date.now(),
      title: `[자기이해 진단 1/3] Holland RIASEC 흥미무드 진단 완수 (${resultCode} 유형)`,
      category: "자기이해 진단",
      exp: "+50 EXP",
      date: new Date().toLocaleDateString("ko-KR"),
      reflection: interpText
    };
    localStorage.setItem("readycareer_student_activities_v1", JSON.stringify([newAct, ...existingActs]));

    // 항상 진단 3가지 선택하는 허브 페이지로 돌아가서 남은 진단 또는 최종 종합 직업 선택을 진행
    navigate("/self-understanding?onboarding=true");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 selection:bg-primary/20 animate-fadeIn">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-[#5538EE]/15 text-[#5538EE] px-4 py-1 rounded-full text-xs font-headline font-black shadow-inner whitespace-nowrap border border-[#5538EE]/20">
          <Brain className="w-4 h-4 text-[#5538EE] animate-pulse flex-shrink-0" />
          <span>Holland RIASEC 실전 6유형 진단 분석 완수 리포트</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-black text-[#1A1626] tracking-tight">
          회원님은 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5538EE] to-[#7B5CF0]">[{resultCode}] 유형</span>에 가깝습니다!
        </h1>
        <p className="text-sm md:text-base text-[#4A435A] font-extrabold max-w-2xl mx-auto leading-relaxed">
          {interpText}
        </p>
      </div>

      {/* Bento Grid & Glassmorphism RIASEC 6유형 실전 진단 정밀 리포트 */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#E3E1E9] pb-4">
          <div>
            <h2 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#5538EE] flex-shrink-0" />
              <span>실전 6유형 흥미 역량 정밀 리포트 (Bento Grid Assessment)</span>
            </h2>
            <p className="text-xs md:text-sm font-bold text-[#4A435A]">
              회원님이 응답하신 실전 진단 데이터를 6대 지표로 시각화한 결과입니다. 상위 Top 2 역량이 조합되어 회원님의 맞춤 진로 성형을 결정합니다.
            </p>
          </div>
          <span className="bg-[#EBE9F8] text-[#3E25B7] font-extrabold text-xs px-3.5 py-1.5 rounded-xl self-start md:self-auto border border-[#B3A8EE]">
            ✨ 글래스모피즘 정밀 리포트
          </span>
        </div>

        {/* Bento Grid layout - 100% 가공 없는 정교한 간격 및 시인성 최적화 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(hollandInfo).map((typeKey) => {
            const info = hollandInfo[typeKey];
            const scoreVal = riasecScores[typeKey] || 15;
            const percentage = Math.min(100, Math.round((scoreVal / maxScore) * 100));
            const isTopType = resultCode.includes(typeKey);
            const isFirstType = resultCode[0] === typeKey;

            return (
              <div
                key={typeKey}
                className={`rounded-[30px] p-7 sm:p-8 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[290px] border-2 shadow-lg ${
                  isTopType
                    ? "border-[#6240D5] bg-gradient-to-b from-[#F5EEFF] via-white to-white shadow-[0_15px_35px_rgba(98,64,213,0.18)] ring-2 ring-[#6240D5]/25"
                    : "border-[#D4CFE5] bg-white hover:border-[#6240D5]/60 hover:shadow-xl"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-headline font-black border shadow-sm ${info.badge}`}>
                      {info.title}
                    </span>
                    {isTopType && (
                      <span className="inline-flex items-center gap-1 bg-[#6240D5] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md border border-[#8C6CEE]">
                        <Star className="w-3.5 h-3.5 fill-current text-yellow-300 flex-shrink-0" />
                        <span>{isFirstType ? "Top 1 최우수 강점" : "Top 2 융합 강점"}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-xl font-headline font-black text-[#1A1626] mb-2.5 leading-snug">
                      {info.subtitle}
                    </h3>
                    <p className="text-sm text-[#2D283E] font-extrabold leading-relaxed">
                      {info.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t-2 border-[#E5E2F0] space-y-2.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-black text-[#383348] flex items-center gap-1">
                      <span>💡 역량 발현 지표</span>
                    </span>
                    <span className="font-black text-[#6240D5] text-sm sm:text-base">{scoreVal}점 ({percentage}%)</span>
                  </div>
                  <div className="h-3 w-full bg-[#E4E1EF] rounded-full overflow-hidden p-0.5 shadow-inner border border-[#C5BFD9]/40">
                    <div
                      className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all duration-700 shadow-sm`}
                      style={{ width: `${Math.max(8, percentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI 코칭 리포트 및 안내 (글래스모피즘 + 가독성 최적화) */}
      <div className="bg-[#F6F4FF]/95 backdrop-blur-2xl border-2 border-[#5538EE]/30 rounded-[32px] p-7 md:p-9 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-[#1A1626]">
        <div className="space-y-3 flex-1">
          <span className="text-xs font-headline font-black text-[#5538EE] bg-white px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm border border-[#5538EE]/20">
            <ShieldCheck className="w-4 h-4 text-[#5538EE]" />
            <span>🤖 AI 아리(Ari)의 6유형 실전 정밀 진단 리포트 요약</span>
          </span>
          <h3 className="text-xl md:text-2xl font-headline font-black text-[#1A1626] leading-snug">
            회원님은 {resultCode} 성향의 독보적인 강점을 지닌 미래 커리어 프런티어입니다!
          </h3>
          <p className="text-sm text-[#3E384D] leading-relaxed font-extrabold">
            본 1차 흥미무드 진단 리포트는 회원님의 마이페이지에 자동으로 보존됩니다. <strong>진단 3종 모듈(흥미무드 + 다중지능 + 학습스타일)</strong>의 3개 관문이 모두 완료되면, 세상에 단 하나뿐인 AI 맞춤 관심 직업 6선 및 실전 별자리 로드맵 스튜디오가 자동 열립니다.
          </p>
        </div>
        <MascotAri
          pose="celebrate"
          size="md"
          rotate={true}
          bubbleTitle={`💎 ${resultCode} 실전 역량 완성!`}
          bubbleMessage="마이페이지에 1차 리포트를 저장하고 다음 진단 관문을 이어가보자!"
        />
      </div>

      {/* Interested Jobs Selection Grid - Only visible when ALL 3 diagnostic tests are completed */}
      {!allTestsDone ? null : (
        <>
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E1E9] pb-3">
              <div>
                <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#5538EE] flex-shrink-0" />
                  <span>맞춤 추천 직업군 및 내 관심 직업 (3종 진단 완료 특권)</span>
                </h3>
                <span className="text-xs text-[#4A435A] font-extrabold whitespace-nowrap">클릭하여 직업 상세 정보를 열람하고 대표 진로로 설정할 수 있습니다.</span>
              </div>

              {/* Custom job form */}
              <form onSubmit={handleAddCustomJob} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="예: 스포츠 데이터 전문 분석사"
                  value={customJob}
                  onChange={(e) => setCustomJob(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-[#5538EE]/40 rounded-2xl text-xs md:text-sm focus:ring-2 focus:ring-[#5538EE] font-black text-[#1A1626] w-52 md:w-64 shadow-inner"
                />
                <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-4 h-4 flex-shrink-0" />} className="font-extrabold whitespace-nowrap shadow-sm">
                  + 직접 작성 추가
                </Button>
              </form>
            </div>

            {/* Job Grid with Bento style & Glassmorphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedJobs.map((job, idx) => {
                const isSelected = selectedJob?.name === job.name;
                return (
                  <div
                    key={`${job.name}-${idx}`}
                    onClick={() => {
                      setSelectedJob(job);
                      setIsConfirmed(false);
                    }}
                    className={`p-5 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-between gap-3 shadow-md backdrop-blur-xl ${
                      isSelected
                        ? "bg-gradient-to-br from-purple-100/90 to-white border-[#5538EE] scale-105 shadow-xl ring-2 ring-[#5538EE]/30"
                        : "bg-white/90 border-[#E3E1E9] hover:border-[#5538EE]/60 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-[#E3E1E9]">
                      {job.image}
                    </div>
                    <div>
                      <span className="text-[11px] font-headline font-black text-[#3E25B7] bg-[#EBE9F8] px-3 py-0.5 rounded-full inline-block mb-1.5 whitespace-nowrap border border-[#B3A8EE]/50">
                        {job.category}
                      </span>
                      <strong className="text-sm md:text-base font-headline font-black text-[#1A1626] block leading-tight">
                        {job.name}
                      </strong>
                    </div>
                    {isSelected ? (
                      <span className="w-full py-1.5 px-2 rounded-xl bg-[#5538EE] text-white text-[11px] font-black shadow-sm whitespace-nowrap text-center">
                        ★ 선택됨 (아래 상세 열람)
                      </span>
                    ) : (
                      <span className="w-full py-1.5 px-2 rounded-xl bg-slate-100 text-[#4A435A] text-[11px] font-extrabold whitespace-nowrap text-center">
                        터치하여 상세 보기
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* DETAILED CAREER VIEW */}
          {selectedJob && (
            <section className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-8 border-2 border-[#5538EE]/40 shadow-[0_20px_50px_rgba(85,56,238,0.15)] space-y-8 animate-fadeIn relative overflow-hidden text-[#1A1626]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7af1fc]/20 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E3E1E9] pb-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-[#5538EE]/10 text-[#3E25B7] px-3.5 py-1 rounded-full text-xs font-headline font-black border border-[#5538EE]/30 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-[#5538EE] flex-shrink-0" />
                    <span>ReadyCareer AI &middot; 직업 상세 정보 및 로드맵 연동</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1A1626] flex items-center gap-3">
                    <span className="text-4xl">{selectedJob.image}</span>
                    <span>{selectedJob.name}</span>
                  </h2>
                  <p className="text-sm text-[#1A1626] font-extrabold leading-relaxed bg-[#F8F9FE] p-4.5 rounded-2xl border border-[#D5D1EB]">
                    💡 <strong>직무 개요 (`jobs.summary`):</strong> {selectedJob.summary || "청소년의 미래 비전과 맞춤 역량이 발달하는 2026 핵심 선도 직군입니다. 내 흥미 강점을 극대화하여 전문적인 진로 탐색을 떠나보세요."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleConfirmCareer}
                    className={`px-7 py-4 rounded-full font-headline font-black text-sm transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap flex items-center gap-2 ${
                      isConfirmed
                        ? "bg-[#006970] text-white shadow-[0_10px_25px_rgba(0,105,112,0.3)] ring-4 ring-[#7af1fc]/50"
                        : "bg-gradient-to-r from-[#5538EE] to-[#7B5CF0] text-white shadow-[0_10px_25px_rgba(85,56,238,0.35)]"
                    }`}
                  >
                    <Compass className="w-4 h-4 flex-shrink-0" />
                    <span>{isConfirmed ? "✨ 진로 확정 완료 (별자리 로드맵 활성화)" : "🚀 이 진로로 확정하고 꿈 켜기 (+20 EXP 획득!)"}</span>
                  </button>
                </div>
              </div>

              {/* Confirmation Celebration */}
              {isConfirmed && (
                <div className="bg-gradient-to-r from-[#5538EE] to-[#3E25B7] p-7 rounded-[28px] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 animate-bounce-once border-2 border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                      🏆
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-white text-[#3E25B7] px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                          +20 EXP 획득! 🌟
                        </span>
                        <span className="text-xs font-black text-violet-200">누적 EXP 보증서 지급됨</span>
                      </div>
                      <h4 className="text-lg font-black leading-tight text-white">진로 확정 성공! '{selectedJob.name}' 별자리 로드맵이 활성화되었습니다.</h4>
                      <p className="text-xs text-white/95 leading-relaxed font-bold">
                        마이페이지 및 AI 생기부 별자리 로드맵에 선택하신 비전 목표가 실각 연계되어 맞춤 퀘스트가 제공됩니다!
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/mypage")}
                    className="font-black whitespace-nowrap bg-white text-[#3E25B7] border-white shadow-md hover:bg-white/90 px-5 py-3 rounded-xl"
                  >
                    🏅 누적 마이페이지 확인 &rarr;
                  </Button>
                </div>
              )}

              <div className="bg-[#F6F4FF]/90 p-5 rounded-2xl border border-[#D5D1EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-black text-[#3E384D]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5538EE] flex-shrink-0" />
                  <span>선택한 직무(`riasec_code: {primaryType}`)는 현장 박람회 AI 서버리스 진로 분석 및 생기부 초안 가이드에 자동 연결됩니다.</span>
                </span>
                <span className="bg-white px-3.5 py-1 rounded-full text-[#1A1626] border border-[#B3A8EE] whitespace-nowrap font-black shadow-sm">
                  ● ReadyCareer AI &middot; 맞춤 커리어 세팅 완료
                </span>
              </div>
            </section>
          )}
        </>
      )}

      {/* Main CTA to proceed */}
      <div className="pt-4 flex justify-center">
        <Button
          variant="teal"
          size="lg"
          onClick={handleFinish}
          icon={<ArrowRight className="w-6 h-6 flex-shrink-0" />}
          className="font-headline font-extrabold px-10 py-5 shadow-2xl hover:scale-105 transition-transform text-lg whitespace-nowrap bg-[#5538EE] hover:bg-[#4127BE] text-white border-none"
        >
          {!allTestsDone
            ? "💾 리포트 생성 및 마이페이지에 저장 후, 남은 진단 마저 하기 (목록 복귀) →"
            : "💾 리포트 마이페이지에 저장 후 3종 종합 선택 창으로 이동 →"}
        </Button>
      </div>

    </div>
  );
};

export default TestResult;

