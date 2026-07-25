import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, MascotAri } from "../components";
import { Trophy, ArrowRight, Flame, BookOpen, Share2 } from "lucide-react";

export const TestResult: React.FC = () => {
  const navigate = useNavigate();

  const recommendations = [
    {
      title: "AI 로봇 융합 연구원",
      matchRate: 98,
      category: "인공지능·공학 (R-I-A)",
      desc: "인류 문제 해결을 위한 알고리즘 설계와 기계 공학적 하드웨어의 결합을 리드하는 미래 유망 직업",
      skills: ["파이썬/AI 알고리즘", "로보틱스 기구설계", "데이터 추론력"],
      isTop: true,
    },
    {
      title: "기후·환경 데이터 애널리스트",
      matchRate: 92,
      category: "기초과학·연구 (I-S-C)",
      desc: "빅데이터 감지 센서를 통해 탄소 저감 대책을 마련하고 친환경 ESG 가치 경영을 돕는 전문가",
      skills: ["통계학/시각화", "환경 정책 이해", "지지속적 참을성"],
      isTop: false,
    },
    {
      title: "인터랙티브 XR 메타버스 크리에이터",
      matchRate: 88,
      category: "문화 콘텐츠·디자인 (A-E-I)",
      desc: "사용자 감수성을 통찰하여 몰입도 높은 가상 공간 세계관과 3D 한글 그래픽 경험을 제작",
      skills: ["3D 그래픽 엔진", "스토리텔링 기획", "디지털 심리학"],
      isTop: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Hero Result Celebration Banner */}
      <Card variant="hero" padding="lg" className="w-full flex flex-col md:flex-row items-center justify-between gap-8 shadow-3d-hover">
        <div className="flex flex-col gap-4 text-center md:text-left flex-grow">
          <div className="inline-flex items-center self-center md:self-start gap-1.5 bg-white/20 px-3.5 py-1 rounded-full text-xs font-headline font-extrabold backdrop-blur-md">
            <Trophy className="w-4 h-4 text-secondary-container animate-bounce" />
            <span>AI 진로 무드검사 완료!</span>
          </div>
          
          <h1 className="text-headline-lg md:text-display-lg font-extrabold text-white tracking-tight leading-none font-headline">
            김수진 학생의<br />
            <span className="text-secondary-container">미래 커리어 DNA</span>
          </h1>
          
          <p className="text-white/90 font-body-md leading-relaxed text-sm md:text-base max-w-lg">
            탐구적 분석력(I)과 사회적 가치 실천(S) 역량이 매우 탁월하게 어우러진 <strong>[융합 혁신 개척자]</strong> 타입입니다!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <Chip variant="teal" size="sm" active> #AI_융합_리더 </Chip>
            <Chip variant="default" size="sm" className="bg-white/10 text-white border border-white/20"> #문제해결력_99점 </Chip>
            <Chip variant="default" size="sm" className="bg-white/10 text-white border border-white/20"> #학문적_호기심 </Chip>
          </div>
        </div>

        <div className="flex-shrink-0 relative flex items-center justify-center">
          <MascotAri pose="celebrate" size="lg" rotate={false} className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]" />
          <div className="absolute -bottom-3 text-center bg-surface-container-lowest text-primary px-4 py-1 rounded-full font-headline font-extrabold text-xs shadow-md">
            Ari 98% 일치 추천
          </div>
        </div>
      </Card>

      {/* Recommended Job Cards List */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-lg font-headline font-bold text-text-primary flex items-center gap-2">
            <span>🚀 추천 직업 TOP 3 선택</span>
          </h2>
          <span className="text-xs text-secondary-spot font-extrabold bg-secondary/10 px-3 py-1 rounded-full">
            로드맵에 등록할 직업을 선택해보세요
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((job, idx) => (
            <Card
              key={job.title}
              variant={job.isTop ? "activity" : "surface"}
              padding="md"
              hoverEffect
              onClick={() => navigate("/roadmap", { state: { selectedJob: job.title } })}
              className={`border-2 transition-all ${
                job.isTop ? "border-primary/40 bg-white shadow-3d-ambient" : "border-transparent bg-surface-container-low/60"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-0.5 rounded-full font-headline font-black text-xs ${
                      job.isTop ? "bg-primary text-on-primary" : "bg-surface-variant text-text-muted"
                    }`}>
                      TOP {idx + 1}
                    </span>
                    <span className="text-secondary font-headline font-bold text-xs">
                      ● {job.category}
                    </span>
                  </div>

                  <h3 className="text-headline-md font-headline font-extrabold text-text-primary mt-1 hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-text-muted font-body-md text-sm leading-relaxed max-w-2xl">
                    {job.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.skills.map((s) => (
                      <span key={s} className="bg-surface-container px-3 py-1 rounded-full text-[12px] text-text-primary font-semibold border border-surface-variant/30">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match percentage Gauge & Action */}
                <div className="flex md:flex-col items-center justify-between md:justify-center md:text-right flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-surface-variant/30 gap-4">
                  <div className="flex flex-col items-start md:items-end">
                    <div className="font-headline text-2xl md:text-3xl font-black text-primary flex items-center gap-1">
                      <span>{job.matchRate}%</span>
                      {job.isTop && <Flame className="w-5 h-5 text-secondary fill-secondary" />}
                    </div>
                    <span className="text-[11px] text-text-muted font-semibold">AI 알고리즘 일치율</span>
                  </div>

                  <Button
                    variant={job.isTop ? "primary" : "secondary"}
                    size="sm"
                    className="flex items-center gap-1 font-extrabold"
                  >
                    로드맵 담기 <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Teacher & Portfolio Action bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card variant="surface" padding="md" className="flex items-center justify-between gap-4 bg-surface-container-low border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-text-primary text-base">학생부 활동 추천 가이드</h4>
              <p className="text-xs text-text-muted">이 결과를 바탕으로 한 세특/창체 작성법</p>
            </div>
          </div>
          <Link to="/teacher">
            <Button variant="teal" size="sm">교사용 뷰</Button>
          </Link>
        </Card>

        <Card variant="surface" padding="md" className="flex items-center justify-between gap-4 bg-surface-container-low border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-text-primary text-base">진로 포트폴리오 연동</h4>
              <p className="text-xs text-text-muted">검사 결과를 포트폴리오에 자동 기록</p>
            </div>
          </div>
          <Link to="/portfolio">
            <Button variant="outline" size="sm">포트폴리오 이동</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
