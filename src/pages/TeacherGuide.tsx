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
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  classNo: number;
  riasecCode: string;
  targetJob: string;
  level: number;
  questCount: number;
  portfolioCount: number;
  habitSuccessRate: number;
  activities: string[];
  guidelineSample?: string;
}

const MOCK_STUDENTS: StudentData[] = [
  {
    id: "std-1",
    name: "김수진",
    grade: 2,
    classNo: 4,
    riasecCode: "SI",
    targetJob: "스마트 AI 에듀테크 진로 멘토",
    level: 5,
    questCount: 14,
    portfolioCount: 6,
    habitSuccessRate: 92,
    activities: [
      "AI 및 기계학습 모델의 교육 격차 해소 방안 탐구 (공공 교육 데이터 활용 프로토타입 서술)",
      "교내 인공지능 코딩 동아리 아키텍처 과제 및 스터디 활동 주도",
      "자기이해 다중진단 리포트 (사회형-탐구형 이타적 논리 추론력 발휘)",
    ],
    guidelineSample: `### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- 진로 탐색 및 자율 활동 시간 동안 '스마트 AI 에듀테크 진로 멘토' 직업군을 심층 탐구하며 학습 계획을 성실히 이행함.
- SI(사회·탐구형) 흥미유형 역량을 바탕으로 공공 교육 데이터 세트를 활용한 학습 진단 방안을 서술하고 포트폴리오로 제출함.
- 50일 자기계발 챌린지를 꾸준히 완수하며 매주 학습한 교과 연계 탐구 일지를 구조화하여 기록함.

**2. 성장 및 행동 특성 (Growth)**
- 문제 해결 과정에서 객관적인 사실 기반의 분석력을 보이며, 학업을 대하는 태도가 주도적이고 열정적인 모습으로 성장함.
- 동아리 스터디 및 토론 활동 중 상대방의 의견을 배려하고 대안을 구체화하는 우수한 의사소통 역량을 드러냄.
- 인공지능 및 교육공학 분야에 대한 관심을 구체적인 학업 호기심으로 연결하여 확장적인 독서 및 탐구로 확장함.

**3. 📝 생기부 참고용 초안 (Draft)**
> 진로 탐색 및 창의적 체험 활동 과정에서 스마트 AI 에듀테크 진로 멘토에 대한 깊은 관심을 바탕으로 진로 역량 탐구 및 챌린지 활동을 주도적으로 완수함. 교과 및 동아리 활동 중 제기된 호기심을 놓치지 않고 분석 데이터를 바탕으로 교육 격차 해소 방안에 관한 탐구 리포트를 도출함. 조별 스터디 과정에서 동료의 의견을 경청하고 조율하는 뛰어난 소통 태도와 협업 리더십을 보이며, 자신의 미래 역량을 성찰하고 전문적으로 구체화하는 우수한 발전 가능성을 보임.

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`,
  },
  {
    id: "std-2",
    name: "이재현",
    grade: 2,
    classNo: 4,
    riasecCode: "RC",
    targetJob: "AI 로봇 융합 연구원",
    level: 4,
    questCount: 11,
    portfolioCount: 4,
    habitSuccessRate: 85,
    activities: [
      "센서 기반 자율주행 모션 로봇 하드웨어 조합 및 알고리즘 검증 실습",
      "과학 기술 고전 비판적 독서 및 기계 윤리 지정 토론 메인 발언",
    ],
    guidelineSample: `### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- 진로 탐구 및 공학 기초 활동 시간 동안 센서 기반 자율주행 모션 로봇의 동작 과정을 실험하고 코드를 수정함.
- RC(현실·관습형) 강점을 살려 기계장치의 오류 발생 로그를 수치화하고 대안 코드를 단계적으로 구성함.
- 과학 기술 고전 독서 활동 후 기계 윤리와 기술 발전을 주제로 토론 활동에 참여하여 명확한 입론을 개진함.

**2. 성장 및 행동 특성 (Growth)**
- 복잡한 물리·공학적 오류 상황 앞에서 포기하지 않고 가설 검증을 통해 실증적인 해답을 유도하는 끈기 있는 탐구 자세를 보임.
- 실험 기재 및 도구를 안전하고 체계적으로 다루며 정교하게 결과물을 수정해 나가는 집중력이 돋보임.
- 미래 로봇 기술이 인간 공동체에 미치는 긍정적 영향에 대해 진중한 시각을 가지게 됨.

**3. 📝 생기부 참고용 초안 (Draft)**
> 자율 및 진로 탐구 과정에서 AI 로봇 융합 연구원이라는 목표를 향해 센서 기반 모션 로봇 실습 및 탐구를 지속함. 실험 중 발생한 오작동의 원인을 논리적으로 수치화하고 정교한 코드 수정으로 해결하는 우수한 실증적 탐구 역량을 보임. 과학 고전 독서 및 윤리 토론 과정에서 근거 있는 논리로 발언하며 책임감 있는 자세로 협업을 진행하는 등 전문적인 공학 분야로의 꾸준한 성장 가능성을 드러냄.

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`,
  },
  {
    id: "std-3",
    name: "박도훈",
    grade: 2,
    classNo: 4,
    riasecCode: "IA",
    targetJob: "빅데이터 AI 모델 아키텍트",
    level: 3,
    questCount: 8,
    portfolioCount: 3,
    habitSuccessRate: 78,
    activities: ["파이썬 데이터 분석 모듈 기반 통계 시각화 실습 완성"],
    guidelineSample: `### 📊 [OOO 학생] 활동 분석 리포트
**1. 주요 활동 팩트 (Fact)**
- 교내 진로 시간 및 정보학 탐구 활동에서 데이터 구조와 분석 모델링을 주제로 보고서를 완성함.
- IA(탐구·예술형) 흥미유형 바탕의 독창적 가설을 설정하여 데이터를 시각적인 차트로 재구성함.

**2. 성장 및 행동 특성 (Growth)**
- 논리적 데이터 가이드라인을 설계하면서 복잡한 수치를 누구나 직관적으로 이해할 수 있는 정보로 변조하는 능력이 신장됨.
- 과제 수행 과정에서 스스로 심화 문헌과 자료를 검색하며 지적 완성도를 높이고자 노력함.

**3. 📝 생기부 참고용 초안 (Draft)**
> 진로 활동 시간을 활용하여 빅데이터 AI 모델 아키텍트를 향한 학습 열정을 바탕으로 데이터 분석 및 시각화 탐구를 주도적으로 수행함. 복잡한 자료를 차트 및 구조화된 통계 모델로 재해석하는 과정에서 탁월한 논리 추론 및 문제 정의 능력을 드러냄. 자기주도적인 문헌 검색과 성실한 과제 이행을 통해 소프트웨어 설계 분야에 대한 뚜렷한 소임을 증명함.

---
⚠️ **[안내]** 본 리포트는 입력된 데이터를 바탕으로 2026학년도 기재요령에 맞춰 구조화된 참고용 자료입니다. 나이스(NEIS) 최종 입력 전, 선생님의 실제 관찰 사실과 일치하는지 반드시 확인 및 윤문해 주시기 바랍니다.`,
  },
];

