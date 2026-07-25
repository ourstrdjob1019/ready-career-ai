import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, MascotAri, ProgressBar } from "../components";
import { useAuth, useSelfUnderstanding } from "../context";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Plus,
  CheckCircle2,
  Lock,
  MessageSquareQuote,
  Target,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session, isExpoDemoMode } = useAuth();
  const { report } = useSelfUnderstanding();

  const [visionStatement, setVisionStatement] = useState<string>(() => {
    return localStorage.getItem("readycareer_vision_v1") || "AI 역량과 따뜻한 공감 능력으로 교육 격차를 해소하는 4차 산업 융합 디렉터가 되겠다!";
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [interestedJobs, setInterestedJobs] = useState<Array<{ name: string; image: string; category: string }>>([]);
  const [jobCarouselIdx, setJobCarouselIdx] = useState(0);
  const [newJobInput, setNewJobInput] = useState("");

  useEffect(() => {
    const savedJobs = localStorage.getItem("my_interested_jobs");
    if (savedJobs) {
      try { setInterestedJobs(JSON.parse(savedJobs)); } catch (e) {}
    } else {
      setInterestedJobs([
        { name: "스마트 AI 에듀테크 진로 멘토", image: "👨‍🏫", category: "대표 관심 직업" },
        { name: "빅데이터 AI 모델 아키텍트", image: "📊", category: "AI·데이터" },
        { name: "3D XR 공간 인터랙션 디자이너", image: "🎨", category: "아트·XR" },
      ]);
    }
  }, []);

  const handleSaveVision = () => {
    localStorage.setItem("readycareer_vision_v1", visionStatement);
    setIsEditingVision(false);
  };

  const handleAiSuggestVision = () => {
    const suggestions = [
      "인공지능과 데이터 가공 기법으로 사회적 취약계층을 보호하는 정의로운 테크 혁신가!",
      "따뜻한 공감 능력으로 교실 속 아이들의 잠재력을 깨우는 최고의 맞춤형 에듀테크 리더!",
      "과학 기술 고전과 첨단 로봇 공학을 아우르는 상상력 충만한 글로벌 창업 총괄 디렉터!",
    ];
    const randomOne = suggestions[Math.floor(Math.random() * suggestions.length)];
    setVisionStatement(randomOne);
    localStorage.setItem("readycareer_vision_v1", randomOne);
    setIsEditingVision(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobInput.trim()) return;
    const added = [{ name: newJobInput.trim(), image: "🌟", category: "직접 추가" }, ...interestedJobs];
    setInterestedJobs(added);
    localStorage.setItem("my_interested_jobs", JSON.stringify(added));
    setNewJobInput("");
  };

  const currentJob = interestedJobs[jobCarouselIdx % (interestedJobs.length || 1)] || { name: "AI 융합 개척자", image: "🤖", category: "탐색 중" };
  const userName = session?.name || "김수진";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Expo Demo Badge if Active */}
      {isExpoDemoMode && (
        <div className="p-3 bg-secondary/15 border-2 border-secondary/40 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
          <span className="text-xs md:text-sm font-headline font-extrabold text-secondary flex items-center gap-2">
            <span>🎪 2026 교육박람회 시연 세션 가동 중 — 1초 만렙 데이터 및 학교관리자 연계 샘플 장착됨!</span>
          </span>
          <Link to="/start" className="text-xs font-black bg-secondary text-white px-3 py-1 rounded-xl shadow">
            모드/역할 스위처 &rarr;
          </Link>
        </div>
      )}

      {/* TOP: Gamification Level Banner & Job Badge (§7.4 상단) */}
      <Card variant="surface" padding="md" className="border-2 border-primary/30 shadow-3d-base bg-gradient-to-r from-surface-container-lowest via-point/20 to-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-3xl flex items-center justify-center border-2 border-secondary/30 shadow-inner">
            {currentJob.image}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-headline font-black bg-primary text-on-primary px-2.5 py-0.5 rounded-full">
                ★ {currentJob.name} 지망생
              </span>
              <span className="text-xs font-bold text-text-muted">| 소속: {session?.school || "서울창의고등학교"}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-headline font-black text-text-primary mt-1">
              {userName}의 진로 여행 · <span className="text-secondary font-extrabold">Lv.05 (중급 프로그래머)</span>
            </h2>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="w-full md:w-72 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-headline font-bold">
            <span className="text-text-muted">다음 캐릭터 외형 해금까지</span>
            <span className="text-primary font-black">EXP 420 / 500 (84%)</span>
          </div>
          <ProgressBar value={84} max={100} variant="teal" />
        </div>
      </Card>

      {/* CENTER WORKSPACE: Left Stack, Central Character Avatar, Right Carousel (§7.4 좌측/중앙/우측) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT BUTTON STACK (§7.4 & §11-D: AI, 코딩, 진로탐색(미정/비활성), AI멘토(미정/비활성)) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <span className="text-xs font-headline font-black text-text-muted px-2 uppercase tracking-wider">
            ⚡ 퀵 스택 어셈블
          </span>

          <Link to="/self-understanding">
            <button className="w-full p-4 rounded-3xl bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 font-headline font-black text-left flex items-center justify-between shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black">AI</span>
                <span>AI 자기이해 스튜디오</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link to="/activity-form">
            <button className="w-full p-4 rounded-3xl bg-secondary/10 hover:bg-secondary/20 text-secondary border-2 border-secondary/30 font-headline font-black text-left flex items-center justify-between shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center font-black">💻</span>
                <span>코딩·세특 활동 기록</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          {/* Placeholder 1 (§11-D 데모용) */}
          <button
            disabled
            className="w-full p-4 rounded-3xl bg-surface-container text-text-muted border border-surface-variant/40 font-headline font-bold text-left flex items-center justify-between cursor-not-allowed opacity-75"
            title="박람회 시연 이후 정식 업데이트 예정"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-surface text-text-muted flex items-center justify-center">🔍</span>
              <span>진로 심층 탐색관 (🔜)</span>
            </div>
            <Lock className="w-4 h-4 text-text-muted" />
          </button>

          {/* Placeholder 2 (§11-D 데모용) */}
          <button
            disabled
            className="w-full p-4 rounded-3xl bg-surface-container text-text-muted border border-surface-variant/40 font-headline font-bold text-left flex items-center justify-between cursor-not-allowed opacity-75"
            title="박람회 시연 이후 정식 업데이트 예정"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-surface text-text-muted flex items-center justify-center">🤝</span>
              <span>명문 멘토 매칭 라운지 (🔜)</span>
            </div>
            <Lock className="w-4 h-4 text-text-muted" />
          </button>

          <Link to="/habits" className="mt-2 block">
            <Card variant="surface" padding="sm" className="border-secondary/30 bg-secondary/5 text-center p-3 shadow-sm hover:scale-[1.02] transition-transform">
              <span className="text-xs font-headline font-black text-secondary-spot flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-secondary-spot animate-bounce" /> 50일 습관 챌린지 현재 12일차! &rarr;
              </span>
            </Card>
          </Link>
        </div>

        {/* CENTER CHARACTER AVATAR (§7.4 중앙) */}
        <Card variant="hero" padding="lg" className="lg:col-span-5 shadow-3d-ambient bg-gradient-to-t from-surface-container-low to-surface-container-lowest flex flex-col items-center text-center justify-between min-h-[400px] relative border border-surface-variant/50">
          <div className="space-y-1 z-10">
            <Chip size="sm" variant="teal" className="font-extrabold uppercase">
              {report ? `👑 ${report.characterTitle}` : "🌟 2026 AI 개별 커리어리스트"}
            </Chip>
            <h3 className="text-2xl font-headline font-black text-text-primary">
              아리(Ari)와 커리어 동행
            </h3>
          </div>

          <div className="my-6 transform hover:scale-105 transition-transform duration-300">
            <MascotAri
              pose={report ? "celebrate" : "avatar"}
              size="lg"
              rotate={false}
              bubbleTitle={report ? report.characterTitle : "Ari의 오늘의 황금 팁"}
              bubbleMessage={
                report
                  ? report.characterAura
                  : "별자리 로드맵에서 한입 퀘스트를 완료하면 경험치와 멋진 캐릭터 장착 뱃지를 받을 수 있어요!"
              }
            />
          </div>

          <div className="w-full pt-4 border-t border-surface-variant/40 flex items-center justify-between text-xs font-headline font-extrabold text-text-primary">
            <span className="text-primary font-black">직업 상태: 중급 프로그래머</span>
            <Link to="/roadmap" className="text-secondary hover:underline font-black">
              ★ 별자리 퀘스트 계속하기 &rarr;
            </Link>
          </div>
        </Card>

        {/* RIGHT JOB CAROUSEL & CUSTOM ADD (§7.4 우측: +관심직업 추가, 좌우 스와이프) */}
        <Card variant="surface" padding="md" className="lg:col-span-4 border border-surface-variant/60 shadow-3d-base space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-headline font-black text-text-primary flex items-center gap-1.5">
                <Target className="w-4 h-4 text-secondary" /> 관심 직업군 슬라이더
              </span>
              <span className="text-[11px] font-bold text-text-muted">
                {jobCarouselIdx % (interestedJobs.length || 1) + 1} / {interestedJobs.length}
              </span>
            </div>

            {/* Swipeable Job Card Display */}
            <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-variant/50 text-center space-y-4 shadow-inner relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white flex items-center justify-center text-4xl shadow-md">
                {currentJob.image}
              </div>
              <div>
                <span className="text-[10px] font-headline font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                  {currentJob.category}
                </span>
                <h4 className="text-lg font-headline font-black text-text-primary mt-1.5">
                  {currentJob.name}
                </h4>
              </div>

              {/* Left/Right Swipe Controllers */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setJobCarouselIdx((prev) => (prev > 0 ? prev - 1 : (interestedJobs.length - 1)))}
                  className="p-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-text-primary font-black shadow-sm"
                  aria-label="이전 직업"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <Link to="/roadmap">
                  <Button variant="outline" size="sm" className="text-xs font-bold py-1 px-3">
                    이 직업 로드맵 생성 &rarr;
                  </Button>
                </Link>
                <button
                  onClick={() => setJobCarouselIdx((prev) => prev + 1)}
                  className="p-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-text-primary font-black shadow-sm"
                  aria-label="다음 직업"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Custom Job Form */}
          <div className="pt-3 border-t border-surface-variant/40 space-y-2">
            <span className="text-[11px] font-headline font-extrabold text-text-muted block">
              + 나만의 관심 직업 실시간 추가 (좌우 스와이프 등록)
            </span>
            <form onSubmit={handleAddJob} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="새 직업명 직접 입력..."
                value={newJobInput}
                onChange={(e) => setNewJobInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-surface-container-lowest border border-surface-variant/60 rounded-xl text-xs font-body-md text-text-primary focus:ring-2 focus:ring-primary shadow-inner"
              />
              <button type="submit" className="p-2.5 rounded-xl bg-secondary text-white text-xs font-extrabold hover:bg-secondary-spot transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </Card>
      </div>

      {/* BOTTOM: VISION STATEMENT BAR (§7.4 하단 & §11-E: 나의 비전선언문 입력/예시 제안) */}
      <Card variant="activity" padding="md" className="border-2 border-secondary/40 shadow-3d-ambient bg-gradient-to-r from-point via-white to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black flex-shrink-0 shadow-md">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-headline font-black text-secondary-spot uppercase">
                📜 My Career Vision Statement
              </span>
              <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-bold">
                생기부 행특/진로 인용문
              </span>
            </div>

            {isEditingVision ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  className="w-full px-4 py-2 bg-white border-2 border-secondary rounded-2xl text-sm font-headline font-black text-text-primary shadow-inner focus:outline-none"
                />
                <Button variant="secondary" size="sm" onClick={handleSaveVision} className="font-black whitespace-nowrap">
                  저장
                </Button>
              </div>
            ) : (
              <h4
                onClick={() => setIsEditingVision(true)}
                className="text-lg md:text-xl font-headline font-black text-text-primary cursor-pointer hover:text-primary transition-colors leading-relaxed"
                title="클릭하여 자유롭게 수정해 보세요!"
              >
                "{visionStatement}" <small className="text-xs text-text-muted font-bold ml-1">(✏️ 터치하여 편집)</small>
              </h4>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleAiSuggestVision}
            className="px-4 py-2.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-text-primary text-xs font-headline font-black flex items-center gap-1.5 transition-all shadow-sm"
            title="AI 아리가 추천하는 근사한 비전선언문 자동 변환"
          >
            <Sparkles className="w-4 h-4 text-secondary-spot animate-pulse" />
            <span>AI 비전 문구 제안받기</span>
          </button>
          <Button variant="teal" size="sm" onClick={() => setIsEditingVision(!isEditingVision)} className="font-extrabold">
            {isEditingVision ? "취소" : "직접 입력"}
          </Button>
        </div>
      </Card>

      {/* Navigation Footer to 4 Core Tabs */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-headline-md font-headline font-black text-text-primary">
            🚀 하단 4대 탭 메인 워크플로우
          </h3>
          <span className="text-xs font-bold text-text-muted">어디서든 한 번의 터치로 전환 가능합니다.</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/" className="p-4 rounded-3xl bg-primary text-on-primary font-headline font-extrabold flex items-center justify-between shadow-md">
            <span>🏠 1. 홈 대시보드</span>
            <CheckCircle2 className="w-4 h-4" />
          </Link>
          <Link to="/roadmap" className="p-4 rounded-3xl bg-surface-container-low hover:bg-surface-container text-text-primary font-headline font-extrabold flex items-center justify-between border border-surface-variant/50 transition-all">
            <span>🌌 2. 별자리 로드맵</span>
            <ArrowRight className="w-4 h-4 text-secondary" />
          </Link>
          <Link to="/habits" className="p-4 rounded-3xl bg-surface-container-low hover:bg-surface-container text-text-primary font-headline font-extrabold flex items-center justify-between border border-surface-variant/50 transition-all">
            <span>🔥 3. 습관&amp;목표 관리</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
          <Link to="/portfolio" className="p-4 rounded-3xl bg-surface-container-low hover:bg-surface-container text-text-primary font-headline font-extrabold flex items-center justify-between border border-surface-variant/50 transition-all">
            <span>🏆 4. 진로 포트폴리오</span>
            <ArrowRight className="w-4 h-4 text-secondary-spot" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomeDashboard;
