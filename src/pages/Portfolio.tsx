import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, MascotAri } from "../components";
import { useSelfUnderstanding } from "../context";
import { Award, Search, Sparkles, Filter, CheckCircle2, Copy, FileText, ExternalLink, Brain } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "동아리" | "진학·탐구" | "독서·예술" | "자기성찰/진도";
  date: string;
  content: string;
  tags: string[];
  aiFeedback?: string;
  isSelfReport?: boolean;
}

const INITIAL_PORTFOLIOS: PortfolioItem[] = [
  {
    id: "pf-1",
    title: "AI 및 기계학습 모델의 교육 격차 해소 방안 탐구",
    category: "진학·탐구",
    date: "2026.07.24",
    content:
      "다양한 공공 교육 데이터 세트를 바탕으로 인공지능 기반 학습 진단 모델을 설계하고, 농촌 및 저소득층 학생들을 위한 자동화 맞춤형 멘토링 인터페이스 프로토타입을 제작하여 보고서로 서면 제출함.",
    tags: ["인공지능", "사회문제 해결", "프로토타입", "자율활동"],
    aiFeedback: "‘공공 교육 데이터 세트 활용’이라는 명확한 근거 제시가 훌륭하며, 문제 해결 의식이 세특 평가 기준 중 상위 1%에 해당함.",
  },
  {
    id: "pf-2",
    title: "학교 공식 인공지능 코딩 동아리 'Neuro-V26' 리더십 발휘",
    category: "동아리",
    date: "2026.07.15",
    content:
      "파이썬 오픈소스 라이브러리를 활용한 감정 인식 모바일 챗봇을 팀원 5명과 함께 기획하고 전체 시스템 아키텍처 리더십을 발휘하여 전교 학술제에서 대상(1위)을 도출함.",
    tags: ["동아리장", "파이썬 챗봇", "협업 리더십", "학술제 대상"],
    aiFeedback: "리더로서 시스템 아키텍처를 총괄한 과정이 강조되어 구체적인 문제개선 사례를 곁들이면 서울지역 학종 상위 평가에 부합함.",
  },
  {
    id: "pf-3",
    title: "과학 기술 고전 비판적 재해석 & 윤리 토론 발제",
    category: "독서·예술",
    date: "2026.06.28",
    content:
      "빅데이터 시대의 개인정보 오남용 문제를 진중하게 해부한 도서를 정독한 뒤, 교내 AI 자율권 관련 지정 토론회에서 사회자 및 찬성 측 메인 입론을 담당함.",
    tags: ["AI 윤리", "토론 사회자", "논리적 입론"],
    aiFeedback: "이공계 학생의 인문사회학적 교양과 윤리의식을 돋보이게 하는 매우 훌륭한 독서 융합 사례임.",
  },
];

