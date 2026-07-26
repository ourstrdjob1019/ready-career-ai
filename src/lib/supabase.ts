import { createClient } from "@supabase/supabase-js";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// 만약 실수로 URL 끝에 /rest/v1 이나 /가 붙어입력되었을 경우 자동 정제
if (supabaseUrl.endsWith("/rest/v1/")) {
  supabaseUrl = supabaseUrl.replace("/rest/v1/", "");
} else if (supabaseUrl.endsWith("/rest/v1")) {
  supabaseUrl = supabaseUrl.replace("/rest/v1", "");
} else if (supabaseUrl.endsWith("/")) {
  supabaseUrl = supabaseUrl.slice(0, -1);
}

// 환경변수 유효성 검증
export const isSupabaseConfigured =
  supabaseUrl.startsWith("http") && !supabaseUrl.includes("your-project-id");

// Supabase 클라이언트 생성
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder_anon_key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
