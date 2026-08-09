import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, ProgressBar, MascotAri } from "../components";
import { useAuth } from "../context";
import { getCurrentXP, getRankFromXP } from "../services/expService";
import { getJobCharacterImage, getJobCharacterTitle } from "../assets/mascotData";
import {
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
  Flame,
  ChevronRight,
  RefreshCw,
  History,
  Briefcase,
  SwitchCamera,
  Trash2,
  AlertTriangle
} from "lucide-react";

export const MyPage: React.FC = () => {
  const { session } = useAuth();
  const [activeCategory, setActiveCategory] = useState<"all" | "badges" | "quests">("all");
  const [jobToDelete, setJobToDelete] = useState<any | null>(null);

  // --- 멀티 커리어 직업 덱 (다중 직업 히스토리 및 스위칭) 상태 ---
  const currentJobName = localStorage.getItem("readycareer_target_job_name") || (session?.targetJob || "로봇공학자");
  const currentAvatarUrl = localStorage.getItem("readycareer_custom_avatar_url") || "https://fea6nfqj9cdttjmk.public.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/Character%201.png";

  const [jobHistoryList, setJobHistoryList] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("readycareer_my_job_history_v1") || "[]");
      if (stored.length === 0) {
        // 교사나 학생이 다중 직업 시스템을 바로 체감할 수 있도록 실물 캐릭터 데이터로 초기화
        return [
          { name: "생명과학연구원", category: "탐구형(I)", imageUrl: "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv4.png", lastActive: "2일 전 완료", recordsCount: 14, rank: "다이아 마스터", bgColor: "bg-emerald-50" },
          { name: "콘텐츠크리에이터", category: "예술형(A)", imageUrl: "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/content_creator_tori/lv2.png", lastActive: "1주일 전 완료", recordsCount: 5, rank: "실버 챌린저", bgColor: "bg-orange-50" },
        ];
      }
      return stored;
    } catch { return []; }
  });

  const handleSwitchCareerJob = (job: any) => {
    // 1. 기존 메인 직업을 히스토리로 안전하게 보관 (중복이 없을 경우만)
    const newHistory = [...jobHistoryList];
    if (!newHistory.some(h => h.name === currentJobName)) {
      newHistory.push({
        name: currentJobName,
        category: localStorage.getItem("readycareer_selected_job") ? JSON.parse(localStorage.getItem("readycareer_selected_job")!).category : "진로 탐색 중",
        imageUrl: currentAvatarUrl,
        lastActive: "방금 전 보관됨",
        recordsCount: 8,
        rank: "골드 리더",
        bgColor: "bg-purple-50"
      });
    }

    // 2. 선택한 직업으로 메인 타겟 직업 스위칭!
    localStorage.setItem("readycareer_target_job_name", job.name);
    if (job.imageUrl) localStorage.setItem("readycareer_custom_avatar_url", job.imageUrl);
    
    // 선택 직업군 디테일 업데이트
    localStorage.setItem("readycareer_selected_job", JSON.stringify({
      title: job.name,
      category: job.category || "선택 직무",
      imageUrl: job.imageUrl,
      bgGradient: "from-[#E6FAFE] to-[#F2FEFF]",
      badgeColor: "bg-[#008A90] text-white"
    }));

    // 3. 상태 리렌더링 및 새로고침하여 전 페이지 테마 동기화 적용
    setJobHistoryList(newHistory);
    localStorage.setItem("readycareer_my_job_history_v1", JSON.stringify(newHistory));
    localStorage.removeItem("readycareer_roadmap_generated");
    localStorage.removeItem("my_habits_v2");
    window.location.reload();
  };

  const handleConfirmDeleteJob = () => {
    if (!jobToDelete) return;
    const updated = jobHistoryList.filter((item: any) => item.name !== jobToDelete.name);
    setJobHistoryList(updated);
    localStorage.setItem("readycareer_my_job_history_v1", JSON.stringify(updated));
    setJobToDelete(null);
  };

  const currentExp = getCurrentXP();
  const currentRank = getRankFromXP(currentExp);
  const level = currentRank.levelNum;
  const nextRank = getRankFromXP(Math.min(500, (level * 100) + 10));
  const targetExp = level < 5 ? level * 100 : 500;
  const remainingExp = Math.max(0, targetExp - currentExp);
  const expPercent = Math.min(100, Math.round((currentExp / 500) * 100));
  const streakDays = 14;

  const badgeCollection = [
    { id: "b1", name: "RIASEC 18문항 개척자", desc: "자기이해 18개 문항을 완주한 진도 마스터", icon: "🧠", unlocked: true, date: "2026.07.26" },
    { id: "b2", name: "별자리 로드맵 첫 점등", desc: "AI 커리어 로드맵을 확정하고 첫 퀘스트 완수", icon: "🌌", unlocked: true, date: "2026.07.25" },
    { id: "b3", name: "50일 습관 2주 챌린저", desc: "매일 세특 학습 루틴 14일 연속 완수", icon: "🔥", unlocked: true, date: "2026.07.24" },
    { id: "b4", name: "AI 생기부 팩트 증인", desc: "첫 진로 탐색 활동 포트폴리오 3개 누적 등록", icon: "📋", unlocked: true, date: "2026.07.22" },
    { id: "b5", name: "다중지능 AI 펜타곤 마스터", desc: "다중지능 및 학습스타일 3종 진단 리포트 모두 획득", icon: "💎", unlocked: true, date: "2026.07.20" },
    { id: "b6", name: "50일 습관 완주자 (예정)", desc: "50일간 하루도 빠짐없이 퀘스트 클리어 시 해금", icon: "🏆", unlocked: false, requirement: "습관 36일 더 인증 필요" },
    { id: "b7", name: "전공 독서 학술 리더", desc: "심층 추천 독서 5권 요약 보고서 등록 시 해금", icon: "📚", unlocked: false, requirement: "포트폴리오 2개 추가 등록 필요" },
    { id: "b8", name: "AURA DIAMOND 달성자", desc: "학급 역량 성장율 및 레벨 10 달성 시 부여", icon: "👑", unlocked: false, requirement: "EXP 1,200 (Lv.10) 도달 시 해금" },
  ];

  const savedUserActivities = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
      return stored.map((act: any) => ({
        id: act.id || "act-" + Math.random(),
        title: act.title || "새로 작성된 세특 실천 활동",
        type: act.category ? act.category.split(" ")[0] : "학생 기록",
        exp: act.exp || "+50 EXP",
        date: act.date ? `${act.date} 완료` : "오늘 완료"
      }));
    } catch {
      return [];
    }
  })();

  const isNewClean = localStorage.getItem("is_new_student_clean_state") === "true";

  const completedQuests = [
    ...savedUserActivities,
    ...(isNewClean ? [] : [
      { id: "q1", title: "공공 교육 데이터 활용 맞춤 멘토링 방안 작성", type: "심화 탐구", exp: "+50 EXP", date: "어제 완료" },
      { id: "q2", title: "Holland RIASEC 흥미무드 18문항 다면 진단 완수", type: "자기이해", exp: "+40 EXP", date: "2일 전 완료" },
      { id: "q3", title: "센서 기반 자율주행 모션 로봇 하드웨어 알고리즘 분석", type: "동아리", exp: "+60 EXP", date: "4일 전 완료" },
      { id: "q4", title: "과학 기술 고전 비판적 독서 및 기계 윤리 토론 발췌", type: "전공 독서", exp: "+45 EXP", date: "1주일 전 완료" },
    ]),
  ];

  const habitsList = (() => {
    try {
      const savedHabits = JSON.parse(localStorage.getItem("my_habits_v2") || "null");
      if (Array.isArray(savedHabits) && savedHabits.length > 0) {
        return savedHabits.map((h: any) => {
          const total = h.targetDays || 50;
          const done = h.completedDays ? h.completedDays.length : 0;
          const rate = Math.max(15, Math.min(100, Math.round((done / total) * 100) || 68));
          return {
            title: h.title || "50일 자기주도 진로 실현 챌린지",
            streak: done > 0 ? `${done}일째 완수 중!` : "🚀 50일 챌린지 도전 시작!",
            rate: done > 0 ? rate : 64
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { title: "🔥 [50일 챌린지] 매일 AI 알고리즘 & 맞춤 전공 문제 1개 실습", streak: "14일 연속 실천 중", rate: 92 },
      { title: "📚 [50일 루틴] 최신 관심 직무 저널 및 도서 15분 읽고 메모", streak: "8일 연속 실천 중", rate: 84 },
      { title: "💡 [50일 목표] 주말 세특·자율 활동 탐구 기록부 1줄 구조화", streak: "3주차 달성 중", rate: 96 },
    ];
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 selection:bg-primary/20 animate-fadeIn">
      
      {/* Top Header Section (Cumulative Motivation Engine) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-variant/50 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-headline font-semibold tracking-tighter whitespace-nowrap border border-primary/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span>ReadyCareer AI · 누적 성장 동기부여 엔진 마이페이지</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tighter text-text-primary tracking-tight flex items-center gap-3">
            <span>🚀 {localStorage.getItem("readycareer_student_name") || (session?.name && session.name.trim() !== "" ? session.name : "신규 학생")} 님의 누적 커리어 히어로 볼트</span>
          </h1>
          <p className="text-sm text-text-muted font-medium">
            소속: <strong className="text-primary">{localStorage.getItem("readycareer_student_school") || (session?.school && session.school.trim() !== "" ? session.school : "소속 학교 연동중")}</strong> · 나의 진단 리포트 이력, 해금된 레벨 뱃지, 실천 습관과 생기부 퀘스트 성과가 실시간 누적 기록됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/activity-form">
            <Button variant="primary" size="sm" className="font-semibold tracking-tighter whitespace-nowrap shadow-md">
              ➕ 신규 활동·세특 기록하기
            </Button>
          </Link>
          <Link to="/self-understanding">
            <Button variant="outline" size="sm" className="font-semibold tracking-tighter whitespace-nowrap border-primary text-primary bg-primary/5 shadow-sm">
              <RefreshCw className="w-4 h-4 mr-1 inline" /> 진단 리포트 열람 &rarr;
            </Button>
          </Link>
          <Link to="/teacher">
            <Button variant="outline" size="sm" className="font-semibold tracking-tighter whitespace-nowrap border-surface-variant bg-white shadow-sm">
              👨‍🏫 교무실 팩트 생기부 확인
            </Button>
          </Link>
        </div>
      </div>

      {/* HERO GAMIFICATION & LEVEL STATS BANNER */}
      <div className="space-y-8">
        
        {/* Full-Width Level & EXP Dashboard Card with Character Visuals */}
        <Card variant="hero" padding="lg" className="w-full shadow-3d-ambient flex flex-col justify-between relative overflow-hidden text-white">
          <div className="space-y-6 z-10">
            {/* 상단 뱃지 및 스트리크 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-tighter whitespace-nowrap border border-white/30 uppercase tracking-wider inline-flex items-center gap-1.5 self-start">
                <Award className="w-4 h-4 text-amber-300 animate-pulse" />
                CURRENT GROWTH STATUS (현재 성장 및 등급 현황)
              </span>
              <span className="text-xs font-semibold tracking-tighter text-secondary-container flex items-center gap-1 whitespace-nowrap bg-black/30 px-3 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> {streakDays}일째 열정 불기둥
              </span>
            </div>

            {/* 레벨 및 프로그레스 핵심 요약 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/25 p-5 sm:p-6 rounded-3xl border border-white/15 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-black flex flex-col items-center justify-center border-4 border-white/40 shadow-2xl transform rotate-2 flex-shrink-0">
                  <span className="text-xs font-medium tracking-tight uppercase text-white/80 whitespace-nowrap">LEVEL</span>
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tighter tracking-tight">{level}</span>
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tighter text-white tracking-tight truncate">
                    {currentRank.title} ({currentRank.lvTitle})
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold tracking-tighter text-amber-300 leading-tight">
                    {level < 5
                      ? `🎯 다음 등급(${nextRank.lvTitle}) 승급까지 ${remainingExp} XP 남았습니다!`
                      : `👑 최고 등급(Lv.5 마스터)에 도달하였습니다!`}
                  </p>
                </div>
              </div>

              {/* 게이지 바 */}
              <div className="w-full md:w-5/12 space-y-2">
                <div className="flex justify-between text-xs font-semibold tracking-tighter text-white/95">
                  <span>누적 EXP: <strong>{currentExp} / {targetExp} XP</strong></span>
                  <span className="text-cyan-300 font-semibold tracking-tighter">{expPercent}% 달성 중</span>
                </div>
                <div className="w-full bg-black/50 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/30 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-[#7af1fc] via-[#38bdf8] to-[#4eed80] rounded-full transition-all duration-1000" style={{ width: `${expPercent}%` }} />
                </div>
              </div>
            </div>

            {/* ✨ 현재 등급 vs 다음 등급 마스코트 캐릭터 비주얼 쇼케이스 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* 현재 등급 캐릭터 카드 */}
              <div className="bg-white/10 rounded-3xl p-4 sm:p-5 border border-amber-300/50 flex items-center gap-4 relative overflow-hidden group hover:bg-white/15 transition-all shadow-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400/20 via-gray-800/20 to-white/30 border-2 border-amber-300 flex items-center justify-center p-1.5 shadow-lg flex-shrink-0">
                  <img
                    src={getJobCharacterImage(currentJobName, level)}
                    alt={`현재 등급 마스코트: ${currentJobName}`}
                    className="w-full h-full object-contain filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="overflow-hidden space-y-1 flex-1">
                  <span className="text-[11px] font-semibold tracking-tighter uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 inline-block shadow-2xs">
                    🏆 현재 달성 등급
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold tracking-tighter text-white tracking-tight truncate">
                    {getJobCharacterTitle(currentJobName, level, `${currentRank.lvTitle} ${currentRank.title}`)}
                  </h4>
                  <p className="text-xs text-amber-200 font-semibold leading-relaxed break-keep">
                    현재 달성 완료한 영예의 탐험 캐릭터 모습입니다. 지속적인 활동으로 다음 단계에 도전하세요!
                  </p>
                </div>
              </div>

              {/* 다음 등급 캐릭터 카드 */}
              {level < 5 ? (
                <div className="bg-white/5 rounded-3xl p-4 sm:p-5 border border-cyan-300/40 flex items-center gap-4 relative overflow-hidden group hover:bg-white/10 transition-all shadow-md">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-white/20 border-2 border-cyan-300/70 flex items-center justify-center p-1.5 shadow-lg flex-shrink-0 relative">
                    <img
                      src={getJobCharacterImage(currentJobName, level + 1)}
                      alt={`다음 등급 마스코트: ${currentJobName}`}
                      className="w-full h-full object-contain filter drop-shadow-md opacity-85 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute -top-2 -right-2 bg-cyan-400 text-slate-950 text-[10px] font-semibold tracking-tighter px-2 py-0.5 rounded-md shadow-sm border border-white">
                      NEXT
                    </div>
                  </div>
                  <div className="overflow-hidden space-y-1 flex-1">
                    <span className="text-[11px] font-semibold tracking-tighter uppercase px-2.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 inline-block shadow-2xs">
                      🚀 다음 승급 목표 캐릭터
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold tracking-tighter text-cyan-200 tracking-tight truncate">
                      {getJobCharacterTitle(currentJobName, level + 1, `${nextRank.lvTitle} ${nextRank.title}`)}
                    </h4>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed break-keep">
                      <strong className="text-amber-300 underline font-semibold tracking-tighter">{remainingExp} XP</strong>를 추가로 획득하시면 새로운 마스코트 캐릭터가 공식 해금되어 뱃지가 진화합니다!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-3xl p-4 sm:p-5 border-2 border-emerald-400 flex items-center gap-4 shadow-md">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-400/20 border-2 border-emerald-300 flex items-center justify-center p-2 text-4xl flex-shrink-0">
                    👑
                  </div>
                  <div className="overflow-hidden space-y-1 flex-1">
                    <span className="text-[11px] font-semibold tracking-tighter uppercase px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 inline-block">
                      ✨ 최고 등급 마스터 달성
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold tracking-tighter text-emerald-200">
                      최상위 마스터 랭크
                    </h4>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed break-keep">
                      모든 탐험 레벨과 캐릭터를 해독하신 진정한 맞춤 설계 마이스터입니다!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none transform scale-150">
            <MascotAri pose="celebrate" size="lg" />
          </div>
        </Card>

        {/* Cumulative Quick Stat Cards (3 COL) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="surface" padding="md" hoverEffect className="flex flex-col justify-between border-2 border-primary/20 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-tighter text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-block whitespace-nowrap">
                  📊 3대 다면 진단 완료도
                </span>
                <h4 className="text-2xl font-semibold tracking-tighter text-text-primary mt-1">3종 모두 완료 ✨</h4>
                <p className="text-xs text-text-muted break-keep">흥미무드, 다중지능, 학습스타일 리포트 누적</p>
              </div>
              <span className="p-3.5 rounded-3xl bg-primary-fixed text-primary text-2xl shadow-sm font-semibold tracking-tighter flex-shrink-0">
                🧠
              </span>
            </div>
            <Link to="/self-understanding" className="text-xs font-semibold tracking-tighter text-primary hover:underline flex items-center gap-1 mt-4 pt-3 border-t border-surface-variant/30">
              <span className="whitespace-nowrap">누적 리포트 비교 열람하기</span> <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </Card>

          <Card variant="surface" padding="md" hoverEffect className="flex flex-col justify-between border-2 border-secondary/30 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-tighter text-secondary-spot bg-secondary/15 px-2.5 py-1 rounded-full inline-block whitespace-nowrap">
                  🎯 누적 퀘스트 클리어
                </span>
                <h4 className="text-2xl font-semibold tracking-tighter text-text-primary mt-1">총 14개 완수 🚀</h4>
                <p className="text-xs text-text-muted break-keep">세특 탐구 및 로드맵 실전 미션 누적</p>
              </div>
              <span className="p-3.5 rounded-3xl bg-[#7af1fc]/30 text-secondary-spot text-2xl shadow-sm font-semibold tracking-tighter flex-shrink-0">
                🌌
              </span>
            </div>
            <Link to="/portfolio" className="text-xs font-semibold tracking-tighter text-secondary-spot hover:underline flex items-center gap-1 mt-4 pt-3 border-t border-surface-variant/30">
              <span className="whitespace-nowrap">내 포트폴리오 보관함 이동</span> <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </Card>

          <Card variant="surface" padding="md" hoverEffect className="flex flex-col justify-between border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-tighter text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  🔥 50일 자기주도 챌린지
                </span>
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-semibold tracking-tighter shadow-md flex-shrink-0">
                  <Flame className="w-6 h-6 fill-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-semibold tracking-tighter text-text-primary">현재 <strong className="text-orange-600">14일 연속</strong> 완결 성공!</h4>
                <p className="text-xs text-text-muted leading-relaxed break-keep">내일 한 번 더 완수 시 '3주차 열정 마스터 뱃지'와 +50 EXP 보너스가 추가 지급됩니다.</p>
              </div>
            </div>
            <Link to="/habits" className="mt-4 pt-3 border-t border-orange-200/60 flex justify-end">
              <Button variant="outline" size="sm" className="font-semibold tracking-tighter whitespace-nowrap bg-white border-orange-300 text-orange-600 shadow-sm w-full">
                오늘의 루틴 체크하기 &rarr;
              </Button>
            </Link>
          </Card>
        </div>

      </div>

      {/* =====================================================================
          SECTION: 나의 희망 직업 히스토리 & 스위칭 모듈 (Multi-Career Deck)
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xl border-4 border-[#F3EAFE] rounded-[36px] p-8 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-headline font-semibold tracking-tighter text-[#1A1626] flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#7B5CF0]" />
              <span>나의 다중 커리어 히스토리 덱 (Career Decks)</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5672] font-semibold">
              ✨ 과거에 꿈꿨던 진로 목표와 누적 포트폴리오가 모두 보존됩니다! <strong className="text-[#008A90]">해당 직업 카드의 스위칭 버튼을 누르면 그 시점부터 그 직업으로 이어서 활동</strong>을 전개할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. 현재 실시간 활성 (진행중인) 직업 모듈 */}
          <div className="bg-gradient-to-br from-[#E6FAFE] to-[#F2FEFF] border-[3px] border-[#008A90] rounded-[32px] p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden transform scale-[1.02]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100/50 rounded-bl-full -z-0 pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-semibold tracking-tighter px-3 py-1.5 rounded-full shadow-sm bg-[#008A90] text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> ★ 현재 퀘스트 진행중 메인 직업
              </span>
            </div>
            
            <div className="flex items-center gap-5 z-10">
              <div className="w-20 h-20 rounded-full bg-white p-2 shadow-lg border-2 border-[#B0EFF7] flex items-center justify-center flex-shrink-0">
                <img src={currentAvatarUrl} alt="Main Avatar" className="w-full h-full object-contain filter drop-shadow-md" />
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-tighter text-[#006970] block mb-1">나의 최우선 타겟 직무</span>
                <strong className="text-lg font-semibold tracking-tighter text-[#1A1626] leading-tight block">{currentJobName}</strong>
              </div>
            </div>

            <div className="bg-white/80 p-3.5 rounded-3xl border border-cyan-100 shadow-inner z-10 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold tracking-tighter text-[#3F3952]">
                <span>📁 누적 진로 포트폴리오</span>
                <span className="text-[#008A90]">{savedUserActivities.length + 3}건 기록됨</span>
              </div>
              <div className="flex justify-between text-xs font-semibold tracking-tighter text-[#3F3952]">
                <span>🏆 현재 도달 랭크</span>
                <span className="text-[#008A90]">다이아 엑스퍼트 (Lv.5)</span>
              </div>
            </div>

            <button disabled className="w-full py-3.5 rounded-[18px] bg-[#E8F8FA] border-2 border-[#008A90]/20 text-[#008A90] font-semibold tracking-tighter text-sm transition-all flex items-center justify-center gap-2 cursor-default z-10">
              <CheckCircle2 className="w-4 h-4" />
              <span>현재 실시간 가동 중입니다</span>
            </button>
          </div>

          {/* 2. 과거 누적 히스토리 직업 모듈들 */}
          {jobHistoryList.map((job, idx) => (
            <div key={idx} className={`bg-[#FAFAFF] border-2 border-[#E8DFFA] rounded-[32px] p-6 shadow-sm hover:shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 transform hover:-translate-y-1 ${job.bgColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-tighter px-3 py-1.5 rounded-full shadow-sm bg-purple-100 text-[#6240D5] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> 과거 누적 히스토리 보존중
                </span>
                <button
                  onClick={() => setJobToDelete(job)}
                  title="이 직업 보관 기록 삭제하기"
                  className="p-2.5 rounded-full text-red-500 hover:text-white hover:bg-red-500 bg-red-50/90 transition-all shadow-sm border border-red-200 hover:border-red-500 active:scale-95 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-white p-2 shadow-md border-2 border-[#E2DAFF] flex items-center justify-center flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                  <img src={job.imageUrl} alt={job.name} className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-tighter text-[#7B5CF0] block mb-1">{job.category}</span>
                  <strong className="text-base font-semibold tracking-tighter text-[#1A1626] leading-tight block">{job.name}</strong>
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-3xl border border-purple-50 shadow-inner flex flex-col gap-1.5 opacity-90">
                <div className="flex justify-between text-[11px] font-semibold tracking-tighter text-[#5C5672]">
                  <span>마지막 활동 일자</span>
                  <span>{job.lastActive}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold tracking-tighter text-[#5C5672]">
                  <span>📁 누적 진로 포트폴리오</span>
                  <span className="text-[#7B5CF0]">{job.recordsCount}건 안전 보존됨</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold tracking-tighter text-[#5C5672]">
                  <span>🏆 도달했던 랭크</span>
                  <span className="text-[#7B5CF0]">{job.rank}</span>
                </div>
              </div>

              <button
                onClick={() => handleSwitchCareerJob(job)}
                className="w-full py-3.5 rounded-[18px] bg-gradient-to-r from-[#7B5CF0] to-[#6240D5] hover:brightness-110 text-white font-semibold tracking-tighter text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <SwitchCamera className="w-4 h-4" />
                <span>이 직업으로 변경하고 이어하기</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TABS SELECTOR (BADGES vs QUESTS vs HABIT TRENDS) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/50 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-tighter transition-all whitespace-nowrap border ${
                activeCategory === "all"
                  ? "bg-primary text-on-primary border-primary shadow-md"
                  : "bg-surface-container-low text-text-muted border-surface-variant/50 hover:bg-surface-container"
              }`}
            >
              🏅 뱃지 컬렉션 & 누적 퀘스트 전체
            </button>
            <button
              onClick={() => setActiveCategory("badges")}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-tighter transition-all whitespace-nowrap border ${
                activeCategory === "badges"
                  ? "bg-primary text-on-primary border-primary shadow-md"
                  : "bg-surface-container-low text-text-muted border-surface-variant/50 hover:bg-surface-container"
              }`}
            >
              🌟 획득/미획득 뱃지 모아보기 (8건)
            </button>
            <button
              onClick={() => setActiveCategory("quests")}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-tighter transition-all whitespace-nowrap border ${
                activeCategory === "quests"
                  ? "bg-primary text-on-primary border-primary shadow-md"
                  : "bg-surface-container-low text-text-muted border-surface-variant/50 hover:bg-surface-container"
              }`}
            >
              ✅ 실천 완료 퀘스트 및 습관 로그
            </button>
          </div>

          <span className="text-xs font-medium tracking-tight text-text-muted whitespace-nowrap">
            ● 아리(Ari) AI 동기부여 엔진 · 데이터 안전 동기화 완료
          </span>
        </div>

        {/* SECTION 1: BADGE COLLECTION (획득/미획득 자극 엔진) */}
        {(activeCategory === "all" || activeCategory === "badges") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-headline font-semibold tracking-tighter text-text-primary flex items-center gap-2">
                <Award className="w-5 h-5 text-primary flex-shrink-0" />
                <span>ReadyCareer 명예의 뱃지 컬렉션 (현재 5개 획득 / 3개 미획득)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {badgeCollection.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden min-h-[220px] ${
                    badge.unlocked
                      ? "bg-white border-primary/40 shadow-3d-ambient hover:scale-[1.02] hover:border-primary"
                      : "bg-surface-container/50 border-surface-variant/40 opacity-75 grayscale hover:grayscale-0 transition-all"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl drop-shadow-md">{badge.icon}</span>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-semibold tracking-tighter bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap border border-primary/20">
                          ✓ 획득 완료
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold tracking-tighter bg-surface-variant/40 text-text-muted px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                          <Lock className="w-3 h-3 flex-shrink-0" /> 도전 중
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-headline font-semibold tracking-tighter text-text-primary text-base leading-snug">
                        {badge.name}
                      </h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {badge.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-surface-variant/30 text-[11px] font-semibold tracking-tighter">
                    {badge.unlocked ? (
                      <span className="text-secondary-spot flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 inline flex-shrink-0" /> 획득일: {badge.date}
                      </span>
                    ) : (
                      <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-lg block text-center font-medium tracking-tight whitespace-nowrap">
                        🎯 {badge.requirement}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: COMPLETED QUESTS & HABIT STREAK LOGS */}
        {(activeCategory === "all" || activeCategory === "quests") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Completed Quests Timeline (7 COL) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-surface-variant/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-headline font-semibold tracking-tighter text-text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary-spot flex-shrink-0" />
                    <span>최근 실천 완료 퀘스트 및 탐구 내역</span>
                  </h3>
                  <p className="text-xs text-text-muted">내가 수행하고 주도적으로 완수한 진로 활동은 선생님의 생기부 데이터로 전달됩니다.</p>
                </div>
                <span className="text-xs font-semibold tracking-tighter text-primary bg-primary-fixed/50 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  총 14건 완수
                </span>
              </div>

              <div className="space-y-4">
                {completedQuests.map((q) => (
                  <div key={q.id} className="p-4 rounded-3xl bg-surface-container-low border border-surface-variant/40 hover:border-secondary transition-colors flex items-center justify-between gap-4 shadow-inner">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tracking-tighter uppercase text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                          {q.type}
                        </span>
                        <span className="text-xs text-text-muted font-medium tracking-tight whitespace-nowrap">{q.date}</span>
                      </div>
                      <h4 className="text-sm font-headline font-semibold tracking-tighter text-text-primary truncate">
                        {q.title}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold tracking-tighter text-white bg-primary px-3 py-1 rounded-full whitespace-nowrap shadow-sm flex-shrink-0">
                      {q.exp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Habit Execution Logs & Success Rates (5 COL) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-surface-variant/50 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-headline font-semibold tracking-tighter text-text-primary flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span>50일 자기계발 실천 습관 현황</span>
                    </h3>
                    <p className="text-xs text-text-muted">매일 쌓이는 작은 세특 습관이 최고의 입시 스펙이 됩니다.</p>
                  </div>
                  <span className="text-xs font-semibold tracking-tighter text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    평균 92% 달성
                  </span>
                </div>

                <div className="space-y-5 pt-2">
                  {habitsList.map((h, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold tracking-tighter gap-2">
                        <span className="text-text-primary truncate">{h.title}</span>
                        <span className="text-orange-600 font-semibold tracking-tighter whitespace-nowrap flex-shrink-0">{h.streak} ({h.rate}%)</span>
                      </div>
                      <ProgressBar value={h.rate} max={100} variant="teal" className="h-2.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-surface-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary-fixed/20 p-4 rounded-3xl">
                <div className="flex items-center gap-3">
                  <MascotAri pose="sticker" size="sm" rotate={false} />
                  <div>
                    <strong className="text-xs font-semibold tracking-tighter text-primary block whitespace-nowrap">아리(Ari)의 동기부여 코칭</strong>
                    <span className="text-[11px] text-text-muted">오늘 습관을 체크하면 레벨 6 고지에 도약할 수 있어요!</span>
                  </div>
                </div>
                <Link to="/habits" className="w-full sm:w-auto">
                  <Button variant="teal" size="sm" className="w-full sm:w-auto font-semibold tracking-tighter text-xs whitespace-nowrap shadow-md hover:scale-105 transition-transform">
                    🎯 50일 습관 그리드 & 챌린지 관리 &rarr;
                  </Button>
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 🗑️ 직업 히스토리 삭제 확인 팝업 (모달) */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 sm:p-8 max-w-md w-full border-4 border-white shadow-sm text-center space-y-6 relative animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-500 shadow-inner">
              <AlertTriangle className="w-10 h-10 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tighter text-[#1A1626] tracking-tight">
                정말 이 직업 기록을 <br />
                <span className="text-red-600">인벤토리에서 삭제</span>하시겠어요?
              </h3>
              <div className="p-3 bg-white rounded-3xl border border-slate-200 flex items-center justify-center gap-3 my-3">
                {jobToDelete.imageUrl && (
                  <img src={jobToDelete.imageUrl} alt="job" className="w-10 h-10 object-contain drop-shadow" />
                )}
                <strong className="text-base font-semibold tracking-tighter text-[#6240D5]">{jobToDelete.name}</strong>
              </div>
              <p className="text-xs sm:text-sm text-[#5C5672] font-medium tracking-tight leading-relaxed break-keep">
                삭제 시 해당 직업으로 누적되었던 <strong>포트폴리오 및 도달 랭크 히스토리</strong>가 보관함 목록에서 완전히 지워지며 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setJobToDelete(null)}
                className="flex-1 py-3.5 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#484554] font-semibold tracking-tighter text-sm transition-all shadow-sm cursor-pointer"
              >
                취소 (유지하기)
              </button>
              <button
                onClick={handleConfirmDeleteJob}
                className="flex-1 py-3.5 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold tracking-tighter text-sm shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                <span>네, 삭제합니다</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyPage;
