import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, MascotAri, ProgressBar } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import {
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Brain,
  Compass,
  Award,
  FolderKanban,
  Edit2,
  RefreshCw,
  Star,
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session } = useAuth();

  const [visionStatement, setVisionStatement] = useState<string>(() => {
    return localStorage.getItem("readycareer_vision_v1") || "AI 역량과 따뜻한 공감 능력으로 교육 격차를 해소하는 4차 산업 융합 디렉터가 되겠다!";
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [interestedJobs, setInterestedJobs] = useState<Array<{ name: string; image: string; category: string }>>([]);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [newJobInput, setNewJobInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("my_interested_jobs");
    if (savedJobs) {
      try { setInterestedJobs(JSON.parse(savedJobs)); } catch (e) {}
    } else {
      setInterestedJobs([
        { name: "스마트 AI 에듀테크 진로 멘토", image: "👨‍🏫", category: "대표 관심 직업" },
        { name: "빅데이터 AI 모델 아키텍트", image: "📊", category: "AI·데이터" },
        { name: "3D XR 공간 인터랙티브 디자이너", image: "🎨", category: "아트·XR" },
      ]);
    }
  }, []);

  const handleSaveVision = () => {
    localStorage.setItem("readycareer_vision_v1", visionStatement);
    setIsEditingVision(false);
  };

  const handleAiSuggestVision = async () => {
    setIsAiLoading(true);
    const currentTarget = interestedJobs[selectedJobIdx]?.name || "AI 융합 디렉터";
    try {
      const res = await executeAiPrompt({
        promptType: "vision_recommendation",
        targetJob: currentTarget,
      });
      if (res.content && res.provider !== "expo-demo-fallback") {
        const cleaned = res.content.replace(/^["']|["']$/g, "").trim();
        setVisionStatement(cleaned);
        localStorage.setItem("readycareer_vision_v1", cleaned);
        setIsEditingVision(false);
        setIsAiLoading(false);
        return;
      }
    } catch (e) {
      console.warn("AI 비전 통신 불완전, 로컬 추천 풀로 진행합니다.", e);
    }

    const suggestions = [
      "인공지능과 데이터 가공 기법으로 사회적 취약계층을 보호하는 정의로운 테크 혁신가!",
      "따뜻한 공감 능력으로 교실 속 아이들의 잠재력을 깨우는 최고의 맞춤형 에듀테크 리더!",
      "과학 기술 고전과 첨단 로봇 공학을 아우르는 상상력 충만한 글로벌 창업 총괄 디렉터!",
    ];
    const randomOne = suggestions[Math.floor(Math.random() * suggestions.length)];
    setVisionStatement(randomOne);
    localStorage.setItem("readycareer_vision_v1", randomOne);
    setIsEditingVision(false);
    setIsAiLoading(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobInput.trim()) return;
    const added = [{ name: newJobInput.trim(), image: "🌟", category: "직접 추가" }, ...interestedJobs];
    setInterestedJobs(added);
    setSelectedJobIdx(0);
    localStorage.setItem("my_interested_jobs", JSON.stringify(added));
    setNewJobInput("");
  };

  const currentJob = interestedJobs[selectedJobIdx] || { name: "AI 융합 개척자", image: "🤖", category: "탐색 중" };
  const userName = session?.name || "김수진";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* =========================================================================
          SECTION 1: Hero Welcome & Character (우아하고 시각적인 상단 환영 영역)
         ========================================================================= */}
      <div className="p-8 md:p-10 rounded-3xl bg-surface-container-lowest border border-surface-variant/60 shadow-3d-base grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Info & Vision Statement */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-headline font-black bg-primary text-on-primary px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>★ 대표 꿈: {currentJob.name}</span>
              </span>
              <span className="text-xs font-bold text-text-muted bg-surface-container px-3 py-1 rounded-full border border-surface-variant/40">
                {session?.school || "서울창의고등학교"} · {session?.grade || 2}학년 {session?.classNo || 4}반
              </span>
              <span className="text-xs font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                RIASEC: {session?.riasecCode || "SI"} 유형
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-headline font-black text-text-primary tracking-tight leading-tight">
              <span className="text-primary">{userName}</span>님, 오늘도 힘찬<br />
              진로 여정을 시작해 볼까요?
            </h1>
          </div>

          {/* Vision Statement Quote */}
          <div className="p-5 rounded-2xl bg-surface-container border border-surface-variant/50 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-headline font-black text-secondary-spot flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>나의 맞춤 비전 선언문 (Vision Statement)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiSuggestVision}
                  disabled={isAiLoading}
                  className="text-[11px] font-headline font-extrabold px-2.5 py-1 rounded-lg bg-secondary text-white hover:bg-secondary-spot transition-colors shadow-sm flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isAiLoading ? "animate-spin" : ""}`} />
                  <span>AI 추천받기</span>
                </button>
                <button
                  onClick={() => setIsEditingVision(!isEditingVision)}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors p-1"
                  title="직접 문구 수정하기"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isEditingVision ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-xl border border-primary text-sm bg-white font-body-md text-text-primary focus:outline-none"
                />
                <Button variant="primary" size="sm" onClick={handleSaveVision}>
                  저장
                </Button>
              </div>
            ) : (
              <p className="text-sm md:text-base font-headline font-extrabold text-text-primary italic leading-relaxed">
                "{visionStatement}"
              </p>
            )}
          </div>
        </div>

        {/* Right Mascot & Level Progress */}
        <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b from-primary/5 to-surface-container border border-surface-variant/40 shadow-inner">
          <MascotAri pose="celebrate" size="md" rotate={true} />
          <div className="mt-3 space-y-2 w-full">
            <span className="text-xs font-headline font-black text-secondary uppercase tracking-wider block">
              아리 캐릭터 성장 지수
            </span>
            <strong className="text-lg font-headline font-black text-text-primary block">
              Lv.05 중급 프로그래머
            </strong>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold text-text-muted">
                <span>진행도</span>
                <span className="text-primary font-extrabold">84%</span>
              </div>
              <ProgressBar value={84} max={100} variant="teal" />
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 2: Core Career Navigator (깔끔한 4대 핵심 활동 카드)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-surface-variant/40 pb-4">
          <div>
            <span className="text-xs font-headline font-black text-primary uppercase tracking-wider block mb-1">
              READYCAREER HUB
            </span>
            <h2 className="text-2xl font-headline font-black text-text-primary">
              나의 핵심 진로 탐색 메뉴
            </h2>
          </div>
          <span className="text-xs text-text-muted">원하는 탭을 클릭하여 즉각 주도적인 진로 활동을 이어나가세요.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* CARD 1: AI 자기이해 */}
          <Link to="/self-understanding">
            <Card variant="surface" padding="lg" className="border-2 border-surface-variant/60 hover:border-primary transition-all duration-200 h-full flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-black text-text-primary group-hover:text-primary transition-colors">
                    AI 자기이해 진단
                  </h3>
                  <p className="text-xs text-text-muted font-body-md mt-1 leading-relaxed">
                    6유형 RIASEC 강제선택 흥미유형 및 다중 역량 리포트 열람
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-surface-variant/30 flex items-center justify-between text-xs font-headline font-bold text-primary">
                <span>진단 및 리포트 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* CARD 2: 50일 습관 관리 */}
          <Link to="/habits">
            <Card variant="surface" padding="lg" className="border-2 border-surface-variant/60 hover:border-secondary transition-all duration-200 h-full flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-black text-text-primary group-hover:text-secondary transition-colors">
                    50일 습관 챌린지
                  </h3>
                  <p className="text-xs text-text-muted font-body-md mt-1 leading-relaxed">
                    매일 실천하는 알고리즘 및 진로 탐색 꾸준함 출석 스트릭
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-surface-variant/30 flex items-center justify-between text-xs font-headline font-bold text-secondary">
                <span>습관 체커 가동 (14일차)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* CARD 3: 별자리 로드맵 */}
          <Link to="/roadmap">
            <Card variant="surface" padding="lg" className="border-2 border-surface-variant/60 hover:border-primary transition-all duration-200 h-full flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center border border-surface-variant group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-black text-text-primary group-hover:text-primary transition-colors">
                    별자리 로드맵
                  </h3>
                  <p className="text-xs text-text-muted font-body-md mt-1 leading-relaxed">
                    꿈을 향한 학업 퀘스트 해금 및 전공 맞춤 로드맵 확인
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-surface-variant/30 flex items-center justify-between text-xs font-headline font-bold text-primary">
                <span>로드맵 지도 열기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* CARD 4: 진로 포트폴리오 DB */}
          <Link to="/portfolio">
            <Card variant="surface" padding="lg" className="border-2 border-surface-variant/60 hover:border-secondary transition-all duration-200 h-full flex flex-col justify-between group shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-6 h-6 text-secondary-spot" />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-black text-text-primary group-hover:text-secondary-spot transition-colors">
                    진로 포트폴리오
                  </h3>
                  <p className="text-xs text-text-muted font-body-md mt-1 leading-relaxed">
                    독서, 동아리, 세특 소재 및 학업 결과물 누적 저장고
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-surface-variant/30 flex items-center justify-between text-xs font-headline font-bold text-secondary-spot">
                <span>내 포트폴리오 DB</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Interested Jobs (나만의 관심직업 리스트 & 직각 직접 입력)
         ========================================================================= */}
      <Card variant="surface" padding="lg" className="border border-surface-variant/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/40 pb-4">
          <div>
            <h3 className="text-lg font-headline font-black text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>나의 관심 직업군 관리</span>
            </h3>
            <p className="text-xs text-text-muted font-body-md mt-0.5">
              클릭(선택)하는 순간 즉시 상단의 대표 지망 직업으로 적용됩니다. 자유롭게 새로운 직업을 추가해 보세요!
            </p>
          </div>

          {/* Add Job Form Bar */}
          <form onSubmit={handleAddJob} className="flex items-center gap-2 max-w-sm w-full">
            <input
              type="text"
              placeholder="예: 3D AI 인터페이스 설계자..."
              value={newJobInput}
              onChange={(e) => setNewJobInput(e.target.value)}
              className="flex-grow text-xs px-3.5 py-2.5 rounded-xl bg-surface-container border border-surface-variant text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-body-md"
            />
            <Button type="submit" variant="teal" size="sm" className="whitespace-nowrap font-headline font-bold">
              <Plus className="w-4 h-4 mr-1" />
              직업 추가
            </Button>
          </form>
        </div>

        {/* Interested Jobs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interestedJobs.map((job, idx) => {
            const isSelected = selectedJobIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedJobIdx(idx)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-secondary/15 border-secondary shadow-md scale-[1.02]"
                    : "bg-surface-container-low border-surface-variant/50 hover:bg-surface-container hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{job.image}</span>
                  <div>
                    <strong className="text-sm font-headline font-black text-text-primary block">
                      {job.name}
                    </strong>
                    <span className="text-[11px] text-text-muted font-bold">
                      {isSelected ? "⭐ 대표 직업 선택됨" : job.category}
                    </span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
export default HomeDashboard;
