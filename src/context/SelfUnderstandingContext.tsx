import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

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
  title: string;
  characterTitle: string;
  characterAura: string;
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
  resetAssessments: () => void;
  isPortfolioSync: boolean;
}

const STORAGE_KEY_ASSESSMENTS = "readycareer_assessments_real_v1";
const STORAGE_KEY_REPORT = "readycareer_self_report_real_v1";

// 신규 유저 진입 시 3가지 진단 모두 '진행 전'(0점)으로 시작하도록 전면 개편
const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "test-interest",
    title: "AI 진로 흥미 무드검사 (Holland & 융합 DNA)",
    category: "흥미무드",
    status: "진행 전",
    score: 0,
    summary: "검사 시작 시 실무 18문항 다선택지 분석을 통해 나만의 융합 RIASEC 코드를 도출합니다.",
  },
  {
    id: "test-intelligence",
    title: "미래 융합 다중지능 및 잠재력 진단",
    category: "다중지능",
    status: "진행 전",
    score: 0,
    summary: "검사를 이수하고 상위 퍼센트위 지능 영역(논리, 대인, 공간 등) 리포트 뱃지를 해금하세요.",
  },
  {
    id: "test-learning",
    title: "메모리 & 집중력 최적화 학습 스타일 검사",
    category: "학습스타일",
    status: "진행 전",
    score: 0,
    summary: "검사 후 나만의 몰입형 공부 루틴과 세특 시간 배분 최적화 AI 솔루션을 발판 삼아보세요.",
  },
];

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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
      
      // Supabase DB 연결 시 실시간 동기화 보전
      if (isSupabaseConfigured) {
        supabase.from("assessments").upsert(
          assessments.map(item => ({
            test_id: item.id,
            category: item.category,
            status: item.status,
            score: item.score,
            summary: item.summary,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: "test_id" }
        ).then(({ error }) => {
          if (error && !error.message.includes("does not exist")) {
            console.warn("Supabase assessments upsert error:", error.message);
          }
        });
      }
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

  const resetAssessments = () => {
    setAssessments(INITIAL_ASSESSMENTS);
    setReport(null);
    localStorage.removeItem(STORAGE_KEY_ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEY_REPORT);
  };

  const completeAssessment = (id: string, score: number, summary: string) => {
    const completedDate = new Date().toLocaleDateString("ko-KR");
    const updated = assessments.map((item) =>
      item.id === id
        ? { ...item, status: "완료됨" as const, score, summary, completedAt: completedDate }
        : item
    );
    setAssessments(updated);

    // 3개 진단이 모두 완료된 경우에만 종합 리포트 자동 생성
    const allCompleted = updated.every(i => i.status === "완료됨");
    if (allCompleted) {
      generateComprehensiveReport();
    }
  };

  const generateComprehensiveReport = () => {
    const newReport: ComprehensiveReport = {
      title: "🤖 융합 성장 실증형: AI 솔루션 및 미래 엔지니어",
      characterTitle: "👑 AI 커리어 마이스터 Ari",
      characterAura: "진로 흥미와 다중지능 검사 이수를 통해 실효성 높은 미래 탐구력이 입증되었습니다!",
      aiAdvice: "자가 진단 완료 데이터가 포트폴리오 자산으로 동기화되었습니다. 도출된 맞춤 강점 키워드를 바탕으로 학교 교과 수행이나 진로 탐구 시 주도적인 역량을 녹여내면 독보적인 생기부 경쟁력이 탄생합니다.",
      strengths: [
        "논리수학 및 직관 추론력",
        "자기주도 진도 완결성",
        "비판적 디지털 리딩력",
        "협업 소통 및 주도성",
      ],
      recommendedCareers: ["AI 로보틱스 연구원", "빅데이터 시각화 설계사", "미래 에듀테크 멘토"],
      portfolioSavedAt: new Date().toLocaleDateString("ko-KR") + " (포트폴리오 실시간 연계 됨)",
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
        resetAssessments,
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
