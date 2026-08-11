import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useSelfUnderstanding } from "../../context";

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startExpoDemo } = useAuth();
  const { resetAssessments } = useSelfUnderstanding();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleStartStudent = () => {
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
    localStorage.removeItem("readycareer_roadmap_generated");
    resetAssessments();

    startExpoDemo("student", {
      name: "신규 꿈 탐험가",
      school: "차세대 진로 인벤터",
      grade: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "미진단",
    });
    
    navigate("/onboarding-test");
  };

  const handleStartTeacher = () => {
    startExpoDemo("teacher", {
      name: "진학지도교사",
      school: "서울창의고등학교",
      grade: 2,
      role: "teacher",
    });
    navigate("/teacher");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white rounded-b-[40%] shadow-sm pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-4 w-full pt-8 sm:pt-12">
        {/* 복구된 타이틀 스타일 및 레이아웃 (텍스트를 이미지 위로 올림) */}
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mb-6 sm:mb-8 z-20">
          {/* Main Giant Hero Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#31147A] via-[#5E32EB] to-[#8A63FF] leading-none drop-shadow-xs py-2">
            ReadyCareerAI
          </h1>

          {/* Subtitle with Sleek Purple & Violet Contrast Badge on '꿈' */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#43219C] tracking-tight flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
            <span>나의</span>
            <span className="inline-flex items-center justify-center px-5 sm:px-8 py-1 sm:py-1.5 mx-1 rounded-[24px] bg-gradient-to-r from-[#5E32EB] to-[#8A63FF] text-amber-300 font-black text-2xl sm:text-4xl md:text-5xl shadow-[0_6px_20px_rgba(94,50,235,0.35)] border border-[#A582FF]/50 transform -rotate-2 hover:rotate-0 transition-transform duration-200">
              <span>꿈</span>
            </span>
            <span>설계하기</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#5D429B] font-semibold max-w-2xl mx-auto pt-2 sm:pt-4 leading-relaxed break-keep">
            나만의 고유한 흥미와 재능을 AI 파트너 아리와 함께 분석하고, <br className="hidden sm:block" />
            밤하늘 커리어 별자리 로드맵을 향한 맞춤 여정을 지금 즉시 경험해보세요.
          </p>
        </div>

        {/* 시작하기 버튼 (캐릭터 위로 이동) */}
        <div className="z-20 mb-8">
          <button 
            onClick={() => setShowRoleModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl px-14 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            시작하기
          </button>
        </div>

        {/* 메인 캐릭터 (텍스트 아래로) */}
        <div className="relative w-full max-w-[500px] sm:max-w-[650px] aspect-square flex items-center justify-center mb-8 drop-shadow-2xl z-10">
           <img 
             src="/landing_character.png" 
             alt="랜딩페이지 캐릭터" 
             className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-out" 
           />
        </div>
      </div>

      {/* 역할 선택 팝업 모달 */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative">
              <button 
                onClick={() => setShowRoleModal(false)}
                className="absolute top-4 right-5 text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-black text-center text-slate-900 mb-8 mt-2">
                어떤 모드로 시작할까요?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 학생용 버튼 */}
                <button 
                  onClick={handleStartStudent}
                  className="flex flex-col items-center p-6 bg-indigo-50 hover:bg-indigo-600 text-indigo-900 hover:text-white rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md border border-indigo-100"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎓</span>
                  <span className="font-bold text-lg">학생용</span>
                  <span className="text-xs mt-2 opacity-70">진로 탐색 및 생기부 작성</span>
                </button>

                {/* 교사용 버튼 */}
                <button 
                  onClick={handleStartTeacher}
                  className="flex flex-col items-center p-6 bg-slate-50 hover:bg-slate-700 text-slate-700 hover:text-white rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md border border-slate-200"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏫</span>
                  <span className="font-bold text-lg">교사용</span>
                  <span className="text-xs mt-2 opacity-70">학생 관리 및 리포트 관제</span>
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StartScreen;

