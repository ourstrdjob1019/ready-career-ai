import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, useSelfUnderstanding } from "../../context";
import type { UserRole } from "../../context";
import { JOB_VENGERS_LIST } from "../../assets/mascotData";
import {
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";

interface ExpoAccountItem {
  name: string;
  role: UserRole;
  school: string;
  grade?: number;
  badge: string;
  desc: string;
  targetJob?: string;
  riasecCode?: string;
}

const STUDENT_ACCOUNTS: ExpoAccountItem[] = [
  {
    name: "김수진",
    role: "student",
    school: "서울창의고등학교",
    grade: 2,
    badge: "⭐ 대표 시연",
    desc: "AI 에듀테크 진로 멘토 지망 (SI 유형) · Lv.5 진행도 84% 및 50일 습관 14일 연속 완수 장착됨.",
    targetJob: "스마트 AI 에듀테크 진로 멘토",
    riasecCode: "SI",
  },
  {
    name: "이재현",
    role: "student",
    school: "서울창의고등학교",
    grade: 2,
    badge: "🤖 로보틱스",
    desc: "AI 로봇 융합 연구원 지망 (RC 유형) · 아두이노 모션 로봇 프로젝트 포트폴리오 탑재.",
    targetJob: "AI 로봇 융합 연구원",
    riasecCode: "RC",
  },
  {
    name: "신규 방문 학생",
    role: "student",
    school: "서울창의고등학교",
    grade: 1,
    badge: "🌱 신규 체험",
    desc: "온보딩 정보입력 ➜ 흥미유형 6유형 검사 ➜ 리포트 및 대시보드로 이어지는 기획 흐름을 처음부터 직접 진행합니다.",
    targetJob: "진로 탐색 중",
    riasecCode: "미구연",
  },
];

const TEACHER_ACCOUNTS: ExpoAccountItem[] = [
  {
    name: "박성열 담임교사",
    role: "teacher",
    school: "서울창의고등학교 진로학업부",
    badge: "👨‍🏫 교직원 시연",
    desc: "담당 고교 학급 학생 명부 및 2026 교육부 기재요령 100% 반영 AI 생기부 어시스턴트 보드 실전 즉각 호출.",
  },
  {
    name: "최종마스터 통제관",
    role: "super_admin",
    school: "ReadyCareer AI 통합 센터",
    badge: "👑 최종 관제실",
    desc: "전국 인가 고등학교별 신규 가입 제어 토글 및 API 및 시계열 트래픽 원격 통계 모니터링.",
  },
];

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startExpoDemo } = useAuth();
  const { resetAssessments } = useSelfUnderstanding();

  const [showDemoAccounts, setShowDemoAccounts] = useState<boolean>(false);
  const [expoTab, setExpoTab] = useState<"student" | "teacher">("student");

  // 게임버튼 '클릭하여 시작하기' 및 신규 온보딩 시작 핸들러
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
    resetAssessments();

    startExpoDemo("student", {
      name: "",
      school: "",
      grade: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "미진단",
    });
    navigate("/onboarding-info");
  };

  const handleSelectExpoAccount = (account: ExpoAccountItem) => {
    if (account.name === "신규 방문 학생") {
      handleStartExperience();
    } else {
      localStorage.removeItem("is_new_student_clean_state");
      startExpoDemo(account.role, {
        name: account.name,
        school: account.school,
        grade: account.grade || 2,
        targetJob: account.targetJob || "AI 진로탐색",
        riasecCode: account.riasecCode || "SI",
      });
      if (account.role === "super_admin") {
        navigate("/super-admin");
      } else if (account.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6FF] text-[#1A1626] relative overflow-x-hidden selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
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
      `}</style>

      {/* Ambient Pastel Glassmorphism Halo Spheres */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#E3D8FF]/60 via-[#FCE4FF]/50 to-[#C7FAFE]/50 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-gradient-to-tl from-[#FFE5EC]/60 to-[#D4E9FF]/60 rounded-full blur-[90px] pointer-events-none -z-0" />

      {/* Main Landing Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border-2 border-[#E0D5FF] shadow-[0_8px_20px_rgba(123,92,240,0.15)] mb-8 animate-bounce-once">
          <Sparkles className="w-5 h-5 text-[#7B5CF0] animate-spin-slow" />
          <span className="text-xs sm:text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-[#6240D5] via-[#FF4081] to-[#008A90]">
            파스텔톤 꿈 설계의 첫걸음 · 3D 직업 아리 '직벤져스' 에디션
          </span>
        </div>

        {/* Hero Main Titles */}
        <div className="text-center space-y-6 max-w-5xl">
          {/* Main Giant Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1A1626] drop-shadow-[0_12px_28px_rgba(98,64,213,0.18)] selection:bg-[#FF4081] selection:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6240D5] via-[#7B5CF0] to-[#008A90]">
              ReadyCareerAI
            </span>
          </h1>

          {/* Subtitle with Highlighting on '꿈' */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#3D3554] tracking-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <span>나의</span>
            <span className="relative inline-flex items-center justify-center px-4 sm:px-6 py-1.5 sm:py-2 mx-1 rounded-[22px] bg-gradient-to-r from-[#FF3B7C] via-[#FF5492] to-[#FF2E74] text-white font-black text-3xl sm:text-5xl md:text-6xl shadow-[0_10px_30px_rgba(255,59,124,0.5)] transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 animate-pulse">
              <span>꿈</span>
              <span className="absolute -top-3 -right-2 text-xl sm:text-2xl animate-bounce">✨</span>
            </span>
            <span>! 설계하기</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#6E6A80] font-semibold max-w-2xl mx-auto pt-2 leading-relaxed">
            나만의 고유한 흥미와 재능을 AI 파트너 아리와 함께 분석하고, <br className="hidden sm:block" />
            밤하늘 커리어 별자리 로드맵을 향한 여정을 지금 즉시 <strong>스타트</strong>하세요!
          </p>
        </div>

        {/* JOB-VENGERS Infinite Horizontal Marquee Section */}
        <div className="w-full mt-14 mb-14 relative py-6">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B5CF0] bg-[#7B5CF0]/10 px-4 py-1.5 rounded-full border border-[#7B5CF0]/20">
              🛸 직업 어드벤처 · 10인의 '직벤져스' 아리 라이브 롤링
            </span>
          </div>

          {/* Faded Gradient Mask for Left/Right Edges */}
          <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-[#FAF6FF] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-[#FAF6FF] to-transparent z-10 pointer-events-none" />

          {/* Infinite Rolling Track */}
          <div className="overflow-hidden py-4">
            <div className="animate-jobvenger-marquee gap-6 px-3">
              {[...JOB_VENGERS_LIST, ...JOB_VENGERS_LIST].map((item, index) => (
                <div
                  key={index}
                  className={`w-56 sm:w-64 h-72 rounded-[34px] bg-gradient-to-b ${item.bgGradient} p-5 border-2 border-white shadow-[0_16px_36px_rgba(123,92,240,0.12)] hover:shadow-[0_24px_48px_rgba(123,92,240,0.28)] transition-all duration-300 flex flex-col items-center justify-between group transform hover:-translate-y-2.5 cursor-pointer relative`}
                  onClick={handleStartExperience}
                  title={`${item.title}와 함께 바로 시작하기!`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-white/90 shadow-sm text-[#3E3852]">
                      #{item.id} 직벤져스
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  </div>

                  {/* Character Avatar */}
                  <div className="w-32 h-32 rounded-full bg-white/80 p-2.5 shadow-inner border-2 border-white flex items-center justify-center my-1 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  {/* Role Title & Category */}
                  <div className="w-full text-center space-y-1.5 bg-white/90 backdrop-blur-sm py-2.5 px-3 rounded-2xl border border-white shadow-sm">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${item.badgeColor} block w-fit mx-auto`}>
                      {item.category}
                    </span>
                    <strong className="text-sm font-extrabold text-[#1A1626] block tracking-tight group-hover:text-[#7B5CF0] transition-colors truncate">
                      {item.title}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GAME STYLE START BUTTON */}
        <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center z-20">
          <div className="w-full p-1.5 rounded-[32px] bg-gradient-to-r from-[#7B5CF0] via-[#FF3B7C] to-[#008A90] shadow-[0_0_40px_rgba(123,92,240,0.45)] hover:shadow-[0_0_60px_rgba(255,59,124,0.65)] transition-all duration-500">
            <button
              onClick={handleStartExperience}
              className="w-full py-5 px-8 bg-gradient-to-b from-[#7B5CF0] to-[#5C32E3] hover:from-[#8A6DF7] hover:to-[#4C22D3] text-white rounded-[26px] font-black text-2xl sm:text-3xl tracking-wide border-2 border-[#B3A0FF] border-b-[10px] border-b-[#3A1499] active:border-b-[2px] active:translate-y-2 transition-all duration-150 flex items-center justify-center gap-3 sm:gap-4 shadow-2xl cursor-pointer group"
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md">
                🕹️
              </span>
              <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] font-body-md font-black">
                클릭하여 시작하기
              </span>
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow-md group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
          <span className="text-xs font-bold text-[#7B5CF0] bg-white/90 px-4 py-1 rounded-full shadow-sm border border-[#E0D5FF] mt-4 animate-bounce-once">
            ⚡ 버튼을 누르면 즉시 맞춤 온보딩 화면으로 진입합니다
          </span>
        </div>

        {/* PRESERVED EXPO DEMO ACCOUNTS TOGGLE (For convenience without breaking past setup) */}
        <div className="mt-20 w-full max-w-4xl pt-8 border-t-2 border-[#EAE3FF] text-center">
          <button
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/80 hover:bg-white text-[#5B556D] hover:text-[#7B5CF0] text-xs sm:text-sm font-extrabold shadow-sm border border-[#E0D5FF] transition-all"
          >
            <span>🎪 [박람회 시연자 및 교사용] 대표 테스트 아이디 빠른 접속 열기</span>
            {showDemoAccounts ? <ChevronUp className="w-4 h-4 text-[#7B5CF0]" /> : <ChevronDown className="w-4 h-4 text-[#7B5CF0]" />}
          </button>

          {showDemoAccounts && (
            <div className="mt-8 text-left bg-white rounded-[36px] p-6 sm:p-10 border-2 border-[#E0D5FF] shadow-[0_20px_50px_rgba(123,92,240,0.12)] space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4F2FA] pb-6">
                <div>
                  <h3 className="text-xl font-black text-[#1A1626] flex items-center gap-2">
                    <span>⚡ 대표 1초 체험 아이디 선택 (시연 전용)</span>
                  </h3>
                  <p className="text-xs text-[#6E6A80] mt-1">
                    원하시는 회원 권한을 선택하여 터치하면 1초 만에 세팅된 화면으로 바로 입장합니다.
                  </p>
                </div>

                <div className="inline-flex p-1.5 rounded-2xl bg-[#EFEDF5] border border-[#E3E1E9]">
                  <button
                    onClick={() => setExpoTab("student")}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                      expoTab === "student"
                        ? "bg-[#7B5CF0] text-white shadow-md"
                        : "text-[#6E6A80]"
                    }`}
                  >
                    🧑‍🎓 학생용 (3종)
                  </button>
                  <button
                    onClick={() => setExpoTab("teacher")}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                      expoTab === "teacher"
                        ? "bg-[#006970] text-white shadow-md"
                        : "text-[#6E6A80]"
                    }`}
                  >
                    👨‍🏫 교사용/관제실 (2종)
                  </button>
                </div>
              </div>

              {/* Grid Account Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {expoTab === "student"
                  ? STUDENT_ACCOUNTS.map((acc, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectExpoAccount(acc)}
                        className="p-6 rounded-[24px] bg-[#F9F7FF] hover:bg-[#F0EBFF] border-2 border-[#E5DFFA] hover:border-[#7B5CF0] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{idx === 0 ? "⭐" : idx === 1 ? "🤖" : "🌱"}</span>
                            <span className="text-[10px] font-black bg-[#7B5CF0]/15 text-[#7B5CF0] px-2.5 py-1 rounded-full">
                              {acc.badge}
                            </span>
                          </div>
                          <div>
                            <strong className="text-base font-extrabold text-[#1A1626] block group-hover:text-[#7B5CF0]">
                              {acc.name}
                            </strong>
                            <span className="text-xs text-[#006970] font-semibold block">
                              {acc.school} {acc.grade ? `(${acc.grade}학년)` : ""}
                            </span>
                          </div>
                          <p className="text-xs text-[#524D64] leading-relaxed bg-white p-3 rounded-xl border border-purple-100 shadow-inner">
                            {acc.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-purple-100 text-xs font-black text-[#7B5CF0] flex items-center justify-between">
                          <span>이 계정으로 입장 &rarr;</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                    ))
                  : TEACHER_ACCOUNTS.map((acc, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectExpoAccount(acc)}
                        className="p-6 rounded-[24px] bg-[#EAFBFB]/60 hover:bg-[#D5F5F6] border-2 border-[#C0ECEE] hover:border-[#006970] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{idx === 0 ? "👨‍🏫" : "👑"}</span>
                            <span className="text-[10px] font-black bg-[#006970]/15 text-[#006970] px-2.5 py-1 rounded-full">
                              {acc.badge}
                            </span>
                          </div>
                          <div>
                            <strong className="text-base font-extrabold text-[#1A1626] block group-hover:text-[#006970]">
                              {acc.name}
                            </strong>
                            <span className="text-xs text-[#4A5D5F] font-semibold block">
                              {acc.school}
                            </span>
                          </div>
                          <p className="text-xs text-[#484554] leading-relaxed bg-white p-3 rounded-xl border border-cyan-100 shadow-inner">
                            {acc.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-cyan-100 text-xs font-black text-[#006970] flex items-center justify-between">
                          <span>관리자 입장 &rarr;</span>
                          <CheckCircle2 className="w-4 h-4 text-[#006970]" />
                        </div>
                      </div>
                    ))}
              </div>

              {/* Manual Login & Signup Links */}
              <div className="p-6 rounded-3xl bg-[#F4F2FA] border border-[#E3E1E9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs md:text-sm font-bold text-[#5B556D]">
                  💡 정식 계정으로 직접 회원가입을 하거나 일반 계정 로그인이 필요하신가요?
                </span>
                <div className="flex gap-2">
                  <Link to="/signup">
                    <button className="px-4 py-2 bg-[#7B5CF0] text-white rounded-xl text-xs font-black hover:bg-[#6240D5]">
                      회원가입
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-4 py-2 bg-white text-[#1A1626] rounded-xl text-xs font-bold border border-[#E3E1E9] hover:bg-gray-50">
                      로그인 &rarr;
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StartScreen;
