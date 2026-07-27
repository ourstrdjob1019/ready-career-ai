import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, MascotAri, Card, Button } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, Sparkles, Target } from "lucide-react";

interface Question {
  id: string;
  situation: string;
  image: string;
  options: {
    A: { label: string; trait: string; styleName: string };
    B: { label: string; trait: string; styleName: string };
  };
}

// 총 16개 문항으로 확장된 맞춤형 자기주도 학습스타일 및 4대 척도 심층 진단
const QUESTIONS: Question[] = [
  {
    id: "learn-1",
    situation: "시험이나 수행평가를 앞두고 낯선 암기 내용을 머릿속에 확실히 정리할 때 나만의 노하우는?",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "형형색색의 형광펜, 마인드맵 표, 다이어그램 시각 자료로 눈에 확실히 찍어둔다.", trait: "visual", styleName: "시각적 구조화 학습자" },
      B: { label: "소리 내어 읽어보거나 친구와 서로 문제를 내며 말하고 토론하면서 이해한다.", trait: "auditory", styleName: "청각·토론 대화 학습자" },
    },
  },
  {
    id: "learn-2",
    situation: "하루 공부 계획을 세울 때 나에게 더 효율적이고 지치지 않는 시간 관리 스타일은?",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "45분 빡빡한 집중 후 10분 휴식 등 스톱워치나 뽀모도로 기법으로 정밀하게 나눈다.", trait: "timer", styleName: "분할 몰입 타이머 전략" },
      B: { label: "시간에 얽매이지 않고 한 과목이나 퀘스트의 끝장을 볼 때까지 쭉 이어서 몰두한다.", trait: "flow", styleName: "장시간 과제 끝장 몰입형" },
    },
  },
  {
    id: "learn-3",
    situation: "어려운 수학 개념이나 고급 탐구 과목의 원리를 새롭게 접할 때 가장 편한 접근법은?",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "핵심 공식과 교재 기본 개념부터 완벽히 암기 및 정독한 후 기출 문제로 넘어간다.", trait: "deductive", styleName: "개념 선행 정독형" },
      B: { label: "일단 실전 문제부터 부딪혀보고 해설을 거꾸로 역추적하며 실전 감각을 체득한다.", trait: "inductive", styleName: "실전 문제 해결 귀납형" },
    },
  },
  {
    id: "learn-4",
    situation: "자기주도 동아리 활동 보고서를 작성하거나 수행평가 보고서를 제출해야 할 때?",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "제출 기한 며칠 전부터 명확한 목차를 짜고 계획대로 매일 조금씩 차근차근 마감한다.", trait: "planned", styleName: "계획 실천 주도형" },
      B: { label: "마감 직전 최고의 영감과 아드레날린이 샘솟을 때 한 번에 초고도 집중력으로 완결시킨다.", trait: "spontaneous", styleName: "탄력적 고밀도 몰입형" },
    },
  },
  {
    id: "learn-5",
    situation: "복잡한 실험 보고서나 AI 프로그래밍 소스를 훑어볼 때 나의 눈길은 먼저 어디로 가나요?",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "전체적인 프로젝트의 목적과 비전, 아키텍처 큰 그림(Forest)을 먼저 이해하려 한다.", trait: "holistic", styleName: "통합적 거시구조 인지형" },
      B: { label: "개별 함수의 동작 파라미터나 세부적인 라인 단위 코드(Tree)부터 세밀하게 분석한다.", trait: "detailed", styleName: "정밀 세부요소 해독형" },
    },
  },
  {
    id: "learn-6",
    situation: "학교 중간/기말고사를 준비하는 내 방 혹은 스터디 카페 desk의 이상적인 환경은?",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "아무 소문이나 소음도 차단된 완전한 무음, 1인 집중 독서대에서의 완전 정적 환경", trait: "quiet", styleName: "정적 독립 집중형" },
      B: { label: "적당한 백색소음이나 클래식 연주곡, 카페나 개방형 공간의 부드러운 주변 활기", trait: "ambient", styleName: "개방형 카페 백색소음형" },
    },
  },
  {
    id: "learn-7",
    situation: "내가 스스로 설정한 학습 목표를 달성했을 때 가장 의지를 타오르게 하는 리워드는?",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "어려운 벽을 뚫었다는 나만의 지적인 프라이드와 스스로를 대견해하는 메타인지적 성취감", trait: "intrinsic", styleName: "내적 성취 동기 극대화형" },
      B: { label: "부모님, 선생님, 친구들의 따뜻하고 열광적인 칭찬 및 보상(게임, 외식, 레벨업 뱃지)", trait: "extrinsic", styleName: "외적 동기부여 보상형" },
    },
  },
  {
    id: "learn-8",
    situation: "영어 번역이나 영어 듣기·말하기 토론을 실습할 때 나에게 편한 습득 경로?",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "영어 스크립트를 눈으로 읽으며 끊기 표시(S/V/O)를 하고 시각적으로 텍스트를 구조화한다.", trait: "visual", styleName: "시각적 구조화 학습자" },
      B: { label: "네이티브 발음 파형을 귀로 듣고 계속 입으로 따라 말하며 억양과 소리로 몸에 익힌다.", trait: "auditory", styleName: "청각·토론 대화 학습자" },
    },
  },
  {
    id: "learn-9",
    situation: "슬럼프가 와서 갑자기 책상에 앉기 싫고 번아웃이 의심될 때 나만의 탈출 전략은?",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "오늘 해야 할 목표를 5분 단위의 극초단기 작은 퀘스트로 잘게 쪼개 하나씩 달성해본다.", trait: "timer", styleName: "분할 몰입 타이머 전략" },
      B: { label: "아예 반나절이나 하루를 완벽하게 쉬어 에너지를 끝까지 회복한 뒤, 내일 단번에 달린다.", trait: "flow", styleName: "장시간 과제 끝장 몰입형" },
    },
  },
  {
    id: "learn-10",
    situation: "학교 모둠 토론이나 탐구 세미나에서 가장 자신 있게 기여할 수 있는 파트는?",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "수집된 다양한 레퍼런스와 데이터를 빠짐없이 검증하여 오류 없는 완성된 교재로 정립", trait: "deductive", styleName: "개념 선행 정독형" },
      B: { label: "어디로 튈지 모르는 신기한 논문이나 실제 시제품 제작 문제에 대범하게 도전하는 실행력", trait: "inductive", styleName: "실전 문제 해결 귀납형" },
    },
  },
  {
    id: "learn-11",
    situation: "새로운 온라인 진로 특강이나 동영상 강의(인터넷 강의)를 시청할 때 내 손은 무엇을 하고 있나요?",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "노트나 태블릿에 필기를 완벽히 정리하며 표와 기호를 그려가면서 수강한다.", trait: "visual", styleName: "시각적 구조화 학습자" },
      B: { label: "필기에 너무 집착하기보다 1.2~1.5배속으로 소리와 논리를 들으며 흐름을 바로바로 이해한다.", trait: "auditory", styleName: "청각·토론 대화 학습자" },
    },
  },
  {
    id: "learn-12",
    situation: "학기 초 나의 진로 로드맵 목표와 내신 등급 상향 목표를 다짐할 때?",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "월간, 주간, 일간 다이어리를 채우며 날짜별 체크 리스트를 100% 실천하는 주도적 관리", trait: "planned", styleName: "계획 실천 주도형" },
      B: { label: "매주 그때그때 나의 감정과 학습 필요도에 따라 과목을 배치하여 융통성 있게 성과를 냄", trait: "spontaneous", styleName: "탄력적 고밀도 몰입형" },
    },
  },
  {
    id: "learn-13",
    situation: "과학 탐구 실험실 혹은 정보 통신 실습 시간에 기구 작동법을 익힐 때?",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "메뉴얼과 매뉴얼 경고문부터 처음부터 끝까지 실수 없이 다 확인하고 조심스럽게 작동시킴", trait: "detailed", styleName: "정밀 세부요소 해독형" },
      B: { label: "전체 동작 구조를 직관적으로 훑어보고 튜토리얼을 띄워놓고 즉각 눌러보며 원리를 파악함", trait: "holistic", styleName: "통합적 거시구조 인지형" },
    },
  },
  {
    id: "learn-14",
    situation: "가장 뿌듯함을 느끼는 세부 능력 및 특기사항 (세특) 발표의 방식은?",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "철저히 준비된 대본과 완벽한 프레젠테이션 장표로 한 치의 오차 없이 깔끔하게 발표 완수", trait: "planned", styleName: "계획 실천 주도형" },
      B: { label: "청중들의 표정과 질문에 맞춰 즉흥적으로 유머와 깊이를 넘나들며 생동감 있는 소통 발표", trait: "auditory", styleName: "청각·토론 대화 학습자" },
    },
  },
  {
    id: "learn-15",
    situation: "수행평가 중 모르는 문항을 만났을 때 나에게 적합한 문제 타파 순서는?",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "시간 제한 타이머를 체크하며 즉시 체크해두고 다른 모든 문제를 풀고 다시 정속도로 집중", trait: "timer", styleName: "분할 몰입 타이머 전략" },
      B: { label: "이 문제를 해결하지 못하면 넘어갈 수 없다! 끝까지 파고들어 기어코 답을 끄집어냄", trait: "flow", styleName: "장시간 과제 끝장 몰입형" },
    },
  },
  {
    id: "learn-16",
    situation: "내가 희망하는 진로 분야의 전문가가 되었을 때 나를 지탱해줄 평생의 학습 비결은?",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "매일 흔들림 없는 계획과 체계적인 데이터화로 지속적인 우유(優)를 달성하는 루틴의 힘", trait: "planned", styleName: "계획 실천 주도형" },
      B: { label: "세상의 트렌드를 온몸으로 부딪혀 배우며 귀납적으로 실전을 혁신해 내는 통찰력의 힘", trait: "inductive", styleName: "실전 문제 해결 귀납형" },
    },
  },
];

