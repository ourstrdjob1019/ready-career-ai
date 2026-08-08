const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/06_AI디지털리터러시_30문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const questionsMatch = htmlContent.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
const domainsMatch = htmlContent.match(/const DOMAINS\s*=\s*(\{[\s\S]*?\});/);
const pairsMatch = htmlContent.match(/const PAIRS\s*=\s*(\{[\s\S]*?\});/);
const orderMatch = htmlContent.match(/const ORDER\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const AI_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const AI_DOMAINS = ${domainsMatch[1]};\n\n`;
output += `export const AI_PAIRS = ${pairsMatch[1]};\n\n`;
output += `export const AI_ORDER = ${orderMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/aiLiteracyData.ts'), output);
console.log('✅ aiLiteracyData.ts 생성 완료!');
