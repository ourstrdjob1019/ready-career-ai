import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { ARI_BLOB_URL } from "../../assets/mascotData";
import { rewardXP } from "../../services/expService";
import {
  Sparkles,
  Brain,
  CheckCircle2,
  FileText,
  Download,
  RefreshCw,
  Play,
  X,
  Award,
  BarChart2,
  Target
} from "lucide-react";

interface DiagnosticTest {
  id: string;
  title: string;
  category: string;
  timeEst: string;
  desc: string;
  status: "completed" | "pending";
  resultType?: string;
  scoreSummary?: string;
  reportDetails: {
    summary: string;
    scores: { label: string; val: number }[];
    recommendedActivities: string[];
    aiCareerComment: string;
  };
}

export const SelfUnderstanding: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "소프트웨어개발자";

  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [activeReportTest, setActiveReportTest] = useState<DiagnosticTest | null>(null);
  
  // 4~6번 즉석 쾌속 진단 모달 상태
  const [quickTestModal, setQuickTestModal] = useState<DiagnosticTest | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  // 6대 검사 초기화 및 로컬 스토리지 보존
  useEffect(() => {
    const saved = localStorage.getItem("readycareer_6_diagnostics_v1");
    if (saved) {
      try { setTests(JSON.parse(saved)); } catch (e) {}
    } else {
      const defaultTests: DiagnosticTest[] = [
        {
          id: "test-interest",
          title: "K-RIASEC 진로 흥미 및 성향 진단",
          category: "흥미/성격",
          timeEst: "약 3분 소요",
          desc: "홀랜드(Holland) 6대 성형 이론을 현대 인공지능 산업 역량과 결합하여 나에게 꼭 맞는 최적 진로 무드와 업무 특성을 진단합니다.",
          status: "completed",
          resultType: "EI (Enterprising + Investigative) 탐구 리더형",
          scoreSummary: "탐구적 독창성 96점 / 주도적 비즈니스 기획 92점",
          reportDetails: {
            summary: "회원님은 복잡한 데이터 사이버네틱스를 논리적으로 해부하는 학구열과 이를 세상에 출시하는 주도적인 리더십을 동시에 품고 있습니다.",
            scores: [
              { label: "I (탐구연구형)", val: 96 },
              { label: "E (기업진취형)", val: 92 },
              { label: "A (예술창의형)", val: 88 },
              { label: "R (현실실용형)", val: 82 }
            ],
            recommendedActivities: [
              "교내 AI/SW 프로그래밍 동아리 리더 및 학술제 메인 발표자 참여",
              "빅데이터 기반의 사회문제 해결 스타트업 아이디에이션 공모전 도전"
            ],
            aiCareerComment: `희망 직직인 **'${targetJobName}'** 분야에서 프로젝트 팀 전체를 리딩하며 기술 논리를 명쾌하게 프레젠테이션하는 핵심 설계 책임자로 대성할 수 있습니다!`
          }
        },
        {
          id: "test-intelligence",
          title: "AI 다중지능 및 최적 강점 역량 검사",
          category: "적성/재능",
          timeEst: "약 4분 소요",
          desc: "가상공간, 논리수학, 대인관계, 언어 직관 등 하워드 가드너 8대 다중지능 중 나의 가장 뛰어난 타고난 마스터 역량을 발굴합니다.",
          status: "completed",
          resultType: "논리수학 지능 & 공간 감각 지능 극대화",
          scoreSummary: "수리 알고리즘 직관 98% / 시스템 구조 3D 조망 95%",
          reportDetails: {
            summary: "수치와 통계, 복잡한 인과관계 고리(Loop)를 시각화하여 파파악하는 공간 수학적 통찰력이 전국 최상위 상위권 레벨에 위치해 있습니다.",
            scores: [
              { label: "논리/수리 지능", val: 98 },
              { label: "공간/시각 지능", val: 95 },
              { label: "대인/공유 지능", val: 89 },
              { label: "언어/논술 지능", val: 85 }
            ],
            recommendedActivities: [
              "Python, C++, TensorFlow를 활용한 3D 가상 시뮬레이션 알고리즘 제작",
              "차세대 신경망 모형 혹은 첨단 바이오 물리 현상의 수학적 수식 시각화"
            ],
            aiCareerComment: `이공계열 학업 역량 중 가장 난이도가 높은 수리 및 시스템 조망 재능을 증명하며 **'${targetJobName}'** 진입을 위한 완벽한 엔진을 보유하고 있습니다.`
          }
        },
        {
          id: "test-learning",
          title: "SRL 자기주도 학습 루틴 및 인지 스타일 진단",
          category: "학술/학업",
          timeEst: "약 3분 소요",
          desc: "나의 주의 몰입 집중력 패턴, 복습 방식, 멘탈 무너짐 극복 방식을 평가하여 성격을 올려줄 최적의 학습 타이머 전략을 수립합니다.",
          status: "completed",
          resultType: "고몰입 주도형 & 코넬 학습 요약 특화",
          scoreSummary: "스스로 시간 통제 94점 / 심화 메타인지 복습 91점",
          reportDetails: {
            summary: "단순 수동적인 암기보다 가설을 스스로 던지고 인과를 코넬 노트로 필기하며 메타인지를 키우는 능동적 공부 습관을 가졌습니다.",
            scores: [
              { label: "메타인지 자기제어", val: 94 },
              { label: "목표 시간 타임아 아비지", val: 91 },
              { label: "시험 불안 통제력", val: 86 },
              { label: "교사/멘토 피드백 활용", val: 92 }
            ],
            recommendedActivities: [
              "레디커리어 AI 학습포트폴리오(코넬노트)를 통한 과목별 심화 보고서 도출",
              "매일 50일 연속 '한입 퀘스트' 루틴 달성을 통한 꾸준한 학업 지표 획득"
            ],
            aiCareerComment: `입사관이 생기부 세특 및 행특에서 가장 눈여겨보는 '스스로 탐구를 무한 팽창시키는 열정'을 입증해 주는 훌륭한 진단입니다.`
          }
        },
        {
          id: "test-digital",
          title: "AI 디지털 리터러시 & 차세대 신기술 마인드셋 진단",
          category: "AI/신기술",
          timeEst: "약 3분 소요",
          desc: "생성형 AI (ChatGPT/Gemini 등), 파이썬 기초 도구, 3D 프롬프트 제어, 테크 윤리 의식에 대한 현대 IT 수용도와 친밀도를 측정합니다.",
          status: "pending",
          reportDetails: {
            summary: "최신의 신기술을 장벽 없이 습득하며, 텍스트와 프롬프트를 넘나들며 창의적인 실무 산출물을 찍어내는 AI 네이티브 인재입니다!",
            scores: [
              { label: "AI 도구 수용도", val: 95 },
              { label: "프롬프트 제어 역량", val: 93 },
              { label: "디지털 정보 문해력", val: 89 },
              { label: "AI 사회윤리 의식", val: 97 }
            ],
            recommendedActivities: [
              "국가공인 빅데이터 준전문가(ADsP) 또는 AI 활용 자격증 시험 도전",
              "인공지능 윤리 강령을 주제로 한 교내 인문사회 논술 공모전 수상"
            ],
            aiCareerComment: `미래 산업을 혁신할 디지털 리터러시 지수가 90점대를 상회하며 **'${targetJobName}'**의 전문 역량과 100% 매칭됩니다.`
          }
        },
        {
          id: "test-vision",
          title: "K-SLCA 생애 진로 비전 및 커리어 성향 검사",
          category: "비전/가치",
          timeEst: "약 2분 소요",
          desc: "사회적 공헌, 명예와 전문성, 자유와 창조, 경제적 보상 중 내가 평생의 꿈을 선택할 때 가장 가치 있게 이끌어주는 인생 침판을 밝힙니다.",
          status: "pending",
          reportDetails: {
            summary: "본인만의 고유한 기술력으로 인류의 삶을 이롭게 만들고자 하는 숭고한 보람과 전문적 장인 정신을 최선위에 두는 진실된 꿈 탐구어입니다.",
            scores: [
              { label: "전문적 권위성", val: 96 },
              { label: "사회적 공인/이타심", val: 92 },
              { label: "창조적 독창성", val: 88 },
              { label: "자율 및 안정 균형", val: 82 }
            ],
            recommendedActivities: [
              "소외 계층 및 초중등 동생들을 위한 교육 재능기부 멘토링 봉사",
              "ESG 친환경 및 첨단 보조공학 로보틱스 관련 자율 탐구 과제 제출"
            ],
            aiCareerComment: `따뜻한 공감 능력과 뛰어난 이학 실무 능력을 겸비한 인재로서 최고의 리스펙트를 받을 자격이 있습니다.`
          }
        },
        {
          id: "test-grit",
          title: "GRIT 과제 집념 및 도전 회복탄력성 (Resilience) 진단",
          category: "그릿/끈기",
          timeEst: "약 2분 소요",
          desc: "실패와 난관을 마주했을 때 좌절하지 않고 집요한 끈기와 강인한 회복탄력성으로 끝내 목표와 장려상을 쟁취하는 근성 지수를 판별합니다.",
          status: "pending",
          reportDetails: {
            summary: "한 번 맡은 과제는 역경이 찾아와도 반드시 돌파 방안을 모색하여 해결해 내는 강인한 불굴의 마라토너형 마인드를 소유했습니다.",
            scores: [
              { label: "불굴의 과제 집념", val: 95 },
              { label: "실패 복구 회복탄력성", val: 91 },
              { label: "장기 비전 유지력", val: 94 },
              { label: "정서적 냉정 균형", val: 88 }
            ],
            recommendedActivities: [
              "1년 단위 장기 융합 프로젝트(논문 탐구 혹은 대회) 도전 및 출품",
              "학교 대표 학술제에서 팀의 멘탈을 든든하게 지켜내는 PM 총괄 리딩"
            ],
            aiCareerComment: `아무리 고난이도의 연구과제라 해도 결코 포기하지 않고 돌파하는 근성 역량을 입체적으로 돋보이게 합니다!`
          }
        }
      ];
      setTests(defaultTests);
      localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(defaultTests));
    }
  }, [targetJobName]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  // 검사 진행하기 or 재검사하기 라우팅/모달 트리거
  const handleStartOrRetakeTest = (test: DiagnosticTest, isRetake = false) => {
    if (isRetake && !window.confirm(`'${test.title}' 검사를 초기화하고 다시 재검사를 진행하시겠습니까?`)) {
      return;
    }

    if (test.id === "test-interest") {
      navigate("/interest-test");
    } else if (test.id === "test-intelligence") {
      navigate("/intelligence-test");
    } else if (test.id === "test-learning") {
      navigate("/learning-test");
    } else {
      // 4~6번 신규 추가 검사는 인터랙티브 AI 즉석 진단 모달 띄우기!
      setCurrentQuestionIdx(0);
      setQuickTestModal(test);
    }
  };

  // 쾌속 즉석 진단 답변 선택 및 완료 처리
  const handleAnswerQuickTest = () => {
    if (!quickTestModal) return;
    if (currentQuestionIdx < 2) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // 3항목 완수 시 완료 처리!
      const updated = tests.map(t => t.id === quickTestModal.id ? {
        ...t,
        status: "completed" as const,
        resultType: "AI 첨단 융합 마스터 & 상위 2% 성취",
        scoreSummary: "종합 진도 적합도 96점 / 실증적 탐구 열정 최다"
      } : t);
      setTests(updated);
      localStorage.setItem("readycareer_6_diagnostics_v1", JSON.stringify(updated));
      const completedTest = updated.find(t => t.id === quickTestModal.id) || null;
      setQuickTestModal(null);
      setActiveReportTest(completedTest);
      showToast(`🎉 [${quickTestModal.title}] 진단이 성공적으로 완료되어 맞춤 리포트가 개방되었습니다!`);
      rewardXP(75, `[${quickTestModal.title}] 커리어 진단 완수!`);
    }
  };

  // 맞춤 리포트 PDF 다운로드 & 인쇄 처리
  const handleDownloadPDF = () => {
    showToast("📥 리포트를 PDF 문서로 다운로드(또는 100% 최적화 인쇄)하기 위해 시스템 인쇄 엔진을 구동합니다!");
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const completedCount = tests.filter(t => t.status === "completed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-12 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0] relative">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-50 bg-[#7B5CF0] text-white px-6 py-4 rounded-3xl font-black text-sm sm:text-base shadow-[0_15px_35px_rgba(123,92,240,0.4)] flex items-center gap-3 animate-bounce-short border-2 border-white">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO TITLE (6대 자기이해 진단 센터)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#2B0E68] via-[#5A24CA] to-[#008A90] text-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(90,36,202,0.3)] border-4 border-white/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <span className="text-xs font-black bg-[#FF3B7C] text-white px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
            <Brain className="w-4 h-4 text-amber-200" />
            <span>AI 맞춤 커리어·학술 종합 자기이해 진단 센터</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-headline font-black tracking-tight leading-tight text-white">
            🧪 AI 진로·학업 6대 <br className="hidden sm:block"/> 자기이해 진단검사 모음
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#DFD7FF] leading-relaxed">
            나의 흥미, 강점 다중지능, 학습 루틴, 디지털 리터러시, 비전, GRIT 끈기를 진단받으세요! 완료된 검사는 <strong>[맞춤 리포트 PDF 다운로드]</strong> 및 언제든 <strong>[재검사하기]</strong>가 가능합니다.
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <span className="text-xs font-extrabold px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40">
              📊 내 진행 상태: <strong>6개 중 {completedCount}개 완료!</strong>
            </span>
            {completedCount === 6 && (
              <span className="text-xs font-black px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#1A1626] shadow-lg animate-pulse">
                👑 6대 전수 진단 그랜드 마스터 달성!
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-[36px] bg-white/20 backdrop-blur-xl p-4 border-4 border-white/50 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all">
          <img src={ARI_BLOB_URL} alt="Ari Mascot" className="w-full h-full object-contain filter drop-shadow-2xl" />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 6대 진단검사 모음 그리드 카드
         ========================================================================= */}
      <div className="space-y-6">
        <div className="border-b-2 border-purple-150 pb-4 pl-2">
          <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626] flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#7B5CF0]" />
            <span>📋 2026 레디커리어 공식 6대 맞춤 진단검사 라인업</span>
          </h2>
          <p className="text-xs sm:text-sm font-extrabold text-[#5C5672] mt-1">
            원하는 진단 카드를 선택해 검사를 받거나, 이미 완료된 검사의 <strong>고품격 AI 리포트</strong>를 조회해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {tests.map((test) => {
            const isDone = test.status === "completed";

            return (
              <div
                key={test.id}
                className={`rounded-[36px] p-8 transition-all duration-300 flex flex-col justify-between space-y-6 border-3 relative ${
                  isDone
                    ? "bg-gradient-to-b from-[#F2FEFF] via-[#FAF6FF] to-white border-[#008A90]/60 shadow-[0_12px_30px_rgba(0,138,144,0.15)] hover:shadow-[0_18px_40px_rgba(0,138,144,0.25)]"
                    : "bg-white border-[#E4DCFF] shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-[#7B5CF0] hover:shadow-xl"
                }`}
              >
                {/* 상단 뱃지 및 상태 구별 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black bg-purple-100 text-[#6240D5] px-3 py-1 rounded-full">
                      {test.category}
                    </span>
                    {isDone ? (
                      <span className="text-xs font-black bg-[#008A90] text-white px-3.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>진단 완료!</span>
                      </span>
                    ) : (
                      <span className="text-xs font-black bg-slate-100 text-slate-600 px-3.5 py-1 rounded-full">
                        ⚡ 미완료 ({test.timeEst})
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#1A1626] leading-tight tracking-tight">
                    {test.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#5B556D] leading-relaxed">
                    {test.desc}
                  </p>
                </div>

                {/* 완료되었을 경우 요약 결과 미리보기 */}
                {isDone && (
                  <div className="bg-white p-4.5 rounded-2xl border-2 border-cyan-150 shadow-inner space-y-2">
                    <span className="text-[11px] font-black text-[#008A90] flex items-center gap-1">
                      👑 진단 결과 요약:
                    </span>
                    <p className="text-xs font-black text-[#1A1626]">
                      {test.resultType}
                    </p>
                    {test.scoreSummary && (
                      <span className="text-[11px] font-extrabold text-[#6E6A80] block bg-slate-50 p-1.5 rounded-lg border">
                        📈 {test.scoreSummary}
                      </span>
                    )}
                  </div>
                )}

                {/* 하단 제어 버튼 (리포트 보기/PDF vs 재검사하기 vs 시작하기) */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  {isDone ? (
                    <>
                      <button
                        onClick={() => setActiveReportTest(test)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#008A90] to-[#00A3A8] hover:brightness-110 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>📑 맞춤 리포트 보기 (PDF 다운로드)</span>
                      </button>
                      <button
                        onClick={() => handleStartOrRetakeTest(test, true)}
                        className="w-full py-3 px-6 rounded-2xl bg-[#FAF7FF] hover:bg-[#F2EEFF] text-[#7B5CF0] border-2 border-purple-200 font-black text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>🔄 재검사하기 (무제한 다시 풀기)</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartOrRetakeTest(test, false)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7B5CF0] to-[#6240D5] hover:brightness-110 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>🚀 검사 시작하기 ({test.timeEst})</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: 각 진단검사별 맞춤 리포트 보기 & PDF 다운로드 기능
         ========================================================================= */}
      {activeReportTest && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[44px] p-8 sm:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.6)] border-4 border-purple-200 relative max-h-[92vh] overflow-y-auto space-y-9 selection:bg-[#008A90]/20">
            
            {/* 상단 모달 닫기 */}
            <button
              onClick={() => setActiveReportTest(null)}
              className="absolute top-7 right-8 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold shadow-sm transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 리포트 헤더 (PDF 인쇄 버튼 배치) */}
            <div className="border-b-4 border-[#7B5CF0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-[#008A90] text-white px-4 py-1 rounded-full text-xs font-black shadow">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>2026 ReadyCareer AI Official Diagnostic Report</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-headline font-black text-[#1A1626]">
                  📑 {activeReportTest.title} 결과 리포트
                </h2>
                <p className="text-xs sm:text-sm font-black text-[#5C5672]">
                  진단 일자: <strong>{new Date().toLocaleDateString("ko-KR")}</strong> | 희망 직무 연계를 위한 100% 맞춤 데이터
                </p>
              </div>

              {/* 📥 PDF 다운로드 및 인쇄 실행 버튼 */}
              <button
                onClick={handleDownloadPDF}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FF3B7C] to-[#FF7043] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transform hover:scale-105 transition-all cursor-pointer flex-shrink-0"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>📥 리포트 PDF 다운로드 &amp; 인쇄</span>
              </button>
            </div>

            {/* 본문 1: 종합 요약 & 강점 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-[#FAF7FF] p-6 rounded-[32px] border-2 border-purple-200 shadow-inner flex flex-col justify-between space-y-4 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#7B5CF0] text-white px-3 py-1 rounded-full inline-block">
                    대표 판정 결과
                  </span>
                  <h4 className="text-xl font-black text-[#1A1626] pt-2 leading-snug">
                    {activeReportTest.resultType || "AI 고위험 융합 주도형"}
                  </h4>
                </div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#7B5CF0] to-[#008A90] p-1 shadow-lg mx-auto flex items-center justify-center text-white font-black text-2xl">
                  A+
                </div>
                <span className="text-xs font-black text-[#008A90] bg-white py-2 rounded-2xl border border-cyan-200 block">
                  ✨ 상위 3% 이내 우수지표
                </span>
              </div>

              <div className="md:col-span-2 bg-[#F8FAFF] p-7 rounded-[32px] border-2 border-indigo-100 shadow-sm space-y-4 flex flex-col justify-center">
                <span className="text-xs font-black text-indigo-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  <span>AI 사정관의 종합 심층 해부 요약</span>
                </span>
                <p className="text-base sm:text-lg font-black text-[#1A1626] leading-relaxed">
                  "{activeReportTest.reportDetails.summary}"
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-[#6E6A80]">
                    💡 위 지표는 회원님의 진로 꿈을 학교 생기부나 대학 면접에서 증빙할 때 가장 핵심적인 '학문적·인성적 근거'가 됩니다.
                  </span>
                </div>
              </div>
            </div>

            {/* 본문 2: 영역별 상세 수치 지표 (바 차트) */}
            <div className="bg-white p-7 sm:p-8 rounded-[32px] border-2 border-purple-100 shadow-sm space-y-6">
              <h4 className="text-xl font-black text-[#1A1626] flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-[#7B5CF0]" />
                <span>📈 4대 핵심 하위 영역 및 성취 지수</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeReportTest.reportDetails.scores.map((sc, idx) => (
                  <div key={idx} className="bg-[#FAF8FD] p-5 rounded-2xl border border-purple-200/60 space-y-2">
                    <div className="flex items-center justify-between text-sm font-black text-[#1A1626]">
                      <span>{sc.label}</span>
                      <span className="text-[#7B5CF0] text-base">{sc.val}점 / 100점</span>
                    </div>
                    <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7B5CF0] to-[#008A90] rounded-full transition-all duration-1000"
                        style={{ width: `${sc.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 본문 3: 맞춤 실전 활동 권고 및 진로 매칭 멘트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#FAF7FF] p-7 rounded-[32px] border-2 border-[#DED4FF] space-y-4">
                <span className="text-sm font-black text-[#6240D5] flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>🎯 진정성 100% 실천 가이드 &amp; 과제 추천</span>
                </span>
                <ul className="space-y-3 pt-1 text-xs sm:text-sm font-extrabold text-[#3F3952]">
                  {activeReportTest.reportDetails.recommendedActivities.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#008A90] flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#E6FAFE] to-[#FAF3FF] p-7 rounded-[32px] border-2 border-[#BFF6FE] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#008A90] text-white px-3 py-1 rounded-full inline-block">
                    ✨ 희망 직무("{targetJobName}") 시너지 효과
                  </span>
                  <p className="text-sm sm:text-base font-black text-[#1A1626] leading-relaxed pt-1">
                    {activeReportTest.reportDetails.aiCareerComment}
                  </p>
                </div>
                <span className="text-[11px] font-black text-[#006970] text-right">
                  - ReadyCareer AI 스마트 사정관 -
                </span>
              </div>
            </div>

            {/* 하단 제어 바 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-purple-100">
              <span className="text-xs font-bold text-[#6E6A80]">
                💡 이 맞춤 리포트는 언제든 다시 열어보고 다운로드할 수 있습니다.
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveReportTest(null);
                    handleStartOrRetakeTest(activeReportTest, true);
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs sm:text-sm"
                >
                  🔄 검사 다시 치르기 (Retake)
                </button>
                <button
                  onClick={() => setActiveReportTest(null)}
                  className="py-3.5 px-8 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-black text-xs sm:text-sm shadow-lg"
                >
                  확인 및 창 닫기 &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 신규 즉석 쾌속 진단 모달 (4~6번 항목 진행 시)
         ========================================================================= */}
      {quickTestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 sm:p-12 shadow-2xl border-4 border-[#DED4FF] relative text-center space-y-8">
            
            <button onClick={() => setQuickTestModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 font-bold">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 border-b border-purple-100 pb-5">
              <span className="text-xs font-black bg-[#7B5CF0] text-white px-3.5 py-1 rounded-full inline-block">
                ⚡ 2026 실무 맞춤 쾌속 3제 진단 진행 중
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1626]">
                {quickTestModal.title}
              </h3>
              <p className="text-xs font-bold text-[#6E6A80]">
                현재 <strong>[문제 {currentQuestionIdx + 1} / 총 3문항]</strong> | 나에게 가장 어울리는 선택지를 직관적으로 터치하세요!
              </p>
            </div>

            <div className="bg-[#FAF7FF] p-7 rounded-[32px] border-2 border-purple-200 shadow-inner space-y-6 text-left">
              <h4 className="text-lg sm:text-xl font-black text-[#1A1626] leading-relaxed">
                {currentQuestionIdx === 0 && "Q1. 새로운 인공지능 기술이나 낯선 학문적 난제를 마주했을 때 나의 반응은?"}
                {currentQuestionIdx === 1 && "Q2. 실패를 하거나 성과가 즉시 나오지 않는 장기 프로젝트를 맡게 된다면?"}
                {currentQuestionIdx === 2 && "Q3. 미래 진로 직문에서 내가 가장 소중히 가슴에 새기고자 하는 핵심 비전은?"}
              </h4>

              <div className="space-y-3.5">
                {[
                  "🔥 흥미와 호기심을 품고 즉시 원리를 스스로 끝까지 탐구하여 내 무기로 만든다!",
                  "⚡ 팀원이나 멘토에게 조언을 구하며 효율적이고 스마트한 협업 전략으로 해결한다!",
                  "🛡️ 논리적 통계 근거를 모으며 실수나 리스크 없이 완벽하고 차분하게 진행한다!",
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={handleAnswerQuickTest}
                    className="w-full p-4.5 rounded-2xl bg-white hover:bg-[#EAFEFE] border-2 border-purple-200 hover:border-[#008A90] text-left font-extrabold text-xs sm:text-sm text-[#3B364C] hover:text-[#006970] shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{opt}</span>
                    <CheckCircle2 className="w-5 h-5 text-purple-300 group-hover:text-[#008A90] transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-extrabold text-[#8D88A0]">
              💡 3번째 답변을 선택하는 즉시 <strong>[진단 완료 상태 변경 및 리포트 PDF 기능]</strong>이 잠금 해제됩니다!
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SelfUnderstanding;
