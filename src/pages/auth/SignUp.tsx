import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Chip, MascotAri } from "../../components";
import { useAuth } from "../../context";
import { User, Mail, Lock, School, KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import type { UserRole } from "../../context";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("서울창의고등학교");
  const [teacherCode, setTeacherCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("필수 입력 값을 모두 기입해주세요.");
      return;
    }

    if (role === "teacher" && !teacherCode) {
      setError("학교 담당자(교사) 가입은 학교로부터 받은 '담당자 인증코드' 입력이 필수입니다.");
      return;
    }

    setIsSubmitting(true);
    await signup({
      email,
      name,
      role,
      school,
      teacherCode: role === "teacher" ? teacherCode : undefined,
    });
    setIsSubmitting(false);

    // After signup, direct to onboarding for student, or teacher guide for teachers
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/onboarding-code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[88vh] px-4 py-10 max-w-2xl mx-auto">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-headline font-extrabold mb-2">
          <span>신규 계정 생성 및 세션 등록</span>
        </div>
        <h1 className="text-headline-lg md:text-display-lg font-extrabold text-text-primary font-headline">
          ReadyCareer <span className="text-transparent bg-clip-text gradient-hero-card">회원가입</span>
        </h1>
        <p className="text-sm text-text-muted mt-1">
          가입하신 계정의 역할(Role)에 따라 최적화된 개별 세션 뷰가 적용됩니다.
        </p>
      </div>

      <Card variant="activity" padding="lg" className="w-full shadow-3d-ambient border-primary/20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Role selector chips */}
          <div className="flex flex-col gap-2">
            <label className="font-headline font-bold text-label-lg text-text-primary px-1">
              가입 계정 유형 선택
            </label>
            <div className="flex gap-4">
              <Chip
                type="button"
                size="md"
                active={role === "student"}
                onClick={() => setRole("student")}
                className="flex-1 py-3 text-center justify-center"
              >
                🧑‍🎓 일반 학생 계정
              </Chip>
              <Chip
                type="button"
                size="md"
                active={role === "teacher"}
                variant={role === "teacher" ? "teal" : "default"}
                onClick={() => setRole("teacher")}
                className="flex-1 py-3 text-center justify-center"
              >
                👨‍🏫 학교 담당자(교사)
              </Chip>
            </div>
          </div>

          <Input
            label={role === "student" ? "이름 (학생 성명)" : "선생님 성명"}
            placeholder={role === "student" ? "예: 김수진" : "예: 박성열 (3학년 진로부)"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            icon={<User className="w-5 h-5 text-primary" />}
            required
          />

          <Input
            type="email"
            label="이메일 계정 (로그인 ID)"
            placeholder="example@school.ai"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            icon={<Mail className="w-5 h-5 text-secondary" />}
            required
          />

          <Input
            type="password"
            label="비밀번호"
            placeholder="8자 이상 영숫자 및 특수기호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            error={error}
            icon={<Lock className="w-5 h-5 text-primary" />}
            required
          />

          <Input
            label="소속 학교명"
            placeholder="예: 서울창의고등학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            icon={<School className="w-5 h-5 text-secondary-spot" />}
            required
          />

          {/* Teacher Code Condition */}
          {role === "teacher" && (
            <div className="bg-secondary/10 p-5 rounded-3xl border-2 border-secondary/30 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-headline font-black text-secondary-spot text-sm">
                <ShieldAlert className="w-5 h-5 text-secondary" />
                <span>학교 담당자 전용 보안 검증</span>
              </div>
              <Input
                label="담당자 인증코드 (School Teacher Key)"
                placeholder="예: EDU-PRO-2026-TEACHER"
                value={teacherCode}
                onChange={(e) => {
                  setTeacherCode(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                icon={<KeyRound className="w-5 h-5 text-secondary" />}
                hint="학교 또는 교육기관 관리처에서 부여받은 프로 고해상도 열쇠"
                required
              />
            </div>
          )}

          <div className="bg-surface-container p-4 rounded-2xl flex items-center gap-3 border border-surface-variant/30 text-xs text-text-muted">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            <span>
              가입 즉시 3D 한글 진로 포트폴리오 및 AI 세특 자동 문구 생성 권한이 부여되며, RLS 테이블 보안 정책이 준수됩니다.
            </span>
          </div>

          <Button
            type="submit"
            variant={role === "student" ? "primary" : "teal"}
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="font-extrabold"
          >
            {isSubmitting ? "계정 프로필 생성 중..." : `${role === "student" ? "학생 계정 가입" : "학교 담당자 계정 가입"} 완수`}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-variant/30 text-center">
          <p className="text-sm font-body-md text-text-muted">
            이미 ReadyCareer AI 계정을 보유하고 계신가요?{" "}
            <Link to="/login" className="text-primary font-extrabold hover:underline ml-1">
              로그인 창으로 이동 &rarr;
            </Link>
          </p>
        </div>
      </Card>

      <div className="mt-6 w-full">
        <MascotAri
          pose="avatar"
          size="sm"
          bubbleTitle="Ari의 가입 안내"
          bubbleMessage="학생 계정으로 가입하시면 신규 '자기이해' 탭을 통해 나만의 미래 융합 DNA를 발현할 수 있어요!"
        />
      </div>
    </div>
  );
};
