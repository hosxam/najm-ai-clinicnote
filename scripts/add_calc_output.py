"""Add calculator measurements to V4 output."""
with open('v4_advanced_encounter.js', 'r', encoding='latin-1') as f:
    js = f.read()

# 1. Add measurements to buildV4NoteModel
old_model = """return {
      subjective: {
        chiefConcern: '',
        duration: '',
        symptoms: [],
        associatedSymptoms: [],
        relevantNegatives: []
      },
      objective: {
        examFindings: [],
        investigations: []
      },"""

new_model = """return {
      subjective: {
        chiefConcern: '',
        duration: '',
        symptoms: [],
        associatedSymptoms: [],
        relevantNegatives: []
      },
      objective: {
        examFindings: [],
        investigations: [],
        measurements: []
      },"""

if old_model in js:
    js = js.replace(old_model, new_model, 1)
    print("Added measurements to note model")
else:
    print("Note model pattern NOT found")

# 2. Add calculator result collection after investigations are collected
# Find where model.objective.investigations is populated
invest_pattern = "model.objective.investigations.push"
idx = js.rfind(invest_pattern)
if idx > 0:
    # Find the block where investigations are collected
    # Insert calculator results collection after that block
    calc_insert = """
    // Collect calculator results for measurements
    if (state$ && state$.calculatorResults) {
      var calcIds = Object.keys(state$.calculatorResults);
      for (var ci = 0; ci < calcIds.length; ci++) {
        var cr = state$.calculatorResults[calcIds[ci]];
        if (cr && cr.included && cr.result) {
          model.objective.measurements.push(cr.result);
        }
      }
    }
"""
    # Insert after investigations collection, before exam population
    # Find the block end - look for "var exam = getExamDetails"
    exam_start = js.find('var exam = getExamDetails(state$.workflowId);', idx)
    if exam_start > 0:
        js = js[:exam_start] + calc_insert + js[exam_start:]
        print("Added calculator result collection")
    else:
        print("Could not find insertion point")
else:
    print("investigations.push not found")

# 3. Update renderObjective to include measurements
old_ro = """function renderObjective(model) {
    var obj = model.objective;
    var lines = [];
    lines = lines.concat(obj.examFindings.map(function(s) { return s.charAt(0).toUpperCase() + s.slice(1); }));
    lines = lines.concat(obj.investigations.map(function(s) { return s.charAt(0).toUpperCase() + s.slice(1); }));
    return lines.length ? lines.join('\\n') : '[not documented]';
  }"""

new_ro = """function renderObjective(model) {
    var obj = model.objective;
    var lines = [];
    lines = lines.concat(obj.examFindings.map(function(s) { return s.charAt(0).toUpperCase() + s.slice(1); }));
    lines = lines.concat(obj.investigations.map(function(s) { return s.charAt(0).toUpperCase() + s.slice(1); }));
    if (obj.measurements && obj.measurements.length) {
      lines.push('');
      lines.push('Measurements / Scores:');
      for (var mi = 0; mi < obj.measurements.length; mi++) {
        lines.push('- ' + obj.measurements[mi]);
      }
    }
    return lines.length ? lines.join('\\n') : '[not documented]';
  }"""

if old_ro in js:
    js = js.replace(old_ro, new_ro, 1)
    print("Updated renderObjective")
else:
    print("renderObjective pattern NOT found - trying partial match")
    # Find by position
    idx = js.find('function renderObjective(model)')
    if idx >= 0:
        end = js.find('\n  function render', idx + 20)
        if end < 0:
            end = js.find('\n  function ', idx + 20)
        old = js[idx:end]
        print(f"Found at {idx}, {len(old)} chars")
        js = js[:idx] + new_ro + js[end:]
        print("renderObjective force-replaced")

with open('v4_advanced_encounter.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Done")
