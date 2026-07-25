import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Chip, MascotAri } from "../../components";
import { useAuth } from "../../context";
import { LogIn, Key, Mail, ShieldCheck, UserCheck, HelpCircle } from "lucide-react";
import type { UserRole } from "../../context";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    // Perform simulated login session division
    login(email, role);
    // If student -> go to Dashboard, if teacher -> go to Teacher Guide Pro
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/");
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === "student") {
      setEmail("student@readycareer.ai");
      setPassword("demo2026");
      setRole("student");
    } else {
      setEmail("teacher@seoul-high.edu");
      setPassword("teacher2026");
      setRole("teacher");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[88vh] px-4 py-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
        {/* Left Column: Mascot & Brand Welcome */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          <div className="inline-flex items-center gap-2 bg-secondary/15 px-4 py-1 rounded-full text-xs font-headline font-bold text-secondary-spot">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>2026 3D AI 진로 & 학생부 통합 무대</span>
          </div>

          <h1 className="text-display-lg md:text-display-lg font-black text-text-primary font-headline tracking-tight leading-none">
            ReadyCareer <br />
            <span className="text-transparent bg-clip-text gradient-hero-card">AI Studio</span>
          </h1>

          <p className="text-sm md:text-base text-text-muted font-body-md leading-relaxed">
            학생은 <strong>‘자기이해’</strong>와 별자리 로드맵을 통해 생기부를 다듬고,<br />
            학교 담당자(교사)는 고품격 AI 세특 초안을 1초 만에 최적화합니다.
          </p>

          <div className="w-full max-w-sm mt-2">
            <MascotAri
              pose="celebrate"
              size="md"
              bubbleTitle="로그인 세션 안내"
              bubbleMessage="학생 화면과 학교 담당자 화면은 독립적인 세션과 권한(RLS)으로 안전하게 분리되어 제공됩니다!"
            />
          </div>
        </div>

        {/* Right Column: Login Card with Student/Teacher Tabs */}
        <div className="lg:col-span-7 w-full">
          <Card variant="activity" padding="lg" className="w-full shadow-3d-ambient border-primary/25 relative overflow-hidden">
            <div className="flex flex-col gap-6">
              
              {/* Role Switch Tabs */}
              <div className="flex bg-surface-container p-1.5 rounded-[24px] border border-surface-variant/40">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-headline font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    role === "student"
                      ? "bg-primary text-on-primary shadow-md translate-y-0"
                      : "text-text-muted hover:text-text-primary hover:bg-white/50"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  🧑‍🎓 학생 로그인
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 py-3 px-4 rounded-[20px] font-headline font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    role === "teacher"
                      ? "bg-secondary text-white shadow-md translate-y-0"
                      : "text-text-muted hover:text-text-primary hover:bg-white/50"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  👨‍🏫 학교 담당자(교사)
                </button>
              </div>

              {/* Title descriptions */}
              <div className="text-center sm:text-left pt-2">
                <h2 className="text-headline-md font-headline font-extrabold text-text-primary">
                  {role === "student" ? "학생 포트폴리오 & 자기이해 접속" : "교사 전용 스마트 학생부 가이드 접속"}
                </h2>
                <span className="text-xs text-secondary-spot font-extrabold block mt-0.5">
                  {role === "student"
                    ? "● 전국 중고교 NEIS 표준 진로 검사 및 로드맵 연동"
                    : "● 교사용 고해상도 Pro (2560px 대응) 학급 데이터 관리 툴"}
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                <Input
                  label="이메일 또는 학생/교사 아이디"
                  placeholder={role === "student" ? "example@student.ai" : "teacher@school.edu"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  icon={<Mail className="w-5 h-5 text-primary" />}
                  required
                />

                <Input
                  type="password"
                  label="비밀번호"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  error={error}
                  icon={<Key className="w-5 h-5 text-secondary" />}
                  required
                />

                <div className="flex items-center justify-between text-xs font-headline pt-1 px-1">
                  <label className="flex items-center gap-2 text-text-muted cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0 w-4 h-4" />
                    <span>로그인 상태 유지 (자동 세션)</span>
                  </label>

                  <Link to="/forgot-password" className="text-primary font-bold hover:underline flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>아이디/비밀번호 초기화</span>
                  </Link>
                </div>

                <Button type="submit" variant={role === "student" ? "hero" : "teal"} size="lg" fullWidth icon={<LogIn className="w-5 h-5" />} className="mt-2 font-black">
                  {role === "student" ? "학생 세션 로그인 & 시작" : "학교 담당자 Pro 모드 접속"}
                </Button>
              </form>

              {/* Demo Fast Fill Helpers */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-variant/40 flex flex-col gap-2">
                <span className="text-xs font-bold text-text-primary flex items-center justify-between">
                  <span>💡 체험용 테스트 계정 1초 입력</span>
                  <span className="text-[11px] text-primary">즉시 시전!</span>
                </span>
                <div className="flex gap-2">
                  <Chip size="sm" onClick={() => handleQuickDemo("student")} variant="gradient" className="flex-1 text-center">
                    🧑‍🎓 학생 데모 채우기
                  </Chip>
                  <Chip size="sm" onClick={() => handleQuickDemo("teacher")} variant="teal" className="flex-1 text-center">
                    👨‍🏫 학교 담당자 데모
                  </Chip>
                </div>
              </div>

              {/* Sign up Link */}
              <div className="pt-4 border-t border-surface-variant/30 text-center">
                <p className="text-sm font-body-md text-text-muted">
                  아직 ReadyCareer AI 계정이 없으신가요?{" "}
                  <Link to="/signup" className="text-primary font-extrabold hover:underline ml-1">
                    신규 회원가입 30초 컷 &rarr;
                  </Link>
                </p>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
