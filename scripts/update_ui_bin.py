"""Binary replace specialty dropdown and map."""
with open('index.html', 'rb') as f:
    raw = f.read()

# Replace dropdown
old_drop = (
    b'<select id="specialty" onchange="upVT();upP();">\r\r\n'
    b'<option value="gen">General Medicine / GP</option>\r\r\n'
    b'<option value="ortho">Orthopedics / MSK</option>\r\r\n'
    b'<option value="peds">Pediatrics</option>\r\r\n'
    b'<option value="ent">ENT</option>\r\r\n'
    b'<option value="derm">Dermatology</option>\r\r\n'
    b'<option value="obgyn">OB/GYN</option>\r\r\n'
    b'<option value="genfup">General follow-up</option>\r\r\n'
    b'</select>'
)

new_drop = (
    b'<select id="specialty" onchange="upVT();upP();">\r\r\n'
    b'<option value="gen">General Medicine / GP</option>\r\r\n'
    b'<option value="ortho">Orthopedics / MSK</option>\r\r\n'
    b'<option value="peds">Pediatrics</option>\r\r\n'
    b'<option value="ent">ENT</option>\r\r\n'
    b'<option value="derm">Dermatology</option>\r\r\n'
    b'<option value="obgyn">OB/GYN</option>\r\r\n'
    b'<option value="ophtho">Ophthalmology</option>\r\r\n'
    b'<option value="psych">Psychiatry / Mental Health</option>\r\r\n'
    b'<option value="urgent">Emergency / Urgent Care</option>\r\r\n'
    b'<option value="cardio">Cardiology</option>\r\r\n'
    b'<option value="neuro">Neurology</option>\r\r\n'
    b'<option value="resp">Respiratory / Pulmonology</option>\r\r\n'
    b'<option value="gastro">Gastroenterology</option>\r\r\n'
    b'<option value="endo">Endocrinology</option>\r\r\n'
    b'<option value="uro">Urology / Nephrology</option>\r\r\n'
    b'<option value="genfup">General follow-up</option>\r\r\n'
    b'</select>'
)

found_drop = old_drop in raw
print(f"Found dropdown: {found_drop}")
if found_drop:
    raw = raw.replace(old_drop, new_drop, 1)

# Replace map
old_map = (
    b'var map={\r\r\n'
    b'    "General Medicine / GP":"gen",\r\r\n'
    b'    "Orthopedics / MSK":"ortho",\r\r\n'
    b'    "Pediatrics":"peds",\r\r\n'
    b'    "ENT":"ent",\r\r\n'
    b'    "Dermatology":"derm",\r\r\n'
    b'    "OB/GYN":"obgyn",\r\r\n'
    b'    "Ophthalmology":"ophtho",\r\r\n'
    b'    "Psychiatry / Behavioral":"psych",\r\r\n'
    b'    "Psychiatry / Mental Health":"psych"\r\r\n'
    b'  };'
)

new_map = (
    b'var map={\r\r\n'
    b'    "General Medicine / GP":"gen",\r\r\n'
    b'    "Orthopedics / MSK":"ortho",\r\r\n'
    b'    "Pediatrics":"peds",\r\r\n'
    b'    "ENT":"ent",\r\r\n'
    b'    "Dermatology":"derm",\r\r\n'
    b'    "OB/GYN":"obgyn",\r\r\n'
    b'    "Ophthalmology":"ophtho",\r\r\n'
    b'    "Psychiatry / Behavioral":"psych",\r\r\n'
    b'    "Psychiatry / Mental Health":"psych",\r\r\n'
    b'    "Emergency / Urgent Care":"urgent",\r\r\n'
    b'    "Cardiology":"cardio",\r\r\n'
    b'    "Neurology":"neuro",\r\r\n'
    b'    "Respiratory / Pulmonology":"resp",\r\r\n'
    b'    "Gastroenterology":"gastro",\r\r\n'
    b'    "Endocrinology":"endo",\r\r\n'
    b'    "Urology / Nephrology":"uro"\r\r\n'
    b'  };'
)

found_map = old_map in raw
print(f"Found map: {found_map}")
if found_map:
    raw = raw.replace(old_map, new_map, 1)

with open('index.html', 'wb') as f:
    f.write(raw)

print("Written successfully")
print(f"File size: {len(raw)} bytes")
