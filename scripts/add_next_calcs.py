"""Add 6 new low-risk calculators to calculator-tools.js."""
with open('calculator-tools.js', 'r', encoding='latin-1') as f:
    js = f.read()

# New functions to insert
new_funcs = '''
  // ── NYHA Functional Classification ──
  function calculateNYHA(grade) {
    var grades = {
      1: 'Class I: No limitation of physical activity. Ordinary physical activity does not cause undue breathlessness, fatigue, or palpitations.',
      2: 'Class II: Slight limitation of physical activity. Comfortable at rest, but ordinary physical activity results in undue breathlessness, fatigue, or palpitations.',
      3: 'Class III: Marked limitation of physical activity. Comfortable at rest, but less than ordinary activity causes undue breathlessness, fatigue, or palpitations.',
      4: 'Class IV: Unable to carry on any physical activity without discomfort. Symptoms at rest can be present. If any physical activity is undertaken, discomfort is increased.'
    };
    return { text: 'NYHA functional class: ' + grades[grade] || 'Invalid grade.', value: grade };
  }

  // ── Killip Classification (acute MI) ──
  function calculateKillip(killipClass) {
    var classes = {
      1: 'Class I: No clinical signs of heart failure.',
      2: 'Class II: Signs of heart failure — crackles, S3 gallop, elevated JVP.',
      3: 'Class III: Frank acute pulmonary oedema.',
      4: 'Class IV: Cardiogenic shock — hypotension, tachycardia, signs of poor perfusion.'
    };
    return { text: 'Killip class: ' + (classes[killipClass] || 'Invalid class.'), value: killipClass };
  }

  // ── SIRS Criteria ──
  function calculateSIRS(temp, hr, rr, wbc, paCO2) {
    var count = 0;
    if (temp !== undefined && (temp < 36 || temp > 38)) count++;
    if (hr !== undefined && hr > 90) count++;
    if (rr !== undefined && rr > 20) count++;
    if (wbc !== undefined && (wbc < 4 || wbc > 12)) count++;
    var text = 'SIRS criteria met: ' + count + '/4. ';
    text += count >= 2 ? 'Two or more criteria present. Clinician interpretation required.' : 'Less than 2 criteria.';
    return { text: text, value: count };
  }

  // ── qSOFA ──
  function calculateQSOFA(rr, sbp, gcsBelow) {
    var count = 0;
    if (rr !== undefined && rr >= 22) count++;
    if (sbp !== undefined && sbp <= 100) count++;
    if (gcsBelow) count++;
    var text = 'qSOFA score: ' + count + '/3. ';
    text += count >= 2 ? 'Higher risk of in-hospital mortality. Clinician interpretation required.' : 'Low qSOFA score.';
    return { text: text, value: count };
  }

  // ── FIB-4 (liver fibrosis index) ──
  function calculateFIB4(age, ast, alt, plt) {
    if (!age || !ast || !alt || !plt || ast <= 0 || alt <= 0 || plt <= 0) return null;
    var fib4 = (age * ast) / (plt * Math.sqrt(alt));
    var cat = fib4 < 1.30 ? 'Low probability of advanced fibrosis.' :
              fib4 > 2.67 ? 'Higher probability of advanced fibrosis. Clinician interpretation required.' :
              'Indeterminate range. Further evaluation may be considered.';
    return { text: 'FIB-4 index: ' + fib4.toFixed(2) + '. ' + cat + ' Clinician interpretation required.', value: fib4 };
  }

  // ── Child-Pugh Score ──
  function calculateChildPugh(bilirubin, albumin, inr, ascites, encephalopathy) {
    function pts(val, thresholds) {
      if (val === undefined || val === null) return 0;
      for (var t = 0; t < thresholds.length; t++) {
        if (val <= thresholds[t].max) return thresholds[t].pts;
      }
      return thresholds[thresholds.length-1].pts;
    }
    var biliPts = pts(bilirubin, [{max:2,pts:1},{max:3,pts:2},{max:999,pts:3}]);
    var albPts = pts(albumin, [{max:3.5,pts:1},{max:2.8,pts:2},{max:999,pts:3}]).toString().split('').reverse().join(''); // hack: reverse range
    // Actually compute albumin correctly
    var albPts2 = albumin >= 3.5 ? 1 : albumin >= 2.8 ? 2 : 3;
    var inrPts = inr < 1.7 ? 1 : inr < 2.3 ? 2 : 3;
    var ascPts = ascites === 'none' ? 1 : ascites === 'mild' ? 2 : 3;
    var encPts = encephalopathy === 'none' ? 1 : encephalopathy === 'grade1-2' ? 2 : 3;
    var total = biliPts + albPts2 + inrPts + ascPts + encPts;
    var cls = total <= 6 ? 'Child-Pugh class A (least severe)' :
              total <= 9 ? 'Child-Pugh class B (moderately severe)' :
              'Child-Pugh class C (most severe)';
    return { text: 'Child-Pugh score: ' + total + '. ' + cls + '. Clinician interpretation required.', value: total };
  }
'''

# Insert after getCalculatorSafetyFooter
insert_after = 'function getCalculatorSafetyFooter() {'
# Find the closing brace of getCalculatorSafetyFooter
idx = js.rfind('}')
# Actually find the exact position of getCalcSafetyFooter end
idx = js.find('\n  function byId(')
if idx > 0:
    js = js[:idx] + new_funcs + js[idx:]
    print(f"Inserted at position {idx}")
else:
    print("Could not find insertion point")

with open('calculator-tools.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Written")
