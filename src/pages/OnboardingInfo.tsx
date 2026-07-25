import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Chip, MascotAri } from "../components";
import { School, User, Sparkles, ArrowRight } from "lucide-react";

export const OnboardingInfo: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("김수진");
  const [school, setSchool] = useState("서울창의중학교");
  const [grade, setGrade] = useState("3학년");
  const [targetCluster, setTargetCluster] = useState<string>("인공지능·공학");

  const clusters = [
    "인공지능·공학",
    "바이오·메디컬",
    "문화 콘텐츠·디자인",
    "경제·금융 비즈니스",
    "사회서비스·교육",
    "기초과학·연구"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/interest-test");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Step Indicator Banner */}
      <div className="flex items-center justify-between bg-surface-container px-6 py-3 rounded-full border border-surface-variant/30">
        <span className="font-headline font-extrabold text-primary text-label-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary-spot" />
          온보딩 2/3: 기본 정보 설정
        </span>
        <span className="text-label-sm text-text-muted">학교 및 관심분야</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Col: Mascot & Encouragement */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <MascotAri pose="sticker" size="lg" />
          <h2 className="text-headline-md font-headline font-bold text-text-primary">
            반가워요! 내 정보를 확인해 볼까요?
          </h2>
          <p className="text-body-md text-text-muted leading-relaxed text-sm">
            입력한 정보는 맞춤형 진로 포트폴리오 및 학생부 활동 추천 알고리즘의 기초 데이터로 활용됩니다.
          </p>
          <div className="hidden md:block w-full">
            <MascotAri 
              pose="avatar" 
              size="sm" 
              bubbleTitle="AI 맞춤 추천" 
              bubbleMessage="관심 진로 분야는 언제든 로드맵에서 자유롭게 변경할 수 있어요!" 
            />
          </div>
        </div>

        {/* Right Col: Info Form */}
        <Card variant="activity" padding="lg" className="md:col-span-2 w-full shadow-3d-ambient">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="이름 (학생명)"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5 text-primary" />}
              required
            />

            <Input
              label="학교명"
              placeholder="예: 서울창의중학교"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              icon={<School className="w-5 h-5 text-secondary-spot" />}
              required
            />

            {/* Grade Selector */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-semibold text-label-lg text-text-primary px-1">
                학년 선택
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {["1학년", "2학년", "3학년"].map((g) => (
                  <Chip
                    key={g}
                    type="button"
                    active={grade === g}
                    onClick={() => setGrade(g)}
                    className="flex-1 text-center py-3"
                  >
                    {g}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Career Cluster Selector */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-semibold text-label-lg text-text-primary px-1 flex items-center justify-between">
                <span>관심 진로 융합군 (1개 필수 선택)</span>
                <span className="text-[11px] text-secondary-spot font-bold">● 추천 순도 상승</span>
              </label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {clusters.map((cl) => (
                  <Chip
                    key={cl}
                    type="button"
                    active={targetCluster === cl}
                    variant={targetCluster === cl ? "default" : "teal"}
                    onClick={() => setTargetCluster(cl)}
                  >
                    {cl}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-variant/30 flex justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5" />}
              >
                흥미유형 AI 검사 시작하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
