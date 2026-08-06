const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const EXCEL_PATH = path.join(process.cwd(), "레디커리어 캐릭터 파일명 기록.xlsx");
const IMAGE_DIR = path.join(process.cwd(), "RIASEC 유형별 캐릭터 디자인-20260806T022036Z-1-001", "RIASEC 유형별 캐릭터 디자인");

console.log("==================================================");
console.log(" 📝 [1] 엑셀 파일 마스터 업데이트 시작");
console.log("==================================================");

const workbook = xlsx.readFile(EXCEL_PATH);
const sheetName = "Sheet1";
const sheet = workbook.Sheets[sheetName];
const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// 기존 행 추출 (빈 행 제외)
const validRows = rawData.filter(row => row && row[0] && String(row[0]).trim() !== '');

console.log(`✅ 현재 엑셀에 기재된 행 수: ${validRows.length - 1}개 직업 (헤더 제외)`);

// 기존 직업 이름 Set
const existingJobNames = new Set(validRows.slice(1).map(r => String(r[0]).trim().replace(/\s+/g, '')));

// 이미지 폴더 스캔하여 누락된 예술형(A) 및 사회형(S) 직업 발굴
const missingJobs = [];

const riasecMap = {
  "A_예술형": "예술형(A)",
  "I_탐구형": "탐구형(I)",
  "R_현실형": "현실형(R)",
  "S_사회형": "사회형(S)"
};

const riasecFolders = fs.readdirSync(IMAGE_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

riasecFolders.forEach(riasec => {
  const riasecPath = path.join(IMAGE_DIR, riasec);
  const jobs = fs.readdirSync(riasecPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  jobs.forEach(job => {
    const normJob = job.replace(/\s+/g, '');
    // 기존 엑셀에 있는지 비교 (정보보안전문가는 엑셀에 이미 존재하므로 통과)
    const isExisting = Array.from(existingJobNames).some(ex => normJob.includes(ex) || ex.includes(normJob));
    if (!isExisting) {
      const jobPath = path.join(riasecPath, job);
      const files = fs.readdirSync(jobPath)
        .filter(f => /^\.(png|jpg|jpeg|webp)$/i.test(path.extname(f)))
        .sort();
      
      // 파일 순서 정렬 (00 Lv.1, 01 Lv.2 등)
      missingJobs.push({
        jobName: job,
        category: riasecMap[riasec] || riasec,
        lv1: files[0] || "",
        lv2: files[1] || "",
        lv3: files[2] || "",
        lv4: files[3] || "",
        lv5: files[4] || ""
      });
    }
  });
});

console.log(`🔍 새롭게 추가할 폴더 캐릭터 직업 수: ${missingJobs.length}개`);
missingJobs.forEach((m, idx) => {
  console.log(`  + [${m.category}] ${m.jobName} -> Lv.1: ${m.lv1}, Lv.5: ${m.lv5}`);
});

if (missingJobs.length > 0) {
  missingJobs.forEach(m => {
    validRows.push([
      m.jobName,
      m.category,
      m.lv1,
      m.lv2,
      m.lv3,
      m.lv4,
      m.lv5
    ]);
  });

  const newSheet = xlsx.utils.aoa_to_sheet(validRows);
  // 열 너비 조정
  newSheet['!cols'] = [
    { wch: 22 }, // 직업명
    { wch: 15 }, // 유형
    { wch: 28 }, // Lv.1
    { wch: 28 }, // Lv.2
    { wch: 28 }, // Lv.3
    { wch: 28 }, // Lv.4
    { wch: 28 }  // Lv.5
  ];

  workbook.Sheets[sheetName] = newSheet;
  xlsx.writeFile(workbook, EXCEL_PATH);
  console.log(`\n🎉 [완료] '레디커리어 캐릭터 파일명 기록.xlsx' 파일에 총 ${validRows.length - 1}개 직업 전체가 성공적으로 추가 기입되었습니다!`);
} else {
  console.log(`\nℹ️ 이미 모든 직업이 엑셀에 기입되어 있습니다.`);
}
