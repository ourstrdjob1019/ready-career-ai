const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '../src/assets/jobCharacterData.ts');
const tsContent = fs.readFileSync(tsFilePath, 'utf8');

// 정규식으로 JOB_CHARACTER_MASTER_LIST 배열 추출
const match = tsContent.match(/export const JOB_CHARACTER_MASTER_LIST: JobCharacterMaster\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error("배열을 찾을 수 없습니다.");
  process.exit(1);
}

const ranks = {
  1: '브론즈',
  2: '실버',
  3: '골드',
  4: '다이아',
  5: '마스터'
};

let dataArray;
try {
  dataArray = eval(match[1]);
} catch (e) {
  console.error("배열 파싱 에러:", e);
  process.exit(1);
}

let sql = `
-- 1. 기존 테이블이 존재하면 삭제하고 새로운 구조로 생성합니다.
DROP TABLE IF EXISTS job_character_assets;
CREATE TABLE job_character_assets (
  id SERIAL PRIMARY KEY,
  job_name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  riasec_code VARCHAR(10),
  level INT NOT NULL,
  title_name VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL
);

-- 2. 데이터 삽입
INSERT INTO job_character_assets (job_name, category, riasec_code, level, title_name, image_url) VALUES
`;

const sqlValues = [];

dataArray.forEach(item => {
  // 1. (아리), (토리) 및 모든 공백 제거
  const cleanJobName = item.jobName.replace(/\s*\(.*\)/g, '').replace(/\s+/g, '');
  item.jobName = cleanJobName; // TS 파일에도 덮어쓰기 위해 반영

  item.levels.forEach(levelObj => {
    const rankTitle = ranks[levelObj.level];
    const finalTitle = `${rankTitle}${cleanJobName}`;
    
    // TS 파일 데이터도 [등급][직업명]으로 완전 통일
    levelObj.name = finalTitle;

    sqlValues.push(`('${cleanJobName}', '${item.category}', '${item.riasecCode}', ${levelObj.level}, '${finalTitle}', '${levelObj.imageUrl}')`);
  });
});

sql += sqlValues.join(',\n') + ';\n';
fs.writeFileSync(path.join(__dirname, '../reset_characters_final.sql'), sql);
console.log('✅ reset_characters_final.sql 파일이 성공적으로 생성되었습니다!');

// 이제 ts 파일도 깨끗한 데이터로 다시 쓰기
const newDataString = JSON.stringify(dataArray, null, 2);
const newTsContent = tsContent.replace(match[1], newDataString);
fs.writeFileSync(tsFilePath, newTsContent, 'utf8');
console.log('✅ jobCharacterData.ts 내부의 (아리)/(토리) 문구가 완전 제거되고 칭호가 통일되었습니다!');
