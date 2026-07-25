import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Chip, Button, MascotAri } from "../components";
import { Plus, Award, ChevronRight, Download } from "lucide-react";

interface ActivityItem {
  id: string;
  tag: string;
  tagCategory: string;
  date: string;
  title: string;
  desc: string;
  badgeType: "teal" | "violet" | "error";
}

export const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("전체");

  const tabs = ["전체", "학습", "진도", "봉사", "기타"];

  const activities: ActivityItem[] = [
    {
      id: "act-1",
      tag: "진로",
      tagCategory: "AI 융합",
      date: "2026.07.25",
      title: "책임 있는 인공지능 윤리 토론 본선 진출 및 발제",
      desc: "AI 프로젝트로 생성된 자율주행차 딜레마 해결을 위한 학술 보고서 제출 및 입상.",
      badgeType: "violet",
    },
    {
      id: "act-2",
      tag: "학습",
      tagCategory: "동아리",
      date: "2026.06.12",
      title: "교내 알고리즘 스터디 그룹 '코드포스' 운영 및 활동",
      desc: "파이썬 문법 및 자료구조 풀이 스터디를 주도하며 매주 문제 풀이 보고서 12건 작성 완성.",
      badgeType: "teal",
    },
    {
      id: "act-3",
      tag: "봉사",
      tagCategory: "멘토링",
      date: "2026.05.20",
      title: "지역 도서관 디지털 기기 및 AI 서비스 맞춤 사용 가이드 봉사",
      desc: "어르신 대상 스마트폰과 대화형 인공지능 사용 안내 봉사 활동 실현 (총 20시간).",
      badgeType: "error",
    },
    {
      id: "act-4",
      tag: "진도",
      tagCategory: "독서",
      date: "2026.04.15",
      title: "『로봇 시대, 인간의 일』 탐독 및 데이터 엔지니어 에세이",
      desc: "인문학적 사유를 바탕으로 AI 로보틱스 환경에서의 주도적 문제해결 DNA에 대한 성찰글.",
      badgeType: "violet",
    },
  ];

  const filteredActivities = selectedTab === "전체"
    ? activities
    : activities.filter(a => a.tag === selectedTab || a.tagCategory.includes(selectedTab));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Page Header (Matching Stitch Screen Title & Badge) */}
      <div className="flex items-center justify-between py-2 border-b border-surface-variant/40">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-2xl md:text-headline-lg font-extrabold text-text-primary tracking-tight">
            진로 포트폴리오 (3D 한글)
          </h2>
          <span className="bg-primary-container text-on-primary font-label-sm px-3 py-1 rounded-full shadow-3d-base bezel-effect">
            12
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            PDF 변환 (교사 제출용)
          </Button>
        </div>
      </div>

      {/* Filter Chips (Horizontal Scroll as in Stitch Base64 HTML) */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {tabs.map((tab) => (
          <Chip
            key={tab}
            active={selectedTab === tab}
            onClick={() => setSelectedTab(tab)}
            variant={selectedTab === tab ? "default" : "teal"}
          >
            {tab}
          </Chip>
        ))}
      </div>

      {/* Portfolio Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {/* Floating "Add Activity" Hero CTA Card (First Item) */}
        <button
          type="button"
          onClick={() => navigate("/activity-form")}
          className="w-full text-left gradient-hero-card p-8 rounded-[32px] shadow-3d-ambient bezel-effect flex flex-col justify-center items-center gap-4 group transition-all hover:shadow-3d-hover hover:-translate-y-1 min-h-[220px]"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Plus className="w-8 h-8 text-white stroke-[3]" />
          </div>
          <span className="font-headline font-extrabold text-title-md text-white tracking-wide">
            + 활동 기록하기
          </span>
          <p className="text-xs text-white/80 text-center font-body-md">
            클릭하여 세특 및 창체 활동 보고서 AI 교정
          </p>
        </button>

        {/* Activity Cards from Stitch Spec */}
        {filteredActivities.map((act, index) => (
          <Card
            key={act.id}
            variant="activity"
            padding="md"
            hoverEffect
            className="flex flex-col gap-4 relative overflow-hidden min-h-[220px] justify-between border-surface-variant/30 group"
          >
            {/* Top subtle colored border gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary-container to-primary-container opacity-60" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="chip-gradient text-primary px-3 py-0.5 rounded-full text-[12px] font-headline font-extrabold shadow-sm">
                    {act.tag}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold ${
                    act.badgeType === 'teal' ? 'bg-secondary/15 text-secondary-spot' : 'bg-surface-container text-text-primary'
                  }`}>
                    {act.tagCategory}
                  </span>
                </div>
                <span className="text-xs font-semibold text-text-muted">{act.date}</span>
              </div>

              <h3 className="font-headline font-bold text-title-md text-text-primary mt-1 group-hover:text-primary transition-colors leading-snug">
                {act.title}
              </h3>

              <p className="font-body-md text-sm text-text-muted line-clamp-3 leading-relaxed">
                {act.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-surface-variant/20 flex justify-between items-center text-xs text-secondary-spot font-extrabold">
              <span>● AI 세특 가이드 변환 완료</span>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Mascot Sticker on first activity card (As in Stitch Base64 specimen) */}
            {index === 0 && (
              <div className="absolute -bottom-3 -right-3 pointer-events-none opacity-85 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300 z-10">
                <MascotAri pose="sticker" size="sm" rotate={true} />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Teacher verification pro banner */}
      <Card variant="surface" padding="md" className="bg-surface-container-low border-2 border-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-text-primary text-base">선생님 학생부 확인 요청 (교사 Pro)</h4>
            <p className="text-xs text-text-muted mt-0.5">
              이 포트폴리오는 교사용 학생부 기재 가이드(3D) 화면과 연동되어 실시간 검토를 받을 수 있습니다.
            </p>
          </div>
        </div>
        <Link to="/teacher">
          <Button variant="teal" size="sm" className="whitespace-nowrap">
            교사 가이드 (Pro) 보기
          </Button>
        </Link>
      </Card>
    </div>
  );
};
