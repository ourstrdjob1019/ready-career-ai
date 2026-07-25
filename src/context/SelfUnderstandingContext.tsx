import React, { createContext, useContext, useState, useEffect } from "react";

export interface AssessmentItem {
  id: string;
  title: string;
  category: "흥미무드" | "다중지능" | "학습스타일";
  status: "완료됨" | "진행 전";
  score: number;
  summary: string;
  completedAt?: string;
}

export interface ComprehensiveReport {
  title: string; // e.g. "혁신적 AI 로봇 탐구자 (I-R-A)"
  characterTitle: string; // Badge on mascot
  characterAura: string; // Short aura quote
  aiAdvice: string;
  strengths: string[];
  recommendedCareers: string[];
  portfolioSavedAt?: string;
}

interface SelfUnderstandingContextType {
  assessments: AssessmentItem[];
  report: ComprehensiveReport | null;
  completeAssessment: (id: string, score: number, summary: string) => void;
  generateComprehensiveReport: () => void;
  isPortfolioSync: boolean;
}

const STORAGE_KEY_ASSESSMENTS = "readycareer_assessments";
const STORAGE_KEY_REPORT = "readycareer_self_report";

const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "test-interest",
    title: "AI 진로 흥미 무드검사 (Holland & 융합 DNA)",
    category: "흥미무드",
    status: "완료됨",
    score: 98,
    summary: "탐구형(I)과 사회가치형(S)이 조화로운 'AI 혁신 개척자' 성향으로 나타났습니다.",
    completedAt: "2026.07.25",
  },
  {
    id: "test-intelligence",
    title: "미래 융합 다중지능 및 잠재력 진단",
    category: "다중지능",
    status: "완료됨",
    score: 94,
    summary: "논리·수학적 직관력과 디지털 공간 인지 능력이 동급생 상위 2% 이내의 고소양을 기록했습니다.",
    completedAt: "2026.07.25",
  },
  {
    id: "test-learning",
    title: "메모리 & 집중력 최적화 학습 스타일 검사",
    category: "학습스타일",
    status: "진행 전",
    score: 0,
    summary: "검사 후 나만의 몰입형 공부 루틴과 세특 시간 배분 최적화 솔루션을 발판 삼아보세요.",
  },
];

const INITIAL_REPORT: ComprehensiveReport = {
  title: "🤖 3D 미래 융합형: AI 로보틱스 개척자",
  characterTitle: "👑 3D 융합 개척자 Ari",
  characterAura: "논리와 따뜻한 ESG 사유를 두루 갖춘 천부적인 미래 설계 커리어리스트!",
  aiAdvice: "자기이해 다중 지능 분석 결과, 논리·수학 역량을 발휘할 수 있는 '데이터 시각화 프로젝트'를 본인 주도 학습으로 세특에 녹여내면 압도적인 최상위 변호력을 지닙니다.",
  strengths: [
    "상위 2% 논리수학 추론력",
    "이타적 ESG 환경 사유",
    "뛰어난 코드북 판해 해상도",
    "협업 토론 및 주도성",
  ],
  recommendedCareers: ["AI 로봇 융합 연구원", "기후·환경 데이터 애널리스트", "XR 감각 인터랙션 설계자"],
  portfolioSavedAt: "2026.07.25 (포트폴리오 연동 완료)",
};

const SelfUnderstandingContext = createContext<SelfUnderstandingContextType | undefined>(undefined);

export const SelfUnderstandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<AssessmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
    } catch {
      return INITIAL_ASSESSMENTS;
    }
  });

  const [report, setReport] = useState<ComprehensiveReport | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORT);
      return saved ? JSON.parse(saved) : INITIAL_REPORT;
    } catch {
      return INITIAL_REPORT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
    } catch (e) {
      console.error("Save assessments error:", e);
    }
  }, [assessments]);

  useEffect(() => {
    try {
      if (report) {
        localStorage.setItem(STORAGE_KEY_REPORT, JSON.stringify(report));
      }
    } catch (e) {
      console.error("Save report error:", e);
    }
  }, [report]);

  const completeAssessment = (id: string, score: number, summary: string) => {
    const updated = assessments.map((item) =>
      item.id === id
        ? { ...item, status: "완료됨" as const, score, summary, completedAt: new Date().toLocaleDateString("ko-KR") }
        : item
    );
    setAssessments(updated);
    // Auto trigger report update if all or any completed
    generateComprehensiveReport();
  };

  const generateComprehensiveReport = () => {
    // Generate interactive updated AI report
    const newReport: ComprehensiveReport = {
      title: "🚀 완성형 커리어: 글로벌 AI·ESG 통합 솔루셔너",
      characterTitle: "💎 빛나는 마스터 Ari",
      characterAura: "3종 자기이해 검사 완결! 나에 대한 깊은 이해가 강력한 생기부의 뼈대입니다.",
      aiAdvice: "자기이해 3종 진단이 포트폴리오에 자동 등재되었습니다. 이제 '나만의 강점 4가지'를 기반으로 활동 폼에 AI 교정을 씌우면 교육청 기준 완강한 세특 문장이 추출됩니다.",
      strengths: [
        "종합 다중지능 마스터리",
        "자기주도 학습 탄력성",
        "비판적 인문공학 통찰력",
        "데이터-현실 유도화 역량",
      ],
      recommendedCareers: ["AI 로보틱스 수석 연구원", "미래 전략 기술 홍보 디렉터", "클라우드 보안 설계사"],
      portfolioSavedAt: new Date().toLocaleDateString("ko-KR") + " (포트폴리오에 실시간 스크랩됨)",
    };
    setReport(newReport);
  };

  return (
    <SelfUnderstandingContext.Provider
      value={{
        assessments,
        report,
        completeAssessment,
        generateComprehensiveReport,
        isPortfolioSync: !!report,
      }}
    >
      {children}
    </SelfUnderstandingContext.Provider>
  );
};

export const useSelfUnderstanding = (): SelfUnderstandingContextType => {
  const context = useContext(SelfUnderstandingContext);
  if (!context) {
    throw new Error("useSelfUnderstanding must be used within a SelfUnderstandingProvider");
  }
  return context;
};
