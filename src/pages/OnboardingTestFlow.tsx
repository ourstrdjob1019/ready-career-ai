import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { JOB_VENGERS_LIST, JobVengerItem, ARI_BLOB_URL, ARI_BLOB_NEW_URL } from "../assets/mascotData";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Award, Star, TrendingUp } from "lucide-react";

interface DiagnosticQuestion {
  id: number;
  category: string;
  icon: string;
  title: string;
  prompt: string;
  bgGlow: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  { id: 1, category: "AI 인공지능 & 제어", icon: "🤖", title: "차세대 자율 로봇 및 신경망 코딩", prompt: "안녕! 아리야~ 첫 번째 질문이야! 너는 최첨단 AI 자율주행 알고리즘이나 인지 로봇을 프로그래밍하는 일에 매력을 느끼니?", bgGlow: "from-[#D8E6FF] via-[#EAE2FF] to-[#DDFBF5]" },
  { id: 2, category: "미디어·디지털 크리에이팅", icon: "🎨", title: "메타버스 & 3D AR/VR 크리에이터", prompt: "전 세계인이 환호할 메타버스 가상 세계 공간이나 차세대 가상 융합 미디어를 직접 디자인하고 이끌어가고 싶어?", bgGlow: "from-[#FEE2F4] via-[#F4E3FF] to-[#DBFAFF]" },
  { id: 3, category: "스마트 바이오 & 생명공학", icon: "🧬", title: "유전체 분석 및 차세대 AI 신약 연구", prompt: "인간의 생명을 구하는 혁신적 신약 물질이나 첨단 AI 의학 데이터를 분석하여 난치병 극복에 도전해보고 싶어?", bgGlow: "from-[#DCFEE8] via-[#E3FAFB] to-[#EEF5FF]" },
  { id: 4, category: "ESG & 클린 에너지 솔루션", icon: "🌿", title: "탄소중립 신재생 친환경 에너지", prompt: "지구를 위협하는 기후 문제를 해결할 클린 태양광 수소 에너지나 친환경 탄소 자원 순환 기술을 개발하고 싶어?", bgGlow: "from-[#E6FBEC] via-[#E1F7F9] to-[#E9EAFF]" },
  { id: 5, category: "우주항공 & 궤도 네비게이션", icon: "🛰️", title: "화성 탐사와 초고속 우주 위성 설계", prompt: "우주 저편을 향하는 초고속 항공 탐사 위성 궤도를 정밀 렌더링하고 우주 로켓 네비게이션 시스템을 제어해보고 싶어?", bgGlow: "from-[#E2EEFF] via-[#DBDBFF] to-[#F1E1FF]" },
  { id: 6, category: "첨단 보건 & 스마트 시티 의료", icon: "🏥", title: "원격 스마트 헬스케어 및 바이오 기기", prompt: "스마트 웨어러블 센서를 통해 시민들의 건강을 24시간 돌보는 첨단 의료 데이터 플랫폼을 설계하는 일에 흥미를 느껴?", bgGlow: "from-[#FFE5EA] via-[#FFECD4] to-[#E6F8FE]" },
  { id: 7, category: "양자 데이터 & 핀테크", icon: "📊", title: "양자 컴퓨팅 기반 미래 경제 트렌드", prompt: "상상을 초월하는 속도의 양자 컴퓨터와 빅데이터를 가공하여 미래 경제 시장의 금맥과 변화 흐름을 꿰뚫고 싶어?", bgGlow: "from-[#FFF5DB] via-[#FAEBFE] to-[#DDF7FB]" },
  { id: 8, category: "미래 스마트시티 아키텍처", icon: "🏙️", title: "IoT 사물인터넷 융합 친환경 도시공간", prompt: "하늘을 나는 도심 항공 모빌리티(UAM)와 인텔리전트 IoT 건물들이 공존하는 미래 친환경 초거대 도시를 설계하고 싶어?", bgGlow: "from-[#E3F2FF] via-[#EAE1FE] to-[#E4FCFA]" },
  { id: 9, category: "글로벌 게임 메가아키텍트", icon: "🎮", title: "수억 명이 진입할 초대형 게임 엔진", prompt: "한계가 없는 자유도를 자랑하는 글로벌 차기작 3D 차트오픈 게임의 세계관을 집필하고 물리학 엔진을 기획해보고 싶어?", bgGlow: "from-[#EADDFE] via-[#FFDAED] to-[#DBF8FF]" },
  { id: 10, category: "차세대 첨단 신소재 공학", icon: "⚗️", title: "초전도 배터리와 극고열 신소재 개발", prompt: "우주선 본체와 미래형 전기차의 뼈대가 될 경량 고부하 신소재 물질이나 영구 초전도 체계를 실험해보고 싶어?", bgGlow: "from-[#FFF1DD] via-[#FFDFE4] to-[#ECE5FF]" },
  { id: 11, category: "사이버 보안 & 화이트해커", icon: "🛡️", title: "국가 및 인공지능 네트워크 방어 작전", prompt: "악질적인 사이버 해킹으로부터 전 세계 데이터망을 보호하고 AI 암호 방어벽을 설계하는 최강의 화이트해커가 매력적이야?", bgGlow: "from-[#DEE9FF] via-[#EAEEF6] to-[#E2FAF4]" },
  { id: 12, category: "에듀테크 & 지식 혁신", icon: "📚", title: "AI 어시스턴트 기반 차세대 미래 교육", prompt: "배움에 목마른 전 세계 청소년들에게 나만의 혁신적인 AI 학습 플랫폼과 에듀테크 기술을 통해 따뜻한 희망을 전하고 싶어?", bgGlow: "from-[#FAEAFF] via-[#FFE2E7] to-[#E2FBF6]" },
  { id: 13, category: "뉴럴 네트워크 & 뇌 심리 연구", icon: "🧠", title: "인간의 감성과 뇌 기계 인터페이스(BMI)", prompt: "인간 뇌의 호르몬 시그널과 마음을 정밀히 이해하여, 생각만으로 통신하고 공감하는 감성 AI 인터페이스를 만들고 싶어?", bgGlow: "from-[#E9E4FF] via-[#FFDEF5] to-[#DDFDFF]" },
  { id: 14, category: "첨단 해양 자원 융합 탐색", icon: "🌊", title: "심해 생태계 보존 및 로보틱 해양 개발", prompt: "신비로운 깊은 대양 밑 심해 생태계를 보존하면서, 무한한 친환경 수자원을 발구하는 자율 해양 잠수함 탐사선에 끌리니?", bgGlow: "from-[#DBFAFE] via-[#D8ECFF] to-[#ECE3FF]" },
  { id: 15, category: "글로벌 테크 윤리 정책", icon: "🤝", title: "인류와 첨단 기술의 공생 법적 거버넌스", prompt: "급변하는 AI와 신기술 속에서 인간성 상실을 예방하고 전 세계인이 공생할 수 있는 공정과 도덕적인 글로벌 법령을 만들고 싶어?", bgGlow: "from-[#F3E5F5] via-[#FFF1DA] to-[#DDFBF5]" },
  { id: 16, category: "초광역 양자 우주 통신", icon: "📡", title: "행성 간 광역 레이저 양자 데이터망", prompt: "드디어 마지막! 지구와 달, 나아가 은하의 위성 기지 간에 단 0.001초의 끊김도 없이 통신하는 양자 무선 레이저망을 가공해볼래?", bgGlow: "from-[#E8E2FE] via-[#F4D9FF] to-[#D5FAFF]" },
];

