import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useSelfUnderstanding } from "../../context";
import { JOB_VENGERS_LIST } from "../../assets/mascotData";
import { Play } from "lucide-react";

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startExpoDemo } = useAuth();
  const { resetAssessments } = useSelfUnderstanding();

  // 파스텔 3D 게임버튼 '클릭하여 시작하기' 핸들러 (신규 온보딩 진단검사 모듈로 직행)
  const handleStartExperience = () => {
    localStorage.setItem("is_new_student_clean_state", "true");
    localStorage.removeItem("readycareer_assessment_state");
    localStorage.removeItem("readycareer_assessments_real_v1");
    localStorage.removeItem("readycareer_self_report_real_v1");
    localStorage.removeItem("readycareer_student_activities_v1");
    localStorage.removeItem("readycareer_vision_v1");
    localStorage.removeItem("readycareer_selected_job");
    localStorage.removeItem("readycareer_ai_custom_generated");
    localStorage.removeItem("my_star_roadmap");
    localStorage.removeItem("my_habits_v2");
    localStorage.removeItem("my_interested_jobs");
    localStorage.removeItem("readycareer_student_name");
    localStorage.removeItem("readycareer_student_school");
    localStorage.removeItem("readycareer_student_school_code");
    localStorage.removeItem("readycareer_student_grade");
    localStorage.removeItem("readycareer_student_cluster");
    localStorage.removeItem("riasec_result_code");
    localStorage.removeItem("riasec_primary");
    localStorage.removeItem("readycareer_roadmap_generated");
    localStorage.removeItem("my_habits_v2");
    resetAssessments();

    // 초기 0단계 상태로 AI 진단 세션 개설
    startExpoDemo("student", {
      name: "신규 꿈 탐험가",
      school: "차세대 진로 인벤터",
      grade: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "미진단",
    });
    
    // 신규 맞춤형 16문항 아리 인터렉션 온보딩 진단 모듈로 즉시 이동
    navigate("/onboarding-test");
  };

  // 교사·관리자 전용 대시보드 진입 핸들러 (학생 활동 관제 & AI 생기부 리포트 생성)
  const handleStartTeacher = () => {
    startExpoDemo("teacher", {
      name: "진학지도교사",
      school: "서울창의고등학교",
      grade: 2,
      role: "teacher",
    });
    navigate("/teacher");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#111111] relative overflow-x-hidden selection:bg-[#111] selection:text-white flex flex-col justify-between font-sans">
      {/* 3D Infinite Marquee Keyframe Styles */}
      <style>{`
        @keyframes jobvengerMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-jobvenger-marquee {
          display: flex;
          width: max-content;
          animation: jobvengerMarquee 38s linear infinite;
        }
        .animate-jobvenger-marquee:hover {
          animation-play-state: paused;
        }

        /* 리얼 3D 무중력 둥둥 부유 애니메이션 (4가지 자유 궤도) */
        @keyframes float3D_1 {
          0%, 100% { transform: translate3d(0px, 0px, 0px) rotate(-6deg) scale(1); }
          33% { transform: translate3d(16px, -20px, 0px) rotate(4deg) scale(1.05); }
          66% { transform: translate3d(-12px, -15px, 0px) rotate(-10deg) scale(0.95); }
        }
        @keyframes float3D_2 {
          0%, 100% { transform: translate3d(0px, 0px, 0px) rotate(8deg) scale(1); }
          50% { transform: translate3d(-20px, 25px, 0px) rotate(18deg) scale(1.06); }
        }
        @keyframes float3D_3 {
          0%, 100% { transform: translate3d(0px, 0px, 0px) rotate(-12deg) scale(0.95); }
          50% { transform: translate3d(22px, -28px, 0px) rotate(-2deg) scale(1.05); }
        }
        @keyframes float3D_4 {
          0%, 100% { transform: translate3d(0px, 0px, 0px) rotate(4deg) scale(1.02); }
          50% { transform: translate3d(-15px, -22px, 0px) rotate(-10deg) scale(0.97); }
        }
        .animate-3d-float-1 { animation: float3D_1 6.5s ease-in-out infinite; }
        .animate-3d-float-2 { animation: float3D_2 8s ease-in-out infinite; }
        .animate-3d-float-3 { animation: float3D_3 9.5s ease-in-out infinite; }
        .animate-3d-float-4 { animation: float3D_4 7.2s ease-in-out infinite; }
      `}</style>

      {/* 🔮 3D 직업 캐릭터 자유 매트릭스 배경 레이어 (절도 있는 투명도와 깔끔한 대비로 부유) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { pos: "top-[2%] left-[2%]", size: "w-28 h-28 sm:w-40 sm:h-40", idx: 0, anim: "animate-3d-float-1", delay: "0s" },
          { pos: "top-[5%] left-[24%]", size: "w-24 h-24 sm:w-36 sm:h-36", idx: 1, anim: "animate-3d-float-4", delay: "1.5s" },
          { pos: "top-[3%] right-[24%]", size: "w-28 h-28 sm:w-40 sm:h-40", idx: 2, anim: "animate-3d-float-2", delay: "0.7s" },
          { pos: "top-[6%] right-[3%]", size: "w-32 h-32 sm:w-44 sm:h-44", idx: 3, anim: "animate-3d-float-3", delay: "2.1s" },
          { pos: "top-[26%] left-[4%]", size: "w-32 h-32 sm:w-48 sm:h-48", idx: 4, anim: "animate-3d-float-2", delay: "1.2s" },
          { pos: "top-[29%] right-[5%]", size: "w-32 h-32 sm:w-48 sm:h-48", idx: 5, anim: "animate-3d-float-1", delay: "2.8s" },
          { pos: "top-[46%] left-[1%]", size: "w-28 h-28 sm:w-40 sm:h-40", idx: 6, anim: "animate-3d-float-4", delay: "0.4s" },
          { pos: "top-[49%] right-[2%]", size: "w-28 h-28 sm:w-44 sm:h-44", idx: 7, anim: "animate-3d-float-3", delay: "1.9s" },
          { pos: "top-[68%] left-[6%]", size: "w-32 h-32 sm:w-48 sm:h-48", idx: 8, anim: "animate-3d-float-1", delay: "2.3s" },
          { pos: "top-[71%] right-[6%]", size: "w-32 h-32 sm:w-48 sm:h-48", idx: 9, anim: "animate-3d-float-2", delay: "0.9s" },
          { pos: "bottom-[18%] left-[28%]", size: "w-24 h-24 sm:w-36 sm:h-36", idx: 0, anim: "animate-3d-float-3", delay: "1.6s" },
          { pos: "bottom-[20%] right-[28%]", size: "w-24 h-24 sm:w-36 sm:h-36", idx: 1, anim: "animate-3d-float-4", delay: "2.5s" },
          { pos: "bottom-[3%] left-[10%]", size: "w-28 h-28 sm:w-40 sm:h-40", idx: 2, anim: "animate-3d-float-2", delay: "0.3s" },
          { pos: "bottom-[4%] right-[10%]", size: "w-28 h-28 sm:w-44 sm:h-44", idx: 3, anim: "animate-3d-float-1", delay: "1.8s" },
        ].map((item, i) => {
          const character = JOB_VENGERS_LIST[item.idx % JOB_VENGERS_LIST.length];
          return (
            <div
              key={i}
              className={`absolute ${item.pos} ${item.size} pointer-events-none`}
            >
              <div 
                className={`w-full h-full ${item.anim} opacity-[0.16] sm:opacity-[0.22] grayscale hover:grayscale-0 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300`}
                style={{ animationDelay: item.delay }}
              >
                <img
                  src={character.imageUrl}
                  alt={character.title}
                  className="w-full h-full object-contain pointer-events-auto cursor-pointer hover:opacity-100 hover:scale-125 transition-all duration-300"
                  onClick={handleStartExperience}
                  title={`${character.title}와 함께 바로 진로 탐험 퀘스트 시작하기!`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Landing Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 flex flex-col items-center justify-center flex-grow w-full space-y-12">
        
        {/* Hero Main Titles - Klyro High-Contrast & Minimalist */}
        <div className="text-center space-y-6 max-w-4xl">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-extrabold shadow-sm tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2026 AI ADVANCED CAREER EXPLORATION PLATFORM</span>
          </div>

          {/* Main Giant Hero Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#111111] leading-none">
            ReadyCareerAI
          </h1>

          {/* Subtitle with Sleek Purple & Violet Contrast Badge on '꿈' */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1F193B] tracking-tight flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
            <span>나의</span>
            <span className="inline-flex items-center justify-center px-6 sm:px-8 py-1 sm:py-1.5 mx-1 rounded-[24px] bg-gradient-to-r from-[#5E32EB] to-[#8A63FF] text-amber-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-[0_6px_20px_rgba(94,50,235,0.35)] border border-[#A582FF]/50 transform -rotate-2 hover:rotate-0 transition-transform duration-200">
              <span>꿈 ✨</span>
            </span>
            <span>설계하기</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto pt-2 leading-relaxed">
            나만의 고유한 흥미와 재능을 AI 파트너 아리와 함께 분석하고, <br className="hidden sm:block" />
            밤하늘 커리어 별자리 로드맵을 향한 맞춤 여정을 지금 즉시 경험해보세요.
          </p>
        </div>

        {/* JOB-VENGERS Infinite Horizontal Marquee Section - Bento Clean Tiles */}
        <div className="w-full my-6 relative py-2">
          <div className="absolute top-0 left-0 w-20 sm:w-36 h-full bg-gradient-to-r from-[#FAFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-20 sm:w-36 h-full bg-gradient-to-l from-[#FAFAFC] to-transparent z-10 pointer-events-none" />

          {/* Infinite Rolling Track */}
          <div className="overflow-hidden py-3">
            <div className="animate-jobvenger-marquee gap-5 px-3">
              {[...JOB_VENGERS_LIST, ...JOB_VENGERS_LIST].map((item, index) => (
                <div
                  key={index}
                  className="w-52 sm:w-60 h-64 rounded-[28px] bg-white p-5 border border-slate-200 shadow-sm hover:border-slate-800 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between group cursor-pointer"
                  onClick={handleStartExperience}
                  title={`${item.title}와 함께 온보딩 바로 개설하기!`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-[#111111] border border-slate-200/80">
                      #{item.id} 직벤져스
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  {/* Character Avatar */}
                  <div className="w-28 h-28 rounded-full bg-slate-50 p-2 border border-slate-100 flex items-center justify-center my-1 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>

                  {/* Role Title & Category */}
                  <div className="w-full text-center space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 block w-fit mx-auto">
                      {item.category}
                    </span>
                    <strong className="text-sm font-black text-[#111111] block tracking-tight truncate">
                      {item.title}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KLYRO HIGH-CONTRAST BENTO ACTION MODES: 학생용 & 교사용 분기 선택 */}
        <div className="w-full max-w-5xl mx-auto px-4 z-20 pt-2">
          <div className="text-center mb-6">
            <span className="px-5 py-2 rounded-full bg-white shadow-xs text-xs sm:text-sm font-black text-slate-700 border border-slate-200 inline-flex items-center gap-2">
              <span>⚡ 원하시는 전공 탐구 및 대시보드 체험 모드를 선택해 주세요</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* 🎓 학생용 시작하기 버튼 - Balanced Purple Pastel & Rich Violet Hero Card */}
            <div
              onClick={handleStartExperience}
              className="group cursor-pointer p-8 rounded-[32px] bg-gradient-to-br from-[#5328E0] via-[#6537EA] to-[#8054FC] text-white border border-[#9A75FF]/40 shadow-[0_20px_60px_rgba(94,50,235,0.25)] hover:shadow-[0_25px_70px_rgba(94,50,235,0.38)] hover:border-[#B596FF] transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/15 via-purple-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-black border border-white/20 shadow-2xs">
                    <span>학생 전용 세션 🎓</span>
                  </span>
                  <span className="text-2xl sm:text-3xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ✨
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight pt-2 text-white">
                  학생용 시작하기
                </h3>
                <p className="text-sm text-purple-100 font-medium leading-relaxed">
                  AI 꿈 설계 &amp; 과목별 진학 로드맵 아키텍트로 맞춤 커버 스토리와 코넬노트 포트폴리오를 빠르게 구축하세요.
                </p>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-purple-200 group-hover:text-white transition-colors">
                  박람회 간편 입장 · 즉각 레벨업 지원
                </span>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#5328E0] group-hover:bg-amber-300 group-hover:text-[#251263] text-xs font-black transition-all shadow-md">
                  <span>진로·학습 퀘스트 개설</span>
                  <Play className="w-3.5 h-3.5 fill-current text-current group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* 🏫 교사·관리자용 시작하기 버튼 - Clean White/Slate Bento Card with Soft Lavender Accents */}
            <div
              onClick={handleStartTeacher}
              className="group cursor-pointer p-8 rounded-[32px] bg-white text-[#1F193B] border border-slate-200 hover:border-[#6A42ED] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-[#6A42ED] text-xs font-black border border-purple-100">
                    <span>교사·관리자 전용 🏫</span>
                  </span>
                  <span className="text-2xl sm:text-3xl opacity-75 group-hover:scale-110 transition-transform">
                    📋
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight pt-2 text-[#1F193B]">
                  교사·관리자용 시작하기
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  학급 학생별 활동 통계 요약 관제 &amp; 2026학년도 기재 요령에 최적화된 AI 생기부 커스텀 초안 생성실.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 group-hover:text-[#6A42ED] transition-colors">
                  선택적 생기부 취합 &amp; 무이모지·무마크다운 출력
                </span>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-50 hover:bg-[#6A42ED] text-[#6A42ED] hover:text-white text-xs font-black transition-all">
                  <span>교사 대시보드 직행</span>
                  <Play className="w-3.5 h-3.5 fill-current text-current group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;

