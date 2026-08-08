const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/04_VIA_성격강점_자기이해_36문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const strengthsMatch = htmlContent.match(/const STRENGTHS\s*=\s*(\[[\s\S]*?\]);const QUESTIONS/);
const questionsMatch = htmlContent.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);const VDESC/);
const vdescMatch = htmlContent.match(/const VDESC\s*=\s*(\{[\s\S]*?\});const VORDER/);
const vorderMatch = htmlContent.match(/const VORDER\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const VIA_STRENGTHS = ${strengthsMatch[1]};\n\n`;
output += `export const VIA_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const VIA_VDESC = ${vdescMatch[1]};\n\n`;
output += `export const VIA_VORDER = ${vorderMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/viaStrengthsData.ts'), output);
console.log('✅ viaStrengthsData.ts 생성 완료!');
