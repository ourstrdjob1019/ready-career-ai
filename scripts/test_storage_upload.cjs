const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(process.cwd(), ".env");
let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split(/\r?\n/).forEach(line => {
    if (line.trim().startsWith("VITE_SUPABASE_URL=")) supabaseUrl = line.split("=")[1].trim();
    if (line.trim().startsWith("VITE_SUPABASE_ANON_KEY=")) supabaseKey = line.split("=")[1].trim();
    if (line.trim().startsWith("SUPABASE_SERVICE_ROLE_KEY=")) supabaseKey = line.split("=")[1].trim();
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'character-assets';

async function testVariousPaths() {
  const testImgPath = path.join(process.cwd(), "RIASEC 유형별 캐릭터 디자인-20260806T022036Z-1-001", "RIASEC 유형별 캐릭터 디자인", "A_예술형", "성우 (아리)", "00 Lv.1 초보성우.png");
  const buf = fs.readFileSync(testImgPath);

  const testCases = [
    { label: "원본 한글+괄호+띄어쓰기", path: "A/성우 (아리)/lv1_00_Lv.1_초보성우.png" },
    { label: "괄호/띄어쓰기 제거 한글", path: "A/성우_아리/lv1_초보성우.png" },
    { label: "영문/숫자 클린 경로", path: "A/job_actor/lv1.png" }
  ];

  for (const tc of testCases) {
    console.log(`\n🧪 테스트 [${tc.label}]: '${tc.path}'`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(tc.path, buf, { contentType: "image/png", upsert: true });
    
    if (error) {
      console.error(`  ❌ 실패! 사유:`, error.message, error);
    } else {
      console.log(`  ✅ 성공!`, data);
    }
  }
}

testVariousPaths();
