import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, ProgressBar, MascotAri } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { Sparkles, Brain, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const SelfUnderstanding: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, report, completeAssessment, generateComprehensiveReport } = useSelfUnderstanding();
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const completedCount = assessments.filter((a) => a.status === "완료됨").length;
  const totalCount = assessments.length;

  const handleQuickTakeTest = (id: string) => {
    if (id === "test-interest") {
      navigate("/interest-test");
      return;
    }
    setSimulatingId(id);
    setTimeout(() => {
      if (id === "test-intelligence") {
        completeAssessment(id, 96, "다중지능 분석 결과: 상위 1.8%의 AI 알고리즘 공간 직관력과 탁월한 인문 토론 리더십을 보유했습니다.");
      } else if (id === "test-learning") {
        completeAssessment(id, 92, "학습 스타일 진단: 45분 집중 10분 휴식의 시각화 데이터 요약 루틴이 세특 효율을 극대화합니다.");
      }
      setSimulatingId(null);
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Hero Banner: Self-Understanding Hub */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex flex-col gap-3 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center self-center md:self-start gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-headline font-bold text-white">
            <Brain className="w-4 h-4 text-secondary-container animate-pulse" />
            <span>나만의 입체적 3D DNA 진단 허브</span>
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
            const isSimulating = simulatingId === item.id;

            return (
              <Card
                key={item.id}
                variant={isCompleted ? "activity" : "surface"}
                padding="md"
                hoverEffect
                onClick={() => !isSimulating && handleQuickTakeTest(item.id)}
                className={`flex flex-col justify-between border-2 transition-all group min-h-[300px] ${
                  isCompleted
                    ? "border-primary/40 bg-white shadow-3d-ambient"
                    : "border-surface-variant/40 bg-surface-container-low/70 hover:border-secondary/60"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-headline font-bold px-3 py-1 rounded-full ${
                      item.category === "흥미무드" ? "bg-primary/10 text-primary" : item.category === "다중지능" ? "bg-secondary/15 text-secondary-spot" : "bg-surface-container text-text-primary"
                    }`}>
                      #{item.category}
                    </span>

                    {isCompleted ? (
                      <Chip variant="teal" size="sm" active className="pointer-events-none">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 완료됨 ({item.score}점)
                      </Chip>
                    ) : (
                      <Chip variant="default" size="sm" className="pointer-events-none">
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
                  <span className="text-xs font-bold text-text-muted">
                    {isCompleted ? `● 검사일: ${item.completedAt}` : "● 소요시간 약 2분 내외"}
                  </span>
                  <Button
                    variant={isCompleted ? "secondary" : "primary"}
                    size="sm"
                    className="font-black"
                  >
                    {isSimulating ? "AI 분석 중..." : isCompleted ? "결과 다시 보기" : "진단 밟기"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
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
