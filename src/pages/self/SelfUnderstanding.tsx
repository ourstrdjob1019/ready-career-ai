import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, ProgressBar, MascotAri } from "../../components";
import { useSelfUnderstanding, useAuth } from "../../context";
import { Sparkles, Brain, CheckCircle2, ArrowRight, ShieldCheck, Zap, Award, Target } from "lucide-react";

export const SelfUnderstanding: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, report, generateComprehensiveReport } = useSelfUnderstanding();
  const { session, startExpoDemo } = useAuth();

  const [selectedJob, setSelectedJob] = useState<string>(session?.targetJob || "AI 융합 소프트웨어 디렉터");

  const completedCount = assessments.filter((a) => a.status === "완료됨").length;
  const totalCount = assessments.length;
  const isAllCompleted = completedCount === totalCount;

  const recommendedJobs = [
    { title: "AI 융합 소프트웨어 디렉터", cluster: "인공지능·공학", match: "SI 사회·탐구형 매핑 99%", desc: "인간 중심의 따뜻한 인공지능 서비스를 기획하고 핵심 소프트웨어를 총괄 설계하는 미래 핵심 직업" },
    { title: "스마트 바이오 헬스 데이터 과학자", cluster: "바이오·메디컬", match: "탐구·논리 분석 지능 매핑 97%", desc: "유전체 정보와 생체 데이터를 AI 로 알고리즘 분석하여 정밀 의료 및 무병장수 시대를 선도하는 전문가" },
    { title: "가상·증강현실 혁신 크리에이터", cluster: "문화 콘텐츠·디자인", match: "시각·공간 감각 매핑 96%", desc: "메타버스, 초실감 혼합현실(XR) 몰입 공간과 스토리텔링을 3D 그래픽으로 창조해 내는 아티스트" },
    { title: "친환경 탄소중립 ESG 컨설턴트", cluster: "사회서비스·교육", match: "대인·공감 소통 리더십 95%", desc: "글로벌 기후 위기와 친환경 경영 전략을 수립하고 사회적 도약을 이끄는 전략 컨설턴트" },
    { title: "AI 금융 핀테크 프로그래머", cluster: "경제·금융 비즈니스", match: "수리·직관 알고리즘 95%", desc: "빅데이터와 양자 컴퓨팅 기반의 인공지능 자동 투자 알고리즘 및 보안 금융 인프라를 구축하는 엔지니어" },
    { title: "차세대 반도체 및 양자역학 연구원", cluster: "기초과학·연구", match: "고밀도 학업 몰입 루틴 94%", desc: "초지능 시대의 물적 뼈대가 되는 신경망 반도체와 양자 센싱 원천 기술을 개발하는 핵심 과학자" },
  ];

  const handleQuickTakeTest = (id: string) => {
    if (id === "test-interest") {
      navigate("/interest-test");
    } else if (id === "test-intelligence") {
      navigate("/intelligence-test");
    } else if (id === "test-learning") {
      navigate("/learning-test");
    }
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem("readycareer_selected_job", JSON.stringify(selectedJob));
    startExpoDemo("student", {
      ...session,
      targetJob: selectedJob
    });
    navigate("/");
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
            포트폴리오와 맞춤 별자리 로드맵의 기초는 <strong>나에 대한 3종 진단 검사</strong>입니다.<br />
            아래 3개의 네모박스 검사를 모두 완수하면 <strong>나만의 AI 추천 직업군 선택 화면</strong>이 즉시 해금되어 대시보드로 이어집니다!
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
              <span>진도 완결 수치 100% 달성하기</span>
              <span className="text-primary font-black">{completedCount}/{totalCount} 완료</span>
            </div>
            <ProgressBar value={completedCount} max={totalCount} variant="teal" />
          </div>
        </div>

        <div className="absolute -left-10 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* Onboarding Guide Banner when not all completed */}
      {/* Onboarding Guide Banner when not all completed */}
      {!isAllCompleted && (
        <div className="bg-gradient-to-r from-secondary-container/30 via-primary-container/20 to-surface-container p-4 md:p-6 rounded-[28px] border-2 border-secondary/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3 text-left">
            <span className="text-3xl">📢</span>
            <div>
              <h3 className="font-headline font-black text-sm md:text-base text-text-primary">
                신규 온보딩 필수 과제: 3대 진단 검사 및 정밀 리포트 획득을 완료해 주세요!
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                흥미무드(RIASEC) · 다중지능(16문항) · 학습스타일(16문항) 3가지 네모박스 검사를 모두 마쳐야 종합 추천 직업 6선이 열리며, 이를 선택해야 대시보드의 별자리 로드맵을 작성할 수 있습니다.
              </p>
            </div>
          </div>
          <span className="bg-primary text-white font-extrabold text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-md">
            현재 {completedCount}/3 완료 ({3 - completedCount}개 남음)
          </span>
        </div>
      )}

      {/* 🌟 3종 진단 완수 시 최상단 즉시 표출: 3개 진단 종합 분석 맞춤 추천 직업 6선 선택 허브 */}
      {isAllCompleted && (
        <section className="bg-gradient-to-b from-[#1A1626] via-[#241E36] to-[#1A1626] rounded-[36px] p-8 md:p-10 border-4 border-[#7B5CF0] shadow-[0_25px_60px_rgba(123,92,240,0.35)] space-y-8 animate-fadeIn text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7B5CF0]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#006970]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/15 pb-6 relative z-10">
            <div className="space-y-2">
              <span className="text-xs font-black bg-gradient-to-r from-teal-400 to-purple-400 text-[#1A1626] px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider font-headline shadow-lg">
                <Award className="w-4 h-4 text-[#1A1626] animate-bounce" /> 3개 진단 검사(흥미·다중지능·학습스타일) 100% 종합 완료!
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tight text-white flex items-center gap-2">
                <span>🎯 3대 진단 종합 결과 기반 &apos;나만의 추천 관심 직업 6선&apos;</span>
              </h2>
              <p className="text-xs md:text-sm text-white/80 max-w-3xl leading-relaxed">
                회원님이 완수한 <strong>[1] 진로흥미검사</strong> + <strong>[2] 다중지능검사(16문항)</strong> + <strong>[3] 학습스타일 검사(16문항)</strong> 데이터 알고리즘을 종합 분석하여, 미래 입시 및 사회에서 가장 성공 확률이 높은 6개 맞춤 직업군을 추출했습니다.
              </p>
            </div>
            <div className="bg-white/10 px-5 py-3.5 rounded-2xl border border-white/20 text-center md:text-right flex flex-col justify-center shrink-0 shadow-inner">
              <span className="text-[11px] text-teal-300 font-bold whitespace-nowrap">✔ 현재 선택된 목표 직업</span>
              <span className="text-lg font-black text-[#7AF1FC] font-headline">{selectedJob}</span>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-sm sm:text-base font-black text-yellow-300 flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
              <Target className="w-5 h-5 text-yellow-300 flex-shrink-0 animate-pulse" />
              <span>아래 6대 맞춤 추천 직업 중 나에게 가장 설레는 꿈을 1개 선택(터치)하신 후, 하단 대시보드 이동 버튼을 눌러주세요!</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedJobs.map((job) => {
                const isSelected = selectedJob === job.title;
                return (
                  <div
                    key={job.title}
                    onClick={() => setSelectedJob(job.title)}
                    className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-gradient-to-tr from-[#7B5CF0]/50 to-[#006970]/60 border-[#7AF1FC] shadow-[0_0_30px_rgba(122,241,252,0.5)] scale-[1.03] ring-2 ring-[#7AF1FC]/40"
                        : "bg-white/5 border-white/15 hover:border-white/40 hover:bg-white/10 hover:scale-[1.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#7AF1FC]/20 text-[#7AF1FC] border border-[#7AF1FC]/30 whitespace-nowrap">
                          {job.cluster}
                        </span>
                        <span className="text-[11px] font-black text-emerald-300 whitespace-nowrap bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                          ⚡ 3종 합산 일치도
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-headline font-black text-white group-hover:text-[#7AF1FC] transition-colors mb-2">
                        {job.title}
                      </h4>
                      <p className="text-xs text-white/75 leading-relaxed">
                        {job.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                      <span className={`text-[12px] font-black ${isSelected ? "text-yellow-300" : "text-white/60"}`}>
                        {isSelected ? "✨ 내 목표 직업으로 최종 확정됨!" : "👆 터치하여 내 관심직업으로 선택"}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm shadow-md ${
                        isSelected ? "bg-[#7AF1FC] text-[#1A1626]" : "bg-white/20 text-white"
                      }`}>
                        {isSelected ? "✓" : "+"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 p-6 rounded-[28px] border border-white/25 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-2xl">
            <div className="flex items-center gap-4 text-left">
              <MascotAri pose="celebrate" size="sm" />
              <div>
                <h4 className="font-headline font-black text-lg text-white">
                  &ldquo;축하해요! 3대 진단을 완수하고 &apos;{selectedJob}&apos; 꿈 좌표를 확정했습니다!&rdquo;
                </h4>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  이제 대시보드로 출항하면 선택하신 <strong>[{selectedJob}]</strong> 직종에 100% 특화된 별자리 커리어 로드맵과 50일 습관&목표, 학급 포트폴리오 누적 관리가 완벽히 개장됩니다.
                </p>
              </div>
            </div>
            <Button
              variant="teal"
              size="lg"
              onClick={handleFinishOnboarding}
              className="font-headline font-black text-base sm:text-lg py-5 px-10 whitespace-nowrap shadow-[0_10px_30px_rgba(0,184,168,0.7)] hover:scale-105 transition-all duration-300 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-900 rounded-2xl border border-white/40"
              icon={<ArrowRight className="w-6 h-6 ml-1 text-slate-900" />}
            >
              🚀 6선 중 관심 직업 선택 완료! 대시보드로 이동하기
            </Button>
          </div>
        </section>
      )}

      {/* 3 Core Self-Understanding Assessments List (네모박스) */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-headline-md font-headline font-extrabold text-text-primary flex items-center gap-2">
              <span>🔬 3대 핵심 자기이해 AI 진단 시리즈 (네모박스 뷰)</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">각 네모박스를 클릭하여 검사 및 리포트 열람을 마치면 &apos;완료됨&apos;으로 전환됩니다.</p>
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
                    {isCompleted ? `● 검사일: ${item.completedAt}` : "● 필수 16문항 진단"}
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
