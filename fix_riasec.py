import re

with open('src/data/riasecData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "q:'" in line:
        idx1 = line.find("q:'")
        if idx1 != -1:
            idx2 = line.rfind("'}")
            if idx2 != -1:
                new_line = line[:idx1] + 'q:"' + line[idx1+3:idx2] + '"}' + line[idx2+2:]
                new_lines.append(new_line)
                continue
    new_lines.append(line)

with open('src/data/riasecData.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed syntax in riasecData.ts")
