const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('레디커리어 캐릭터 파일명 기록.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const ranks = {
  1: '브론즈',
  2: '실버',
  3: '골드',
  4: '다이아',
  5: '마스터'
};

let sql = `
-- 1. 기존 테이블이 존재하면 삭제하고 새롭게 완벽한 구조로 생성합니다.
DROP TABLE IF EXISTS job_character_assets;
CREATE TABLE job_character_assets (
  id SERIAL PRIMARY KEY,
  job_name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  title_name VARCHAR(100) NOT NULL
);

-- 2. 깨끗하게 정제된 데이터 삽입
INSERT INTO job_character_assets (job_name, category, level, title_name) VALUES
`;

const values = [];

data.forEach(row => {
  if (!row || row.length < 2) return;
  const rawJobName = row[0];
  const category = row[1];
  
  // 만약 헤더행이라면 패스
  if (rawJobName.includes('직업명') || category.includes('카테고리')) return;

  // (아리), (토리) 및 띄어쓰기 제거하여 순수 직업명만 추출
  const cleanJobName = rawJobName.replace(/\s*\(.*\)/g, '').replace(/\s+/g, '');

  for (let level = 1; level <= 5; level++) {
    const rankTitle = ranks[level];
    const finalTitle = `${rankTitle}${cleanJobName}`;
    values.push(`('${cleanJobName}', '${category}', ${level}, '${finalTitle}')`);
  }
});

sql += values.join(',\n') + ';\n';

fs.writeFileSync('reset_characters.sql', sql);
console.log('Successfully generated reset_characters.sql');
