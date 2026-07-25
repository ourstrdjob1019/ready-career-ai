import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, MascotAri } from "../components";
import { useAuth, useSelfUnderstanding } from "../context";
import {
  Sparkles,
  Compass,
  Award,
  ArrowRight,
  Flame,
  Plus,
  BookOpen,
  Brain,
  CheckCircle2,
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session } = useAuth();
  const { report, assessments } = useSelfUnderstanding();

  // Interactive local state for dynamic hero greeting
  const [selectedCluster, setSelectedCluster] = useState<string>("AI·공학 융합");

  const clusters = ["AI·공학 융합", "의·약학 바이오", "경영·경제 금융", "인문·미디어 예술"];

  const completedAssessments = assessments.filter((a) => a.status === "완료됨").length;
  const userName = session?.name ? session.name : "김수진";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Hero Welcome Card (Integrated with Mascot Ari & Self-Understanding Aura!) */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Hero Text Content */}
          <div className="md:col-span-8 space-y-4 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-secondary font-headline text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-secondary-spot animate-pulse" />
              <span>{report ? `✨ ${report.characterTitle} 오오라 칭호 보유` : "2026 AI 개별 고교생 맞춤 커리어 무대"}</span>
            </div>

            <h1 className="text-display-lg font-headline font-black text-text-primary tracking-tight leading-none">
              반가워요, <span className="text-transparent bg-clip-text gradient-hero-card">{userName}</span> 님!<br />
              <span className="text-headline-lg font-bold text-text-secondary mt-1 block">
                나에 대한 깊은 <strong className="text-secondary font-extrabold">‘자기이해’</strong>가 최적의 커리어를 만듭니다.
              </span>
            </h1>

            <p className="text-sm md:text-base text-text-muted font-body-md max-w-2xl leading-relaxed">
              {report ? (
                <>
                  AI 자기이해 종합 분석에 따라 <strong>"{report.title}"</strong> 칭호가 수여되었습니다.<br />
                  포트폴리오에 등록된 강점을 바탕으로 이번 달 별자리 로드맵 퀘스트를 돌파해 봐요!
                </>
              ) : (
                <>
                  아직 나만의 진로 흥미와 다중지능 AI 진단 리포트를 생성하지 못했군요!<br />
                  지금 즉시 <strong>[자기이해 스튜디오]</strong>에서 다각도 진단을 시작해보세요.
                </>
              )}
            </p>

            {/* Interactive Cluster Selector Chips */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-headline font-semibold text-text-muted block">
                현재 설정된 탐구 클러스터 관점:
              </span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {clusters.map((c) => (
                  <Chip
                    key={c}
                    active={selectedCluster === c}
                    variant={selectedCluster === c ? "default" : "default"}
                    onClick={() => setSelectedCluster(c)}
                    size="sm"
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <Link to="/self-understanding">
                <Button variant="teal" size="lg" icon={<Brain className="w-5 h-5" />} className="font-extrabold shadow-md">
                  {report ? "자기이해 리포트 보러가기" : "AI 자기이해 3종 진단 시작"} &rarr;
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="md" icon={<Award className="w-4 h-4 text-primary" />}>
                  내 포트폴리오
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Mascot Ari */}
          <div className="md:col-span-4 flex justify-center z-10">
            <MascotAri
              pose={report ? "celebrate" : "avatar"}
              size="lg"
              rotate={true}
              bubbleTitle={report ? report.characterTitle : "Ari의 오늘의 황금 팁"}
              bubbleMessage={
                report
                  ? report.characterAura
                  : "자기이해 탭에서 30초 흥미검사를 마치면 포트폴리오에 AI 진단 리포트가 자동 스크랩돼요!"
              }
              className="scale-105"
            />
          </div>
        </div>

        {/* Decorative Background gradient blot */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none" />
      </Card>

      {/* 2. Self-Understanding & Progress Summary Bar (NEW FEATURE SECTION) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="activity" padding="md" className="md:col-span-2 shadow-3d-base border-secondary/30 flex flex-col justify-between bg-gradient-to-r from-point to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-variant/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-black">
                <Brain className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-headline font-bold text-secondary-spot">Self-Understanding DNA</span>
                <h2 className="text-title-lg font-headline font-extrabold text-text-primary">자기이해 진도 및 AI 리포트 현황</h2>
              </div>
            </div>
            <Link to="/self-understanding">
              <Chip variant="teal" size="sm" active className="cursor-pointer">
                진료 스튜디오 이동 &rarr;
              </Chip>
            </Link>
          </div>

          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-2xl border border-surface-variant/30 flex flex-col gap-1 shadow-sm">
              <span className="text-xs text-text-muted font-extrabold">완료된 AI 진단 수</span>
              <strong className="text-xl font-headline font-black text-primary">{completedAssessments} / {assessments.length} 과목</strong>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-surface-variant/30 flex flex-col gap-1 shadow-sm sm:col-span-2">
              <span className="text-xs text-text-muted font-extrabold">최근 획득 오오라 칭호</span>
              <strong className="text-sm font-headline font-black text-secondary-spot truncate">
                {report ? report.title : "진행 전 (테스트 필요)"}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted font-body-md">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span>자기이해 리포트는 선생님 보드 및 내 포트폴리오에 실시간 스크랩됩니다.</span>
          </div>
        </Card>

        {/* Quick Streak Widget */}
        <Card variant="surface" padding="md" className="shadow-3d-base flex flex-col justify-between border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-headline font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
              데일리 커리어 루틴
            </span>
            <Flame className="w-6 h-6 text-secondary-spot animate-bounce" />
          </div>
          <div className="my-2">
            <span className="text-display-lg font-headline font-black text-text-primary leading-none">12<small className="text-base font-bold ml-1">일 연속</small></span>
            <p className="text-xs text-text-muted mt-1">
              상위 3% 습관 달성률! 오늘 AI 세특 문장 다듬기 1회만 더하면 13일 스트리크 달성!
            </p>
          </div>
          <Link to="/habits" className="w-full">
            <Button variant="secondary" size="sm" fullWidth icon={<Sparkles className="w-4 h-4" />}>
              오늘의 루틴 체크인
            </Button>
          </Link>
        </Card>
      </section>

      {/* 3. Core Action Grid (Roadmap, Activity Form, Teacher Guide, Portfolio) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-md font-headline font-extrabold text-text-primary flex items-center gap-2">
            <span>🚀 진로 네비게이션 핵심 코스</span>
          </h2>
          <span className="text-xs font-bold text-secondary-spot">교육청 NEIS 표준 양식 대응</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="activity" padding="md" hoverEffect onClick={() => window.location.href = "/activity-form"} className="cursor-pointer border-2 border-primary/20 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-headline font-extrabold text-primary uppercase block mb-1">Step 1. 실시간 기록</span>
              <h3 className="font-headline font-black text-title-lg text-text-primary group-hover:text-primary transition-colors">
                AI 세특 활동 기록 폼
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed font-body-md">
                키워드 몇 개만 입력하면 AI 파트너가 고교부 최고의 고급 세특 문장으로 즉시 세련되게 윤문해줍니다!
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs font-extrabold text-primary">
              <span>활동 추가하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card variant="surface" padding="md" hoverEffect onClick={() => window.location.href = "/roadmap"} className="cursor-pointer border border-surface-variant/60 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-headline font-extrabold text-secondary-spot uppercase block mb-1">Step 2. 진로 내비게이션</span>
              <h3 className="font-headline font-black text-title-lg text-text-primary group-hover:text-secondary transition-colors">
                별자리 커리어 로드맵
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed font-body-md">
                고교 3년 동안 내가 이수해야 할 전공 맞춤형 프로젝트와 권장 독서 목록을 별자리처럼 수놓아보세요.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs font-extrabold text-secondary-spot">
              <span>로드맵 열기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card variant="surface" padding="md" hoverEffect onClick={() => window.location.href = "/portfolio"} className="cursor-pointer border border-surface-variant/60 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-headline font-extrabold text-text-muted uppercase block mb-1">Step 3. 자산 보관 및 출력</span>
              <h3 className="font-headline font-black text-title-lg text-text-primary group-hover:text-primary transition-colors">
                3D 한글 포트폴리오
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed font-body-md">
                자기이해 리포트와 학기별 결과물을 아름다운 디자인 카드뷰와 NEIS 일괄 출력 텍스트로 조회하세요.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs font-extrabold text-primary">
              <span>내역 보러가기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card variant="surface" padding="md" hoverEffect onClick={() => window.location.href = "/teacher"} className="cursor-pointer border border-secondary/30 bg-secondary/5 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-secondary text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-headline font-extrabold text-secondary uppercase block mb-1">2560px Pro 대응</span>
              <h3 className="font-headline font-black text-title-lg text-text-primary group-hover:text-secondary transition-colors">
                교사 전용 업무보드
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed font-body-md">
                담당 학급 학생들의 진척도와 자기이해 리포트를 확인하고 세특 문장을 NEIS에 일괄 최적화하여 내보내세요.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs font-extrabold text-secondary">
              <span>선생님 뷰 접속</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
