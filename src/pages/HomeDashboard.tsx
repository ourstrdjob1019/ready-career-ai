import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL, JOB_VENGERS_LIST } from "../assets/mascotData";
import {
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Edit2,
  RefreshCw,
  Star,
  FolderCheck,
  Route,
  ListCheck,
  Award,
  Unlock,
  Play
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session, startExpoDemo } = useAuth();

  const [visionStatement, setVisionStatement] = useState<string>(() => {
    return localStorage.getItem("readycareer_vision_v1") || "AI 역량과 따뜻한 공감 능력으로 미래 산업을 혁신하는 차세대 마스터가 되겠습니다!";
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  
  // 관심 직업군 관리 상태 (온보딩 추천 직무 기본 연계)
  const [interestedJobs, setInterestedJobs] = useState<Array<{ name: string; image: string; category: string; imageUrl?: string }>>([]);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [newJobInput, setNewJobInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 로드맵 생성 및 4개 활동 모듈 오픈 상태 관리
  const [isRoadmapGenerated, setIsRoadmapGenerated] = useState<boolean>(() => {
    return localStorage.getItem("readycareer_roadmap_generated") === "true";
  });
  const [isGeneratingAnim, setIsGeneratingAnim] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("my_interested_jobs");
    if (savedJobs) {
      try { setInterestedJobs(JSON.parse(savedJobs)); } catch (e) {}
    } else {
      // 처음에 온보딩에서 추천했던 직급군들이 먼저 보이게 세팅!
      const storedSelectedJobJson = localStorage.getItem("readycareer_selected_job");
      let primaryJob = { name: "AI 융합 미래 전문가", image: "🤖", category: "대표 선택 직업", imageUrl: ARI_BLOB_URL };
      if (storedSelectedJobJson) {
        try {
          const parsed = JSON.parse(storedSelectedJobJson);
          primaryJob = { name: parsed.title, image: "⭐", category: parsed.category, imageUrl: parsed.imageUrl };
        } catch(e) {}
      }

      setInterestedJobs([
        primaryJob,
        { name: JOB_VENGERS_LIST[0].title, image: "👨‍🏫", category: JOB_VENGERS_LIST[0].category, imageUrl: JOB_VENGERS_LIST[0].imageUrl },
        { name: JOB_VENGERS_LIST[1].title, image: "🎨", category: JOB_VENGERS_LIST[1].category, imageUrl: JOB_VENGERS_LIST[1].imageUrl },
        { name: JOB_VENGERS_LIST[2].title, image: "🛰️", category: JOB_VENGERS_LIST[2].category, imageUrl: JOB_VENGERS_LIST[2].imageUrl },
      ]);
    }
  }, []);

  const handleSaveVision = () => {
    localStorage.setItem("readycareer_vision_v1", visionStatement);
    setIsEditingVision(false);
  };

  const handleAiSuggestVision = async () => {
    setIsAiLoading(true);
    const currentTarget = interestedJobs[selectedJobIdx]?.name || "AI 융합 디렉터";
    try {
      const res = await executeAiPrompt({
        promptType: "vision_recommendation",
        targetJob: currentTarget,
      });
      if (res.content && res.provider !== "expo-demo-fallback") {
        const cleaned = res.content.replace(/^["']|["']$/g, "").trim();
        setVisionStatement(cleaned);
        localStorage.setItem("readycareer_vision_v1", cleaned);
        setIsEditingVision(false);
        setIsAiLoading(false);
        return;
      }
    } catch (e) {
      console.warn("AI 비전 통신 불완전, 로컬 추천 풀로 진행합니다.", e);
    }

    const suggestions = [
      "인공지능과 혁신 기술로 세상의 난제를 해결하는 정의로운 테크 혁신가!",
      "따뜻한 공감 능력과 지식 융합으로 사람들의 꿈을 키우는 미래 교육 크리에이터!",
      "우주와 첨단 생태계를 아우르는 창의적인 글로벌 메가 아키텍트!",
    ];
    const randomOne = suggestions[Math.floor(Math.random() * suggestions.length)];
    setVisionStatement(randomOne);
    localStorage.setItem("readycareer_vision_v1", randomOne);
    setIsEditingVision(false);
    setIsAiLoading(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobInput.trim()) return;
    const added = [{ name: newJobInput.trim(), image: "🌟", category: "직접 추가" }, ...interestedJobs];
    setInterestedJobs(added);
    setSelectedJobIdx(0);
    localStorage.setItem("my_interested_jobs", JSON.stringify(added));
    setNewJobInput("");
  };

  // 🚀 + ReadyCareer AI 로드맵 생성하기 버튼 핸들러 (눌렀을 때 4개 모듈 등장!)
  const handleGenerateRoadmap = () => {
    setIsGeneratingAnim(true);
    setTimeout(() => {
      setIsRoadmapGenerated(true);
      localStorage.setItem("readycareer_roadmap_generated", "true");
      setIsGeneratingAnim(false);
    }, 600);
  };

  // 🎯 관심 직업 클릭 시 전체 시스템(진로포트폴리오/학습포트폴리오/보고서) 테마 완벽 동기화 핸들러
  const handleSelectJob = (idx: number) => {
    setSelectedJobIdx(idx);
    const selected = interestedJobs[idx];
    if (selected) {
      localStorage.setItem("readycareer_target_job_name", selected.name);
      localStorage.setItem("readycareer_selected_job", JSON.stringify({
        title: selected.name,
        category: selected.category || "선택 직무",
        imageUrl: selected.imageUrl || ARI_BLOB_URL,
        bgGradient: "from-[#F3EAFE] to-[#E3FBF5]",
        badgeColor: "bg-[#7B5CF0] text-white"
      }));
      if (selected.imageUrl) {
        localStorage.setItem("readycareer_custom_avatar_url", selected.imageUrl);
      }
      if (session) {
        startExpoDemo(session.role, {
          ...session,
          targetJob: selected.name,
        });
      }
    }
  };

  const currentJob = interestedJobs[selectedJobIdx] || { name: "AI 융합 개척자", image: "🤖", category: "탐색 중", imageUrl: ARI_BLOB_URL };
  const userName = localStorage.getItem("readycareer_student_name") || (session?.name && session.name.trim() !== "" ? session.name : "신규 꿈 탐구어");
  const userSchool = localStorage.getItem("readycareer_student_school") || (session?.school && session.school.trim() !== "" ? session.school : "창의융합 인공지능 고교");
  const userGrade = parseInt(localStorage.getItem("readycareer_student_grade")?.replace(/[^0-9]/g, "") || "") || session?.grade || 1;

  // 진단 결과 유형 및 캐릭터 아바타 URL 확인
  const storedRiasec = localStorage.getItem("riasec_result_code") || localStorage.getItem("readycareer_interest_type");
  const displayRiasec = (storedRiasec && storedRiasec !== "미진단") ? storedRiasec : "INNOVATOR";
  const storedCustomAvatar = localStorage.getItem("readycareer_custom_avatar_url");
  const displayAvatarUrl = storedCustomAvatar || currentJob.imageUrl || ARI_BLOB_URL;

  // 계급 뱃지 및 동기부여 등급 산출 시스템 (브론즈, 실버, 골드, 다이아, 마스터)
  const isNewStudentClean = localStorage.getItem("is_new_student_clean_state") === "true";
  const allActivities = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
  const practiceActivities = allActivities.filter((a: any) => !a.id?.startsWith("act-riasec-") && !a.id?.startsWith("act-star-"));
  const computedXP = isNewStudentClean ? (practiceActivities.length * 60) : Math.min(500, 320 + (practiceActivities.length * 60));
  const currentXP = Math.min(500, Math.max(0, computedXP));
  const maxXP = 500;
  const progressPercent = Math.round((currentXP / maxXP) * 100);

  let rankBadge = { title: "🥉 브론즈 탐구어", classBadge: "[ 🥉 브론즈 클래스 ]", glow: "from-amber-600 to-amber-800", textColor: "text-amber-200", border: "border-amber-400" };
  if (currentXP >= 350) {
    rankBadge = { title: "👑 마스터 아키텍트", classBadge: "[ 👑 최고 권위 마스터 랭크 ]", glow: "from-emerald-400 via-amber-300 to-purple-500", textColor: "text-amber-300 font-black animate-pulse", border: "border-emerald-300" };
  } else if (currentXP >= 240) {
    rankBadge = { title: "💎 다이아 엑스퍼트", classBadge: "[ 💎 다이아 클래스 ]", glow: "from-cyan-400 to-blue-600", textColor: "text-cyan-200", border: "border-cyan-300" };
  } else if (currentXP >= 120) {
    rankBadge = { title: "🥇 골드 프로젝트 리더", classBadge: "[ 🥇 골드 클래스 ]", glow: "from-yellow-400 to-amber-600", textColor: "text-yellow-200", border: "border-yellow-300" };
  } else if (currentXP >= 60) {
    rankBadge = { title: "🥈 실버 지식 융합러", classBadge: "[ 🥈 실버 클래스 ]", glow: "from-slate-300 to-slate-500", textColor: "text-slate-200", border: "border-slate-300" };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-12 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* =========================================================================
          SECTION 1: User Welcome Header & Rank Badges
         ========================================================================= */}
      <div className="space-y-2.5 pl-2">
        <div className="flex flex-wrap items-center gap-2.5 mb-1">
          <span className="text-xs font-headline font-black bg-purple-100 text-[#6240D5] px-3.5 py-1.5 rounded-full border border-purple-200 shadow-sm flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#7B5CF0] fill-[#7B5CF0]" />
            <span>★ 선택 직업: {currentJob.name}</span>
          </span>
          <span className={`text-xs font-black px-4 py-1.5 rounded-full border shadow-sm bg-gradient-to-r ${rankBadge.glow} text-white`}>
            {rankBadge.classBadge}
          </span>
          <span className="text-xs font-black text-[#006970] bg-[#E5FAFC] px-3.5 py-1.5 rounded-full border border-[#B0EFF7] shadow-sm">
            ✨ 진단 유형: {displayRiasec}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-[#1A1626] tracking-tight">
          {userName}님, 안녕하세요! 🚀
        </h2>
        <p className="text-sm sm:text-base font-semibold text-[#5C5672]">
          {userSchool} ({userGrade}학년) · {rankBadge.title}의 품격으로 진로 별자리 로드맵을 완성해 나가세요!
        </p>
      </div>

      {/* =========================================================================
          SECTION 2: 상단 네모박스 (메인 마스코트를 가장 크게! 명칭 계급 뱃지 탑재)
         ========================================================================= */}
      <section className="relative rounded-[36px] overflow-hidden bg-gradient-to-r from-[#7B5CF0] via-[#653FE2] to-[#36139C] shadow-[0px_16px_48px_rgba(123,92,240,0.28)] text-white p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 border-4 border-white/25">
        
        {/* Ambient Halo behind Character */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-white/20 via-pink-400/20 to-cyan-400/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="space-y-6 z-10 w-full md:w-3/5 text-center md:text-left">
          
          {/* 단계에 맞는 명칭 및 계급 뱃지 */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full font-black text-xs sm:text-sm tracking-wide border-2 border-white/40 shadow-xl">
            <Award className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className={rankBadge.textColor}>{rankBadge.title} 단계 장착됨!</span>
          </div>
          
          <div>
            <p className="text-[#DFD7FF] text-xs sm:text-sm font-headline uppercase tracking-wider mb-1 font-extrabold">
              🎯 나의 꿈의 별자리 (MY PRIMARY TARGET JOB)
            </p>
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-headline font-black text-white tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
              {currentJob.name}
            </h3>
          </div>

          {/* Vision Statement box inside Hero */}
          <div className="bg-white/15 backdrop-blur-xl rounded-[28px] p-5 border-2 border-white/30 space-y-2.5 shadow-xl text-left">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-[#EFEAFF]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>나만의 비전 선언문 (Vision Statement)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiSuggestVision}
                  disabled={isAiLoading}
                  className="px-3 py-1 rounded-xl bg-[#008A90] text-white font-black text-xs hover:brightness-115 transition-all flex items-center gap-1 shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin" : ""}`} />
                  <span>AI 자동 추천</span>
                </button>
                <button
                  onClick={() => setIsEditingVision(!isEditingVision)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="직접 수정하기"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditingVision ? (
              <div className="flex gap-2.5 mt-2">
                <input
                  type="text"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-2xl border-2 border-white/60 bg-black/40 text-xs sm:text-sm font-bold text-white placeholder:text-white/60 focus:outline-none shadow-inner"
                />
                <button onClick={handleSaveVision} className="px-5 py-2 bg-white text-[#6240D5] rounded-2xl text-xs sm:text-sm font-black shadow-lg">
                  저장
                </button>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-headline font-black text-white italic leading-relaxed drop-shadow-sm">
                "{visionStatement}"
              </p>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 w-full max-w-lg pt-1">
            <div className="flex justify-between text-xs sm:text-sm font-extrabold text-[#F2EEFF]">
              <span>성장 진행도 ({rankBadge.title})</span>
              <span className="font-black text-white bg-black/30 px-3 py-0.5 rounded-full border border-white/20">{currentXP} / {maxXP} XP ({progressPercent}%)</span>
            </div>
            <div className="h-4 w-full bg-black/30 rounded-full overflow-hidden shadow-inner p-1 border-2 border-white/35">
              <div className="h-full bg-gradient-to-r from-[#7EF4FE] via-[#FF80B5] to-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.95)] transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

        </div>

        {/* PROMINENT HUGE 3D MASCOT CHARACTER SHOWCASE (메인 캐릭터를 가장 크게 보여지게 구현) */}
        <div className="z-10 flex flex-col items-center justify-center relative w-full md:w-2/5 my-4 md:my-0">
          <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-white/20 backdrop-blur-md p-6 border-4 border-white/50 shadow-[0_25px_65px_rgba(0,0,0,0.45)] flex items-center justify-center transform hover:scale-105 hover:rotate-2 transition-all duration-500 group relative">
            
            {/* Rank Crown Emoji floating above character */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/95 text-3xl sm:text-4xl p-3 rounded-3xl shadow-2xl border-2 border-purple-200 animate-bounce">
              {currentXP >= 350 ? "👑" : currentXP >= 240 ? "💎" : currentXP >= 120 ? "🥇" : currentXP >= 60 ? "🥈" : "🌱"}
            </span>

            <img
              src={displayAvatarUrl}
              alt="My Primary 3D Job Character"
              className="w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          <div className="mt-4 bg-white/90 text-[#1A1626] px-6 py-2 rounded-full font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            <span>✨ 현재 장착 마이 어시스턴트 아리</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: AI자기이해 진단 및 로드맵 생성 버튼 ➜ 누르면 4개 실전 활동 나타남
         ========================================================================= */}
      <div className="space-y-6">
        
        {/* AI 자기이해 진단 및 아리 가이던스 네모박스 (트리거 탑재) */}
        <div className="rounded-[36px] bg-gradient-to-r from-[#F7F4FF] via-[#F2EEFF] to-[#E5FAFF] p-7 sm:p-10 border-4 border-[#DED4FF] shadow-[0_16px_40px_rgba(123,92,240,0.14)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-grow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] bg-white shadow-xl flex items-center justify-center border-4 border-white p-3 flex-shrink-0">
              <img src={ARI_BLOB_URL} alt="Ari Guidance" className="w-full h-full object-contain animate-float" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#6240D5] text-white px-4 py-1 rounded-full text-xs font-black shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI 자기이해 진단 및 아리 가이던스</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1626] tracking-tight">
                나만의 맞춤 진로 보고서 &amp; 별자리 로드맵 개설하기
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#5C5672] leading-relaxed">
                6유형 진학 흥미 검사 결과를 분석하여, 오직 회원님만을 위한 <strong>별자리 로드맵 · 습관 &amp; 목표 · 포트폴리오 · 세특 활동기록</strong>을 원클릭으로 생성해 드립니다!
              </p>
            </div>
          </div>

          {/* + 부분 로드맵 생성 버튼 (클릭 시 4개 모듈 나타남!) */}
          <div className="flex-shrink-0 w-full sm:w-auto text-center">
            {!isRoadmapGenerated ? (
              <div className="p-2 rounded-[34px] bg-gradient-to-r from-[#7B5CF0] via-[#FF4081] to-[#008A90] shadow-[0_10px_35px_rgba(123,92,240,0.4)] hover:shadow-[0_15px_50px_rgba(255,64,129,0.6)] transition-all duration-300 animate-bounce-once">
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingAnim}
                  className="w-full sm:w-auto py-5 px-8 rounded-[28px] bg-gradient-to-r from-[#7B5CF0] to-[#5C32E3] hover:from-[#886AF7] hover:to-[#4A20D2] text-white font-black text-lg sm:text-xl border-2 border-white/85 border-b-[8px] border-b-[#3F1BA6] active:translate-y-1 active:border-b-2 transition-all flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer shadow-2xl"
                >
                  <span className="text-2xl sm:text-3xl">🚀</span>
                  <span>{isGeneratingAnim ? "AI 로드맵 생성 및 변환 중..." : "+ ReadyCareer AI 로드맵 생성하기"}</span>
                  <Plus className="w-7 h-7 stroke-[3] text-white" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/15 text-[#059669] rounded-2xl font-black text-xs sm:text-sm border border-green-300 shadow-sm">
                  <Unlock className="w-4 h-4 text-green-600" />
                  <span>✅ 4대 실전 진로 활동 모듈 개방 완료!</span>
                </span>
                <button
                  onClick={() => { setIsRoadmapGenerated(false); localStorage.removeItem("readycareer_roadmap_generated"); }}
                  className="text-xs font-bold text-[#6E6A80] hover:text-[#7B5CF0] underline decoration-1"
                >
                  (시연용: 로드맵 접기/초기화)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 생성기 애니메이션 또는 4대 활동 모듈 오버뷰 (별자리 로드맵, 습관&목표, 진로포트폴리오, 활동기록작성이 그때 보여지게!) */}
        {isGeneratingAnim && (
          <div className="w-full py-12 text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-[#7B5CF0] text-white text-3xl flex items-center justify-center mx-auto shadow-xl animate-spin-slow">
              ✨
            </div>
            <h4 className="text-xl font-black text-[#6240D5]">
              AI 멘토 아리가 회원님의 4대 실전 활동 별자리를 구축하고 있습니다...
            </h4>
          </div>
        )}

        {isRoadmapGenerated && !isGeneratingAnim && (
          <div className="space-y-4 animate-fadeIn pt-4">
            <div className="pl-2 flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
                <span>🌌 실전 맞춤 진로 활동 4대 모듈</span>
                <span className="text-xs bg-[#7B5CF0] text-white px-3 py-1 rounded-full font-bold">오픈됨</span>
              </h3>
              <span className="text-xs sm:text-sm font-extrabold text-[#7B5CF0]">
                ⚡ 원하는 모듈을 터치하여 바로 진로 마일리지를 쌓으세요!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: 별자리 로드맵 */}
              <Link to="/roadmap" className="block h-full group">
                <div className="bg-white rounded-[32px] p-7 shadow-[0_12px_35px_rgba(123,92,240,0.12)] hover:shadow-[0_20px_55px_rgba(123,92,240,0.25)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-full min-h-[200px] border-2 border-[#EADFFF] group-hover:border-[#7B5CF0] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[50px] -z-0 pointer-events-none" />
                  <div className="space-y-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#7B5CF0] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Route className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black bg-purple-100 text-[#7B5CF0] px-2.5 py-0.5 rounded-md block w-fit mb-1.5">
                        STEP 1. 심화 지식
                      </span>
                      <h4 className="text-xl font-headline font-black text-[#1A1626] group-hover:text-[#7B5CF0] transition-colors">
                        📘 AI 학습포트폴리오 (코넬노트)
                      </h4>
                      <p className="text-xs text-[#5B556D] mt-2 font-bold leading-relaxed bg-[#F9F7FF] p-3 rounded-2xl border border-purple-50">
                        과목별 핵심 요약 작성 시 AI가 스마트 정리 및 셀프 퀴즈 생성 누적!
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-black text-[#7B5CF0]">
                    <span>학습 노트 보관함 접속 &rarr;</span>
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </Link>

              {/* Card 2: 습관 & 목표 */}
              <Link to="/habits" className="block h-full group">
                <div className="bg-white rounded-[32px] p-7 shadow-[0_12px_35px_rgba(123,92,240,0.12)] hover:shadow-[0_20px_55px_rgba(0,138,144,0.25)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-full min-h-[200px] border-2 border-[#CBF7FB] group-hover:border-[#008A90] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-[50px] -z-0 pointer-events-none" />
                  <div className="space-y-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#008A90] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ListCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black bg-cyan-100 text-[#008A90] px-2.5 py-0.5 rounded-md block w-fit mb-1.5">
                        STEP 2. 꾸준한 실천
                      </span>
                      <h4 className="text-xl font-headline font-black text-[#1A1626] group-hover:text-[#008A90] transition-colors">
                        🎯 습관 &amp; 목표 관리
                      </h4>
                      <p className="text-xs text-[#5B556D] mt-2 font-bold leading-relaxed bg-[#F2FEFF] p-3 rounded-2xl border border-cyan-50">
                        매일매일 실천하는 루틴 챌린지 및 7일차 연속 스트릭 마일리지 적립
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-between text-xs font-black text-[#008A90]">
                    <span>습관 대시보드 입장 &rarr;</span>
                    <Play className="w-4 h-4 fill-current text-[#008A90]" />
                  </div>
                </div>
              </Link>

              {/* Card 3: 진로 포트폴리오 */}
              <Link to="/portfolio" className="block h-full group">
                <div className="bg-white rounded-[32px] p-7 shadow-[0_12px_35px_rgba(123,92,240,0.12)] hover:shadow-[0_20px_55px_rgba(255,64,129,0.25)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-full min-h-[200px] border-2 border-[#FFD1E3] group-hover:border-[#FF4081] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-[50px] -z-0 pointer-events-none" />
                  <div className="space-y-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF4081] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FolderCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black bg-pink-100 text-[#FF2A72] px-2.5 py-0.5 rounded-md block w-fit mb-1.5">
                        STEP 3. 누적 성과
                      </span>
                      <h4 className="text-xl font-headline font-black text-[#1A1626] group-hover:text-[#FF4081] transition-colors">
                        📁 진로 포트폴리오
                      </h4>
                      <p className="text-xs text-[#5B556D] mt-2 font-bold leading-relaxed bg-[#FFF5F9] p-3 rounded-2xl border border-pink-50">
                        학기별 활동 성실도와 AI 역량 진단 보고서를 열람하고 다운로드!
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-black text-[#FF4081]">
                    <span>보관함 확인하기 &rarr;</span>
                    <Play className="w-4 h-4 fill-current text-[#FF4081]" />
                  </div>
                </div>
              </Link>

              {/* Card 4: 활동 기록 작성 */}
              <Link to="/activity-form" className="block h-full group">
                <div className="bg-gradient-to-br from-[#F5F2FF] via-white to-[#EEFAFF] rounded-[32px] p-7 shadow-[0_15px_40px_rgba(123,92,240,0.16)] hover:shadow-[0_25px_60px_rgba(123,92,240,0.3)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-full min-h-[200px] border-4 border-[#8C74FF] group-hover:border-[#6240D5] relative overflow-hidden">
                  <div className="space-y-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#6240D5] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse">
                      <Edit2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black bg-[#6240D5] text-white px-3 py-1 rounded-full block w-fit mb-1.5 shadow-sm">
                        🔥 NEW +60 EXP 적립
                      </span>
                      <h4 className="text-xl font-headline font-black text-[#6240D5]">
                        ✍️ 활동 기록 작성
                      </h4>
                      <p className="text-xs text-[#4E4962] mt-2 font-extrabold leading-relaxed bg-white p-3 rounded-2xl border border-purple-100 shadow-sm">
                        NEIS 생기부 100% 반영 세탁 문구 기재 및 AI 자동 문구 교정!
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between text-xs font-black text-[#6240D5]">
                    <span>새 기록 작성 &rarr;</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          SECTION 4: 나의 관심 직업군 관리 (처음 추천했던 직업군이 기본으로 등장)
         ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[36px] p-8 sm:p-10 shadow-[0_15px_45px_rgba(123,92,240,0.1)] border-2 border-[#E7E0FF] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-purple-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#7B5CF0] animate-spin-slow" />
              <span>나의 관심 직업군 관리 (Career Target List)</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5672] font-semibold">
              ✨ <strong>처음 진단에서 추천받았던 직급군들</strong>이 자동으로 보존되어 있습니다! 카드를 클릭(터치)하면 상단 히어로 영역의 메인 마스코트로 실각 변경됩니다.
            </p>
          </div>

          {/* Add Job Form */}
          <form onSubmit={handleAddJob} className="flex items-center gap-2 max-w-md w-full">
            <input
              type="text"
              placeholder="예: AI 바이오 신약 데이터 연구원..."
              value={newJobInput}
              onChange={(e) => setNewJobInput(e.target.value)}
              className="flex-grow h-12 text-xs md:text-sm px-5 rounded-2xl bg-[#F8F5FF] border-2 border-[#E2DAFF] focus:border-[#7B5CF0] text-[#1A1626] placeholder:text-[#8D88A0] focus:outline-none focus:ring-2 focus:ring-[#7B5CF0]/20 font-bold transition-all shadow-inner"
            />
            <Button type="submit" variant="teal" size="sm" className="h-12 px-6 whitespace-nowrap font-black text-sm rounded-2xl shadow-md bg-[#008A90] hover:bg-[#00767C] text-white">
              <Plus className="w-4 h-4 mr-1 stroke-[3]" />
              추가
            </Button>
          </form>
        </div>

        {/* Interested Jobs Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {interestedJobs.map((job, idx) => {
            const isSelected = selectedJobIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSelectJob(idx)}
                className={`p-6 rounded-[28px] border-3 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 transform ${
                  isSelected
                    ? "bg-gradient-to-b from-[#E6FAFE] to-[#F2FEFF] border-[#008A90] shadow-[0_12px_30px_rgba(0,138,144,0.25)] scale-[1.03]"
                    : "bg-[#FAFAFF] border-[#E8DFFA] hover:bg-[#F3EFFF] hover:border-[#7B5CF0] hover:scale-101"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-sm ${isSelected ? "bg-[#008A90] text-white" : "bg-purple-100 text-[#6240D5]"}`}>
                    {isSelected ? "★ 현재 장착 메인" : `#${idx + 1} 후보 직문`}
                  </span>
                  {isSelected ? <CheckCircle2 className="w-6 h-6 text-[#008A90] fill-white animate-bounce-short" /> : <Star className="w-5 h-5 text-[#C3B7E8]" />}
                </div>

                {/* Thumbnail Avatar or Icon */}
                <div className="w-20 h-20 rounded-full bg-white p-2 shadow-sm border border-purple-100 mx-auto flex items-center justify-center my-2">
                  {job.imageUrl ? (
                    <img src={job.imageUrl} alt={job.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                  ) : (
                    <span className="text-4xl">{job.image}</span>
                  )}
                </div>

                <div className="text-center bg-white/90 p-3 rounded-2xl border border-purple-50 shadow-inner">
                  <span className="text-[10px] font-bold text-[#6E6A80] block mb-1">
                    {job.category}
                  </span>
                  <strong className={`text-sm font-black block tracking-tight truncate ${isSelected ? "text-[#008A90]" : "text-[#1A1626]"}`}>
                    {job.name}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
export default HomeDashboard;
