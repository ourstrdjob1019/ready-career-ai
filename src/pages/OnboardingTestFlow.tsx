import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { JOB_VENGERS_LIST, type JobVengerItem, ARI_BLOB_URL, getJobCharacterImage, getJobCharacterTitle } from "../assets/mascotData";
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

  // 화면 뷰 상태: 'questions' (16문항) -> 'recommendations' (5대 추천 매칭 + 팝업 모달)
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
    // 페이지 전환 없이 직업 매칭 추천 화면 위에 팝업 모달로 띄움!
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
    // 초기 경험치는 팝업 없이 깔끔하게 20 XP (Lv.1 브론즈)로 기본 설정
    localStorage.setItem("readycareer_student_xp_v1", "20");
    navigate("/");
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[qIndex];
  const progressPercent = Math.round(((qIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);

  // 진단 추천 및 16개 문항 진행 시 보여질 24개 실물 캐릭터 마스터 목록
  const recommendedHeroes = JOB_VENGERS_LIST;
  const currentQHero = JOB_VENGERS_LIST[qIndex % JOB_VENGERS_LIST.length] || JOB_VENGERS_LIST[0];

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#FAFAFC] text-[#111111] relative py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center selection:bg-[#111] selection:text-white font-sans">
      
      <div className="max-w-5xl w-full mx-auto relative z-10">

        {/* VIEW 1: 16문항 진단검사 (상단 문항&캐릭터 / 하단 2개 박스형 선택지) */}
        {currentView === "questions" && (
          <div className="space-y-8 animate-fadeIn flex flex-col items-center w-full">
            
            {/* 상단 진행률 바 - Klyro Bento Module */}
            <div className="w-full bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-2 text-[#111111]">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  3D 직업 아리 '직벤져스' AI 진로 흥미 밸런스 검사
                </span>
                <span className="bg-[#111111] text-emerald-400 px-3.5 py-1 rounded-full text-xs font-black">
                  Q.{qIndex + 1} / {DIAGNOSTIC_QUESTIONS.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#111111] transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            {/* 상단(Above): 문항과 마스코트 캐릭터 배치 - High Contrast Dark & White Bento */}
            <div className="w-full rounded-[32px] bg-white p-6 sm:p-10 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden group">
              
              {/* 캐릭터 & 아이콘 영역 */}
              <div className="flex-shrink-0 flex flex-col items-center text-center space-y-3 z-10">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[32px] bg-slate-50 p-4 border border-slate-200 flex items-center justify-center relative transform group-hover:scale-102 transition-all duration-300 shadow-xs">
                  <span className="text-4xl sm:text-5xl absolute -top-3 -right-3 bg-white p-2.5 rounded-2xl shadow-md border border-slate-100">
                    {currentQ.icon}
                  </span>
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={currentQHero?.imageUrl || getJobCharacterImage(currentQHero?.title, 1)} 
                      alt={currentQHero?.title || "Mascot"} 
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain filter drop-shadow-sm transition-transform duration-300 transform group-hover:scale-105" 
                    />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200/80 tracking-tight whitespace-normal break-keep text-center max-w-full">
                  ⚡ [{currentQHero?.title || "AI 멘토"}] {currentQ.category}
                </span>
              </div>

              {/* 질문 문항 말풍선 - Balanced Purple Pastel & Rich Violet */}
              <div className="flex-grow text-center sm:text-left space-y-4 w-full bg-gradient-to-r from-[#5E32EB] via-[#6F42F5] to-[#8C62FF] text-white p-8 sm:p-10 rounded-[28px] shadow-[0_15px_40px_rgba(94,50,235,0.25)] border border-[#A17CFF]/30 relative z-10">
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest bg-white/15 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-white/20 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  <span>QUESTION 0{currentQ.id}</span>
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug tracking-tight break-keep">
                  "{currentQ.prompt}"
                </h2>
              </div>
            </div>

            {/* 하단(Below): 2개 선택 박스 - Klyro Minimalist Bento Action Tiles */}
            <div className="w-full space-y-4 pt-2">
              {/* 아리 가이던스 말풍선 */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 my-4 w-full max-w-4xl mx-auto px-2">
                <div className="relative flex-shrink-0">
                  <img 
                    src={ARI_BLOB_URL} 
                    alt="Ari" 
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0" 
                  />
                </div>
                <div className="flex-grow bg-white px-6 py-4 rounded-[24px] rounded-tl-none border border-slate-200 shadow-xs text-[#111111] text-sm sm:text-base font-extrabold tracking-tight flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    <span>
                      <strong className="text-emerald-600 mr-1.5">아리의 귀띔:</strong> 
                      "👇 내 마음에 쏙 드는 선택지를 터치해줘!"
                    </span>
                  </span>
                  <span className="hidden sm:inline-flex bg-slate-100 text-slate-700 text-xs font-black px-3.5 py-1 rounded-full border border-slate-200">
                    선택 즉시 반영
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* 선택지 A (Positive / 긍정 반응) */}
                <div
                  onClick={handleAnswerQuestion}
                  className="group cursor-pointer p-8 rounded-[28px] bg-white border-2 border-slate-200 hover:border-[#6A42ED] hover:bg-[#F9F6FF] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-200">
                    💖
                  </span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1F193B] break-keep">
                    😍 완전 설레고 꼭 해볼래요!
                  </span>
                  <div className="inline-flex items-center text-xs font-black bg-purple-50 group-hover:bg-[#6A42ED] group-hover:text-white text-[#6A42ED] px-4 py-1.5 rounded-full transition-colors border border-purple-100">
                    <span>이 직무 성향 선택 &rarr;</span>
                  </div>
                </div>

                {/* 선택지 B (Alternative / 탐색 반응) */}
                <div
                  onClick={handleAnswerQuestion}
                  className="group cursor-pointer p-8 rounded-[28px] bg-white border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-200">
                    🔍
                  </span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-700 break-keep">
                    🤔 다른 멋진 분야도 궁금해요!
                  </span>
                  <div className="inline-flex items-center text-xs font-black bg-slate-100 group-hover:bg-slate-700 group-hover:text-white text-slate-600 px-4 py-1.5 rounded-full transition-colors">
                    <span>다른 가능성 탐험 &rarr;</span>
                  </div>
                </div>
              </div>

              {/* 이전 버튼 */}
              {qIndex > 0 && (
                <div className="text-center pt-4">
                  <button
                    onClick={handlePrevQuestion}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-500 hover:text-[#111111] px-4 py-2 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전 질문으로 다시 가기</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: 간략한 진단 피드백 네모박스 + 직업 추천 5개 */}
        {currentView === "recommendations" && (
          <div className="space-y-10 animate-fadeIn w-full">
            
            {/* 1) 아주 간단한 진단 검사 피드백 (클린 벤토 네모 박스) */}
            <div className="rounded-[32px] bg-white p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-50 p-3 flex-shrink-0 flex items-center justify-center border border-slate-200">
                <img src={ARI_BLOB_URL} alt="Ari Feedback" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-3 text-center sm:text-left flex-grow">
                <div className="inline-flex items-center gap-1.5 bg-[#111111] text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>진단 완료 · AI 아리의 10초 핵심 피드백</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight leading-tight">
                  🎯 분석 결과! 회원님은 <span className="underline decoration-emerald-500 decoration-4 underline-offset-4">창의 융합 개척</span> &amp; <span className="underline decoration-slate-900 decoration-4 underline-offset-4">최첨단 기술 비전</span>에 뛰어난 가능성을 품고 계십니다!
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  " 16개 문항 분석 끝에 도출된 회원님의 성격과 흥미는 미지의 AI 기술을 주도하고 세상을 무궁무진하게 변화시키는 <strong className="text-[#111]">이노베이터(Innovator)</strong> 유형입니다! 아래 준비된 총 24인의 RIASEC 직벤져스 캐릭터 중에서 나만의 꿈과 공명을 일으키는 최고의 진로 메이트를 선택해 보세요! "
                </p>
              </div>
            </div>

            {/* 2) 직업 추천하기 (직벤져스 캐릭터 24개 ➜ 클릭 시 소개페이지로) */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111]">
                  🚀 내 꿈의 여정을 함께할 추천 '직벤져스' 마스코트
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  원하는 직업 마스코트를 클릭하시면 즉시 <strong>Lv.1 ~ Lv.5 레벨업 순차 진화 팝업 스토리</strong>를 확인하실 수 있습니다!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-3">
                {recommendedHeroes.map((hero, index) => {
                  const matchRate = Math.max(75.0, (99.5 - index * 0.7)).toFixed(1);
                  return (
                    <div
                      key={hero.id}
                      onClick={() => handleSelectCharacter(hero)}
                      className="p-6 rounded-[28px] bg-white border border-slate-200 hover:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-between group relative"
                    >
                      <span className="absolute -top-3 right-4 bg-[#111111] text-emerald-400 font-black text-[11px] px-3 py-1 rounded-full shadow-md border border-slate-800">
                        싱크로율 {matchRate}%
                      </span>

                      <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-slate-500 pt-1">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">#{index + 1} 순위</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>

                      <div className="w-32 h-32 rounded-full bg-slate-50 p-3 border border-slate-100 flex items-center justify-center my-4 group-hover:scale-105 transition-transform duration-200">
                        <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-contain filter drop-shadow-xs" />
                      </div>

                      <div className="w-full text-center space-y-1.5 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-black text-slate-500 block w-fit mx-auto">
                          {hero.category}
                        </span>
                        <strong className="text-sm font-black text-[#111111] block leading-tight whitespace-normal break-keep">
                          {hero.title}
                        </strong>
                        <div className="pt-1 text-xs font-black text-slate-800 flex items-center justify-center gap-1 group-hover:text-emerald-600 transition-colors">
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

        {/* 팝업 모달: 직업 선택 시 나타나는 캐릭터 직업 소개 & Lv.1~Lv.5 진화 스토리 - Klyro Clean Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
            <div className="bg-white w-full max-w-5xl rounded-[36px] shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative p-6 sm:p-10 lg:p-12 space-y-8 text-left">
              
              {/* 우측 상단 닫기 X 버튼 */}
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all z-50 shadow-xs flex items-center justify-center cursor-pointer"
                title="닫기"
              >
                <span className="text-lg font-black block px-1">✕</span>
              </button>

              {/* 상단 선택 캐릭터 히어로 뱃지 헤더 - Balanced Purple & Violet Theme */}
              <div className="rounded-[32px] bg-gradient-to-r from-[#5328E0] via-[#6537EA] to-[#8054FC] text-white p-8 sm:p-10 border border-[#9A75FF]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 max-w-2xl text-center sm:text-left z-10">
                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-white/15 text-amber-300 border border-white/20 inline-block shadow-xs">
                    ✨ AI 맞춤 추천 랭크 캐릭터 · {selectedJob.category}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    <span className="text-amber-300">{selectedJob.title}</span> <br className="hidden sm:block"/>
                    5단계 진화 로드맵
                  </h2>
                </div>

                <div className="flex-shrink-0 z-10 flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[32px] bg-white p-4 shadow-2xl border border-purple-100 flex items-center justify-center">
                    <img src={selectedJob.imageUrl} alt={selectedJob.title} className="w-full h-full object-contain filter drop-shadow-md" />
                  </div>
                  <span className="mt-3 text-xs font-black bg-white text-[#5E32EB] px-4 py-1 rounded-full shadow-md">
                    💎 AI 싱크로율 최상위 메이트
                  </span>
                </div>
              </div>

              {/* Lv.1 ~ Lv.5 순차적 레벨업 진화 화면 - Clean White/Slate Modular Bento */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    🏅 5-STAGE CAREER EVOLUTION TREE
                  </span>
                  <span className="text-xs font-extrabold text-[#111] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Lv.1부터 Lv.5 마스터까지 역량 해금
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 relative items-stretch pt-1">
                  {[
                    { lv: "Lv.1", badge: "📖 지식 융합", name: "호기심 장착 아리" },
                    { lv: "Lv.2", badge: "⚡ 실전 챌린지", name: "프로젝트 리더" },
                    { lv: "Lv.3", badge: "🏆 생기부 마스터", name: "포트폴리오 왕" },
                    { lv: "Lv.4", badge: "🚀 차세대 엑스퍼트", name: "미래 엑스퍼트" },
                    { lv: "Lv.5", badge: "👑 마스터 아키텍트", name: "최상위 비전 아리" },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-[24px] bg-slate-50 p-5 border border-slate-200 hover:border-slate-800 transition-all duration-200 flex flex-col items-center justify-between space-y-4 group relative"
                    >
                      {idx < 4 && (
                        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-slate-300 shadow-xs items-center justify-center text-slate-600 font-black text-xs">
                          <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      <div className="w-full flex flex-col items-center space-y-2 pt-1">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-white text-[#111] border border-slate-200 shadow-xs">
                          {item.lv}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {item.badge}
                        </span>
                      </div>

                      <div className="w-24 h-24 rounded-full bg-white p-3 border border-slate-100 flex items-center justify-center my-2 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                        <img 
                          src={getJobCharacterImage(selectedJob.title, idx + 1)} 
                          alt={item.name} 
                          className="w-full h-full object-contain filter drop-shadow-xs" 
                        />
                      </div>

                      <div className="w-full text-center bg-white py-2 px-3 rounded-xl border border-slate-200/80 shadow-xs">
                        <strong className="text-xs sm:text-sm font-black text-[#111111] block whitespace-normal break-keep leading-tight">
                          {getJobCharacterTitle(selectedJob.title, idx + 1, item.name)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION START BUTTON & RESELECT BUTTON */}
              <div className="w-full max-w-2xl mx-auto flex flex-col items-center pt-4 space-y-4 border-t border-slate-100">
                <button
                  onClick={handleCompleteAndGoHome}
                  className="w-full py-5 px-8 bg-gradient-to-r from-[#5E32EB] to-[#8054FC] hover:brightness-105 text-white rounded-2xl font-black text-base sm:text-xl tracking-wide transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_12px_35px_rgba(94,50,235,0.35)] hover:shadow-[0_16px_45px_rgba(94,50,235,0.45)] cursor-pointer"
                >
                  <Award className="w-6 h-6 text-amber-300 fill-amber-300 flex-shrink-0" />
                  <span className="truncate">선택한 직업으로 ReadyCareer AI 시작하기</span>
                  <ArrowRight className="w-6 h-6 text-amber-300 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#111] transition-colors py-2 px-4 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>창을 닫고 매칭 화면의 다른 직업도 구경하기</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingTestFlow;

