import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "../../components";
import { useAuth } from "../../context";
import type { UserRole } from "../../context";
import { LogIn, ShieldCheck, UserCheck } from "lucide-react";

export const Login: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, startExpoDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email) {
      setErrorMsg("로그인 이메일을 입력해 주세요.");
      return;
    }
    await login(email, password, role);
    if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "super_admin") {
      navigate("/super-admin");
    } else {
      navigate("/");
    }
  };

  const fillDemo = (targetRole: UserRole) => {
    startExpoDemo(targetRole);
    if (targetRole === "teacher") {
      navigate("/teacher");
    } else if (targetRole === "super_admin") {
      navigate("/super-admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 bg-surface">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/start" className="text-xs font-bold text-text-muted hover:text-primary transition-colors block">
            &larr; 스타트(체험/실전) 선택 뷰로 돌아가기
          </Link>
          <h1 className="text-3xl font-headline font-black text-text-primary tracking-tight">
            Ready Career <span className="text-transparent bg-clip-text gradient-hero-card">AI</span>
          </h1>
          <p className="text-xs text-text-muted font-body-md">
            학교 승인 계정으로 로그인하여 나만의 커리어 자산을 조회하고 추출하세요.
          </p>
        </div>

        <Card variant="surface" padding="lg" className="border border-surface-variant/50 shadow-3d-base space-y-6">
          
          {/* 3-tier tabs */}
          <div className="flex bg-surface-container p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-xl text-xs font-headline font-extrabold transition-all ${
                role === "student" ? "bg-primary text-on-primary shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              🧑‍🎓 학생
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2 rounded-xl text-xs font-headline font-extrabold transition-all ${
                role === "teacher" ? "bg-secondary text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              👨‍🏫 학교관리자
            </button>
            <button
              type="button"
              onClick={() => setRole("super_admin")}
              className={`flex-1 py-2 rounded-xl text-xs font-headline font-extrabold transition-all ${
                role === "super_admin" ? "bg-surface-container-highest text-secondary-spot border border-secondary/40 shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              👑 슈퍼관리자
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-headline font-bold text-text-primary block mb-1">
                {role === "teacher" ? "학교 교직원 공식 이메일" : role === "super_admin" ? "최종마스터 인증 ID" : "학생 ID (이메일)"}
              </label>
              <input
                type="text"
                placeholder={role === "teacher" ? "teacher@seoul-high.edu" : role === "super_admin" ? "master@readycareer.ai" : "student@seoul-high.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary font-body-md"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-headline font-bold text-text-primary">비밀번호</label>
                <Link to="/forgot-password" className="text-[11px] font-extrabold text-secondary hover:underline">
                  비밀번호 초기화 &rarr;
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            {errorMsg && <p className="text-xs text-error font-bold text-center">{errorMsg}</p>}

            <Button variant="primary" size="lg" fullWidth type="submit" icon={<LogIn className="w-4 h-4" />} className="font-extrabold py-3.5 shadow-md">
              {role === "teacher" ? "학교관리자 3D 보드 접속" : role === "super_admin" ? "최종마스터 콘솔 접속" : "학생 커리어 홈 접속"}
            </Button>
          </form>

          {/* Instant Demo Fill Banner */}
          <div className="pt-3 border-t border-surface-variant/40 space-y-2">
            <span className="text-[11px] font-headline font-bold text-text-muted block text-center">
              💡 박람회 현장에서 빠르게 로그인 없이 확인하시겠습니까?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-headline font-black flex items-center justify-center gap-1.5 border border-primary/20 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>학생 체험 뷰 즉각 진입</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("teacher")}
                className="py-2.5 px-3 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary-spot text-xs font-headline font-black flex items-center justify-center gap-1.5 border border-secondary/30 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>교사·생기부 즉각 진입</span>
              </button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <span className="text-xs text-text-muted">아직 소속 학교 코드를 등록하지 않으셨나요? </span>
          <Link to="/signup" className="text-xs font-bold text-secondary underline ml-1">
            신규 회원가입 &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
