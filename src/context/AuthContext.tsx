import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "teacher";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school: string;
  grade?: string;
  targetCluster?: string;
  teacherCode?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  signup: (data: Partial<UserSession>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const LOCAL_STORAGE_KEY = "readycareer_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load session:", e);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, [session]);

  const login = (email: string, role: UserRole, name = "김수진") => {
    const defaultName = role === "teacher" ? "박성열 선생님 (담당자)" : name;
    const defaultSchool = "서울창의고등학교";
    const newSession: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      name: defaultName,
      role,
      school: defaultSchool,
      grade: role === "student" ? "3학년 2반" : undefined,
      targetCluster: role === "student" ? "인공지능·공학" : undefined,
    };
    setSession(newSession);
  };

  const logout = () => {
    setSession(null);
  };

  const signup = async (data: Partial<UserSession>): Promise<boolean> => {
    // Mimic async DB registration call (Ready for Supabase Auth migration)
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSession: UserSession = {
          id: `usr-${Date.now()}`,
          email: data.email || "student@readycareer.ai",
          name: data.name || "신가입 학생",
          role: data.role || "student",
          school: data.school || "서울창의고등학교",
          grade: data.grade || "1학년",
          targetCluster: data.targetCluster || "AI 융합",
        };
        setSession(newSession);
        resolve(true);
      }, 500);
    });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Mimic async Supabase reset password email sending
    console.log(`Password reset instruction sent to ${email}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 600);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        login,
        logout,
        signup,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
