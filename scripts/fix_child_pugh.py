"""Fix Child-Pugh calculator bugs."""
with open('calculator-tools.js', 'r', encoding='latin-1') as f:
    js = f.read()

# Fix Child-Pugh: replace the entire function body
old = """function calculateChildPugh(bilirubin, albumin, inr, ascites, encephalopathy) {
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
  }"""

new = """function calculateChildPugh(bilirubin, albumin, inr, ascites, encephalopathy) {
    var biliPts = bilirubin <= 2 ? 1 : bilirubin <= 3 ? 2 : 3;
    var albPts = albumin >= 3.5 ? 1 : albumin >= 2.8 ? 2 : 3;
    var inrPts = inr < 1.7 ? 1 : inr < 2.3 ? 2 : 3;
    var ascPts = ascites === 'none' ? 1 : ascites === 'mild' ? 2 : 3;
    var encPts = encephalopathy === 'none' ? 1 : encephalopathy === 'grade1-2' ? 2 : 3;
    var total = biliPts + albPts + inrPts + ascPts + encPts;
    var cls = total <= 6 ? 'Child-Pugh class A (least severe)' :
              total <= 9 ? 'Child-Pugh class B (moderately severe)' :
              'Child-Pugh class C (most severe)';
    return { text: 'Child-Pugh score: ' + total + '. ' + cls + '. Clinician interpretation required.', value: total };
  }"""

if old in js:
    js = js.replace(old, new, 1)
    print("Fixed Child-Pugh")
else:
    print("Child-Pugh NOT found")

with open('calculator-tools.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Written")
