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
  SelfUnderstanding,
  SelfReport,
} from "./pages";
import { AuthProvider, SelfUnderstandingProvider, useAuth } from "./context";
import "./App.css";

// PrivateRoute: automatically redirects to /login if user is not authenticated
const PrivateRoute: React.FC<{ children: React.ReactElement; requiredRole?: "student" | "teacher" }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a teacher tries to hit student-only root (/), gracefully steer them to teacher board
  if (session?.role === "teacher" && location.pathname === "/") {
    return <Navigate to="/teacher" replace />;
  }

  // Optional strict role checks
  if (requiredRole && session?.role !== requiredRole) {
    return <Navigate to={session?.role === "teacher" ? "/teacher" : "/"} replace />;
  }

  return children;
};

// PublicRoute: if already logged in and hits /login or /signup, redirect to appropriate home
const PublicAuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, session } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={session?.role === "teacher" ? "/teacher" : "/"} replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-text-primary selection:bg-primary/20 selection:text-primary pb-20 md:pb-0">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Auth Public Routes (First Screen Target) */}
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/signup" element={<PublicAuthRoute><SignUp /></PublicAuthRoute>} />
          <Route path="/forgot-password" element={<PublicAuthRoute><ForgotPassword /></PublicAuthRoute>} />

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

          {/* Fallback Catch-all: send to root (which checks auth and steers appropriately) */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
