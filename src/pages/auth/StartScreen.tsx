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
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-4 w-full">
        {/* 메인 캐릭터 (크게 배치) */}
        <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center mb-8 drop-shadow-2xl">
           <img 
             src="/landing_character.png" 
             alt="랜딩페이지 캐릭터" 
             className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-out" 
           />
        </div>
        
        {/* 심플한 안내 문구 */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight break-keep">
          나만의 커리어 별자리 만들기
        </h1>
        <p className="text-base md:text-lg text-slate-600 mb-10 max-w-lg break-keep font-medium">
          AI 파트너 아리와 나의 흥미와 재능을 살펴보고, 나에게 맞는 커리어 별자리를 만들어보세요.
        </p>

        {/* 시작하기 버튼 */}
        <button 
          onClick={() => setShowRoleModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl px-14 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
        >
          시작하기
        </button>
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

