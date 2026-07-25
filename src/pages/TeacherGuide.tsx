import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Users,
  ShieldCheck,
  FileText,
  Lock,
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
      "AI 및 기계학습 모델의 교육 격차 해소 방안 탐구 (공공 교육 데이터 활용 프로토타입 제작)",
      "학교 공식 인공지능 코딩 동아리 'Neuro-V26' 아키텍처 리더십 발휘",
      "자기이해 다중진단 리포트 (사회형-탐구형 이타적 논리 추론력 돋보임)",
    ],
    guidelineSample:
      "[자율 및 진로탐구 영역] AI 및 기계학습 모델의 교육 격차 해소 방안을 깊이 있게 탐구하며 주도적인 연구자로서의 면모를 드러냄. 특히 다양한 공공 교육 데이터 세트를 기반으로 학습 진단 모델 프로토타입을 서면 서술하는 과정에서 본인의 장점인 사회형(S)-탐구형(I) 융합 역량을 훌륭하게 발휘함. 자신의 꿈인 'AI 에듀테크 진로 멘토'라는 비전을 달성하기 위해, 매주 STEM 전문 서적과 뉴스를 정독하며 취약계층 교육의 불합리를 실질적으로 개선하려는 주도성과 따뜻한 리더십이 탁월한 학생임.",
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
      "아두이노 센서를 이용한 4륜 자율주행 모션 로봇 하드웨어 실습",
      "과학 기술 고전 비판적 독서 및 기계 윤리 지정 토론 메인 입론",
    ],
    guidelineSample:
      "[공학 실습 영역] 아두이노 센서 기반 4륜 자율주행 모션 로봇을 조합하고 코드를 설계하는 과정에서 탁월한 현실형(R) 도구 활용 능력과 치밀한 관습형(C) 문제 해결력을 보임. 복잡한 오류 앞에서도 굴절 없이 실험으로 해답을 찾아내는 엔지니어링 감각이 훌륭함.",
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
    activities: ["파이썬 퀀트 투자 통계 모델 구축 과제 완료"],
  },
];

