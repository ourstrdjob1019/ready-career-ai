const fs = require('fs');
const path = require('path');
const https = require('https');

const inputFile = 'C:/Users/nice2/.gemini/antigravity-ide/brain/873476f7-f8cd-496b-95d8-5714fe250a82/.system_generated/steps/590/output.txt';
const outputDir = path.join(__dirname, '../stitch_screens');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const screens = data.screens || [];

console.log(`Found ${screens.length} screens in Stitch project.`);

async function fetchUrl(url) {
  if (url.startsWith('data:text/html;base64,')) {
    const base64Str = url.replace('data:text/html;base64,', '');
    return Buffer.from(base64Str, 'base64').toString('utf-8');
  }
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

(async () => {
  for (const screen of screens) {
    let title = screen.title || screen.name.split('/').pop();
    title = title.replace(/[\\/:*?"<>|]/g, '_').trim();
    if (!screen.htmlCode || !screen.htmlCode.downloadUrl) {
      console.log(`Skipping ${title} - No HTML URL`);
      continue;
    }
    console.log(`Downloading HTML for: ${title} (id: ${screen.name.split('/').pop()})...`);
    try {
      const html = await fetchUrl(screen.htmlCode.downloadUrl);
      const filePath = path.join(outputDir, `${title}.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      console.log(`Saved -> ${filePath} (${html.length} bytes)`);
    } catch (err) {
      console.error(`Error fetching ${title}:`, err.message);
    }
  }
  console.log('All screens extracted successfully!');
})();
