import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip } from "../../components";
import { useAuth } from "../../context";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  Plus,
  Copy,
  CheckCircle2,
  School,
  Zap,
  Server,
  Database,
} from "lucide-react";
import configData from "../../data/assessment_config.json";

export const SuperAdminConsole: React.FC = () => {
  const { signupOpen, toggleSignupOpen, inviteCodes, generateInviteCode } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
  const [selectedSchool, setSelectedSchool] = useState<string>("서울창의고등학교");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const schoolList = configData.school_master_data || [];

  const handleGenerate = () => {
    const newCode = generateInviteCode(selectedRole, selectedSchool, selectedRole === "teacher" ? 10 : 100);
    setCopiedCode(newCode);
    navigator.clipboard.writeText(newCode);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary font-headline text-xs font-black mb-3">
            <ShieldAlert className="w-4 h-4 text-secondary-spot" />
            <span>ReadyCareer AI Super Admin Control Tower</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
            👑 최종 슈퍼관리자 <span className="text-transparent bg-clip-text gradient-hero-card">콘솔</span>
          </h1>
          <p className="text-sm text-text-muted mt-2 font-body-md max-w-2xl leading-relaxed">
            B2B 과금 모델 및 AI 서버리스 API 사용량을 통제하기 위한 <strong>가입 기간 개폐 제어 및 초대코드 발급 타임</strong>입니다.
            학교관리자는 자기 학교 데이터만 접근하며(RLS), 슈퍼관리자는 본 콘솔에서 전역 통제를 수행합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link to="/teacher">
            <Button variant="outline" size="sm">
              👨‍🏫 교사 대시보드 뷰
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              🧑‍🎓 학생 메인보드 뷰
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Global Signup Gated Control Switch & AI API Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gate Switch Card */}
        <Card
          variant={signupOpen ? "activity" : "hero"}
          padding="lg"
          className={`lg:col-span-7 transition-all duration-300 border-2 shadow-3d-ambient flex flex-col justify-between ${
            signupOpen
              ? "bg-gradient-to-r from-point via-white to-white border-secondary/40"
              : "bg-error-container/20 border-error/40"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className={`text-xs font-headline font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                signupOpen ? "bg-secondary text-white" : "bg-error text-white"
              }`}>
                {signupOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{signupOpen ? "가입 게이트: 상시 개방 중 (OPEN)" : "가입 게이트: 기간 폐기·마감됨 (CLOSED)"}</span>
              </span>

              <h2 className="text-2xl font-headline font-black text-text-primary">
                정식 신규 회원가입 기간 개폐 토글
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body-md">
                가입을 상시 개방하지 않는 원칙(§4)에 따라 1문번 클릭으로 전체 가입 수치 및 서버리스 토큰 소비를 잠금 차단하거나 승인 개방할 수 있습니다.
              </p>
            </div>

            <button
              onClick={toggleSignupOpen}
              className={`px-6 py-4 rounded-md font-headline font-black text-sm md:text-base flex items-center gap-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                signupOpen
                  ? "bg-error text-white shadow-error/30"
                  : "bg-secondary text-white shadow-secondary/30"
              }`}
            >
              {signupOpen ? "⛔ 가입 즉시 차단 (LOCK)" : "🔓 가입 승인 개방 (OPEN)"}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-variant/40 flex items-center justify-between text-xs font-bold text-text-muted">
            <span>💡 현재 토글 상태는 `/signup` 화면 진입 시 RLS 및 클라이언트 단에 실시간 동기화됩니다.</span>
            <span className={signupOpen ? "text-primary font-black" : "text-error font-black"}>
              상태: {signupOpen ? "신규 학생 가입 허용 중" : "신규 가입 차단"}
            </span>
          </div>
        </Card>

        {/* AI API Proxy Telemetry Simulator */}
        <Card variant="surface" padding="md" className="lg:col-span-5 border border-primary/20 bg-surface-container-lowest flex flex-col justify-between shadow-3d-base">
          <div className="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <span className="text-xs font-headline font-extrabold text-primary flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Vercel Serverless AI API 현황
            </span>
            <Chip size="sm" variant="default">Rate-Limited</Chip>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-md border border-surface-variant/40">
              <span className="text-xs text-text-muted font-bold block mb-1">이번 달 AI 호출 누적수</span>
              <strong className="text-2xl font-headline font-black text-text-primary">4,821 <small className="text-xs text-primary font-bold">/ 50k</small></strong>
              <div className="w-full bg-surface-variant/50 h-1.5 rounded-full mt-2">
                <div className="bg-primary h-1.5 rounded-full w-[10%]" />
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-md border border-surface-variant/40">
              <span className="text-xs text-text-muted font-bold block mb-1">생기부 가이드안 생성수</span>
              <strong className="text-2xl font-headline font-black text-secondary">312 <small className="text-xs text-secondary-spot font-bold">건 완료</small></strong>
              <span className="text-[10px] text-text-muted mt-1 block">프롬프트 가이드라인 주입됨</span>
            </div>
          </div>

          <p className="text-[11px] text-text-muted flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-secondary-spot flex-shrink-0" />
            <span>클라이언트에 API 키 절대 노출 없음 (Serverless ENV 프록시 작동 중).</span>
          </p>
        </Card>

      </div>

      {/* 2. B2B Invite Code Generator & Master List */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-text-primary flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-secondary" />
              <span>학교별 B2B 초대코드 발급 및 승인현황</span>
            </h2>
            <p className="text-xs text-text-muted mt-1">
              학교 교직원 혹은 학생 학급 단위로 유한한 사용 가능 횟수(Max Uses)를 가지는 승인 키를 발급합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-variant/60 font-headline font-bold text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="student">🧑‍🎓 학생용 (S-AI)</option>
              <option value="teacher">👨‍🏫 교사·담당자용 (T-VIP)</option>
            </select>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-variant/60 font-headline font-bold text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {schoolList.map((s) => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
            <Button
              variant="teal"
              size="md"
              onClick={handleGenerate}
              icon={<Plus className="w-4 h-4" />}
              className="font-headline font-black whitespace-nowrap shadow-md"
            >
              새 초대코드 1초 생성
            </Button>
          </div>
        </div>

        {/* Codes Table / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inviteCodes.map((item) => {
            const isTeacher = item.role === "teacher";
            const usagePercent = Math.min(100, Math.round((item.usedCount / item.maxUses) * 100));
            const isCopied = copiedCode === item.code;

            return (
              <Card
                key={item.id}
                variant="surface"
                padding="md"
                className="border border-surface-variant/60 shadow-3d-base hover:shadow-3d-ambient transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-headline font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isTeacher ? "bg-secondary/20 text-secondary-spot border border-secondary/30" : "bg-primary/15 text-primary border border-primary/20"
                    }`}>
                      {isTeacher ? "👨‍🏫 교직원 VIP" : "🧑‍🎓 학생 일반"}
                    </span>
                    <span className="text-xs text-text-muted font-extrabold flex items-center gap-1">
                      <School className="w-3.5 h-3.5" /> {item.school}
                    </span>
                  </div>

                  <div className="p-3.5 bg-surface-container-lowest rounded-md border border-surface-variant/50 flex items-center justify-between shadow-inner">
                    <span className="font-headline font-black text-lg md:text-xl text-text-primary tracking-wider font-mono">
                      {item.code}
                    </span>
                    <button
                      onClick={() => handleCopy(item.code)}
                      className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 transition-colors ${
                        isCopied ? "bg-secondary text-white" : "bg-surface-container hover:bg-surface-container-high text-text-primary"
                      }`}
                      title="코드 클립보드 복사"
                    >
                      {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4 text-primary" />}
                      <span>{isCopied ? "복사됨!" : "복사"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-surface-variant/30">
                  <div className="flex items-center justify-between text-xs font-headline font-bold">
                    <span className="text-text-muted">사용량 진도율 ({item.usedCount}명 가입)</span>
                    <span className="text-primary font-black">{usagePercent}% 소진</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300" style={{ width: `${usagePercent}%` }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. School Master Data List */}
      <section className="space-y-4 pt-4">
        <h3 className="text-xl font-headline font-black text-text-primary flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <span>등록된 표준 학교 마스터 DB (자유입력 방지 스키마)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {schoolList.map((sc) => (
            <div key={sc.code} className="p-4 bg-surface-container-low rounded-md border border-surface-variant/40 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-secondary font-black font-mono block">[{sc.code}]</span>
                <strong className="text-sm font-headline font-extrabold text-text-primary">{sc.name}</strong>
                <span className="text-xs text-text-muted block mt-0.5">{sc.region} · {sc.level}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg bg-surface-container font-black text-text-muted">RLS ON</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default SuperAdminConsole;
