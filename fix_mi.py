import re

with open('src/data/multipleIntelligencesData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "q:'" in line:
        # We need to change the outer quotes of q:'...' to double quotes q:"..."
        # Example line: {t:'LIN',q:'유튜브 영상이나 릴스를 보고 나서 '아, 이거 이런 내용이네' 하고 한 줄 요약을 잘해.'} ,
        # Find the index of "q:'"
        idx1 = line.find("q:'")
        if idx1 != -1:
            # Find the last single quote before the closing brace
            idx2 = line.rfind("'}")
            if idx2 != -1:
                # Replace the outer quotes
                new_line = line[:idx1] + 'q:"' + line[idx1+3:idx2] + '"}' + line[idx2+2:]
                new_lines.append(new_line)
                continue
    new_lines.append(line)

with open('src/data/multipleIntelligencesData.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed syntax in multipleIntelligencesData.ts")
