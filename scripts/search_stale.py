"""Search all public files for stale numbers."""
import glob

patterns = ['80 workflows','90 workflows','7+ specialties','8 specialties','80+','90+','80 clinical','90 clinical']
stale_phrases = ['business-system','Library: checking','old generation']

files = glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.md')
# Exclude internal files
files = [f for f in files if not f.startswith('_') and f != 'GENERATED_CLINICAL_DATA.js']

found_any = False
for fn in sorted(files):
    try:
        with open(fn, 'rb') as f:
            content = f.read().decode('latin-1')
    except:
        continue
    
    for p in patterns + stale_phrases:
        if p.lower() in content.lower():
            idx = content.lower().find(p.lower())
            start = max(0, idx-60)
            end = min(len(content), idx+len(p)+60)
            ctx = content[start:end].replace('\n',' ').replace('\r','')
            print(f'{fn}: \"{p}\" -> ...{ctx}...')
            found_any = True

if not found_any:
    print("No stale public-facing numbers found. Content is current.")
else:
    print("\nStale content found above.")
