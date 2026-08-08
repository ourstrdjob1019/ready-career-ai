import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header, BottomNav, AriChatModal, GlobalExpRewardModal } from "./components";
import { ARI_BLOB_URL } from "./assets/mascotData";
import {
  HomeDashboard,
  OnboardingCode,
  OnboardingInfo,
  InterestTest,
  TestResult,
  StarRoadmap,
  HabitManagement,
  ActivityForm,
  Portfolio,
  TeacherGuide,
  Login,
  SignUp,
  ForgotPassword,
  StartScreen,
  SuperAdminConsole,
  SelfUnderstanding,
  SelfReport,
  IntelligenceTest,
  LearningStyleTest,
  MyPage,
  OnboardingTestFlow,
  MultipleIntelligencesTest,
  GrowthMindsetTest,
  ViaStrengthsTest,
  TimeManagementTest,
  AiLiteracyTest,
  ResilienceTest,
  CareerMaturityTest,
} from "./pages";
import { AuthProvider, SelfUnderstandingProvider, useAuth } from "./context";
import "./App.css";

const PrivateRoute: React.FC<{ children: React.ReactElement; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/start" state={{ from: location }} replace />;
  }

  const role = session?.role as string | undefined;
  const state = location.state as { forceStudent?: boolean } | undefined;

  if (role === "super_admin" && location.pathname === "/" && !state?.forceStudent) {
    return <Navigate to="/super-admin" replace />;
  }
  if (role === "teacher" && location.pathname === "/" && !state?.forceStudent) {
    return <Navigate to="/teacher" replace />;
  }

  if (requiredRole && role !== requiredRole && role !== "super_admin") {
    return <Navigate to={role === "teacher" ? "/teacher" : role === "super_admin" ? "/super-admin" : "/"} replace />;
  }

  return children;
};

const PublicAuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, session } = useAuth();
  if (isAuthenticated && session) {
    return <Navigate to={session.role === "super_admin" ? "/super-admin" : session.role === "teacher" ? "/teacher" : "/"} replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const showChatButton = isAuthenticated && location.pathname !== "/start";

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8FF] font-body-md text-[#1A1626] selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0] pb-20 lg:pb-0 relative">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Start Hub & Auth Routes */}
          <Route path="/start" element={<StartScreen />} />
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/signup" element={<PublicAuthRoute><SignUp /></PublicAuthRoute>} />
          <Route path="/forgot-password" element={<PublicAuthRoute><ForgotPassword /></PublicAuthRoute>} />

          {/* Super Admin Console */}
          <Route path="/super-admin" element={<PrivateRoute requiredRole="super_admin"><SuperAdminConsole /></PrivateRoute>} />

          {/* Student Core Dashboard & Self-Understanding Hub */}
          <Route path="/" element={<PrivateRoute><HomeDashboard /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/self-understanding" element={<PrivateRoute><SelfUnderstanding /></PrivateRoute>} />
          <Route path="/self-report" element={<PrivateRoute><SelfReport /></PrivateRoute>} />

          {/* Onboarding & Assessments */}
          <Route path="/onboarding-test" element={<PrivateRoute><OnboardingTestFlow /></PrivateRoute>} />
          <Route path="/onboarding-code" element={<PrivateRoute><OnboardingCode /></PrivateRoute>} />
          <Route path="/onboarding-info" element={<PrivateRoute><OnboardingInfo /></PrivateRoute>} />
          <Route path="/interest-test" element={<PrivateRoute><InterestTest /></PrivateRoute>} />
          <Route path="/intelligence-test" element={<PrivateRoute><IntelligenceTest /></PrivateRoute>} />
          <Route path="/learning-test" element={<PrivateRoute><LearningStyleTest /></PrivateRoute>} />
          <Route path="/test-result" element={<PrivateRoute><TestResult /></PrivateRoute>} />

          {/* Roadmap & Habits */}
          <Route path="/roadmap" element={<PrivateRoute><StarRoadmap /></PrivateRoute>} />
          <Route path="/habits" element={<PrivateRoute><HabitManagement /></PrivateRoute>} />

          {/* AI Activity & Portfolio Archive */}
          <Route path="/activity-form" element={<PrivateRoute><ActivityForm /></PrivateRoute>} />
          <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />

          {/* Teacher Guide 3D Pro Dashboard */}
          <Route path="/teacher" element={<PrivateRoute requiredRole="teacher"><TeacherGuide /></PrivateRoute>} />
          
          {/* Diagnostics Center Routes */}
          <Route path="/diagnostics/multiple-intelligences" element={<PrivateRoute><MultipleIntelligencesTest /></PrivateRoute>} />
          <Route path="/diagnostics/growth-mindset" element={<PrivateRoute><GrowthMindsetTest /></PrivateRoute>} />
          <Route path="/diagnostics/via-strengths" element={<PrivateRoute><ViaStrengthsTest /></PrivateRoute>} />
          <Route path="/diagnostics/time-management" element={<PrivateRoute><TimeManagementTest /></PrivateRoute>} />
          <Route path="/diagnostics/ai-literacy" element={<PrivateRoute><AiLiteracyTest /></PrivateRoute>} />
          <Route path="/diagnostics/resilience" element={<PrivateRoute><ResilienceTest /></PrivateRoute>} />
          <Route path="/diagnostics/career-maturity" element={<PrivateRoute><CareerMaturityTest /></PrivateRoute>} />

          {/* Fallback Catch-all: send to /start */}
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </main>

      <BottomNav />

      {/* Stitch 3D Floating Ask Ari Trigger Button */}
      {showChatButton && (
        <div className="fixed bottom-20 lg:bottom-8 right-5 lg:right-8 z-40">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#8E70F7] to-[#6240d5] hover:from-[#7B5CF0] hover:to-[#4a21be] text-white pl-2.5 pr-5 py-2.5 rounded-full shadow-[0_12px_28px_rgba(98,64,213,0.35)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-white/25 group"
            title="아리에게 실시간 AI 질문하기"
          >
            <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border border-[#cbbeff]">
              <img src={ARI_BLOB_URL} alt="Ari" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#7af1fc] font-extrabold leading-none tracking-wider uppercase whitespace-nowrap">AI 커리어 어시스턴트</span>
              <span className="text-sm font-extrabold font-headline leading-tight mt-0.5 whitespace-nowrap">아리에게 묻기 ✨</span>
            </div>
          </button>
        </div>
      )}

      {/* Ask Ari Modal */}
      <AriChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Global EXP Reward & Level Up Modal */}
      <GlobalExpRewardModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SelfUnderstandingProvider>
        <Router>
          <AppContent />
        </Router>
      </SelfUnderstandingProvider>
    </AuthProvider>
  );
};

export default App;
