"""Check index.html for stale text."""
import re

with open('index.html', 'rb') as f:
    content = f.read().decode('latin-1')

patterns = ['80 workflows','90 workflows','7+ specialties','8 specialties',
            '80+','90+','business-system','negative-fix','TODO','NaN',
            'undefined','placeholder']

for p in patterns:
    if p.lower() in content.lower():
        idx = content.lower().find(p.lower())
        start = max(0, idx-60)
        end = min(len(content), idx+len(p)+60)
        ctx = content[start:end].replace('\n',' ').replace('\r','')
        print(f"'{p}' found in index.html: ...{ctx}...")

# Check version label
m = re.search(r'Version[^<"]*', content)
if m:
    print(f"Version label: {m.group()}")

# Check for stale workflow/specialty counts
for count in ['80 ','90 ','100 ','120 ','140 ']:
    if count + 'workflow' in content.lower():
        print(f"Stale workflow count: '{count}'")

# Check current wording
for phrase in ['150 workflows', '15 specialties', 'no login', 'no audio', 'no patient data']:
    if phrase in content.lower():
        # Show context
        idx = content.lower().find(phrase)
        start = max(0, idx-40)
        end = min(len(content), idx+len(phrase)+40)
        ctx = content[start:end].replace('\n',' ').replace('\r','')
        print(f"Good: '{phrase}' -> ...{ctx}...")
    else:
        print(f"Missing: '{phrase}' not in index.html")
