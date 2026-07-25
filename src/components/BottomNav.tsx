import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { Home, Compass, Award, Brain, BookOpen } from "lucide-react";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { session, isAuthenticated } = useAuth();

  // If not logged in, don't display BottomNav
  if (!isAuthenticated || !session) {
    return null;
  }

  const studentItems = [
    { label: "홈", path: "/", icon: Home },
    { label: "자기이해", path: "/self-understanding", icon: Brain, isSpot: true },
    { label: "로드맵", path: "/roadmap", icon: Compass },
    { label: "포트폴리오", path: "/portfolio", icon: Award },
  ];

  const teacherItems = [
    { label: "교사용 3D", path: "/teacher", icon: BookOpen, isSpot: true },
    { label: "자기이해 DB", path: "/self-understanding", icon: Brain },
    { label: "학생 관리", path: "/portfolio", icon: Award },
  ];

  const navItems = session.role === "teacher" ? teacherItems : studentItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/85 backdrop-blur-2xl border-t border-surface-variant/40 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] px-3 py-2">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          const isSpot = item.isSpot;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? isSpot
                    ? "text-secondary font-black -translate-y-0.5"
                    : "text-primary font-black -translate-y-0.5"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <div
                className={`w-11 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? isSpot
                      ? "bg-secondary text-on-secondary shadow-md"
                      : "bg-primary text-on-primary shadow-sm"
                    : "bg-transparent"
                }`}
              >
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className={`text-[11px] font-headline tracking-tight mt-1 ${isActive ? "font-black text-text-primary" : "font-semibold"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
