import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Chip, MascotAri } from "../components";
import { FileText, Calendar, Sparkles, Save } from "lucide-react";

export const ActivityForm: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("AI와 공학 윤리 주제의 교내 학술제 발제");
  const [category, setCategory] = useState("창의적체험활동");
  const [date, setDate] = useState("2026-07-25");
  const [content, setContent] = useState(
    "인공지능 로보틱스가 미래 사회에 진입할 때 일어날 일자리 재배치와 도덕적 자율주행 기준에 관한 리서치를 주도함. 파이썬을 활용한 설문 데이터 시각화를 덧붙여 우수한 평가를 받음."
  );
  const [reflection, setReflection] = useState(
    "단순한 개발 능력을 넘어 인문학적 고찰이 필수적임을 확신하게 되었음."
  );
  const [aiOptimizing, setAiOptimizing] = useState(false);

  const categories = ["교과 활동 (세특)", "창의적체험활동 (자율/동아리/진로)", "독서 기록", "대회 및 봉사"];

  const handleAiRefine = () => {
    setAiOptimizing(true);
    setTimeout(() => {
      setContent(
        "【AI 세특 맞춤 최적화 버전】\n인공지능 로보틱스 상용화에 따른 노동 구조 변동 및 자율주행 알고리즘의 딜레마를 분석하는 학술제 발표를 주도함. 파이썬 데이터 전처리(Pandas)와 Matplotlib 시각화를 이용하여 합리적 통계 근거를 제시, 융합적 문제 해결 무기와 깊이 있는 인문학적 직관을 보임."
      );
      setAiOptimizing(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/portfolio");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-surface-variant/40 pb-4">
        <div>
          <span className="text-xs font-headline font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase">
            3D Student Record Assistant
          </span>
          <h1 className="text-headline-lg font-extrabold text-text-primary font-headline mt-2">
            활동 기록 폼 & AI 교정
          </h1>
          <p className="text-sm text-text-muted">
            기록한 활동은 교과 세부능력 및 특기사항(세특) 가이드 문장으로 전환되어 진로 포트폴리오에 등록됩니다.
          </p>
        </div>
        <div className="hidden sm:block">
          <MascotAri pose="avatar" size="sm" rotate={false} />
        </div>
      </div>

      <Card variant="activity" padding="lg" className="w-full shadow-3d-ambient">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-headline font-semibold text-label-lg text-text-primary px-1">
              활동 영역 분류
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  type="button"
                  size="sm"
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          <Input
            label="활동 타이틀"
            placeholder="예: 자율주행 시뮬레이션 보고서 작성"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<FileText className="w-5 h-5 text-primary" />}
            required
          />

          <Input
            type="date"
            label="수행 날짜 (완료 기준일)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="w-5 h-5 text-secondary-spot" />}
            required
          />

          {/* Detailed Content & AI Refinement Tool */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="font-headline font-semibold text-label-lg text-text-primary">
                활동 내용 (팩트 중심)
              </label>
              <Button
                type="button"
                variant="teal"
                size="sm"
                onClick={handleAiRefine}
                disabled={aiOptimizing}
                className="h-8 px-3.5 text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {aiOptimizing ? "AI 문장 분석 및 세특 다듬는 중..." : "AI 학생부 문체로 세련되게 변환"}
              </Button>
            </div>

            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="구체적인 수행 과정과 본인이 담당한 역할, 활용한 도구 등을 적어주세요."
              className="w-full bg-input-fill rounded-[24px] p-5 font-body-md text-text-primary border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-y shadow-inner"
              required
            />
          </div>

          {/* Personal Reflection / Growth */}
          <div className="flex flex-col gap-2">
            <label className="font-headline font-semibold text-label-lg text-text-primary px-1 flex items-center justify-between">
              <span>성경험 및 느낀 점 (자기성찰 지수)</span>
              <span className="text-[11px] text-primary font-semibold">● 교사의 입체적 관찰평가에 활용됨</span>
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="활동 이후 새롭게 깨달은 사실이나 후속 연구로 발전시키고 싶은 목표를 적어주세요."
              className="w-full bg-input-fill rounded-[24px] p-5 font-body-md text-text-primary border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-y shadow-inner"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-surface-variant/30 flex justify-end gap-4">
            <Button type="button" variant="secondary" size="md" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" variant="primary" size="md" icon={<Save className="w-5 h-5" />} className="px-8 font-black">
              포트폴리오에 안전 기기록 & STAR 획득
            </Button>
          </div>
        </form>
      </Card>

      {/* Ari hint below form */}
      <MascotAri
        pose="sticker"
        size="sm"
        bubbleTitle="Ari's AI 세특 기재 비법"
        bubbleMessage="단순히 '강의를 들었다'보다 '어떤 문제를 해결하기 위해 어떤 논문/코드북을 참조해 이뤄냈다'로 서술하면 생기부 등급이 압도적으로 상승해요!"
      />
    </div>
  );
};
