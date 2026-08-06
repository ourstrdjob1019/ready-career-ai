const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. .env 환경변수 로드
const envPath = path.resolve(process.cwd(), ".env");
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
    if (line.trim().startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
      supabaseKey = line.split("=")[1].trim();
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ [오류] Supabase URL 또는 Key를 .env에서 찾을 수 없습니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'character-assets';
const TABLE_NAME = 'job_character_assets';
const IMAGE_DIR = path.join(process.cwd(), "RIASEC 유형별 캐릭터 디자인-20260806T022036Z-1-001", "RIASEC 유형별 캐릭터 디자인");

const riasecCodeMap = {
  "A_예술형": "A",
  "I_탐구형": "I",
  "R_현실형": "R",
  "S_사회형": "S",
  "E_진취형": "E",
  "C_관행형": "C"
};

const riasecNameMap = {
  "A_예술형": "예술형(A)",
  "I_탐구형": "탐구형(I)",
  "R_현실형": "현실형(R)",
  "S_사회형": "사회형(S)",
  "E_진취형": "E",
  "C_관행형": "C"
};

// 🌟 Supabase Storage API 규칙 준수 (한글 및 특수문자 키 금지에 따른 완벽한 영문 ASCII Slug 매핑)
const jobSlugMap = {
  // A_예술형
  "성우 (아리)": "actor_ari",
  "작곡가 (아리)": "composer_ari",
  "콘텐츠크리에이터 (토리)": "creator_tori",
  "파티시에 (토리)": "patissier_tori",
  // I_탐구형
  "과학수사관": "forensic_investigator",
  "로봇공학자": "robotics_engineer",
  "생명과학연구원": "bioscience_researcher",
  "소프트웨어개발자": "software_developer",
  "수의사": "veterinarian",
  "약사": "pharmacist",
  "의사": "doctor",
  "정보보안전문가": "security_specialist",
  "졍보보안전문가": "security_specialist",
  // R_현실형
  "경찰": "police_officer",
  "드론조종사": "drone_pilot",
  "반도체 엔지니어": "semiconductor_engineer",
  "반도체엔지니어": "semiconductor_engineer",
  "소방관": "firefighter",
  "요리사": "chef",
  "자동차정비사": "auto_mechanic",
  "전기기사": "electrical_engineer",
  "항공기조종사": "airline_pilot",
  // S_사회형
  "간호사 (아리)": "nurse_ari",
  "사회복지사 (아리)": "social_worker_ari",
  "승무원 (토리)": "flight_attendant_tori",
  "유치원교사 (토리)": "kindergarten_teacher_tori"
};

async function main() {
  console.log("=========================================================");
  console.log(` 🚀 Supabase Storage ('${BUCKET_NAME}') 및 Table 업로드 시작`);
  console.log("=========================================================");

  // 버킷 존재 확인 및 생성 시도
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.warn("⚠️ 버킷 조회 경고 (RLS 정책 또는 권한 문제일 수 있음):", bucketErr.message);
  } else {
    const exists = buckets?.some(b => b.name === BUCKET_NAME);
    if (!exists) {
      console.log(`📁 '${BUCKET_NAME}' 스토리지 버킷이 없어 새로 생성을 시도합니다...`);
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
      });
    } else {
      console.log(`✅ '${BUCKET_NAME}' 스토리지 버킷 활성화 확인`);
    }
  }

  const riasecFolders = fs.readdirSync(IMAGE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const finalRecords = [];
  let totalUploaded = 0;

  for (const riasec of riasecFolders) {
    const code = riasecCodeMap[riasec] || riasec[0];
    const catName = riasecNameMap[riasec] || riasec;
    const riasecPath = path.join(IMAGE_DIR, riasec);
    const jobs = fs.readdirSync(riasecPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const job of jobs) {
      const slug = jobSlugMap[job] || `job_${Math.random().toString(36).substring(2, 8)}`;
      const displayJobName = job.replace("졍보보안전문가", "정보보안전문가").replace("반도체 엔지니어", "반도체엔지니어");
      console.log(`\n▶ [${catName}] '${displayJobName}' (Slug: ${slug}) 5단계 이미지 업로드 진행...`);

      const jobPath = path.join(riasecPath, job);
      const files = fs.readdirSync(jobPath)
        .filter(f => /^\.(png|jpg|jpeg|webp)$/i.test(path.extname(f)))
        .sort();

      const jobRecord = {
        job_name: displayJobName,
        riasec_category: catName,
        riasec_code: code,
        levels: []
      };

      for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const filePath = path.join(jobPath, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const levelNum = i + 1;
        
        // ✨ Supabase Storage에 100% 호환되는 영문 ASCII 클린 객체 경로 (예: R/police_officer/lv1.png)
        const storagePath = `${code}/${slug}/lv${levelNum}.png`;

        process.stdout.write(`   ⬆️ [Lv.${levelNum}] -> ${storagePath} 업로드 중... `);

        const { error: uploadErr } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, fileBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        let publicUrl = "";
        if (uploadErr) {
          console.log(`❌ 실패 (${uploadErr.message})`);
          publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
        } else {
          console.log("✅ 성공!");
          totalUploaded++;
          const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
          publicUrl = urlData.publicUrl;
        }

        jobRecord.levels.push({
          name: fileName.replace(/\.[^/.]+$/, ""),
          url: publicUrl
        });
      }

      // 테이블 삽입용 객체 구성
      const tableRow = {
        job_name: displayJobName,
        riasec_category: catName,
        riasec_code: code,
        lv1_name: jobRecord.levels[0]?.name || "",
        lv1_image_url: jobRecord.levels[0]?.url || "",
        lv2_name: jobRecord.levels[1]?.name || "",
        lv2_image_url: jobRecord.levels[1]?.url || "",
        lv3_name: jobRecord.levels[2]?.name || "",
        lv3_image_url: jobRecord.levels[2]?.url || "",
        lv4_name: jobRecord.levels[3]?.name || "",
        lv4_image_url: jobRecord.levels[3]?.url || "",
        lv5_name: jobRecord.levels[4]?.name || "",
        lv5_image_url: jobRecord.levels[4]?.url || "",
      };

      finalRecords.push(tableRow);

      // Supabase Table에 upsert
      const { error: insertErr } = await supabase
        .from(TABLE_NAME)
        .upsert(tableRow, { onConflict: 'job_name' });

      if (insertErr) {
        console.warn(`   ⚠️ Table ('${TABLE_NAME}') 데이터 저장 실패 (SQL 마이크레이션 실행 필요): ${insertErr.message}`);
      } else {
        console.log(`   📝 Table ('${TABLE_NAME}') 레코드 삽입/업데이트 성공!`);
      }
    }
  }

  console.log("\n=========================================================");
  console.log(` 🎉 [업로드 완료] 총 ${totalUploaded}개의 고해상도 이미지 파일이 Supabase Storage에 동기화되었습니다!`);
  console.log("=========================================================");

  // 프론트엔드 연동용 마스터 모듈 생성 (src/assets/jobCharacterData.ts)
  const tsOutputPath = path.join(process.cwd(), "src/assets/jobCharacterData.ts");
  let tsContent = `/**\n * ReadyCareer AI — 24개 RIASEC 직업별 마스코트 캐릭터 레벨별 이미지 마스터 데이터\n * Supabase Storage ('character-assets') 실물 영문 ASCII 클린 매핑 완결판\n * 자동 생성일: ${new Date().toISOString()}\n */\n\n`;
  tsContent += `export interface JobCharacterLevel {\n  level: number;\n  name: string;\n  imageUrl: string;\n}\n\n`;
  tsContent += `export interface JobCharacterMaster {\n  jobName: string;\n  category: string;\n  riasecCode: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';\n  levels: JobCharacterLevel[];\n  defaultImageUrl: string;\n}\n\n`;
  tsContent += `export const JOB_CHARACTER_MASTER_LIST: JobCharacterMaster[] = ${JSON.stringify(finalRecords.map(r => ({
    jobName: r.job_name,
    category: r.riasec_category,
    riasecCode: r.riasec_code,
    defaultImageUrl: r.lv3_image_url || r.lv1_image_url,
    levels: [
      { level: 1, name: r.lv1_name, imageUrl: r.lv1_image_url },
      { level: 2, name: r.lv2_name, imageUrl: r.lv2_image_url },
      { level: 3, name: r.lv3_name, imageUrl: r.lv3_image_url },
      { level: 4, name: r.lv4_name, imageUrl: r.lv4_image_url },
      { level: 5, name: r.lv5_name, imageUrl: r.lv5_image_url },
    ]
  })), null, 2)};\n`;

  fs.writeFileSync(tsOutputPath, tsContent, "utf-8");
  console.log(`✨ 프론트엔드 연동용 마스터 데이터 생성 완료: src/assets/jobCharacterData.ts\n`);
}

main().catch(err => {
  console.error("❌ 스크립트 실행 중 치명적인 오류 발생:", err);
});
