"""Verify UI specialty updates."""
import re
with open('index.html', 'rb') as f:
    html = f.read().decode('latin-1')

# Check dropdown
m = re.search(r'<select id="specialty"[^>]*>.*?</select>', html, re.DOTALL)
if m:
    opts = re.findall(r'<option value="[^"]+">[^<]+</option>', m.group())
    print(f"Dropdown options ({len(opts)}):")
    for o in opts:
        print(f"  {o}")

# Check map
idx = html.find('var map=')
if idx >= 0:
    end = html.find('};', idx)
    print(f"\nSD map:")
    print(html[idx:end+2])

# Count all specialty option values in the dropdown
all_opts = re.findall(r'value="([^"]+)"', m.group()) if m else []
print(f"\nTotal options in dropdown: {len(all_opts)}")
