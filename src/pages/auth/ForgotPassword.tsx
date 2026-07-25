import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input, MascotAri } from "../../components";
import { useAuth } from "../../context";
import { Mail, ArrowLeft, Send, CheckCircle2, RefreshCw } from "lucide-react";

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("유효한 등록 이메일을 정확히 입력해주세요.");
      return;
    }
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-10 max-w-xl mx-auto">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="w-14 h-14 rounded-3xl bg-secondary/15 text-secondary flex items-center justify-center mb-3 shadow-sm">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h1 className="text-headline-lg font-extrabold text-text-primary font-headline">
          아이디 찾기 및 <span className="text-transparent bg-clip-text gradient-hero-card">비밀번호 초기화</span>
        </h1>
        <p className="text-sm text-text-muted mt-1 max-w-md">
          회원가입 시 등록하셨던 이메일을 입력하시면 <strong>비밀번호 재설정 및 초기화 승인 링크</strong>를 실시간으로 발송해 드립니다.
        </p>
      </div>

      <Card variant="activity" padding="lg" className="w-full shadow-3d-ambient border-primary/20">
        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="email"
              label="등록된 로그인 이메일"
              placeholder="example@student.ai"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              icon={<Mail className="w-5 h-5 text-primary" />}
              hint="이메일을 잊어버린 경우 담임 교사 혹은 시스템 담당자에게 문의 가능합니다."
              autoFocus
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} icon={<Send className="w-5 h-5" />} className="font-extrabold">
              {loading ? "초기화 이메일 발송 중..." : "비밀번호 초기화 링크 전송"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary-spot flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h3 className="font-headline font-extrabold text-title-md text-text-primary">
              초기화 이메일이 전송되었습니다!
            </h3>
            <p className="text-sm text-text-muted font-body-md leading-relaxed bg-surface-container p-4 rounded-2xl border border-surface-variant/40">
              <strong className="text-primary">{email}</strong> 메일함으로 발송된 링크를 통하여 새 비밀번호로 초기화하신 후, 다시 로그인해 주시기 바랍니다. (메일이 보이지 않는 경우 스팸 폴더도 확인해주세요.)
            </p>
            <Link to="/login" className="w-full mt-2">
              <Button variant="teal" size="md" fullWidth className="font-bold">
                로그인 화면으로 돌아가기 &rarr;
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-surface-variant/30 flex items-center justify-center">
          <Link to="/login" className="text-sm text-text-muted hover:text-primary flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>기억이 나셨나요? 로그인으로 귀환</span>
          </Link>
        </div>
      </Card>

      <div className="mt-6 w-full">
        <MascotAri
          pose="sticker"
          size="sm"
          bubbleTitle="비밀번호 복구 안심 보장"
          bubbleMessage="Supabase Auth 규준의 암호화 초기화 프로세스로 소중한 학생부 포트폴리오 데이터를 안전하게 지켜드립니다!"
        />
      </div>
    </div>
  );
};
