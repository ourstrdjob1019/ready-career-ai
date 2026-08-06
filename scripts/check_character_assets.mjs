import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const EXCEL_PATH = path.join(process.cwd(), "레디커리어 캐릭터 파일명 기록.xlsx");
const IMAGE_DIR = path.join(process.cwd(), "RIASEC 유형별 캐릭터 디자인-20260806T022036Z-1-001", "RIASEC 유형별 캐릭터 디자인");

console.log("==================================================");
console.log(" 📊 [1] 엑셀 파일 분석 (레디커리어 캐릭터 파일명 기록.xlsx)");
console.log("==================================================");

if (!fs.existsSync(EXCEL_PATH)) {
  console.error("❌ 엑셀 파일을 찾을 수 없습니다:", EXCEL_PATH);
  process.exit(1);
}

const workbook = xlsx.readFile(EXCEL_PATH);
const sheetNames = workbook.SheetNames;
console.log(`📑 발견된 시트 목록: ${JSON.stringify(sheetNames, null, 2)}`);

const excelRecords = [];

sheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  const validRows = rawData.filter(row => {
    return Object.values(row).some(val => String(val).trim() !== "");
  });

  console.log(`\n▶ 시트 [${sheetName}] - 총 유효 데이터 행 수: ${validRows.length}개`);
  if (validRows.length > 0) {
    console.log(`   컬럼 구조: ${Object.keys(validRows[0]).join(", ")}`);
    console.log(`   샘플 3개 행:`, JSON.stringify(validRows.slice(0, 3), null, 2));
    excelRecords.push(...validRows);
  }
});

console.log("\n==================================================");
console.log(" 🖼️ [2] 직업 캐릭터 이미지 폴더 구조 및 정합성 검증");
console.log("==================================================");

if (!fs.existsSync(IMAGE_DIR)) {
  console.error("❌ 이미지 폴더를 찾을 수 없습니다:", IMAGE_DIR);
  process.exit(1);
}

const riasecFolders = fs.readdirSync(IMAGE_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`📁 RIASEC 유형 상위 폴더 (총 ${riasecFolders.length}개): ${riasecFolders.join(", ")}`);

const jobFolders = [];
const allFiles = [];
const nonImageFiles = [];
const irregularities = [];

riasecFolders.forEach(riasec => {
  const riasecPath = path.join(IMAGE_DIR, riasec);
  const jobs = fs.readdirSync(riasecPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  jobs.forEach(job => {
    jobFolders.push({ riasec, job });
    const jobPath = path.join(riasecPath, job);
    const files = fs.readdirSync(jobPath);
    
    files.forEach(f => {
      const ext = path.extname(f).toLowerCase();
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp' && ext !== '.svg') {
        nonImageFiles.push({ riasec, job, fileName: f });
      } else {
        allFiles.push({ riasec, job, fileName: f, fullPath: path.join(jobPath, f) });
      }
    });

    // 레벨 개수 검사 (기본 5개 기대)
    const imgFiles = files.filter(f => /^\.(png|jpg|jpeg|webp)$/i.test(path.extname(f)));
    if (imgFiles.length !== 5) {
      irregularities.push(`[${riasec}/${job}] 이미지 개수 불일치: ${imgFiles.length}개 (5개 기대) - 파일들: ${imgFiles.join(", ")}`);
    } else {
      // 번호 중복이나 순서 체크
      const sorted = [...imgFiles].sort();
      // 특이점(예: 4가 두 번 들어간 경우 등) 감지
      const numbers = imgFiles.map(f => f.match(/\d+/)?.[0] || "");
      if (new Set(numbers).size !== imgFiles.length && !imgFiles.every(f => f.includes("Lv"))) {
        irregularities.push(`[${riasec}/${job}] 번호 네이밍 의심 (중복 숫자 등): ${imgFiles.join(", ")}`);
      }
    }
  });
});

console.log(`\n✅ 발견된 총 직업 폴더 수: ${jobFolders.length}개`);
console.log(`✅ 발견된 총 이미지 파일 수: ${allFiles.length}개`);

if (nonImageFiles.length > 0) {
  console.warn(`\n⚠️ [주의] 이미지 외 불필요/압축 파일 (업로드 시 제외 권장):`);
  nonImageFiles.forEach(item => console.warn(`   - [${item.riasec}/${item.job}] ${item.fileName}`));
} else {
  console.log(`\n✨ 이미지 외 불필요한 이물질 파일 없음 (깨끗함)`);
}

if (irregularities.length > 0) {
  console.warn(`\n⚠️ [주의] 이미지 파일 개수 및 네이밍 불일치/특이 사항:`);
  irregularities.forEach(irr => console.warn(`   - ${irr}`));
} else {
  console.log(`\n✨ 모든 직업 폴더가 정확히 5개의 레벨별 이미지 파일로 구성됨!`);
}

console.log("\n==================================================");
console.log(" 📋 [3] Supabase Storage 및 Table 업로드 준비도 평가");
console.log("==================================================");
console.log(" - Supabase Storage 업로드: 한글 파일명 및 띄어쓰기가 있으므로 Storage Key(경로) 구성 시 URL 인코딩 또는 영문/ID 키 매핑 검토 필요");
console.log(" - Table 삽입: 엑셀 데이터와 스캔된 이미지 간 자동 일대일 매칭 스크립트 작성 가능");
console.log("==================================================\n");
