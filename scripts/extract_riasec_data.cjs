const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/01_RIASEC_진로흥미검사_30문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const typesMatch = htmlContent.match(/const TYPES = (\{[\s\S]*?\});/);
const questionsMatch = htmlContent.match(/const QUESTIONS = (\[[\s\S]*?\]);/);
const profilesMatch = htmlContent.match(/const PROFILES = (\{[\s\S]*?\});/);

let output = `export const RIASEC_TYPES = ${typesMatch[1]};\n\n`;
output += `export const RIASEC_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const RIASEC_PROFILES = ${profilesMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/riasecData.ts'), output);
console.log('✅ riasecData.ts 생성 완료!');