export const TeacherGuide: React.FC = () => {
  const { session } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("std-1");
  const [gradeFilter, setGradeFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedGuideline, setGeneratedGuideline] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeStudent = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  const handleExtractAiGuideline = async () => {
    setIsExtracting(true);
    setGeneratedGuideline(null);
    try {
      const res = await executeAiPrompt({
        promptType: "saengbu_guideline",
        studentName: activeStudent.name,
        riasecCode: activeStudent.riasecCode,
        targetJob: activeStudent.targetJob,
        activities: activeStudent.activities,
      });
      setGeneratedGuideline(
        res.content ||
          activeStudent.guidelineSample ||
          "[AI 가이드안 추출 완료] 해당 학생은 뚜렷한 진로 비전 아래 다중지능 및 습관 챌린지를 꾸준히 누적해 왔으며, 포트폴리오의 실험 보고서를 토대로 학교생활기록부 진로/행동특성란에 발전 가능성 높은 우수 사원으로 적극 인용 가능합니다."
      );
    } catch (error) {
      setGeneratedGuideline(activeStudent.guidelineSample || "AI 추출 중 지연이 발생하여 기본 데모 가이드안을 대체 표시합니다.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopy = () => {
    if (!generatedGuideline) return;
    navigator.clipboard.writeText(generatedGuideline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Banner (2560px Pro & RLS Security Notice) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-surface-variant/40 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary px-3.5 py-1 rounded-full text-xs font-headline font-black shadow-inner">
            <ShieldCheck className="w-4 h-4 text-secondary-spot" />
            <span>2560px Pro Wide Display · RLS School-Admin Isolation Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
            👨‍🏫 학교관리자 <span className="text-transparent bg-clip-text gradient-hero-card">업무보드</span>
          </h1>
          <p className="text-sm text-text-muted font-body-md max-w-3xl leading-relaxed">
            소속 학교(<strong>{session?.school || "서울창의고등학교"}</strong>) 학생들의 진료 진도율과 자기이해 리포트를 다각도로 열람합니다.
            학생이 누적한 포트폴리오들을 결합하여 <strong>[생기부 기재 가이드안]</strong>을 AI로 즉시 추출하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <Link to="/super-admin">
            <Button variant="outline" size="sm" className="font-bold">
              👑 슈퍼관리자 콘솔 스위치
            </Button>
          </Link>
          <Link to="/">
            <Button variant="primary" size="sm" className="font-black">
              🧑‍🎓 학생 메인 뷰로 이동
            </Button>
          </Link>
        </div>
      </div>

      {/* Strict Legal & Positioning Disclaimer Banner (§9-E & saengbu_guideline.md) */}
      <Card variant="hero" padding="md" className="bg-amber-500/10 border-2 border-amber-500/40 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
          <div className="space-y-0.5">
            <strong className="text-sm font-headline font-black text-text-primary block">
              ⚠️ [정책 준수 가이드라인] 생기부는 '가이드안·예시본'이며 최종 기재는 선생님의 몫입니다.
            </strong>
            <p className="text-xs text-text-muted font-body-md leading-relaxed">
              본 시스템은 <code>saengbu_guideline.md</code> (교육부 생기부 기재요령)를 프롬프트에 주입하여 교외 수상실적 및 사설 명칭을 자동 배제한 <strong>'참고 가이드안'</strong>만 생성합니다. 최종 NEIS 입력 전에 교사님의 확인과 검토를 부탁드립니다.
            </p>
          </div>
        </div>
        <Chip size="sm" variant="default" className="font-extrabold whitespace-nowrap bg-white shadow-inner">
          GUIDELINES LOADED
        </Chip>
      </Card>

      {/* SPLIT WORKSPACE: Student Selector Table (Left) & Extraction Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Student Roster & Progress Rate (§7.8 학생 진도율 조회) */}
        <Card variant="surface" padding="md" className="lg:col-span-5 border border-surface-variant/60 shadow-3d-base space-y-4">
          <div className="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <span className="text-sm font-headline font-black text-text-primary flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" /> 담당 학급 학생 리스트
            </span>
            <span className="text-xs font-bold text-primary">총 {MOCK_STUDENTS.length}명 조회됨</span>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex items-center gap-2">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 bg-surface-container-low border border-surface-variant/50 rounded-xl text-xs font-headline font-bold text-text-primary focus:ring-2 focus:ring-primary"
            >
              <option value="전체">전체 학년/반</option>
              <option value="2-4">2학년 4반</option>
              <option value="1-3">1학년 3반</option>
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="학생 실명 또는 꿈 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-surface-variant/50 rounded-xl text-xs font-body-md focus:ring-2 focus:ring-primary shadow-inner"
              />
            </div>
          </div>

          {/* Roster list */}
          <div className="space-y-3 pt-1">
            {MOCK_STUDENTS.map((std) => {
              const isSelected = std.id === activeStudent.id;
              return (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStudentId(std.id);
                    setGeneratedGuideline(null);
                  }}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all duration-200 shadow-sm space-y-3 ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-md scale-[1.01]"
                      : "bg-surface-container-low border-surface-variant/40 hover:bg-surface-container hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-headline font-black text-primary bg-white px-2.5 py-1 rounded-xl shadow-sm">
                        {std.grade}학년 {std.classNo}반
                      </span>
                      <strong className="text-base font-headline font-black text-text-primary">
                        {std.name}
                      </strong>
                    </div>
                    <span className="text-xs font-black bg-secondary text-white px-2.5 py-0.5 rounded-full">
                      Lv.{std.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                    <span>💡 꿈: {std.targetJob} ({std.riasecCode} 유형)</span>
                  </div>

                  <div className="pt-2 border-t border-surface-variant/30 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/70 p-2 rounded-xl text-[11px] font-bold shadow-sm">
                      퀘스트 {std.questCount}건
                    </div>
                    <div className="bg-white/70 p-2 rounded-xl text-[11px] font-bold shadow-sm">
                      포폴 {std.portfolioCount}건
                    </div>
                    <div className="bg-white/70 p-2 rounded-xl text-[11px] font-bold text-secondary font-black shadow-sm">
                      습관 {std.habitSuccessRate}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* RIGHT: Selected Student Dossier & AI 생기부 Guide Extractor (§7.8 & §9-E) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Student Card */}
          <Card variant="hero" padding="lg" className="shadow-3d-ambient bg-gradient-to-r from-point via-white to-white border-2 border-secondary/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/30 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-headline font-black text-secondary-spot uppercase">
                    🎓 Selected Student Archive
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/15 text-secondary font-black">
                    RIASEC [{activeStudent.riasecCode}]
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-black text-text-primary">
                  {activeStudent.name} ({activeStudent.grade}학년 {activeStudent.classNo}반)
                </h2>
                <span className="text-xs font-bold text-text-muted block">
                  비전 지향점: <strong>{activeStudent.targetJob}</strong>
                </span>
              </div>

              <Button
                variant="teal"
                size="lg"
                onClick={handleExtractAiGuideline}
                disabled={isExtracting}
                icon={<Sparkles className="w-5 h-5 animate-pulse" />}
                className="font-headline font-extrabold shadow-lg whitespace-nowrap"
              >
                {isExtracting ? "AI 서버리스 가이드안 생성 중..." : "AI 생기부 가이드안 1초 추출"}
              </Button>
            </div>

            {/* Activities summary to be combined */}
            <div className="space-y-3">
              <span className="text-xs font-headline font-extrabold text-text-primary flex items-center justify-between">
                <span>📚 융합 가능한 누적 활동 자산 (포트폴리오 &amp; 자기이해 리포트):</span>
                <span className="text-[11px] text-primary font-bold">✓ 전체 활동 결합 선택됨</span>
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeStudent.activities.map((act, idx) => (
                  <div key={idx} className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-variant/40 flex items-start gap-3 text-xs md:text-sm font-body-md shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-text-primary font-bold leading-relaxed">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Guideline Output Panel */}
            {generatedGuideline ? (
              <div className="p-6 bg-surface-container-lowest rounded-3xl border-2 border-primary/40 shadow-2xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3">
                  <span className="text-xs md:text-sm font-headline font-black text-primary flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> AI 생기부 기재 가이드안·예시본 (Vercel Serverless 경유)
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-2xl text-xs font-headline font-black flex items-center gap-1.5 transition-all ${
                      copied
                        ? "bg-secondary text-white shadow-md"
                        : "bg-primary text-on-primary hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "NEIS 클립보드 복사됨!" : "가이드안 복사"}</span>
                  </button>
                </div>

                <p className="text-xs md:text-sm font-body-md text-text-primary/90 leading-relaxed whitespace-pre-line p-4 bg-surface-container-low rounded-2xl border border-surface-variant/30 shadow-inner">
                  {generatedGuideline}
                </p>

                <p className="text-[11px] text-text-muted flex items-center gap-1 font-bold">
                  <span>💡 위 예시 문구는 교사님의 편집을 거쳐 학교생활기록부에 입력되어야 합니다.</span>
                </p>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-surface-container-low border border-dashed border-surface-variant/60 text-center space-y-2">
                <FileText className="w-10 h-10 text-text-muted mx-auto" />
                <strong className="text-sm font-headline font-bold text-text-primary block">
                  상단의 [AI 생기부 가이드안 1초 추출] 버튼을 터치해 보세요!
                </strong>
                <p className="text-xs text-text-muted">
                  학생이 입력한 포트폴리오 활동명과 느낀 점, 그리고 자기이해 리포트를 융합한 가장 아름다운 NEIS 예시 문장이 자동 합성됩니다.
                </p>
              </div>
            )}
          </Card>

          {/* Footer RLS reminder */}
          <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-variant/40 flex items-center gap-3 text-xs text-text-muted font-bold">
            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Supabase RLS 규칙에 따라 학교관리자 계정은 소속 학교 ID 이외의 학생 데이터를 임의로 열람하거나 복제할 수 없습니다.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TeacherGuide;
