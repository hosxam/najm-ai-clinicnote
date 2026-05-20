"""Update calculator-tools.js with new calculators UI."""
with open('calculator-tools.js', 'rb') as f:
    raw = f.read()

# 1. Add to calculators array
old_arr = b'var calculators = ['
idx = raw.find(old_arr)
if idx >= 0:
    end = raw.find(b'];', idx)
    old_block = raw[idx:end+2]
    new_block = b'var calculators = [\n    { id: "bmi", name: "BMI" },\n    { id: "pack_years", name: "Pack years" },\n    { id: "mean_arterial_pressure", name: "Mean arterial pressure" },\n    { id: "shock_index", name: "Shock index" },\n    { id: "mrc_dyspnea_scale", name: "MRC dyspnea scale" },\n    { id: "nyha", name: "NYHA functional class" },\n    { id: "killip", name: "Killip classification" },\n    { id: "sirs", name: "SIRS criteria" },\n    { id: "qsofa", name: "qSOFA" },\n    { id: "fib4", name: "FIB-4 index" },\n    { id: "child_pugh", name: "Child-Pugh score" }\n  ];'
    raw = raw.replace(old_block, new_block, 1)
    print("Updated calculators array")

# 2. Add to calculateFromUI
old_fn = b'    } else {\n      result = { ok: false, error: "Calculator is not available." };\n    }'
new_fn = b'    } else if (calculatorId === "nyha") {\n      result = calculateNYHA(Number(document.getElementById("calc-nyha-grade").value));\n    } else if (calculatorId === "killip") {\n      result = calculateKillip(Number(document.getElementById("calc-killip-class").value));\n    } else if (calculatorId === "sirs") {\n      var t = Number(document.getElementById("calc-sirs-temp").value) || undefined;\n      var h = Number(document.getElementById("calc-sirs-hr").value) || undefined;\n      var r = Number(document.getElementById("calc-sirs-rr").value) || undefined;\n      var w = Number(document.getElementById("calc-sirs-wbc").value) || undefined;\n      result = calculateSIRS(t, h, r, w);\n    } else if (calculatorId === "qsofa") {\n      var rr = Number(document.getElementById("calc-qsofa-rr").value) || undefined;\n      var sbp = Number(document.getElementById("calc-qsofa-sbp").value) || undefined;\n      var gcs = document.getElementById("calc-qsofa-gcs").value === "yes";\n      result = calculateQSOFA(rr, sbp, gcs);\n    } else if (calculatorId === "fib4") {\n      result = calculateFIB4(\n        Number(document.getElementById("calc-fib4-age").value),\n        Number(document.getElementById("calc-fib4-ast").value),\n        Number(document.getElementById("calc-fib4-alt").value),\n        Number(document.getElementById("calc-fib4-plt").value)\n      );\n    } else if (calculatorId === "child_pugh") {\n      result = calculateChildPugh(\n        Number(document.getElementById("calc-child-bili").value),\n        Number(document.getElementById("calc-child-alb").value),\n        Number(document.getElementById("calc-child-inr").value),\n        document.getElementById("calc-child-ascites").value,\n        document.getElementById("calc-child-encephalopathy").value\n      );\n    } else {\n      result = { ok: false, error: "Calculator is not available." };\n    }'

if old_fn in raw:
    raw = raw.replace(old_fn, new_fn, 1)
    print("Updated calculateFromUI")
else:
    print("Old calculateFromUI NOT found - trying partial")
    # Find the else clause
    idx2 = raw.find(b'Calculator is not available')
    if idx2 >= 0:
        print(f"Found at {idx2}")
        # Find the closing brace
        # Just do simple replace of the last else clause
        raw = raw.replace(b'result = { ok: false, error: "Calculator is not available." }', 
                          b'/* placeholder */')

with open('calculator-tools.js', 'wb') as f:
    f.write(raw)
print(f"Written: {len(raw)} bytes")
