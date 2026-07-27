import { createClient } from "@supabase/supabase-js";

// Vercel 환경변수가 설정되지 않은 경우에도 정상 연결되도록 Verified Public Fallback URL 및 Anon Key 탑재
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pydvuqjhzcrpauzpssxg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZHZ1cWpoemNycGF1enBzc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjI5MTYsImV4cCI6MjEwMDUzODkxNn0.PCs3IJYmmo5y0b-d09ztRlbP7QjVb0HTur_jD-8NqYc";

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
