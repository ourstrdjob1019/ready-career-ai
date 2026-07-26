import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일에서 환경변수 로드 (간이 파싱)
const envPath = path.resolve(__dirname, "../.env");
let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split(/\r?\n/).forEach(line => {
    if (line.trim().startsWith("VITE_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1].trim();
    }
    if (line.trim().startsWith("VITE_SUPABASE_ANON_KEY=") && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabaseKey = line.split("=")[1].trim();
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL 또는 Key를 찾을 수 없습니다. .env 파일을 확인해주세요.");
  process.exit(1);
}

console.log("🔗 Supabase 연결 진행 중...", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCsv = path.resolve(__dirname, "../supabase_schools_중고등학교_핵심5600개.csv");
if (!fs.existsSync(targetCsv)) {
  console.error("❌ 변환된 CSV 파일이 없습니다 먼저 convert_schools_for_supabase.js를 실행해주세요.");
  process.exit(1);
}

const lines = fs.readFileSync(targetCsv, "utf-8").split(/\r?\n/).filter(line => line.trim().length > 0);
// 헤더(1행) 건너뛰기
const records = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(",");
  if (parts.length >= 4) {
    const schoolCode = parts[0].trim();
    const name = parts[1].replace(/^"|"$/g, '').trim();
    const region = parts[2].trim();
    const level = parts[3].trim();
    if (schoolCode && name) {
      records.push({ school_code: schoolCode, name, region, level });
    }
  }
}

console.log(`📦 총 ${records.length}개 학교 데이터 확인. 배치 업로드(500개씩)를 시작합니다...`);

async function upload() {
  const BATCH_SIZE = 500;
  let successCount = 0;
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    console.log(`🚀 [${i + 1} ~ ${Math.min(i + BATCH_SIZE, records.length)}] 데이터 전송 중...`);
    
    const { error } = await supabase.from("schools").upsert(batch, { onConflict: "school_code" });
    
    if (error) {
      console.error(`❌ 배치 업로드 에러 발생:`, error.message);
      if (error.message.includes("rls") || error.message.includes("permission") || error.code === "42501") {
        console.warn("\n⚠️ [안내] Supabase Row Level Security(RLS) 정책으로 인해 Anon Key로 업로드가 마진된 상태입니다.");
        console.warn("👉 해결책 1: Supabase 대시보드 -> Table Editor -> schools -> [Insert] -> [Import data from CSV] 버튼으로 생성된 'supabase_schools_중고등학교_핵심5600개.csv' 파일을 드래그해서 올려주세요 (가장 쉽고 100% 성공합니다!).");
        console.warn("👉 해결책 2: Supabase Project Settings -> API 에서 service_role key를 확인 후 터미널에 SUPABASE_SERVICE_ROLE_KEY='키' node scripts/upload_schools_to_supabase.js 로 실행해주세요.");
      }
      process.exit(1);
    }
    successCount += batch.length;
  }
  
  console.log(`\n🎉 전국 핵심 중·고등학교 ${successCount}개 Supabase 'schools' 테이블에 완벽히 업로드 성공했습니다!`);
}

upload().catch(err => console.error(err));
