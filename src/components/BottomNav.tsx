import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Award, FileText, BookOpen } from "lucide-react";

export const BottomNav: React.FC = () => {
  const navItems = [
    { name: "홈", path: "/", icon: Home },
    { name: "로드맵", path: "/roadmap", icon: Compass },
    { name: "포트폴리오", path: "/portfolio", icon: Award },
    { name: "활동기록", path: "/activity-form", icon: FileText },
    { name: "교사 Pro", path: "/teacher", icon: BookOpen, accent: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 glass-overlay rounded-t-[2rem] shadow-[0_-4px_30px_rgba(123,92,240,0.15)]">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? item.accent 
                    ? "text-secondary font-extrabold scale-105" 
                    : "text-primary font-extrabold scale-105"
                  : "text-text-muted hover:text-text-primary font-medium opacity-80"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-full ${isActive ? (item.accent ? 'bg-secondary/15' : 'bg-primary/15') : ''}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-headline text-[11px] font-semibold mt-0.5 tracking-tight">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
