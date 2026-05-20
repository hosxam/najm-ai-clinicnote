"""Check local index.html for correct content."""
import re
with open('index.html', 'r', encoding='latin-1') as f:
    html = f.read()

checks = {
    'Quick OPD Mode': 'Quick OPD Mode' in html,
    'Start Advanced Mode CTA': 'Start Advanced Mode' in html,
    'Internal prototype': 'Internal prototype' in html,
    'Advanced Encounter Mode': 'Advanced Encounter Mode' in html,
    'Try OPD Note Builder': 'Try OPD Note Builder' in html,
    'Calculator Tools': 'Calculator Tools' in html,
    'main-site-advanced marker': 'main-site-advanced-mode-150-workflows' in html,
    'deploy marker': 'deploy-current-version-v5d' in html,
}

for label, found in checks.items():
    print(f"{label}: {'FOUND' if found else 'NOT FOUND'}")
