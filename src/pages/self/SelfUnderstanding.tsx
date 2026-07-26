import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, ProgressBar, MascotAri } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { Sparkles, Brain, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const SelfUnderstanding: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, report, generateComprehensiveReport } = useSelfUnderstanding();

  const completedCount = assessments.filter((a) => a.status === "완료됨").length;
  const totalCount = assessments.length;

  const handleQuickTakeTest = (id: string) => {
    if (id === "test-interest") {
      navigate("/interest-test");
    } else if (id === "test-intelligence") {
      navigate("/intelligence-test");
    } else if (id === "test-learning") {
      navigate("/learning-test");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Hero Banner: Self-Understanding Hub */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex flex-col gap-3 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center self-center md:self-start gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-headline font-bold text-white whitespace-nowrap border border-white/20">
            <Brain className="w-4 h-4 text-secondary-container animate-pulse" />
            <span>나만의 커리어 역량 다면 진단 허브</span>
          </div>

          <h1 className="text-headline-lg md:text-display-lg font-black text-white font-headline tracking-tight leading-tight">
            자기이해 <span className="text-secondary-container">스튜디오</span>
          </h1>

          <p className="text-white/90 text-sm md:text-base font-body-md leading-relaxed">
            포트폴리오의 시작은 <strong>나에 대한 깊고 다각적인 통찰</strong>입니다.<br />
            다양한 흥미·잠재력 AI 진단을 완료하면 <strong>개인 맞춤 리포트</strong>가 생성되어 포트폴리오와 메인 캐릭터 칭호에 자동 영속 반영됩니다!
          </p>

          <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
            <Link to="/self-report">
              <Button variant="teal" size="sm" icon={<Sparkles className="w-4 h-4" />} className="font-black shadow-lg">
                내 종합 AI 리포트 보러가기 &rarr;
              </Button>
            </Link>
            {report && (
              <span className="text-xs bg-white/15 px-3 py-1.5 rounded-full text-white font-semibold border border-white/20">
                ✨ {report.characterTitle} 오오라 활성
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 z-10 flex flex-col items-center">
          <MascotAri pose="sticker" size="lg" rotate={true} className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" />
          <div className="w-64 mt-2 bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-lg flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-text-primary">
              <span>진도 완결 수치를 100%로 밟아보세요!</span>
              <span className="text-primary font-black">{completedCount}/{totalCount} 완료</span>
            </div>
            <ProgressBar value={completedCount} max={totalCount} variant="teal" />
          </div>
        </div>

        <div className="absolute -left-10 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* 3 Core Self-Understanding Assessments List */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-headline-md font-headline font-extrabold text-text-primary flex items-center gap-2">
              <span>🔬 다목적 자기이해 AI 진단 시리즈</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">각 항목을 클릭하여 30초 내에 검사를 이수하고 생기부 매핑 역량 배지를 얻으세요.</p>
          </div>
          <Button variant="outline" size="sm" onClick={generateComprehensiveReport} icon={<Zap className="w-4 h-4" />}>
            모든 결과 리서치 AI 즉시 동기화
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessments.map((item) => {
            const isCompleted = item.status === "완료됨";

            return (
              <Card
                key={item.id}
                variant={isCompleted ? "activity" : "surface"}
                padding="md"
                hoverEffect
                onClick={() => handleQuickTakeTest(item.id)}
                className={`flex flex-col justify-between border-2 transition-all group min-h-[300px] cursor-pointer ${
                  isCompleted
                    ? "border-primary/40 bg-white shadow-3d-ambient"
                    : "border-surface-variant/40 bg-surface-container-low/70 hover:border-secondary/60"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-headline font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      item.category === "흥미무드" ? "bg-primary/10 text-primary" : item.category === "다중지능" ? "bg-secondary/15 text-secondary-spot" : "bg-surface-container text-text-primary"
                    }`}>
                      #{item.category}
                    </span>

                    {isCompleted ? (
                      <Chip variant="teal" size="sm" active className="pointer-events-none whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> 완료됨 ({item.score}점)
                      </Chip>
                    ) : (
                      <Chip variant="default" size="sm" className="pointer-events-none whitespace-nowrap">
                        도전 기다리는 중
                      </Chip>
                    )}
                  </div>

                  <h3 className="font-headline font-extrabold text-title-md text-text-primary group-hover:text-primary transition-colors leading-snug mt-1">
                    {item.title}
                  </h3>

                  <p className="text-sm font-body-md text-text-muted leading-relaxed bg-surface-container/50 p-3 rounded-2xl border border-surface-variant/30">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-variant/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted whitespace-nowrap">
                    {isCompleted ? `● 검사일: ${item.completedAt}` : "● 소요시간 약 2분 내외"}
                  </span>
                  <Button
                    variant={isCompleted ? "secondary" : "primary"}
                    size="sm"
                    className="font-black whitespace-nowrap shadow-sm"
                  >
                    {isCompleted ? "결과 다시 보기 / 재진단" : "진단 시작하기"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stitch 3D Competency Growth Visualization & Radar Dashboard */}
      <section className="bg-white rounded-[32px] p-8 border border-[#E3E1E9] shadow-[0_20px_45px_rgba(123,92,240,0.08)] space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3E1E9]/80 pb-5">
          <div>
            <span className="text-xs font-black text-[#7B5CF0] uppercase tracking-wider bg-[#e6deff]/60 px-3 py-1 rounded-full inline-block mb-1 border border-[#cbbeff]/50 whitespace-nowrap">
              AI RADAR CHART &middot; GROWTH VISUALIZER
            </span>
            <h2 className="text-2xl font-black text-[#1A1626] flex items-center gap-2">
              <span>📊 AI 방사형 역량 성장 시각화 대시보드</span>
            </h2>
            <p className="text-xs text-[#6E6A80] mt-0.5">다중지능 및 습관 퀘스트 이행도에 따라 고유한 5대 핵심 학생부 역량 펜타곤이 확장됩니다.</p>
          </div>
          <div className="bg-[#7af1fc]/20 text-[#006970] px-4 py-2 rounded-2xl border border-[#006970]/20 font-black text-xs self-start md:self-auto flex items-center gap-1.5 shadow-sm whitespace-nowrap">
            <span>🚀 전월 대비 역량 성장율: +18.4% 상승</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Mock Radar Pentagon Graphic Card */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-[#f4f2fa] via-[#efedf5] to-[#fbf8ff] p-6 rounded-[28px] border border-[#cac4d7]/50 shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[260px]">
            <div className="w-40 h-40 rounded-full border-4 border-dashed border-[#7B5CF0]/40 flex items-center justify-center animate-spin-slow relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7B5CF0]/20 to-[#006970]/30 border-2 border-[#006970] flex items-center justify-center shadow-lg transform rotate-12">
                <span className="text-5xl drop-shadow-md">💎</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <span className="text-[11px] font-extrabold bg-white/90 px-4 py-1 rounded-full shadow-sm border border-[#E3E1E9] text-[#1A1626] whitespace-nowrap inline-block">
                역량 Pentagon Level: <strong className="text-[#6240d5]">AURA DIAMOND</strong>
              </span>
            </div>
          </div>

          {/* 5 Core Axis Progress Bars */}
          <div className="lg:col-span-7 space-y-4">
            {[
              { label: "자기주도 학업역량 (Self-Directed Study)", score: 94, color: "from-[#8E70F7] to-[#6240d5]" },
              { label: "전공 심화 탐구력 (Major Exploration)", score: 88, color: "from-[#006970] to-[#7af1fc]" },
              { label: "문제 해결 및 AI 알고리즘 직관 (Problem Solving)", score: 96, color: "from-[#7B5CF0] to-[#4a21be]" },
              { label: "창의·융합 독서 및 윤리 의식 (Ethics & Arts)", score: 85, color: "from-[#006e75] to-[#006970]" },
              { label: "협업 소통 리더십 & 동아리 참여도 (Leadership)", score: 91, color: "from-[#6240d5] to-[#7b5cf0]" },
            ].map((axis, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-extrabold text-[#1A1626]">
                  <span>{axis.label}</span>
                  <span className="text-[#7B5CF0] font-black">{axis.score} / 100</span>
                </div>
                <div className="w-full bg-[#E3E1E9] h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-2.5 rounded-full bg-gradient-to-r ${axis.color} transition-all duration-1000`} style={{ width: `${axis.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Self-Understanding Card */}
      <Card variant="surface" padding="md" className="bg-gradient-to-r from-secondary/10 to-primary/10 border border-primary/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-headline font-extrabold text-base">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span>왜 ‘자기이해’ 검사가 포트폴리오에 필요한가요?</span>
          </div>
          <p className="text-xs md:text-sm text-text-primary leading-relaxed max-w-3xl">
            단순히 외부 공공 데이터나 경시대회 이름만 늘어놓는 스펙은 이제 입학사정관을 설득하지 못합니다.
            <strong> 나의 다중지능 강점과 흥미무드를 정확히 분석하고</strong> 그에 맞는 독서를 수행하거나 창의적체험활동을 해결해 낼 때,
            선생님과 AI가 작성해주는 세부능력 및 특기사항(세특)의 신뢰도가 최고치에 달합니다!
          </p>
        </div>

        <Link to="/portfolio">
          <Button variant="outline" size="sm" className="whitespace-nowrap font-extrabold bg-white">
            내 포트폴리오 스크랩 확인 &rarr;
          </Button>
        </Link>
      </Card>
    </div>
  );
};