export const Portfolio: React.FC = () => {
  const { report } = useSelfUnderstanding();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 보기");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["전체 보기", "자기성찰/진도", "진학·탐구", "동아리", "독서·예술"];

  // Dynamically merge Self-Understanding report as a Portfolio Item!
  const selfReportItem: PortfolioItem | null = report
    ? {
        id: "pf-self-report",
        title: `👑 자기이해 AI 3종 종합 리포트: ${report.title}`,
        category: "자기성찰/진도",
        date: report.portfolioSavedAt || "2026.07.25",
        content: `[AI 다중지능 및 진로 흥미무드 진단 완료]\n오오라 칭호: "${report.characterAura}"\n강점: ${report.strengths.join(", ")}\n추천 진로: ${report.recommendedCareers.join(", ")}\nAI 세특 적용 팁: ${report.aiAdvice}`,
        tags: ["AI자기이해", "3D진로리포트", "NEIS적용팁", "강점분석"],
        aiFeedback: "이 자기이해 종합 리포트는 학생이 본인의 잠재력을 정확히 파악하고 주도적인 커리어 계획을 수립했다는 객관적 지표로 생기부 행특/진로활동란에 적극 인용 가능합니다!",
        isSelfReport: true,
      }
    : null;

  const allItems: PortfolioItem[] = selfReportItem ? [selfReportItem, ...INITIAL_PORTFOLIOS] : INITIAL_PORTFOLIOS;

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === "전체 보기" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-headline font-extrabold mb-3">
            <Award className="w-4 h-4" />
            <span>3D ReadyCareer AI Pro Asset Archive</span>
          </div>
          <h1 className="text-display-lg font-black text-text-primary font-headline tracking-tight leading-none">
            내 한글 <span className="text-transparent bg-clip-text gradient-hero-card">포트폴리오</span>
          </h1>
          <p className="text-sm text-text-muted mt-2 font-body-md max-w-2xl leading-relaxed">
            세특 활동 기록과 <strong>[자기이해]</strong> 다중 진단 리포트가 함께 모여 강력한 학종 자산을 구성합니다.
            NEIS 규준 버튼으로 1초 만에 텍스트 복사 후 학교 제출란에 바로 등록하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link to="/self-understanding">
            <Button variant="teal" size="sm" icon={<Brain className="w-4 h-4" />} className="font-extrabold shadow-sm">
              자기이해 진단 허브
            </Button>
          </Link>
          <Link to="/activity-form">
            <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />} className="font-extrabold shadow-md">
              + 신규 세특 기록 추가
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-3xl border border-surface-variant/30 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-headline font-bold text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> 필터:
          </span>
          {categories.map((cat) => (
            <Chip
              key={cat}
              active={selectedCategory === cat}
              variant={cat === "자기성찰/진도" ? "teal" : selectedCategory === cat ? "default" : "default"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "자기성찰/진도" && <Brain className="w-3.5 h-3.5 mr-1 inline" />}
              {cat}
            </Chip>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="키워드, 태그, 교내 활동 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-surface-container-lowest border border-surface-variant/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-text-primary placeholder-text-muted transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Portfolio Items List */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <Card variant="surface" padding="lg" className="text-center py-16 flex flex-col items-center gap-3 border-dashed">
            <FileText className="w-12 h-12 text-text-muted" />
            <span className="font-headline font-bold text-base text-text-primary">일치하는 포트폴리오 자산이 없습니다.</span>
            <p className="text-xs text-text-muted">다른 카테고리를 클릭하거나 신규 활동 기록 폼에서 내역을 생성하세요.</p>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const isSelf = item.isSelfReport;

            return (
              <Card
                key={item.id}
                variant={isSelf ? "hero" : "activity"}
                padding="lg"
                className={`transition-all duration-200 ${
                  isSelf
                    ? "bg-gradient-to-r from-point via-white to-white border-2 border-secondary/40 shadow-3d-ambient"
                    : "border border-surface-variant/40 hover:border-primary/40 shadow-3d-base hover:shadow-3d-ambient"
                }`}
              >
                <div className="flex flex-col gap-4">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-variant/30 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-headline font-extrabold flex items-center gap-1 ${
                        isSelf ? "bg-secondary text-white shadow-sm" : "bg-primary/10 text-primary"
                      }`}>
                        {isSelf ? <Brain className="w-3.5 h-3.5" /> : null}
                        #{item.category}
                      </span>

                      <span className="text-xs text-text-muted font-bold flex items-center gap-1">
                        ● 등록일: {item.date}
                      </span>

                      {isSelf && (
                        <span className="text-[11px] font-black bg-secondary/15 text-secondary-spot px-2.5 py-0.5 rounded-full border border-secondary/20 animate-pulse">
                          🔥 자기이해 3종 진단 DB 연계됨
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isSelf && (
                        <Link to="/self-report">
                          <Button variant="outline" size="sm" className="text-xs font-bold py-1 px-3">
                            3D 종합 리포트 전문 보기 <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                          </Button>
                        </Link>
                      )}

                      <button
                        onClick={() => handleCopyText(item.id, item.content)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-headline font-extrabold flex items-center gap-1.5 transition-all ${
                          copiedId === item.id
                            ? "bg-secondary text-white shadow-md"
                            : "bg-surface-container hover:bg-surface-container-high text-text-primary"
                        }`}
                        title="NEIS 등록용 텍스트 클립보드 복사"
                      >
                        {copiedId === item.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>NEIS 양식 복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-primary" />
                            <span>NEIS 간편 복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Title & Content */}
                  <div>
                    <h3 className={`font-headline font-black text-title-lg md:text-headline-md text-text-primary leading-snug ${
                      isSelf ? "text-primary" : ""
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-sm font-body-md text-text-primary/90 mt-3 leading-relaxed whitespace-pre-line bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 shadow-inner">
                      {item.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs font-headline font-bold bg-surface-container px-2.5 py-1 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Feedback Box */}
                  {item.aiFeedback && (
                    <div className="mt-2 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-3 text-xs text-text-primary leading-relaxed shadow-sm">
                      <Sparkles className="w-5 h-5 text-secondary-spot flex-shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong className="text-primary font-headline text-sm font-extrabold block mb-1">
                          🤖 ReadyCareer AI 파트너의 생기부 평가 및 보완 제안:
                        </strong>
                        <span>{item.aiFeedback}</span>
                      </div>
                    </div>
                  )}

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer advice */}
      <div className="mt-4 p-6 bg-surface-container-low rounded-3xl border border-surface-variant/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <MascotAri pose="sticker" size="sm" rotate={false} />
          <div>
            <h4 className="font-headline font-extrabold text-text-primary text-base">포트폴리오 일괄 다운로드 안내</h4>
            <p className="text-xs text-text-muted mt-0.5">
              전체 자산 및 자기이해 리포트를 담임 교사용 나이스(NEIS) 양식 Excel 또는 한글(.hwp) PDF로 일관 다운로드하려면 선생님과의 세션 공유를 승인하세요.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="md" className="whitespace-nowrap font-extrabold">
          교사용 NEIS 내보내기 승인
        </Button>
      </div>
    </div>
  );
};
