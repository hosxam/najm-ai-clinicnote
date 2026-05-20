"""Check live HTML for specific text strings."""
import urllib.request
r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/', timeout=30)
html = r.read().decode('latin-1')

checks = {
    'Quick OPD Mode': 'Quick OPD Mode',
    'Start Advanced Mode': 'Start Advanced Mode',
    'Internal prototype': 'Internal prototype',
    'Advanced Encounter Mode': 'Advanced Encounter Mode',
    'Advanced Mode': 'Advanced Mode',
    'Calculator Tools nav': 'Calculator Tools',
    'Try OPD Note Builder': 'Try OPD Note Builder',
    'Advanced encounter builder': 'Advanced encounter builder',
}

for label, text in checks.items():
    found = text in html
    status = 'FOUND' if found else 'NOT FOUND'
    print(f'{label}: {status}')

# Show the nav links section
idx = html.find('<nav')
if idx >= 0:
    end = html.find('</nav>', idx)
    nav = html[idx:end+6]
    print(f'\nNav section ({len(nav)} chars):')
    import re
    links = re.findall(r'<a[^>]*>([^<]*)</a>', nav)
    for l in links:
        print(f'  Nav link: {l.strip()}')
