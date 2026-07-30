import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { Home, Compass, Award, BookOpen, ShieldAlert, Flame } from "lucide-react";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { session, isAuthenticated } = useAuth();

  if (!isAuthenticated || !session || location.pathname === "/start") {
    return null;
  }

  const studentItems = [
    { label: "홈", path: "/", icon: Home },
    { label: "습관&목표", path: "/habits", icon: Flame },
    { label: "진로포트폴리오", path: "/portfolio", icon: Award },
    { label: "학습포트폴리오", path: "/roadmap", icon: Compass, isSpot: true },
  ];

  const teacherItems = [
    { label: "교사 보드", path: "/teacher", icon: BookOpen, isSpot: true },
  ];

  const superAdminItems = [
    { label: "👑 마스터", path: "/super-admin", icon: ShieldAlert, isSpot: true },
    { label: "교사 뷰", path: "/teacher", icon: BookOpen },
    { label: "학생 뷰", path: "/", icon: Home },
  ];

  const navItems =
    session.role === "super_admin"
      ? superAdminItems
      : session.role === "teacher"
      ? teacherItems
      : studentItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-surface-variant/50 shadow-[0_-10px_25px_rgba(0,0,0,0.15)] px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          const isSpot = (item as any).isSpot;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? isSpot
                    ? "text-secondary font-black -translate-y-0.5"
                    : "text-primary font-black -translate-y-0.5"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? isSpot
                      ? "bg-secondary text-on-secondary shadow-md"
                      : "bg-primary text-on-primary shadow-sm"
                    : "bg-transparent"
                }`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className={`text-[10px] font-headline tracking-tight mt-1 truncate ${isActive ? "font-black text-text-primary" : "font-semibold"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
