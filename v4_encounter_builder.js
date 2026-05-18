(function() {
  "use strict";

  var historyTemplates = null;
  var examTemplates = null;
  var planTemplates = null;
  var calculatorMappings = null;
  var historyBySpecialty = {};
  var examBySpecialty = {};
  var planBySpecialty = {};
  var calculatorByWorkflow = {};
  var loadingStarted = false;
  var patched = false;
  var state = {
    historyAnswers: {},
    examSelected: {},
    planSelected: {},
    calculatorResults: {},
    calculatorIncluded: {},
    outputTab: "emr",
    outputs: null
  };

  var LOW_RISK_CALCULATORS = [
    { id: "bmi", name: "BMI" },
    { id: "pack_years", name: "Pack years" },
    { id: "mean_arterial_pressure", name: "Mean arterial pressure" },
    { id: "shock_index", name: "Shock index" },
    { id: "mrc_dyspnea_scale", name: "MRC dyspnea scale" }
  ];

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    return params.get("v4") === "encounter" && window.CLINICNOTE_DATA_MODE === "v2";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function clean(value) {
    if (typeof window.cleanOutputPhrase === "function") return window.cleanOutputPhrase(value);
    return String(value || "").trim();
  }

  function panel() {
    return document.getElementById("v4EncounterBuilderPanel");
  }

  function hidePanel() {
    var p = panel();
    if (!p) return;
    p.classList.remove("v4-encounter-visible");
    p.style.display = "none";
    p.innerHTML = "";
  }

  function indexBySpecialty(list, target) {
    for (var i = 0; i < (list || []).length; i++) {
      var item = list[i];
      if (!item) continue;
      target[item.specialty_id] = item;
      target[item.specialty_name] = item;
      target[normalize(item.specialty_id)] = item;
      target[normalize(item.specialty_name)] = item;
    }
  }

  function indexMappings(list) {
    calculatorByWorkflow = {};
    for (var i = 0; i < (list || []).length; i++) {
      if (list[i] && list[i].workflow_id) calculatorByWorkflow[list[i].workflow_id] = list[i];
    }
  }

  function loadData(callback) {
    if (historyTemplates && examTemplates && planTemplates && calculatorMappings) {
      callback();
      return;
    }
    if (loadingStarted) {
      setTimeout(function() { loadData(callback); }, 80);
      return;
    }
    loadingStarted = true;
    Promise.all([
      fetch("./data/v3_specialty_history_templates.json", { cache: "no-store" }).then(function(r) { if (!r.ok) throw new Error("history templates"); return r.json(); }),
      fetch("./data/v3_exam_prompt_templates.json", { cache: "no-store" }).then(function(r) { if (!r.ok) throw new Error("exam templates"); return r.json(); }),
      fetch("./data/v3_plan_prompt_templates.json", { cache: "no-store" }).then(function(r) { if (!r.ok) throw new Error("plan templates"); return r.json(); }),
      fetch("./data/v3_calculator_workflow_map.json", { cache: "no-store" }).then(function(r) { if (!r.ok) throw new Error("calculator mappings"); return r.json(); })
    ]).then(function(results) {
      historyTemplates = Array.isArray(results[0]) ? results[0] : [];
      examTemplates = Array.isArray(results[1]) ? results[1] : [];
      planTemplates = Array.isArray(results[2]) ? results[2] : [];
      calculatorMappings = Array.isArray(results[3]) ? results[3] : [];
      indexBySpecialty(historyTemplates, historyBySpecialty);
      indexBySpecialty(examTemplates, examBySpecialty);
      indexBySpecialty(planTemplates, planBySpecialty);
      indexMappings(calculatorMappings);
      callback();
    }).catch(function(error) {
      var p = panel();
      if (p && isEnabled()) {
        p.classList.add("v4-encounter-visible");
        p.style.display = "block";
        p.innerHTML = '<div class="v4-encounter-title">Advanced Encounter Builder</div><div class="v4-encounter-safety">V4 local data could not be loaded. The normal OPD generator is unchanged.</div>';
      }
      console.warn("ClinicNote V4 encounter builder could not load local JSON assets", error);
    });
  }

  function resolveWorkflow() {
    var visitSelect = document.getElementById("speedVisitType");
    var visitName = visitSelect ? visitSelect.value : "";
    var specKey = window.currentSpecialty || "";
    if (typeof window.v2resolveSelectedWorkflow === "function" && visitName && specKey) {
      return window.v2resolveSelectedWorkflow(specKey, visitName);
    }
    return null;
  }

  function currentSpecialtyName() {
    var resolved = resolveWorkflow();
    if (resolved && resolved.specialty) return resolved.specialty.display_name || resolved.specialty.specialty_id || "";
    return window.currentSpecialty || "";
  }

  function currentWorkflowId() {
    var resolved = resolveWorkflow();
    return resolved && resolved.workflow_id ? resolved.workflow_id : "";
  }

  function currentWorkflowName() {
    return window.currentVisitType || "";
  }

  function templateFor(map) {
    var name = currentSpecialtyName();
    return map[name] || map[normalize(name)] || null;
  }

  function filterSections(sections, workflowId) {
    var source = sections ? sections.slice() : [];
    if (!workflowId) return source;
    var matched = [];
    for (var i = 0; i < source.length; i++) {
      var ids = source[i].applicable_workflow_ids || [];
      if (!ids.length || ids.indexOf(workflowId) >= 0) matched.push(source[i]);
    }
    return matched.length ? matched : source;
  }

  function historyKey(section, prompt) {
    return "h__" + (section.section_id || "section") + "__" + (prompt.prompt_id || "prompt");
  }

  function promptKey(prefix, section, prompt) {
    return prefix + "__" + (section.section_id || "section") + "__" + (prompt.prompt_id || "prompt");
  }

  function selectedChipValues(containerId) {
    if (typeof window.getSelectedChips === "function") {
      var items = window.getSelectedChips(containerId) || [];
      var out = [];
      for (var i = 0; i < items.length; i++) {
        var item = clean(items[i]);
        if (item) out.push(item);
      }
      return out;
    }
    return [];
  }

  function opdIngredients() {
    return {
      symptoms: selectedChipValues("speedSymptoms"),
      negatives: selectedChipValues("speedNegs"),
      exam: selectedChipValues("speedExam"),
      redFlags: selectedChipValues("speedRedFlags"),
      investigations: selectedChipValues("speedInvs"),
      plans: selectedChipValues("speedPlans"),
      followUps: typeof window.v2getSelectedChips === "function" ? window.v2getSelectedChips("speedFollowupChips") : [],
      duration: clean((document.getElementById("speedDuration") || {}).value),
      impression: clean((document.getElementById("speedImpression") || {}).value) || "[not documented]",
      plan: clean((document.getElementById("speedPlan") || {}).value) || "[not documented]",
      followup: clean((document.getElementById("speedFollowup") || {}).value),
      referralReason: clean((document.getElementById("speedReferralReason") || {}).value),
      referralSpecialty: clean((document.getElementById("speedReferralSpecialty") || {}).value)
    };
  }

  function detectIdentifier(text) {
    if (!text || !String(text).trim()) return false;
    if (typeof window.detectReportPHI === "function" && window.detectReportPHI(text)) return true;
    var patterns = [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      /(\+?\d{1,4}[-.\s]?\d{5,15})|(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/,
      /\b(MRN|medical\s*record|record\s*number|patient\s*id|emirates\s*id|eid|id\s*number)\s*[:#-]?\s*[A-Za-z0-9-]{3,}\b/i,
      /\b(date\s*of\s*birth|dob|d\.?\s*o\.?\s*b\.?)\s*[:#-]?\s*\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/i,
      /\b784[-\s]?\d{4}[-\s]?\d{7}[-\s]?\d\b/
    ];
    for (var i = 0; i < patterns.length; i++) if (patterns[i].test(text)) return true;
    return false;
  }

  function updatePhiWarning() {
    var found = false;
    for (var key in state.historyAnswers) {
      if (Object.prototype.hasOwnProperty.call(state.historyAnswers, key) && detectIdentifier(state.historyAnswers[key])) found = true;
    }
    var warning = document.getElementById("v4PhiWarning");
    if (warning) warning.classList.toggle("show", found);
  }

  function answeredHistoryLines() {
    var template = templateFor(historyBySpecialty);
    var lines = [];
    if (!template) return lines;
    var sections = (template.sections || []).slice().sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    for (var i = 0; i < sections.length; i++) {
      var prompts = sections[i].prompts || [];
      for (var p = 0; p < prompts.length; p++) {
        var value = clean(state.historyAnswers[historyKey(sections[i], prompts[p])]);
        if (value) lines.push((prompts[p].prompt_text || prompts[p].prompt_id || "History") + ": " + value);
      }
    }
    return lines;
  }

  function selectedPromptLines(kind) {
    var template = kind === "exam" ? templateFor(examBySpecialty) : templateFor(planBySpecialty);
    var selected = kind === "exam" ? state.examSelected : state.planSelected;
    var sectionField = kind === "exam" ? "exam_sections" : "plan_sections";
    var prefix = kind === "exam" ? "e" : "p";
    var lines = [];
    if (!template) return lines;
    var sections = filterSections(template[sectionField], currentWorkflowId()).sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    for (var i = 0; i < sections.length; i++) {
      var prompts = sections[i].prompts || [];
      for (var p = 0; p < prompts.length; p++) {
        if (selected[promptKey(prefix, sections[i], prompts[p])]) lines.push(prompts[p].prompt_text || prompts[p].prompt_id || "");
      }
    }
    return lines;
  }

  function includedCalculatorLines() {
    var out = [];
    for (var id in state.calculatorResults) {
      if (Object.prototype.hasOwnProperty.call(state.calculatorResults, id) && state.calculatorIncluded[id] && state.calculatorResults[id]) {
        out.push(state.calculatorResults[id]);
      }
    }
    return out;
  }

  function countSummaryText(items, emptyText) {
    return items && items.length ? String(items.length) + " selected" : emptyText;
  }

  function renderSummary() {
    var opd = opdIngredients();
    var chipCount = opd.symptoms.length + opd.negatives.length + opd.exam.length + opd.redFlags.length + opd.investigations.length + opd.plans.length + opd.followUps.length;
    var history = answeredHistoryLines();
    var exam = selectedPromptLines("exam");
    var plan = selectedPromptLines("plan");
    var calcs = includedCalculatorLines();
    return (
      '<div class="v4-summary-card">' +
        '<h4>Encounter draft ingredients</h4>' +
        '<div class="v4-summary-group"><strong>Workflow</strong>' + escapeHtml(currentWorkflowName() || "Not selected") + '</div>' +
        '<div class="v4-summary-group"><strong>OPD chips</strong>' + countSummaryText(new Array(chipCount), "No chips selected yet") + '</div>' +
        '<div class="v4-summary-group"><strong>History entries</strong>' + countSummaryText(history, "No history answers yet") + '</div>' +
        '<div class="v4-summary-group"><strong>Exam documentation</strong>' + countSummaryText(exam, "No exam prompts selected") + '</div>' +
        '<div class="v4-summary-group"><strong>Plan documentation</strong>' + countSummaryText(plan, "No plan prompts selected") + '</div>' +
        '<div class="v4-summary-group"><strong>Calculator results</strong>' + countSummaryText(calcs, "No calculator results included") + '</div>' +
      '</div>'
    );
  }

  function renderHistoryStep() {
    var template = templateFor(historyBySpecialty);
    if (!template) return '<div class="v4-step-body"><div class="v3-history-status">Select a workflow to load matching V3 history prompts.</div></div>';
    var sections = (template.sections || []).slice().sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    var html = '<div class="v4-step-body"><div class="v3-history-safety">History capture is temporary browser memory only. Do not enter patient identifiers.</div><div id="v4PhiWarning" class="phi-warning">Possible patient-identifiable information detected. Remove identifiers before copying or using this draft.</div>';
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var prompts = section.prompts || [];
      html += '<details class="v3-history-section">';
      html += '<summary>' + escapeHtml(section.section_label || section.section_id || "History section") + ' <span class="v3-history-label">' + prompts.length + ' prompts</span></summary>';
      html += '<div class="v3-history-section-body">';
      if (section.safety_note) html += '<div class="v3-history-section-note">' + escapeHtml(section.safety_note) + '</div>';
      for (var p = 0; p < prompts.length; p++) {
        var prompt = prompts[p];
        var key = historyKey(section, prompt);
        var value = state.historyAnswers[key] || "";
        html += '<div class="v4-field"><label for="v4History_' + escapeHtml(key) + '">' + escapeHtml(prompt.prompt_text || prompt.prompt_id || "History prompt") + '</label>';
        if (prompt.input_type === "textarea") {
          html += '<textarea id="v4History_' + escapeHtml(key) + '" data-v4-history="' + escapeHtml(key) + '" oninput="window.ClinicNoteV4Encounter.updateHistory(this)">' + escapeHtml(value) + '</textarea>';
        } else if (prompt.input_type === "select" || prompt.input_type === "multi_select") {
          html += '<select id="v4History_' + escapeHtml(key) + '" data-v4-history="' + escapeHtml(key) + '" ' + (prompt.input_type === "multi_select" ? "multiple " : "") + 'onchange="window.ClinicNoteV4Encounter.updateHistory(this)">';
          html += '<option value="">Not documented</option>';
          var values = prompt.values || [];
          for (var v = 0; v < values.length; v++) {
            var option = String(values[v]);
            var selected = prompt.input_type === "multi_select" ? String(value).split(" | ").indexOf(option) >= 0 : value === option;
            html += '<option value="' + escapeHtml(option) + '"' + (selected ? " selected" : "") + '>' + escapeHtml(option) + '</option>';
          }
          html += '</select>';
        } else if (prompt.input_type === "boolean") {
          html += '<select id="v4History_' + escapeHtml(key) + '" data-v4-history="' + escapeHtml(key) + '" onchange="window.ClinicNoteV4Encounter.updateHistory(this)"><option value="">Not documented</option><option value="Yes"' + (value === "Yes" ? " selected" : "") + '>Yes</option><option value="No"' + (value === "No" ? " selected" : "") + '>No</option></select>';
        } else {
          var type = prompt.input_type === "number" || prompt.input_type === "date" ? prompt.input_type : "text";
          html += '<input id="v4History_' + escapeHtml(key) + '" type="' + type + '" data-v4-history="' + escapeHtml(key) + '" value="' + escapeHtml(value) + '" oninput="window.ClinicNoteV4Encounter.updateHistory(this)">';
        }
        html += '<div class="v4-meta"><span class="v4-pill">' + escapeHtml(prompt.required_level || "optional") + '</span><span class="v4-pill">' + escapeHtml(prompt.input_type || "text") + '</span></div>';
        if (prompt.warning) html += '<div class="v4-warning">' + escapeHtml(prompt.warning) + '</div>';
        html += '</div>';
      }
      html += '</div></details>';
    }
    html += '</div>';
    return html;
  }

  function renderChecklistStep(kind) {
    var template = kind === "exam" ? templateFor(examBySpecialty) : templateFor(planBySpecialty);
    var sectionField = kind === "exam" ? "exam_sections" : "plan_sections";
    var prefix = kind === "exam" ? "e" : "p";
    var selected = kind === "exam" ? state.examSelected : state.planSelected;
    var empty = kind === "exam" ? "Select a workflow to load examination documentation prompts." : "Select a workflow to load plan documentation prompts.";
    var safety = kind === "exam" ? "Examination documentation prompts. Document only if assessed." : "Plan documentation prompts. Use only if discussed or decided by clinician.";
    if (!template) return '<div class="v4-step-body"><div class="v3-history-status">' + empty + '</div></div>';
    var sections = filterSections(template[sectionField], currentWorkflowId()).sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    var html = '<div class="v4-step-body"><div class="v3-history-safety">' + escapeHtml(safety) + '</div>';
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var prompts = section.prompts || [];
      html += '<details class="v3-history-section">';
      html += '<summary>' + escapeHtml(section.section_label || section.section_id || "Documentation section") + ' <span class="v3-history-label">' + prompts.length + ' prompts</span></summary>';
      html += '<div class="v3-history-section-body">';
      if (section.safety_note) html += '<div class="v3-history-section-note">' + escapeHtml(section.safety_note) + '</div>';
      for (var p = 0; p < prompts.length; p++) {
        var prompt = prompts[p];
        var key = promptKey(prefix, section, prompt);
        html += '<label class="v4-check"><input type="checkbox" data-v4-' + kind + '="' + escapeHtml(key) + '" onchange="window.ClinicNoteV4Encounter.togglePrompt(\'' + kind + '\',this)"' + (selected[key] ? " checked" : "") + '><span><strong>' + escapeHtml(prompt.prompt_text || prompt.prompt_id || "") + '</strong><span class="v4-meta"><span class="v4-pill">' + escapeHtml(prompt.required_level || "optional") + '</span><span class="v4-pill">' + escapeHtml(prompt.prompt_type || "documentation") + '</span></span></span></label>';
      }
      html += '</div></details>';
    }
    html += '</div>';
    return html;
  }

  function suggestedCalculatorIds() {
    var mapping = calculatorByWorkflow[currentWorkflowId()];
    var ids = {};
    var ordered = [];
    var list = mapping && Array.isArray(mapping.suggested_calculators) ? mapping.suggested_calculators.slice() : [];
    list.sort(function(a, b) { return (a.display_priority || 99) - (b.display_priority || 99); });
    for (var i = 0; i < list.length; i++) {
      if (list[i].implementation_status === "implemented" && list[i].risk_level === "low") {
        ids[list[i].calculator_id] = true;
        ordered.push(list[i].calculator_id);
      }
    }
    for (var j = 0; j < LOW_RISK_CALCULATORS.length; j++) {
      if (!ids[LOW_RISK_CALCULATORS[j].id]) ordered.push(LOW_RISK_CALCULATORS[j].id);
    }
    return ordered;
  }

  function calculatorName(id) {
    for (var i = 0; i < LOW_RISK_CALCULATORS.length; i++) if (LOW_RISK_CALCULATORS[i].id === id) return LOW_RISK_CALCULATORS[i].name;
    return id;
  }

  function calculatorFields(id) {
    if (id === "bmi") return '<div class="v4-field"><label>Height (cm)</label><input id="v4Calc_bmi_height" type="number" min="1"></div><div class="v4-field"><label>Weight (kg)</label><input id="v4Calc_bmi_weight" type="number" min="1"></div>';
    if (id === "pack_years") return '<div class="v4-field"><label>Cigarettes per day</label><input id="v4Calc_pack_years_cigarettes" type="number" min="0"></div><div class="v4-field"><label>Years smoked</label><input id="v4Calc_pack_years_years" type="number" min="0"></div>';
    if (id === "mean_arterial_pressure") return '<div class="v4-field"><label>Systolic BP</label><input id="v4Calc_mean_arterial_pressure_sbp" type="number" min="1"></div><div class="v4-field"><label>Diastolic BP</label><input id="v4Calc_mean_arterial_pressure_dbp" type="number" min="1"></div>';
    if (id === "shock_index") return '<div class="v4-field"><label>Heart rate</label><input id="v4Calc_shock_index_hr" type="number" min="1"></div><div class="v4-field"><label>Systolic BP</label><input id="v4Calc_shock_index_sbp" type="number" min="1"></div>';
    if (id === "mrc_dyspnea_scale") return '<div class="v4-field"><label>MRC dyspnea grade</label><select id="v4Calc_mrc_dyspnea_scale_grade"><option value="">Select grade</option><option value="1">1 - Breathless only with strenuous exercise</option><option value="2">2 - Short of breath when hurrying or walking up a slight hill</option><option value="3">3 - Slower than same age or stops when walking at own pace</option><option value="4">4 - Stops after about 100 meters or a few minutes</option><option value="5">5 - Too breathless to leave house or when dressing</option></select></div>';
    return "";
  }

  function renderCalculatorStep() {
    var ids = suggestedCalculatorIds();
    var html = '<div class="v4-step-body"><div class="v3-history-safety">Optional related calculator. Use only if clinically relevant. Clinician-entered values only. Results require clinician interpretation.</div>';
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var result = state.calculatorResults[id] || "";
      html += '<details class="v3-history-section">';
      html += '<summary>' + escapeHtml(calculatorName(id)) + (i < 2 ? ' <span class="v3-history-label">related</span>' : ' <span class="v3-history-label">optional</span>') + '</summary>';
      html += '<div class="v3-history-section-body">' + calculatorFields(id);
      html += '<div class="v4-actions"><button type="button" class="btn btn-outline btn-xs" onclick="window.ClinicNoteV4Encounter.calculate(\'' + escapeHtml(id) + '\')">Calculate</button><button type="button" class="btn btn-ghost btn-xs" onclick="window.ClinicNoteV4Encounter.clearCalculator(\'' + escapeHtml(id) + '\')">Clear</button></div>';
      html += '<div id="v4CalcResult_' + escapeHtml(id) + '" class="v3-edit-preview" style="margin-top:8px">' + escapeHtml(result || "Result will appear here.") + '</div>';
      html += '<label class="v4-check"><input type="checkbox" data-v4-calculator-include="' + escapeHtml(id) + '" onchange="window.ClinicNoteV4Encounter.includeCalculator(this)"' + (state.calculatorIncluded[id] ? " checked" : "") + (result ? "" : " disabled") + '> <span>Include this calculator result in the combined draft</span></label>';
      html += '</div></details>';
    }
    html += '</div>';
    return html;
  }

  function renderOutputStep() {
    var tabs = [
      ["emr", "Advanced EMR note"],
      ["soap", "Advanced SOAP note"],
      ["ref", "Referral draft"],
      ["inst", "Patient instructions"]
    ];
    var html = '<div class="v4-step-body"><div class="v4-output-tabs">';
    for (var i = 0; i < tabs.length; i++) {
      html += '<button type="button" class="' + (state.outputTab === tabs[i][0] ? "active" : "") + '" onclick="window.ClinicNoteV4Encounter.switchTab(\'' + tabs[i][0] + '\')">' + tabs[i][1] + '</button>';
    }
    html += '</div><div id="v4OutputBox" class="v4-output-box">' + escapeHtml((state.outputs && state.outputs[state.outputTab]) || "Generate a combined draft to preview V4 output here.") + '</div>';
    html += '<div class="v4-actions"><button type="button" class="btn btn-primary btn-sm" onclick="window.ClinicNoteV4Encounter.generateDraft()">Generate combined draft</button><button type="button" class="btn btn-outline btn-sm" onclick="window.ClinicNoteV4Encounter.copyDraft()">Copy current draft</button><button type="button" class="btn btn-ghost btn-sm" onclick="window.ClinicNoteV4Encounter.clearV4()">Clear V4 entries</button></div></div>';
    return html;
  }

  function renderWorkflowStep() {
    var workflow = currentWorkflowName();
    var status = workflow ? "Selected workflow: " + workflow + ". Autofill chips below remain editable and removable." : "Use the existing OPD search above to select a workflow. Autofill will load defaults when available.";
    return '<div class="v4-step-body"><div class="v3-history-status">' + escapeHtml(status) + '</div><div class="v3-history-section-note">Step 1 uses the existing OPD Speed Mode workflow selector and chip groups. V4 does not change the normal OPD generator.</div></div>';
  }

  function render() {
    var p = panel();
    if (!p) return;
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    if (!historyTemplates || !examTemplates || !planTemplates || !calculatorMappings) {
      p.classList.add("v4-encounter-visible");
      p.style.display = "block";
      p.innerHTML = '<div class="v4-encounter-title">Advanced Encounter Builder</div><div class="v3-history-status">Loading V4 encounter builder...</div>';
      loadData(render);
      return;
    }

    p.classList.add("v4-encounter-visible");
    p.style.display = "block";
    p.innerHTML =
      '<div class="v4-encounter-header"><div><div class="v4-encounter-title">Advanced Encounter Builder</div><div class="v4-encounter-subtitle">Internal prototype. Combines documentation prompts into one clinician-reviewed draft. Do not enter patient identifiers.</div></div><span class="v4-encounter-badge">Internal V4 prototype</span></div>' +
      '<div class="v4-encounter-safety">This tool structures clinician-entered, de-identified information only. It does not diagnose, recommend treatment, or replace clinician judgment.</div>' +
      '<div class="v4-encounter-grid"><div>' +
        '<details class="v4-step" open><summary>Step 1 - Select workflow and Autofill chips</summary>' + renderWorkflowStep() + '</details>' +
        '<details class="v4-step"><summary>Step 2 - History</summary>' + renderHistoryStep() + '</details>' +
        '<details class="v4-step"><summary>Step 3 - Examination documentation</summary>' + renderChecklistStep("exam") + '</details>' +
        '<details class="v4-step"><summary>Step 4 - Plan documentation</summary>' + renderChecklistStep("plan") + '</details>' +
        '<details class="v4-step"><summary>Step 5 - Related calculators</summary>' + renderCalculatorStep() + '</details>' +
        '<details class="v4-step" open><summary>Step 6 - Generate combined draft</summary>' + renderOutputStep() + '</details>' +
      '</div>' + renderSummary() + '</div>';
    updatePhiWarning();
  }

  function updateSummaryOnly() {
    var card = panel() ? panel().querySelector(".v4-summary-card") : null;
    if (card) card.outerHTML = renderSummary();
    var box = document.getElementById("v4OutputBox");
    if (box && state.outputs) box.textContent = state.outputs[state.outputTab] || "";
    updatePhiWarning();
  }

  function setResult(id, text) {
    state.calculatorResults[id] = text;
    state.calculatorIncluded[id] = false;
    var el = document.getElementById("v4CalcResult_" + id);
    if (el) el.textContent = text || "Result will appear here.";
    var checkbox = document.querySelector('[data-v4-calculator-include="' + id + '"]');
    if (checkbox) {
      checkbox.disabled = !text;
      checkbox.checked = false;
    }
    updateSummaryOnly();
  }

  function generateOutputs() {
    var opd = opdIngredients();
    var history = answeredHistoryLines();
    var exam = selectedPromptLines("exam");
    var planDocs = selectedPromptLines("plan");
    var calcs = includedCalculatorLines();
    var footer = "Draft generated from clinician-entered de-identified information. Review, edit, and approve before use. Internal V4 prototype only.";
    var workflow = currentWorkflowName() || "[not selected]";
    var specialty = currentSpecialtyName() || "[not selected]";
    var subjective = [];
    if (opd.duration) subjective.push("Duration: " + opd.duration);
    if (opd.symptoms.length) subjective.push("Selected positives: " + opd.symptoms.join(", "));
    if (opd.negatives.length) subjective.push("Relevant negatives: " + opd.negatives.join(", "));
    if (history.length) subjective = subjective.concat(history);
    var objective = [];
    if (opd.exam.length) objective.push("OPD exam chips: " + opd.exam.join(", "));
    if (opd.investigations.length) objective.push("Investigations/results reviewed: " + opd.investigations.join(", "));
    if (exam.length) objective = objective.concat(exam);
    if (calcs.length) objective.push("Calculator documentation: " + calcs.join(" | "));
    var planLines = [];
    if (opd.plan && opd.plan !== "[not documented]") planLines.push(opd.plan);
    if (opd.plans.length) planLines = planLines.concat(opd.plans);
    if (planDocs.length) planLines = planLines.concat(planDocs);
    if (opd.followup) planLines.push("Follow-up: " + opd.followup);
    if (opd.followUps.length) planLines.push("Follow-up documentation: " + opd.followUps.join(", "));
    if (opd.redFlags.length) planLines.push("Safety-netting documented: " + opd.redFlags.join(", "));
    var planText = planLines.length ? planLines.join("\n- ") : "[not documented]";
    var subjText = subjective.length ? subjective.join("\n") : "[not documented]";
    var objText = objective.length ? objective.join("\n") : "[not documented]";
    var impression = opd.impression || "[not documented]";

    var emr = "ADVANCED EMR NOTE\nSpecialty: " + specialty + " | Workflow: " + workflow + "\n\n";
    emr += "History:\n" + subjText + "\n\n";
    emr += "Examination / documentation:\n" + objText + "\n\n";
    emr += "Impression:\n" + impression + "\n\n";
    emr += "Plan documentation:\n- " + planText + "\n\n" + footer;

    var soap = "ADVANCED SOAP NOTE\nSpecialty: " + specialty + " | Workflow: " + workflow + "\n\n";
    soap += "SUBJECTIVE:\n" + subjText + "\n\nOBJECTIVE:\n" + objText + "\n\nASSESSMENT:\n" + impression + "\n\nPLAN:\n- " + planText + "\n\n" + footer;

    var referral = "REFERRAL DRAFT\nSpecialty: " + specialty + " | Workflow: " + workflow + "\n";
    if (opd.referralSpecialty) referral += "Referred to: " + opd.referralSpecialty + "\n";
    referral += "\nReason for referral: " + (opd.referralReason || "[not documented]") + "\n\n";
    referral += "History:\n" + subjText + "\n\nExamination / documentation:\n" + objText + "\n\nWorking impression:\n" + impression + "\n\nCurrent clinician-entered plan:\n- " + planText + "\n\n" + footer;

    var instructions = "PATIENT INSTRUCTIONS DRAFT\n\n";
    instructions += "Assessment: " + impression + "\n\n";
    instructions += "Clinician-entered plan:\n- " + planText + "\n";
    if (opd.redFlags.length) instructions += "\nWhen to seek help:\n- " + opd.redFlags.join("\n- ") + "\n";
    if (opd.followup || opd.followUps.length) instructions += "\nFollow-up: " + (opd.followup || opd.followUps.join(", ")) + "\n";
    instructions += "\n" + footer;

    state.outputs = {
      emr: clean(emr),
      soap: clean(soap),
      ref: clean(referral),
      inst: clean(instructions)
    };
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function(){});
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  function patchWorkflowFunctions() {
    if (patched) return;
    if (typeof window.loadSpeedVisit !== "function" || typeof window.loadSpeedSpecialty !== "function" || typeof window.updateSelectedCount !== "function") {
      setTimeout(patchWorkflowFunctions, 80);
      return;
    }
    patched = true;
    var originalVisit = window.loadSpeedVisit;
    window.loadSpeedVisit = function() {
      var result = originalVisit.apply(this, arguments);
      setTimeout(render, 0);
      return result;
    };
    var originalSpecialty = window.loadSpeedSpecialty;
    window.loadSpeedSpecialty = function() {
      var result = originalSpecialty.apply(this, arguments);
      setTimeout(render, 0);
      return result;
    };
    var originalSummary = window.updateSelectedCount;
    window.updateSelectedCount = function() {
      var result = originalSummary.apply(this, arguments);
      if (isEnabled()) setTimeout(updateSummaryOnly, 0);
      return result;
    };
  }

  function init() {
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    patchWorkflowFunctions();
    if (typeof window.showPage === "function") window.showPage("speed");
    loadData(render);
  }

  window.ClinicNoteV4Encounter = {
    isEnabled: isEnabled,
    render: render,
    updateHistory: function(el) {
      var key = el.getAttribute("data-v4-history");
      if (!key) return;
      if (el.multiple) {
        var values = [];
        for (var i = 0; i < el.options.length; i++) if (el.options[i].selected && el.options[i].value) values.push(el.options[i].value);
        state.historyAnswers[key] = values.join(" | ");
      } else {
        state.historyAnswers[key] = el.value || "";
      }
      updateSummaryOnly();
    },
    togglePrompt: function(kind, el) {
      var key = el.getAttribute("data-v4-" + kind);
      if (!key) return;
      if (kind === "exam") state.examSelected[key] = !!el.checked;
      if (kind === "plan") state.planSelected[key] = !!el.checked;
      updateSummaryOnly();
    },
    calculate: function(id) {
      var tools = window.ClinicNoteCalculators;
      if (!tools) return;
      var result;
      if (id === "bmi") result = tools.calculateBMI(document.getElementById("v4Calc_bmi_height").value, document.getElementById("v4Calc_bmi_weight").value);
      else if (id === "pack_years") result = tools.calculatePackYears(document.getElementById("v4Calc_pack_years_cigarettes").value, document.getElementById("v4Calc_pack_years_years").value);
      else if (id === "mean_arterial_pressure") result = tools.calculateMAP(document.getElementById("v4Calc_mean_arterial_pressure_sbp").value, document.getElementById("v4Calc_mean_arterial_pressure_dbp").value);
      else if (id === "shock_index") result = tools.calculateShockIndex(document.getElementById("v4Calc_shock_index_hr").value, document.getElementById("v4Calc_shock_index_sbp").value);
      else if (id === "mrc_dyspnea_scale") result = tools.classifyMRCDyspnea(document.getElementById("v4Calc_mrc_dyspnea_scale_grade").value);
      if (!result || !result.ok) setResult(id, result && result.error ? result.error : "Unable to calculate. Check entered values.");
      else setResult(id, result.text + " " + result.safetyNote);
    },
    clearCalculator: function(id) {
      var fields = document.querySelectorAll('[id^="v4Calc_' + id + '"]');
      for (var i = 0; i < fields.length; i++) fields[i].value = "";
      state.calculatorResults[id] = "";
      state.calculatorIncluded[id] = false;
      render();
    },
    includeCalculator: function(el) {
      var id = el.getAttribute("data-v4-calculator-include");
      state.calculatorIncluded[id] = !!el.checked;
      updateSummaryOnly();
    },
    generateDraft: function() {
      generateOutputs();
      updateSummaryOnly();
    },
    switchTab: function(tab) {
      state.outputTab = tab;
      render();
    },
    copyDraft: function() {
      copyText(state.outputs ? state.outputs[state.outputTab] : "");
    },
    clearV4: function() {
      state.historyAnswers = {};
      state.examSelected = {};
      state.planSelected = {};
      state.calculatorResults = {};
      state.calculatorIncluded = {};
      state.outputs = null;
      state.outputTab = "emr";
      render();
    },
    _state: state
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", function() {
    if (isEnabled()) {
      patchWorkflowFunctions();
      render();
    }
  });
})();
