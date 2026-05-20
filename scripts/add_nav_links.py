"""Add nav links and fix remaining stale text."""
with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# Add Calculator Tools to nav
idx = html.find('</nav>')
if idx > 0:
    link = '<a href="./?calc=v1" target="_blank">Calculator Tools</a>\n        '
    html = html[:idx] + link + html[idx:]
    print("Added Calculator Tools nav link")

# Check for remaining stale text
for term in ['V4 Encounter', 'encounter2 prototype', 'Internal prototype', 'V4 Encounter Builder']:
    if term in html:
        print(f"STALE: {term}")
    else:
        print(f"Clean: {term}")

with open('index.html', 'w', encoding='latin-1') as f:
    f.write(html)
print("Done")
