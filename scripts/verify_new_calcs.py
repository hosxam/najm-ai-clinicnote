"""Verify new calculators in calculator-tools.js."""
with open('calculator-tools.js', 'rb') as f:
    raw = f.read()

checks = [
    (b'calculatorId:"nyha"', 'NYHA'),
    (b'calculatorId:"killip"', 'Killip'),
    (b'calculatorId:"sirs"', 'SIRS'),
    (b'calculatorId:"qsofa"', 'qSOFA'),
    (b'calculatorId:"fib4"', 'FIB-4'),
    (b'calculatorId:"child_pugh"', 'Child-Pugh'),
    (b'calculatorId === "nyha"', 'calcFromUI nyha'),
    (b'calculatorId === "child_pugh"', 'calcFromUI child_pugh'),
    (b'id: "nyha"', 'array entry nyha'),
    (b'id: "child_pugh"', 'array entry child_pugh'),
]

all_pass = True
for pattern, name in checks:
    found = pattern in raw
    status = 'PASS' if found else 'FAIL'
    if not found:
        all_pass = False
    print(f"  {status}: {name}")

print(f"\n{'All pass' if all_pass else 'Some failed'}")
print(f"Size: {len(raw)} bytes")
