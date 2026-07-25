import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { Button, Chip, MascotAri } from "./index";
import {
  Sparkles,
  Menu,
  X,
  Compass,
  Award,
  BookOpen,
  LogOut,
  LogIn,
  Brain,
  Home,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  // Student vs Teacher dynamic navigation items
  const studentNavItems = [
    { label: "홈", path: "/", icon: Home },
    { label: "자기이해", path: "/self-understanding", icon: Brain, badge: "AI 3D" },
    { label: "별자리 로드맵", path: "/roadmap", icon: Compass },
    { label: "습관 관리", path: "/habits", icon: Sparkles },
    { label: "진로 포트폴리오", path: "/portfolio", icon: Award },
  ];

  const teacherNavItems = [
    { label: "👨‍🏫 교사 3D Pro 보드", path: "/teacher", icon: BookOpen, badge: "2560px Pro" },
    { label: "학급 포트폴리오 DB", path: "/portfolio", icon: Award },
    { label: "자기이해 다중진단", path: "/self-understanding", icon: Brain },
  ];

  const activeNavItems = session?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-variant/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mascot Avatar Profile */}
        <Link to={isAuthenticated ? (session?.role === "teacher" ? "/teacher" : "/") : "/login"} className="flex items-center gap-3 select-none group">
          <div className="w-12 h-12 rounded-full gradient-hero-card flex items-center justify-center p-1 shadow-3d-base group-hover:scale-105 transition-transform">
            <MascotAri pose="avatar" size="sm" rotate={false} className="-mt-1" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-extrabold text-xl text-text-primary tracking-tight group-hover:text-primary transition-colors">
                ReadyCareer <span className="text-transparent bg-clip-text gradient-hero-card">AI</span>
              </span>
              <span className="text-[10px] font-headline font-extrabold bg-secondary text-on-secondary px-2 py-0.5 rounded-full bezel-effect">
                3D 한글
              </span>
            </div>
            <span className="text-[11px] text-text-muted font-body-md">
              {isAuthenticated ? (session?.role === "teacher" ? "👨‍🏫 교직원 & 학교 담당자 세션" : "🧑‍🎓 학생 맞춤 포트폴리오 세션") : "중·고교 맞춤형 AI 커리어 파트너"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible only when logged in) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-surface-container/60 px-4 py-2 rounded-full border border-surface-variant/40">
            {activeNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-headline font-extrabold flex items-center gap-1.5 transition-all duration-150 ${
                    isActive
                      ? "bg-primary text-on-primary shadow-3d-base bezel-effect"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5 ${
                      isActive ? "bg-white/25 text-white" : "bg-secondary/20 text-secondary-spot"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action / User Profile & Logout Button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && session ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-variant/30">
                {session.role === "teacher" ? (
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                ) : (
                  <UserCheck className="w-4 h-4 text-primary" />
                )}
                <span className="text-xs font-headline font-extrabold text-text-primary">
                  {session.name}
                </span>
                <Chip size="sm" variant={session.role === "teacher" ? "teal" : "default"} className="py-0.5">
                  {session.role === "teacher" ? "학교담당자" : "학생"}
                </Chip>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-error-container/20 text-error hover:bg-error-container/40 transition-colors"
                title="현재 세션에서 로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" icon={<LogIn className="w-4 h-4" />}>
                  로그인
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="teal" size="sm" className="font-extrabold">
                  30초 회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="p-2 text-error bg-error-container/20 rounded-full"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-2xl bg-surface-container text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-variant/40 px-4 py-5 space-y-4 shadow-2xl">
          {isAuthenticated ? (
            <>
              <div className="p-3 bg-surface-container rounded-2xl flex items-center justify-between text-xs">
                <span className="font-extrabold text-text-primary flex items-center gap-1.5">
                  {session?.role === "teacher" ? "👨‍🏫" : "🧑‍🎓"} {session?.name} ({session?.school})
                </span>
                <Chip size="sm" variant={session?.role === "teacher" ? "teal" : "default"}>
                  {session?.role === "teacher" ? "학교담당자 Pro" : "학생 세션"}
                </Chip>
              </div>

              <nav className="flex flex-col gap-2">
                {activeNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComp = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-2xl font-headline font-bold text-base flex items-center justify-between ${
                        isActive
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-text-primary bg-surface-container-low"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-surface-variant/30 flex gap-2">
                <Button variant="secondary" size="md" fullWidth onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                  로그아웃 (세션 종료)
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="hero" size="md" fullWidth icon={<LogIn className="w-4 h-4" />}>
                  로그인 화면으로 이동
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="teal" size="md" fullWidth>
                  신규 회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
