import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { JOB_VENGERS_LIST, type JobVengerItem, ARI_BLOB_URL, ARI_BLOB_NEW_URL } from "../assets/mascotData";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Award, Star, ChevronRight } from "lucide-react";

interface DiagnosticQuestion {
  id: number;
  category: string;
  icon: string;
  title: string;
  prompt: string;
  bgGlow: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  { id: 1, category: "AI 인공지능 & 로보틱스", icon: "🤖", title: "차세대 자율 로봇 및 신경망 코딩", prompt: "안녕! 아리야~ 첫 번째 질문이야! 최첨단 AI 인공지능 로봇을 프로그래밍하고 자율주행 알고리즘을 개발하는 일에 매력을 느끼니?", bgGlow: "from-[#E0ECFF] via-[#EFEAFE] to-[#E3FBF5]" },
  { id: 2, category: "미디어·디지털 크리에이팅", icon: "🎨", title: "메타버스 & 3D AR/VR 크리에이터", prompt: "전 세계인이 환호할 메타버스 가상 세계 공간이나 차세대 3D AR/VR 융합 미디어 콘텐츠를 직접 디자인하고 이끌어가고 싶어?", bgGlow: "from-[#FEEBF7] via-[#F7EAFD] to-[#E2FBFE]" },
  { id: 3, category: "스마트 바이오 & 생명공학", icon: "🧬", title: "유전체 분석 및 차세대 AI 신약 연구", prompt: "인간의 생명을 구하는 혁신적 신약 물질이나 첨단 AI 의학 데이터를 정밀 분석하여 질병 극복과 유전자 연구에 도전해볼래?", bgGlow: "from-[#E2FDEC] via-[#E8FBFE] to-[#F1F6FF]" },
  { id: 4, category: "ESG & 클린 에너지 솔루션", icon: "🌿", title: "탄소중립 신재생 친환경 에너지", prompt: "지구를 위협하는 기후 문제를 스마트하게 해결할 클린 수소 에너지나 친환경 탄소 자원 순환 시스템을 개발하고 싶어?", bgGlow: "from-[#EAFBF0] via-[#E7FAFD] to-[#EEEFFE]" },
  { id: 5, category: "우주항공 & 궤도 네비게이션", icon: "🛰️", title: "화성 탐사와 초고속 우주 위성 설계", prompt: "우주 저편으로 향하는 초고속 항공 탐사 위성 궤도를 정밀 렌더링하고 우주 로켓 네비게이션 시스템을 지휘해보고 싶어?", bgGlow: "from-[#E6F0FF] via-[#E2E2FF] to-[#F5EAFE]" },
  { id: 6, category: "첨단 보건 & 스마트 시티 의료", icon: "🏥", title: "원격 스마트 헬스케어 및 바이오 기기", prompt: "스마트 웨어러블 센서를 통해 시민들의 건강과 생명을 24시간 돌보는 차세대 첨단 의료 플랫폼을 설계하는 일에 흥미가 가?", bgGlow: "from-[#FFEDE6] via-[#FFF2E2] to-[#ECFAFE]" },
  { id: 7, category: "양자 데이터 & 핀테크", icon: "📊", title: "양자 컴퓨팅 기반 미래 경제 트렌드", prompt: "상상을 초월하는 속도의 양자 컴퓨터와 빅데이터를 가공하여 미래 글로벌 경제 시장의 금융 흐름과 트렌드를 꿰뚫어 볼래?", bgGlow: "from-[#FFF9E6] via-[#FCEFFE] to-[#E5FAFD]" },
  { id: 8, category: "미래 스마트시티 아키텍처", icon: "🏙️", title: "IoT 사물인터넷 융합 친환경 도시공간", prompt: "하늘을 나는 도심 항공 모빌리티(UAM)와 인텔리전트 IoT 건물들이 공존하는 미래 친환경 초거대 인공지능 도시를 설계해볼래?", bgGlow: "from-[#E9F5FF] via-[#F0EAFF] to-[#EBFCFA]" },
  { id: 9, category: "글로벌 게임 메가아키텍트", icon: "🎮", title: "수억 명이 진입할 초대형 게임 엔진", prompt: "한계가 없는 자유도를 자랑하는 글로벌 최고 3D 메가 오픈월드 게임의 거대한 세계관을 집필하고 물리학 엔진을 기획하고 싶어?", bgGlow: "from-[#EFE4FE] via-[#FFDFEE] to-[#E3FBFE]" },
  { id: 10, category: "차세대 첨단 신소재 공학", icon: "⚗️", title: "초전도 배터리와 극고열 신소재 개발", prompt: "우주선 본체와 미래형 전기차의 뼈대가 될 초경량 고부하 신소재 물질이나 영구 초전도 에너지 체계를 실험해보고 싶니?", bgGlow: "from-[#FFF5E6] via-[#FFE7EA] to-[#F1EEFE]" },
  { id: 11, category: "사이버 보안 & 화이트해커", icon: "🛡️", title: "국가 및 인공지능 네트워크 방어 작전", prompt: "악질적인 사이버 해킹으로부터 전 세계 데이터망을 철통같이 보호하고 AI 암호 방어벽을 통제하는 화이트해커에 끌리니?", bgGlow: "from-[#E5EFFF] via-[#EFF2FA] to-[#EBFBFA]" },
  { id: 12, category: "에듀테크 & 지식 혁신", icon: "📚", title: "AI 어시스턴트 기반 차세대 미래 교육", prompt: "배움에 목마른 전 세계 청소년들에게 나만의 혁신적인 AI 학습 플랫폼과 차별화된 에듀테크 기술을 통해 따뜻한 희망을 전하고 싶어?", bgGlow: "from-[#FAEEFE] via-[#FFE9EC] to-[#EAFBFA]" },
  { id: 13, category: "뉴럴 네트워크 & 뇌 심리 연구", icon: "🧠", title: "인간의 감성과 뇌 기계 인터페이스(BMI)", prompt: "인간 뇌의 감성과 메커니즘을 정밀히 이해하여, 생각만으로 기계와 통신하고 공감하는 차세대 뉴럴 뇌 인터페이스 분야를 연구할래?", bgGlow: "from-[#F0EAFF] via-[#FFE8FA] to-[#EAFFFD]" },
  { id: 14, category: "첨단 해양 자원 융합 탐색", icon: "🌊", title: "심해 생태계 보존 및 로보틱 해양 개발", prompt: "신비로운 깊은 대양 밑 심해 생태계를 보존하면서, 무한한 친환경 수자원을 발굴하는 자율 해양 로보틱스 잠수함을 지휘해볼래?", bgGlow: "from-[#E5FCFF] via-[#E2F1FF] to-[#F1ECFF]" },
  { id: 15, category: "글로벌 테크 윤리 정책", icon: "🤝", title: "인류와 첨단 기술의 공생 법적 거버넌스", prompt: "급변하는 AI와 신기술 속에서 인간성 상실을 막고 전 세계인이 공생할 수 있는 따뜻하고 공정한 글로벌 법령 체계를 만들고 싶어?", bgGlow: "from-[#F7EEFC] via-[#FFF7E8] to-[#E8FCFB]" },
  { id: 16, category: "초광역 양자 우주 통신", icon: "📡", title: "행성 간 광역 레이저 양자 데이터망", prompt: "드디어 마지막! 지구와 인공 위성, 미래 은하 기지 간에 단 0.001초의 끊김도 없이 통신하는 초고속 양자 광선 데이터망을 뚫어볼래?", bgGlow: "from-[#EFEAFF] via-[#F9E6FF] to-[#E3FBFF]" },
];

