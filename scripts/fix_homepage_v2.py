"""Fix remaining homepage text issues."""
with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# 1. Fix nav link
html = html.replace('Try OPD Note Builder</a>', 'Quick OPD Mode</a>', 1)

# 2. Fix hero CTA - find the Medical Report Draft button and add Advanced Mode before it
html = html.replace(
    '<button class="btn btn-primary" onclick="showPage(\'report\')">Open Medical Report Draft</button>',
    '<button class="btn btn-primary" onclick="window.location.href=\'./?v4=encounter2\'">Start Advanced Mode</button>\n          <button class="btn btn-outline" onclick="showPage(\'report\')">Medical Report Draft</button>',
    1
)

# 3. Fix Internal prototype text
html = html.replace(
    'Internal prototype. Creates a connected clinician-reviewed draft from selected workflow data, editable history fields, exam prompts, investigation options, plan options, and optional calculator results.',
    'Advanced encounter builder. Creates a structured clinical draft from selected workflow data, editable history fields, exam prompts, investigation options, plan options, and optional calculator results. Clinician review required.'
)

# 4. Add Advanced Mode card if we replaced the OPD card section
# Check if the Advanced Mode card was already added
if 'Advanced Mode</h3>' not in html:
    # Add after hero-section
    idx = html.find('Start Advanced Mode')
    if idx > 0:
        print(f"Advanced Mode CTA present at {idx}")

with open('index.html', 'w', encoding='latin-1') as f:
    f.write(html)
print("Done")
