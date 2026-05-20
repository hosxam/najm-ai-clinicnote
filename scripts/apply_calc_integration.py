"""Apply calculator integration replacements to v4_advanced_encounter.js."""
import re

with open('v4_advanced_encounter.js', 'r', encoding='latin-1') as f:
    js = f.read()

with open('scripts/gen_calc_integration.py', 'r', encoding='utf-8') as f:
    gen = f.read()

# Extract stepCalc
m = re.search(r"replacements\['stepCalc'\] = '''(.*?)'''", gen, re.DOTALL)
if m:
    new_stepCalc = m.group(1).strip()
    
    # Find old stepCalc by position
    idx = js.find('function stepCalc()')
    if idx >= 0:
        end = js.find('\n  function', idx + 20)
        if end < 0:
            end = js.find('\n  //', idx + 20)
        old = js[idx:end].rstrip()
        print(f"Found stepCalc: {len(old)} chars at {idx}")
        js = js[:idx] + new_stepCalc + js[end:]
        print("stepCalc replaced")
    else:
        print("stepCalc not found")

# Extract getRelatedCalcs
m2 = re.search(r"replacements\['getRelatedCalcs'\] = '''(.*?)'''", gen, re.DOTALL)
if m2:
    new_grc = m2.group(1).strip()
    idx2 = js.find('function getRelatedCalcs(')
    if idx2 >= 0:
        # Find end - look for next function or section comment
        search_from = idx2 + 20
        end2_candidates = [
            js.find('\n  function', search_from),
            js.find('\n  // ===', search_from),
            js.find('\n  // ---', search_from),
        ]
        end2 = min([x for x in end2_candidates if x > 0])
        old2 = js[idx2:end2].rstrip()
        print(f"Found getRelatedCalcs: {len(old2)} chars at {idx2}")
        js = js[:idx2] + new_grc + js[end2:]
        print("getRelatedCalcs replaced")
    else:
        print("getRelatedCalcs not found")

# Add CSS for calculator cards if not present
if 'v4-calc-card' not in js:
    css_insert = '''
  <style>
  .v4-calc-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px; }
  .v4-calc-card { background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px; }
  .v4-calc-name { font-size:14px;font-weight:600;margin:0 0 4px; }
  .v4-calc-desc { font-size:11px;color:var(--gray-500);margin:0 0 10px; }
  .v4-calc-input-row { display:flex;align-items:center;margin-bottom:6px; }
  .v4-calc-input-row label { font-size:12px;min-width:100px; }
  .v4-calc-result { background:var(--bg-highlight);padding:8px;border-radius:4px;margin:8px 0;font-size:12px; }
  .v4-btn-sm { padding:4px 10px;font-size:11px; }
  </style>
'''
    # Insert before first function or at end of head
    head_end = js.find('</head>')
    if head_end > 0:
        js = js[:head_end] + css_insert + js[head_end:]
        print("CSS added")
    else:
        print("Could not add CSS - no </head> found")

with open('v4_advanced_encounter.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Written successfully")
