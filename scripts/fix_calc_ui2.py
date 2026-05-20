"""Replace calculateFromUI else-if chain."""
with open('calculator-tools.js', 'rb') as f:
    raw = f.read()

# Exact bytes we need to replace - found at position 10443
old = (
    b'    } else if (calculatorId === "mrc_dyspnea_scale") {\n'
    b'      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\n'
    b'    } else {\n'
    b'      result = { ok: false, error: "Calculator is not available." };\n'
    b'    }'
)

new = (
    b'    } else if (calculatorId === "mrc_dyspnea_scale") {\n'
    b'      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\n'
    b'    } else if (calculatorId === "nyha") {\n'
    b'      result = calculateNYHA(Number(byId("calc-nyha-grade").value));\n'
    b'    } else if (calculatorId === "killip") {\n'
    b'      result = calculateKillip(Number(byId("calc-killip-class").value));\n'
    b'    } else if (calculatorId === "sirs") {\n'
    b'      var _t=Number(byId("calc-sirs-temp").value)||undefined;\n'
    b'      var _h=Number(byId("calc-sirs-hr").value)||undefined;\n'
    b'      var _r=Number(byId("calc-sirs-rr").value)||undefined;\n'
    b'      var _w=Number(byId("calc-sirs-wbc").value)||undefined;\n'
    b'      result=calculateSIRS(_t,_h,_r,_w);\n'
    b'    } else if (calculatorId === "qsofa") {\n'
    b'      var _rr=Number(byId("calc-qsofa-rr").value)||undefined;\n'
    b'      var _sbp=Number(byId("calc-qsofa-sbp").value)||undefined;\n'
    b'      var _gcs=byId("calc-qsofa-gcs").value==="yes";\n'
    b'      result=calculateQSOFA(_rr,_sbp,_gcs);\n'
    b'    } else if (calculatorId === "fib4") {\n'
    b'      result = calculateFIB4(\n'
    b'        Number(byId("calc-fib4-age").value),\n'
    b'        Number(byId("calc-fib4-ast").value),\n'
    b'        Number(byId("calc-fib4-alt").value),\n'
    b'        Number(byId("calc-fib4-plt").value)\n'
    b'      );\n'
    b'    } else if (calculatorId === "child_pugh") {\n'
    b'      result = calculateChildPugh(\n'
    b'        Number(byId("calc-child-bili").value),\n'
    b'        Number(byId("calc-child-alb").value),\n'
    b'        Number(byId("calc-child-inr").value),\n'
    b'        byId("calc-child-ascites").value,\n'
    b'        byId("calc-child-encephalopathy").value\n'
    b'      );\n'
    b'    } else {\n'
    b'      result = { ok: false, error: "Calculator is not available." };\n'
    b'    }'
)

if old in raw:
    print("Found old pattern at", raw.find(old))
    raw = raw.replace(old, new, 1)
    print("Replaced successfully")
else:
    print("NOT FOUND - searching...")
    idx = raw.find(b'mrc_dyspnea_scale')
    if idx >= 0:
        chunk = raw[idx:idx+200]
        print(f"Found at {idx}: {chunk}")
        # Try to match the pattern by looking at exact bytes
        next_else = raw.find(b'} else {', idx)
        print(f"Next else at {next_else}")
        print(repr(raw[idx:next_else+50]))

with open('calculator-tools.js', 'wb') as f:
    f.write(raw)
print("Done")
