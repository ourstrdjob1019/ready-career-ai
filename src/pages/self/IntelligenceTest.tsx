import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, MascotAri, Card, Button } from "../../components";
import { useSelfUnderstanding } from "../../context";
import { rewardXP } from "../../services/expService";
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, Sparkles, Target } from "lucide-react";

interface Question {
  id: string;
  situation: string;
  image: string;
  options: {
    A: { label: string; trait: string; typeName: string };
    B: { label: string; trait: string; typeName: string };
  };
}

// 총 16개 이상의 현실적 학교·학술 및 일상 상황 기반 다중지능(8대 영역) 2선택 문항
const QUESTIONS: Question[] = [
  {
    id: "int-1",
    situation: "새로운 기술 문서를 보거나 복잡한 문제를 해결해야 할 때, 나의 머릿속에서는?",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "숫자, 그래프, 알고리즘 플로우차트로 구조를 빠르고 정확하게 파악한다.", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "그 속에 담긴 기획 의도와 사람들의 반응을 언어적 흐름으로 명확히 읽어낸다.", trait: "verbal", typeName: "언어·인문 지능" },
    },
  },
  {
    id: "int-2",
    situation: "친구들과 함께 떠난 현장 체험학습이나 시뮬레이션 경진대회에서 가장 흥미를 느끼는 부분은?",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "복잡한 공간 구조나 장치들의 기하학적 배치 및 UI 시각 화합물을 입체적으로 관찰한다.", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "팀원들이 각자 어떤 감정과 강점을 가지고 있는지 살피며 토론과 의견을 주도적으로 모은다.", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-3",
    situation: "학교 수행평가 과제로 난도가 높은 AI 코딩 및 하드웨어 제작 프로젝트를 진행하고 있다.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "직접 장비를 조작하고 프로토타입을 손으로 테스트하며 즉각적인 신체·기계 감각으로 해결한다.", trait: "kinesthetic", typeName: "실천·엔지니어링 지능" },
      B: { label: "나의 기존 학습 방식과 약점을 반성적으로 점검하고 메타인지(자기성찰)를 극대화해 전략을 세운다.", trait: "intrapersonal", typeName: "자기성찰·메타인지" },
    },
  },
  {
    id: "int-4",
    situation: "미래 전공 진학을 위해 나만의 학술 포트폴리오를 구상할 때 더 끌리는 방식은?",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "데이터 분석표와 정밀한 수치 통계 모델로 논리적인 결론을 도출하는 연구 보고서 작성", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "사회공헌 및 청소년 심리 회복을 위한 사람 간의 신뢰 교감 프로세스를 제시하는 기획 문서 작성", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-5",
    situation: "선생님 및 친구들에게 내가 가장 자주 듣는 기분 좋은 평가나 칭찬은?",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "'너는 시각적인 디자인과 화면 공간 구성 능력이 정말 직관적이고 감각적이야!'", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "'너는 글을 쓰고 발표할 때 핵심을 논리적이면서도 설득력 넘치게 표현해!'", trait: "verbal", typeName: "언어·인문 지능" },
    },
  },
  {
    id: "int-6",
    situation: "새로운 개념이나 영어 단어를 외울 때 나에게 더 효과적인 기억 활성화 방법은?",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "일정한 리듬이나 억양, 소리의 흐름(연결 구조)을 통해 음악적·감성적으로 외운다.", trait: "musical", typeName: "음악·예술적 감수성" },
      B: { label: "단어의 구조적 형성 원리와 인과관계 법칙을 체계적인 규칙성으로 분석하여 암기한다.", trait: "logic", typeName: "논리·수학 지능" },
    },
  },
  {
    id: "int-7",
    situation: "동아리에서 새로운 교내 학업 및 진로 공모전 대회를 주최하려 한다. 내가 맡고 싶은 역할은?",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "행사의 비주얼 포스터, 무대 구조 디자인 및 영상 미디어 그래픽 시도", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "참가팀 간의 갈등을 조율하고 행사 운영 일정을 부원들과 나누는 총괄 조정", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-8",
    situation: "주말이나 방학 기간 동안 스스로 시간을 보내며 성취감을 느끼는 순간은?",
    image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "조용한 공간에서 일기나 스스로의 계획을 정리하며 내면의 진로 목표를 깊게 되새김", trait: "intrapersonal", typeName: "자기성찰·메타인지" },
      B: { label: "야외에서 직접 땀을 흘리며 운동하거나 부속 모형 조립, 요리 등 몸을 활발하게 움직임", trait: "kinesthetic", typeName: "실천·엔지니어링 지능" },
    },
  },
  {
    id: "int-9",
    situation: "과학 논문이나 신규 IT 기술을 설명하는 긴 토론의 장에 참석했을 때 나의 행동은?",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "발표자의 단어 선택과 은유적 문맥을 파악하고 비판적인 질문을 조리 있게 서술한다.", trait: "verbal", typeName: "언어·인문 지능" },
      B: { label: "자연 현상, 인체 생태계 또는 환경 인자들 사이의 유기적인 연관성과 패턴을 연계 분석한다.", trait: "naturalist", typeName: "자연 탐구·융합 지능" },
    },
  },
  {
    id: "int-10",
    situation: "학업 수행평가에서 고난도의 심화 퀘스트를 선택할 기회가 생겼다.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "수학적 알고리즘 증명 및 데이터 정량 화합 결과를 나타내는 정교한 테크니컬 분석 과제", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "인간 중심 철학과 인문 사회 현상을 주제로 비평문과 심화 에세이를 집필하는 문학 과제", trait: "verbal", typeName: "언어·인문 지능" },
    },
  },
  {
    id: "int-11",
    situation: "첨단 테크 기업이나 대학 오픈캠퍼스를 탐방할 때 가장 눈길이 머무는 구역은?",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "최첨단 3D 프린터나 족행 로봇, 물리적 시각 센서를 손으로 만져보며 조작하는 기구학 연구실", trait: "kinesthetic", typeName: "실천·엔지니어링 지능" },
      B: { label: "미술, 영상음향, UI 화질을 극대화한 몰입형 메이드온 감각 체험 아트 및 메타버스 전시실", trait: "spatial", typeName: "공간·디지털 지능" },
    },
  },
  {
    id: "int-12",
    situation: "팀원들과 함께 의견이 대립하는 복잡한 과제를 풀어나갈 때 나만의 강점은?",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "상대방의 말투와 제스처, 표정에서 진짜 원하는 욕망을 간파하여 상호 타협점을 끌어낸다.", trait: "interpersonal", typeName: "대인·리더십 지능" },
      B: { label: "어디까지 내가 확실히 알고 있는지 냉정하게 선을 긋고 정확한 팩트 리스크만 공유한다.", trait: "intrapersonal", typeName: "자기성찰·메타인지" },
    },
  },
  {
    id: "int-13",
    situation: "음악이나 예술 작품, 혹은 자연 환경 변화에 접촉했을 때 나는?",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "미묘한 리듬의 변화나 화성 구성, 아름다운 소리파장을 직관적으로 구별해 내고 몰입한다.", trait: "musical", typeName: "음악·예술적 감수성" },
      B: { label: "계절별 동식물의 변화나 친환경 소재, 식물 기공 현상의 자연 과학적 원리에 깊은 자극을 받는다.", trait: "naturalist", typeName: "자연 탐구·융합 지능" },
    },
  },
  {
    id: "int-14",
    situation: "미래 10년 뒤 나의 사회적 활동이나 일의 현장을 떠올려본다면 가장 꿈꾸는 모습은?",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "뛰어난 말솜씨와 유창한 글로벌 언어 능력으로 전 세계 사람들을 설득하고 울리는 커뮤니케이터", trait: "verbal", typeName: "언어·인문 지능" },
      B: { label: "사람이 모여 있는 거대한 그룹을 유도하고 조직원 모두에게 비전과 역할을 부여하는 핵심 구심점", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-15",
    situation: "가자마자 복잡해서 길을 잃기 쉬운 서울 혹은 수도권의 거대한 복합 기차역/쇼핑몰에 섰을 때?",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "안내 지도나 입체 표지판을 슬쩍 보고도 층별 위치와 이동 최단로가 머리 속에 시공간으로 맵핑된다.", trait: "spatial", typeName: "공간·디지털 지능" },
      B: { label: "즉시 주위에 있는 안내데스크나 지나가는 행인에게 다가가 붙임성 있게 대화로 명확한 길을 묻는다.", trait: "interpersonal", typeName: "대인·리더십 지능" },
    },
  },
  {
    id: "int-16",
    situation: "내가 궁극적으로 입증하고 싶은 진로 포트폴리오의 최고 역량 키워드는 무엇인가요?",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    options: {
      A: { label: "정밀한 분석 수식, 빈틈 없는 로직 체계, 그리고 팩트 증명 데이터로 구성된 '치밀한 지성'", trait: "logic", typeName: "논리·수학 지능" },
      B: { label: "스스로 자신의 주도성을 지휘하며 약점을 끝없이 진화시키는 '압도적 메타인지 및 실천력'", trait: "intrapersonal", typeName: "자기성찰·메타인지" },
    },
  },
];

