import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import type { UserRole } from "../../context";
import {
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
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

  const [selectedMode, setSelectedMode] = useState<"expo" | "real" | null>(null);
  const [expoTab, setExpoTab] = useState<"student" | "teacher">("student");

  const handleSelectExpoAccount = (account: ExpoAccountItem) => {
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
    } else if (account.name === "신규 방문 학생") {
      navigate("/onboarding-info");
    } else {
      navigate("/");
    }
  };

  const handleRealLogin = () => {
    navigate("/login");
  };

  const handleRealSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FBF8FF] text-[#1A1626] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* Container with Stitch Modern Corporate + Soft Minimalism Spacing */}
      <div className="max-w-5xl w-full mx-auto space-y-12">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#EFEDF5] text-[#484554] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#7B5CF0]" />
            <span>ReadyCareer AI · 2026 교육부 기재요령 최적화 에디션</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1626]">
            어떤 모드로 <span className="text-[#7B5CF0]">시작하시겠습니까?</span>
          </h1>
          <p className="text-sm md:text-base text-[#6E6A80] max-w-xl mx-auto pt-1 font-normal leading-relaxed">
            원하는 접속 방식을 선택해 주세요. 박람회 시연을 위한 즉각 체험 모드 또는 학교 마스터코드 기반의 실무 운영 모드로 진입합니다.
          </p>
        </div>

        {/* STEP 1: INITIAL TWO-CARD CHOICE (Stitch "Card-on-Canvas" DNA) */}
        {!selectedMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
            
            {/* OPTION A: EXPO PILOT MODE CARD */}
            <div
              onClick={() => setSelectedMode("expo")}
              className="bg-[#FFFFFF] rounded-[32px] p-8 md:p-10 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] hover:shadow-[0_30px_50px_rgba(123,92,240,0.15)] hover:border-[#7B5CF0]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group h-[380px]"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#7B5CF0]/10 flex items-center justify-center border border-[#7B5CF0]/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl">🎪</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1DAAB4] tracking-widest uppercase block mb-1">
                    1초 즉각 체험 · PILOT MODE
                  </span>
                  <h2 className="text-2xl font-bold text-[#1A1626] group-hover:text-[#7B5CF0] transition-colors">
                    박람회 체험 모드
                  </h2>
                </div>
                <p className="text-sm text-[#6E6A80] leading-relaxed font-normal">
                  복잡한 인증이나 정식 가입 절차 없이, 학생 및 교사회원 사전 세팅 계정을 클릭 한 번으로 자동 로그인하여 모든 핵심 기능을 바로 시연해 보세요.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E3E1E9] flex items-center justify-between text-sm font-semibold text-[#7B5CF0] group-hover:translate-x-1 transition-transform">
                <span>계정 선택하고 1초 입장하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* OPTION B: REAL LIVE MODE CARD */}
            <div
              onClick={() => setSelectedMode("real")}
              className="bg-[#FFFFFF] rounded-[32px] p-8 md:p-10 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] hover:shadow-[0_30px_50px_rgba(123,92,240,0.15)] hover:border-[#7B5CF0]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group h-[380px]"
            >
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#EFEDF5] flex items-center justify-center border border-[#E3E1E9] group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-[#7B5CF0]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#7B5CF0] tracking-widest uppercase block mb-1">
                    학교 승인코드 실무 · LIVE REAL
                  </span>
                  <h2 className="text-2xl font-bold text-[#1A1626] group-hover:text-[#7B5CF0] transition-colors">
                    실제 실무 모드
                  </h2>
                </div>
                <p className="text-sm text-[#6E6A80] leading-relaxed font-normal">
                  교육청 NEIS 학교 마스터코드 조회 및 발급받은 B2B 초대코드를 바탕으로 정식 신규 회원가입 및 실무 교직원/학생 로그인을 진행합니다.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E3E1E9] flex items-center justify-between text-sm font-semibold text-[#1A1626] group-hover:text-[#7B5CF0] group-hover:translate-x-1 transition-all">
                <span>정식 가입 및 로그인으로 진입</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        ) : selectedMode === "expo" ? (
          /* STEP 2A: EXPO ACCOUNT SELECTOR */
          <div className="bg-[#FFFFFF] rounded-[32px] p-8 md:p-12 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] space-y-8 animate-fadeIn max-w-4xl mx-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E1E9] pb-6">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMode(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6A80] hover:text-[#7B5CF0] transition-colors mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>이전 모드 선택으로 돌아가기</span>
                </button>
                <h2 className="text-2xl font-bold text-[#1A1626] flex items-center gap-2">
                  <span>🎪 1초 체험용 아이디 선택</span>
                </h2>
                <p className="text-sm text-[#6E6A80]">
                  아래 카드 중 원하는 시연 대상을 선택하면 비밀번호 없이 즉시 맞춤형 데이터로 세팅되어 입장합니다.
                </p>
              </div>

              {/* Tabs: Student vs Teacher */}
              <div className="inline-flex p-1 rounded-full bg-[#EFEDF5] border border-[#E3E1E9]">
                <button
                  onClick={() => setExpoTab("student")}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-150 ${
                    expoTab === "student"
                      ? "bg-[#7B5CF0] text-white shadow-sm scale-105"
                      : "text-[#6E6A80] hover:text-[#1A1626]"
                  }`}
                >
                  🧑‍🎓 학생용 (3종)
                </button>
                <button
                  onClick={() => setExpoTab("teacher")}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-150 ${
                    expoTab === "teacher"
                      ? "bg-[#7B5CF0] text-white shadow-sm scale-105"
                      : "text-[#6E6A80] hover:text-[#1A1626]"
                  }`}
                >
                  👨‍🏫 교사용/마스터 (2종)
                </button>
              </div>
            </div>

            {/* Account List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {expoTab === "student"
                ? STUDENT_ACCOUNTS.map((acc, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectExpoAccount(acc)}
                      className="p-6 rounded-2xl bg-[#F4F2FA] hover:bg-white border border-[#E3E1E9] hover:border-[#7B5CF0] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{index === 0 ? "⭐" : index === 1 ? "🤖" : "🌱"}</span>
                          <span className="text-[10px] font-bold bg-[#7B5CF0]/15 text-[#7B5CF0] px-2.5 py-0.5 rounded-full">
                            {acc.badge}
                          </span>
                        </div>
                        <div>
                          <strong className="text-lg font-bold text-[#1A1626] block group-hover:text-[#7B5CF0] transition-colors">
                            {acc.name}
                          </strong>
                          <span className="text-xs text-[#6E6A80] block mt-0.5 font-normal">
                            {acc.school} {acc.grade ? `(${acc.grade}학년)` : ""}
                          </span>
                        </div>
                        <p className="text-xs text-[#484554] leading-relaxed bg-white/60 p-3 rounded-xl border border-[#E3E1E9]/60">
                          {acc.desc}
                        </p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-[#E3E1E9] text-xs font-bold text-[#7B5CF0] flex items-center justify-between">
                        <span>⚡ 이 계정으로 시작 &rarr;</span>
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                : TEACHER_ACCOUNTS.map((acc, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectExpoAccount(acc)}
                      className="p-6 rounded-2xl bg-[#F4F2FA] hover:bg-white border border-[#E3E1E9] hover:border-[#1DAAB4] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md group md:col-span-1"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{index === 0 ? "👨‍🏫" : "👑"}</span>
                          <span className="text-[10px] font-bold bg-[#1DAAB4]/15 text-[#1DAAB4] px-2.5 py-0.5 rounded-full">
                            {acc.badge}
                          </span>
                        </div>
                        <div>
                          <strong className="text-lg font-bold text-[#1A1626] block group-hover:text-[#1DAAB4] transition-colors">
                            {acc.name}
                          </strong>
                          <span className="text-xs text-[#6E6A80] block mt-0.5 font-normal">
                            {acc.school}
                          </span>
                        </div>
                        <p className="text-xs text-[#484554] leading-relaxed bg-white/60 p-3 rounded-xl border border-[#E3E1E9]/60">
                          {acc.desc}
                        </p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-[#E3E1E9] text-xs font-bold text-[#1DAAB4] flex items-center justify-between">
                        <span>⚡ 관리자 세션 입장 &rarr;</span>
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#1DAAB4]" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        ) : (
          /* STEP 2B: REAL LIVE MODE ACTIONS */
          <div className="bg-[#FFFFFF] rounded-[32px] p-8 md:p-12 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] space-y-8 max-w-2xl mx-auto animate-fadeIn text-center">
            
            <div className="flex justify-start">
              <button
                onClick={() => setSelectedMode(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6A80] hover:text-[#7B5CF0] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전 모드 선택으로 돌아가기</span>
              </button>
            </div>

            <div className="space-y-2">
              <ShieldCheck className="w-12 h-12 text-[#7B5CF0] mx-auto" />
              <h2 className="text-2xl font-bold text-[#1A1626]">
                학교 승인코드 실무 모드
              </h2>
              <p className="text-sm text-[#6E6A80] leading-relaxed">
                교육청 NEIS 인가 고등학교의 교직원 발급 B2B 마스터코드가 있어야 신규 회원가입 및 실무 이용이 가능합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleRealLogin}
                className="p-5 rounded-2xl bg-[#F4F2FA] hover:bg-[#7B5CF0] text-[#1A1626] hover:text-white border border-[#E3E1E9] font-bold text-base transition-all duration-200 flex flex-col items-center justify-center gap-2 group shadow-sm"
              >
                <LogIn className="w-6 h-6 text-[#7B5CF0] group-hover:text-white transition-colors" />
                <span>기존 정식 계정 로그인</span>
                <span className="text-xs text-[#6E6A80] group-hover:text-white/80 font-normal">
                  교사 및 등록 학생
                </span>
              </button>

              <button
                onClick={handleRealSignUp}
                className="p-5 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-bold text-base transition-all duration-200 flex flex-col items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <UserPlus className="w-6 h-6 text-white" />
                <span>승인코드 신규 회원가입</span>
                <span className="text-xs text-white/80 font-normal">
                  마스터 학교 승인 검증
                </span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default StartScreen;
