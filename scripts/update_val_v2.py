"""Update registry validator."""
with open('scripts/validateV3CalculatorRegistry.js', 'rb') as f:
    raw = f.read()

# Update count
raw = raw.replace(b'EXPECTED_CALCULATOR_COUNT = 20;', b'EXPECTED_CALCULATOR_COUNT = 26;')

# Update implementation check - use the exact bytes from the file
old_check = b"if (calculator.implementation_status !== 'registry_only') {\r\n      errors.push(`${label}: implementation_status must be registry_only.`);\r\n    }\r\n    if (calculator.formula_status !== 'not_implemented') {\r\n      errors.push(`${label}: formula_status must be not_implemented.`);\r\n    }"

new_check = b"if (calculator.implementation_status !== 'registry_only' && calculator.implementation_status !== 'implemented') {\r\n      errors.push(`${label}: implementation_status must be registry_only or implemented.`);\r\n    }\r\n    if (calculator.formula_status !== 'not_implemented' && calculator.formula_status !== 'implemented') {\r\n      errors.push(`${label}: formula_status must be not_implemented or implemented.`);\r\n    }"

if old_check in raw:
    raw = raw.replace(old_check, new_check, 1)
    print("Replaced impl check")
else:
    print("Old check NOT found - trying without \\r")
    # Try with \n only
    old_check2 = old_check.replace(b'\r\n', b'\n')
    if old_check2 in raw:
        raw = raw.replace(old_check2, new_check.replace(b'\r\n', b'\n'), 1)
        print("Replaced with \\n")
    else:
        print("Still not found - checking bytes...")
        idx = raw.find(b"implementation_status !== 'registry_only'")
        if idx >= 0:
            print(f"Found at {idx}")
            print(repr(raw[idx:idx+250]))

with open('scripts/validateV3CalculatorRegistry.js', 'wb') as f:
    f.write(raw)
print("Written")
