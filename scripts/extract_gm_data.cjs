const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/03_성장마인드셋_프로파일_32문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const questionsMatch = htmlContent.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
const domainsMatch = htmlContent.match(/const DOMAINS\s*=\s*(\{[\s\S]*?\});/);
const levelsMatch = htmlContent.match(/const LEVELS\s*=\s*(\[[\s\S]*?\]);/);
const orderMatch = htmlContent.match(/const ORDER\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const GM_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const GM_DOMAINS = ${domainsMatch[1]};\n\n`;
output += `export const GM_LEVELS = ${levelsMatch[1]};\n\n`;
output += `export const GM_ORDER = ${orderMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/growthMindsetData.ts'), output);
console.log('✅ growthMindsetData.ts 생성 완료!');
