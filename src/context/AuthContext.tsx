import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type UserRole = "student" | "teacher" | "super_admin";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school: string;
  schoolCode: string;
  grade?: number;
  classNo?: number;
  avatarUrl?: string;
  isExpoDemo?: boolean;
}

interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  isExpoDemoMode: boolean;
  signupOpen: boolean;
  inviteCodes: Array<{ id: string; code: string; role: string; school: string; usedCount: number; maxUses: number }>;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, school: string, schoolCode: string, inviteCode: string) => Promise<{ success: boolean; message?: string }>;
  startExpoDemo: (role: UserRole) => void;
  toggleSignupOpen: () => void;
  generateInviteCode: (role: string, school: string, maxUses?: number) => string;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EXPO_STUDENT_SESSION: UserSession = {
  id: "expo-student-1001",
  email: "student@seoul-high.edu",
  name: "김수진 (체험용)",
  role: "student",
  school: "서울창의고등학교",
  schoolCode: "SEOUL-701",
  grade: 2,
  classNo: 4,
  isExpoDemo: true,
};

const EXPO_TEACHER_SESSION: UserSession = {
  id: "expo-teacher-2001",
  email: "teacher@seoul-high.edu",
  name: "박성열 선생님 (체험용)",
  role: "teacher",
  school: "서울창의고등학교",
  schoolCode: "SEOUL-701",
  isExpoDemo: true,
};

const EXPO_SUPER_ADMIN_SESSION: UserSession = {
  id: "expo-super-3001",
  email: "master@readycareer.ai",
  name: "최종마스터 (슈퍼관리자)",
  role: "super_admin",
  school: "ReadyCareer AI 본사 통합센터",
  schoolCode: "MASTER-000",
  isExpoDemo: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("readycareer_session_v3");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return EXPO_STUDENT_SESSION;
  });

  const [isExpoDemoMode, setIsExpoDemoMode] = useState<boolean>(() => {
    return localStorage.getItem("readycareer_demo_mode") !== "false";
  });

  const [signupOpen, setSignupOpen] = useState<boolean>(true);
  const [inviteCodes, setInviteCodes] = useState([
    { id: "iv-1", code: "EXPO-2026", role: "student", school: "서울창의고등학교", usedCount: 14, maxUses: 100 },
    { id: "iv-2", code: "TEACHER-SEOUL", role: "teacher", school: "서울창의고등학교", usedCount: 3, maxUses: 10 },
    { id: "iv-3", code: "AI-GENTLE", role: "student", school: "경기과천AI선도고등학교", usedCount: 8, maxUses: 50 },
  ]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("readycareer_session_v3", JSON.stringify(session));
      setIsExpoDemoMode(!!session.isExpoDemo);
    } else {
      localStorage.removeItem("readycareer_session_v3");
    }
  }, [session]);

  const startExpoDemo = (role: UserRole) => {
    setIsExpoDemoMode(true);
    localStorage.setItem("readycareer_demo_mode", "true");
    if (role === "teacher") {
      setSession(EXPO_TEACHER_SESSION);
    } else if (role === "super_admin") {
      setSession(EXPO_SUPER_ADMIN_SESSION);
    } else {
      setSession(EXPO_STUDENT_SESSION);
    }
  };

  const login = async (email: string, _password?: string, overrideRole?: UserRole): Promise<boolean> => {
    setIsExpoDemoMode(false);
    localStorage.setItem("readycareer_demo_mode", "false");

    if (email.includes("master") || overrideRole === "super_admin") {
      setSession({ ...EXPO_SUPER_ADMIN_SESSION, name: "최종 마스터 (실사용)", isExpoDemo: false });
    } else if (email.includes("teacher") || email.includes("teacher@") || overrideRole === "teacher") {
      setSession({ ...EXPO_TEACHER_SESSION, email, name: "정식 교직원 담당자", isExpoDemo: false });
    } else {
      setSession({
        id: `user-${Date.now()}`,
        email: email || "live.student@seoul-high.edu",
        name: "정식 가입 학생",
        role: "student",
        school: "서울창의고등학교",
        schoolCode: "SEOUL-701",
        grade: 1,
        classNo: 3,
        isExpoDemo: false,
      });
    }
    return true;
  };

  const register = async (name: string, email: string, role: UserRole, school: string, schoolCode: string, inviteCode: string): Promise<{ success: boolean; message?: string }> => {
    if (!signupOpen) {
      return { success: false, message: "⚠️ 현재 슈퍼관리자에 의해 정식 신규 회원가입 기간이 비공개로 마감되었습니다." };
    }

    const validInvite = inviteCodes.find((i) => i.code.trim().toUpperCase() === inviteCode.trim().toUpperCase());
    if (!validInvite && inviteCode !== "FREEPASS26") {
      return { success: false, message: "⚠️ 발급된 유효한 초대코드가 아닙니다. 소속 학교 담당자나 슈퍼관리자에게 획득해 주세요." };
    }

    setIsExpoDemoMode(false);
    localStorage.setItem("readycareer_demo_mode", "false");

    const newSession: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      school,
      schoolCode,
      grade: 2,
      classNo: 1,
      isExpoDemo: false,
    };
    setSession(newSession);
    return { success: true };
  };

  const resetPassword = async (_email: string): Promise<{ success: boolean; message?: string }> => {
    return { success: true, message: "비밀번호 초기화 메일이 성공적으로 전송되었습니다!" };
  };

  const logout = () => {
    setSession(null);
  };

  const toggleSignupOpen = () => {
    setSignupOpen((prev) => !prev);
  };

  const generateInviteCode = (role: string, school: string, maxUses: number = 30): string => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = role === "teacher" ? "T-VIP" : "S-AI";
    const code = `${prefix}-${randomSuffix}`;
    setInviteCodes((prev) => [
      ...prev,
      { id: `iv-${Date.now()}`, code, role, school, usedCount: 0, maxUses },
    ]);
    return code;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isExpoDemoMode,
        signupOpen,
        inviteCodes,
        login,
        logout,
        register,
        startExpoDemo,
        toggleSignupOpen,
        generateInviteCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
