"""Comprehensive stale text search across all public files."""
import glob, re

patterns = [
    '80 workflows', '90 workflows', '7+ specialties', '8 specialties',
    'business-system', 'form coming soon', 'informational only',
    'negative-fix', 'undefined', 'NaN', 'TODO',
    'as per clinician plan', 'clinician impression documented',
    'no login', 'no audio', 'no patient data',
    'clinician review required', '150 workflows', '15 specialties'
]

files = glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.md')
files = [f for f in files if not f.startswith('_') 
         and f != 'GENERATED_CLINICAL_DATA.js'
         and f != 'package.json'
         and f != 'package-lock.json']

print("=== Stale text search ===")
found_any = False
for fn in sorted(files):
    try:
        with open(fn, 'rb') as f:
            raw = f.read()
        # Try utf-8 first, then latin-1
        try:
            content = raw.decode('utf-8')
        except:
            content = raw.decode('latin-1')
    except:
        continue
    
    for p in patterns:
        idx = content.lower().find(p.lower())
        if idx >= 0:
            start = max(0, idx - 40)
            end = min(len(content), idx + len(p) + 40)
            ctx = content[start:end].replace('\n',' ').replace('\r','')
            # Filter out internal/internal-only files
            if 'CLEAN_URL_CACHE' in fn or fn.startswith('V5'):
                continue  # Skip internal reports
            print(f"{fn}: '{p}' -> ...{ctx}...")
            found_any = True

if not found_any:
    print("No stale public-facing text found. Content is current.")
else:
    print("\nFound stale text in public files - needs cleanup")
