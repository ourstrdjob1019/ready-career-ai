import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, MascotAri } from "../components";
import { KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

export const OnboardingCode: React.FC = () => {
  const [code, setCode] = useState("READY-2026-AI");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("학교 또는 학급 초대코드를 입력해주세요.");
      return;
    }
    navigate("/onboarding-info");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-10 max-w-2xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="relative mb-4 animate-bounce duration-1000">
          <MascotAri pose="celebrate" size="lg" rotate={false} />
          <span className="absolute -top-2 -right-4 bg-secondary text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-sm animate-pulse">
            환영해, 미래의 주인공!
          </span>
        </div>
        
        <h1 className="text-headline-lg md:text-display-lg font-extrabold text-text-primary tracking-tight mb-3 font-headline">
          꿈을 향한 첫 단추
          <span className="block text-transparent bg-clip-text gradient-hero-card">
            ReadyCareer AI
          </span>
        </h1>
        <p className="text-body-lg text-text-muted max-w-md mx-auto leading-relaxed">
          중·고등학생을 위한 AI 커리어 & 학생부 파트너!<br />
          학교 또는 선생님께서 받으신 <strong className="text-primary">초대코드</strong>를 입력해 주세요.
        </p>
      </div>

      {/* Code Input Form Card */}
      <Card variant="activity" padding="lg" className="w-full max-w-md shadow-3d-ambient border-primary/20">
        <form onSubmit={handleNext} className="flex flex-col gap-6">
          <Input
            label="초대코드 (Invite Code)"
            placeholder="예: READY-2026-AI"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            error={error}
            icon={<KeyRound className="w-5 h-5 text-primary" />}
            hint="선생님께서 공유해주신 하이픈(-) 포함 영숫자 11자리"
            autoFocus
          />

          <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 border border-surface-variant/30">
            <ShieldCheck className="w-6 h-6 text-secondary flex-shrink-0" />
            <div className="text-xs font-body-md text-text-muted">
              <span className="font-semibold text-text-primary block mb-0.5">교육청 및 학교 인증 안내</span>
              초대코드를 입력하면 소속 학급 및 담임 교사 가이드와 안전하게 실시간 연결됩니다.
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" fullWidth icon={<ArrowRight className="w-6 h-6" />}>
            시작하기 & 정보 확인
          </Button>
        </form>
      </Card>

      {/* Bottom Hint */}
      <div className="mt-8 w-full max-w-md">
        <MascotAri
          pose="sticker"
          size="sm"
          bubbleTitle="Ari's Tip"
          bubbleMessage="초대코드가 없다면 '홈 대시보드' 메뉴에서 우선 체험해보거나 선생님께 바로 문의해 보세요!"
        />
      </div>
    </div>
  );
};