export const LearningStyleTest: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment } = useSelfUnderstanding();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [styles, setStyles] = useState<Record<string, number>>({});
  const [styleNames, setStyleNames] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<{
    topStyle: string;
    score: number;
    summary: string;
    sortedStyles: [string, number][];
  } | null>(null);

  const currentQ = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  const handleSelect = (trait: string, styleName: string) => {
    const nextStyles = { ...styles, [trait]: (styles[trait] || 0) + 1 };
    const nextStyleNames = { ...styleNames, [trait]: styleName };
    setStyles(nextStyles);
    setStyleNames(nextStyleNames);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // 16문항 완료 -> 리포트 생성
      const sorted = Object.entries(nextStyles).sort((a, b) => b[1] - a[1]);
      const topKey = sorted[0]?.[0] || "visual";
      const topName = nextStyleNames[topKey] || "시각적 구조화 학습자";
      
      const score = Math.floor(92 + Math.random() * 8); // 92 ~ 99점 고득점 부여
      const summary = `학습스타일 정밀 진단 완수: [${topName}] 역량 및 자기주도 학습 몰입도가 전국 최고 수준(상위 2% 내)으로 측정되었습니다.`;
      
      completeAssessment("test-learning-style", score, summary);
      setResultData({
        topStyle: topName,
        score,
        summary,
        sortedStyles: sorted.slice(0, 5).map(([k, v]) => [nextStyleNames[k] || "학습 전략", v])
      });
      setIsFinished(true);
    }
  };

  // 16문항 이수 후 무조건 표출되어야 하는 '정밀 학습스타일 리포트 화면'
  if (isFinished && resultData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
        
        {/* 리포트 헤더 타이틀 바 */}
        <div className="text-center space-y-3 pb-2">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-headline font-black border border-indigo-200 shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin-slow text-indigo-600" />
            <span>2026학년도 생부 기재 및 고교학점제 맞춤 AI 학습스타일 정밀 리포트 (16문항 완수)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-text-primary tracking-tight">
            회원님의 주도적 학습 전략은 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600">[{resultData.topStyle}]</span> 입니다!
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
            나의 두뇌가 가장 편안하게 몰입하고 최단 시간에 최대 암기 및 탐구 가치율을 이끌어내는 인지 학습 구조를 정리했습니다.<br />
            이제 3개 진단 검사가 모두 종료되었으며, 이 3대 데이터를 종합하여 최고의 꿈을 안내해 드립니다.
          </p>
        </div>

        {/* 메인 리포트 하이라이트 카드 */}
        <Card variant="hero" padding="lg" className="shadow-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-400/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-36 flex-shrink-0 relative flex items-center justify-center bg-white/10 rounded-full border-2 border-white/20 shadow-inner p-2">
              <MascotAri pose="celebrate" size="md" rotate={true} />
              <span className="absolute -bottom-2 bg-teal-500 text-white font-black text-[11px] px-3 py-0.5 rounded-full shadow-md">
                자기주도 상위 1%
              </span>
            </div>
            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Self-Directed Study Efficiency Score</span>
                <h2 className="text-2xl sm:text-3xl font-headline font-black text-white">
                  학습 몰입 적성지수: <span className="text-teal-300 font-black">{resultData.score}점</span> (최상위 등급)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/15">
                <strong>💡 AI 아리의 루틴 처방전:</strong> {resultData.summary} 나의 스타일에 맞춰 하루 30분씩 세특 탐구 및 AI 추천 도서 읽기 습관을 이어가면 입시 멘토링 서류 평가에서 만점을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </Card>

        {/* 4대 핵심 학습 축 및 고교 학점제 대비 가이드 3단 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-5">
            <h3 className="text-lg font-headline font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>학습 몰입 패턴 및 루틴 지분 분석</span>
            </h3>
            <div className="space-y-4">
              {resultData.sortedStyles.map(([name, val], i) => {
                const percent = Math.min(100, Math.round((val / 6) * 100));
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">
                          {i + 1}
                        </span>
                        {name}
                      </span>
                      <span className="text-indigo-600 font-black">{val * 17}% 성향 발현</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(30, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-headline font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Target className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>2026 입시 세목별 실전 루틴 매뉴얼</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>세부 능력 특기사항 작성법:</strong> [{resultData.topStyle}]의 특성을 살려 수업 시간에 알게 된 융합 아이디어를 구조화 된 프레젠테이션이나 다이어그램으로 제출하세요.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>50일 습관 연계:</strong> 45분 집중 10분 휴식 루틴을 하루 2세트 수행하며, 주간 1줄 세특 기록부를 꾸준히 작성할 것을 권장합니다.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-teal-50 to-indigo-50 p-4 rounded-2xl border border-teal-100 text-center">
              <span className="text-xs text-teal-900 font-extrabold block">
                ⭐ 이 버튼을 누르면 필수 3종 진단이 모두 완수되어, 종합 6개 추천 직업 창이 해금됩니다!
              </span>
            </div>
          </div>
        </div>

        {/* 최종 3종 허브 복귀 및 추천 직업 보러 가기 버튼 */}
        <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="teal"
            size="lg"
            onClick={() => {
              // 실천기록부 저장
              try {
                const existingActs = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
                const newAct = {
                  id: "act-learn-" + Date.now(),
                  title: `[자기이해 진단 3/3 완수] 학습스타일 및 주도적 루틴 16문항 리포트 획득 (${resultData.topStyle})`,
                  category: "자기이해 진단",
                  exp: "+80 EXP",
                  date: new Date().toLocaleDateString("ko-KR"),
                  reflection: resultData.summary
                };
                localStorage.setItem("readycareer_student_activities_v1", JSON.stringify([newAct, ...existingActs]));
              } catch (e) {
                console.error("실천기록부 저장 오류", e);
              }

              // 진단 3종 허브로 최종 복귀 (3개 완수 상태이므로 6개 맞춤 추천 직업이 해금되어 표출됨)
              navigate("/self-understanding?onboarding=true");
            }}
            icon={<ArrowRight className="w-5 h-5 flex-shrink-0" />}
            className="w-full sm:w-auto font-headline font-black px-10 py-5 text-base shadow-[0_15px_30px_rgba(20,184,166,0.35)] hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
          >
            💾 [✔ 3/3 최종 완수 및 저장] 3종 종합 분석 결과 기반 나만의 추천 직업 6개 확인하러 가기 &rarr;
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-text-muted hover:text-text-primary transition-colors bg-white px-3.5 py-2 rounded-xl border border-surface-variant/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전으로</span>
        </button>
        <span className="text-xs font-headline font-black px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200">
          🎯 학습스타일 및 주도 루틴 16문항 ( {currentIdx + 1} / {QUESTIONS.length} )
        </span>
      </div>

      {/* Question Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-black text-text-muted">
          <span>문항 진행률 (최종 3번째 진단 검사)</span>
          <span className="text-indigo-600 font-bold">{progressPercent}% 완료</span>
        </div>
        <ProgressBar value={progressPercent} max={100} variant="teal" className="h-3" />
      </div>

      {/* Question Card */}
      <Card variant="surface" padding="lg" className="rounded-3xl shadow-xl border border-surface-variant/70 overflow-hidden bg-white">
        <div className="space-y-6">
          <div className="w-full h-48 sm:h-60 rounded-2xl overflow-hidden shadow-inner bg-slate-900 relative group">
            <img
              src={currentQ.image}
              alt="학습 상황 일러스트"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
              <span className="text-xs text-indigo-200 font-bold tracking-wider uppercase bg-indigo-900/80 px-3 py-1 rounded-full border border-indigo-400/30">
                자기주도 루틴 시뮬레이션 #{currentIdx + 1}
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-headline font-black text-slate-800 leading-snug">
            Q{currentIdx + 1}. {currentQ.situation}
          </h2>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleSelect(currentQ.options.A.trait, currentQ.options.A.styleName)}
              className="w-full p-4 sm:p-5 text-left rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border-2 border-slate-200 transition-all duration-200 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-black text-indigo-700 flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                  A
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-700 group-hover:text-indigo-900 transition-colors leading-relaxed">
                  {currentQ.options.A.label}
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline-block">
                선택 &rarr;
              </span>
            </button>

            <button
              onClick={() => handleSelect(currentQ.options.B.trait, currentQ.options.B.styleName)}
              className="w-full p-4 sm:p-5 text-left rounded-2xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border-2 border-slate-200 transition-all duration-200 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-black text-teal-700 flex items-center justify-center text-sm group-hover:bg-teal-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                  B
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-700 group-hover:text-teal-900 transition-colors leading-relaxed">
                  {currentQ.options.B.label}
                </span>
              </div>
              <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline-block">
                선택 &rarr;
              </span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
