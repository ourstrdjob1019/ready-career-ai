import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.resolve(__dirname, "../학교기본정보_2021년01월31일기준.csv");

if (!fs.existsSync(csvPath)) {
  console.error("원본 CSV 파일이 없습니다:", csvPath);
  process.exit(1);
}

const buffer = fs.readFileSync(csvPath);
let text = "";
try {
  text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
} catch (e) {
  text = new TextDecoder("euc-kr").decode(buffer);
}

const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);

// CSV 정밀 파서 (따옴표 내부 쉼표 보호)
function parseCSVLine(lineText) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < lineText.length; i++) {
    const c = lineText[i];
    if (c === '"') {
      if (inQuotes && lineText[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}

const header = parseCSVLine(lines[0]);
const codeIdx = header.indexOf("표준학교코드");
const nameIdx = header.indexOf("학교명");
const regionIdx = header.indexOf("소재지명");
const typeIdx = header.indexOf("학교종류명");

console.log(`컬럼 인덱스 확인 - 표준학교코드:${codeIdx}, 학교명:${nameIdx}, 소재지명:${regionIdx}, 학교종류명:${typeIdx}`);

if (codeIdx === -1 || nameIdx === -1 || regionIdx === -1 || typeIdx === -1) {
  console.error("필수 컬럼을 찾지 못했습니다.");
  process.exit(1);
}

const allSchools = [];
const highMidSchools = [];
const seenCodes = new Set();

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const code = cols[codeIdx];
  const name = cols[nameIdx];
  const region = cols[regionIdx];
  let level = cols[typeIdx];

  if (!code || !name) continue;

  // 중복 학교코드 배제 (unique 보강)
  if (seenCodes.has(code)) continue;
  seenCodes.add(code);

  // CSV 내부의 쉼표나 특수문자 탈출 보완
  const safeName = name.includes(",") ? `"${name}"` : name;
  const rowStr = `${code},${safeName},${region},${level}`;

  allSchools.push(rowStr);

  if (level.includes("중학교") || level.includes("고등학교") || name.includes("중학교") || name.includes("고등학교") || name.includes("과학고") || name.includes("외국어고") || name.includes("예술고") || name.includes("체육고")) {
    highMidSchools.push(rowStr);
  }
}

const outAllPath = path.resolve(__dirname, "../supabase_schools_전체학교_12500개.csv");
const outHighMidPath = path.resolve(__dirname, "../supabase_schools_중고등학교_핵심5600개.csv");

const csvHeader = "school_code,name,region,level\n";

fs.writeFileSync(outAllPath, "\uFEFF" + csvHeader + allSchools.join("\n"), "utf-8");
fs.writeFileSync(outHighMidPath, "\uFEFF" + csvHeader + highMidSchools.join("\n"), "utf-8");

console.log(`✅ [1] 전국의 전체 학교 CSV 생성 완료 (총 ${allSchools.length}개): ${outAllPath}`);
console.log(`✅ [2] 중학교 & 고등학교 핵심 대상 CSV 생성 완료 (총 ${highMidSchools.length}개): ${outHighMidPath}`);
