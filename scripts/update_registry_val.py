"""Update registry validator to accept implemented status."""
with open('scripts/validateV3CalculatorRegistry.js', 'r') as f:
    js = f.read()

old = "if (calculator.implementation_status !== 'registry_only') {\n      errors.push(${label}: implementation_status must be registry_only.);\n    }\n    if (calculator.formula_status !== 'not_implemented') {\n      errors.push(${label}: formula_status must be not_implemented.);\n    }"

# Actually, the file uses template literals with backticks. Let me find the exact text.
import re

# Find the implementation check block
idx = js.find("calculator.implementation_status !== 'registry_only'")
if idx >= 0:
    # Get the exact text from the file
    end_idx = js.find("}", idx)
    # Find the formula_status check
    idx2 = js.find("calculator.formula_status", idx)
    if idx2 >= 0:
        end_idx2 = js.find("}", idx2)
        block = js[idx:end_idx2+1]
        print(f"Found block at {idx}")
        print(repr(block))
        
        new_block = """calculator.implementation_status !== 'registry_only' && calculator.implementation_status !== 'implemented') {
      errors.push(`${label}: implementation_status must be registry_only or implemented.`);
    }
    if (calculator.formula_status !== 'not_implemented' && calculator.formula_status !== 'implemented') {
      errors.push(`${label}: formula_status must be not_implemented or implemented.`);
    }"""
        
        js = js[:idx] + new_block + js[end_idx2+1:]
        print("Replaced")
    else:
        print("formula check not found")
else:
    print("impl check not found")

with open('scripts/validateV3CalculatorRegistry.js', 'w') as f:
    f.write(js)
print("Done")
