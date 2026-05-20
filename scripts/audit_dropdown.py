"""Audit and update specialty dropdown in index.html."""
import re

with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# Find all select elements for specialty
# Looking for: <select id="specialty" ...>
pattern = r'<select[^>]*id="specialty"[^>]*>.*?</select>'
matches = re.findall(pattern, html, re.DOTALL)

print(f"Found {len(matches)} specialty select elements")
for i, m in enumerate(matches):
    print(f"\nSelect {i}:")
    print(m[:500])

# Also check for the speed specialty select
pattern2 = r'<select[^>]*id="speedSpecialty"[^>]*>.*?</select>'
matches2 = re.findall(pattern2, html, re.DOTALL)
print(f"\nFound {len(matches2)} speedSpecialty select elements")
for i, m in enumerate(matches2):
    print(f"\nSpeed select {i}:")
    print(m[:500])
