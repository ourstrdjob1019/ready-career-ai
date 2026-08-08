const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/02_다중지능_강점프로파일_32문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const typesMatch = htmlContent.match(/const TYPES = (\{[\s\S]*?\});/);
const questionsMatch = htmlContent.match(/const QUESTIONS = (\[[\s\S]*?\]);/);
const combosMatch = htmlContent.match(/const COMBOS = (\{[\s\S]*?\});/);
const orderMatch = htmlContent.match(/const ORDER\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const MI_TYPES = ${typesMatch[1]};\n\n`;
output += `export const MI_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const MI_COMBOS = ${combosMatch[1]};\n\n`;
output += `export const MI_ORDER = ${orderMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/multipleIntelligencesData.ts'), output);
console.log('✅ multipleIntelligencesData.ts 생성 완료!');
