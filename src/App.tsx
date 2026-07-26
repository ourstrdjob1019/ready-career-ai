import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header, BottomNav } from "./components";
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
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8FF] font-body-md text-[#1A1626] selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0] pb-20 lg:pb-0">
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
          <Route path="/self-understanding" element={<PrivateRoute><SelfUnderstanding /></PrivateRoute>} />
          <Route path="/self-report" element={<PrivateRoute><SelfReport /></PrivateRoute>} />

          {/* Onboarding & Assessments */}
          <Route path="/onboarding-code" element={<PrivateRoute><OnboardingCode /></PrivateRoute>} />
          <Route path="/onboarding-info" element={<PrivateRoute><OnboardingInfo /></PrivateRoute>} />
          <Route path="/interest-test" element={<PrivateRoute><InterestTest /></PrivateRoute>} />
          <Route path="/test-result" element={<PrivateRoute><TestResult /></PrivateRoute>} />

          {/* Roadmap & Habits */}
          <Route path="/roadmap" element={<PrivateRoute><StarRoadmap /></PrivateRoute>} />
          <Route path="/habits" element={<PrivateRoute><HabitManagement /></PrivateRoute>} />

          {/* AI Activity & Portfolio Archive */}
          <Route path="/activity-form" element={<PrivateRoute><ActivityForm /></PrivateRoute>} />
          <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />

          {/* Teacher Guide 3D Pro Dashboard */}
          <Route path="/teacher" element={<PrivateRoute requiredRole="teacher"><TeacherGuide /></PrivateRoute>} />

          {/* Fallback Catch-all: send to /start */}
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </main>

      <BottomNav />
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
