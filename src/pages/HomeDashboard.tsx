import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL, JOB_VENGERS_LIST, getJobCharacterImage, getJobCharacterTitle } from "../assets/mascotData";
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
      // 처음에 온보딩에서 추천했던 직무군들이 먼저 보이게 세팅!
      const storedSelectedJobJson = localStorage.getItem("readycareer_selected_job");
      let primaryJob = { name: "로봇공학자", image: "🤖", category: "대표 선택 직업", imageUrl: getJobCharacterImage("로봇공학자", 1) };
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
    const currentTarget = interestedJobs[selectedJobIdx]?.name || "로봇공학자";
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
    const currentJob = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "로봇공학자";
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
    const prevJobName = localStorage.getItem("readycareer_target_job_name") || "로봇공학자";
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

  const currentJob = interestedJobs[selectedJobIdx] || { name: "로봇공학자", image: "🤖", category: "탐색 중", imageUrl: ARI_BLOB_URL };
  const userName = localStorage.getItem("readycareer_student_name") || (session?.name && session.name.trim() !== "" ? session.name : "신규 꿈 탐구어");
  const userSchool = localStorage.getItem("readycareer_student_school") || (session?.school && session.school.trim() !== "" ? session.school : "창의융합 인공지능 고교");
  const userGrade = parseInt(localStorage.getItem("readycareer_student_grade")?.replace(/[^0-9]/g, "") || "") || session?.grade || 1;

  // 계급 뱃지 및 동기부여 등급 산출 시스템 (전역 expService 싱크 - 50 XP 간격 레벨업)
  const currentXP = getCurrentXP();
  const rankInfo = getRankFromXP(currentXP);
  const currentLevel = rankInfo.levelNum;

  const nextLevelXP = currentLevel >= 5 ? currentXP : currentLevel * 50;
  const currentLevelStartXP = (currentLevel - 1) * 50;
  const progressPercent = currentLevel >= 5 ? 100 : Math.min(100, Math.max(0, Math.round(((currentXP - currentLevelStartXP) / 50) * 100)));

  // 진단 결과 유형 및 캐릭터 아바타 URL 확인 (처음 진입한 유저는 실시간 레벨 1 캐릭터가 표출되도록 확실한 제어)
  const storedRiasec = localStorage.getItem("riasec_result_code") || localStorage.getItem("readycareer_interest_type");
  const displayRiasec = (storedRiasec && storedRiasec !== "미진단") ? storedRiasec : "INNOVATOR";
  const storedCustomAvatar = localStorage.getItem("readycareer_custom_avatar_url");
  const dynamicLevelAvatar = getJobCharacterImage(currentJob.name, currentLevel);
  const displayAvatarUrl = dynamicLevelAvatar !== ARI_BLOB_URL ? dynamicLevelAvatar : (storedCustomAvatar || currentJob.imageUrl || ARI_BLOB_URL);

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
          <span className="text-xs font-black px-3.5 py-1 rounded-full border border-purple-300 bg-[#5328E0] text-amber-300 shadow-2xs">
            {rankBadge.classBadge}
          </span>
          <span className="text-xs font-extrabold text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            ✨ 진단 유형: {displayRiasec}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1F193B]">
          {userName}님, 안녕하세요! 🚀
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          {userSchool} ({userGrade}학년) · {rankBadge.title} 단계에서 맞춤 진로 활동 마주하기
        </p>
      </div>

      {/* =========================================================================
          SECTION 2 & 3 COMBINED: Master Hero Board & Primary CTA
          (가장 눈에 잘 띄는 밸런스드 퍼플 파스텔 히어로 영역 + 아리 커리어 가이던스 트리거)
         ========================================================================= */}
      <section className="rounded-[36px] overflow-hidden bg-gradient-to-br from-[#5328E0] via-[#6537EA] to-[#7E51FA] text-white p-8 sm:p-12 shadow-[0_25px_80px_rgba(83,40,224,0.32)] border-2 border-[#9F7FFF]/40 space-y-10 relative">
        {/* Subtle background gradient halo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-900/30 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left Info & Vision Statement */}
          <div className="space-y-5 w-full md:w-3/5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full font-extrabold text-xs border border-white/20 shadow-sm">
              <Award className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-amber-300">{rankBadge.title} 랭크 장착 중!</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-purple-200 uppercase tracking-widest block">
                🎯 MY PRIMARY TARGET JOB
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                {currentJob.name}
              </h3>
            </div>

            {/* Vision Statement Box (글과 박스 비율 및 품격 있는 프리미엄 쿼트 카드 개선) */}
            <div className="bg-black/45 backdrop-blur-md rounded-[24px] p-6 sm:p-7 border border-white/25 border-l-[6px] border-l-[#FFB800] space-y-4 text-left shadow-2xl w-full max-w-full overflow-hidden min-w-0 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-extrabold text-amber-200 w-full pb-2 border-b border-white/10">
                <span className="flex items-center gap-2 truncate min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
                  <span className="truncate tracking-wide">나만의 비전 선언문 (Vision Statement)</span>
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleAiSuggestVision}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin" : ""}`} />
                    <span>AI 추천</span>
                  </button>
                  <button
                    onClick={() => setIsEditingVision(!isEditingVision)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="직접 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isEditingVision ? "수정 취소" : "직접 수정"}</span>
                  </button>
                </div>
              </div>
              
              {isEditingVision ? (
                <div className="flex flex-col gap-3.5 mt-1.5 w-full min-w-0">
                  <textarea
                    value={visionStatement}
                    onChange={(e) => setVisionStatement(e.target.value)}
                    rows={3}
                    className="w-full max-w-full p-4 rounded-xl border border-amber-300/50 bg-black/70 text-sm sm:text-base md:text-lg font-bold text-white focus:outline-none focus:border-amber-300 break-words break-keep whitespace-pre-wrap resize-y leading-relaxed shadow-inner"
                    placeholder="나만의 진로 비전을 자유롭게 서술해보세요!"
                  />
                  <div className="flex justify-end w-full">
                    <button 
                      onClick={handleSaveVision} 
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-300 via-teal-300 to-white text-[#111111] hover:brightness-105 rounded-xl text-xs sm:text-sm font-black shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <span>비전 저장 및 장착하기</span>
                      <strong className="text-base leading-none">✓</strong>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2.5 px-1">
                  <p className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-relaxed sm:leading-9 break-words break-keep whitespace-pre-wrap w-full overflow-hidden tracking-wide">
                    "{visionStatement}"
                  </p>
                </div>
              )}
            </div>

            {/* XP Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs sm:text-sm font-black text-purple-100">
                <span>⚡ 성장 마일리지 ({rankBadge.title})</span>
                <span className="text-amber-300 font-black">
                  {currentLevel >= 5 ? `${currentXP} XP (최상위 마스터 달성!)` : `${currentXP} / ${nextLevelXP} XP (다음 레벨까지 ${nextLevelXP - currentXP} XP)`} ({progressPercent}%)
                </span>
              </div>
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div className="h-full bg-gradient-to-r from-amber-300 via-teal-300 to-white rounded-full transition-all duration-700 shadow-sm" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Right Mascot Showcase */}
          <div className="flex flex-col items-center justify-center relative w-full md:w-2/5 shrink-0">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-white/20 to-black/20 p-5 border-2 border-white/30 flex items-center justify-center relative group shadow-2xl">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-2xl p-2.5 rounded-2xl border border-slate-700 shadow-md">
                {rankBadge.icon}
              </span>
              <img
                src={displayAvatarUrl}
                alt="3D Character Avatar"
                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3.5 bg-black/40 text-purple-100 px-4 py-1.5 rounded-full font-bold text-xs border border-white/20 flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              <span>장착 어시스턴트 아리</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Block (아리와 함께 실전 맞춤 진로 활동 찾아보기 - MEGA HERO BANNER) */}
        <div className="pt-4 relative z-10">
          <div className="bg-white/15 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border-2 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col items-center justify-between gap-6 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-[12px] sm:text-xs font-black text-[#20104E] bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-1 rounded-full mb-1 inline-block shadow-md">
                🔥 MAJOR TARGET ACTION · 2026 핵심 역량 큐레이션
              </span>
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                나만의 실전 맞춤 진로 활동 &amp; AI 로드맵 즉시 오픈하기
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-purple-100 leading-relaxed">
                16개 온보딩 진단 검사 및 목표 직군을 완벽 연계하여, 4대 핵심 역량 모듈과 50일 루틴을 1초 만에 개방합니다.
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto flex justify-center">
              {!isRoadmapGenerated ? (
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingAnim}
                  className="w-full py-5 px-6 sm:px-12 rounded-[26px] bg-gradient-to-r from-[#FFB800] via-[#FFCA3A] to-[#FFE07D] hover:brightness-105 text-[#201150] font-black text-lg sm:text-2xl lg:text-3xl shadow-[0_15px_45px_rgba(255,184,0,0.5)] hover:shadow-[0_20px_60px_rgba(255,184,0,0.65)] transition-all transform hover:scale-[1.01] active:scale-98 cursor-pointer border-2 border-amber-100/70 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center break-keep"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl animate-bounce-short shrink-0">🚀</span>
                    <span className="tracking-tight drop-shadow-xs leading-tight">&lt;아리와 함께 실전 맞춤 진로 활동 찾아보기&gt; ✨</span>
                  </div>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-full py-4 px-8 rounded-[24px] bg-white text-[#5328E0] font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 border border-purple-200">
                    <Unlock className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span>✅ 실전 맞춤 진로 활동 4대 모듈이 성공적으로 개방되었습니다! (아래 카드 클릭)</span>
                  </div>
                  <button
                    onClick={() => { setIsRoadmapGenerated(false); localStorage.removeItem("readycareer_roadmap_generated"); }}
                    className="text-xs font-bold text-purple-200 hover:text-white underline decoration-1 mt-1"
                  >
                    (모듈 다시 접기 / 초기화)
                  </button>
                </div>
              )}
            </div>
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
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#6A42ED] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#1F193B]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        • STEP 1. 심화 학습
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#6A42ED] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Route className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#1F193B] group-hover:text-purple-700 transition-colors">
                        AI 학습포트폴리오 (코넬노트)
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        교과 핵심 키워드 정리 및 AI가 추출하는 세특 연계 요약과 셀프 퀴즈 도전
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1F193B] group-hover:text-purple-600">
                    <span>학습 노트 입장</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 2: 습관 & 목표 */}
              <Link to="/habits" className="block h-full group">
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#6A42ED] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#1F193B]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200">
                        • STEP 2. 실천 루틴
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ListCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#1F193B] group-hover:text-teal-700 transition-colors">
                        습관 &amp; 목표 관리
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        매일 수행하는 커스텀 진로 루틴 및 1일 체크 달성 시 즉시 EXP 마일리지 획득
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1F193B] group-hover:text-teal-600">
                    <span>습관 대시보드 입장</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 3: 진로 포트폴리오 */}
              <Link to="/portfolio" className="block h-full group">
                <div className="bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#6A42ED] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-[#1F193B]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        • STEP 3. 누적 성과
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-[#1F193B] group-hover:text-rose-600 transition-colors">
                        진로 포트폴리오
                      </h5>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                        고교 3개년 누적 성과 및 항목을 선택하여 NEIS 제출용 생기부 초안 즉시 변환
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1F193B] group-hover:text-rose-600">
                    <span>포폴 보관함 확인</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>

              {/* Card 4: 자기이해 검사 */}
              <Link to="/self-understanding" className="block h-full group">
                <div className="bg-gradient-to-br from-[#361685] to-[#5124BA] rounded-[24px] p-6 border-2 border-[#8C64FF]/60 hover:border-amber-300 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between h-full min-h-[200px] text-white">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-300 text-[#20104E] border border-amber-400 shadow-2xs">
                        • STEP 4. 흥미 진단
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-amber-300 text-[#20104E] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <Compass className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                        자기이해 진로검사
                      </h5>
                      <p className="text-xs font-medium text-purple-100 mt-1.5 leading-relaxed">
                        6유형 RIASEC 진단 설문 및 AI 매핑을 통해 내 잠재 흥미와 역량을 재확인!
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-purple-500/50 flex items-center justify-between text-xs font-extrabold text-amber-300">
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
          SECTION 4: 진로 탐험 직군 변경 (COMPACT & SLEEK AUXILIARY STRIP)
          (메인 CTA 버튼이 주인공이 되도록 부담 없는 컴팩트 미니 바 형태로 축소)
         ========================================================================= */}
      <div className="bg-[#F8F6FF] rounded-[24px] p-5 sm:p-6 border border-[#E4DDFF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1FF] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-[#2D1B69] flex items-center gap-1.5">
              ⚡ 진로 탐험 직군 변경
            </span>
            <span className="text-xs font-bold text-slate-500">
              (터치 시 마스코트와 목표를 즉시 스위칭)
            </span>
          </div>

          <form onSubmit={handleAddJob} className="flex items-center gap-2 max-w-xs w-full">
            <input
              type="text"
              placeholder="예: AI 바이오 연구원..."
              value={newJobInput}
              onChange={(e) => setNewJobInput(e.target.value)}
              className="flex-grow h-9 text-xs px-3.5 rounded-xl bg-white border border-purple-200 text-[#1F193B] placeholder:text-slate-400 focus:outline-none focus:border-[#6A42ED] font-medium shadow-2xs"
            />
            <Button type="submit" variant="primary" size="sm" className="h-9 px-3.5 whitespace-nowrap font-bold text-xs rounded-xl bg-[#6A42ED] hover:bg-[#5430CE] text-white">
              + 추가
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {interestedJobs.map((job, idx) => {
            const isSelected = selectedJobIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => !isSelected && handleSelectJob(idx)}
                className={`p-4 sm:p-5 rounded-[24px] border-2 transition-all duration-200 flex flex-col items-center text-center justify-between cursor-pointer group min-h-[148px] ${
                  isSelected
                    ? "bg-gradient-to-br from-[#6A42ED] to-[#5428DC] text-white border-[#8862FE] shadow-lg scale-[1.02]"
                    : "bg-white text-[#1F193B] border-purple-150 hover:border-[#6A42ED] hover:bg-purple-50/60 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 border border-purple-100 shrink-0 flex items-center justify-center my-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  {job.imageUrl ? (
                    <img src={job.imageUrl} alt={job.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">{job.image}</span>
                  )}
                </div>
                <div className="w-full overflow-hidden space-y-1 mt-1">
                  <strong className={`text-sm sm:text-base font-black block line-clamp-2 leading-snug break-keep ${isSelected ? "text-white" : "text-[#1F193B] group-hover:text-[#6A42ED]"}`}>
                    {job.name}
                  </strong>
                  <span className={`text-xs font-extrabold block pt-1 ${isSelected ? "text-amber-300" : "text-slate-400 group-hover:text-purple-600"}`}>
                    {isSelected ? "★ 현재 맞춤 적용 중" : "클릭하여 즉시 변경 &rarr;"}
                  </span>
                </div>
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
              {/* Balanced Purple & Violet Theme Header */}
              <div className="rounded-[32px] bg-gradient-to-r from-[#5328E0] via-[#6537EA] to-[#8054FC] text-white p-8 sm:p-10 border border-[#9F7FFF]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 max-w-2xl text-center sm:text-left z-10">
                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-white/15 text-amber-300 border border-white/20 inline-block shadow-xs">
                    ⚡ 2026 맞춤 진로 탐험 스위칭
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    <span className="text-amber-300">{interestedJobs[jobIntroModalIdx].name}</span> <br className="hidden sm:block"/>
                    진화 레벨업 로드맵
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-purple-100">
                    선택 즉시 홈 화면의 어시스턴트 마스코트와 AI 맞춤 루틴 큐레이션이 신규 직업으로 개통됩니다.
                  </p>
                </div>
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[28px] bg-white p-4 shadow-2xl border border-purple-100 shrink-0 flex items-center justify-center">
                  <img src={interestedJobs[jobIntroModalIdx].imageUrl || ARI_BLOB_URL} alt="Mascot" className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </div>

              {/* Lv.1 ~ Lv.5 순차적 레벨업 진화 화면 (Clean White/Slate Modular Bento) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    🏅 5-STAGE CAREER EVOLUTION TREE
                  </span>
                  <span className="text-xs font-extrabold text-[#1F193B] bg-purple-50 px-3 py-1 rounded-full border border-purple-150">
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
                    <div key={i} className="rounded-[24px] bg-slate-50 p-5 border border-slate-200 hover:border-[#6A42ED] transition-all flex flex-col items-center justify-between space-y-3.5 group">
                      <div className="w-full flex flex-col items-center space-y-1.5">
                        <span className="text-xs font-black bg-white px-3 py-0.5 rounded-full shadow-xs border border-slate-200">{item.lv}</span>
                        <span className="text-xs font-bold text-slate-600">{item.badge}</span>
                      </div>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-3 border border-slate-100 flex items-center justify-center my-2 group-hover:scale-105 transition-transform shadow-xs">
                        <img src={getJobCharacterImage(interestedJobs[jobIntroModalIdx].name, i + 1)} alt="Ari Stage" className="w-full h-full object-contain filter drop-shadow-xs" />
                      </div>
                      <strong className="text-xs font-black text-[#1F193B] text-center w-full bg-white rounded-xl py-2 px-1 border border-slate-200/80 shadow-xs truncate">{getJobCharacterTitle(interestedJobs[jobIntroModalIdx].name, i + 1, item.name)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 w-full max-w-2xl mx-auto border-t border-slate-100 flex flex-col items-center gap-3">
                <button
                  onClick={handleConfirmJobChange}
                  className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#5328E0] via-[#6537EA] to-[#8054FC] hover:brightness-105 text-white font-black text-base sm:text-xl shadow-[0_12px_35px_rgba(83,40,224,0.35)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Award className="w-6 h-6 text-amber-300" />
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

