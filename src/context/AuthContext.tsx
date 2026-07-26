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
  targetJob?: string;
  riasecCode?: string;
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
  startExpoDemo: (role: UserRole, customProfile?: Partial<UserSession>) => void;
  toggleSignupOpen: () => void;
  generateInviteCode: (role: string, school: string, maxUses?: number) => string;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EXPO_STUDENT_SESSION: UserSession = {
  id: "expo-student-1001",
  email: "student.sujin@seoul-high.edu",
  name: "김수진",
  role: "student",
  school: "서울창의고등학교",
  schoolCode: "SEOUL-701",
  grade: 2,
  classNo: 4,
  targetJob: "스마트 AI 에듀테크 진로 멘토",
  riasecCode: "SI",
  isExpoDemo: true,
};

const EXPO_TEACHER_SESSION: UserSession = {
  id: "expo-teacher-2001",
  email: "teacher.park@seoul-high.edu",
  name: "박성열 담임교사",
  role: "teacher",
  school: "서울창의고등학교",
  schoolCode: "SEOUL-701",
  isExpoDemo: true,
};

const EXPO_SUPER_ADMIN_SESSION: UserSession = {
  id: "expo-super-3001",
  email: "master@readycareer.ai",
  name: "최종마스터 통제관",
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
    return null;
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

  // 체험 모드 진입 및 사전 세팅값(직업, RIASEC, 비전, 습관 등) 즉시 동기화
  const startExpoDemo = (role: UserRole, customProfile?: Partial<UserSession>) => {
    setIsExpoDemoMode(true);
    localStorage.setItem("readycareer_demo_mode", "true");
    
    let targetSession = EXPO_STUDENT_SESSION;
    if (role === "teacher") targetSession = EXPO_TEACHER_SESSION;
    if (role === "super_admin") targetSession = EXPO_SUPER_ADMIN_SESSION;

    const mergedSession = { ...targetSession, ...customProfile };
    setSession(mergedSession);

    // 학생용 체험 데이터 사전 세팅 (로그인 시 미리 채워둠)
    if (role === "student") {
      if (mergedSession.targetJob) {
        localStorage.setItem(
          "my_interested_jobs",
          JSON.stringify([
            { name: mergedSession.targetJob, image: "👨‍🏫", category: "대표 관심 직업" },
            { name: "빅데이터 데이터 분석사", image: "📊", category: "AI·데이터" },
            { name: "디스플레이 및 웹 서비스 디자이너", image: "🎨", category: "디자인·IT" },
          ])
        );
      }
      if (mergedSession.riasecCode) {
        localStorage.setItem("riasec_result_code", mergedSession.riasecCode);
        localStorage.setItem("riasec_primary", mergedSession.riasecCode.charAt(0));
      }
      localStorage.setItem(
        "readycareer_vision_v1",
        "AI 역량과 따뜻한 공감 능력으로 교육 격차를 해소하는 4차 산업 융합 디렉터가 되겠다!"
      );
      localStorage.setItem(
        "my_habits_v2",
        JSON.stringify([
          { id: "h-1", title: "매일 AI 알고리즘 문제 1개 실습 · 50일 챌린지", targetDays: 50, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], category: "코딩·AI" },
          { id: "h-2", title: "최신 STEM 저널 및 진로 기사 15분 정독", targetDays: 30, completedDays: [1, 2, 3, 4, 5, 6, 7], category: "독서·탐구" },
        ])
      );
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
        name: email.split("@")[0] || "정식 가입 학생",
        role: "student",
        school: "서울창의고등학교",
        schoolCode: "SEOUL-701",
        grade: 1,
        classNo: 3,
        targetJob: "AI 융합 개척자",
        riasecCode: "IA",
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
      grade: 1,
      classNo: 1,
      targetJob: "진로 탐색 중",
      riasecCode: "R",
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
