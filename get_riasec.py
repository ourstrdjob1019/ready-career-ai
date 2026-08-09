import glob
import re

files = glob.glob('진단검사 8종/01*.html')
if not files:
    print('No file')
    exit()
with open(files[0], 'r', encoding='utf-8') as f:
    c = f.read()
qs = re.findall(r'<div class="question-text">([^<]+)</div>', c)
for i, q in enumerate(qs):
    print(f"{i+1}. {q.strip()}")
