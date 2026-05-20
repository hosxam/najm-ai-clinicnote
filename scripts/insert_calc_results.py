"""Insert calculator results into V4 output pipeline."""
with open('v4_advanced_encounter.js', 'r', encoding='latin-1') as f:
    js = f.read()

insert_before = '    model.assessment.impression = state$.impression || \'[not documented]\';'
insert_code = '''
    // Collect calculator results for measurements
    if (state$.calculatorResults) {
      var calcIds = Object.keys(state$.calculatorResults);
      for (var ci = 0; ci < calcIds.length; ci++) {
        var cr = state$.calculatorResults[calcIds[ci]];
        if (cr && cr.included && cr.result) {
          model.objective.measurements.push(cr.result);
        }
      }
    }
'''

if insert_before in js:
    js = js.replace(insert_before, insert_code + insert_before, 1)
    print('Calculator results collection inserted')
else:
    print('Pattern not found - trying escape variation')
    # Try with different escaping
    insert_before2 = "model.assessment.impression = state$.impression || '[not documented]';"
    if insert_before2 in js:
        js = js.replace(insert_before2, insert_code + insert_before2, 1)
        print('Calculator results collection inserted (v2)')
    else:
        print('Still not found')

with open('v4_advanced_encounter.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Done')
