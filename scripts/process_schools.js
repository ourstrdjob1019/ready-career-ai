import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.resolve(__dirname, "../학교기본정보_2021년01월31일기준.csv");

if (!fs.existsSync(csvPath)) {
  console.error("파일을 찾을 수 없습니다:", csvPath);
  process.exit(1);
}

const buffer = fs.readFileSync(csvPath);
let text = "";
try {
  text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  console.log("Encoding: UTF-8 detected.");
} catch (e) {
  try {
    text = new TextDecoder("euc-kr").decode(buffer);
    console.log("Encoding: EUC-KR (CP949) detected.");
  } catch (e2) {
    text = buffer.toString("utf-8");
    console.log("Fallback to basic UTF-8 string.");
  }
}

const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
console.log(`총 ${lines.length}개의 행을 발견했습니다.`);
if (lines.length > 0) {
  console.log("--- CSV 헤더(첫 번째 행) ---");
  console.log(lines[0]);
}
if (lines.length > 1) {
  console.log("--- 첫 번째 데이터 행 ---");
  console.log(lines[1]);
}
