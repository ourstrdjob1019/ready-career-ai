import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useSelfUnderstanding } from "../../context";
import { JOB_VENGERS_LIST } from "../../assets/mascotData";
import { Play } from "lucide-react";

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startExpoDemo } = useAuth();
  const { resetAssessments } = useSelfUnderstanding();

  // 파스텔 3D 게임버튼 '클릭하여 시작하기' 핸들러 (신규 온보딩 진단검사 모듈로 직행)
  const handleStartExperience = () => {
    localStorage.setItem("is_new_student_clean_state", "true");
    localStorage.removeItem("readycareer_assessment_state");
    localStorage.removeItem("readycareer_assessments_real_v1");
    localStorage.removeItem("readycareer_self_report_real_v1");
    localStorage.removeItem("readycareer_student_activities_v1");
    localStorage.removeItem("readycareer_vision_v1");
    localStorage.removeItem("readycareer_selected_job");
    localStorage.removeItem("readycareer_ai_custom_generated");
    localStorage.removeItem("my_star_roadmap");
    localStorage.removeItem("my_habits_v2");
    localStorage.removeItem("my_interested_jobs");
    localStorage.removeItem("readycareer_student_name");
    localStorage.removeItem("readycareer_student_school");
    localStorage.removeItem("readycareer_student_school_code");
    localStorage.removeItem("readycareer_student_grade");
    localStorage.removeItem("readycareer_student_cluster");
    localStorage.removeItem("riasec_result_code");
    localStorage.removeItem("riasec_primary");
    resetAssessments();

    // 초기 0단계 상태로 AI 진단 세션 개설
    startExpoDemo("student", {
      name: "신규 꿈 탐험가",
      school: "차세대 진로 인벤터",
      grade: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "미진단",
    });
    
    // 신규 맞춤형 16문항 아리 인터렉션 온보딩 진단 모듈로 즉시 이동
    navigate("/onboarding-test");
  };

  return (
    <div className="min-h-screen bg-[#FAF6FF] text-[#1A1626] relative overflow-x-hidden selection:bg-[#9E83FF]/20 selection:text-[#7B5CF0] flex flex-col justify-between">
      {/* 3D Infinite Marquee Keyframe Styles */}
      <style>{`
        @keyframes jobvengerMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-jobvenger-marquee {
          display: flex;
          width: max-content;
          animation: jobvengerMarquee 38s linear infinite;
        }
        .animate-jobvenger-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient Pastel Glassmorphism Halo Spheres */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#E6DEFF]/70 via-[#FEE2FA]/60 to-[#CFFBFF]/60 rounded-full blur-[110px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-[#FFEBF2]/70 via-[#DCEBFF]/60 to-[#E8D4FF]/50 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* 🔮 3D 직업 캐릭터 부유 배경 레이어 (투명하고 몽환적으로 떠다니는 배경 캐릭터들) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { pos: "top-[4%] left-[3%]", size: "w-32 h-32 md:w-48 md:h-48", idx: 0, delay: "0s", transform: "rotate-[-12deg]" },
          { pos: "top-[8%] right-[5%]", size: "w-36 h-36 md:w-52 md:h-52", idx: 1, delay: "1s", transform: "rotate-[15deg]" },
          { pos: "top-[32%] left-[2%]", size: "w-36 h-36 md:w-52 md:h-52", idx: 2, delay: "2s", transform: "rotate-[8deg]" },
          { pos: "top-[35%] right-[3%]", size: "w-36 h-36 md:w-48 md:h-48", idx: 3, delay: "1.5s", transform: "rotate-[-10deg]" },
          { pos: "top-[64%] left-[5%]", size: "w-36 h-36 md:w-52 md:h-52", idx: 4, delay: "0.5s", transform: "rotate-[18deg]" },
          { pos: "top-[67%] right-[5%]", size: "w-40 h-40 md:w-56 md:h-56", idx: 5, delay: "2.5s", transform: "rotate-[-15deg]" },
          { pos: "bottom-[5%] left-[12%]", size: "w-32 h-32 md:w-44 md:h-44", idx: 6, delay: "1.2s", transform: "rotate-[10deg]" },
          { pos: "bottom-[6%] right-[12%]", size: "w-36 h-36 md:w-48 md:h-48", idx: 7, delay: "0.8s", transform: "rotate-[-8deg]" },
        ].map((item, i) => {
          const character = JOB_VENGERS_LIST[item.idx % JOB_VENGERS_LIST.length];
          return (
            <div
              key={i}
              className={`absolute ${item.pos} ${item.size} opacity-[0.22] sm:opacity-[0.28] filter drop-shadow-lg transition-all duration-700 animate-float`}
              style={{ transform: item.transform, animationDelay: item.delay }}
            >
              <img
                src={character.imageUrl}
                alt={character.title}
                className="w-full h-full object-contain pointer-events-auto cursor-pointer hover:scale-115 hover:opacity-95 transition-all duration-300"
                onClick={handleStartExperience}
                title={`${character.title}와 함께 바로 진로 탐험 퀘스트 시작하기!`}
              />
            </div>
          );
        })}
      </div>

      {/* Main Landing Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10 flex flex-col items-center justify-center flex-grow w-full space-y-12">
        
        {/* Hero Main Titles */}
        <div className="text-center space-y-5 max-w-5xl">
          {/* Main Giant Hero Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1A1626] drop-shadow-[0_12px_32px_rgba(123,92,240,0.18)] selection:bg-[#FF4081] selection:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B5CF0] via-[#8E5BF2] to-[#00A3A8]">
              ReadyCareerAI
            </span>
          </h1>

          {/* Subtitle with Highlighting on '꿈' */}
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-[#3D3554] tracking-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <span>나의</span>
            <span className="relative inline-flex items-center justify-center px-5 sm:px-7 py-1 sm:py-2 mx-1 rounded-[26px] bg-gradient-to-r from-[#FF4081] via-[#FF5895] to-[#FF2A72] text-white font-black text-3xl sm:text-5xl md:text-6xl shadow-[0_12px_35px_rgba(255,64,129,0.5)] transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 animate-pulse">
              <span>꿈</span>
              <span className="absolute -top-3 -right-2 text-xl sm:text-2xl animate-bounce">✨</span>
            </span>
            <span>! 설계하기</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#6E6A80] font-semibold max-w-2xl mx-auto pt-3 leading-relaxed">
            나만의 고유한 흥미와 재능을 AI 파트너 아리와 함께 분석하고, <br className="hidden sm:block" />
            밤하늘 커리어 별자리 로드맵을 향한 여정을 지금 즉시 시작하세요!
          </p>
        </div>

        {/* JOB-VENGERS Infinite Horizontal Marquee Section */}
        <div className="w-full my-8 relative py-4">
          {/* Faded Gradient Mask for Left/Right Edges */}
          <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-[#FAF6FF] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-[#FAF6FF] to-transparent z-10 pointer-events-none" />

          {/* Infinite Rolling Track */}
          <div className="overflow-hidden py-4">
            <div className="animate-jobvenger-marquee gap-6 px-3">
              {[...JOB_VENGERS_LIST, ...JOB_VENGERS_LIST].map((item, index) => (
                <div
                  key={index}
                  className={`w-56 sm:w-64 h-72 rounded-[34px] bg-gradient-to-b ${item.bgGradient} p-5 border-2 border-white shadow-[0_16px_36px_rgba(123,92,240,0.12)] hover:shadow-[0_24px_48px_rgba(123,92,240,0.28)] transition-all duration-300 flex flex-col items-center justify-between group transform hover:-translate-y-2.5 cursor-pointer relative backdrop-blur-md`}
                  onClick={handleStartExperience}
                  title={`${item.title}와 함께 온보딩 바로 개설하기!`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-white/90 shadow-sm text-[#3E3852]">
                      #{item.id} 직벤져스
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  </div>

                  {/* Character Avatar */}
                  <div className="w-32 h-32 rounded-full bg-white/85 p-2.5 shadow-inner border-2 border-white flex items-center justify-center my-1 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  {/* Role Title & Category */}
                  <div className="w-full text-center space-y-1.5 bg-white/95 backdrop-blur-md py-2.5 px-3 rounded-2xl border border-white shadow-sm">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${item.badgeColor} block w-fit mx-auto`}>
                      {item.category}
                    </span>
                    <strong className="text-sm font-extrabold text-[#1A1626] block tracking-tight group-hover:text-[#7B5CF0] transition-colors truncate">
                      {item.title}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PASTEL TACTILE 3D GLASS GAME START BUTTON (글자가 절대 줄바꿈이나 밑으로 안 떨어지도록 단면 보장) */}
        <div className="w-full max-w-lg mx-auto px-4 flex flex-col items-center z-20 pt-4">
          <div className="w-full p-2 rounded-[36px] bg-gradient-to-r from-[#D7CEFF] via-[#FFC0D9] to-[#BAF7FF] shadow-[0_0_50px_rgba(158,131,255,0.45)] hover:shadow-[0_0_70px_rgba(255,107,171,0.65)] transition-all duration-500 backdrop-blur-xl border border-white/60">
            <button
              onClick={handleStartExperience}
              className="w-full py-5 sm:py-6 px-6 sm:px-10 bg-gradient-to-r from-[#8C74FF] via-[#9F72FF] to-[#6754E8] hover:from-[#9D87FF] hover:to-[#7863FA] text-white rounded-[28px] font-black text-xl sm:text-2xl md:text-3xl tracking-wide border-2 border-white/85 border-b-[8px] sm:border-b-[10px] border-b-[#4A32AA] active:border-b-[2px] active:translate-y-2 transition-all duration-150 flex flex-nowrap items-center justify-center gap-3 sm:gap-4 shadow-2xl cursor-pointer group whitespace-nowrap"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md flex-shrink-0">
                🕹️
              </span>
              <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] font-headline font-black tracking-tight whitespace-nowrap flex-shrink-0">
                클릭하여 시작하기
              </span>
              <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-white text-white drop-shadow-md group-hover:translate-x-1.5 transition-transform flex-shrink-0" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;
