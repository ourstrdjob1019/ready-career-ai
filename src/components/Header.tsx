import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Sparkles } from "lucide-react";
import { MASCOT_ASSETS } from "../assets/mascotData";

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="flex justify-between items-center w-full px-5 md:px-10 py-3.5 sticky top-0 bg-background/90 backdrop-blur-md z-40 border-b border-surface-variant/30">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-3d-base flex-shrink-0 bg-surface-container group-hover:scale-105 transition-transform duration-200">
            <img 
              alt="ReadyCareer AI Ari Mascot Profile" 
              className="w-full h-full object-cover"
              src={MASCOT_ASSETS.avatar} 
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-headline-md font-headline font-extrabold text-primary tracking-tight group-hover:opacity-90 transition-opacity">
                ReadyCareer AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-semibold">
                <Sparkles className="w-3 h-3 text-secondary-spot" />
                Beta
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Quick Navigation Links */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-4 font-headline text-label-lg font-semibold text-text-muted">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-full transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container-low hover:text-text-primary'}`}
        >
          홈 대시보드
        </Link>
        <Link 
          to="/roadmap" 
          className={`px-4 py-2 rounded-full transition-colors ${location.pathname === '/roadmap' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container-low hover:text-text-primary'}`}
        >
          별자리 로드맵
        </Link>
        <Link 
          to="/portfolio" 
          className={`px-4 py-2 rounded-full transition-colors ${location.pathname === '/portfolio' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container-low hover:text-text-primary'}`}
        >
          진로 포트폴리오
        </Link>
        <Link 
          to="/teacher" 
          className={`px-4 py-2 rounded-full transition-colors ${location.pathname === '/teacher' ? 'bg-secondary/15 text-secondary-spot font-bold border border-secondary/30' : 'hover:bg-surface-container-low hover:text-text-primary'}`}
        >
          교사 가이드 (Pro)
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Link 
          to="/onboarding-code"
          className="md:hidden text-label-sm text-secondary font-semibold bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary/20 transition-colors"
        >
          온보딩
        </Link>
        <button 
          aria-label="Notifications"
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-150 relative shadow-3d-base"
        >
          <Bell className="w-5 h-5 text-text-primary" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-error animate-pulse" />
        </button>
      </div>
    </header>
  );
};
