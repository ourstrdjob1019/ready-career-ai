import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, MascotAri, Chip } from "../../components";
import { useAuth } from "../../context";
import {
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  School,
  Award,
  BookOpen,
} from "lucide-react";

export const StartScreen: React.FC = () => {
  const { startExpoDemo } = useAuth();
  const navigate = useNavigate();

  // 'initial' = 처음 2개 선택 (체험 vs 실제)
  // 'expo' = 체험 모드 (학생/교사 역할 및 아이디 선택)
  // 'real' = 실제 모드 (정식 로그인/회원가입)
  const [viewMode, setViewMode] = useState<"initial" | "expo" | "real">("initial");
  const [expoRole, setExpoRole] = useState<"student" | "teacher" | "super_admin">("student");

  // 학생용 체험 계정 리스트 (미리 세팅된 풍부한 데이터 vs 새 체험)
  const studentDemoAccounts = [
    {
      id: "std-1",
      name: "김수진",
      school: "서울창의고등학교",
      grade: 2,
      classNo: 4,
      targetJob: "스마트 AI 에듀테크 진로 멘토",
      riasecCode: "SI",
      desc: "Lv.05 (만렙 임박) · 별자리 퀘스트 14건 & 50일 습관 14일차 세팅 완료!",
      tag: "⭐ 대표 시연 계정",
      badgeColor: "teal" as const,
      route: "/", // 바로 메인 대시보드로 이동
    },
    {
      id: "std-2",
      name: "이재현",
      school: "서울창의고등학교",
      grade: 2,
      classNo: 4,
      targetJob: "AI 로봇 융합 연구원",
      riasecCode: "RC",
      desc: "Lv.04 · 아두이노 자율주행 모봇 실습 포트폴리오 세트 장착 완료",
      tag: "🤖 로보틱스 지망",
      badgeColor: "default" as const,
      route: "/",
    },
    {
      id: "std-new",
      name: "신규 방문 학생",
      school: "서울창의고등학교",
      grade: 1,
      classNo: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "I",
      desc: "온보딩 정보 입력부터 흥미검사(RIASEC)를 직접 처음부터 진행하는 흐름",
      tag: " 🌱 새로 직접 입력",
      badgeColor: "default" as const,
      route: "/onboarding-info", // 온보딩부터 시작
    },
  ];

  // 교사 및 관리자 체험 계정 리스트
  const teacherDemoAccounts = [
    {
      id: "tch-1",
      name: "박성열 선생님",
      role: "teacher" as const,
      school: "서울창의고등학교",
      title: "진로 상담 담임 & 학교관리자",
      desc: "담당 학급 명부 열람, 학생 누적 데이터 확인 및 AI 생기부 1초 합성에 즉시 최적화된 계정",
      tag: "👨‍🏫 교사용 대표 뷰",
      route: "/teacher",
    },
    {
      id: "sup-1",
      name: "최종마스터 통제관",
      role: "super_admin" as const,
      school: "ReadyCareer AI 통합센터",
      title: "B2B 라이센스 및 AI 관제",
      desc: "학교별 신규 가입 마감/개방 토글 제어, 표준 초대코드 발급 및 서버리스 통계 조회",
      tag: "👑 슈퍼관리자 콘솔",
      route: "/super-admin",
    },
  ];

  // 즉시 1초 자동 로그인 실행 및 세팅 적용
  const handleAutoLogin = (role: "student" | "teacher" | "super_admin", account: any) => {
    startExpoDemo(role, {
      name: account.name,
      school: account.school,
      grade: account.grade,
      classNo: account.classNo,
      targetJob: account.targetJob,
      riasecCode: account.riasecCode,
    });
    navigate(account.route || "/");
  };

  return (
    <div className="min-h-[90vh] bg-surface flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-fixed/20 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-4xl w-full relative z-10 space-y-10">
        
        {/* Header & Brand Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-highest border border-surface-variant/60 text-secondary font-headline text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-secondary-spot animate-pulse" />
            <span>ReadyCareer AI · Stitch 디자인 DNA 기반 주도적 진로 여정</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
            어떤 모드로 <span className="text-primary underline decoration-secondary decoration-4 underline-offset-8">시작하시겠습니까?</span>
          </h1>
          <p className="text-sm text-text-muted font-body-md max-w-lg mx-auto pt-2">
            원하는 접속 방식을 선택하세요. 박람회 시연을 위한 즉각 체험 혹은 학교 승인코드 기반 실무 모드로 진입합니다.
          </p>
        </div>

        {/* =========================================================================
            1. INITIAL SELECTION: 체험 모드 vs 실제 모드 (깔끔한 2개 카드)
           ========================================================================= */}
        {viewMode === "initial" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* CARD A: 체험 모드 */}
            <div
              onClick={() => setViewMode("expo")}
              className="p-8 rounded-3xl bg-gradient-to-br from-point via-white to-white border-2 border-secondary/40 hover:border-secondary shadow-3d-base hover:shadow-3d-ambient cursor-pointer transition-all duration-300 flex flex-col justify-between group active:scale-[0.98] min-h-[340px]"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                  🎪
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-headline font-black text-secondary uppercase tracking-wider block">
                    1초 즉각 체험 · Pilot Mode
                  </span>
                  <h3 className="text-2xl font-headline font-black text-text-primary group-hover:text-secondary transition-colors">
                    박람회 체험 모드
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-text-muted font-body-md leading-relaxed">
                  복잡한 인증이나 회원가입 절차 없이, <strong>학생 및 교사용 미리 세팅된 테스트 계정</strong>을 클릭 한 번으로 자동 로그인하여 모든 핵심 기능을 바로 확인합니다.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-variant/40 flex items-center justify-between text-xs font-headline font-black text-secondary">
                <span>⚡ 계정 선택하고 1초 입장하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* CARD B: 실제 실무 모드 */}
            <div
              onClick={() => setViewMode("real")}
              className="p-8 rounded-3xl bg-surface-container-lowest hover:bg-surface-container-low border border-surface-variant/60 hover:border-primary/50 shadow-3d-base hover:shadow-3d-ambient cursor-pointer transition-all duration-300 flex flex-col justify-between group active:scale-[0.98] min-h-[340px]"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                  🔐
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-headline font-black text-primary uppercase tracking-wider block">
                    학교 승인코드 실사용 · Live Real
                  </span>
                  <h3 className="text-2xl font-headline font-black text-text-primary group-hover:text-primary transition-colors">
                    실제 실무 모드
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-text-muted font-body-md leading-relaxed">
                  교육청 NEIS 학교 마스터코드 조회 및 발급받은 B2B 초대코드를 바탕으로 <strong>정식 신규 회원가입 및 실무 교직원/학생 로그인</strong>을 진행합니다.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-surface-variant/40 flex items-center justify-between text-xs font-headline font-bold text-primary">
                <span>정식 가입 및 로그인으로 진입</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            2. EXPO MODE: 학생용 vs 교사용 역할 탭 & 하단 체험 아이디 1초 자동 로그인
           ========================================================================= */}
        {viewMode === "expo" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
              <button
                onClick={() => setViewMode("initial")}
                className="inline-flex items-center gap-1.5 text-xs font-headline font-black text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>처음 선택으로 돌아가기</span>
              </button>
              <Chip size="sm" variant="teal" className="font-extrabold">🎪 체험 모드 계정 선택</Chip>
            </div>

            {/* 역할 선택 탭 (학생용 vs 교사/관리자용) */}
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-headline font-black text-text-primary">
                어떤 역할을 체험하고 싶으신가요?
              </h2>
              <div className="flex max-w-md mx-auto bg-surface-container p-1.5 rounded-3xl border border-surface-variant/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => setExpoRole("student")}
                  className={`flex-1 py-3 px-4 rounded-2xl font-headline font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    expoRole === "student"
                      ? "bg-primary text-on-primary shadow-3d-base scale-[1.02]"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>🧑‍🎓 학생용 체험</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExpoRole("teacher")}
                  className={`flex-1 py-3 px-4 rounded-2xl font-headline font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    expoRole === "teacher" || expoRole === "super_admin"
                      ? "bg-secondary text-white shadow-3d-base scale-[1.02]"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>👨‍🏫 교사·학교관리자용</span>
                </button>
              </div>
            </div>

            {/* 하단 자동로그인 계정 카드 리스트 */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-headline font-black text-text-muted block text-center">
                👇 아래 체험용 아이디를 클릭(선택)하면 해당 데이터로 즉시 1초 자동 로그인이 진행됩니다!
              </span>

              {expoRole === "student" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentDemoAccounts.map((acc) => (
                    <Card
                      key={acc.id}
                      variant="surface"
                      padding="md"
                      className="border-2 border-surface-variant/60 hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-95"
                      onClick={() => handleAutoLogin("student", acc)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-headline font-black px-2.5 py-0.5 rounded-full ${
                            acc.id === "std-1" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"
                          }`}>
                            {acc.tag}
                          </span>
                          <span className="text-xs font-black text-text-muted">{acc.grade}학년 {acc.classNo}반</span>
                        </div>
                        <div>
                          <strong className="text-lg font-headline font-black text-text-primary group-hover:text-primary transition-colors block">
                            {acc.name}
                          </strong>
                          <span className="text-xs font-bold text-text-muted flex items-center gap-1 mt-0.5">
                            <School className="w-3.5 h-3.5 text-primary" /> {acc.school} · [{acc.riasecCode}]
                          </span>
                        </div>
                        <p className="text-xs text-text-muted font-body-md bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/30 leading-snug">
                          {acc.desc}
                        </p>
                      </div>

                      <Button variant="teal" size="sm" fullWidth className="mt-5 font-headline font-extrabold shadow-sm group-hover:bg-primary">
                        ⚡ 이 아이디로 1초 자동 로그인 &rarr;
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {teacherDemoAccounts.map((tAcc) => (
                    <Card
                      key={tAcc.id}
                      variant="surface"
                      padding="lg"
                      className="border-2 border-surface-variant/60 hover:border-secondary shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-95"
                      onClick={() => handleAutoLogin(tAcc.role, tAcc)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-headline font-black px-3 py-1 rounded-full bg-secondary/15 text-secondary">
                            {tAcc.tag}
                          </span>
                          <ShieldCheck className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <strong className="text-xl font-headline font-black text-text-primary group-hover:text-secondary transition-colors block">
                            {tAcc.name}
                          </strong>
                          <span className="text-xs font-bold text-text-muted block mt-0.5">
                            {tAcc.title} · {tAcc.school}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted font-body-md bg-surface-container-low p-3 rounded-2xl border border-surface-variant/30 leading-relaxed">
                          {tAcc.desc}
                        </p>
                      </div>

                      <Button variant="teal" size="md" fullWidth className="mt-6 font-headline font-extrabold shadow-md group-hover:bg-secondary">
                        ⚡ 이 교사·관리자로 자동 로그인 &rarr;
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 마스코트 코칭 */}
            <div className="max-w-lg mx-auto pt-4 flex items-center justify-center gap-3 bg-surface-container-low py-3 px-5 rounded-full border border-surface-variant/40 shadow-inner">
              <div className="w-8 h-8 flex-shrink-0">
                <MascotAri pose="avatar" size="sm" rotate={false} className="-my-1" />
              </div>
              <span className="text-xs font-headline font-bold text-text-primary">
                💡 로그인 후 언제든 새로운 관심직업이나 비전을 직접 수정하고 추가해보세요!
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. REAL MODE: 정식 회원가입 및 학교 승인 로그인 (깔끔하고 명확한 UX)
           ========================================================================= */}
        {viewMode === "real" && (
          <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
              <button
                onClick={() => setViewMode("initial")}
                className="inline-flex items-center gap-1.5 text-xs font-headline font-black text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>모드 선택으로 돌아가기</span>
              </button>
              <Chip size="sm" variant="default" className="font-extrabold">🔐 정식 계정 실무 모드</Chip>
            </div>

            <Card variant="surface" padding="lg" className="border border-surface-variant/60 shadow-3d-base space-y-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 text-primary mx-auto rounded-2xl flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-headline font-black text-text-primary">
                  학교 승인 계정 접속
                </h2>
                <p className="text-xs text-text-muted font-body-md leading-relaxed">
                  NEIS 학교 코드 및 발급받은 <strong>초대코드</strong> 검증을 통해 신규 계정을 생성하거나 실사용 계정으로 진입합니다.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link to="/login" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    icon={<LogIn className="w-5 h-5 text-primary" />}
                    className="font-headline font-extrabold justify-between py-4 shadow-sm"
                  >
                    <span>기존 정식 계정으로 로그인</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </Button>
                </Link>

                <Link to="/signup" className="block">
                  <Button
                    variant="teal"
                    size="lg"
                    fullWidth
                    icon={<UserPlus className="w-5 h-5" />}
                    className="font-headline font-extrabold justify-between py-4 shadow-md"
                  >
                    <span>학교 마스터 승인 신규 회원가입</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Button>
                </Link>
              </div>

              <div className="p-3 bg-surface-container rounded-2xl border border-surface-variant/40 flex items-center gap-2 text-[11px] text-text-muted text-left">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>자유 입력 방지 규정에 따라 승인된 전국 고등학교 표준 목록에서 소속을 고르고 가입할 수 있습니다.</span>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default StartScreen;
