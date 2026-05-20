"""V5A-5: Update UI specialty access for all 15 specialties."""
import re

with open('index.html', 'rb') as f:
    raw = f.read()
html = raw.decode('latin-1')

# 1. Update the SD map to include all 15 specialties
old_map = """var map={
    "General Medicine / GP":"gen",
    "Orthopedics / MSK":"ortho",
    "Pediatrics":"peds",
    "ENT":"ent",
    "Dermatology":"derm",
    "OB/GYN":"obgyn",
    "Ophthalmology":"ophtho",
    "Psychiatry / Behavioral":"psych",
    "Psychiatry / Mental Health":"psych"
  };"""

new_map = """var map={
    "General Medicine / GP":"gen",
    "Orthopedics / MSK":"ortho",
    "Pediatrics":"peds",
    "ENT":"ent",
    "Dermatology":"derm",
    "OB/GYN":"obgyn",
    "Ophthalmology":"ophtho",
    "Psychiatry / Behavioral":"psych",
    "Psychiatry / Mental Health":"psych",
    "Emergency / Urgent Care":"urgent",
    "Cardiology":"cardio",
    "Neurology":"neuro",
    "Respiratory / Pulmonology":"resp",
    "Gastroenterology":"gastro",
    "Endocrinology":"endo",
    "Urology / Nephrology":"uro"
  };"""

html = html.replace(old_map, new_map)

# 2. Update the hardcoded specialty dropdown
old_dropdown = """<select id="specialty" onchange="upVT();upP();">
<option value="gen">General Medicine / GP</option>
<option value="ortho">Orthopedics / MSK</option>
<option value="peds">Pediatrics</option>
<option value="ent">ENT</option>
<option value="derm">Dermatology</option>
<option value="obgyn">OB/GYN</option>
<option value="genfup">General follow-up</option>
</select>"""

new_dropdown = """<select id="specialty" onchange="upVT();upP();">
<option value="gen">General Medicine / GP</option>
<option value="ortho">Orthopedics / MSK</option>
<option value="peds">Pediatrics</option>
<option value="ent">ENT</option>
<option value="derm">Dermatology</option>
<option value="obgyn">OB/GYN</option>
<option value="ophtho">Ophthalmology</option>
<option value="psych">Psychiatry / Mental Health</option>
<option value="urgent">Emergency / Urgent Care</option>
<option value="cardio">Cardiology</option>
<option value="neuro">Neurology</option>
<option value="resp">Respiratory / Pulmonology</option>
<option value="gastro">Gastroenterology</option>
<option value="endo">Endocrinology</option>
<option value="uro">Urology / Nephrology</option>
<option value="genfup">General follow-up</option>
</select>"""

html = html.replace(old_dropdown, new_dropdown)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("UI updated. Checking counts...")
print(f"SD map entries: {html.count('":"')}")
print(f"Dropdown options: {len(re.findall(r'<option value=\"[^\"]+\">', html))}")