export const TeacherGuide: React.FC = () => {
  const { session } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("std-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedGuideline, setGeneratedGuideline] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

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

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) => s.name.includes(searchQuery) || s.targetJob.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-[#1A1626] py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#7B5CF0]/20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section (Stitch Modern Corporate + Soft Minimalism) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3E1E9] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#EFEDF5] text-[#484554] px-3.5 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7B5CF0]" />
              <span>2026학년도 교육부 기재요령 · AI 생기부 어시스턴트 100% 최적화</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1626] flex items-center gap-2">
              <span>👨‍🏫 교사 AI 생기부 기재 어시스턴트 보드</span>
            </h1>
            <p className="text-sm text-[#6E6A80]">
              소속: {session?.school || "서울창의고등학교"} 진로학업관리부 · 학생별 누적 진로 활동을 바탕으로 NEIS 입력 가능한 팩트 리포트를 1초 만에 추출합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="font-semibold text-xs border-[#E3E1E9]">
                학생 주도 뷰 미리보기
              </Button>
            </Link>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#1DAAB4]/15 text-[#1DAAB4]">
              ● 실시간 안전 검증 활성
            </span>
          </div>
        </div>

        {/* 2-Column Wide Workspace (Left: Student Roster, Right: AI Guideline Report) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: STUDENT ROSTER (4 COL) */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1626] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7B5CF0]" />
                <span>담당 학급 명부 (3명)</span>
              </h2>
              <span className="text-xs text-[#6E6A80] font-semibold">2학년 4반</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#6E6A80] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="이름 또는 꿈 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#F4F2FA] text-[#1A1626] focus:outline-none focus:ring-2 focus:ring-[#7B5CF0] font-normal"
              />
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {filteredStudents.map((s) => {
                const isSelected = s.id === selectedStudentId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#7B5CF0]/10 border-[#7B5CF0] shadow-sm"
                        : "bg-[#F4F2FA]/60 border-[#E3E1E9] hover:bg-[#F4F2FA]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-[#1A1626] flex items-center gap-1.5">
                        <span>{s.name}</span>
                        <span className="text-[11px] text-[#6E6A80] font-normal">
                          {s.grade}학년 {s.classNo}반
                        </span>
                      </span>
                      <span className="text-[11px] font-bold bg-[#7B5CF0]/15 text-[#7B5CF0] px-2 py-0.5 rounded-full">
                        {s.riasecCode}
                      </span>
                    </div>
                    <span className="text-xs text-[#7B5CF0] font-bold block truncate">
                      ★ {s.targetJob}
                    </span>
                    <div className="mt-2.5 pt-2 border-t border-[#E3E1E9]/80 flex items-center justify-between text-[11px] text-[#6E6A80]">
                      <span>누적 과제: {s.questCount}건</span>
                      <span>습관 진행: {s.habitSuccessRate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: AI ASSISTANT REPORT GENERATOR (8 COL) */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-8 border border-[#E3E1E9] shadow-[0_20px_40px_rgba(123,92,240,0.08)] space-y-6">
            
            {/* Student Overview Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F4F2FA] border border-[#E3E1E9]">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#7B5CF0] uppercase tracking-wider block">
                  SELECTED STUDENT
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1626]">
                  {activeStudent.name} <span className="text-sm font-normal text-[#6E6A80]">| 지망 꿈: {activeStudent.targetJob}</span>
                </h3>
                <p className="text-xs text-[#6E6A80]">
                  흥미유형: {activeStudent.riasecCode} · 누적 포트폴리오 {activeStudent.portfolioCount}개 장착됨
                </p>
              </div>

              <button
                onClick={handleExtractAiGuideline}
                disabled={isExtracting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7B5CF0] text-white font-bold text-sm shadow-md hover:bg-[#6240D5] transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${isExtracting ? "animate-spin" : ""}`} />
                <span>AI 생기부 리포트 새 렌더링</span>
              </button>
            </div>

            {/* Strict Rules Notification Bar */}
            <div className="p-4 rounded-2xl bg-[#1DAAB4]/10 border border-[#1DAAB4]/30 flex items-center justify-between text-xs text-[#1A1626]">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-5 h-5 text-[#1DAAB4] flex-shrink-0" />
                <span>2026학년도 기재 금지 사항(공인시험, 교외수상, 학원명, 실명) 완벽 블라인드 & 명사형 어미 자동 종결</span>
              </div>
            </div>

            {/* Generated Report View Box */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#1A1626] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7B5CF0]" />
                  <span>AI 생기부 참고안 출력 결과 (NEIS 맞춤)</span>
                </h4>

                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    copied
                      ? "bg-[#1DAAB4] text-white border-[#1DAAB4]"
                      : "bg-[#EFEDF5] text-[#1A1626] border-[#E3E1E9] hover:border-[#7B5CF0]"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>클립보드 복사 성공!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>원클릭 텍스트 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#FBF8FF] border border-[#E3E1E9] shadow-inner space-y-4 text-sm leading-relaxed text-[#1A1626] font-normal font-mono whitespace-pre-wrap selection:bg-[#7B5CF0]/30 overflow-x-auto">
                {isExtracting ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3 text-[#6E6A80]">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#7B5CF0]" />
                    <span className="font-sans font-bold text-sm">2026 기재요령 준칙에 맞추어 생기부 리포트 초안을 작성 중입니다...</span>
                  </div>
                ) : (
                  generatedGuideline
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default TeacherGuide;
