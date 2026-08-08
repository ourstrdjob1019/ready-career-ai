import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { Chip, MascotAri } from "./index";
import {
  Menu,
  X,
  Compass,
  Award,
  BookOpen,
  LogOut,
  Home,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/start");
    setMobileMenuOpen(false);
  };

  const studentNavItems = [
    { label: "홈", path: "/", icon: Home },
    { label: "자기이해", path: "/self-understanding", icon: Sparkles },
    { label: "진로포트폴리오", path: "/portfolio", icon: Award },
    { label: "학습포트폴리오", path: "/roadmap", icon: Compass },
    { label: "습관목표", path: "/habits", icon: Award },
    { label: "마이페이지", path: "/mypage", icon: UserCheck },
  ];

  const teacherNavItems = [
    { label: "👨‍🏫 교사용 학급 보드", path: "/teacher", icon: BookOpen, badge: "NEIS 가이드" },
  ];

  const superAdminNavItems = [
    { label: "👑 최종마스터 콘솔", path: "/super-admin", icon: ShieldAlert, badge: "가입제어" },
    { label: "교사 뷰 전환", path: "/teacher", icon: BookOpen },
    { label: "학생 메인 뷰", path: "/", icon: Home },
  ];

  const activeNavItems =
    session?.role === "super_admin"
      ? superAdminNavItems
      : session?.role === "teacher"
      ? teacherNavItems
      : studentNavItems;

  const isStartScreen = location.pathname === "/start";

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-variant/40 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mascot Avatar Profile */}
        <Link 
          to={isAuthenticated ? (session?.role === "teacher" ? "/teacher" : session?.role === "super_admin" ? "/super-admin" : "/") : "/start"} 
          className="flex items-center gap-3 select-none group" 
        >
          <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform border border-surface-variant/60">
            <MascotAri pose="avatar" size="sm" rotate={false} className="-mt-1" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-xl text-[#1A1626] tracking-tight group-hover:text-[#7B5CF0] transition-colors">
                ReadyCareer <span className="text-[#7B5CF0] font-black">AI</span>
              </span>
            </div>
            <span className="text-[11px] text-text-muted font-body-md">
              {isAuthenticated && !isStartScreen ? (
                session?.role === "super_admin" ? "👑 최종 슈퍼관리자 (마스터 뷰)" : session?.role === "teacher" ? "👨‍🏫 교직원 & 학교 관리자 세션" : "🧑‍🎓 맞춤형 진로 AI 커리어 네비게이터"
              ) : (
                "학생 주도적 AI 커리어 네비게이터"
              )}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (로그인 시에만 표시) */}
        {isAuthenticated && !isStartScreen && (
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container/70 px-3 py-1.5 rounded-full border border-surface-variant/50 shadow-inner">
            {activeNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-full text-xs font-headline font-black flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-on-primary shadow-3d-base scale-[1.02]"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {(item as any).badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ml-0.5 ${
                      isActive ? "bg-white/20 text-white" : "bg-secondary/15 text-secondary"
                    }`}>
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action / User Profile (로그인 되었고 스타트 화면이 아닐 때만 이름 표기) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && !isStartScreen && session ? (
            <div className="flex items-center gap-3">
              {/* User badge (Click to visit MyPage) */}
              <Link
                to={session.role === "teacher" ? "/teacher" : session.role === "super_admin" ? "/super-admin" : "/mypage"}
                className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full border border-surface-variant/50 shadow-inner transition-colors group cursor-pointer"
                title="누적 마이페이지 열람하기"
              >
                {session.role === "super_admin" ? (
                  <ShieldAlert className="w-4 h-4 text-secondary-spot group-hover:scale-110 transition-transform flex-shrink-0" />
                ) : session.role === "teacher" ? (
                  <ShieldCheck className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform flex-shrink-0" />
                ) : (
                  <UserCheck className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                )}
                <span className="text-xs font-headline font-black text-text-primary whitespace-nowrap group-hover:text-primary transition-colors">
                  {localStorage.getItem("readycareer_student_name") || (session.name && session.name.trim() !== "" ? session.name : "신규 방문 학생")}
                </span>
                <Chip size="sm" variant={session.role === "super_admin" || session.role === "teacher" ? "teal" : "default"} className="py-0.5 text-[10px] font-extrabold whitespace-nowrap">
                  {session.role === "super_admin" ? "마스터" : session.role === "teacher" ? "교직원" : "마이페이지 🌟"}
                </Chip>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-surface-container border border-surface-variant/60 text-text-muted hover:text-error hover:border-error/40 transition-colors whitespace-nowrap"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>종료</span>
              </button>
            </div>
          ) : (
            /* 비로그인 혹은 첫 진입 시 우측은 깔끔하게 유지 */
            <div className="text-xs font-headline font-bold text-text-muted">
              <span>2026 ReadyCareer AI 스마트 에듀테크 플랫폼</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button (로그인 시에만) */}
        {isAuthenticated && !isStartScreen && (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-surface-container text-text-primary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && isAuthenticated && !isStartScreen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-variant/50 px-4 py-5 space-y-4 shadow-2xl">
          <div className="p-3 bg-surface-container rounded-2xl flex items-center justify-between text-xs">
            <span className="font-black text-text-primary flex items-center gap-1.5">
              {session?.role === "super_admin" ? "👑" : session?.role === "teacher" ? "👨‍🏫" : "🧑‍🎓"} {session?.name}
            </span>
            <Chip size="sm" variant={session?.role === "super_admin" || session?.role === "teacher" ? "teal" : "default"}>
              {session?.role === "super_admin" ? "마스터" : session?.role === "teacher" ? "교직원" : "학생"}
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
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-surface-variant/30">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-error-container/20 text-error font-bold text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃 (세션 종료)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
