"""Generate the calculator integration code for v4_advanced_encounter.js."""
replacements = {}

# 1. Replace stepCalc with interactive calculator cards
replacements['stepCalc'] = '''
function stepCalc() {
    var h = '<h2 class="v4-step-h">Step 5: Calculators</h2>';
    h += '<p class="v4-step-d">Optional documentation calculators. Enter values manually if assessed.</p>';
    h += '<div class="v4-safety-box">Calculator results appear in the final draft only if you click "Include in final draft". Not treatment advice. Clinician interpretation required.</div>';

    if (!state.selectedWorkflowId) {
      h += '<p class="v4-calc-empty">Select a workflow in Step 1 to see related calculators.</p>';
      return h;
    }
    
    // Initialize calculator results in state
    if (!state.calculatorResults) state.calculatorResults = {};
    
    var calcs = getRelatedCalcs(state.selectedWorkflowId);
    if (calcs.length === 0) {
      h += '<p class="v4-calc-empty">No low-risk calculators map to this workflow.</p>';
      h += '<a href="?calc=v1" class="v4-btn v4-btn-outline" target="_blank">Open all calculator tools &#8599;</a>';
      return h;
    }

    h += '<div class="v4-calc-grid">';
    for (var ci = 0; ci < calcs.length; ci++) {
      var calc = calcs[ci];
      var cr = state.calculatorResults[calc.id] || {};
      h += renderCalcCard(calc, cr);
    }
    h += '</div>';
    h += '<div style="margin-top:12px"><a href="?calc=v1" class="v4-btn v4-btn-outline" target="_blank">Open all calculator tools &#8599;</a></div>';
    return h;
  }

  function renderCalcCard(calc, cr) {
    var h = '<div class="v4-calc-card">';
    h += '<h3 class="v4-calc-name">' + esc(calc.name) + '</h3>';
    h += '<p class="v4-calc-desc">' + esc(calc.desc || '') + '</p>';
    h += '<div class="v4-calc-inputs" id="calc-inputs-' + calc.id + '">';
    
    // Render input fields based on calculator type
    var inputs = getCalcInputs(calc.id);
    for (var ii = 0; ii < inputs.length; ii++) {
      var inp = inputs[ii];
      h += '<div class="v4-calc-input-row">';
      h += '<label>' + esc(inp.label) + '</label>';
      h += '<input type="' + inp.type + '" id="calc-' + calc.id + '-' + inp.key + '" placeholder="' + esc(inp.placeholder) + '" value="' + esc(cr.values && cr.values[inp.key] ? cr.values[inp.key] : '') + '" oninput="onCalcInputChange(\\'' + calc.id + '\\', \\'' + inp.key + '\\', this.value)" style="width:100px;margin-left:8px;padding:4px 8px;border:1px solid var(--border);border-radius:4px;">';
      h += '</div>';
    }
    
    h += '</div>';
    
    // Result display
    var resultText = cr.result || '';
    h += '<div class="v4-calc-result" id="calc-result-' + calc.id + '" style="' + (resultText ? '' : 'display:none') + '">';
    h += '<div style="font-weight:600;margin-bottom:4px;">Result:</div>';
    h += '<div id="calc-result-text-' + calc.id + '">' + esc(resultText) + '</div>';
    h += '</div>';
    
    // Buttons
    h += '<div class="v4-calc-actions" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">';
    h += '<button class="v4-btn v4-btn-sm" onclick="doCalc(\\'' + calc.id + '\\')">Calculate</button>';
    if (resultText) {
      var included = cr.included || false;
      h += '<button class="v4-btn v4-btn-sm ' + (included ? 'v4-btn-primary' : 'v4-btn-outline') + '" id="calc-include-btn-' + calc.id + '" onclick="toggleCalcInclude(\\'' + calc.id + '\\')">' + (included ? 'Included in draft' : 'Include in draft') + '</button>';
    }
    h += '<button class="v4-btn v4-btn-sm v4-btn-ghost" onclick="clearCalc(\\'' + calc.id + '\\')">Clear</button>';
    h += '</div>';
    
    h += '<div class="v4-calc-safety" style="font-size:10px;color:var(--gray-500);margin-top:6px;">Optional documentation calculator. Enter values manually. Clinician interpretation required.</div>';
    h += '</div>';
    return h;
  }

  function getCalcInputs(calcId) {
    var inputs = {
      bmi: [{key:'height',label:'Height (cm)',type:'number',placeholder:'e.g. 170'},{key:'weight',label:'Weight (kg)',type:'number',placeholder:'e.g. 70'}],
      pack_years: [{key:'cigarettesPerDay',label:'Cigarettes/day',type:'number',placeholder:'e.g. 20'},{key:'yearsSmoked',label:'Years smoked',type:'number',placeholder:'e.g. 15'}],
      mean_arterial_pressure: [{key:'sbp',label:'Systolic BP',type:'number',placeholder:'e.g. 120'},{key:'dbp',label:'Diastolic BP',type:'number',placeholder:'e.g. 80'}],
      shock_index: [{key:'hr',label:'Heart rate',type:'number',placeholder:'e.g. 90'},{key:'sbp',label:'Systolic BP',type:'number',placeholder:'e.g. 120'}],
      mrc_dyspnea_scale: [{key:'grade',label:'MRC grade (1-5)',type:'number',placeholder:'e.g. 3'}],
      phq_2: [{key:'score',label:'PHQ-2 score (0-6)',type:'number',placeholder:'e.g. 3'}],
      phq_9: [{key:'score',label:'PHQ-9 score (0-27)',type:'number',placeholder:'e.g. 10'}],
      gad_7: [{key:'score',label:'GAD-7 score (0-21)',type:'number',placeholder:'e.g. 8'}],
      epworth_sleepiness_scale: [{key:'score',label:'Epworth score (0-24)',type:'number',placeholder:'e.g. 12'}],
      ipss: [{key:'score',label:'IPSS score (0-35)',type:'number',placeholder:'e.g. 15'}]
    };
    return inputs[calcId] || [];
  }

  function doCalc(calcId) {
    var values = {};
    var inputs = getCalcInputs(calcId);
    for (var ii = 0; ii < inputs.length; ii++) {
      var el = document.getElementById('calc-' + calcId + '-' + inputs[ii].key);
      values[inputs[ii].key] = el ? parseFloat(el.value) : NaN;
    }
    
    var result = computeCalc(calcId, values);
    if (result === null || result.error) {
      alert(result ? result.error : 'Please enter valid values.');
      return;
    }
    
    if (!state.calculatorResults) state.calculatorResults = {};
    state.calculatorResults[calcId] = {
      values: values,
      result: result.text,
      included: state.calculatorResults[calcId] ? state.calculatorResults[calcId].included || false : false
    };
    
    // Update display
    var resultDiv = document.getElementById('calc-result-' + calcId);
    if (resultDiv) {
      resultDiv.style.display = 'block';
      document.getElementById('calc-result-text-' + calcId).textContent = result.text;
    }
    
    // Add include button if not present
    var actionsDiv = resultDiv ? resultDiv.nextElementSibling : null;
    if (actionsDiv) {
      var existingBtn = document.getElementById('calc-include-btn-' + calcId);
      if (!existingBtn) {
        var btn = document.createElement('button');
        btn.className = 'v4-btn v4-btn-sm v4-btn-outline';
        btn.id = 'calc-include-btn-' + calcId;
        btn.textContent = 'Include in draft';
        btn.onclick = function() { toggleCalcInclude(calcId); };
        actionsDiv.insertBefore(btn, actionsDiv.firstChild.nextSibling || actionsDiv.firstChild);
      }
    }
  }

  function toggleCalcInclude(calcId) {
    if (!state.calculatorResults || !state.calculatorResults[calcId]) return;
    state.calculatorResults[calcId].included = !state.calculatorResults[calcId].included;
    var btn = document.getElementById('calc-include-btn-' + calcId);
    if (btn) {
      btn.textContent = state.calculatorResults[calcId].included ? 'Included in draft' : 'Include in draft';
      btn.className = 'v4-btn v4-btn-sm ' + (state.calculatorResults[calcId].included ? 'v4-btn-primary' : 'v4-btn-outline');
    }
  }

  function clearCalc(calcId) {
    if (state.calculatorResults) delete state.calculatorResults[calcId];
    var inputs = getCalcInputs(calcId);
    for (var ii = 0; ii < inputs.length; ii++) {
      var el = document.getElementById('calc-' + calcId + '-' + inputs[ii].key);
      if (el) el.value = '';
    }
    var resultDiv = document.getElementById('calc-result-' + calcId);
    if (resultDiv) resultDiv.style.display = 'none';
    var btn = document.getElementById('calc-include-btn-' + calcId);
    if (btn) btn.remove();
  }

  function onCalcInputChange(calcId, key, value) {
    if (!state.calculatorResults) state.calculatorResults = {};
    if (!state.calculatorResults[calcId]) state.calculatorResults[calcId] = { values: {}, result: '', included: false };
    if (!state.calculatorResults[calcId].values) state.calculatorResults[calcId].values = {};
    state.calculatorResults[calcId].values[key] = value;
  }

  function computeCalc(calcId, v) {
    var calcFns = {
      bmi: function() { if (isNaN(v.height) || isNaN(v.weight) || v.height <= 0) return null; var h = v.height / 100; var bmi = v.weight / (h * h); return { text: bmi.toFixed(1) + ' kg/m\\u00b2. Clinician interpretation required.', value: bmi }; },
      pack_years: function() { if (isNaN(v.cigarettesPerDay) || isNaN(v.yearsSmoked)) return null; var py = (v.cigarettesPerDay / 20) * v.yearsSmoked; return { text: py.toFixed(1) + ' pack-years.', value: py }; },
      mean_arterial_pressure: function() { if (isNaN(v.sbp) || isNaN(v.dbp)) return null; var map = v.dbp + (v.sbp - v.dbp) / 3; return { text: map.toFixed(0) + ' mmHg. Clinician interpretation required.', value: map }; },
      shock_index: function() { if (isNaN(v.hr) || isNaN(v.sbp) || v.sbp <= 0) return null; var si = v.hr / v.sbp; return { text: si.toFixed(2) + '. Clinician interpretation required.', value: si }; },
      mrc_dyspnea_scale: function() { if (isNaN(v.grade) || v.grade < 1 || v.grade > 5) return null; var grades = ['not troubled by breathlessness except on strenuous exercise','short of breath when hurrying on level or walking up a slight hill','walks slower than同龄人 on level because of breathlessness, or stops for breath when walking at own pace','stops for breath after walking about 100m or after a few minutes on level','too breathless to leave the house, or breathless when dressing/undressing']; return { text: 'MRC dyspnea grade ' + v.grade + ': ' + grades[Math.round(v.grade)-1] + '. Clinician interpretation required.', value: v.grade }; },
      phq_2: function() { if (isNaN(v.score) || v.score < 0 || v.score > 6) return null; var risk = v.score >= 3 ? 'Further evaluation may be considered per clinician judgment.' : 'Score below typical screening threshold.'; return { text: 'PHQ-2 score: ' + v.score + '/6. ' + risk + ' Clinician interpretation required.', value: v.score }; },
      phq_9: function() { if (isNaN(v.score) || v.score < 0 || v.score > 27) return null; var sev = v.score <= 4 ? 'minimal' : v.score <= 9 ? 'mild' : v.score <= 14 ? 'moderate' : v.score <= 19 ? 'moderately severe' : 'severe'; return { text: 'PHQ-9 score: ' + v.score + '/27 (' + sev + '). Clinician interpretation required.', value: v.score }; },
      gad_7: function() { if (isNaN(v.score) || v.score < 0 || v.score > 21) return null; var sev = v.score <= 4 ? 'minimal' : v.score <= 9 ? 'mild' : v.score <= 14 ? 'moderate' : 'severe'; return { text: 'GAD-7 score: ' + v.score + '/21 (' + sev + '). Clinician interpretation required.', value: v.score }; },
      epworth_sleepiness_scale: function() { if (isNaN(v.score) || v.score < 0 || v.score > 24) return null; var sev = v.score <= 10 ? 'normal range' : v.score <= 12 ? 'borderline' : v.score <= 15 ? 'mild to moderate' : 'severe'; return { text: 'Epworth Sleepiness Scale: ' + v.score + '/24 (' + sev + ' sleepiness). Clinician interpretation required.', value: v.score }; },
      ipss: function() { if (isNaN(v.score) || v.score < 0 || v.score > 35) return null; var sev = v.score <= 7 ? 'mildly symptomatic' : v.score <= 19 ? 'moderately symptomatic' : 'severely symptomatic'; return { text: 'IPSS: ' + v.score + '/35 (' + sev + '). Clinician interpretation required.', value: v.score }; }
    };
    if (calcFns[calcId]) return calcFns[calcId]();
    return null;
  }
'''[1:]  # Remove leading newline

# 2. Update getRelatedCalcs to return full metadata
replacements['getRelatedCalcs'] = '''
function getRelatedCalcs(wfId) {
    try {
      var data = window.NAJM_CLINICAL_DATA;
      if (!data || !data.calculators || !data.calculator_workflow_mapping) return [];
      var mapping = data.calculator_workflow_mapping;
      var mapList = mapping[wfId] || [];
      var result = [];
      for (var i = 0; i < mapList.length; i++) {
        var calcItem = mapList[i];
        var calcId = typeof calcItem === 'string' ? calcItem : calcItem.calculator_id;
        var calcDef = data.calculators[calcId];
        if (calcDef && calcDef.risk_level !== 'high' && calcDef.implementation_status === 'implemented') {
          result.push({
            id: calcId,
            name: calcDef.display_name || calcId,
            desc: calcDef.relevance_reason || ''
          });
        }
      }
      return result;
    } catch(e) { return []; }
  }
'''

# Print for verification
for name, code in replacements.items():
    print(f"=== {name} ===")
    print(f"{len(code)} chars")
    print(code[:200])
    print("...")
    print()
