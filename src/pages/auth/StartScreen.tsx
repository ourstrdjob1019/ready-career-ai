import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, MascotAri } from "../../components";
import { useAuth } from "../../context";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  LogIn,
  UserPlus,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const StartScreen: React.FC = () => {
  const { startExpoDemo, isAuthenticated, session } = useAuth();
  const navigate = useNavigate();

  const handleExpoSelect = (role: "student" | "teacher" | "super_admin") => {
    startExpoDemo(role);
    if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "super_admin") {
      navigate("/super-admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-40 w-[800px] h-[400px] bg-primary-fixed/25 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Main Content Hub */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10 flex flex-col gap-12">
        
        {/* Top Header Label */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest border border-surface-variant/50 text-secondary font-headline text-xs md:text-sm font-extrabold shadow-inner">
            <Sparkles className="w-4 h-4 text-secondary-spot animate-pulse" />
            <span>2026 교육박람회 1초 풀패키지 시연 모드 탑재 · Antigravity IDE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-text-primary tracking-tight leading-tight">
            Ready Career <span className="text-transparent bg-clip-text gradient-hero-card">AI</span>
          </h1>
          <p className="text-sm md:text-lg text-text-muted font-body-md max-w-2xl mx-auto leading-relaxed">
            학생이 <strong>진로활동을 누적 관리하며 미래를 수놓는</strong> 게임화 3D 한글 플랫폼.<br />
            흥미 검사를 넘어 AI 별자리 로드맵과 교사용 생기부 가이드안까지 즉시 시연해 보세요!
          </p>
        </div>

        {/* Mascot Greeting */}
        <div className="flex justify-center -my-2">
          <MascotAri
            pose="celebrate"
            size="lg"
            rotate={true}
            bubbleTitle="✨ 2026 교육박람회 방문을 환영해요!"
            bubbleMessage="하단에서 [1초 체험용]을 고르시면 복잡한 회원가입 없이 세팅된 완벽한 데모 화면을 즉각 만나보실 수 있습니다!"
          />
        </div>

        {/* TWO-TRACK ACTION SELECTION (EXPO DEMO vs LIVE PRODUCTION) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Track 1: Expo Demo Mode (Left / Prominent) */}
          <Card
            variant="hero"
            padding="lg"
            className="lg:col-span-7 bg-gradient-to-br from-point/60 via-white to-white border-2 border-secondary/40 shadow-3d-ambient flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-white text-xs font-headline font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>🎪 박람회 1초 즉각 체험 (Expo Pilot)</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-headline font-black text-text-primary">
                복잡한 DB 설정 없는 100% 데모 시연
              </h2>
              <p className="text-xs md:text-sm text-text-muted font-body-md leading-relaxed">
                만렙에 가까운 퀘스트 진도율, 완료된 RIASEC 흥미검사와 3종 AI 진단 리포트, 교사회관 생기부 추출 예시가 <strong>모두 풀로 차있는 환경</strong>입니다. 원하시는 역할을 터치해 즉시 뛰어드세요!
              </p>

              {/* 3-Tier Expo Role Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleExpoSelect("student")}
                  className="p-4 rounded-3xl bg-primary text-on-primary font-headline font-extrabold flex flex-col items-center justify-center gap-2 shadow-3d-base hover:scale-[1.02] active:scale-95 transition-all group bezel-effect"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                    🧑‍🎓
                  </div>
                  <span className="text-sm">학생 체험 뷰</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                    만렙 퀘스트 DB
                  </span>
                </button>

                <button
                  onClick={() => handleExpoSelect("teacher")}
                  className="p-4 rounded-3xl bg-secondary text-white font-headline font-extrabold flex flex-col items-center justify-center gap-2 shadow-3d-base hover:scale-[1.02] active:scale-95 transition-all group bezel-effect"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                    👨‍🏫
                  </div>
                  <span className="text-sm">학교관리자 뷰</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                    생기부 가이드안
                  </span>
                </button>

                <button
                  onClick={() => handleExpoSelect("super_admin")}
                  className="p-4 rounded-3xl bg-surface-container-high hover:bg-surface-container-highest text-text-primary border border-surface-variant/60 font-headline font-extrabold flex flex-col items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-spot flex items-center justify-center text-xl font-black">
                    👑
                  </div>
                  <span className="text-sm">최종마스터 뷰</span>
                  <span className="text-[10px] bg-secondary/20 text-secondary-spot px-2 py-0.5 rounded-full font-black">
                    초대코드·가입통제
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-variant/30 flex items-center justify-between text-xs font-bold text-text-muted">
              <span>💡 교육박람회 시연이 종료되면 손쉽게 스위칭되거나 해제될 수 있습니다.</span>
              <span className="text-secondary font-black">START &gt;&gt; 클릭하여 즉시 진입</span>
            </div>
          </Card>

          {/* Track 2: Real Live Production Mode (Right / Gatekeeper) */}
          <Card
            variant="surface"
            padding="lg"
            className="lg:col-span-5 bg-surface-container-low border border-surface-variant/60 shadow-3d-base flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-headline font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>🔐 정식 실전 프로덕션 (Live Real)</span>
              </div>
              <h2 className="text-xl md:text-2xl font-headline font-black text-text-primary">
                학교 승인코드 기반 실무 로그인
              </h2>
              <p className="text-xs text-text-muted font-body-md leading-relaxed">
                정식 도입된 학교의 <strong>표준학교코드 선택 및 마스터 초대코드 승인</strong>을 통해 가입을 진행하거나, Supabase/Vercel 프록시 API를 사용하는 실제 DB 사용자 로그인입니다.
              </p>

              <div className="space-y-3 pt-3">
                <Link to="/login" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    icon={<LogIn className="w-5 h-5 text-primary" />}
                    className="font-headline font-extrabold justify-between py-4 shadow-sm"
                  >
                    <span>정식 계정으로 로그인</span>
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
                    <span>학교 승인코드 신규 회원가입</span>
                    <ArrowRight className="w-4 h-4 text-white/80" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-3 bg-surface-container rounded-2xl border border-surface-variant/40 flex items-center gap-3 text-xs text-text-muted">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>B2B 토너먼트 규정에 따라 최종마스터에 의해 가입 기간 개방 여부가 실시간 제어됩니다.</span>
            </div>
          </Card>
        </div>

        {/* Bottom Navigation quick links if already authenticated */}
        {isAuthenticated && (
          <div className="p-4 bg-surface-container-low rounded-3xl border border-surface-variant/40 flex items-center justify-between shadow-sm">
            <span className="text-sm font-headline font-black text-text-primary flex items-center gap-2">
              <span>🎉 현재 <strong>{session?.name} ({session?.role})</strong>님으로 세션이 체결되어 있습니다.</span>
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(session?.role === "teacher" ? "/teacher" : session?.role === "super_admin" ? "/super-admin" : "/")}
              className="font-extrabold"
            >
              내 메인보드로 바로 가기 &rarr;
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default StartScreen;
