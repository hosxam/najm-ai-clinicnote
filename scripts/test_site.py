"""Test site search."""
import urllib.request

r = urllib.request.urlopen('http://localhost:8000/')
html = r.read().decode()
print(f"Page: {len(html)} bytes")
print(f"Has chipsByWorkflow: {'chipsByWorkflow' in html}")
print(f"Has neuro-headache: {'neuro-headache' in html}")
print(f"Has GENERATED_CLINICAL_DATA: {'GENERATED_CLINICAL_DATA' in html}")

# Check for safe wording in neuro chips
unsafe_words = [
    'must prescribe', 'must refer', 'CT required', 'MRI required',
    'thrombolysis', 'stroke pathway', 'admit to', 'call ambulance',
    'send to ER', 'do not discharge', 'urgent referral'
]
found_unsafe = []
for word in unsafe_words:
    if word in html.lower():
        found_unsafe.append(word)

if found_unsafe:
    print(f"UNSAFE TEXT FOUND: {found_unsafe}")
else:
    print(f"Safe: no unsafe management wording detected")
