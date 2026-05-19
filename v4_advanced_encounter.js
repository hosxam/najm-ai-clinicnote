(function() {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  if (params.get('v4') !== 'encounter2') return;

  // ================================================================
  //  STATE (memory only)
  // ================================================================
  var state = {
    workflowList: [],
    historyDrafts: [],
    examDetails: [],
    planOptions: [],
    investigationOptions: [],

    selectedWorkflowId: null,
    selectedWorkflowDisplay: '',
    selectedWorkflowSpecialty: '',
    selectedWorkflowSafety: '',

    // History
    historyDraft: '',
    defaultHistoryDraft: '',
    historyPlaceholders: [],
    // Mini-fields for bracket placeholder replacement
    miniFields: {},
    // Workflow-specific mini-field defs
    miniFieldDefs: {},

    // Autofill chips captured from OPD (read-only, updated on workflow select)
    capturedChips: {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    },

    // Exam
    examConfirmations: {},

    // Investigations
    investigationConfirmations: {},

    // Plan
    impression: '',
    planText: '',
    planConfirmations: {},
  };

  var currentStep = 1;
  var TOTAL_STEPS = 6;

  // Mini-field definitions per workflow (maps bracket placeholders to input fields)
  function buildMiniFieldDefs(draft) {
    var defs = {};
    if (!draft || !draft.editable_placeholders) return defs;

    var placeholders = draft.editable_placeholders;
    for (var i = 0; i < placeholders.length; i++) {
      var ph = placeholders[i];
      var key = ph.replace(/[\[\]]/g, '').toLowerCase().replace(/[\s\/]+/g, '_');
      var label = ph.replace(/[\[\]]/g, '');
      var isMain = false;

      // Map common placeholders to main fields
      if (ph === '[duration]') { label = 'Duration'; isMain = true; }
      else if (ph.indexOf('additional') >= 0 || ph.indexOf('other') >= 0) { label = label; }
      else if (i < 3) { isMain = true; } // first 3 placeholders are main

      defs[key] = {
        placeholder: ph,
        label: label,
        isMain: isMain,
        value: ''
      };
    }
    return defs;
  }

  var WORKFLOW_SPECIALTY = {
    'gp-fever-urti': 'General Medicine / GP',
    'gp-diabetes-followup': 'General Medicine / GP',
    'msk-low-back-pain': 'Orthopedics / MSK',
    'peds-fever': 'Pediatrics',
    'obgyn-antenatal-followup': 'OB/GYN'
  };

  // ================================================================
  //  DATA LOADING
  // ================================================================
  function loadV4Data() {
    return Promise.all([
      fetch('./data/v4_workflow_history_drafts.json').then(function(r){ return r.json(); }),
      fetch('./data/v4_workflow_exam_details.json').then(function(r){ return r.json(); }),
      fetch('./data/v4_plan_options.json').then(function(r){ return r.json(); }),
      fetch('./data/v4_investigation_options.json').then(function(r){ return r.json(); })
    ]).then(function(results) {
      state.historyDrafts = results[0];
      state.examDetails = results[1];
      state.planOptions = results[2];
      state.investigationOptions = results[3];
      state.workflowList = state.historyDrafts.map(function(d) {
        return {
          workflow_id: d.workflow_id,
          display_name: d.workflow_display_name,
          specialty: WORKFLOW_SPECIALTY[d.workflow_id] || 'Uncategorized',
          safety_note: d.safety_note || ''
        };
      });
    });
  }

  // ================================================================
  //  HELPERS
  // ================================================================
  function esc(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  function getHistoryDraft(wfId) { for (var i = 0; i < state.historyDrafts.length; i++) { if (state.historyDrafts[i].workflow_id === wfId) return state.historyDrafts[i]; } return null; }
  function getExamDetails(wfId) { for (var i = 0; i < state.examDetails.length; i++) { if (state.examDetails[i].workflow_id === wfId) return state.examDetails[i]; } return null; }
  function getPlanOptions(wfId) { for (var i = 0; i < state.planOptions.length; i++) { if (state.planOptions[i].workflow_id === wfId) return state.planOptions[i]; } return null; }
  function getInvestigationOptions(wfId) { for (var i = 0; i < state.investigationOptions.length; i++) { if (state.investigationOptions[i].workflow_id === wfId) return state.investigationOptions[i]; } return null; }

  function getGroupChecked(obj, groupId) { var n = 0; for (var k in obj) { if (k.indexOf(groupId + '::') === 0 && obj[k]) n++; } return n; }
  function getGroupTotal(groupId, groups) { if (!groups) return 0; for (var i = 0; i < groups.length; i++) { if (groups[i].group_id === groupId) return (groups[i].prompts || groups[i].options || []).length; } return 0; }

  // Count selections
  function countExam() { var n = 0; for (var k in state.examConfirmations) { if (state.examConfirmations[k]) n++; } return n; }
  function countInv() { var n = 0; for (var k in state.investigationConfirmations) { if (state.investigationConfirmations[k]) n++; } return n; }
  function countPlan() { var n = 0; for (var k in state.planConfirmations) { if (state.planConfirmations[k]) n++; } return n; }

  // ================================================================
  //  PHI CHECK
  // ================================================================
  function checkPHI(text) {
    if (!text) return false;
    var patterns = [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\b05[0-9]{8}\b/, /\b[\+97105][0-9]{8,10}\b/,
      /\b(?:mrn|medical record|emirates id|insurance id|passport)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i,
      /\b\d{2,3}\s+\d{3}\s+\d{4}\b/
    ];
    for (var i = 0; i < patterns.length; i++) { if (patterns[i].test(text)) return true; }
    return false;
  }
  function checkAllPhi() {
    var found = false;
    ['v4HistoryDraft','v4Impression','v4PlanText'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el && checkPHI(el.value)) found = true;
    });
    var phi = document.getElementById('v4PhiWarning');
    if (phi) phi.style.display = found ? 'block' : 'none';
  }

  // ================================================================
  //  CAPTURE OPD AUTOFILL CHIPS
  // ================================================================
  function captureOPDChips() {
    var chips = { symptoms:[], relevant_negatives:[], exam_findings:[], investigations:[], plan_phrases:[], follow_up:[] };
    var area = document.getElementById('v2ChipGroups');
    if (!area) return chips;

    var selected = area.querySelectorAll('.chip.selected');
    for (var i = 0; i < selected.length; i++) {
      var chip = selected[i];
      var container = chip.getAttribute('data-container') || '';
      var value = chip.getAttribute('data-value') || chip.textContent || '';
      value = value.trim();
      if (!value) continue;

      // Map container ID to chip group
      if (container.indexOf('symptoms') >= 0 || container.indexOf('presenting') >= 0) chips.symptoms.push(value);
      else if (container.indexOf('negatives') >= 0 || container.indexOf('red_flags') >= 0) chips.relevant_negatives.push(value);
      else if (container.indexOf('exam') >= 0 || container.indexOf('findings') >= 0) chips.exam_findings.push(value);
      else if (container.indexOf('investigations') >= 0 || container.indexOf('labs') >= 0) chips.investigations.push(value);
      else if (container.indexOf('plan') >= 0 || container.indexOf('management') >= 0 || container.indexOf('disposition') >= 0) chips.plan_phrases.push(value);
      else if (container.indexOf('follow') >= 0 || container.indexOf('fup') >= 0) chips.follow_up.push(value);
    }

    // Also capture custom entries from the custom entry area
    var customEntries = area.querySelectorAll('[data-v2-custom-entry="true"].chip.selected');
    for (var ci = 0; ci < customEntries.length; ci++) {
      var ce = customEntries[ci];
      var cVal = ce.getAttribute('data-value') || ce.textContent || '';
      cVal = cVal.trim();
      if (!cVal) continue;
      // Put custom entries in symptoms by default
      chips.symptoms.push(cVal);
    }

    return chips;
  }

  // ================================================================
  //  APPLY MINI-FIELDS TO HISTORY DRAFT
  // ================================================================
  function buildHistoryFromMiniFields() {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) return state.historyDraft || '';

    var text = state.historyDraft || draft.default_history_draft;

    // Replace filled placeholders with submitted values
    var defs = state.miniFieldDefs;
    for (var key in defs) {
      var def = defs[key];
      if (def.value && def.value.trim()) {
        text = text.split(def.placeholder).join(def.value.trim());
      }
    }

    // Remove entire sentences containing unfilled placeholders
    text = removePlaceholderSentences(text);

    return text;
  }

  function removePlaceholderSentences(text) {
    if (!text) return '';
    // Remove lines or segments containing bracket placeholders
    // Handle both full sentences and inline fragments
    // Pattern: match any text containing [bracketed] placeholders
    var lines = text.split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.match(/\[[^\]]+\]/)) continue;
      if (line) result.push(line);
    }
    text = result.join('\n');
    // Also handle inline: remove parenthetical sections containing placeholders
    // e.g., "...for [duration]." -> remove the "[duration]" part but keep sentence if other content exists
    text = text.replace(/\[[^\]]+\]/g, '');
    text = text.replace(/\s{2,}/g, ' ').trim();
    // Remove trailing punctuation-only remnants
    text = text.replace(/[\.\,\;]+$/, '').trim();
    return text;
  }

  function updateHistoryDraftFromMiniFields() {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) return;

    var text = state.defaultHistoryDraft || draft.default_history_draft;

    // Replace each filled placeholder
    var defs = state.miniFieldDefs;
    for (var key in defs) {
      var def = defs[key];
      if (def.value && def.value.trim()) {
        text = text.split(def.placeholder).join(def.value.trim());
      }
    }

    // Remove unfilled placeholder sentences
    text = removePlaceholderSentences(text);

    state.historyDraft = text;

    // Update textarea if visible
    var ta = document.getElementById('v4HistoryDraft');
    if (ta) ta.value = text;
    checkAllPhi();
    updateSidebar();
  }

  // ================================================================
  //  RENDER APP
  // ================================================================
  function renderApp() {
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;
    app.classList.add('active');

    var html = '';
    html += '<div class="v4-safety-banner">Do not enter patient names, IDs, MRNs, or contact information. This tool structures de-identified clinician-entered information only.</div>';
    html += '<div class="v4-phi-warning" id="v4PhiWarning" style="display:none">&#9888; Possible identifiable information detected. Remove patient identifiers.</div>';

    // Stepper
    html += '<div class="v4-stepper" id="v4Stepper">';
    var labels = ['Workflow','History','Exam & Investigations','Plan Assist','Calculators','Output'];
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      html += '<div class="v4-s-indicator' + (i === currentStep ? ' active' : '') + (i < currentStep ? ' done' : '') + '" data-idx="' + i + '">';
      html += '<span class="v4-s-num">' + (i < currentStep ? '&#10003;' : i) + '</span>';
      html += '<span class="v4-s-label">' + labels[i - 1] + '</span></div>';
    }
    html += '</div>';

    // Two-col layout
    html += '<div class="v4-layout"><div class="v4-main" id="v4Main"><div class="v4-step-content" id="v4StepContent"></div></div>';
    html += '<div class="v4-sidebar" id="v4Sidebar"><div class="v4-sidebar-inner">';
    html += '<h3 class="v4-sidebar-title">Encounter Draft Ingredients</h3>';
    html += '<div id="v4SidebarContent"><p class="v4-sidebar-empty">Select a workflow to begin.</p></div></div></div></div>';

    // Nav
    html += '<div class="v4-nav">';
    html += '<button class="v4-btn v4-btn-ghost" id="v4PrevBtn" onclick="window._v4Prev()"' + (currentStep <= 1 ? ' disabled' : '') + '>Back</button>';
    html += '<div class="v4-nav-right">';
    html += '<span class="v4-step-info">' + currentStep + ' / ' + TOTAL_STEPS + '</span>';
    html += '<button class="v4-btn v4-btn-primary" id="v4NextBtn" onclick="window._v4Next()">' + (currentStep >= TOTAL_STEPS ? 'Finish' : 'Next') + '</button></div></div>';

    app.innerHTML = html;
    renderStep(currentStep);
    updateSidebar();
  }

  function renderStep(step) {
    var container = document.getElementById('v4StepContent');
    if (!container) return;
    var html = '';
    switch (step) {
      case 1: html = stepWorkflow(); break;
      case 2: html = stepHistory(); break;
      case 3: html = stepExamInv(); break;
      case 4: html = stepPlan(); break;
      case 5: html = stepCalc(); break;
      case 6: html = stepOutput(); break;
    }
    container.innerHTML = html;
    checkAllPhi();
    updateNav();
  }

  function updateNav() {
    var prev = document.getElementById('v4PrevBtn');
    var next = document.getElementById('v4NextBtn');
    var info = document.querySelector('.v4-step-info');
    if (prev) prev.disabled = currentStep <= 1;
    if (next) next.textContent = currentStep >= TOTAL_STEPS ? 'Finish' : 'Next';
    if (info) info.textContent = currentStep + ' / ' + TOTAL_STEPS;
    var inds = document.querySelectorAll('.v4-s-indicator');
    for (var i = 0; i < inds.length; i++) {
      var s = parseInt(inds[i].getAttribute('data-idx'), 10);
      inds[i].className = 'v4-s-indicator' + (s === currentStep ? ' active' : '') + (s < currentStep ? ' done' : '');
    }
  }

  function emptyStep(msg) { return '<div class="v4-empty-state"><p>' + esc(msg) + '</p></div>'; }

  // ================================================================
  //  STEP 1: WORKFLOW
  // ================================================================
  function stepWorkflow() {
    var h = '<h2 class="v4-step-h">Step 1: Select Workflow</h2>';
    h += '<p class="v4-step-d">Select a prototype workflow. Autofill chips from the OPD area (above) will be captured for the output.</p>';

    h += '<div class="v4-wf-search"><label class="v4-field-label">Workflow</label>';
    h += '<select class="v4-select" id="v4WorkflowSelect" onchange="window._v4SelectWf()">';
    h += '<option value="">-- Select a workflow --</option>';
    for (var i = 0; i < state.workflowList.length; i++) {
      var wf = state.workflowList[i];
      h += '<option value="' + esc(wf.workflow_id) + '"' + (wf.workflow_id === state.selectedWorkflowId ? ' selected' : '') + '>' + esc(wf.display_name) + ' (' + esc(wf.specialty) + ')</option>';
    }
    h += '</select></div>';

    if (state.selectedWorkflowId) {
      h += '<div class="v4-wf-info">';
      h += '<div class="v4-wf-info-row"><span class="v4-wf-info-label">Workflow:</span><span class="v4-wf-info-val">' + esc(state.selectedWorkflowDisplay) + '</span></div>';
      h += '<div class="v4-wf-info-row"><span class="v4-wf-info-label">Specialty:</span><span class="v4-wf-info-val">' + esc(state.selectedWorkflowSpecialty) + '</span></div>';
      if (state.selectedWorkflowSafety) h += '<div class="v4-safety-box">' + esc(state.selectedWorkflowSafety) + '</div>';
      h += '</div>';

      // Show captured chips as a simple single-line badge (not an output)
      var totalChips = 0;
      for (var g in state.capturedChips) totalChips += state.capturedChips[g].length;
      h += '<div class="v4-chip-badge-wrap">';
      if (totalChips > 0) {
        h += '<span class="v4-chip-badge">' + totalChips + ' chip(s) from Autofill</span>';
        h += '<button class="v4-chip-refresh" onclick="window._v4RefreshChips()" title="Re-capture chips from OPD">&#8635;</button>';
      } else {
        h += '<span class="v4-chip-badge v4-chip-badge-empty">No chips captured</span>';
        h += '<button class="v4-chip-refresh" onclick="window._v4RefreshChips()" title="Capture chips from OPD">&#8635;</button>';
      }
      h += '</div>';
    }
    return h;
  }

  // ================================================================
  //  STEP 2: HISTORY
  // ================================================================
  function stepHistory() {
    if (!state.selectedWorkflowId) return emptyStep('Select a workflow first (Step 1).');
    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) return emptyStep('History draft not available.');

    var h = '<h2 class="v4-step-h">Step 2: History</h2>';
    h += '<p class="v4-step-d">Add key details below. The history draft updates automatically.</p>';
    if (draft.safety_note) h += '<div class="v4-safety-box">' + esc(draft.safety_note) + '</div>';

    // Mini-fields for main placeholders
    var defs = state.miniFieldDefs;
    var mainKeys = [], otherKeys = [];
    for (var k in defs) { if (defs[k].isMain) mainKeys.push(k); else otherKeys.push(k); }

    if (mainKeys.length || otherKeys.length) {
      h += '<div class="v4-mini-fields">';
      h += '<label class="v4-field-label">Key details</label>';
      h += '<div class="v4-mini-grid">';
      for (var mi = 0; mi < mainKeys.length; mi++) {
        var def = defs[mainKeys[mi]];
        h += '<div class="v4-mini-item">';
        h += '<label class="v4-mini-label">' + esc(def.label) + '</label>';
        h += '<input class="v4-mini-input" type="text" value="' + esc(def.value || '') + '" oninput="window._v4MiniField(\'' + esc(mainKeys[mi]) + '\', this.value)" placeholder="' + esc(def.placeholder) + '">';
        h += '</div>';
      }
      h += '</div>';
      if (otherKeys.length) {
        h += '<details class="v4-collapse">';
        h += '<summary class="v4-collapse-summary">Additional details (' + otherKeys.length + ')</summary>';
        h += '<div class="v4-collapse-body"><div class="v4-mini-grid">';
        for (var oi = 0; oi < otherKeys.length; oi++) {
          var def2 = defs[otherKeys[oi]];
          h += '<div class="v4-mini-item">';
          h += '<label class="v4-mini-label">' + esc(def2.label) + '</label>';
          h += '<input class="v4-mini-input" type="text" value="' + esc(def2.value || '') + '" oninput="window._v4MiniField(\'' + esc(otherKeys[oi]) + '\', this.value)" placeholder="' + esc(def2.placeholder) + '">';
          h += '</div>';
        }
        h += '</div></div></details>';
      }
      h += '</div>';
    }

    // Full textarea (editable)
    h += '<label class="v4-field-label" style="margin-top:14px">History draft (editable)</label>';
    h += '<textarea class="v4-textarea v4-textarea-lg" id="v4HistoryDraft" oninput="window._v4UpdateHist(this.value)">' + esc(state.historyDraft || draft.default_history_draft) + '</textarea>';

    // Placeholder helper (collapsed)
    if (draft.editable_placeholders && draft.editable_placeholders.length) {
      h += '<details class="v4-collapse">';
      h += '<summary class="v4-collapse-summary">Placeholder reference (' + draft.editable_placeholders.length + ')</summary>';
      h += '<div class="v4-collapse-body" style="display:flex;flex-wrap:wrap;gap:5px">';
      for (var pi = 0; pi < draft.editable_placeholders.length; pi++) {
        h += '<span class="v4-ph-chip">' + esc(draft.editable_placeholders[pi]) + '</span>';
      }
      h += '<p class="v4-field-note" style="width:100%;margin-top:6px">Use mini-fields above to replace these. The textarea is also directly editable.</p>';
      h += '</div></details>';
    }

    // Collapsed optional sections
    if (draft.optional_full_history_sections && draft.optional_full_history_sections.length) {
      h += '<details class="v4-collapse">';
      h += '<summary class="v4-collapse-summary">Optional full history sections (' + draft.optional_full_history_sections.length + ' available, collapsed)</summary>';
      h += '<div class="v4-collapse-body" style="display:flex;flex-wrap:wrap;gap:5px">';
      for (var si = 0; si < draft.optional_full_history_sections.length; si++) {
        h += '<span class="v4-section-chip">' + esc(draft.optional_full_history_sections[si]) + '</span>';
      }
      h += '</div></details>';
    }

    h += '<div class="v4-step-actions">';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearHistory()">Reset to default</button>';
    h += '</div>';
    return h;
  }

  // ================================================================
  //  STEP 3: EXAM + INVESTIGATIONS
  // ================================================================
  function stepExamInv() {
    if (!state.selectedWorkflowId) return emptyStep('Select a workflow first (Step 1).');

    var h = '<h2 class="v4-step-h">Step 3: Examination & Investigations</h2>';
    h += '<p class="v4-step-d">Document examination findings and investigations. Document only if assessed or reviewed.</p>';

    // ---- EXAMINATION ----
    var exam = getExamDetails(state.selectedWorkflowId);
    if (exam && exam.exam_groups && exam.exam_groups.length) {
      h += '<h3 class="v4-sub-h">Examination</h3>';
      if (exam.safety_note) h += '<div class="v4-safety-box">' + esc(exam.safety_note) + '</div>';

      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        h += '<div class="v4-exam-group">';
        h += '<div class="v4-exam-group-header" onclick="window._v4ToggleGroup(\'' + esc(group.group_id) + '\')">';
        h += '<span class="v4-eg-toggle" id="v4egt_' + esc(group.group_id) + '">&#9660;</span>';
        h += '<span class="v4-eg-label">' + esc(group.group_label) + '</span>';
        h += '<span class="v4-eg-count" id="v4egc_' + esc(group.group_id) + '">' + getGroupChecked(state.examConfirmations, group.group_id) + '/' + group.prompts.length + '</span>';
        h += '</div>';
        h += '<div class="v4-exam-body" id="v4egb_' + esc(group.group_id) + '">';
        if (group.safety_note) h += '<div class="v4-safety-box-sm">' + esc(group.safety_note) + '</div>';
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var prompt = group.prompts[pi];
          var key = group.group_id + '::' + prompt.prompt_id;
          var checked = state.examConfirmations[key] || false;
          h += '<label class="v4-exam-prompt' + (checked ? ' checked' : '') + '">';
          h += '<input type="checkbox"' + (checked ? ' checked' : '') + ' onchange="window._v4ToggleExam(\'' + esc(key) + '\', this.checked)">';
          h += '<span class="v4-ep-text">' + esc(prompt.prompt_text) + '</span>';
          if (prompt.warning) h += '<span class="v4-ep-warn" title="' + esc(prompt.warning) + '">&#9888;</span>';
          h += '</label>';
        }
        h += '</div></div>';
      }
      h += '<div class="v4-step-actions">';
      h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearExam()">Clear exam selections</button>';
      h += '</div>';
    }

    // ---- INVESTIGATIONS ----
    var inv = getInvestigationOptions(state.selectedWorkflowId);
    if (inv && inv.investigation_groups && inv.investigation_groups.length) {
      h += '<h3 class="v4-sub-h" style="margin-top:20px">Investigations / Results Reviewed</h3>';
      h += '<p class="v4-step-d">Document investigations/results only if ordered, reviewed, or available.</p>';
      if (inv.safety_note) h += '<div class="v4-safety-box">' + esc(inv.safety_note) + '</div>';

      for (var igi = 0; igi < inv.investigation_groups.length; igi++) {
        var igroup = inv.investigation_groups[igi];
        h += '<div class="v4-inv-group">';
        h += '<div class="v4-inv-group-header">' + esc(igroup.group_label) + '</div>';
        for (var oi = 0; oi < igroup.options.length; oi++) {
          var opt = igroup.options[oi];
          var ikey = igroup.group_id + '::' + opt.option_id;
          var ichecked = state.investigationConfirmations[ikey] || false;
          h += '<label class="v4-inv-opt' + (ichecked ? ' checked' : '') + '">';
          h += '<input type="checkbox"' + (ichecked ? ' checked' : '') + ' onchange="window._v4ToggleInv(\'' + esc(ikey) + '\', this.checked)">';
          h += '<span class="v4-io-text">' + esc(opt.option_text) + '</span>';
          h += '</label>';
        }
        h += '</div>';
      }
      h += '<div class="v4-step-actions">';
      h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearInv()">Clear investigation selections</button>';
      h += '</div>';
    }

    return h;
  }

  // ================================================================
  //  STEP 4: PLAN ASSIST
  // ================================================================
  function stepPlan() {
    if (!state.selectedWorkflowId) return emptyStep('Select a workflow first (Step 1).');

    var h = '<h2 class="v4-step-h">Step 4: Plan Assist</h2>';
    h += '<p class="v4-step-d">Enter your impression and plan. Select only items the clinician decided or discussed. Medication names/doses should be entered by the clinician if needed.</p>';

    // Impression
    h += '<div class="v4-plan-row"><label class="v4-field-label">Doctor Impression</label>';
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4Impression" oninput="window._v4UpdateImp(this.value)" placeholder="Enter your impression or assessment. Free text only.">' + esc(state.impression) + '</textarea></div>';

    // Plan options as Plan Assist
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups && plan.plan_option_groups.length) {
      h += '<div class="v4-plan-row"><label class="v4-field-label">Plan Assist</label>';
      h += '<p class="v4-field-note">Select only items the clinician decided or discussed. Documentation prompts only.</p>';
      if (plan.safety_note) h += '<div class="v4-safety-box-sm">' + esc(plan.safety_note) + '</div>';

      for (var gi = 0; gi < plan.plan_option_groups.length; gi++) {
        var pgroup = plan.plan_option_groups[gi];
        h += '<div class="v4-pog"><div class="v4-pog-label">' + esc(pgroup.group_label) + '</div>';
        for (var oi = 0; oi < pgroup.options.length; oi++) {
          var opt = pgroup.options[oi];
          var checked = state.planConfirmations[opt.option_id] || false;
          h += '<label class="v4-plan-opt' + (checked ? ' checked' : '') + '">';
          h += '<input type="checkbox"' + (checked ? ' checked' : '') + ' onchange="window._v4TogglePlan(\'' + esc(opt.option_id) + '\')">';
          h += '<span class="v4-po-text">' + esc(opt.option_text) + '</span>';
          h += '<span class="v4-po-cat">' + esc(fmtCat(opt.option_category)) + '</span></label>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    // Doctor plan text
    h += '<div class="v4-plan-row"><label class="v4-field-label">Doctor Plan (free text)</label>';
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4PlanText" oninput="window._v4UpdatePlan(this.value)" placeholder="Medication names/doses should be entered by the clinician if needed.">' + esc(state.planText) + '</textarea></div>';

    h += '<div class="v4-step-actions">';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearPlan()">Clear impression and plan</button></div>';
    return h;
  }

  // ================================================================
  //  STEP 5: CALCULATORS
  // ================================================================
  function stepCalc() {
    var h = '<h2 class="v4-step-h">Step 5: Calculators</h2>';
    h += '<p class="v4-step-d">Related calculators are not integrated into the advanced draft yet.</p>';
    h += '<div class="v4-safety-box">Calculator results are not inserted into V4E output. Use the dedicated calculator tools page.</div>';

    if (state.selectedWorkflowId) {
      var calcs = getRelatedCalcs(state.selectedWorkflowId);
      if (calcs.length) {
        h += '<label class="v4-field-label">Related low-risk calculators</label><ul class="v4-calc-list">';
        for (var ci = 0; ci < calcs.length; ci++) h += '<li>' + esc(calcs[ci]) + '</li>';
        h += '</ul>';
        h += '<a href="?calc=v1" class="v4-btn v4-btn-outline" target="_blank">Open calculator tools &#8599;</a>';
      } else {
        h += '<p class="v4-calc-empty">No low-risk calculators mapped to this workflow.</p>';
      }
    } else {
      h += '<p class="v4-calc-empty">Select a workflow in Step 1 to see related calculators.</p>';
    }
    return h;
  }

  function getRelatedCalcs(wfId) {
    try {
      var data = window.NAJM_CLINICAL_DATA;
      if (!data || !data.calculators || !data.calculator_workflow_mapping) return [];
      var mapping = data.calculator_workflow_mapping;
      var mapList = mapping[wfId] || [];
      var result = [];
      for (var i = 0; i < mapList.length; i++) {
        var calcId = typeof mapList[i] === 'string' ? mapList[i] : mapList[i].calculator_id;
        var calcDef = data.calculators[calcId];
        if (calcDef && calcDef.risk_level !== 'high') result.push(calcDef.display_name || calcId);
      }
      return result;
    } catch(e) { return []; }
  }

  // ================================================================
  //  STEP 6: OUTPUT
  // ================================================================
  function stepOutput() {
    var h = '<h2 class="v4-step-h">Step 6: Output</h2>';
    h += '<p class="v4-step-d">Generate a combined draft from your selected and entered content.</p>';
    h += '<div class="v4-output-tabs" id="v4OutputTabs">';
    var tabs = [{ id:'adv-emr', label:'EMR' }, { id:'adv-soap', label:'SOAP' }, { id:'adv-ref', label:'Referral' }, { id:'adv-inst', label:'Instructions' }];
    for (var i = 0; i < tabs.length; i++) {
      h += '<button class="v4-out-tab' + (i === 0 ? ' active' : '') + '" onclick="window._v4SwitchTab(\'' + tabs[i].id + '\', this)">' + tabs[i].label + '</button>';
    }
    h += '</div>';
    h += '<div class="v4-output-box" id="v4OutputBox"><pre class="v4-output-text" id="v4OutputText">Select all content in Steps 1-5, then click Generate Combined Draft.</pre></div>';
    h += '<div class="v4-output-actions">';
    h += '<button class="v4-btn v4-btn-primary" onclick="window._v4Generate()">Generate Combined Draft</button>';
    h += '<button class="v4-btn v4-btn-outline" onclick="window._v4Copy()">Copy</button>';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearOutput()">Clear</button></div>';
    return h;
  }

  // ================================================================
  //  CONTENT ROUTER AND DEDUPLICATOR
  // ================================================================
  var _currentTab = 'adv-emr';
  var _outputGenerated = false;

  function buildAdvancedDraft(tabId) {
    // Clean history: strip remaining placeholders
    var historyDraft = state.historyDraft || '';
    historyDraft = removePlaceholderSentences(historyDraft);
    if (!historyDraft) historyDraft = '[not documented]';

    var impression = state.impression || '[not documented]';
    var planFree = state.planText || '';

    // ---- Collect exam items ----
    var examItems = [];
    var exam = getExamDetails(state.selectedWorkflowId);
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        var groupItems = [];
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var key = group.group_id + '::' + group.prompts[pi].prompt_id;
          if (state.examConfirmations[key]) groupItems.push(group.prompts[pi].prompt_text);
        }
        if (groupItems.length) examItems.push(group.group_label + ': ' + groupItems.join('; '));
      }
    }
    var examSection = examItems.length ? examItems.join('\n') : '[not documented]';

    // ---- Collect V4 investigation items ----
    var invItems = [];
    var inv = getInvestigationOptions(state.selectedWorkflowId);
    if (inv && inv.investigation_groups) {
      for (var ivi = 0; ivi < inv.investigation_groups.length; ivi++) {
        var ig = inv.investigation_groups[ivi];
        for (var oi = 0; oi < ig.options.length; oi++) {
          var ikey = ig.group_id + '::' + ig.options[oi].option_id;
          if (state.investigationConfirmations[ikey]) invItems.push(ig.options[oi].option_text);
        }
      }
    }

    // ---- Collect plan options ----
    var planOpts = [];
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups) {
      for (var pgi = 0; pgi < plan.plan_option_groups.length; pgi++) {
        var pg = plan.plan_option_groups[pgi];
        for (var poi = 0; poi < pg.options.length; poi++) {
          if (state.planConfirmations[pg.options[poi].option_id]) planOpts.push(pg.options[poi]);
        }
      }
    }

    // ---- Collect Autofill chips ----
    var chips = state.capturedChips || {};
    var chipSymptoms = chips.symptoms || [];
    var chipNegatives = chips.relevant_negatives || [];
    var chipExam = chips.exam_findings || [];
    var chipInv = chips.investigations || [];
    var chipPlan = chips.plan_phrases || [];
    var chipFollowUp = chips.follow_up || [];

    // ---- DEDUPLICATION ----
    function norm(t) { return t.toLowerCase().replace(/\.+$/, '').trim(); }
    function inHistory(t) { return norm(t) && historyDraft.toLowerCase().indexOf(norm(t)) >= 0; }
    function dedupe(items, against) {
      var out = [], seen = {};
      for (var i = 0; i < items.length; i++) {
        var n = norm(items[i]); if (!n || seen[n]) continue; seen[n] = true;
        if (against && inHistory(items[i])) continue;
        out.push(items[i]);
      }
      return out;
    }

    var uniqueSymptoms = dedupe(chipSymptoms, true);
    var uniqueNegatives = dedupe(chipNegatives, true);
    var uniqueExamChips = dedupe(chipExam, true);
    var uniqueInvChips = dedupe(chipInv, true);
    var uniquePlanChips = dedupe(chipPlan, false);
    var uniqueFollowUp = dedupe(chipFollowUp, false);

    // Deduplicate investigation chips against V4 investigation items
    var allInvSeen = {};
    for (var ixi = 0; ixi < invItems.length; ixi++) allInvSeen[norm(invItems[ixi])] = true;
    var dedupedInvChips = [];
    for (var ixci = 0; ixci < uniqueInvChips.length; ixci++) {
      if (!allInvSeen[norm(uniqueInvChips[ixci])]) dedupedInvChips.push(uniqueInvChips[ixci]);
    }

    var allInvItems = invItems.concat(dedupedInvChips);

    // Deduplicate plan options against history and chip plan
    var uniquePlanOpts = [];
    var seenPlan = {};
    for (var pi2 = 0; pi2 < planOpts.length; pi2++) {
      var n = norm(planOpts[pi2].option_text);
      if (!n || seenPlan[n]) continue; seenPlan[n] = true;
      if (inHistory(planOpts[pi2].option_text)) continue;
      var dup = false;
      for (var ci = 0; ci < uniquePlanChips.length; ci++) {
        if (norm(uniquePlanChips[ci]) === n) { dup = true; break; }
      }
      if (!dup) uniquePlanOpts.push(planOpts[pi2]);
    }

    var cleanPlanFree = cleanText(planFree);

    // Build plan section (no follow_up or safety_netting items here)
    var planLines = [];
    if (uniquePlanChips.length) planLines = planLines.concat(uniquePlanChips);
    for (var poi3 = 0; poi3 < uniquePlanOpts.length; poi3++) {
      var cat = uniquePlanOpts[poi3].option_category || '';
      if (cat !== 'follow_up' && cat !== 'safety_netting') planLines.push(uniquePlanOpts[poi3].option_text);
    }
    if (cleanPlanFree) planLines.push(cleanPlanFree);
    var planSection = planLines.length ? planLines.join('\n') : '[not documented]';

    // Build follow-up section separately (includes safety-netting)
    var fupItems = [];
    if (uniqueFollowUp.length) for (var fi = 0; fi < uniqueFollowUp.length; fi++) fupItems.push(uniqueFollowUp[fi]);
    for (var pgi2 = 0; pgi2 < planOpts.length; pgi2++) {
      var fupCat = (planOpts[pgi2].option_category || '').toLowerCase();
      if (state.planConfirmations[planOpts[pgi2].option_id] && (fupCat === 'follow_up' || fupCat === 'safety_netting')) {
        var fn = norm(planOpts[pgi2].option_text);
        var dup2 = false;
        for (var fi2 = 0; fi2 < fupItems.length; fi2++) { if (norm(fupItems[fi2]) === fn) { dup2 = true; break; } }
        if (!dup2) fupItems.push(planOpts[pgi2].option_text);
      }
    }
    var fupSection = fupItems.length ? fupItems.join('\n') : '';

    var invSection = allInvItems.length ? allInvItems.join('\n') : '';
    var histSection = buildHistorySection(historyDraft, uniqueSymptoms, uniqueNegatives);
    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';

    // ---- BUILD DRAFT BY FORMAT ----
    function section(label, content) {
      if (!content || content === '[not documented]') return '';
      return label + ':\n' + content + '\n\n';
    }

    switch (tabId) {
      case 'adv-emr': {
        var emr = 'SHORT EMR NOTE\n' + '='.repeat(40) + '\n\n';
        emr += section('History', histSection);
        emr += section('Examination', examSection);
        emr += section('Investigations / Results Reviewed', invSection);
        emr += section('Assessment', impression);
        emr += section('Plan', planSection);
        emr += section('Follow-up', fupSection);
        return emr + footer;
      }
      case 'adv-soap': {
        var soap = 'SOAP NOTE\n' + '='.repeat(40) + '\n\n';
        soap += 'SUBJECTIVE:\n' + histSection + '\n\n';
        soap += 'OBJECTIVE:\n' + examSection + '\n\n';
        soap += section('Investigations / Results Reviewed', invSection);
        soap += 'ASSESSMENT:\n' + impression + '\n\n';
        soap += 'PLAN:\n' + planSection + '\n';
        soap += section('Follow-up', fupSection);
        return soap + footer;
      }
      case 'adv-ref': {
        // Check if any referral-related Plan Assist options are selected
        var hasReferralCat = false;
        var referralDetails = '';
        for (var rpi = 0; rpi < planOpts.length; rpi++) {
          var rcat = (planOpts[rpi].option_category || '').toLowerCase();
          if (rcat.indexOf('referral') >= 0) {
            hasReferralCat = true;
            referralDetails += planOpts[rpi].option_text + '\n';
          }
        }
        var hasReferralText = cleanPlanFree && (cleanPlanFree.toLowerCase().indexOf('refer') >= 0);
        var hasReferralImpression = impression && impression !== '[not documented]' && impression.toLowerCase().indexOf('refer') >= 0;

        if (!hasReferralCat && !hasReferralText && !hasReferralImpression) {
          return 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\nReferral draft: [not requested/documented]\n' + footer;
        }

        var ref = 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\n';
        if (referralDetails) ref += 'Referral details:\n' + referralDetails + '\n\n';
        ref += section('Reason for referral', historyDraft);
        ref += section('Clinical history', histSection);
        ref += section('Examination findings', examSection);
        ref += section('Investigations', invSection);
        ref += section('Current impression', impression);
        ref += section('Plan / recommendations', planSection);
        ref += section('Follow-up', fupSection);
        ref += 'Please see and advise.\n';
        return ref + footer;
      }
      case 'adv-inst': {
        // Patient instructions: ONLY plan content, no history/exam/investigations
        var instLines = [];
        var instSeen = {};
        if (plan && plan.plan_option_groups) {
          for (var pgi3 = 0; pgi3 < plan.plan_option_groups.length; pgi3++) {
            var pg3 = plan.plan_option_groups[pgi3];
            for (var poi4 = 0; poi4 < pg3.options.length; poi4++) {
              var opt3 = pg3.options[poi4];
              if (state.planConfirmations[opt3.option_id]) {
                var cat = (opt3.option_category || '').toLowerCase();
                if (cat.indexOf('patient_instruction') >= 0 || cat.indexOf('safety_netting') >= 0 || cat.indexOf('follow_up') >= 0 || cat.indexOf('lifestyle') >= 0 || cat.indexOf('counseling') >= 0) {
                  var nt = norm(opt3.option_text);
                  if (nt && !instSeen[nt]) { instLines.push(opt3.option_text); instSeen[nt] = true; }
                }
              }
            }
          }
        }
        if (cleanPlanFree) {
          var npt = norm(cleanPlanFree);
          if (npt && !instSeen[npt]) { instLines.push(cleanPlanFree); instSeen[npt] = true; }
        }

        if (!instLines.length) {
          return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n[not documented]\n' + footer;
        }
        return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n' +
          'Advice / plan discussed:\n' + instLines.join('\n') + '\n\n' +
          'Review with your clinician. Seek medical attention if symptoms worsen.\n' + footer;
      }
      default:
        return 'Select an output format.';
    }
  }

  function buildHistorySection(historyDraft, symptoms, negatives) {
    var parts = [];
    if (historyDraft) parts.push(historyDraft);
    if (symptoms && symptoms.length) parts.push('Symptoms: ' + symptoms.join('; '));
    if (negatives && negatives.length) parts.push('Relevant negatives: ' + negatives.join('; '));
    return parts.join('\n\n');
  }

  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/discussed as per clinician plan/gi, '')
      .replace(/as per clinician plan/gi, '')
      .replace(/clinician impression documented/gi, '')
      .replace(/per clinician plan/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function fmtCat(cat) {
    return (cat || '').replace(/_/g, ' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  // ================================================================
  //  SIDEBAR
  // ================================================================
  function updateSidebar() {
    var container = document.getElementById('v4SidebarContent');
    if (!container) return;
    var h = '';
    if (!state.selectedWorkflowId) {
      h = '<p class="v4-sidebar-empty">Select a workflow to begin.</p>';
    } else {
      h += '<div class="v4-si"><span class="v4-si-label">Workflow:</span><span class="v4-si-val">' + esc(state.selectedWorkflowDisplay) + '</span></div>';

      var hl = (state.historyDraft || '').length;
      var edited = state.historyDraft !== state.defaultHistoryDraft;
      h += '<div class="v4-si"><span class="v4-si-label">History:</span><span class="v4-si-val">' + hl + ' chars' + (edited ? ' (edited)' : '') + '</span></div>';

      // Mini-fields filled
      var filled = 0, total = 0;
      for (var k in state.miniFieldDefs) { total++; if (state.miniFieldDefs[k].value) filled++; }
      if (total > 0) h += '<div class="v4-si"><span class="v4-si-label">Mini-fields:</span><span class="v4-si-val">' + filled + '/' + total + '</span></div>';

      // Chips
      var chipCount = 0;
      for (var g in state.capturedChips) chipCount += state.capturedChips[g].length;
      if (chipCount > 0) h += '<div class="v4-si"><span class="v4-si-label">OPD chips:</span><span class="v4-si-val">' + chipCount + ' captured</span></div>';

      h += '<div class="v4-si"><span class="v4-si-label">Exam items:</span><span class="v4-si-val">' + countExam() + ' selected</span></div>';

      var invCount = countInv();
      if (invCount > 0) h += '<div class="v4-si"><span class="v4-si-label">Investigations:</span><span class="v4-si-val">' + invCount + ' selected</span></div>';

      h += '<div class="v4-si"><span class="v4-si-label">Impression:</span><span class="v4-si-val">' + (state.impression ? 'Entered' : 'Empty') + '</span></div>';

      var planActive = state.planText || countPlan() > 0;
      h += '<div class="v4-si"><span class="v4-si-label">Plan:</span><span class="v4-si-val">' + (planActive ? 'Entered' : 'Empty') + '</span></div>';

      var pc = countPlan();
      if (pc > 0) h += '<div class="v4-si"><span class="v4-si-label">Plan options:</span><span class="v4-si-val">' + pc + ' selected</span></div>';
    }
    container.innerHTML = h;
  }

  // ================================================================
  //  WINDOW HANDLERS
  // ================================================================

  // Workflow
  window._v4SelectWf = function() {
    var sel = document.getElementById('v4WorkflowSelect');
    if (!sel || !sel.value) return;
    var wfId = sel.value;
    state.selectedWorkflowId = wfId;

    var info = null;
    for (var i = 0; i < state.workflowList.length; i++) {
      if (state.workflowList[i].workflow_id === wfId) { info = state.workflowList[i]; break; }
    }
    if (info) {
      state.selectedWorkflowDisplay = info.display_name;
      state.selectedWorkflowSpecialty = info.specialty;
      state.selectedWorkflowSafety = info.safety_note;
    }

    var draft = getHistoryDraft(wfId);
    state.defaultHistoryDraft = draft ? draft.default_history_draft : '';
    state.historyDraft = state.defaultHistoryDraft;
    if (draft) state.historyPlaceholders = draft.editable_placeholders || [];

    // Build mini-field definitions
    state.miniFieldDefs = buildMiniFieldDefs(draft);
    state.miniFields = {};

    // Reset all state
    state.examConfirmations = {};
    state.investigationConfirmations = {};
    state.planConfirmations = {};
    state.impression = '';
    state.planText = '';

    // Capture chips
    state.capturedChips = captureOPDChips();

    renderStep(1);
    updateSidebar();
  };

  window._v4RefreshChips = function() {
    state.capturedChips = captureOPDChips();
    renderStep(1);
    updateSidebar();
  };

  // History
  window._v4MiniField = function(key, value) {
    if (!state.miniFieldDefs[key]) state.miniFieldDefs[key] = { placeholder: '', label: key, isMain: false, value: '' };
    state.miniFieldDefs[key].value = value;
    updateHistoryDraftFromMiniFields();
  };

  window._v4UpdateHist = function(val) {
    state.historyDraft = val;
    checkAllPhi();
    updateSidebar();
  };

  window._v4ClearHistory = function() {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    state.historyDraft = draft ? draft.default_history_draft : '';
    state.defaultHistoryDraft = state.historyDraft;
    // Reset mini-fields
    var defs = state.miniFieldDefs;
    for (var k in defs) defs[k].value = '';
    var ta = document.getElementById('v4HistoryDraft');
    if (ta) ta.value = state.historyDraft;
    checkAllPhi();
    updateSidebar();
  };

  // Exam
  window._v4ToggleGroup = function(groupId) {
    var body = document.getElementById('v4egb_' + groupId);
    var toggle = document.getElementById('v4egt_' + groupId);
    if (!body) return;
    var show = body.style.display !== 'none';
    body.style.display = show ? 'none' : '';
    if (toggle) toggle.innerHTML = show ? '&#9654;' : '&#9660;';
  };

  window._v4ToggleExam = function(key, checked) {
    state.examConfirmations[key] = checked;
    var parts = key.split('::');
    var gid = parts[0];
    var exam = getExamDetails(state.selectedWorkflowId);
    var groups = exam ? exam.exam_groups : null;
    var el = document.getElementById('v4egc_' + gid);
    if (el) el.textContent = getGroupChecked(state.examConfirmations, gid) + '/' + getGroupTotal(gid, groups);

    var labels = document.querySelectorAll('.v4-exam-prompt');
    for (var i = 0; i < labels.length; i++) {
      var cb = labels[i].querySelector('input');
      if (cb && cb.getAttribute('onchange').indexOf(key) >= 0) labels[i].classList.toggle('checked', checked);
    }
    updateSidebar();
  };

  window._v4ClearExam = function() {
    state.examConfirmations = {};
    renderStep(3);
    updateSidebar();
  };

  // Investigations
  window._v4ToggleInv = function(key, checked) {
    state.investigationConfirmations[key] = checked;
    updateSidebar();
  };

  window._v4ClearInv = function() {
    state.investigationConfirmations = {};
    renderStep(3);
    updateSidebar();
  };

  // Plan
  window._v4TogglePlan = function(optId) {
    state.planConfirmations[optId] = !state.planConfirmations[optId];
    var labels = document.querySelectorAll('.v4-plan-opt');
    for (var i = 0; i < labels.length; i++) {
      var cb = labels[i].querySelector('input');
      if (cb && cb.getAttribute('onchange').indexOf(optId) >= 0) labels[i].classList.toggle('checked', cb.checked);
    }
    updateSidebar();
  };

  window._v4UpdateImp = function(val) { state.impression = val; checkAllPhi(); updateSidebar(); };
  window._v4UpdatePlan = function(val) { state.planText = val; checkAllPhi(); updateSidebar(); };

  window._v4ClearPlan = function() {
    state.impression = '';
    state.planText = '';
    state.planConfirmations = {};
    renderStep(4);
    updateSidebar();
  };

  // Output
  window._v4Generate = function() {
    var text = document.getElementById('v4OutputText');
    if (!text) return;
    var tabEl = document.querySelector('.v4-out-tab.active');
    var tabId = tabEl ? tabEl.getAttribute('onclick').match(/'([^']+)'/)[1] : 'adv-emr';
    text.textContent = buildAdvancedDraft(tabId);
    _outputGenerated = true;
    updateSidebar();
  };

  window._v4SwitchTab = function(tabId, btn) {
    var tabs = document.querySelectorAll('.v4-out-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
    if (_outputGenerated) {
      var text = document.getElementById('v4OutputText');
      if (text) text.textContent = buildAdvancedDraft(tabId);
    }
  };

  window._v4Copy = function() {
    var text = document.getElementById('v4OutputText');
    if (!text || !text.textContent) return;
    navigator.clipboard.writeText(text.textContent).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = text.textContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  window._v4ClearOutput = function() {
    var text = document.getElementById('v4OutputText');
    if (text) text.textContent = 'Select all content in Steps 1-5, then click Generate Combined Draft.';
    _outputGenerated = false;
  };

  // Navigation
  window._v4Prev = function() {
    if (currentStep > 1) {
      currentStep--;
      renderStep(currentStep);
      updateSidebar();
    }
  };

  window._v4Next = function() {
    if (currentStep < TOTAL_STEPS) {
      // Auto-capture chips when leaving Step 1 or entering Step 6
      if (currentStep === 1 || currentStep + 1 === TOTAL_STEPS) {
        state.capturedChips = captureOPDChips();
      }
      currentStep++;
      renderStep(currentStep);
      updateSidebar();
    }
  };

  // ================================================================
  //  INIT
  // ================================================================
  function init() {
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;

    // Show speed page (for chip selection) alongside V4; hide others
    var allPages = document.querySelectorAll('.page');
    for (var pi = 0; pi < allPages.length; pi++) {
      var pgId = allPages[pi].id;
      if (pgId === 'page-advanced-encounter' || pgId === 'page-speed') {
        allPages[pi].classList.add('active');
      } else {
        allPages[pi].classList.remove('active');
      }
    }

    // Hide the Speed Mode output area when V4 is active (it has its own output in Step 6)
    var speedOutputBox = document.getElementById('speedOutputBox');
    if (speedOutputBox) {
      speedOutputBox.classList.add('v4-speed-output-hidden');
    }
    // Hide speed output header tabs and action buttons
    var speedOutputHeader = document.querySelector('#page-speed .output-header');
    if (speedOutputHeader) speedOutputHeader.classList.add('v4-speed-output-hidden');
    var speedOutputActions = document.querySelector('#page-speed .output-actions');
    if (speedOutputActions) speedOutputActions.classList.add('v4-speed-output-hidden');
    var speedOutputFooter = document.querySelector('#page-speed .output-footer');
    if (speedOutputFooter) speedOutputFooter.classList.add('v4-speed-output-hidden');
    var speedExportNote = document.querySelector('#page-speed .export-privacy-note');
    if (speedExportNote) speedExportNote.classList.add('v4-speed-output-hidden');
    var speedGenerateBtnRow = document.querySelector('#speedContent .gen-row');
    if (speedGenerateBtnRow) speedGenerateBtnRow.classList.add('v4-speed-output-hidden');
    var speedFeedbackCta = document.getElementById('speedGeneratedFeedbackCta');
    if (speedFeedbackCta) speedFeedbackCta.classList.add('v4-speed-output-hidden');
    var speedWhyFaster = document.querySelector('.why-faster');
    if (speedWhyFaster) speedWhyFaster.classList.add('v4-speed-output-hidden');

    var loading = document.createElement('div');
    loading.className = 'v4-loading';
    loading.textContent = 'Loading V4 encounter data...';
    app.appendChild(loading);

    loadV4Data().then(function() {
      app.removeChild(loading);
      renderApp();
    }).catch(function(err) {
      loading.textContent = 'Failed to load V4 data: ' + (err.message || 'unknown error');
    });
  }

  // Styles
  var style = document.createElement('style');
  style.textContent = V4_STYLES();
  document.head.appendChild(style);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // ================================================================
  //  STYLES
  // ================================================================
  function V4_STYLES() {
    return `
#page-advanced-encounter.active{display:block}
.v4-loading{padding:60px;text-align:center;font-size:18px;color:var(--gray-500)}
.v4-safety-banner{background:var(--red-bg);border:1px solid var(--red-border);color:var(--red);text-align:center;padding:10px 16px;font-size:12px;font-weight:500;line-height:1.4;margin-bottom:8px}
.v4-phi-warning{background:var(--red-bg);border:1px solid var(--red-border);color:var(--red);padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px;display:none}
.v4-stepper{display:flex;gap:0;margin-bottom:20px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);overflow:hidden}
.v4-s-indicator{flex:1;display:flex;align-items:center;gap:6px;padding:14px 12px;font-size:12px;font-weight:500;color:var(--gray-400);border-right:1px solid var(--gray-200);transition:all .15s}
.v4-s-indicator:last-child{border-right:none}
.v4-s-indicator.active{background:var(--primary-bg);color:var(--primary)}
.v4-s-indicator.done{color:var(--green)}
.v4-s-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:var(--gray-200);color:var(--gray-600);flex-shrink:0}
.v4-s-indicator.active .v4-s-num{background:var(--primary);color:#fff}
.v4-s-indicator.done .v4-s-num{background:var(--green);color:#fff}
.v4-s-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v4-layout{display:grid;grid-template-columns:1fr 280px;gap:24px}
.v4-main{min-width:0}
.v4-sidebar{position:sticky;top:80px;align-self:start}
.v4-sidebar-inner{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:20px}
.v4-sidebar-title{font-size:15px;font-weight:700;color:var(--gray-800);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--gray-200)}
.v4-sidebar-empty{font-size:13px;color:var(--gray-400)}
.v4-si{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--gray-100);font-size:12px}
.v4-si-label{color:var(--gray-500)}
.v4-si-val{font-weight:600;color:var(--gray-700)}
.v4-step-content{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:24px;min-height:300px}
.v4-step-h{font-size:20px;font-weight:700;color:var(--gray-900);margin-bottom:6px}
.v4-sub-h{font-size:16px;font-weight:700;color:var(--gray-800);margin-bottom:10px}
.v4-step-d{font-size:13px;color:var(--gray-500);margin-bottom:16px;line-height:1.5}
.v4-select{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:14px;font-family:var(--font);background:#fff;color:var(--gray-800)}
.v4-select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.v4-wf-info{margin-top:14px;padding:14px;background:var(--gray-50);border-radius:8px}
.v4-wf-info-row{display:flex;gap:8px;padding:3px 0;font-size:13px}
.v4-wf-info-label{font-weight:600;color:var(--gray-600);min-width:80px}
.v4-wf-info-val{color:var(--gray-800)}
.v4-chip-badge-wrap{display:flex;align-items:center;gap:8px;margin-top:8px;padding:6px 0}
.v4-chip-badge{display:inline-block;padding:4px 10px;border-radius:12px;background:var(--primary-bg);color:var(--primary);font-size:11px;font-weight:600;border:1px solid var(--primary-border)}
.v4-chip-badge-empty{background:var(--gray-50);color:var(--gray-400);border-color:var(--gray-200)}
.v4-chip-refresh{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;border:1px solid var(--gray-200);background:#fff;cursor:pointer;font-size:13px;line-height:1;color:var(--gray-500);padding:0}
.v4-chip-refresh:hover{background:var(--gray-50);color:var(--gray-700)}
.v4-speed-output-hidden{display:none!important}
.v4-safety-box{background:var(--red-bg);border:1px solid var(--red-border);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:14px;line-height:1.4}
.v4-safety-box-sm{background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:6px;padding:8px 12px;font-size:11px;color:var(--gray-600);margin-bottom:10px;line-height:1.4}

.v4-mini-fields{margin-bottom:12px;padding:14px;background:var(--gray-50);border-radius:8px}
.v4-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.v4-mini-item{display:flex;flex-direction:column;gap:3px}
.v4-mini-label{font-size:11px;font-weight:600;color:var(--gray-600)}
.v4-mini-input{padding:8px 10px;border:1px solid var(--gray-300);border-radius:6px;font-size:13px;font-family:var(--font)}
.v4-mini-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
@media(max-width:640px){.v4-mini-grid{grid-template-columns:1fr}}

.v4-textarea{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:13px;font-family:var(--font);line-height:1.6;resize:vertical;color:var(--gray-800)}
.v4-textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.v4-textarea-lg{min-height:180px}
.v4-textarea-med{min-height:100px}
.v4-field-label{display:block;font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:6px}
.v4-field-note{font-size:12px;color:var(--gray-400);margin-top:4px;line-height:1.4}
.v4-ph-chip{display:inline-block;padding:3px 8px;border-radius:4px;background:var(--amber-bg);border:1px solid var(--amber-border);font-size:11px;font-family:var(--font-mono);color:var(--amber)}
.v4-collapse{border:1px solid var(--gray-200);border-radius:8px;margin-top:10px}
.v4-collapse-summary{padding:10px 14px;font-size:12px;font-weight:600;color:var(--gray-600);cursor:pointer}
.v4-collapse-body{padding:8px 14px 14px;display:flex;flex-wrap:wrap;gap:5px}
.v4-section-chip{display:inline-block;padding:3px 8px;border-radius:4px;background:var(--gray-100);font-size:11px;color:var(--gray-500)}
.v4-step-actions{margin-top:14px;padding-top:10px;border-top:1px solid var(--gray-100)}

.v4-exam-group{border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px;overflow:hidden}
.v4-exam-group-header{display:flex;align-items:center;gap:8px;padding:12px 14px;background:var(--gray-50);cursor:pointer;font-size:13px;font-weight:600;color:var(--gray-700)}
.v4-exam-group-header:hover{background:var(--gray-100)}
.v4-eg-toggle{font-size:10px;width:16px;text-align:center}
.v4-eg-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--gray-400)}
.v4-exam-body{padding:8px 14px 14px}
.v4-exam-prompt{display:flex;align-items:flex-start;gap:8px;padding:7px 0;cursor:pointer;font-size:12px;color:var(--gray-700);line-height:1.5}
.v4-exam-prompt:hover{background:var(--gray-50);border-radius:4px}
.v4-exam-prompt input[type="checkbox"]{margin-top:2px;flex-shrink:0}
.v4-ep-text{flex:1}
.v4-ep-warn{font-size:13px;cursor:help;flex-shrink:0;color:var(--amber)}

.v4-inv-group{border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px;overflow:hidden;padding:10px 14px}
.v4-inv-group-header{font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.03em}
.v4-inv-opt{display:flex;align-items:flex-start;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;color:var(--gray-700)}
.v4-inv-opt input[type="checkbox"]{margin-top:2px;flex-shrink:0}
.v4-io-text{flex:1;line-height:1.4}

.v4-plan-row{margin-bottom:18px}
.v4-pog{margin-bottom:12px}
.v4-pog-label{font-size:11px;font-weight:700;color:var(--gray-600);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em}
.v4-plan-opt{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--gray-700)}
.v4-plan-opt:hover{background:var(--gray-50)}
.v4-plan-opt input[type="checkbox"]{margin-top:2px;flex-shrink:0}
.v4-po-text{flex:1;line-height:1.4}
.v4-po-cat{font-size:10px;color:var(--gray-400);background:var(--gray-100);padding:2px 6px;border-radius:4px;white-space:nowrap;flex-shrink:0}

.v4-calc-list{margin:10px 0;padding-left:20px}
.v4-calc-list li{font-size:13px;color:var(--gray-700);padding:3px 0}
.v4-calc-empty{font-size:13px;color:var(--gray-400);padding:16px 0}

.v4-output-tabs{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.v4-out-tab{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid var(--gray-200);background:#fff;color:var(--gray-500);cursor:pointer;font-family:var(--font)}
.v4-out-tab.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.v4-output-box{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:16px;min-height:250px;max-height:550px;overflow:auto;margin-bottom:12px}
.v4-output-text{font-size:12px;font-family:var(--font-mono);white-space:pre-wrap;line-height:1.6;color:var(--gray-700)}
.v4-output-actions{display:flex;gap:8px;flex-wrap:wrap}

.v4-nav{display:flex;align-items:center;justify-content:space-between;margin-top:16px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:12px 20px}
.v4-nav-right{display:flex;align-items:center;gap:12px}
.v4-step-info{font-size:13px;color:var(--gray-400);font-weight:500}
.v4-btn{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);display:inline-flex;align-items:center;gap:6px;text-decoration:none}
.v4-btn-primary{background:var(--primary);color:#fff}
.v4-btn-primary:hover{background:var(--primary-light)}
.v4-btn-outline{background:#fff;color:var(--primary);border:2px solid var(--primary)}
.v4-btn-outline:hover{background:var(--primary-bg)}
.v4-btn-ghost{background:transparent;color:var(--gray-600);border:1px solid var(--gray-200)}
.v4-btn-ghost:hover{background:var(--gray-50)}
.v4-btn:disabled{opacity:0.4;cursor:not-allowed}
.v4-empty-state{text-align:center;padding:60px 20px;color:var(--gray-400);font-size:15px}

@media(max-width:768px){.v4-layout{grid-template-columns:1fr}.v4-sidebar{display:none}.v4-stepper{overflow-x:auto}.v4-s-label{display:none}}
    `;
  }

})();
