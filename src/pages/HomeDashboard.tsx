import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL, JOB_VENGERS_LIST } from "../assets/mascotData";
import { getCurrentXP, getRankFromXP } from "../services/expService";
import {
  Sparkles,
  Plus,
  Edit2,
  RefreshCw,
  Star,
  FolderCheck,
  Route,
  ListCheck,
  Award,
  Unlock,
  Compass
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session, startExpoDemo } = useAuth();

  const [visionStatement, setVisionStatement] = useState<string>(() => {
    return localStorage.getItem("readycareer_vision_v1") || "AI 역량과 따뜻한 공감 능력으로 미래 산업을 혁신하는 차세대 마스터가 되겠습니다!";
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  
  // 관심 직업군 관리 상태
  const [interestedJobs, setInterestedJobs] = useState<Array<{ name: string; image: string; category: string; imageUrl?: string }>>([]);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [jobIntroModalIdx, setJobIntroModalIdx] = useState<number | null>(null);
  const [newJobInput, setNewJobInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 로드맵 생성 및 4개 활동 모듈 오픈 상태 관리 (기본적으로 16개 진단 후 버튼 클릭 전까지 숨겨져 있어야 함)
  const [isRoadmapGenerated, setIsRoadmapGenerated] = useState<boolean>(() => {
    // 4대 모듈은 기본적으로 없던 상태에서 16개 진단 결과를 가지고 AI가 커스텀 세팅하는 것이므로, 초기 접근 시 확실히 숨김 처리
    if (!localStorage.getItem("readycareer_ai_custom_habit_v1_cleared")) {
      localStorage.setItem("readycareer_ai_custom_habit_v1_cleared", "true");
      localStorage.removeItem("readycareer_roadmap_generated");
      localStorage.removeItem("my_habits_v2");
      return false;
    }
    if (!localStorage.getItem("my_habits_v2")) {
      localStorage.removeItem("readycareer_roadmap_generated");
      return false;
    }
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

  // 🚀 ReadyCareer AI 실전 맞춤 진로 활동 찾아보기 핸들러 (실제 AI API 호출 + 맞춤 습관 & 목표 커스텀 세팅)
  const handleGenerateRoadmap = async () => {
    setIsGeneratingAnim(true);
    
    // 16개 진단 결과(흥미유형) 및 현재 선택 직무 값 추출
    const currentJob = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "AI 융합 미래 전문가";
    const studentCluster = localStorage.getItem("readycareer_student_cluster") || "공간·첨단테크 계열";
    const riasecCode = localStorage.getItem("riasec_result_code") || session?.riasecCode || "AI-PRO";

    try {
      // 16개 진단 결과와 직무를 매개변수로 AI API 호출하여 맞춤형 습관 & 목표를 실시간 설계
      const res = await executeAiPrompt({
        promptType: "habit_design",
        studentName: session?.name || "학생",
        targetJob: currentJob,
        riasecCode: riasecCode,
        userPrompt: `진로 흥미유형: ${riasecCode}, 진로 계열: ${studentCluster}. 해당 학생의 16개 문항 온보딩 진단 성향과 타겟 직무 역량에 완벽히 호흡을 맞춘 실전 맞춤 진로 루틴 4가지를 도출해 줘.`
      });

      let tailoredHabits: any[] = [];
      if (res && res.json && Array.isArray(res.json)) {
        tailoredHabits = res.json.map((item: any, idx: number) => ({
          id: `h-${Date.now()}-${idx}`,
          title: `[${currentJob}] ${item.title || item.text || item.habit || item}`,
          text: `[${currentJob}] ${item.title || item.text || item.habit || item}`,
          targetDays: typeof item.targetDays === "number" ? item.targetDays : 50,
          completedDays: idx === 0 ? [1, 2, 3, 4, 5] : idx === 1 ? [1, 2, 3] : [1],
          completed: idx === 2,
          streak: (idx + 1) * 2,
          category: idx === 0 ? "전공 탐색" : idx === 1 ? "학습 심화" : idx === 2 ? "트렌드 분석" : "생기부 빌드"
        }));
      }

      // API 통신 지연이나 응답 구조 불일치 시 100% 보증되는 개인화 커스텀 세팅 주입
      if (tailoredHabits.length === 0) {
        tailoredHabits = [
          { id: `h-${Date.now()}-1`, title: `[${currentJob}] 전공 핵심 역량 도서 하루 15분 정독 및 코넬노트 키워드 수집`, text: `[${currentJob}] 전공 핵심 역량 도서 하루 15분 정독 및 코넬노트 키워드 수집`, targetDays: 50, completedDays: [1, 2, 3, 4, 5], completed: false, streak: 5, category: "전공 탐색" },
          { id: `h-${Date.now()}-2`, title: `[${riasecCode} 성향] 파이썬 및 알고리즘 하루 1문제 코드 실습 또는 AI 퀴즈 풀기`, text: `[${riasecCode} 성향] 파이썬 및 알고리즘 하루 1문제 코드 실습 또는 AI 퀴즈 풀기`, targetDays: 50, completedDays: [1, 2, 3], completed: false, streak: 3, category: "학습 심화" },
          { id: `h-${Date.now()}-3`, title: `[${studentCluster}] 최신 산업 테크 트렌드 아티클 1편 요약 및 진로 탐구 고찰 기록`, text: `[${studentCluster}] 최신 산업 테크 트렌드 아티클 1편 요약 및 진로 탐구 고찰 기록`, targetDays: 30, completedDays: [1, 2, 3, 4, 5, 6, 7], completed: true, streak: 7, category: "트렌드 분석" },
          { id: `h-${Date.now()}-4`, title: `50일 AI 진로 챌린지 루틴 수행 & 아리 가이던스로 세특 활동기록 1줄 업로드`, text: `50일 AI 진로 챌린지 루틴 수행 & 아리 가이던스로 세특 활동기록 1줄 업로드`, targetDays: 50, completedDays: [1, 2], completed: false, streak: 2, category: "생기부 빌드" }
        ];
      }

      localStorage.setItem("my_habits_v2", JSON.stringify(tailoredHabits));
    } catch (error) {
      console.error("[AI Habit Design Customization Error]", error);
    }

    // 캐릭터 아리의 로딩 연출 화면이 충분히 보여진 후 4대 실전 맞춤 진로 활동 모듈 개방
    setTimeout(() => {
      setIsRoadmapGenerated(true);
      localStorage.setItem("readycareer_roadmap_generated", "true");
      setIsGeneratingAnim(false);
    }, 2800);
  };

  // 🎯 관심 직업 카드에서 '직업 변경하기' 클릭 시 진화 스토리 모달 띄우기
  const handleSelectJob = (idx: number) => {
    setJobIntroModalIdx(idx);
  };

  // 👑 모달 내에서 최종 '이 직업으로 변경' 승인 시 시스템 테마 완벽 동기화 및 히스토리 보존
  const handleConfirmJobChange = () => {
    if (jobIntroModalIdx === null) return;
    const selected = interestedJobs[jobIntroModalIdx];
    
    // 이전 직업 히스토리에 현재 메인 직업 백업 보존
    const prevJobName = localStorage.getItem("readycareer_target_job_name") || "AI 융합 미래 전문가";
    const historyStored = JSON.parse(localStorage.getItem("readycareer_my_job_history_v1") || "[]");
    if (!historyStored.some((h: any) => h.name === prevJobName)) {
       historyStored.push({
         name: prevJobName,
         category: localStorage.getItem("readycareer_selected_job") ? JSON.parse(localStorage.getItem("readycareer_selected_job")!).category : "과거 관심 직무",
         imageUrl: localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL,
         lastActive: new Date().toLocaleDateString("ko-KR"),
         recordsCount: 3
       });
       localStorage.setItem("readycareer_my_job_history_v1", JSON.stringify(historyStored));
    }

    // 신규 메인 직업 세팅
    setSelectedJobIdx(jobIntroModalIdx);
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
      // 직업 변경 시 신규 직무에 맞춰 4대 모듈 및 AI 커스텀 습관을 0부터 다시 세팅할 수 있도록 숨김 리셋!
      localStorage.removeItem("readycareer_roadmap_generated");
      localStorage.removeItem("my_habits_v2");
      setIsRoadmapGenerated(false);
    }
    setJobIntroModalIdx(null);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 변경 후 위로 스크롤
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

  // 계급 뱃지 및 동기부여 등급 산출 시스템 (전역 expService 싱크)
  const currentXP = getCurrentXP();
  const maxXP = 500;
  const progressPercent = Math.min(100, Math.round((currentXP / maxXP) * 100));
  const rankInfo = getRankFromXP(currentXP);

  const rankIcon = rankInfo.levelNum === 5 ? "👑" : rankInfo.levelNum === 4 ? "💎" : rankInfo.levelNum === 3 ? "🥇" : rankInfo.levelNum === 2 ? "🥈" : "🥉";
  const rankBadge = {
    title: rankInfo.title,
    classBadge: `[ ${rankIcon} ${rankInfo.title} ]`,
    textColor: "text-amber-300",
    border: "border-slate-700",
    icon: rankIcon
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10 text-[#111]">
      
      {/* =========================================================================
          SECTION 1: User Welcome Header & Clean Pill Badges
         ========================================================================= */}
      <div className="space-y-2 pl-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-extrabold bg-slate-100 text-slate-800 px-3.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>선택 직업: {currentJob.name}</span>
          </span>
          <span className="text-xs font-black px-3.5 py-1 rounded-full border border-slate-800 bg-[#111] text-white shadow-2xs">
            {rankBadge.classBadge}
          </span>
          <span className="text-xs font-extrabold text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            ✨ 진단 유형: {displayRiasec}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111]">
          {userName}님, 안녕하세요! 🚀
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          {userSchool} ({userGrade}학년) · {rankBadge.title} 단계에서 맞춤 진로 활동 마주하기
        </p>
      </div>

      {/* =========================================================================
          SECTION 2 & 3 COMBINED: Master Hero Board & Primary CTA
          (가장 눈에 잘 띄는 다크 차콜 히어로 영역 + 아리 커리어 가이던스 트리거)
         ========================================================================= */}
      <section className="rounded-[32px] overflow-hidden bg-[#111] text-white p-8 sm:p-10 shadow-xl border border-slate-800 space-y-8 relative">
        {/* Subtle background gradient halo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left Info & Vision Statement */}
          <div className="space-y-5 w-full md:w-3/5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full font-extrabold text-xs border border-slate-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">{rankBadge.title} 랭크 장착 중!</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
                🎯 MY PRIMARY TARGET JOB
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                {currentJob.name}
              </h3>
            </div>

            {/* Vision Statement Box */}
            <div className="bg-slate-900/90 rounded-2xl p-4.5 border border-slate-800 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>나만의 비전 선언문 (Vision Statement)</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiSuggestVision}
                    disabled={isAiLoading}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-black text-[11px] transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAiLoading ? "animate-spin" : ""}`} />
                    <span>AI 추천</span>
                  </button>
                  <button
                    onClick={() => setIsEditingVision(!isEditingVision)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    title="직접 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              {isEditingVision ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={visionStatement}
                    onChange={(e) => setVisionStatement(e.target.value)}
                    className="flex-grow px-3.5 py-1.5 rounded-xl border border-slate-700 bg-black/60 text-xs sm:text-sm font-medium text-white focus:outline-none"
                  />
                  <button onClick={handleSaveVision} className="px-4 py-1.5 bg-white text-[#111] rounded-xl text-xs font-black">
                    저장
                  </button>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-black text-white italic leading-relaxed">
                  "{visionStatement}"
                </p>
              )}
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-300">
                <span>성장 마일리지 ({rankBadge.title})</span>
                <span className="text-teal-400 font-black">{currentXP} / {maxXP} XP ({progressPercent}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-teal-500 via-purple-500 to-white rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Right Mascot Showcase */}
          <div className="flex flex-col items-center justify-center relative w-full md:w-2/5 shrink-0">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-slate-800/80 to-slate-900/40 p-5 border border-slate-700 flex items-center justify-center relative group shadow-2xl">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-2xl p-2.5 rounded-2xl border border-slate-700 shadow-md">
                {rankBadge.icon}
              </span>
              <img
                src={displayAvatarUrl}
                alt="3D Character Avatar"
                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3.5 bg-slate-900/90 text-slate-300 px-4 py-1.5 rounded-full font-bold text-xs border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>장착 어시스턴트 아리</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Block (아리와 함께 실전 맞춤 진로 활동 찾아보기) */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col xl:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center xl:text-left space-y-1 max-w-xl">
            <span className="text-[11px] font-extrabold text-teal-400 bg-teal-950/80 border border-teal-800 px-3 py-1 rounded-full mb-1 inline-block">
              🔥 CORE CAREER MODULES
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              나만의 실전 맞춤 진로 활동 & AI 로드맵 오픈하기
            </h4>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              16개 온보딩 진단 검사 및 목표 직군을 완벽 연계하여, 4대 핵심 역량 모듈과 50일 루틴을 1초 만에 세부 큐레이션합니다.
            </p>
          </div>

          <div className="w-full xl:w-auto shrink-0 flex justify-center">
            {!isRoadmapGenerated ? (
              <button
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingAnim}
                className="w-full sm:w-auto py-4 px-8 rounded-[24px] bg-gradient-to-r from-teal-400 via-white to-white hover:bg-white text-[#111] font-black text-lg sm:text-xl shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.35)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 cursor-pointer border border-white/50"
              >
                <span className="text-2xl sm:text-3xl animate-bounce-short shrink-0">🤖</span>
                <span className="tracking-tight">아리와 함께 실전 맞춤 진로 활동 찾아보기 ✨</span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl font-black text-xs sm:text-sm border border-emerald-500/40">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>✅ 실전 맞춤 진로 활동 4대 모듈 개방 완료!</span>
                </span>
                <button
                  onClick={() => { setIsRoadmapGenerated(false); localStorage.removeItem("readycareer_roadmap_generated"); }}
                  className="text-xs font-bold text-slate-400 hover:text-white underline decoration-1"
                >
                  (모듈 접기 / 초기화)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 로딩 연출 화면 */}
        {isGeneratingAnim && (
          <div className="my-6 p-8 sm:p-10 rounded-[28px] bg-slate-900 border border-slate-800 text-center space-y-5 animate-fadeIn">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 p-3 border border-slate-700 animate-bounce">
              <img src={ARI_BLOB_URL} alt="Ari Loading" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-4 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black border border-teal-500/30 inline-block">
                💡 AI 아리 맞춤 진로 알고리즘 발동 중...
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
                "잠시만 기다려! 회원님의 흥미 유형과 꿈의 직무에 최적화된 4대 실전 모듈과 50일 루틴을 세팅하고 있어!"
              </h4>
              <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* 실전 맞춤 진로 활동 4대 모듈 (클린 화이트 & 다크 블랙 텍스트 레퍼런스 적용) */}
        {isRoadmapGenerated && !isGeneratingAnim && (
          <div className="pt-6 border-t border-slate-800/80 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>🌌 실전 맞춤 진로 활동 4대 모듈</span>
                <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-0.5 rounded-full border border-teal-500/40">Active</span>
              </h4>
              <span className="text-xs font-bold text-slate-400">원하는 카드를 터치하여 바로 진입하세요 ↗</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: AI 학습포트폴리오 */}
              <Link to="/roadmap" className="block h-full group">
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#111] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#111]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        • STEP 1. 심화 학습
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                        <Route className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#111] group-hover:text-purple-700 transition-colors">
                        AI 학습포트폴리오 (코넬노트)
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        교과 핵심 키워드 정리 및 AI가 추출하는 세특 연계 요약과 셀프 퀴즈 도전
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#111] group-hover:text-purple-600">
                    <span>학습 노트 입장</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 2: 습관 & 목표 */}
              <Link to="/habits" className="block h-full group">
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#111] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#111]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200">
                        • STEP 2. 실천 루틴
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                        <ListCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#111] group-hover:text-teal-700 transition-colors">
                        습관 & 목표 관리
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        매일 수행하는 커스텀 진로 루틴 및 1일 체크 달성 시 즉시 EXP 마일리지 획득
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#111] group-hover:text-teal-600">
                    <span>습관 대시보드 입장</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 3: 진로 포트폴리오 */}
              <Link to="/portfolio" className="block h-full group">
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#111] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#111]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        • STEP 3. 누적 성과
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                        <FolderCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#111] group-hover:text-rose-600 transition-colors">
                        진로 포트폴리오
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        고교 3개년 누적 성과 및 항목을 선택하여 NEIS 제출용 생기부 초안 즉시 변환
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#111] group-hover:text-rose-600">
                    <span>포폴 보관함 확인</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 4: 자기이해 검사 (사용자 요청에 따라 활동기록 작성을 자기이해 검사로 교체) */}
              <Link to="/self-understanding" className="block h-full group">
                <div className="bg-slate-900 rounded-[24px] p-6 border border-slate-800 hover:border-teal-400 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-white">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700">
                        • STEP 4. 흥미 진단
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Compass className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                        자기이해 진로검사
                      </h5>
                      <p className="text-xs font-medium text-slate-400 mt-1.5 leading-relaxed">
                        6유형 RIASEC 진단 설문 및 AI 매핑을 통해 내 잠재 흥미와 역량을 재확인!
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-teal-300">
                    <span>검사 결과 보러가기</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: 진로 탐험 목표 변경 (Compact Career Switching Aux Area)
         ========================================================================= */}
      <div className="bg-slate-50 rounded-[28px] p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#111] flex items-center gap-2">
              <span>⚡ 진로 탐험 직군 변경 (Career Switching)</span>
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              메인 화면의 눈부신 활동에 집중하되, 필요 시 언제든 후보 직군을 클릭하여 마스코트와 목표를 간편 전환하세요.
            </p>
          </div>

          <form onSubmit={handleAddJob} className="flex items-center gap-2 max-w-sm w-full">
            <input
              type="text"
              placeholder="예: AI 바이오 연구원..."
              value={newJobInput}
              onChange={(e) => setNewJobInput(e.target.value)}
              className="flex-grow h-10 text-xs px-4 rounded-xl bg-white border border-slate-300 text-[#111] placeholder:text-slate-400 focus:outline-none focus:border-slate-800 font-medium shadow-2xs"
            />
            <Button type="submit" variant="primary" size="sm" className="h-10 px-4 whitespace-nowrap font-bold text-xs rounded-xl bg-[#111] hover:bg-slate-800 text-white">
              + 추가
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interestedJobs.map((job, idx) => {
            const isSelected = selectedJobIdx === idx;
            return (
              <div
                key={idx}
                className={`p-4 rounded-[20px] border transition-all duration-200 flex flex-col justify-between h-44 ${
                  isSelected
                    ? "bg-white border-slate-800 shadow-md scale-[1.01]"
                    : "bg-white border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? "bg-[#111] text-white" : "bg-slate-100 text-slate-600"}`}>
                    {isSelected ? "★ 현재 활성 메인" : "후보 직군"}
                  </span>
                  {isSelected && <span className="text-[10px] font-bold text-emerald-600">Active</span>}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 border border-slate-150 shrink-0 flex items-center justify-center">
                    {job.imageUrl ? (
                      <img src={job.imageUrl} alt={job.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">{job.image}</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-semibold text-slate-400 block truncate">
                      {job.category}
                    </span>
                    <strong className="text-sm font-black text-[#111] block truncate">
                      {job.name}
                    </strong>
                  </div>
                </div>

                {!isSelected ? (
                  <button
                    onClick={() => handleSelectJob(idx)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#111] hover:text-white text-slate-700 font-bold text-xs transition-colors"
                  >
                    이 직업으로 변경 &rarr;
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    현재 적용 중
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODAL: 직업 변경 및 Lv.1 ~ Lv.5 마스코트 진화 로드맵 - Klyro Clean Bento
         ========================================================================= */}
      {jobIntroModalIdx !== null && interestedJobs[jobIntroModalIdx] && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-[36px] shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative p-6 sm:p-10 lg:p-12 space-y-8 text-left font-sans">
            <button 
              onClick={() => setJobIntroModalIdx(null)} 
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all z-50 shadow-xs"
              title="닫기"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
            
            <div className="space-y-8">
              {/* Dark Charcoal Header */}
              <div className="rounded-[32px] bg-[#111111] text-white p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 max-w-2xl text-center sm:text-left z-10">
                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-white/10 text-emerald-400 border border-white/15 inline-block">
                    ⚡ 2026 맞춤 진로 탐험 스위칭
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    <span className="text-emerald-400">{interestedJobs[jobIntroModalIdx].name}</span> <br className="hidden sm:block"/>
                    진화 레벨업 로드맵
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-400">
                    선택 즉시 홈 화면의 어시스턴트 마스코트와 AI 맞춤 루틴 큐레이션이 신규 직업으로 개통됩니다.
                  </p>
                </div>
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[28px] bg-white p-4 shadow-2xl border border-slate-200 shrink-0 flex items-center justify-center">
                  <img src={interestedJobs[jobIntroModalIdx].imageUrl || ARI_BLOB_URL} alt="Mascot" className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </div>

              {/* Lv.1 ~ Lv.5 순차적 레벨업 진화 화면 (Clean White/Slate Modular Bento) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    🏅 5-STAGE CAREER EVOLUTION TREE
                  </span>
                  <span className="text-xs font-extrabold text-[#111] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Lv.1부터 Lv.5 마스터까지 순차 진화
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative items-stretch">
                  {[
                    { lv: "Lv.1", badge: "📖 지식 융합", name: "호기심 장착 아리" },
                    { lv: "Lv.2", badge: "⚡ 챌린지", name: "프로젝트 리더" },
                    { lv: "Lv.3", badge: "🏆 포폴 왕", name: "포트폴리오 왕" },
                    { lv: "Lv.4", badge: "🚀 차세대 고수", name: "미래 엑스퍼트" },
                    { lv: "Lv.5", badge: "👑 마스터", name: "최상위 마스터" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-[24px] bg-slate-50 p-5 border border-slate-200 hover:border-slate-800 transition-all flex flex-col items-center justify-between space-y-3.5 group">
                      <div className="w-full flex flex-col items-center space-y-1.5">
                        <span className="text-xs font-black bg-white px-3 py-0.5 rounded-full shadow-xs border border-slate-200">{item.lv}</span>
                        <span className="text-xs font-bold text-slate-600">{item.badge}</span>
                      </div>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-3 border border-slate-100 flex items-center justify-center my-2 group-hover:scale-105 transition-transform shadow-xs">
                        <img src={interestedJobs[jobIntroModalIdx].imageUrl || ARI_BLOB_URL} alt="Ari" className="w-full h-full object-contain filter drop-shadow-xs" />
                      </div>
                      <strong className="text-xs font-black text-[#111111] text-center w-full bg-white rounded-xl py-2 border border-slate-200/80 shadow-xs truncate">{item.name}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 w-full max-w-2xl mx-auto border-t border-slate-100 flex flex-col items-center gap-3">
                <button
                  onClick={handleConfirmJobChange}
                  className="w-full py-5 px-8 rounded-2xl bg-[#111111] hover:bg-slate-800 text-white font-black text-base sm:text-xl shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Award className="w-6 h-6 text-emerald-400" />
                  <span>이 직업으로 내 홈화면 & 포트폴리오 맞춤 스위칭!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default HomeDashboard;

