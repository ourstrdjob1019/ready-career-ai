import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import {
  Search,
  CheckCircle2,
  Copy,
  Users,
  ShieldCheck,
  FileText,
  RefreshCw,
  BarChart3,
  Award,
  ExternalLink,
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  classNo: number;
  studentNo: number;
  riasecCode: string;
  targetJob: string;
  level: number;
  questCount: number;
  portfolioCount: number;
  habitSuccessRate: number;
  targetAvgScore?: string;
  studyGoals?: { subject: string; target: string; currentStatus: string; score: number }[];
  cornellNotes?: { subject: string; topic: string; aiSummary: string; date: string }[];
  diagnosticStatus: {
    interest: string;
    intelligence: string;
    learningStyle: string;
  };
  competencyScores: {
    selfDirected: number;
    majorExploration: number;
    problemSolving: number;
    communication: number;
  };
  recentPortfolios: {
    title: string;
    category: string;
    date: string;
    status: "검토 완료" | "확인 대기";
  }[];
  activities: string[];
  guidelineSample?: string;
}

const MOCK_STUDENTS: StudentData[] = [
  {
    id: "std-1",
    name: "김수진",
    grade: 2,
    classNo: 4,
    studentNo: 12,
    riasecCode: "SI",
    targetJob: "중등 교사 및 진로 상담 멘토",
    level: 5,
    questCount: 14,
    portfolioCount: 6,
    habitSuccessRate: 94,
    targetAvgScore: "이번 학기 목표: 평균 92.0점 (현재 88.5점 / 🚀 상한가 주행 중!)",
    studyGoals: [
      { subject: "🗣️ 영어 I", target: "지필평가 1등급 쟁취", currentStatus: "현재 2등급 최상위 (목표 도달 직전)", score: 89 },
      { subject: "💬 화법과 작문", target: "수행평가 & 심층 발표 만점", currentStatus: "✓ 100% 목표 달성 완료", score: 98 },
      { subject: "🌿 통합사회", target: "95점 이상 고지 정복", currentStatus: "안정권 유지 중", score: 94 },
    ],
    cornellNotes: [
      { subject: "🌿 통합사회 × AI", topic: "공공 데이터를 활용한 지역별 교육 격차 원인 및 정책 제안", aiSummary: "통합사회 교과의 사회 구조적 인식을 교육 공공 데이터 시계열 분석과 연계하여 남다른 실증적 탐구심과 이타적 리더십을 증명함.", date: "2026.07.28" },
      { subject: "🗣️ 영어 I", topic: "TED 교육 심리학(Mindset) 강연 원문 구조 해석 및 스터디", aiSummary: "자기주도적 심층 원문 파해력을 보였으며, 동아리 스터디에서 경청과 중재의 뛰어난 소통 역량을 드러냄.", date: "2026.07.21" },
    ],
    diagnosticStatus: {
      interest: "완료 (SI 이타적 탐구형)",
      intelligence: "완료 (대인·리더십 지능 상위 2%)",
      learningStyle: "완료 (청각·토론 대화형 루틴)",
    },
    competencyScores: {
      selfDirected: 96,
      majorExploration: 92,
      problemSolving: 88,
      communication: 98,
    },
    recentPortfolios: [
      { title: "공공 교육 데이터 활용 맞춤 멘토링 기획안", category: "진로 심도", date: "2026.07.24", status: "검토 완료" },
      { title: "청소년 정서 상담 프로토타입 앱 화면 설계서", category: "창의·융합", date: "2026.07.20", status: "검토 완료" },
      { title: "교육 격차 극복을 위한 학교 공동체 토론 결과 보고서", category: "자율 탐구", date: "2026.07.15", status: "확인 대기" },
    ],
    activities: [
      "AI 및 기계학습 모델의 교육 격차 해소 방안 탐구 (공공 교육 데이터 활용 프로토타입 서술)",
      "교내 인공지능 코딩 동아리 아키텍처 과제 및 스터디 활동 주도",
      "자기이해 다중진단 리포트 (사회형-탐구형 이타적 논리 추론력 발휘)",
    ],
    guidelineSample: `### 📊 [김수진 학생] 2026 AI 생기부 리포트 (교과 & 진로 통합)

**1. 📌 학생 정량 목표 및 활동 팩트 (Fact)**
- 이번 학기 평균 92점 목표로 '영어 I', '화법과 작문', '통합사회' 등 교과 목표를 체계적으로 달성 중임.
- 진로 탐색 및 자율 활동 시간 동안 '중등 교사 및 진로 상담 멘토' 직업군을 심층 탐구하며 학습 로드맵을 성실히 이행함.
- 공공 교육 데이터 세트를 활용한 지역별 학습 진단 방안을 코넬 노트 탐구 일지로 작성 및 제출함.

**2. 🌱 성장 및 행동 특성 분석 (Growth)**
- 문제 해결 과정에서 객관적인 공공 데이터를 바탕으로 대안을 제시하는 분석력을 보이며, 학업 태도가 매우 주도적임.
- 동아리 스터디 및 영어 원문 강독 과정에서 동료의 견해를 수용하고 갈등을 중재하는 우수한 의사소통 역량을 발휘함.
- 교육 심리 및 미래 에듀테크 분야에 대한 관심을 확장적인 독서 및 자율주도 퀘스트 완수로 구체화함.

**3. 📝 [나이스(NEIS) 입력 초안] 분야별 분할 제공**
▶ **[교과 세부능력 및 특기사항 참고안]**
> 영어 및 통합사회 교과 학습 과정에서 깊은 지적 호기심과 분석력을 바탕으로 자율적인 탐구를 실천함. 공공 교육 데이터를 시계열적으로 분석하여 '지역 간 교육 격차 및 맞춤 멘토링 기획안'을 심층 보고서로 완성하며 뛰어난 사회적 공감 능력과 정보 처리 역량을 증명함. TED 교육학 강연을 자율 강독하고 토론을 주도하는 등 비판적 사유와 자기주도 학습 태도가 돋보임.

▶ **[진로 및 창의적 체험 활동 참고안]**
> 중등 교사 및 진로 상담 멘토를 목표로 매주 교과 연계 코넬 노트 탐구 일지를 구조화하여 기록하고 실천함. 청소년 정서 상담을 위한 기획 아이디어를 프로토타입 설계서로 구현하는 등 타인을 배려하는 감수성과 창작 열정을 균형 있게 발휘함.

---
⚠️ **[안내]** 본 리포트는 입력된 활동 데이터와 목표를 바탕으로 2026학년도 기재요령에 맞춰 블라인드 및 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 확인 후 윤문해 주시기 바랍니다.`,
  },
  {
    id: "std-2",
    name: "이재현",
    grade: 2,
    classNo: 4,
    studentNo: 18,
    riasecCode: "RC",
    targetJob: "기계·로봇 공학 엔지니어",
    level: 4,
    questCount: 11,
    portfolioCount: 4,
    habitSuccessRate: 86,
    targetAvgScore: "이번 학기 목표: 평균 88.0점 (현재 85.2점 / 📈 끈기 있게 상승 중!)",
    studyGoals: [
      { subject: "🔬 물리학 I", target: "지필 90점 이상 & 역학 실험 만점", currentStatus: "역학 과제 완수 & 88점 달성 중", score: 88 },
      { subject: "📐 수학 I (삼각함수)", target: "오답 노트 100% 해금", currentStatus: "✓ 100% 목표 달성 완료", score: 92 },
    ],
    cornellNotes: [
      { subject: "🔬 물리학 I & 로보틱스", topic: "센서 기반 자율주행 모션 로봇 하드웨어 조합 및 역학 검증", aiSummary: "물리학 역학 단원 원리를 로봇 센서 제어 알고리즘과 실험으로 융합하여 남다른 실증적 해결력을 선보임.", date: "2026.07.23" },
      { subject: "📚 문학 & 공학 윤리", topic: "과학 기술 고전 비판적 독서 및 기계 윤리 지정 토론 요약본", aiSummary: "로봇 기술의 윤리적 쟁점을 논리적 근거로 체계화하여 성실하고 책임감 있는 자세를 보임.", date: "2026.07.12" },
    ],
    diagnosticStatus: {
      interest: "완료 (RC 공학 실증형)",
      intelligence: "완료 (논리·수학 지능 상위 3%)",
      learningStyle: "완료 (실전 문제 해결 귀납형)",
    },
    competencyScores: {
      selfDirected: 88,
      majorExploration: 95,
      problemSolving: 96,
      communication: 82,
    },
    recentPortfolios: [
      { title: "센서 기반 자율주행 모션 로봇 하드웨어 조합 및 알고리즘 검증 실습", category: "공학 실험", date: "2026.07.23", status: "검토 완료" },
      { title: "과학 기술 고전 비판적 독서 및 기계 윤리 지정 토론 요약본", category: "전공 독서", date: "2026.07.12", status: "검토 완료" },
    ],
    activities: [
      "센서 기반 자율주행 모션 로봇 하드웨어 조합 및 알고리즘 검증 실습",
      "과학 기술 고전 비판적 독서 및 기계 윤리 지정 토론 메인 발언",
    ],
    guidelineSample: `### 📊 [이재현 학생] 2026 AI 생기부 리포트 (교과 & 진로 통합)

**1. 📌 학생 정량 목표 및 활동 팩트 (Fact)**
- 물리학 I 역학 실험 만점 및 수학 I 오답 해금을 목표로 꾸준히 학업 성취를 높여 나가고 있음.
- 진로 탐구 및 공학 기초 활동 시간 동안 센서 기반 자율주행 모션 로봇의 동작 과정을 실험하고 코드를 수정함.
- RC(현실·관습형) 강점을 살려 기계장치의 오류 발생 로그를 수치화하고 대안 코드를 단계적으로 구성함.

**2. 🌱 성장 및 행동 특성 분석 (Growth)**
- 복잡한 물리·공학적 오류 상황 앞에서 포기하지 않고 가설 검증을 통해 실증적인 해답을 유도하는 끈기 있는 탐구 자세를 보임.
- 실험 기재 및 도구를 안전하고 체계적으로 다루며 정교하게 결과물을 수정해 나가는 집중력이 돋보임.

**3. 📝 [나이스(NEIS) 입력 초안] 분야별 분할 제공**
▶ **[교과 세부능력 및 특기사항 참고안]**
> 물리학 I 및 수학 I 학습 과정에서 교과 원리를 실제 사물인터넷 및 공학 기기에 적용하려는 실증적 열정이 탁월함. '센서 기반 모션 로봇 하드웨어 실습 및 알고리즘 검증'을 주도하며 주행 중 발생한 오작동의 역학적 원인을 수치화하고 정교한 코드 변경으로 해결해 냄. 과제 수행 시 끈기 있게 가설을 증명하는 과학적 탐구 태도가 두드러짐.

▶ **[진로 및 창의적 체험 활동 참고안]**
> 기계·로봇 공학 엔지니어로의 확고한 꿈을 지니고 과학 기술 고전 독서 및 윤리 토론에 적극 참여함. 기술 발전이 공동체에 미치는 영향을 논리적으로 개진하며 협업 시 실질적인 기여를 해내는 등 전도유망한 엔지니어로서의 성장 가능성을 드러냄.

---
⚠️ **[안내]** 본 리포트는 입력된 활동 데이터와 목표를 바탕으로 2026학년도 기재요령에 맞춰 블라인드 및 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 확인 후 윤문해 주시기 바랍니다.`,
  },
  {
    id: "std-3",
    name: "박도훈",
    grade: 2,
    classNo: 4,
    studentNo: 24,
    riasecCode: "IA",
    targetJob: "빅데이터 및 AI 전문가",
    level: 4,
    questCount: 9,
    portfolioCount: 5,
    habitSuccessRate: 82,
    targetAvgScore: "이번 학기 목표: 평균 85.0점 (현재 83.1점 / 🎯 집중력 발휘 중!)",
    studyGoals: [
      { subject: "💻 정보 & 코딩", target: "파이썬 알고리즘 실습 상위 1% 달성", currentStatus: "✓ 실습 만점 및 과제 완료", score: 96 },
      { subject: "📐 확률과 통계", target: "85점 이상 쟁취", currentStatus: "기출 모의실전 완수 중", score: 84 },
    ],
    cornellNotes: [
      { subject: "💻 정보 × 📐 통계", topic: "파이썬 데이터 분석 모듈 기반 기후 환경 통계 시각화 실습", aiSummary: "기후 변동 복합 데이터를 차트 및 구조화된 예측 모델로 가공하여 우수한 논리 추론력을 발휘함.", date: "2026.07.25" },
    ],
    diagnosticStatus: {
      interest: "완료 (IA 데이터 분석형)",
      intelligence: "완료 (공간·디지털 직관력 상위 1.5%)",
      learningStyle: "진행 중 (시각적 구조화)",
    },
    competencyScores: {
      selfDirected: 90,
      majorExploration: 94,
      problemSolving: 92,
      communication: 86,
    },
    recentPortfolios: [
      { title: "파이썬 데이터 분석 모듈 기반 통계 시각화 실습 완성", category: "소프트웨어", date: "2026.07.25", status: "확인 대기" },
      { title: "기후 환경 통계 머신러닝 데이터 집합체 구축 문서", category: "데이터 분석", date: "2026.07.18", status: "검토 완료" },
    ],
    activities: [
      "파이썬 데이터 분석 모듈 기반 통계 시각화 실습 완성",
      "기후 환경 통계 머신러닝 데이터 집합체 구축 및 발표",
    ],
    guidelineSample: `### 📊 [박도훈 학생] 2026 AI 생기부 리포트 (교과 & 진로 통합)

**1. 📌 학생 정량 목표 및 활동 팩트 (Fact)**
- 정보 교과 파이썬 실습 및 확률과 통계 목표 고지를 실질적인 포트폴리오 성과로 직결시킴.
- 교내 진로 시간 및 정보학 탐구 활동에서 데이터 구조와 분석 모델링을 주제로 보고서를 완성함.
- IA(탐구·예술형) 흥미유형 바탕의 독창적 가설을 설정하여 데이터를 시각적인 차트로 재구성함.

**2. 🌱 성장 및 행동 특성 분석 (Growth)**
- 논리적 데이터 가이드라인을 설계하면서 복잡한 수치를 누구나 직관적으로 이해할 수 있는 정보로 변조하는 능력이 신장됨.
- 과제 수행 과정에서 스스로 심화 문헌과 자료를 검색하며 지적 완성도를 높이고자 노력함.

**3. 📝 [나이스(NEIS) 입력 초안] 분야별 분할 제공**
▶ **[교과 세부능력 및 특기사항 참고안]**
> 정보 교과 및 통계 학습 과정에서 빅데이터와 인공지능에 대한 열정으로 파이썬 데이터 분석 모듈 기반의 통계 시각화 실습을 훌륭히 마침. 복잡한 기후 환경 통계를 차트 및 구조화된 기초 머신러닝 모델로 변환하는 등 남다른 자료 가공 역량과 수학적 추론 능력을 증명함.

▶ **[진로 및 창의적 체험 활동 참고안]**
> 빅데이터 및 AI 전문가로의 진로를 정립하고 관련 프로그래밍 생태계를 주도적으로 탐색함. 스스로 심화 기술 문헌을 조사하며 프로젝트의 완성도를 높이려는 성실함과 지적 몰입도가 돋보임.

---
⚠️ **[안내]** 본 리포트는 입력된 활동 데이터와 목표를 바탕으로 2026학년도 기재요령에 맞춰 블라인드 및 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 확인 후 윤문해 주시기 바랍니다.`,
  },
];

