"""Fix button text in index.html using binary replacement."""
with open('index.html', 'rb') as f:
    raw = f.read()

# Replace hero CTA button
raw = raw.replace(b'Open Medical Report Draft</button>', b'Start Advanced Mode</button>', 1)

# Check result
idx = raw.find(b'Start Advanced Mode')
if idx >= 0:
    print(f"Start Advanced Mode button found at {idx}")
    # Add Report button after it
    end_btn = raw.find(b'</button>', idx) + 9
    report_btn = b'\n          <button class="btn btn-outline" onclick="showPage(\'report\')">Medical Report Draft</button>'
    raw = raw[:end_btn] + report_btn + raw[end_btn:]

with open('index.html', 'wb') as f:
    f.write(raw)

# Verify
content = raw.decode('latin-1')
print(f"Start Advanced Mode: {'Start Advanced Mode' in content}")
print(f"Medical Report Draft button: {'Medical Report Draft</button>' in content}")
print(f"Internal prototype: {'Internal prototype' in content}")
print(f"Quick OPD Mode: {'Quick OPD Mode' in content}")

# Fix Internal prototype separately
content = content.replace(
    'Internal prototype. Creates a connected clinician-reviewed draft from selected workflow data, editable history fields, exam prompts, investigation options, plan options, and optional calculator results.',
    'Advanced encounter builder. Creates a structured clinical draft from selected workflow data, editable history fields, exam prompts, investigation options, plan options, and optional calculator results. Clinician review required.'
)

with open('index.html', 'w', encoding='latin-1') as f:
    f.write(content)
print("Internal prototype fixed")
