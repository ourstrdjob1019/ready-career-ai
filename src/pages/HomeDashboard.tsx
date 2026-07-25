import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, MascotAri } from "../components";
import { Sparkles, Compass, Award, ArrowUpRight, Clock, CheckCircle2, BookOpen } from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: "진행 중 퀘스트", val: "3", unit: "개", icon: Compass, color: "text-primary", bg: "bg-primary/10", link: "/roadmap" },
    { label: "포트폴리오 기록", val: "12", unit: "건", icon: Award, color: "text-secondary", bg: "bg-secondary/10", link: "/portfolio" },
    { label: "AI 세특 분석율", val: "98", unit: "%", icon: Sparkles, color: "text-primary", bg: "bg-primary-container/20", link: "/teacher" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 flex flex-col gap-8">
      {/* Hero Welcome Banner */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="flex flex-col gap-3 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center self-center md:self-start gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-headline font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-secondary-container" />
            <span>2026 AI 커리어 플롯 액티브</span>
          </div>

          <h1 className="text-headline-lg md:text-display-lg font-extrabold text-white font-headline tracking-tight leading-tight">
            김수진 학생,<br />
            <span className="text-secondary-container">미래의 무대가 열렸어요!</span>
          </h1>

          <p className="text-white/90 text-sm md:text-base font-body-md leading-relaxed">
            나만의 흥미유형 AI 검사 결과를 토대로 이번 주 별자리 퀘스트와 학생부 세특 기록을 간결하게 완성해보세요.
          </p>

          <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
            <Link to="/roadmap">
              <Button variant="teal" size="sm" icon={<Compass className="w-4 h-4" />}>
                로드맵 탐색하기
              </Button>
            </Link>
            <Link to="/activity-form">
              <Button variant="secondary" size="sm" className="bg-white/15 text-white border border-white/20 hover:bg-white/25">
                + 새 활동 기입
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0 z-10 relative">
          <MascotAri pose="sticker" size="lg" rotate={true} className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" />
        </div>

        {/* Background ambient aura */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {quickStats.map((st) => {
          const IconComp = st.icon;
          return (
            <Card
              key={st.label}
              variant="activity"
              padding="md"
              hoverEffect
              onClick={() => navigate(st.link)}
              className="flex items-center justify-between group cursor-pointer border-surface-variant/40"
            >
              <div className="flex flex-col gap-1">
                <span className="text-label-sm text-text-muted font-semibold">{st.label}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-headline font-black text-text-primary group-hover:text-primary transition-colors">
                    {st.val}
                  </span>
                  <span className="text-xs font-bold text-text-muted">{st.unit}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${st.bg} ${st.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <IconComp className="w-6 h-6" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Columns Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Quest & Portfolio Stream */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Constellation Quest Preview */}
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md font-headline font-bold text-text-primary flex items-center gap-2">
              <span>⭐ 이번 주 집중 로드맵 퀘스트</span>
            </h2>
            <Link to="/roadmap" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              전체 로드맵 보기 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card variant="interactive" padding="md" className="border-2 border-secondary/40 shadow-3d-ambient relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary/80" />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary text-white text-[11px] font-headline font-bold px-2.5 py-0.5 rounded-full">
                    진행 중 2단계
                  </span>
                  <span className="text-text-muted text-xs font-semibold">● 창의적체험활동</span>
                </div>
                <h3 className="font-headline font-extrabold text-title-md text-text-primary mt-1">
                  교내 과학탐구 토론 대회 '기후위기와 자율주행' 참가 및 시각화
                </h3>
                <p className="text-sm text-text-muted">
                  팀을 구성하여 실무 데이터를 시각화하고 자율주행 시스템이 환경에 미치는 긍정적 효과 보고서 1건 제출.
                </p>
              </div>
              <div className="flex md:flex-col justify-between items-center md:items-end flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-surface-variant/30">
                <span className="font-headline font-black text-lg text-primary">+300 STAR</span>
                <Link to="/activity-form">
                  <Button variant="primary" size="sm" className="mt-2 font-bold">
                    활동 기록하기
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Daily Habit Mini List */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-headline-md font-headline font-bold text-text-primary flex items-center gap-2">
              <span>🔥 데일리 커리어 루틴</span>
            </h2>
            <Link to="/habits" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              습관 관리로 이동 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card variant="surface" padding="md" className="flex flex-col gap-4 bg-white border-surface-variant/40 shadow-3d-base">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant/30">
              <span className="font-bold text-sm text-text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> 매일 아침 IT/테크 기사 1건 스크랩
              </span>
              <Chip variant="teal" size="sm">완료됨!</Chip>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="font-semibold text-sm text-text-primary/80 flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" /> 파이썬 백준 코딩테스트 기초 문제 2개 풀기
              </span>
              <Link to="/habits">
                <Chip variant="default" size="sm" className="hover:bg-primary/15 hover:text-primary">도전 중</Chip>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Col: AI Partner Advice & Teacher Pro Link */}
        <div className="flex flex-col gap-6">
          <Card variant="activity" padding="md" className="bg-gradient-to-b from-point to-white border-primary/20 shadow-3d-base">
            <h3 className="font-headline font-extrabold text-title-md text-primary flex items-center gap-1.5 mb-3">
              <Sparkles className="w-5 h-5 text-secondary-spot" />
              <span>AI 커리어 파트너 Ari의 조언</span>
            </h3>

            <MascotAri
              pose="avatar"
              size="sm"
              bubbleTitle="이번 주 황금 어드바이스"
              bubbleMessage="관심 진로군인 '인공지능·공학'과 '환경 기후위기' 주제를 엮어 세특에 기재하면 차별성 높은 최고 점수 등급을 받아요!"
            />

            <div className="mt-4 pt-4 border-t border-primary/10 text-xs text-text-muted flex items-center justify-between font-semibold">
              <span>● 일일 추천 데이터 실시간 동기화됨</span>
              <Link to="/interest-test" className="text-primary hover:underline">검사 다시받기</Link>
            </div>
          </Card>

          {/* Teacher Guide Pro Feature Card */}
          <Card variant="surface" padding="md" className="bg-secondary-container/25 border border-secondary/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-secondary-spot font-headline font-black text-base">
              <BookOpen className="w-5 h-5" />
              <span>학생부 기재 가이드 (교사용 3D Pro)</span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed">
              담당 선생님께서 이 대시보드 데이터를 실시간 열람하여 세무적인 행동특성 및 종합 의견(행특/세특)을 AI로 생성하는 고대비 Pro 도구입니다.
            </p>
            <Link to="/teacher">
              <Button variant="teal" size="sm" fullWidth className="mt-1 font-extrabold shadow-sm">
                교사용 보드 3D 열람하기 &rarr;
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
