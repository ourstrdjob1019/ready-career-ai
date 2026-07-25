import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "../../components";
import { useAuth } from "../../context";
import type { UserRole } from "../../context";
import { UserPlus, School, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import configData from "../../data/assessment_config.json";

export const SignUp: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedSchoolCode, setSelectedSchoolCode] = useState("SEOUL-701");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register, signupOpen } = useAuth();
  const navigate = useNavigate();

  const schoolList = configData.school_master_data || [];
  const activeSchool = schoolList.find((s) => s.code === selectedSchoolCode) || schoolList[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !name) {
      setErrorMsg("이메일과 실명을 정확하게 입력해 주세요.");
      return;
    }

    if (!inviteCode.trim()) {
      setErrorMsg("슈퍼관리자 또는 담임 선생님으로부터 받은 B2B 초대코드를 입력해야 합니다.");
      return;
    }

    const res = await register(name, email, role, activeSchool?.name || "서울창의고등학교", selectedSchoolCode, inviteCode);
    if (res.success) {
      setSuccessMsg("🎉 학교 마스터코드 승인 및 회원가입이 100% 성공했습니다!");
      setTimeout(() => {
        navigate(role === "teacher" ? "/teacher" : "/");
      }, 1000);
    } else {
      setErrorMsg(res.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-surface">
      <div className="max-w-md w-full space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/start" className="text-xs font-bold text-text-muted hover:text-primary transition-colors block">
            &larr; 스타트(체험) 화면으로 돌아가기
          </Link>
          <h1 className="text-3xl font-headline font-black text-text-primary tracking-tight">
            학교 승인코드 신규가입
          </h1>
          <p className="text-xs text-text-muted font-body-md">
            표준학교코드 마스터 목록에서 학교를 선택하고 발급된 <strong>초대코드</strong>를 입력해 가입하세요. (자유입력 방지)
          </p>
        </div>

        {!signupOpen ? (
          <Card variant="hero" padding="md" className="bg-error-container/20 border border-error/40 text-center py-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-error mx-auto animate-bounce" />
            <h3 className="font-headline font-black text-lg text-text-primary">현재 회원가입 기간이 마감되었습니다</h3>
            <p className="text-xs text-text-muted">
              AI 서버리스 API 사용량 통제 정책(B2B)에 따라 현재 <strong>슈퍼관리자</strong>가 정식 가입 기간을 마감했습니다.<br />
              박람회 방문객이시라면 [스타트 체험 화면]에서 1초 체험 버튼을 클릭해 주세요!
            </p>
            <Link to="/start">
              <Button variant="primary" size="md" fullWidth>
                🎪 박람회 1초 체험 화면으로 즉시 이동
              </Button>
            </Link>
          </Card>
        ) : (
          <Card variant="surface" padding="lg" className="border border-surface-variant/50 shadow-3d-base">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection */}
              <div className="space-y-2">
                <span className="text-xs font-headline font-bold text-text-muted block">가입 계정 역할 선택</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-3 rounded-2xl font-headline font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${
                      role === "student"
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-surface-container-low text-text-muted border-surface-variant/40 hover:bg-surface-container"
                    }`}
                  >
                    <span>🧑‍🎓 학생 계정</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`p-3 rounded-2xl font-headline font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${
                      role === "teacher"
                        ? "bg-secondary text-white border-secondary shadow-sm"
                        : "bg-surface-container-low text-text-muted border-surface-variant/40 hover:bg-surface-container"
                    }`}
                  >
                    <span>👨‍🏫 학교관리자(교직원)</span>
                  </button>
                </div>
              </div>

              {/* Standard School Code Selection (NO FREE INPUT per §5.1) */}
              <div className="space-y-1.5">
                <label className="text-xs font-headline font-bold text-text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><School className="w-3.5 h-3.5 text-primary" /> 소속 학교 선택 (표준학교코드)</span>
                  <span className="text-[10px] text-error font-black">자유입력 금지 규정 적용</span>
                </label>
                <select
                  value={selectedSchoolCode}
                  onChange={(e) => setSelectedSchoolCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/60 rounded-2xl text-sm text-text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                >
                  {schoolList.map((s) => (
                    <option key={s.code} value={s.code}>
                      [{s.code}] {s.name} ({s.region})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">💡 나이스(NEIS) 교육정보 개방포털 기반 승인 학교만 선택 가능합니다.</p>
              </div>

              {/* Name & Email */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-headline font-bold text-text-primary block mb-1">실명 (또는 학교 사용 닉네임)</label>
                  <input
                    type="text"
                    placeholder="예: 김수진"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-headline font-bold text-text-primary block mb-1">학교 이메일 또는 구글 ID</label>
                  <input
                    type="email"
                    placeholder="student@seoul-high.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Invite Code Input Gate */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-headline font-bold text-text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-secondary-spot"><KeyRound className="w-3.5 h-3.5" /> 초대코드 (Invite Code) 필수</span>
                  <button
                    type="button"
                    onClick={() => setInviteCode(role === "teacher" ? "TEACHER-SEOUL" : "EXPO-2026")}
                    className="text-[11px] font-black text-secondary underline"
                  >
                    데모 코드 자동 채우기 &rarr;
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="예: EXPO-2026 또는 T-VIP-900"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary/5 border-2 border-secondary/40 rounded-2xl text-sm text-secondary font-headline font-black uppercase placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-secondary text-center tracking-widest shadow-sm"
                />
              </div>

              {/* Messages */}
              {errorMsg && (
                <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-xs text-error font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                variant="teal"
                size="lg"
                fullWidth
                type="submit"
                icon={<UserPlus className="w-5 h-5" />}
                className="font-headline font-extrabold py-4 mt-2 shadow-md"
              >
                학교 코드 검증 후 30초 회원가입 완료
              </Button>
            </form>
          </Card>
        )}

        <div className="text-center">
          <span className="text-xs text-text-muted">이미 학교 코드로 등록하셨나요? </span>
          <Link to="/login" className="text-xs font-bold text-primary underline ml-1">
            로그인 화면 이동
          </Link>
        </div>

      </div>
    </div>
  );
};
