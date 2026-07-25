import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, MascotAri } from "../components";
import { Sparkles, Star, Compass, CheckCircle2, Trophy, ArrowUpRight, Lock, Plus } from "lucide-react";

interface RoadmapNode {
  id: string;
  stage: string;
  title: string;
  desc: string;
  status: "completed" | "active" | "locked";
  points: number;
  category: string;
  dueDate?: string;
}

export const StarRoadmap: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  
  const categories = ["전체 보기", "교과 활동", "창의적체험활동", "독서·동아리", "대대회 및 자격"];

  const nodes: RoadmapNode[] = [
    {
      id: "node-1",
      stage: "1단계 • 1학기 초반",
      title: "AI와 미래 산업 기초 도서 3권 읽고 독후 감상문 릴레이",
      desc: "인공지능 윤리와 기본 구조에 관한 도서를 선정하여 읽고, 세부 능력 및 특기사항 기초 자료로 저장합니다.",
      status: "completed",
      points: 150,
      category: "독서·동아리",
      dueDate: "완료됨 (04.12)"
    },
    {
      id: "node-2",
      stage: "2단계 • 1학기 중간고가 이후",
      title: "교내 과학탐구 토론 대회 '기후위기와 자율주행' 참가",
      desc: "팀을 구성하여 실무 데이터를 시각화하고 자율주행 시스템이 환경에 미치는 긍정적 효과를 제고합니다.",
      status: "active",
      points: 300,
      category: "창의적체험활동",
      dueDate: "진행 중 (D-14)"
    },
    {
      id: "node-3",
      stage: "3단계 • 여름방학 프로젝트",
      title: "파이썬 기반 오픈소스 데이터 분석 스터디 및 프로젝트 완료",
      desc: "간단한 데이터셋(기상청 DB 등)을 정렬하고 유의미한 결론을 내리는 보고서 1건 작성.",
      status: "locked",
      points: 500,
      category: "교과 활동",
      dueDate: " 예정됨 (07.20~)"
    },
    {
      id: "node-4",
      stage: "4단계 • 2학기 최종",
      title: "진로 포트폴리오 통합 제출 및 교사 가이드 일치 평가",
      desc: "1년 동안 축적된 별자리 퀘스트 및 활동 내용을 3D 포트폴리오 형태로 종합 변환.",
      status: "locked",
      points: 800,
      category: "대대회 및 자격",
      dueDate: " 11월 예정"
    }
  ];

  const filteredNodes = selectedCategory === "전체 보기" 
    ? nodes 
    : nodes.filter(n => n.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-surface-variant/40">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-headline font-black mb-2">
            <Compass className="w-4 h-4" />
            <span>나만의 3D 맞춤 진로 내비게이션</span>
          </div>
          <h1 className="text-headline-lg md:text-display-lg font-extrabold text-text-primary font-headline">
            별자리 로드맵
          </h1>
          <p className="text-body-md text-text-muted max-w-2xl mt-1">
            직업 선택 결과에 맞춰 AI가 생성한 학기별 성향 퀘스트를 하나씩 밝혀보세요! 
            모든 별을 연동하면 나만의 빛나는 진로 포트폴리오가 완성됩니다.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface-container-low px-6 py-4 rounded-3xl border border-surface-variant/30 flex-shrink-0">
          <MascotAri pose="roadmap" size="sm" rotate={false} />
          <div className="flex flex-col">
            <span className="text-[11px] text-text-muted font-extrabold uppercase tracking-wide">누적 진로 별빛 포인트</span>
            <span className="text-2xl font-headline font-black text-primary">450 <small className="text-sm font-semibold text-text-primary">STAR</small></span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2">
        {categories.map((cat) => (
          <Chip
            key={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "default" : "teal"}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Constellation Nodes Timeline Grid */}
      <div className="relative flex flex-col gap-6 pl-4 md:pl-8 before:content-[''] before:absolute before:left-[31px] md:before:left-[47px] before:top-6 before:bottom-6 before:w-1.5 before:bg-gradient-to-b before:from-primary/60 before:via-secondary/50 before:to-surface-variant/50 before:rounded-full">
        {filteredNodes.map((node) => {
          const isCompleted = node.status === "completed";
          const isActive = node.status === "active";
          
          return (
            <div key={node.id} className="relative flex items-start gap-6 md:gap-8 group">
              {/* Timeline Indicator Circle */}
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                isCompleted 
                  ? "bg-primary border-surface-container-lowest shadow-3d-base text-white" 
                  : isActive
                    ? "bg-secondary border-surface-container-lowest shadow-3d-ambient text-white animate-pulse"
                    : "bg-surface-variant border-white text-text-muted"
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : isActive ? <Star className="w-5 h-5 fill-white" /> : <Lock className="w-4 h-4" />}
              </div>

              {/* Node Content Card */}
              <Card 
                variant={isActive ? "interactive" : isCompleted ? "activity" : "surface"} 
                padding="md" 
                hoverEffect={!isCompleted}
                className={`flex-grow border-2 transition-all ${
                  isActive 
                    ? "border-secondary shadow-3d-ambient bg-white" 
                    : isCompleted 
                      ? "border-primary/20 bg-surface-container-lowest opacity-90" 
                      : "border-surface-variant/30 bg-surface-container/50 opacity-70"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold ${
                        isCompleted ? "bg-primary/15 text-primary" : isActive ? "bg-secondary text-white font-black" : "bg-surface-variant text-text-muted"
                      }`}>
                        {node.stage}
                      </span>
                      <span className="text-text-muted text-xs font-semibold">|</span>
                      <span className="text-secondary-spot text-xs font-extrabold">#{node.category}</span>
                    </div>

                    <h3 className={`text-headline-md font-headline font-extrabold ${isActive ? 'text-text-primary' : 'text-text-primary/90'}`}>
                      {node.title}
                    </h3>

                    <p className="text-text-muted font-body-md text-sm leading-relaxed max-w-2xl">
                      {node.desc}
                    </p>

                    {isActive && (
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-secondary-spot font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-secondary" />
                          현재 집중해야 할 퀘스트!
                        </span>
                        <Link to="/activity-form">
                          <span className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                            활동 기록 폼 작성하러 가기 <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Points & Action Button */}
                  <div className="flex md:flex-col items-center justify-between md:justify-end gap-4 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-surface-variant/30">
                    <div className="text-right">
                      <span className="font-headline font-black text-lg text-primary block">+{node.points} STAR</span>
                      <span className="text-[11px] text-text-muted font-semibold">{node.dueDate}</span>
                    </div>

                    {isActive ? (
                      <Link to="/activity-form">
                        <Button variant="teal" size="sm" icon={<Plus className="w-4 h-4" />}>
                          활동 인증
                        </Button>
                      </Link>
                    ) : isCompleted ? (
                      <Link to="/portfolio">
                        <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                          포트폴리오 확인
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="secondary" size="sm" disabled className="opacity-50 cursor-not-allowed">
                        이이전 단계 필요
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Habit & Goal Management Quick Redirect Card */}
      <Card variant="hero" padding="md" className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-3d-ambient">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h3 className="text-headline-md font-extrabold text-white font-headline flex items-center justify-center md:justify-start gap-2">
            <Trophy className="w-6 h-6 text-secondary-container" />
            <span>매일매일 실천하는 습관 & 목표 관리</span>
          </h3>
          <p className="text-white/85 text-sm">
            거창한 로드맵의 완성은 매일 10분의 사소한 실천에서 시작됩니다. 오늘의 루틴 체크인하러 갈까요?
          </p>
        </div>
        <Link to="/habits">
          <Button variant="teal" size="md" className="font-bold bg-white text-primary hover:bg-surface-container-lowest">
            습관 관리 이동
          </Button>
        </Link>
      </Card>
    </div>
  );
};