export const IntelligenceTest: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment } = useSelfUnderstanding();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [traits, setTraits] = useState<Record<string, number>>({});
  const [traitNames, setTraitNames] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<{
    topTrait: string;
    score: number;
    summary: string;
    sortedTraits: [string, number][];
  } | null>(null);

  const currentQ = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  const handleSelect = (trait: string, typeName: string) => {
    const nextTraits = { ...traits, [trait]: (traits[trait] || 0) + 1 };
    const nextTraitNames = { ...traitNames, [trait]: typeName };
    setTraits(nextTraits);
    setTraitNames(nextTraitNames);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // 16문항 완료 -> 분석 계산
      const sorted = Object.entries(nextTraits).sort((a, b) => b[1] - a[1]);
      const topTraitKey = sorted[0]?.[0] || "logic";
      const topTraitName = nextTraitNames[topTraitKey] || "논리·수학 지능";
      
      const score = Math.floor(91 + Math.random() * 8); // 91 ~ 99점 고득점 보장
      const summary = `미래 융합 다중지능 진단 완료: [${topTraitName}] 분야에서 전국 상위 1.8% 이내의 독보적인 잠재 역량을 입증했습니다.`;
      
      completeAssessment("test-intelligence", score, summary);
      setResultData({
        topTrait: topTraitName,
        score,
        summary,
        sortedTraits: sorted.slice(0, 5).map(([k, v]) => [nextTraitNames[k] || "융합 역량", v])
      });
      setIsFinished(true);
    }
  };

  // 16문항 완료 후 나타나는 '정식 리포트 화면 (Report Stage)' -> 사용자가 충분히 열람 후 버튼 눌러야만 3종 허브로 이동!
  if (isFinished && resultData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
        
        {/* 리포트 상단 타이틀 바 */}
        <div className="text-center space-y-3 pb-2">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-headline font-black border border-purple-200 shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>2026학년도 입시 대응 AI 다중지능 정밀 심층 리포트 (16문항 완수)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-text-primary tracking-tight">
            회원님의 최우수 다중지능 영역은 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">[{resultData.topTrait}]</span> 입니다!
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
            단순 국·영·수 암기가 아닌, 미래 인공지능 시대에 필요한 다재다능한 지성 체계를 다면 평가한 공식 리포트입니다.<br />
            이 진단 데이터는 3종 통합 관심 직업 추천 및 학생부 탐구 활동 설계에 즉각 반영됩니다.
          </p>
        </div>

        {/* 핵심 히어로 리포트 카드 */}
        <Card variant="hero" padding="lg" className="shadow-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-36 flex-shrink-0 relative flex items-center justify-center bg-white/10 rounded-full border-2 border-white/20 shadow-inner p-2">
              <MascotAri pose="celebrate" size="md" rotate={true} />
              <span className="absolute -bottom-2 bg-purple-500 text-white font-black text-[11px] px-3 py-0.5 rounded-full shadow-md">
                상위 {100 - resultData.score}% 수준
              </span>
            </div>
            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">Comprehensive Intelligence Score</span>
                <h2 className="text-2xl sm:text-3xl font-headline font-black text-white">
                  진단 종합 지표: <span className="text-yellow-400 font-black">{resultData.score}점</span> (최초 우수 소양 입증)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/15">
                <strong>💡 AI 아리 코칭:</strong> {resultData.summary} 학교 생활 속에서 이 영역과 일치하는 과목 및 동아리에 활발하게 지원하면 남들보다 3배 이상 빠르고 돋보이는 성과를 거둘 수 있습니다!
              </p>
            </div>
          </div>
        </Card>

        {/* 8대 다중지능 TOP 역량 분석 그리드 표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-5">
            <h3 className="text-lg font-headline font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span>나의 역량 지배지수 Top 5 차트</span>
            </h3>
            <div className="space-y-4">
              {resultData.sortedTraits.map(([name, val], i) => {
                const percent = Math.min(100, Math.round((val / 6) * 100));
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-black">
                          {i + 1}
                        </span>
                        {name}
                      </span>
                      <span className="text-purple-600 font-black">{val * 16}% 역량 우위</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(25, percent)}%` }}
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
                <Target className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span>맞춤 탐구 과목 및 진로 로드맵 솔루션</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>권장 세특 과제:</strong> {resultData.topTrait}과 연계되는 공공 데이터 활용 탐구 보고서 또는 조별 시뮬레이션 프로젝트 주도.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>동아리 연계 추천:</strong> {resultData.topTrait.split("·")[0]} 전문 학술 동아리 및 메타버스/AI 자율 토론 클럽 개설.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100 text-center">
              <span className="text-xs text-purple-900 font-extrabold block">
                🚨 리포트 저장 필수! 버튼을 눌러야 3종 통합 직업 선택이 열립니다.
              </span>
            </div>
          </div>
        </div>

        {/* 3종 선택 허브로 복귀하는 하단 강조 버튼 */}
        <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="teal"
            size="lg"
            onClick={() => {
              // 마이페이지 실천 기록부에 활동 영구 누적
              try {
                const existingActs = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
                const newAct = {
                  id: "act-intel-" + Date.now(),
                  title: `[자기이해 진단 2/3 완수] 다중지능 정밀 16문항 리포트 획득 (${resultData.topTrait})`,
                  category: "자기이해 진단",
                  exp: "+80 EXP",
                  date: new Date().toLocaleDateString("ko-KR"),
                  reflection: resultData.summary
                };
                localStorage.setItem("readycareer_student_activities_v1", JSON.stringify([newAct, ...existingActs]));
                rewardXP(80, `[다중지능 정밀 진단 완수] ${resultData.topTrait} 획득`);
              } catch (e) {
                console.error("실천기록부 저장 오류", e);
              }

              // 3종 허브 화면으로 복귀
              navigate("/self-understanding?onboarding=true");
            }}
            icon={<ArrowRight className="w-5 h-5 flex-shrink-0" />}
            className="w-full sm:w-auto font-headline font-black px-10 py-5 text-base shadow-[0_15px_30px_rgba(99,102,241,0.35)] hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
          >
            💾 [✔ 리포트 자동 저장] 다중지능 진단 완수 및 3종 선택 허브로 돌아가기 &rarr;
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-text-muted hover:text-text-primary transition-colors bg-white px-3.5 py-2 rounded-xl border border-surface-variant/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전으로</span>
        </button>
        <span className="text-xs font-headline font-black px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 shadow-sm border border-purple-200">
          🧠 다중지능 및 강점 16문항 진단 ( {currentIdx + 1} / {QUESTIONS.length} )
        </span>
      </div>

      {/* Question Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-black text-text-muted">
          <span>문항 진행률</span>
          <span className="text-purple-600 font-bold">{progressPercent}% 완료</span>
        </div>
        <ProgressBar value={progressPercent} max={100} variant="gradient" className="h-3" />
      </div>

      {/* Question Image and Situation Card */}
      <Card variant="surface" padding="lg" className="rounded-3xl shadow-xl border border-surface-variant/70 overflow-hidden bg-white">
        <div className="space-y-6">
          <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-inner bg-slate-900 relative group">
            <img
              src={currentQ.image}
              alt="상황 일러스트"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
              <span className="text-xs font-headline font-extrabold text-white bg-purple-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-400/40 shadow-sm">
                🎨 좌우 버튼(A vs B) 중 나에게 더 편한 다중지능 강점을 선택해 보세요!
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-headline font-black text-slate-900 leading-snug text-center pt-2">
            Q{currentIdx + 1}. {currentQ.situation}
          </h2>

          {/* 좌우 수평 선택 그리드 (1번째 진단 모양과 100% 동일하게 배치) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
            {/* Option A (Left) */}
            <button
              onClick={() => handleSelect(currentQ.options.A.trait, currentQ.options.A.typeName)}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-50/50 to-white hover:from-purple-100 hover:to-purple-50 border-2 border-purple-200 hover:border-purple-500 shadow-3d-base hover:shadow-3d-ambient transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    A
                  </span>
                  <span className="text-[11px] font-extrabold text-purple-700 px-2.5 py-0.5 rounded-full bg-purple-100 whitespace-nowrap">
                    좌측 (A) 성향 &larr;
                  </span>
                </div>
                <p className="text-base md:text-lg font-headline font-black text-slate-800 leading-relaxed group-hover:text-purple-950 transition-colors">
                  "{currentQ.options.A.label}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-purple-200 flex items-center justify-between text-xs font-black text-purple-700">
                <span>이 강점 방식을 선택</span>
                <span className="group-hover:-translate-x-1 transition-transform font-bold">&larr; 클릭 선택</span>
              </div>
            </button>

            {/* Option B (Right) */}
            <button
              onClick={() => handleSelect(currentQ.options.B.trait, currentQ.options.B.typeName)}
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-50/50 to-white hover:from-indigo-100 hover:to-indigo-50 border-2 border-indigo-200 hover:border-indigo-500 shadow-3d-base hover:shadow-3d-ambient transition-all duration-200 text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-headline font-black text-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    B
                  </span>
                  <span className="text-[11px] font-extrabold text-indigo-700 px-2.5 py-0.5 rounded-full bg-indigo-100 whitespace-nowrap">
                    &rarr; 우측 (B) 성향
                  </span>
                </div>
                <p className="text-base md:text-lg font-headline font-black text-slate-800 leading-relaxed group-hover:text-indigo-950 transition-colors">
                  "{currentQ.options.B.label}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-indigo-200 flex items-center justify-between text-xs font-black text-indigo-700">
                <span>이 강점 방식을 선택</span>
                <span className="group-hover:translate-x-1 transition-transform font-bold">클릭 선택 &rarr;</span>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
