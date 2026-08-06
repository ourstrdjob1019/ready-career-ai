const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const EXCEL_PATH = path.join(process.cwd(), "레디커리어 캐릭터 파일명 기록.xlsx");
const IMAGE_DIR = path.join(process.cwd(), "RIASEC 유형별 캐릭터 디자인-20260806T022036Z-1-001", "RIASEC 유형별 캐릭터 디자인");

const workbook = xlsx.readFile(EXCEL_PATH);
const sheet = workbook.Sheets["Sheet1"];
const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// 첫 번째 행은 타이틀 또는 헤더
const excelJobs = [];
rawData.forEach((row, idx) => {
  if (idx === 0 || !row[0] || row[0] === '직업명') return;
  excelJobs.push({
    jobName: String(row[0]).trim(),
    category: String(row[1] || '').trim(),
    lv1: String(row[2] || '').trim(),
    lv2: String(row[3] || '').trim(),
    lv3: String(row[4] || '').trim(),
    lv4: String(row[5] || '').trim(),
    lv5: String(row[6] || '').trim(),
  });
});

console.log(`\n📌 엑셀 파일에 명시된 직업 명단 (총 ${excelJobs.length}개):`);
excelJobs.forEach((item, idx) => {
  console.log(`  ${idx + 1}. [${item.category}] ${item.jobName} (예: Lv.1 -> ${item.lv1})`);
});

const riasecFolders = fs.readdirSync(IMAGE_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const folderJobs = [];
riasecFolders.forEach(riasec => {
  const riasecPath = path.join(IMAGE_DIR, riasec);
  const jobs = fs.readdirSync(riasecPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  jobs.forEach(job => {
    folderJobs.push({ riasec, job });
  });
});

console.log(`\n📌 실제 이미지 폴더 명단 (총 ${folderJobs.length}개):`);
folderJobs.forEach((item, idx) => {
  console.log(`  ${idx + 1}. [${item.riasec}] ${item.job}`);
});

// 대조 분석
const excelJobNames = excelJobs.map(e => e.jobName.replace(/\s+/g, '').replace(/\(.*\)/g, ''));
const folderJobNames = folderJobs.map(f => f.job.replace(/\s+/g, '').replace(/\(.*\)/g, ''));

const inFolderNotExcel = folderJobs.filter(f => !excelJobs.some(e => {
  const normE = e.jobName.replace(/\s+/g, '').replace(/\(.*\)/g, '');
  const normF = f.job.replace(/\s+/g, '').replace(/\(.*\)/g, '');
  return normF.includes(normE) || normE.includes(normF) || (normF === '졍보보안전문가' && normE === '정보보안전문가');
}));

console.log(`\n⚠️ [차이점 감지] 폴더에는 존재하지만 엑셀 명단에 명시되지 않은 직업 폴더 (총 ${inFolderNotExcel.length}개):`);
inFolderNotExcel.forEach(item => {
  console.log(`   - [${item.riasec}] ${item.job}`);
});

console.log(`\n💡 결론: 엑셀 파일과 폴더 간 차이 및 일부 파일 네이밍 오류를 보정한 자동화 업로드 스크립트 제작이 필요합니다.\n`);
