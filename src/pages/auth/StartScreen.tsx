import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, useSelfUnderstanding } from "../../context";
import type { UserRole } from "../../context";
import { MascotAri } from "../../components/MascotAri";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
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

  const [expoTab, setExpoTab] = useState<"student" | "teacher">("student");

  const handleSelectExpoAccount = (account: ExpoAccountItem) => {
    if (account.name === "신규 방문 학생") {
      // 신규학생 선택 시 세팅된 값 및 예제 내용을 100% 삭제(초기화)
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

      startExpoDemo(account.role, {
        name: "",
        school: "",
        grade: 1,
        targetJob: "진로 탐색 중",
        riasecCode: "미진단",
      });
      navigate("/onboarding-info");
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
    <div className="min-h-[calc(100vh-80px)] bg-[#FBF8FF] text-[#1A1626] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* Container with Stitch Modern Corporate + Soft Minimalism Spacing */}
      <div className="max-w-5xl w-full mx-auto space-y-10">
        
        {/* Header Title Section with 3D Ari Mascot */}
        <div className="bg-gradient-to-r from-[#7B5CF0]/15 via-[#FFFFFF] to-[#006970]/15 rounded-[36px] p-8 md:p-12 border-2 border-[#E3E1E9] shadow-[0_25px_50px_rgba(123,92,240,0.12)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-white text-[#6240d5] font-black px-4 py-1.5 rounded-full text-xs tracking-wide shadow-sm border border-[#cbbeff]">
              <Sparkles className="w-3.5 h-3.5 text-[#7B5CF0]" />
              <span>ReadyCareer AI · 2026 박람회 대표 체험 에디션</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#1A1626] leading-tight">
              AI 생활기록부와 진로 설계의 시작, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6240D5] to-[#006970]">
                지금 바로 체험해보세요!
              </span>
            </h1>

            <p className="text-sm md:text-base text-[#5B556D] pt-1 font-normal leading-relaxed">
              별도의 복잡한 회원가입 절차 없이, <strong>학생용 및 교사용 사전 맞춤 세팅 계정</strong>을 선택하시면 AI 별자리 로드맵과 2026 기재요령 최적화 보드로 단 1초 만에 입장합니다.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs font-bold text-[#006970] bg-[#7af1fc]/20 px-3 py-1.5 rounded-xl border border-[#006970]/20 whitespace-nowrap">
                <BookOpen className="w-3.5 h-3.5" />
                <span>NEIS 기재 지침 100% 준수</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#6240D5] bg-[#7B5CF0]/10 px-3 py-1.5 rounded-xl border border-[#7B5CF0]/20 whitespace-nowrap">
                <Award className="w-3.5 h-3.5" />
                <span>아리 멘토링 즉각 실행</span>
              </div>
            </div>
          </div>

          {/* 3D Mascot Ari Featured Prominently */}
          <div className="flex-shrink-0 z-10 flex flex-col items-center">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-white to-[#f4f2fa] p-3 shadow-2xl border-4 border-white flex items-center justify-center transform transition duration-500 hover:scale-105 hover:rotate-6">
              <MascotAri pose="sticker" size="lg" rotate={false} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <span className="mt-3 text-xs font-black bg-[#7B5CF0] text-white px-4 py-1.5 rounded-full shadow-md animate-bounce-once">
              👋 안녕? 난 공식 AI 파트너 '아리'야!
            </span>
          </div>

          {/* Ambient ambient lighting background sphere */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-br from-[#cbbeff]/20 to-[#7af1fc]/20 rounded-full blur-3xl pointer-events-none -mr-16 -mb-16" />
        </div>

        {/* ACCOUNT SELECTOR SECTION */}
        <div className="bg-[#FFFFFF] rounded-[32px] p-8 md:p-12 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.06)] space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E1E9] pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#1A1626] flex items-center gap-2">
                <span>🎪 1초 체험용 아이디 및 권한 선택</span>
              </h2>
              <p className="text-xs md:text-sm text-[#6E6A80]">
                입장하길 원하는 회원 유형(학생용/교사용)을 선택한 뒤, 시연 아이디를 터치하면 자동으로 로그인이 완성됩니다!
              </p>
            </div>

            {/* Tabs: Student vs Teacher */}
            <div className="inline-flex p-1.5 rounded-2xl bg-[#EFEDF5] border border-[#E3E1E9] shadow-inner self-start sm:self-center">
              <button
                onClick={() => setExpoTab("student")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  expoTab === "student"
                    ? "bg-[#7B5CF0] text-white shadow-[0_4px_12px_rgba(123,92,240,0.3)] scale-[1.02]"
                    : "text-[#6E6A80] hover:text-[#1A1626]"
                }`}
              >
                🧑‍🎓 학생용 체험 (3종)
              </button>
              <button
                onClick={() => setExpoTab("teacher")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  expoTab === "teacher"
                    ? "bg-[#006970] text-white shadow-[0_4px_12px_rgba(0,105,112,0.3)] scale-[1.02]"
                    : "text-[#6E6A80] hover:text-[#1A1626]"
                }`}
              >
                👨‍🏫 교사용 / 관제실 체험 (2종)
              </button>
            </div>
          </div>

          {/* Account List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expoTab === "student"
              ? STUDENT_ACCOUNTS.map((acc, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectExpoAccount(acc)}
                    className="p-7 rounded-[28px] bg-[#F4F2FA] hover:bg-white border-2 border-[#E3E1E9] hover:border-[#7B5CF0] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(123,92,240,0.15)] group relative"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2 rounded-2xl bg-white shadow-sm block group-hover:scale-110 transition-transform">
                          {index === 0 ? "⭐" : index === 1 ? "🤖" : "🌱"}
                        </span>
                        <span className="text-[11px] font-black bg-[#7B5CF0]/15 text-[#7B5CF0] px-3 py-1 rounded-full border border-[#cbbeff]/50">
                          {acc.badge}
                        </span>
                      </div>
                      <div>
                        <strong className="text-xl font-extrabold text-[#1A1626] block group-hover:text-[#7B5CF0] transition-colors">
                          {acc.name}
                        </strong>
                        <span className="text-xs font-semibold text-[#006970] block mt-1">
                          {acc.school} {acc.grade ? `(${acc.grade}학년)` : ""}
                        </span>
                      </div>
                      <p className="text-xs text-[#484554] leading-relaxed bg-white p-4 rounded-2xl border border-white shadow-inner">
                        {acc.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#E3E1E9] text-xs font-black text-[#7B5CF0] flex items-center justify-between group-hover:translate-x-1 transition-transform">
                      <span>⚡ 이 아이디로 즉각 입장 &rarr;</span>
                      <CheckCircle2 className="w-5 h-5 text-[#7B5CF0] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              : TEACHER_ACCOUNTS.map((acc, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectExpoAccount(acc)}
                    className="p-7 rounded-[28px] bg-[#F4F2FA] hover:bg-white border-2 border-[#E3E1E9] hover:border-[#006970] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(0,105,112,0.15)] group relative md:col-span-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2 rounded-2xl bg-white shadow-sm block group-hover:scale-110 transition-transform">
                          {index === 0 ? "👨‍🏫" : "👑"}
                        </span>
                        <span className="text-[11px] font-black bg-[#7af1fc]/30 text-[#006970] px-3 py-1 rounded-full border border-[#006970]/30">
                          {acc.badge}
                        </span>
                      </div>
                      <div>
                        <strong className="text-xl font-extrabold text-[#1A1626] block group-hover:text-[#006970] transition-colors">
                          {acc.name}
                        </strong>
                        <span className="text-xs font-semibold text-[#6E6A80] block mt-1">
                          {acc.school}
                        </span>
                      </div>
                      <p className="text-xs text-[#484554] leading-relaxed bg-white p-4 rounded-2xl border border-white shadow-inner">
                        {acc.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#E3E1E9] text-xs font-black text-[#006970] flex items-center justify-between group-hover:translate-x-1 transition-transform">
                      <span>⚡ 교사/마스터 보석 입장 &rarr;</span>
                      <CheckCircle2 className="w-5 h-5 text-[#006970] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* MANUAL AUTH CTA (Sign Up & Standard Login) */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 border-2 border-[#7B5CF0]/30 shadow-[0_20px_40px_rgba(123,92,240,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fadeIn">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black text-[#7B5CF0] bg-[#7B5CF0]/10 px-3 py-1 rounded-full uppercase border border-[#7B5CF0]/20 inline-block">
              🌟 정식 회원 가입 &amp; 일반 계정 로그인
            </span>
            <h3 className="text-2xl font-black text-[#1A1626]">
              나만의 진짜 계정으로 시작하시겠어요?
            </h3>
            <p className="text-xs md:text-sm text-[#5B556D] leading-relaxed">
              체험 아이디 외에도 <strong>직접 회원가입</strong>을 진행하시면, 초기 학교·학과 선택 온보딩과 RIASEC 검사, 포트폴리오 누적 기능을 정식 계정에서 완강하게 경험하실 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-shrink-0">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-black text-sm shadow-[0_10px_20px_rgba(123,92,240,0.3)] transition-all flex items-center justify-center gap-2">
                <span>📝 신규 회원가입 (온보딩)</span>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F4F2FA] hover:bg-[#E3E1E9] text-[#1A1626] font-bold text-sm border border-[#E3E1E9] transition-all flex items-center justify-center gap-2">
                <span>🔑 일반 계정 로그인 &rarr;</span>
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default StartScreen;