export const TeacherGuide: React.FC = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<"diagnostics" | "portfolio" | "recordDraft">("diagnostics");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("std-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedGuideline, setGeneratedGuideline] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const baseStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];
  const activeStudent = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
      if (stored && stored.length > 0) {
        const addedPortfolios = stored.map((act: any) => ({
          title: act.title || "학생 자율 제출 세특 활동",
          category: act.category ? act.category.split(" ")[0] : "학생 기록",
          date: act.date || "오늘",
          status: "검토 완료",
        }));
        const addedActivities = stored.map((act: any) => `${act.title} (학생 직접 서술 활동: ${act.content ? act.content.slice(0, 40) : ""}...)`);
        return {
          ...baseStudent,
          portfolioCount: baseStudent.portfolioCount + stored.length,
          recentPortfolios: [...addedPortfolios, ...baseStudent.recentPortfolios],
          activities: [...addedActivities, ...baseStudent.activities],
        };
      }
    } catch {}
    return baseStudent;
  })();

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) => s.name.includes(searchQuery) || s.targetJob.includes(searchQuery) || s.riasecCode.includes(searchQuery)
  );

  // Load guideline automatically on student switch
  useEffect(() => {
    setGeneratedGuideline(activeStudent.guidelineSample || null);
    setCopied(false);
  }, [activeStudent]);

  const handleExtractAiGuideline = async () => {
    setIsExtracting(true);
    try {
      const res = await executeAiPrompt({
        promptType: "saengbu_guideline",
        studentName: activeStudent.name,
        riasecCode: activeStudent.riasecCode,
        targetJob: activeStudent.targetJob,
        activities: activeStudent.activities,
      });
      if (res.content) {
        setGeneratedGuideline(res.content);
      }
    } catch (error) {
      console.warn("AI 추출 지연, 기본 2026 가이드안 샘플 표출", error);
      setGeneratedGuideline(activeStudent.guidelineSample || "데이터 없음");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopy = () => {
    if (!generatedGuideline) return;
    navigator.clipboard.writeText(generatedGuideline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-[#1A1626] py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#7B5CF0]/20">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#cac4d7]/70 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#EFEDF5] text-[#1A1626] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-[#cac4d7]/50">
              <ShieldCheck className="w-4 h-4 text-[#6240D5]" />
              <span>2026학년도 교육부 기재요령 · AI 생기부 어시스턴트 학급 보드</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1A1626] flex items-center gap-2.5">
              <span>👨‍🏫 교사용 학급 학생 맞춤 관리 보드</span>
            </h1>
            <p className="text-sm text-[#484554] font-medium leading-relaxed">
              소속: <strong className="text-[#6240D5]">{session?.school || "서울창의고등학교"}</strong> 진로학업관리부 · 학생들의 자기이해 진단, 포트폴리오 퀘스트 이행 내역을 실시간 관제하고 NEIS 팩트 리포트를 즉시 생성합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/">
              <Button variant="outline" size="sm" className="font-extrabold text-xs border-[#cac4d7] whitespace-nowrap bg-white shadow-sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1 inline" /> 학생 주도 화면 전환
              </Button>
            </Link>
            <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#006970]/15 text-[#006970] border border-[#006970]/20 whitespace-nowrap shadow-sm">
              ● 학급 데이터 자동 보호 활성
            </span>
          </div>
        </div>

        {/* 3-TAB MANAGEMENT NAVIGATION BOARD */}
        <div className="flex border-b border-[#cac4d7]/60 overflow-x-auto gap-2 sm:gap-4 pb-0">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-black text-sm transition-all whitespace-nowrap border-t-2 border-x-2 ${
              activeTab === "diagnostics"
                ? "bg-[#6240d5] text-white border-[#6240d5] shadow-md"
                : "bg-[#efedf5] text-[#484554] border-[#cac4d7]/40 hover:bg-[#e9e7ef]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>학급 학생 진단 현황 및 역량 분석</span>
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-black text-sm transition-all whitespace-nowrap border-t-2 border-x-2 ${
              activeTab === "portfolio"
                ? "bg-[#6240d5] text-white border-[#6240d5] shadow-md"
                : "bg-[#efedf5] text-[#484554] border-[#cac4d7]/40 hover:bg-[#e9e7ef]"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>활동 내역 및 포트폴리오 관리</span>
          </button>

          <button
            onClick={() => setActiveTab("recordDraft")}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-black text-sm transition-all whitespace-nowrap border-t-2 border-x-2 ${
              activeTab === "recordDraft"
                ? "bg-[#006970] text-white border-[#006970] shadow-md"
                : "bg-[#efedf5] text-[#484554] border-[#cac4d7]/40 hover:bg-[#e9e7ef]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2026 AI 생활기록부 초안 생성</span>
          </button>
        </div>

        {/* TAB 1: DIAGNOSTIC REPORTS & GROWTH ANALYSIS */}
        {activeTab === "diagnostics" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-[28px] bg-white border border-[#cac4d7]/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#484554] uppercase tracking-wider block mb-1 whitespace-nowrap">총 학급 인원 및 진단 완수</span>
                  <span className="text-3xl font-extrabold text-[#1A1626]">3명 / 3명 (100%)</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#6240d5]/10 text-[#6240d5] flex items-center justify-center font-bold text-2xl shadow-inner">
                  🎯
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-[#cac4d7]/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#484554] uppercase tracking-wider block mb-1 whitespace-nowrap">주요 희망 직업 분포군</span>
                  <span className="text-xl font-extrabold text-[#006970] truncate">AI/로봇 · 빅데이터 · 교육멘토</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#006970]/10 text-[#006970] flex items-center justify-center font-bold text-2xl shadow-inner">
                  🚀
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white border border-[#cac4d7]/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#484554] uppercase tracking-wider block mb-1 whitespace-nowrap">학급 평균 역량 성장율</span>
                  <span className="text-3xl font-extrabold text-[#6240d5]">+18.4% 상승 ✨</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#7b5cf0]/15 text-[#6240d5] flex items-center justify-center font-bold text-2xl shadow-inner">
                  📈
                </div>
              </div>
            </div>

            {/* Diagnostics Roster Table */}
            <div className="bg-white rounded-[32px] p-8 border border-[#cac4d7]/60 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cac4d7]/40 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#1A1626] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#6240d5]" />
                    <span>2학년 4반 학생별 자기이해 3종 진단 상태 및 역량 점수</span>
                  </h3>
                  <p className="text-xs text-[#484554]">학생들의 진단 리포트 완결 현황을 실시간 확인하고 각 역량 축을 파악하세요.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#6E6A80] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="학생명 또는 흥미유형 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F4F2FA] border border-[#cac4d7]/50 text-[#1A1626] focus:outline-none focus:ring-2 focus:ring-[#6240d5] font-bold shadow-inner"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1A1626] text-xs font-black text-[#484554] uppercase">
                      <th className="py-3 px-4 whitespace-nowrap">학생명 (번호)</th>
                      <th className="py-3 px-4 whitespace-nowrap">RIASEC 유형</th>
                      <th className="py-3 px-4 whitespace-nowrap">대표 지망 직무</th>
                      <th className="py-3 px-4 whitespace-nowrap">흥미무드 진단</th>
                      <th className="py-3 px-4 whitespace-nowrap">다중지능 역량</th>
                      <th className="py-3 px-4 whitespace-nowrap">학습스타일 진단</th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">종합 성장지수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#cac4d7]/40 text-sm font-semibold">
                    {filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-[#f4f2fa]/70 transition-colors">
                        <td className="py-4 px-4 whitespace-nowrap font-black text-[#1A1626]">
                          {std.name} <span className="text-xs font-semibold text-[#484554] ml-1">({std.studentNo}번)</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-[#6240d5] text-white text-xs font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {std.riasecCode}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-[#006970] whitespace-nowrap">
                          ★ {std.targetJob}
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-[#1A1626] whitespace-nowrap">
                          {std.diagnosticStatus.interest}
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-[#1A1626] whitespace-nowrap">
                          {std.diagnosticStatus.intelligence}
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-[#1A1626] whitespace-nowrap">
                          <span className={std.diagnosticStatus.learningStyle.includes("완료") ? "text-[#006970]" : "text-[#d97706]"}>
                            {std.diagnosticStatus.learningStyle}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 bg-[#efedf5] border border-[#cac4d7] text-[#6240d5] px-3 py-1 rounded-full text-xs font-black">
                            <span>Lv.{std.level}</span>
                            <span>(달성도 {std.habitSuccessRate}%)</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVITY LOGS & PORTFOLIO CONTROL */}
        {activeTab === "portfolio" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-[32px] p-8 border border-[#cac4d7]/60 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#cac4d7]/40 pb-5">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A1626] flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#006970]" />
                    <span>학생별 학습 목표 설정 & 활동·포트폴리오 검토 보드</span>
                  </h3>
                  <p className="text-xs text-[#484554] mt-1">
                    학생들의 이번 학기 정량적 KPI 목표, 교과 연계 코넬 노트, 진로 동아리 스펙을 검증하고 생기부 근거 자료로 파악하세요.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-[#e6deff] text-[#6240d5] px-4 py-2 rounded-2xl border border-[#cbbeff] whitespace-nowrap shadow-sm">
                    ✨ 전수 활동 데이터 AI 정상 동기화 중
                  </span>
                </div>
              </div>

              {/* Student Comprehensive Cards */}
              <div className="space-y-8">
                {filteredStudents.map((std) => (
                  <div key={std.id} className="p-7 rounded-[32px] bg-[#f4f2fa]/80 border-2 border-[#cac4d7]/70 hover:border-[#6240d5]/80 transition-all space-y-6 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#cac4d7]/50 pb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg font-black text-[#1A1626] flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#6240D5] animate-ping inline-block" />
                          {std.name} ({std.grade}학년 {std.classNo}반 {std.studentNo}번)
                        </span>
                        <span className="text-xs font-extrabold bg-[#006970] text-white px-3.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                          지망: {std.targetJob}
                        </span>
                        <span className="text-xs font-extrabold text-[#6240d5] bg-white px-3.5 py-1 rounded-full border border-[#cac4d7]/60 whitespace-nowrap shadow-sm">
                          퀘스트 완수 {std.questCount}건
                        </span>
                      </div>
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => {
                          setSelectedStudentId(std.id);
                          setActiveTab("recordDraft");
                        }}
                        className="font-black whitespace-nowrap text-xs shadow-md px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006970] to-[#00929A] text-white"
                      >
                        이 학생 AI 생기부 리포트 생성 &rarr;
                      </Button>
                    </div>

                    {/* Section A: 정량적 학습 목표 (KPI) & 과목별 타겟 */}
                    {std.studyGoals && std.studyGoals.length > 0 && (
                      <div className="space-y-3 bg-gradient-to-br from-[#E6FBFF]/80 via-[#F2FCFF]/90 to-white p-5 rounded-2xl border border-[#A6E8F2] shadow-inner">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A6E8F2]/60 pb-2.5">
                          <h4 className="text-xs font-black text-[#006970] flex items-center gap-1.5 uppercase tracking-wide">
                            🎯 [ 이번 학기 정량적 학습 목표 및 KPI 현황 ]
                          </h4>
                          <span className="text-xs font-extrabold text-[#005257] bg-white px-3 py-1 rounded-lg border border-[#A6E8F2] shadow-sm">
                            {std.targetAvgScore || "목표 수립 완료"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {std.studyGoals.map((g, idx) => (
                            <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#C2F0F7] shadow-sm flex flex-col justify-between">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-black text-[#1A1626]">{g.subject}</span>
                                <span className="text-[11px] font-extrabold bg-[#006970]/10 text-[#006970] px-2 py-0.5 rounded-md">
                                  현재 {g.score}점
                                </span>
                              </div>
                              <span className="text-xs font-bold text-[#3B364C] truncate mb-1">목표: {g.target}</span>
                              <span className="text-[11px] font-extrabold text-[#059669] pt-1 border-t border-slate-100">
                                ⚡ {g.currentStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section B: AI 학습포트폴리오 (코넬 노트) */}
                    {std.cornellNotes && std.cornellNotes.length > 0 && (
                      <div className="space-y-3 bg-gradient-to-br from-[#F5EFFF] via-white to-[#FAF6FF] p-5 rounded-2xl border border-[#D5CAFF] shadow-inner">
                        <h4 className="text-xs font-black text-[#6240D5] flex items-center gap-1.5 uppercase tracking-wide border-b border-[#D5CAFF]/60 pb-2">
                          📘 [ AI 학습포트폴리오 · 교과 연계 코넬 노트 심화 요약 ]
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {std.cornellNotes.map((cn, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white border border-[#D5CAFF] shadow-sm space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black bg-[#6240D5] text-white px-2.5 py-0.5 rounded-md">
                                  {cn.subject}
                                </span>
                                <span className="text-[11px] font-bold text-[#6E6A80]">{cn.date}</span>
                              </div>
                              <strong className="text-xs font-extrabold text-[#1A1626] block leading-snug">
                                {cn.topic}
                              </strong>
                              <p className="text-[11px] font-semibold text-[#484554] bg-[#F8F6FF] p-2.5 rounded-lg border border-purple-50 leading-relaxed">
                                ✨ <strong>AI 세특 요약:</strong> {cn.aiSummary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section C: 진로 포트폴리오 스펙 및 자율/동아리 */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#3D3554] flex items-center gap-1.5 pl-1">
                        💼 [ 진로 포트폴리오 스펙 및 활동 제출 보드 ]
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {std.recentPortfolios.map((pf, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-white border border-[#cac4d7]/60 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-[#6240d5] bg-[#efedf5] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                  {pf.category}
                                </span>
                                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                                  pf.status === "검토 완료" ? "bg-[#006970]/15 text-[#006970]" : "bg-[#d97706]/15 text-[#d97706]"
                                }`}>
                                  {pf.status === "검토 완료" ? "✓ 검토 완료" : "⌛ 확인 대기"}
                                </span>
                              </div>
                              <strong className="text-sm font-black text-[#1A1626] block leading-tight">
                                {pf.title}
                              </strong>
                            </div>

                            <div className="pt-2 border-t border-[#cac4d7]/30 flex items-center justify-between text-[11px] text-[#484554] font-bold">
                              <span>등록일: {pf.date}</span>
                              <span className="text-[#6240d5] cursor-pointer hover:underline font-black whitespace-nowrap">원문 열람 &rarr;</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 2026 AI SCHOOL RECORD DRAFTS */}
        {activeTab === "recordDraft" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* LEFT: STUDENT ROSTER (4 COL) */}
            <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-[#cac4d7]/70 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#1A1626] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6240d5]" />
                  <span>학급 학생 선택 ({filteredStudents.length}명)</span>
                </h2>
                <span className="text-xs text-[#484554] font-extrabold">2학년 4반</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#6E6A80] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="이름 또는 지망 꿈 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-3 rounded-2xl bg-[#F4F2FA] border border-[#cac4d7]/50 text-[#1A1626] focus:outline-none focus:ring-2 focus:ring-[#6240d5] font-bold shadow-inner"
                />
              </div>

              {/* Student List */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredStudents.map((s) => {
                  const isSelected = s.id === selectedStudentId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-[#6240d5]/10 border-[#6240d5] shadow-md scale-[1.02]"
                          : "bg-[#F4F2FA]/60 border-[#cac4d7]/60 hover:bg-[#F4F2FA] hover:border-[#6240d5]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-black text-[#1A1626] flex items-center gap-1.5 whitespace-nowrap">
                          <span>{s.name}</span>
                          <span className="text-xs text-[#484554] font-bold">
                            ({s.studentNo}번)
                          </span>
                        </span>
                        <span className="text-[11px] font-black bg-[#6240d5] text-white px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                          {s.riasecCode}
                        </span>
                      </div>
                      <span className="text-xs text-[#006970] font-extrabold block truncate mb-2">
                        ★ {s.targetJob}
                      </span>
                      <div className="pt-2 border-t border-[#cac4d7]/40 flex items-center justify-between text-xs text-[#484554] font-bold">
                        <span className="whitespace-nowrap">누적 퀘스트: {s.questCount}건</span>
                        <span className="text-[#6240d5] whitespace-nowrap font-black">습관 진척률: {s.habitSuccessRate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: AI ASSISTANT REPORT GENERATOR (8 COL) */}
            <div className="lg:col-span-8 bg-white rounded-[32px] p-8 border border-[#cac4d7]/70 shadow-sm space-y-6">
              
              {/* Student Overview Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#f4f2fa] to-[#efedf5] border border-[#cac4d7]/60 shadow-inner">
                <div className="space-y-1">
                  <span className="text-xs font-black text-[#6240d5] uppercase tracking-wider block whitespace-nowrap">
                    2026 NEIS SCHOOL RECORD GENERATOR
                  </span>
                  <h3 className="text-xl font-black text-[#1A1626]">
                    {activeStudent.name} <span className="text-sm font-bold text-[#006970] ml-1">| 대표 꿈: {activeStudent.targetJob}</span>
                  </h3>
                  <p className="text-xs font-bold text-[#484554]">
                    RIASEC 유형: {activeStudent.riasecCode} · 누적 포트폴리오 {activeStudent.portfolioCount}개 및 진단 결과 연결됨
                  </p>
                </div>

                <button
                  onClick={handleExtractAiGuideline}
                  disabled={isExtracting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#006970] hover:bg-[#005459] text-white font-black text-sm shadow-md transition-all disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${isExtracting ? "animate-spin" : ""}`} />
                  <span>AI 생기부 리포트 새로 생성</span>
                </button>
              </div>

              {/* Strict Rules Notification Bar */}
              <div className="p-4 rounded-2xl bg-[#006970]/15 border border-[#006970]/40 flex items-center justify-between text-xs font-extrabold text-[#1A1626] shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006970] flex-shrink-0" />
                  <span>2026학년도 기재 금지 사항(공인시험, 교외수상, 학원명, 실명) 100% 블라인드 및 명사형 어미 자동 종결 준수</span>
                </div>
              </div>

              {/* Generated Report View Box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-base font-black text-[#1A1626] flex items-center gap-2 whitespace-nowrap">
                    <FileText className="w-5 h-5 text-[#6240d5]" />
                    <span>AI 생기부 참고안 출력 결과 (NEIS 입력 및 검토용)</span>
                  </h4>

                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-full border shadow-sm transition-all whitespace-nowrap ${
                      copied
                        ? "bg-[#006970] text-white border-[#006970]"
                        : "bg-[#6240d5] text-white border-[#6240d5] hover:bg-[#4a21be]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 inline" />
                        <span>클립보드 복사 성공!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 inline" />
                        <span>원클릭 텍스트 전체 복사</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-[#FBF8FF] border-2 border-[#cac4d7]/70 shadow-inner space-y-4 text-sm leading-relaxed text-[#1A1626] font-medium font-mono whitespace-pre-wrap selection:bg-[#6240d5]/30 overflow-x-auto">
                  {isExtracting ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3 text-[#484554]">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#6240d5]" />
                      <span className="font-sans font-black text-sm text-[#1A1626]">2026 기재요령 준칙에 맞춰 학생의 누적 퀘스트와 진단 결과를 분석 중입니다...</span>
                    </div>
                  ) : (
                    generatedGuideline
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherGuide;
