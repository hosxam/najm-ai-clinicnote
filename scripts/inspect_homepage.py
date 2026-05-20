"""Find key sections in index.html for homepage update."""
with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

import re

# Find hero section
idx = html.find('Free SOAP')
if idx < 0:
    idx = html.find('SOAP Note')
if idx < 0:
    idx = html.find('structured')
print(f"Hero search: found at {idx}")
if idx > 0:
    print(html[idx-50:idx+300])

print("\n---")

# Find CTAs
for cta in ['Start', 'Begin', 'Launch', 'Open', 'Try', 'Get started']:
    idx = html.find(cta)
    if idx >= 0:
        ctx = html[max(0,idx-30):idx+80].replace('\n',' ').replace('\r','')
        print(f"CTA '{cta}': ...{ctx}...")

print("\n---")

# Find nav links
nav_start = html.find('<nav')
if nav_start >= 0:
    nav_end = html.find('</nav>', nav_start) + 6
    nav = html[nav_start:nav_end]
    # Extract links
    links = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>', nav)
    for href, text in links:
        print(f"  Nav: {text.strip()} -> {href}")

print("\n---")

# Find card grid / homePresets
card_idx = html.find('homePresets')
if card_idx >= 0:
    card_end = html.find('</div>', card_idx)
    section = html[card_idx:card_end+6]
    cards = re.findall(r'<div class="card"[^>]*>.*?</div>', section, re.DOTALL)
    for i, card in enumerate(cards):
        # Extract onclick
        onclick = re.search(r'onclick="([^"]*)"', card)
        text_content = card.replace('<',' <').replace('>','> ')
        print(f"  Card {i}: onclick={onclick.group(1) if onclick else 'none'}")

# Find page-speed and page-advanced sections
for pid in ['page-speed', 'page-opd', 'page-advanced', 'page-calculators']:
    idx = html.find(f'id="{pid}"')
    if idx >= 0:
        print(f"  Section: {pid} at {idx}")
