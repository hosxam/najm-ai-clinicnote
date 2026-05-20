"""Fix calculateFromUI with new calculator cases."""
with open('calculator-tools.js', 'rb') as f:
    raw = f.read()

# First restore the placeholder to default error
raw = raw.replace(b'/* placeholder */;', b'result = { ok: false, error: "Calculator is not available." };')

# Now find and replace the full else-if chain  
old = b'    } else if (calculatorId === "mrc_dyspnea_scale") {\n      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\n    } else {\n      result = { ok: false, error: "Calculator is not available." };\n    }'

new = b'    } else if (calculatorId === "mrc_dyspnea_scale") {\n      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\n    } else if (calculatorId === "nyha") {\n      result = calculateNYHA(Number(byId("calc-nyha-grade").value));\n    } else if (calculatorId === "killip") {\n      result = calculateKillip(Number(byId("calc-killip-class").value));\n    } else if (calculatorId === "sirs") {\n      var _t=Number(byId("calc-sirs-temp").value)||undefined;var _h=Number(byId("calc-sirs-hr").value)||undefined;var _r=Number(byId("calc-sirs-rr").value)||undefined;var _w=Number(byId("calc-sirs-wbc").value)||undefined;\n      result = calculateSIRS(_t,_h,_r,_w);\n    } else if (calculatorId === "qsofa") {\n      var _rr=Number(byId("calc-qsofa-rr").value)||undefined;var _sbp=Number(byId("calc-qsofa-sbp").value)||undefined;var _gcs=byId("calc-qsofa-gcs").value==="yes";\n      result = calculateQSOFA(_rr,_sbp,_gcs);\n    } else if (calculatorId === "fib4") {\n      result = calculateFIB4(Number(byId("calc-fib4-age").value),Number(byId("calc-fib4-ast").value),Number(byId("calc-fib4-alt").value),Number(byId("calc-fib4-plt").value));\n    } else if (calculatorId === "child_pugh") {\n      result = calculateChildPugh(Number(byId("calc-child-bili").value),Number(byId("calc-child-alb").value),Number(byId("calc-child-inr").value),byId("calc-child-ascites").value,byId("calc-child-encephalopathy").value);\n    } else {\n      result = { ok: false, error: "Calculator is not available." };\n    }'

if old in raw:
    raw = raw.replace(old, new, 1)
    print("Replaced calculateFromUI chain")
else:
    print("Pattern NOT found")
    # Try searching for the pattern
    idx = raw.find(b'mrc_dyspnea_scale')
    if idx >= 0:
        print(f"Found mrc_dyspnea_scale at {idx}")
        print(repr(raw[idx:idx+300]))

with open('calculator-tools.js', 'wb') as f:
    f.write(raw)
print(f"Size: {len(raw)} bytes")
