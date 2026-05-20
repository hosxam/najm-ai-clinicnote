"""Update homepage for Advanced Mode as primary experience."""
with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# 1. Update subtitle
old_sub = '''Create structured OPD notes, SOAP notes, referrals, patient instructions, and medical report drafts from doctor-entered de-identified clinical details. No login, no audio, no patient data storage.'''
new_sub = '''Advanced Encounter Builder with 150 workflows across 15 specialties. Structured OPD notes, referrals, patient instructions, and medical report drafts. No login. No audio. No storage. Clinician review required.'''
html = html.replace(old_sub, new_sub)

# 2. Add Advanced Mode CTA to nav - find "Try OPD Note Builder" and add Advanced Mode next to it
old_nav = '''<a href="#" onclick="showPage('speed')">Try OPD Note Builder</a>'''
new_nav = '''<a href="#" onclick="showPage('speed')">Quick OPD Mode</a>
          <a href="./?v4=encounter2" target="_blank">Advanced Mode</a>'''
html = html.replace(old_nav, new_nav)

# 3. Add Advanced Mode to hero section
old_hero_cta = '''<button class="btn btn-primary" onclick="showPage('report')">Open Medical Report Draft</button>'''
new_hero_cta = '''<button class="btn btn-primary" onclick="window.location.href='./?v4=encounter2'">Start Advanced Mode</button>
          <button class="btn btn-outline" onclick="showPage('report')">Open Medical Report Draft</button>'''
html = html.replace(old_hero_cta, new_hero_cta)

# 4. Add Advanced Mode card to the card grid
# Find the presetsContent div  
old_card = '''<div class="card-grid" id="homePresets">'''
new_card = '''<div class="card" onclick="window.location.href='./?v4=encounter2'" style="cursor:pointer;border:2px solid var(--primary);">
        <h3>Advanced Mode</h3>
        <p style="font-size:12px">Full Step 1-6 encounter builder with history, exam, investigations, plan assist, and calculator suggestions. 150 workflows across 15 specialties.</p>
      </div>
      <div class="card-grid" id="homePresets">'''
html = html.replace(old_card, new_card)

# 5. Add deployment marker
html = html.replace('<!-- deploy-current-version-v5d -->', '<!-- deploy-current-version-v5d -->\n<!-- main-site-advanced-mode-150-workflows -->')

# 6. Update hero stats to reflect 150 workflows
old_stats = '''<div class="hero-stats">'''
# Check if there's a stats section
idx = html.find('hero-stats')
if idx >= 0:
    # Update the stats content
    old_stats_content = html[idx:idx+400]
    # Check what's in there
    print(f"Stats section: {old_stats_content[:200]}")

# 7. Check for stale text  
import re
stale = ['80 workflows', '90 workflows', '7+ specialties', '8 specialties', 
         'V4', 'encounter2', 'prototype', 'internal', 'business-system',
         'Library: checking', 'Data:', 'JS:', 'debug']
for s in stale:
    if s in html:
        # Check if it's in a public-facing area (not in script/code)
        pos = html.find(s)
        # Look at surrounding context
        start = max(0, pos-50)
        end = min(len(html), pos+len(s)+50)
        ctx = html[start:end].replace('\n',' ').replace('\r','')
        print(f"  FOUND '{s}' in HTML: ...{ctx}...")

with open('index.html', 'w', encoding='latin-1') as f:
    f.write(html)
print("\nWritten")
