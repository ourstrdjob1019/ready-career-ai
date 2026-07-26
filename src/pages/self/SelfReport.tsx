import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, MascotAri } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { Sparkles, ArrowLeft, ShieldCheck, Share2, Layers } from "lucide-react";

export const SelfReport: React.FC = () => {
  const navigate = useNavigate();
  const { report, assessments } = useSelfUnderstanding();

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center flex flex-col items-center gap-4">
        <p className="text-headline-md font-headline text-text-primary font-bold">아직 생성된 자기이해 AI 리포트가 없습니다.</p>
        <Button onClick={() => navigate("/self-understanding")} variant="primary">
          자기이해 검사 하러 가기
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Header Back Button & Title */}
      <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-surface-container rounded-2xl text-text-primary hover:bg-surface-container-high transition-colors"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-headline font-extrabold text-secondary bg-secondary/15 px-3 py-0.5 rounded-full uppercase whitespace-nowrap inline-block border border-secondary/20">
              Comprehensive AI Profile
            </span>
            <h1 className="text-headline-lg font-black text-text-primary font-headline mt-1">
              자기이해 AI 개인 맞춤 종합 리포트
            </h1>
          </div>
        </div>

        <Link to="/portfolio">
          <Button variant="teal" size="sm" icon={<Share2 className="w-4 h-4" />} className="font-extrabold shadow-sm">
            포트폴리오 스크랩 확인
          </Button>
        </Link>
      </div>

      {/* Main Hero Report Card */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex flex-col gap-4 max-w-2xl z-10 text-center md:text-left">
          <div className="inline-flex items-center self-center md:self-start gap-2 bg-white/20 px-4 py-1 rounded-full text-xs font-headline font-extrabold text-secondary-container">
            <Sparkles className="w-4 h-4 text-secondary-spot" />
            <span>3종 진단 통합 알고리즘 매핑 결과</span>
          </div>

          <h2 className="text-headline-lg md:text-display-lg font-black text-white font-headline leading-tight">
            {report.title}
          </h2>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-sm text-white/95 font-body-md leading-relaxed">
            <strong className="text-secondary-container font-headline block mb-1">👑 홈화면 캐릭터 메인 오오라 칭호 부여: [{report.characterTitle}]</strong>
            "{report.characterAura}"
          </div>

          <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
            {report.strengths.map((st) => (
              <span key={st} className="bg-white text-primary text-xs font-headline font-black px-3 py-1 rounded-full shadow-sm">
                ✦ {st}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 z-10 flex flex-col items-center">
          <MascotAri pose="celebrate" size="lg" rotate={false} className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
          <span className="mt-3 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
            포트폴리오 영구 보관 중 ✓
          </span>
        </div>
      </Card>

      {/* 2-Column Details: Completed Assessments breakdown (Left) & AI Career Mapping (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card variant="activity" padding="md" className="shadow-3d-base border-surface-variant/40 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <h3 className="font-headline font-extrabold text-title-md text-text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>수행된 자기이해 진단 내역</span>
            </h3>
            <span className="text-xs font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              총 {assessments.length}과목
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {assessments.map((a) => (
              <div key={a.id} className="p-4 bg-surface-container-low rounded-2xl border border-surface-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-secondary-spot">
                  <span>● [{a.category}] 진단</span>
                  <span className="bg-white px-2 py-0.5 rounded border font-headline font-black text-text-primary">
                    {a.status === "완료됨" ? `${a.score}점 평가` : "미결"}
                  </span>
                </div>
                <strong className="font-headline font-bold text-base text-text-primary">{a.title}</strong>
                <p className="text-xs text-text-muted font-body-md leading-relaxed">{a.summary}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Col: AI Seotek Advice & Recommended Job Paths */}
        <div className="flex flex-col gap-6">
          <Card variant="activity" padding="md" className="bg-gradient-to-b from-point to-white border-primary/25 shadow-3d-ambient flex flex-col gap-4">
            <h3 className="font-headline font-extrabold text-title-md text-primary flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-secondary-spot" />
              <span>AI 커리어 파트너 Ari의 세특 적용 팁</span>
            </h3>

            <p className="text-sm font-body-md text-text-primary leading-relaxed bg-white p-5 rounded-2xl border border-surface-variant/40 shadow-inner whitespace-pre-line">
              {report.aiAdvice}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <span className="text-xs font-headline font-bold text-text-muted">🎯 이 진단 리포트 기반 AI 추천 직업 TOP 3</span>
              <div className="flex flex-col gap-2">
                {report.recommendedCareers.map((job, i) => (
                  <div key={job} className="flex items-center justify-between bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-variant/30 text-sm font-bold text-text-primary hover:border-primary/50 transition-colors">
                    <span>
                      <strong className="text-secondary mr-2">#{i + 1}</strong> {job}
                    </span>
                    <Link to="/roadmap" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                      로드맵 퀘스트 보기 &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card variant="surface" padding="md" className="bg-secondary-container/30 border border-secondary/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <strong className="text-sm font-bold text-text-primary block">포트폴리오 [자기성찰/진도] 탭 자동 연동</strong>
                <span className="text-xs text-text-muted block mt-0.5">
                  이 리포트는 담당 선생님께서 교사용 보드에서 실시간 열람하여 세특 기초자료로 인용할 수 있습니다.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
