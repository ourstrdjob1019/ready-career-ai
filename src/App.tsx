import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
} from "./pages";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen pb-20 md:pb-6 bg-background">
        {/* Universal Sticky App Bar */}
        <Header />

        {/* Main Routed Views Canvas */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/onboarding-code" element={<OnboardingCode />} />
            <Route path="/onboarding-info" element={<OnboardingInfo />} />
            <Route path="/interest-test" element={<InterestTest />} />
            <Route path="/test-result" element={<TestResult />} />
            <Route path="/roadmap" element={<StarRoadmap />} />
            <Route path="/habits" element={<HabitManagement />} />
            <Route path="/activity-form" element={<ActivityForm />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/teacher" element={<TeacherGuide />} />
          </Routes>
        </main>

        {/* Mobile-only Glassmorphism Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  );
}