export const OnboardingTestFlow: React.FC = () => {
  const navigate = useNavigate();
  const { session, startExpoDemo } = useAuth();

  // 화면 뷰 상태: 'questions' (16문항) -> 'recommendations' (5대 추천) -> 'character_intro' (Lv.0~5 순서)
  const [currentView, setCurrentView] = useState<"questions" | "recommendations" | "character_intro">("questions");
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<JobVengerItem | null>(null);

  // 16문항 박스 답변 시 진행
  const handleAnswerQuestion = () => {
    if (qIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setCurrentView("recommendations");
    }
  };

  const handlePrevQuestion = () => {
    if (qIndex > 0) setQIndex(qIndex - 1);
  };

  const handleSelectCharacter = (item: JobVengerItem) => {
    setSelectedJob(item);
    setCurrentView("character_intro");
  };

  // 선택한 직업으로 ReadyCareer AI 홈화면 직행
  const handleCompleteAndGoHome = () => {
    if (selectedJob) {
      localStorage.setItem("readycareer_selected_job", JSON.stringify(selectedJob));
      localStorage.setItem("readycareer_target_job_name", selectedJob.title);
      localStorage.setItem("readycareer_custom_avatar_url", selectedJob.imageUrl);
      
      if (session) {
        startExpoDemo("student", {
          ...session,
          targetJob: selectedJob.title,
          riasecCode: "AI-PRO",
        });
      }
    }
    // 16개 진단을 마친 직후, 홈화면 입장 시 4대 모듈은 비어있어야 하고 AI 맞춤 활동 버튼을 가동하도록 숨김 초기화!
    localStorage.removeItem("readycareer_roadmap_generated");
    localStorage.removeItem("my_habits_v2");
    navigate("/");
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[qIndex];
  const progressPercent = Math.round(((qIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);

  // 진단 추천으로 등장할 핵심 직벤져스 캐릭터 5종
  const recommendedHeroes = JOB_VENGERS_LIST.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#FAF6FF] via-[#F2EEFF] to-[#F7F4FF] text-[#1A1626] relative py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* 3D Glass Ambient Background Aura Spheres */}
      <div className="absolute top-12 left-1/5 w-[520px] h-[520px] bg-gradient-to-tr from-[#DFCAFF]/50 via-[#FEEBFC]/50 to-[#C6FAF2]/50 rounded-full blur-[110px] pointer-events-none -z-0" />
      <div className="absolute bottom-12 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#FFE6EE]/50 via-[#DCEBFF]/50 to-[#ECDFFF]/40 rounded-full blur-[110px] pointer-events-none -z-0" />

      <div className="max-w-5xl w-full mx-auto relative z-10">

        {/* VIEW 1: 16문항 진단검사 (상단 문항&캐릭터 / 하단 2개 박스형 선택지) */}
        {currentView === "questions" && (
          <div className="space-y-8 animate-fadeIn flex flex-col items-center">
            
            {/* 상단 진행률 바 */}
            <div className="w-full bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[30px] border border-white shadow-[0_12px_32px_rgba(123,92,240,0.08)] space-y-3">
              <div className="flex items-center justify-between font-headline font-extrabold text-xs sm:text-sm text-[#5C5672]">
                <span className="flex items-center gap-2 text-[#7B5CF0]">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  3D 직업 아리 '직벤져스' AI 진로 흥미 밸런스 검사
                </span>
                <span className="bg-[#7B5CF0]/15 text-[#7B5CF0] px-3.5 py-1 rounded-full font-black">
                  Q.{qIndex + 1} / {DIAGNOSTIC_QUESTIONS.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#EAE4FA] overflow-hidden shadow-inner p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#7B5CF0] via-[#FF3B7C] to-[#008A90] transition-all duration-300 shadow-sm" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            {/* 상단(Above): 문항과 마스코트 캐릭터 배치 (글보다 이미지/액티비티 위주의 3D 비주얼 인터렉션) */}
            <div className={`w-full rounded-[44px] bg-gradient-to-tr ${currentQ.bgGlow} p-6 sm:p-12 border-4 border-white shadow-[0_25px_65px_rgba(123,92,240,0.22)] flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 backdrop-blur-2xl relative overflow-hidden group`}>
              
              {/* 배경 인터렉티브 파스텔 액티비티 그래픽 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -z-0 pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              
              {/* 캐릭터 & 3D 아이콘 애니메이션 영역 */}
              <div className="flex-shrink-0 flex flex-col items-center text-center space-y-3 z-10">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-[40px] bg-white/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)] border-[3px] border-white flex items-center justify-center relative transform group-hover:scale-105 transition-all duration-300">
                  {/* 거대 3D 애니메이션 이모지 뱃지 */}
                  <span className="text-5xl sm:text-6xl absolute -top-5 -right-4 bg-gradient-to-br from-white to-purple-50 p-3 rounded-3xl shadow-xl border-2 border-purple-200 animate-bounce">
                    {currentQ.icon}
                  </span>
                  <div className="w-full h-full animate-float flex items-center justify-center">
                    <img 
                      src={qIndex % 2 === 0 ? ARI_BLOB_URL : ARI_BLOB_NEW_URL} 
                      alt="Ari Mascot" 
                      className="w-36 h-36 sm:w-44 sm:h-44 object-contain filter drop-shadow-lg" 
                    />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-[#6240D5] bg-white/95 px-4.5 py-1.5 rounded-full shadow-sm border border-purple-200 tracking-tight whitespace-nowrap">
                  ⚡ 아리의 {currentQ.category} 미션
                </span>
              </div>

              {/* 질문 문항 말풍선 (단어 기준 깔끔한 줄바꿈 보장) */}
              <div className="flex-grow text-center sm:text-left space-y-4 w-full bg-white/90 p-8 sm:p-10 rounded-[38px] border-[3px] border-white shadow-xl relative z-10 transition-all">
                <span className="text-xs font-black text-[#7B5CF0] uppercase tracking-widest bg-purple-100/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#7B5CF0] animate-ping" />
                  <span>QUESTION 0{currentQ.id}</span>
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#1A1626] leading-snug tracking-tight break-keep">
                  "{currentQ.prompt}"
                </h2>
                <div className="w-full h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-transparent rounded-full opacity-60" />
              </div>
            </div>

            {/* 하단(Below): 2개 선택 박스 (글은 대폭 줄이고 직관적인 3D 애니메이션 이미지 극대화) */}
            <div className="w-full space-y-3 pt-2">
              {/* 문항과 선택지 사이: 아리 대화형 말풍선 단일 멘트 */}
              <div className="flex items-center justify-center gap-2.5 my-2 animate-fadeIn">
                <img src={ARI_BLOB_URL} alt="Ari" className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-md flex-shrink-0 animate-bounce-short" />
                <div className="bg-white/95 px-5 py-2 sm:py-2.5 rounded-[22px] rounded-tl-none shadow-md border-[2px] border-purple-200 text-[#3D3554] text-xs sm:text-sm font-black tracking-tight break-keep">
                  💬 <strong className="text-[#7B5CF0]">아리의 귀띔:</strong> "👇 내 마음에 쏙 드는 선택지 버튼을 가벼운 터치로 골라줘!"
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* 선택지 A (Positive / 긍정 반응 비주얼 버튼) */}
                <div
                  onClick={handleAnswerQuestion}
                  className="rounded-[38px] bg-gradient-to-br from-white/90 to-[#E8FAFB] backdrop-blur-2xl p-2 border-[3px] border-[#008A90]/30 shadow-[0_15px_45px_rgba(0,186,180,0.22)] hover:shadow-[0_22px_65px_rgba(0,186,180,0.45)] hover:border-[#008A90] transition-all duration-300 cursor-pointer group transform hover:-translate-y-2"
                >
                  <button className="w-full py-7 px-6 sm:px-8 rounded-[32px] bg-white/70 group-hover:bg-white text-[#1A1626] font-black border border-white border-b-[8px] border-b-[#86EBEF] group-hover:border-b-[#008A90] active:border-b-2 active:translate-y-2 transition-all flex flex-col items-center justify-center space-y-4 text-center">
                    <span className="text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-200 filter drop-shadow-md animate-bounce-short">
                      💖
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#006970] break-keep">
                      😍 완전 설레고 꼭 해볼래요!
                    </span>
                    <div className="inline-flex items-center text-xs font-black bg-[#E5FCFD] text-[#008A90] px-4 py-1.5 rounded-full border border-[#B3F4F8] shadow-sm group-hover:bg-[#008A90] group-hover:text-white transition-colors">
                      <span>이 직무 성향 선택 &rarr;</span>
                    </div>
                  </button>
                </div>

                {/* 선택지 B (Alternative / 탐색 반응 비주얼 버튼) */}
                <div
                  onClick={handleAnswerQuestion}
                  className="rounded-[38px] bg-gradient-to-br from-white/90 to-[#F2EEFF] backdrop-blur-2xl p-2 border-[3px] border-[#7B5CF0]/30 shadow-[0_15px_45px_rgba(123,92,240,0.18)] hover:shadow-[0_22px_65px_rgba(123,92,240,0.42)] hover:border-[#7B5CF0] transition-all duration-300 cursor-pointer group transform hover:-translate-y-2"
                >
                  <button className="w-full py-7 px-6 sm:px-8 rounded-[32px] bg-white/70 group-hover:bg-white text-[#1A1626] font-black border border-white border-b-[8px] border-b-[#D7CFFF] group-hover:border-b-[#7B5CF0] active:border-b-2 active:translate-y-2 transition-all flex flex-col items-center justify-center space-y-4 text-center">
                    <span className="text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-200 filter drop-shadow-md">
                      🔍
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#5B3BC4] break-keep">
                      🤔 다른 멋진 분야도 궁금해요!
                    </span>
                    <div className="inline-flex items-center text-xs font-black bg-[#F0ECFF] text-[#6240D5] px-4 py-1.5 rounded-full border border-[#D5CAFF] shadow-sm group-hover:bg-[#6240D5] group-hover:text-white transition-colors">
                      <span>다른 가능성 탐험 &rarr;</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 이전 버튼 */}
              {qIndex > 0 && (
                <div className="text-center pt-4">
                  <button
                    onClick={handlePrevQuestion}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6E6A80] hover:text-[#7B5CF0] px-4 py-2 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전 질문으로 다시 가기</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: 간략한 진단 피드백 네모박스 + 직업 추천 4~5개 */}
        {currentView === "recommendations" && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* 1) 아주 간단한 진단 검사 피드백 (네모 박스) */}
            <div className="rounded-[36px] bg-white/90 backdrop-blur-2xl p-8 sm:p-12 border-2 border-[#D7BFFF] shadow-[0_20px_50px_rgba(123,92,240,0.14)] flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#F4E3FF] via-[#E2EDFF] to-[#C9FAFF] p-3 flex-shrink-0 flex items-center justify-center border-4 border-white shadow-xl">
                <img src={ARI_BLOB_URL} alt="Ari Feedback" className="w-full h-full object-contain animate-bounce-short" />
              </div>
              <div className="space-y-3 text-center sm:text-left flex-grow">
                <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0] text-white px-4 py-1 rounded-full text-xs font-black shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>진단 완료! AI 아리의 10초 핵심 피드백</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1A1626] tracking-tight leading-tight">
                  🎯 분석 결과! 회원님은 <span className="text-[#7B5CF0]">창의 융합 개척</span> &amp; <span className="text-[#008A90]">최첨단 기술 비전</span>에 뛰어난 가능성을 품고 계십니다!
                </h2>
                <p className="text-sm sm:text-base text-[#4D4862] font-semibold leading-relaxed bg-[#FAF6FF] p-4.5 rounded-2xl border border-purple-100 shadow-inner">
                  " 16개 문항 분석 끝에 도출된 회원님의 성격과 흥미는 미지의 AI 기술을 주도하고 세상을 무궁무진하게 변화시키는 <strong>이노베이터(Innovator)</strong> 유형입니다! 아래 추천해 드리는 5명의 직벤져스 중에서 나의 진로 메이트를 선택해 보세요! "
                </p>
              </div>
            </div>

            {/* 2) 직업 추천하기 (직벤져스 캐릭터 5개 ➜ 클릭 시 소개페이지로) */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1A1626]">
                  🚀 내 꿈의 여정을 함께할 추천 '직벤져스' 마스코트
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A80] font-bold">
                  원하는 직업 마스코트를 클릭하시면 즉시 <strong>Lv.0 ~ Lv.5 레벨업 순차 진화 스토리</strong>를 확인하실 수 있습니다!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-3">
                {recommendedHeroes.map((hero, index) => {
                  const matchRates = [99.4, 97.8, 95.2, 92.9, 90.5];
                  return (
                    <div
                      key={hero.id}
                      onClick={() => handleSelectCharacter(hero)}
                      className={`p-6 rounded-[34px] bg-gradient-to-b ${hero.bgGradient} hover:bg-white border-4 border-white shadow-[0_15px_35px_rgba(123,92,240,0.12)] hover:shadow-[0_25px_55px_rgba(123,92,240,0.3)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-between group transform hover:-translate-y-3.5 backdrop-blur-lg relative`}
                    >
                      <span className="absolute -top-3.5 -right-2 bg-gradient-to-r from-[#FF3B7C] to-[#FF256C] text-white font-black text-[11px] px-3.5 py-1 rounded-full shadow-md animate-pulse">
                        싱크로율 {matchRates[index]}%
                      </span>

                      <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-[#5B556D] pt-1">
                        <span className="bg-white/90 px-2.5 py-0.5 rounded-full shadow-sm">#{index + 1} 순위</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>

                      <div className="w-36 h-36 rounded-full bg-white/90 p-3 shadow-inner border-2 border-white flex items-center justify-center my-4 group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
                        <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-contain drop-shadow-md" />
                      </div>

                      <div className="w-full text-center space-y-2 bg-white/95 backdrop-blur-sm p-3.5 rounded-[26px] border border-white shadow-sm">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${hero.badgeColor} block w-fit mx-auto`}>
                          {hero.category}
                        </span>
                        <strong className="text-sm font-extrabold text-[#1A1626] block leading-tight group-hover:text-[#7B5CF0] transition-colors truncate">
                          {hero.title}
                        </strong>
                        <div className="pt-2 text-xs font-black text-[#7B5CF0] flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform border-t border-purple-50">
                          <span>레벨업 과정 보기</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: 캐릭터 소개 페이지 (글은 삭제! Lv.0~5 이름, 뱃지, 캐릭터 순차적 레벨업 진화 화면 + 시작버튼 + 다시선택) */}
        {currentView === "character_intro" && selectedJob && (
          <div className="space-y-14 animate-fadeIn max-w-5xl mx-auto">
            
            {/* 상단 선택 캐릭터 히어로 뱃지 헤더 */}
            <div className={`rounded-[44px] bg-gradient-to-r ${selectedJob.bgGradient} p-8 sm:p-12 border-4 border-white shadow-[0_25px_65px_rgba(123,92,240,0.18)] flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-2xl relative overflow-hidden`}>
              <div className="space-y-3 max-w-2xl text-center sm:text-left z-10">
                <span className={`text-xs font-black px-4 py-1.5 rounded-full ${selectedJob.badgeColor} border border-purple-200 shadow-sm inline-block`}>
                  ✨ 내 미래의 주인공 캐릭터 · {selectedJob.category}
                </span>
                <h1 className="text-3xl sm:text-6xl font-black text-[#1A1626] tracking-tight leading-tight">
                  <span className="text-[#7B5CF0]">{selectedJob.title}</span> <br className="hidden sm:block"/>
                  진화 레벨업 로드맵!
                </h1>
              </div>

              <div className="flex-shrink-0 z-10 flex flex-col items-center">
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white/95 p-4 shadow-2xl border-4 border-white flex items-center justify-center transform hover:scale-105 transition-all animate-float">
                  <img src={selectedJob.imageUrl} alt={selectedJob.title} className="w-full h-full object-contain filter drop-shadow-2xl" />
                </div>
                <span className="mt-3 text-xs font-black bg-[#7B5CF0] text-white px-5 py-2 rounded-full shadow-lg">
                  💎 내 메이트 선택 완료!
                </span>
              </div>
            </div>

            {/* Lv.0 ~ Lv.5 순차적 레벨업 진화 화면 (불필요한 네모 설명칸 완전 삭제!) */}
            <div className="space-y-4 pt-2">

              {/* 순차 레벨업 카드 그리드 (6개 단계) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 relative items-stretch">
                {[
                  { lv: "Lv.0", badge: "🌱 새싹 탐구", name: "꿈결 탐험 아리", bg: "from-[#F5EFFF] to-[#E6DBFF]", border: "border-[#D7C4FF]", shadow: "shadow-purple-100", scale: "w-24 h-24", tagBg: "bg-[#805FFF] text-white" },
                  { lv: "Lv.1", badge: "📖 지식 융합", name: "호기심 장착 아리", bg: "from-[#E3FAFF] to-[#C0F3FC]", border: "border-[#ACE7F2]", shadow: "shadow-cyan-100", scale: "w-28 h-28", tagBg: "bg-[#008C9E] text-white" },
                  { lv: "Lv.2", badge: "⚡ 실전 챌린지", name: "프로젝트 리더 아리", bg: "from-[#FFEBF2] to-[#FFCFE2]", border: "border-[#FABDE4]", shadow: "shadow-pink-100", scale: "w-28 h-28", tagBg: "bg-[#FF3B7C] text-white" },
                  { lv: "Lv.3", badge: "🏆 생기부 마스터", name: "포트폴리오 왕 아리", bg: "from-[#FFF8E4] to-[#FFECD2]", border: "border-[#F8DCB5]", shadow: "shadow-amber-100", scale: "w-32 h-32", tagBg: "bg-[#D97706] text-white" },
                  { lv: "Lv.4", badge: "🚀 차세대 엑스퍼트", name: "미래 전문 아리", bg: "from-[#E6F0FF] to-[#C8E0FF]", border: "border-[#B5CEFB]", shadow: "shadow-blue-100", scale: "w-32 h-32", tagBg: "bg-[#2563EB] text-white" },
                  { lv: "Lv.5", badge: "👑 마스터 아키텍트", name: "최상위 비전 아리", bg: "from-[#EBFFF8] to-[#9EFAEA]", border: "border-[#77EDD9]", shadow: "shadow-emerald-100", scale: "w-36 h-36 animate-bounce-short", tagBg: "bg-[#059669] text-white font-black" },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`rounded-[36px] bg-gradient-to-b ${item.bg} p-4 sm:p-5 border-2 ${item.border} shadow-[0_12px_32px_rgba(123,92,240,0.12)] hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between space-y-4 group transform hover:-translate-y-2.5 relative backdrop-blur-md`}
                  >
                    {/* Arrow Indicator between level boxes (On desktop) */}
                    {idx < 5 && (
                      <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-purple-200 shadow-md items-center justify-center text-[#7B5CF0] font-black text-sm">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}

                    {/* 레벨 번호 & 뱃지 (글자/설명 없이 정확히 이름과 뱃지, 캐릭터만!) */}
                    <div className="w-full flex flex-col items-center space-y-1.5 pt-1">
                      <span className="text-[13px] sm:text-sm font-black px-3 py-0.5 rounded-full bg-white text-[#3F3952] shadow-sm border border-white">
                        {item.lv}
                      </span>
                      <span className={`text-[11px] sm:text-xs font-black px-3 py-1 rounded-xl shadow-sm ${item.tagBg}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* 캐릭터 이미지 (레벨 올라갈수록 커지고 영광스러워짐!) */}
                    <div className={`rounded-full bg-white/90 p-2.5 shadow-inner border-2 border-white flex items-center justify-center my-2 transition-transform duration-300 group-hover:scale-115 ${item.scale}`}>
                      <img 
                        src={selectedJob.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-contain filter drop-shadow-md" 
                      />
                    </div>

                    {/* 레벨 이름 */}
                    <div className="w-full text-center bg-white/95 backdrop-blur-md py-2.5 px-2 rounded-2xl border border-white shadow-sm">
                      <strong className="text-xs sm:text-sm font-black text-[#1A1626] block tracking-tight group-hover:text-[#7B5CF0] transition-colors truncate">
                        {item.name}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION START BUTTON & UNDERLINED RESELECT LINK */}
            <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-6 space-y-5">
              {/* 3D 게임 느낌 시작 버튼 */}
              <div className="w-full p-2 rounded-[38px] bg-gradient-to-r from-[#D7CEFF] via-[#FFC0D9] to-[#BAF7FF] shadow-[0_0_55px_rgba(123,92,240,0.4)] hover:shadow-[0_0_75px_rgba(255,64,129,0.6)] transition-all duration-300">
                <button
                  onClick={handleCompleteAndGoHome}
                  className="w-full py-5 px-6 sm:px-10 bg-gradient-to-r from-[#7B5CF0] via-[#8B61FF] to-[#008A90] hover:from-[#886BF0] hover:to-[#12A0A3] text-white rounded-[30px] font-black text-xl sm:text-2xl tracking-wide border-2 border-white/85 border-b-[10px] border-b-[#4722AD] active:border-b-[2px] active:translate-y-2 transition-all flex items-center justify-center gap-3 shadow-2xl cursor-pointer whitespace-nowrap"
                >
                  <Award className="w-7 h-7 text-white fill-white animate-bounce-short" />
                  <span className="drop-shadow-md">선택한 직업으로 ReadyCareer AI 시작하기</span>
                  <ArrowRight className="w-7 h-7 text-white" />
                </button>
              </div>

              {/* [ 직업 다시 선택하기 ] 밑줄 링크 */}
              <button
                onClick={() => setCurrentView("recommendations")}
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#6E6A80] hover:text-[#7B5CF0] transition-colors py-2"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" />
                <span className="underline underline-offset-4 decoration-2 decoration-[#6E6A80]/60 group-hover:decoration-[#7B5CF0]">
                  직업 다시 선택하기
                </span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingTestFlow;
