"""Search index.html for stale public-facing text."""
with open('index.html', 'rb') as f:
    raw = f.read()
content = raw.decode('latin-1')

patterns = [
    '80 workflows', '90 workflows', '7+ specialties', '8 specialties',
    'business-system', 'debug', 'Library: checking', 'form coming soon',
    'informational only', 'as per clinician plan', 'clinician impression documented',
    'Denies no', 'diagnosis generator', 'treatment recommendation',
    'hospital approved', 'regulatory approved', 'TODO', 'placeholder', 'undefined', 'NaN'
]

print("=== Stale Text Search in index.html ===")
found_any = False
for p in patterns:
    if p.lower() in content.lower():
        idx = content.lower().find(p.lower())
        start = max(0, idx-40)
        end = min(len(content), idx+len(p)+40)
        ctx = content[start:end].replace('\n',' ').replace('\r','')
        # Determine if it's in user-facing text or in code
        is_in_code = any(tag in content[max(0,idx-200):idx+200] for tag in ['<script','<style','// ','/*','function'])
        location = "CODE (not user-facing)" if is_in_code else "PUBLIC-FACING"
        print(f"  [{location}] '{p}': ...{ctx}...")
        found_any = True

if not found_any:
    print("  None found - all clear!")
else:
    print("\n  Public-facing issues found above - need fixing")
