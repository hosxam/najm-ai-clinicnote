"""Search for stale public-facing numbers in index.html."""
import re, os

with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# Search patterns
patterns = [
    (r'\b80\s*(?:workflows?|workflows?|specialt)', 'stale 80 count'),
    (r'\b90\s*(?:workflows?|workflows?|specialt)', 'stale 90 count'),
    (r'7\+\s*specialt', 'stale 7+ specialties'),
    (r'\b8\s*(?:specialt)', 'stale 8 specialties'),
    (r'\b80\s*\+', 'stale 80+'),
    (r'\b90\s*\+', 'stale 90+'),
    (r'\b80\s*[,\.]', 'stale 80 in text'),
    (r'150\s*(?:workflows?|specialt)', 'current 150 count'),
    (r'14\s*specialt', 'stale 14 specialties'),
]

print("=== Searching for stale counts ===")
for pattern, label in patterns:
    matches = re.findall(pattern, html, re.IGNORECASE)
    for m in matches[:5]:
        # Find surrounding context
        idx = html.find(m)
        start = max(0, idx - 30)
        end = min(len(html), idx + len(m) + 30)
        context = html[start:end].replace('\n', ' ').replace('\r', '')
        print(f"  [{label}] '{m}' -> ...{context}...")

# Also search for other stale phrases
phrases = ['business-system', 'debug', 'Library: checking', 'old generation', 'beta 1']
for phrase in phrases:
    if phrase in html.lower() or phrase in html:
        idx = html.lower().find(phrase.lower())
        start = max(0, idx - 40)
        end = min(len(html), idx + len(phrase) + 40)
        context = html[start:end].replace('\n', ' ').replace('\r', '')
        print(f"  [stale phrase '{phrase}'] ...{context}...")
