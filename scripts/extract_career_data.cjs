const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, '../진단검사 8종/08_진로성숙도_프로파일_32문항.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const domainsMatch = htmlContent.match(/const DOMAINS\s*=\s*(\{[\s\S]*?\});const QUESTIONS/);
const questionsMatch = htmlContent.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);const LEVELS/);
const levelsMatch = htmlContent.match(/const LEVELS\s*=\s*(\[[\s\S]*?\]);const ORDER/);
const orderMatch = htmlContent.match(/const ORDER\s*=\s*(\[[\s\S]*?\]);const GROUPS/);
const groupsMatch = htmlContent.match(/const GROUPS\s*=\s*(\[[\s\S]*?\]);/);

let output = `export const CAREER_DOMAINS = ${domainsMatch[1]};\n\n`;
output += `export const CAREER_QUESTIONS = ${questionsMatch[1]};\n\n`;
output += `export const CAREER_LEVELS = ${levelsMatch[1]};\n\n`;
output += `export const CAREER_ORDER = ${orderMatch[1]};\n\n`;
output += `export const CAREER_GROUPS = ${groupsMatch[1]};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/careerMaturityData.ts'), output);
console.log('✅ careerMaturityData.ts 생성 완료!');