export const OnboardingTestFlow: React.FC = () => {
  const navigate = useNavigate();
  const { session, startExpoDemo } = useAuth();

  // 화면 뷰 상태: 'questions' -> 'recommendations' -> 'character_intro'
  const [currentView, setCurrentView] = useState<"questions" | "recommendations" | "character_intro">("questions");
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<JobVengerItem | null>(null);

  // 16문항 답변 시 진행
  const handleAnswerQuestion = () => {
    if (qIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // 16개 다 푼 경우 추천 화면으로 이동
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
          riasecCode: "AI-EXPRESS",
        });
      }
    }
    navigate("/");
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[qIndex];
  const progressPercent = Math.round(((qIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);

  // 진단 추천으로 등장할 핵심 직벤져스 캐릭터 5종
  const recommendedHeroes = JOB_VENGERS_LIST.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#FAF7FF] via-[#F3F0FF] to-[#F8F5FF] text-[#1A1626] relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* 3D Glass Ambient Background Halo */}
      <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#DEC2FF]/40 to-[#BFF5FF]/40 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] bg-gradient-to-tl from-[#FFD4E5]/40 to-[#CFF3FF]/40 rounded-full blur-[110px] pointer-events-none -z-0" />

      <div className="max-w-5xl w-full mx-auto relative z-10">

        {/* VIEW 1: 16문항 AI 아리 대화형 진단 모듈 */}
        {currentView === "questions" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Progress Header */}
            <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-white shadow-[0_12px_32px_rgba(123,92,240,0.08)] space-y-3">
              <div className="flex items-center justify-between font-headline font-bold text-xs sm:text-sm text-[#5C5672]">
                <span className="flex items-center gap-2 text-[#7B5CF0] font-black">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  AI 아리와 함께하는 16단계 직벤져스 흥미 진단
                </span>
                <span className="bg-[#7B5CF0]/10 text-[#7B5CF0] font-black px-3 py-1 rounded-full">
                  문항 {qIndex + 1} / {DIAGNOSTIC_QUESTIONS.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#EAE5FA] overflow-hidden shadow-inner p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#7B5CF0] via-[#FF4081] to-[#008A90] transition-all duration-300 shadow-sm" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            {/* Main Interactive Question Stage */}
            <div className={`rounded-[40px] bg-gradient-to-tr ${currentQ.bgGlow} p-8 sm:p-12 border-4 border-white shadow-[0_25px_60px_rgba(123,92,240,0.15)] flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden backdrop-blur-2xl transition-all duration-500`}>
              
              {/* Left Side: 3D Mascot Ari Speaking & Topic Illustration Box */}
              <div className="flex-shrink-0 flex flex-col items-center space-y-4 md:w-80">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[36px] bg-white/95 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border-2 border-white flex flex-col items-center justify-center text-center relative group transform hover:scale-105 transition-all duration-300">
                  <span className="text-4xl absolute -top-4 -right-2 bg-white p-2 rounded-2xl shadow-md border border-purple-100 animate-bounce">
                    {currentQ.icon}
                  </span>
                  <img 
                    src={qIndex % 2 === 0 ? ARI_BLOB_URL : ARI_BLOB_NEW_URL} 
                    alt="Ari Mascot" 
                    className="w-40 h-40 object-contain filter drop-shadow-md group-hover:rotate-3 transition-transform" 
                  />
                  <span className="text-[11px] font-extrabold text-[#7B5CF0] bg-purple-50 px-3 py-1 rounded-full border border-purple-100 mt-1">
                    AI 진로 멘토 '아리'
                  </span>
                </div>
                <div className="text-center bg-white/90 px-4 py-2 rounded-2xl shadow-sm border border-white">
                  <span className="text-xs font-black text-[#5C5672]">
                    📌 분야: {currentQ.category}
                  </span>
                </div>
              </div>

              {/* Right Side: Question Text & 3D Glass Likert Options */}
              <div className="flex-grow space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-[#7B5CF0] uppercase tracking-wider block">
                    QUESTION #{currentQ.id}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1A1626] leading-snug">
                    "{currentQ.prompt}"
                  </h2>
                </div>

                <div className="space-y-3 pt-4">
                  {[
                    { text: "⭐⭐⭐⭐⭐ 매우 흥미롭고 꼭 해보고 싶어!", score: 5, bg: "hover:bg-[#7B5CF0] hover:text-white border-[#D0C2FF] text-[#422CA2]" },
                    { text: "⭐⭐⭐⭐ 제법 관심이 가고 설레요!", score: 4, bg: "hover:bg-[#8B70FF] hover:text-white border-[#E0D5FF] text-[#5442A2]" },
                    { text: "⭐⭐⭐ 보통이야, 경험해보고 파!", score: 3, bg: "hover:bg-[#78B4F8] hover:text-white border-[#CDE1FB] text-[#29609E]" },
                    { text: "⭐⭐ 그저 그래, 다른 분야가 좋아", score: 2, bg: "hover:bg-[#5EBEAA] hover:text-white border-[#BCEFED] text-[#1E7465]" },
                    { text: "⭐ 별로 관심이 가지 않아", score: 1, bg: "hover:bg-gray-500 hover:text-white border-gray-300 text-gray-600" },
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={handleAnswerQuestion}
                      className={`w-full py-4 px-6 rounded-[22px] bg-white/90 backdrop-blur-md font-bold text-sm sm:text-base border-2 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-between group ${option.bg}`}
                    >
                      <span className="font-extrabold text-left">{option.text}</span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                {qIndex > 0 && (
                  <button
                    onClick={handlePrevQuestion}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6E6A80] hover:text-[#7B5CF0] pt-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전 질문으로 돌아가기</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: 아주 간단한 진단 피드백 박스 + 직벤져스 캐릭터 4~5개 추천 */}
        {currentView === "recommendations" && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* 1) 아주 간단한 진단 검사 피드백 (네모 박스) */}
            <div className="rounded-[36px] bg-white/90 backdrop-blur-2xl p-8 sm:p-12 border-2 border-[#D7BFFF] shadow-[0_20px_50px_rgba(123,92,240,0.14)] relative overflow-hidden flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#F4E3FF] to-[#D5F9FF] p-2 flex-shrink-0 flex items-center justify-center border-4 border-white shadow-lg">
                <img src={ARI_BLOB_URL} alt="Ari Feedback" className="w-full h-full object-contain animate-bounce-short" />
              </div>
              <div className="space-y-3 text-center sm:text-left flex-grow">
                <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-[#7B5CF0]" />
                  <span>진단 검사 피드백 및 인공지능 분석 요약</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A1626]">
                  🎯 분석 완료! 회원님의 강점은 <span className="text-[#7B5CF0]">창의 융합 개척</span> &amp; <span className="text-[#008A90]">최첨단 AI 기술</span> 분야입니다.
                </h2>
                <p className="text-sm sm:text-base text-[#524D64] font-semibold leading-relaxed bg-[#FAF7FF] p-4 rounded-2xl border border-purple-100 shadow-inner">
                  " 16개 문항을 종합 분석한 결과, 새로운 미래 기술을 창조하고 문제 해답을 스스로 찾아내는 <strong>창의적 혁신 역량(Creative Innovator)</strong>이 98%로 매우 탁월합니다! 아래 추천해 드리는 5명의 직벤져스 캐릭터 중 내가 가장 가슴 뛰는 마스코트를 선택해 보세요! "
                </p>
              </div>
            </div>

            {/* 2) 직업 추천하기 (직벤져스 캐릭터 5개 출력 ➜ 클릭 시 소개페이지로) */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1A1626] flex items-center justify-center gap-2">
                  <span>🚀 나만의 꿈을 실현할 5대 추천 '직벤져스'</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A80] font-bold">
                  원하는 캐릭터 카드를 클릭하시면 <strong>레벨 0에서 레벨 5까지의 맞춤 성장 스토리</strong> 소개 화면으로 진입합니다!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
                {recommendedHeroes.map((hero, index) => {
                  const matchRates = [99.2, 97.5, 95.8, 93.4, 91.0];
                  return (
                    <div
                      key={hero.id}
                      onClick={() => handleSelectCharacter(hero)}
                      className={`p-6 rounded-[34px] bg-gradient-to-b ${hero.bgGradient} hover:bg-white border-4 border-white shadow-[0_15px_35px_rgba(123,92,240,0.12)] hover:shadow-[0_25px_55px_rgba(123,92,240,0.3)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-between group transform hover:-translate-y-3 backdrop-blur-lg relative`}
                    >
                      <span className="absolute -top-3 -right-2 bg-gradient-to-r from-[#FF4081] to-[#FF2E74] text-white font-black text-[11px] px-3 py-1 rounded-full shadow-md animate-pulse">
                        싱크로율 {matchRates[index]}%
                      </span>

                      <div className="w-full flex items-center justify-between text-[11px] font-extrabold text-[#5B556D] pt-1">
                        <span className="bg-white/90 px-2.5 py-0.5 rounded-full shadow-sm">#{index + 1} 추천</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>

                      <div className="w-36 h-36 rounded-full bg-white/90 p-3 shadow-inner border-2 border-white flex items-center justify-center my-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-contain drop-shadow-md" />
                      </div>

                      <div className="w-full text-center space-y-2 bg-white/95 backdrop-blur-sm p-3 rounded-[24px] border border-white shadow-sm">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${hero.badgeColor} block w-fit mx-auto`}>
                          {hero.category}
                        </span>
                        <strong className="text-sm font-extrabold text-[#1A1626] block leading-tight group-hover:text-[#7B5CF0] transition-colors">
                          {hero.title}
                        </strong>
                        <div className="pt-2 text-xs font-black text-[#7B5CF0] flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform border-t border-purple-50">
                          <span>캐릭터 소개 보기</span>
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

        {/* VIEW 3: 캐릭터 소개 페이지 (Lv.0 ~ Lv.5 동기부여 로드맵 + 시작 버튼 + 직업 다시 선택하기) */}
        {currentView === "character_intro" && selectedJob && (
          <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
            
            {/* Character Profile Banner */}
            <div className={`rounded-[42px] bg-gradient-to-r ${selectedJob.bgGradient} p-8 sm:p-12 border-4 border-white shadow-[0_25px_60px_rgba(123,92,240,0.18)] flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden backdrop-blur-2xl`}>
              <div className="space-y-4 max-w-2xl text-center sm:text-left z-10">
                <span className={`text-xs font-black px-4 py-1.5 rounded-full ${selectedJob.badgeColor} border border-purple-200 shadow-sm inline-block`}>
                  ✨ 최종 선택 맞춤 캐릭터 소개 · {selectedJob.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-[#1A1626] tracking-tight leading-tight">
                  <span className="text-[#7B5CF0]">{selectedJob.title}</span> 와 함께 <br />
                  미래의 마스터로 뻗어나가요!
                </h1>
                <p className="text-sm sm:text-base text-[#4C475D] font-bold leading-relaxed bg-white/80 p-4 rounded-3xl border border-white shadow-sm">
                  " 환영해요! 이 캐릭터를 마중물로 삼으면 <strong>레벨 0 새싹 단계</strong>부터 고경력 프로젝트를 완수하는 <strong>레벨 5 마스터 아키텍트</strong>까지 AI 아리가 맞춤형 포트폴리오를 자동으로 추천하고 진로 생기부를 가꿔드립니다. "
                </p>
              </div>

              <div className="flex-shrink-0 z-10 flex flex-col items-center">
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-white/90 p-4 shadow-2xl border-4 border-white flex items-center justify-center transform transition-transform hover:scale-105">
                  <img src={selectedJob.imageUrl} alt={selectedJob.title} className="w-full h-full object-contain filter drop-shadow-xl animate-float" />
                </div>
                <span className="mt-3 text-xs font-black bg-[#7B5CF0] text-white px-5 py-2 rounded-full shadow-lg">
                  💎 내 고유 직진 캐릭터 장착!
                </span>
              </div>
            </div>

            {/* Lv.0 to Lv.5 Motivation Timeline Grid */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-extrabold text-[#008A90] bg-[#008A90]/10 px-4 py-1 rounded-full uppercase border border-[#008A90]/20">
                  🌱 Lv.0 새싹부터 👑 Lv.5 마스터까지 성장 스토리
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1A1626]">
                  앞으로 이런 흥분되는 성장 스텝을 경험하게 됩니다!
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {[
                  { lv: "Lv.0", title: "새싹 진로 탐구어", desc: "아리의 안내에 따라 직업 호기심을 키우고 꿈의 나아갈 방향을 세우는 감동의 출발선!", color: "from-[#F3E8FF] to-[#E5D7FF]", badge: "bg-[#7B5CF0] text-white", icon: "🌱" },
                  { lv: "Lv.1", title: "핵심 기초 지식 장착", desc: "고과목 학점제 연계 권장 단원과 인공지능 기초 역량을 알기 쉽게 습득하는 지식 개화기!", color: "from-[#E3FAFF] to-[#C1F1F8]", badge: "bg-[#008A90] text-white", icon: "📖" },
                  { lv: "Lv.2", title: "실전 프로젝트 도전", desc: "교과와 연계된 융합 탐구 리드 활동을 수행하며 실제 문제 해결 포트폴리오 첫 적립!", color: "from-[#FFEBF2] to-[#FFD1E3]", badge: "bg-[#FF4081] text-white", icon: "⚡" },
                  { lv: "Lv.3", title: "NEIS 생기부 빌딩", desc: "2026 기재 요령 100% 규약에 맞춰 나만의 독창적인 세특 및 창체 멘트가 완성되는 황금기!", color: "from-[#FFF8E7] to-[#FFECD0]", badge: "bg-[#D97706] text-white", icon: "🏆" },
                  { lv: "Lv.4", title: "융합 크리에이터 도약", desc: "심사관과 입학관의 시선을 단숨에 사로잡을 초격차 커리어 별자리 로드맵 완성 단계!", color: "from-[#E6F0FF] to-[#C7DBFF]", badge: "bg-[#3B82F6] text-white", icon: "🚀" },
                  { lv: "Lv.5", title: "마스터 아키텍트 👑", desc: "준비된 진로 탐험가에서 압도적인 전문성과 꿈을 현실로 실현한 대망의 최상위 도달점!", color: "from-[#EBFFF8] to-[#BAFFE9]", badge: "bg-[#059669] text-white", icon: "👑" },
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`p-7 rounded-[32px] bg-gradient-to-br ${step.color} border-2 border-white shadow-[0_12px_30px_rgba(123,92,240,0.1)] flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-sm ${step.badge}`}>
                        {step.lv}
                      </span>
                      <span className="text-3xl bg-white/90 p-2 rounded-2xl shadow-sm">{step.icon}</span>
                    </div>
                    <div>
                      <strong className="text-lg font-black text-[#1A1626] block">
                        {step.title}
                      </strong>
                      <p className="text-xs sm:text-sm text-[#4C475D] font-semibold mt-2 leading-relaxed bg-white/85 p-3.5 rounded-2xl border border-white shadow-inner">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON & RESELECT LINK */}
            <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-8 space-y-5">
              {/* 3D Tactile Start Button */}
              <div className="w-full p-2 rounded-[36px] bg-gradient-to-r from-[#D7CEFF] via-[#FFC0D9] to-[#BAF7FF] shadow-[0_0_50px_rgba(123,92,240,0.35)] hover:shadow-[0_0_70px_rgba(255,64,129,0.55)] transition-all">
                <button
                  onClick={handleCompleteAndGoHome}
                  className="w-full py-5 px-6 bg-gradient-to-r from-[#7B5CF0] via-[#8B61FF] to-[#008A90] hover:from-[#886BF0] hover:to-[#109B9F] text-white rounded-[28px] font-black text-xl sm:text-2xl tracking-wide border-2 border-white/80 border-b-[8px] sm:border-b-[10px] border-b-[#4722AD] active:border-b-[2px] active:translate-y-2 transition-all flex items-center justify-center gap-3 shadow-2xl cursor-pointer whitespace-nowrap"
                >
                  <Award className="w-7 h-7 text-white fill-white animate-bounce-short" />
                  <span>선택한 직업으로 ReadyCareer AI 시작하기</span>
                  <ArrowRight className="w-7 h-7 text-white" />
                </button>
              </div>

              {/* [ 직업 다시 선택하기 ] Underlined Link */}
              <button
                onClick={() => setCurrentView("recommendations")}
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#6E6A80] hover:text-[#7B5CF0] transition-colors py-2"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
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
