const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/05_시간관리_역량프로파일_32문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const domainsMatch = htmlContent.match(/const DOMAINS\s*=\s*(\{[\s\S]*?\});const QUESTIONS/);
const questionsMatch = htmlContent.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);const LEVELS/);
const levelsMatch = htmlContent.match(/const LEVELS\s*=\s*(\[[\s\S]*?\]);const ORDER/);
const orderMatch = htmlContent.match(/const ORDER\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const TM_DOMAINS = ${domainsMatch[1]};\n\n`;
output += `export const TM_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const TM_LEVELS = ${levelsMatch[1]};\n\n`;
output += `export const TM_ORDER = ${orderMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/timeManagementData.ts'), output);
console.log('✅ timeManagementData.ts 생성 완료!');
