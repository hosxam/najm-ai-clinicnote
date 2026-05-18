(function() {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  if (params.get('v4') !== 'encounter2') return;

  // ---- State (memory only) ----
  var state = {
    workflowList: [],
    historyDrafts: [],
    examDetails: [],
    planOptions: [],

    selectedWorkflowId: null,
    selectedWorkflowDisplay: '',
    selectedWorkflowSpecialty: '',
    selectedWorkflowSafety: '',

    historyDraft: '',
    defaultHistoryDraft: '',
    historyPlaceholders: [],

    examConfirmations: {},
    examClear: false,

    impression: '',
    planText: '',
    planConfirmations: {},

    calculatorNotes: ''
  };

  var currentStep = 1;
  var TOTAL_STEPS = 6;

  // ---- Specialty mapping ----
  var WORKFLOW_SPECIALTY = {
    'gp-fever-urti': 'General Medicine / GP',
    'gp-diabetes-followup': 'General Medicine / GP',
    'msk-low-back-pain': 'Orthopedics / MSK',
    'peds-fever': 'Pediatrics',
    'obgyn-antenatal-followup': 'OB/GYN'
  };

  // ---- Data loading ----
  function loadV4Data() {
    return Promise.all([
      fetch('./data/v4_workflow_history_drafts.json').then(function(r){ return r.json(); }),
      fetch('./data/v4_workflow_exam_details.json').then(function(r){ return r.json(); }),
      fetch('./data/v4_plan_options.json').then(function(r){ return r.json(); })
    ]).then(function(results) {
      state.historyDrafts = results[0];
      state.examDetails = results[1];
      state.planOptions = results[2];
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

  // ---- Helpers ----
  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function getHistoryDraft(wfId) {
    for (var i = 0; i < state.historyDrafts.length; i++) {
      if (state.historyDrafts[i].workflow_id === wfId) return state.historyDrafts[i];
    }
    return null;
  }

  function getExamDetails(wfId) {
    for (var i = 0; i < state.examDetails.length; i++) {
      if (state.examDetails[i].workflow_id === wfId) return state.examDetails[i];
    }
    return null;
  }

  function getPlanOptions(wfId) {
    for (var i = 0; i < state.planOptions.length; i++) {
      if (state.planOptions[i].workflow_id === wfId) return state.planOptions[i];
    }
    return null;
  }

  function countExamSelected() {
    var n = 0;
    for (var k in state.examConfirmations) {
      if (state.examConfirmations[k]) n++;
    }
    return n;
  }

  function countPlanSelected() {
    var n = 0;
    for (var k in state.planConfirmations) {
      if (state.planConfirmations[k]) n++;
    }
    return n;
  }

  // ---- PHI check (reuse concept, lightweight local) ----
  function checkPHI(text) {
    if (!text) return false;
    var patterns = [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /\b05[0-9]{8}\b/,
      /\b[\+97105][0-9]{8,10}\b/,
      /\b(?:mrn|medical record|emirates id|insurance id|passport)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i,
      /\b\d{2,3}\s+\d{3}\s+\d{4}\b/
    ];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].test(text)) return true;
    }
    return false;
  }

  function showPhiWarning() {
    var el = document.getElementById('v4PhiWarning');
    if (el) el.style.display = 'block';
  }
  function hidePhiWarning() {
    var el = document.getElementById('v4PhiWarning');
    if (el) el.style.display = 'none';
  }

  function checkAllPhi() {
    var found = false;
    var fields = [
      document.getElementById('v4HistoryDraft'),
      document.getElementById('v4Impression'),
      document.getElementById('v4PlanText')
    ];
    for (var i = 0; i < fields.length; i++) {
      if (fields[i] && checkPHI(fields[i].value)) { found = true; break; }
    }
    if (found) showPhiWarning(); else hidePhiWarning();
  }

  // ============================================================
  //  RENDER APP
  // ============================================================
  function renderApp() {
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;
    app.classList.add('active');

    var html = '';
    // Safety banner
    html += '<div class="v4-safety-banner">';
    html += 'Do not enter patient names, IDs, MRNs, or contact information. This tool structures de-identified clinician-entered information only.';
    html += '</div>';

    // PHI warning
    html += '<div class="v4-phi-warning" id="v4PhiWarning" style="display:none">';
    html += '&#9888; Possible identifiable information detected. Remove patient identifiers before using this tool.';
    html += '</div>';

    // Stepper
    html += '<div class="v4-stepper" id="v4Stepper">';
    var labels = ['Workflow','History','Examination','Assessment & Plan','Calculators','Output'];
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      html += '<div class="v4-s-indicator' + (i === currentStep ? ' active' : '') + (i < currentStep ? ' done' : '') + '" data-idx="' + i + '">';
      html += '<span class="v4-s-num">' + (i < currentStep ? '&#10003;' : i) + '</span>';
      html += '<span class="v4-s-label">' + labels[i - 1] + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Two-column layout
    html += '<div class="v4-layout">';
    html += '<div class="v4-main" id="v4Main">';
    html += '<div class="v4-step-content" id="v4StepContent"></div>';
    html += '</div>';
    html += '<div class="v4-sidebar" id="v4Sidebar">';
    html += '<div class="v4-sidebar-inner">';
    html += '<h3 class="v4-sidebar-title">Encounter Draft Ingredients</h3>';
    html += '<div id="v4SidebarContent"><p class="v4-sidebar-empty">Select a workflow to begin.</p></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Navigation
    html += '<div class="v4-nav">';
    html += '<button class="v4-btn v4-btn-ghost" id="v4PrevBtn" onclick="window._v4Prev()"' + (currentStep <= 1 ? ' disabled' : '') + '>Back</button>';
    html += '<div class="v4-nav-right">';
    html += '<span class="v4-step-info">' + currentStep + ' / ' + TOTAL_STEPS + '</span>';
    html += '<button class="v4-btn v4-btn-primary" id="v4NextBtn" onclick="window._v4Next()">' + (currentStep >= TOTAL_STEPS ? 'Finish' : 'Next') + '</button>';
    html += '</div>';
    html += '</div>';

    app.innerHTML = html;
    renderStep(currentStep);
    updateSidebar();
  }

  // ============================================================
  //  STEP RENDERER
  // ============================================================
  function renderStep(step) {
    var container = document.getElementById('v4StepContent');
    if (!container) return;
    var html = '';
    switch (step) {
      case 1: html = stepWorkflow(); break;
      case 2: html = stepHistory(); break;
      case 3: html = stepExam(); break;
      case 4: html = stepPlan(); break;
      case 5: html = stepCalculators(); break;
      case 6: html = stepOutput(); break;
    }
    container.innerHTML = html;
    checkAllPhi();
    updateNav();
  }

  // ============================================================
  //  STEP 1: WORKFLOW
  // ============================================================
  function stepWorkflow() {
    var h = '<h2 class="v4-step-h">Step 1: Select Workflow</h2>';
    h += '<p class="v4-step-d">Choose one of the V4 prototype clinical workflows. Available: 5 workflows.</p>';

    // Dropdown
    h += '<div class="v4-wf-search">';
    h += '<label class="v4-field-label">Workflow</label>';
    h += '<select class="v4-select" id="v4WorkflowSelect" onchange="window._v4SelectWf()">';
    h += '<option value="">-- Select a workflow --</option>';
    for (var i = 0; i < state.workflowList.length; i++) {
      var wf = state.workflowList[i];
      var sel = wf.workflow_id === state.selectedWorkflowId ? ' selected' : '';
      h += '<option value="' + esc(wf.workflow_id) + '"' + sel + '>';
      h += esc(wf.display_name) + ' (' + esc(wf.specialty) + ')';
      h += '</option>';
    }
    h += '</select>';
    h += '</div>';

    // Selected workflow info
    if (state.selectedWorkflowId) {
      var wfInfo = getWorkflowInfo(state.selectedWorkflowId);
      h += '<div class="v4-wf-info">';
      h += '<div class="v4-wf-info-row"><span class="v4-wf-info-label">Workflow:</span><span class="v4-wf-info-val">' + esc(state.selectedWorkflowDisplay) + '</span></div>';
      h += '<div class="v4-wf-info-row"><span class="v4-wf-info-label">Specialty:</span><span class="v4-wf-info-val">' + esc(state.selectedWorkflowSpecialty) + '</span></div>';
      if (state.selectedWorkflowSafety) {
        h += '<div class="v4-wf-info-row"><span class="v4-wf-info-label">Safety note:</span><span class="v4-wf-info-val"></span></div>';
        h += '<div class="v4-safety-box">' + esc(state.selectedWorkflowSafety) + '</div>';
      }
      h += '</div>';
    }

    // Autofill context (read only)
    if (state.selectedWorkflowId) {
      var draft = getHistoryDraft(state.selectedWorkflowId);
      if (draft && draft.linked_autofill_groups && draft.linked_autofill_groups.length) {
        h += '<div class="v4-autofill-context">';
        h += '<span class="v4-field-label">Autofill context:</span>';
        h += '<div class="v4-autofill-chips">';
        for (var ai = 0; ai < draft.linked_autofill_groups.length; ai++) {
          h += '<span class="v4-af-chip">' + esc(draft.linked_autofill_groups[ai]) + '</span>';
        }
        h += '</div>';
        h += '<p class="v4-field-note">Read only. Autofill is not connected in V4 prototype. Shows chip groups this workflow is linked to.</p>';
        h += '</div>';
      }
    }

    return h;
  }

  function getWorkflowInfo(wfId) {
    for (var i = 0; i < state.workflowList.length; i++) {
      if (state.workflowList[i].workflow_id === wfId) return state.workflowList[i];
    }
    return null;
  }

  // ============================================================
  //  STEP 2: HISTORY DRAFT
  // ============================================================
  function stepHistory() {
    if (!state.selectedWorkflowId) {
      return emptyStep('Select a workflow first (Step 1) before editing the history draft.');
    }

    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) return emptyStep('History draft not available for this workflow.');

    var h = '<h2 class="v4-step-h">Step 2: History Draft</h2>';
    h += '<p class="v4-step-d">Edit the workflow-specific history draft below. Replace [placeholders] with specific details.</p>';

    if (draft.safety_note) {
      h += '<div class="v4-safety-box">' + esc(draft.safety_note) + '</div>';
    }

    h += '<div class="v4-field-label">History Draft (editable)</div>';
    h += '<textarea class="v4-textarea v4-textarea-lg" id="v4HistoryDraft" oninput="window._v4UpdateHist(this.value)">' + esc(state.historyDraft || draft.default_history_draft) + '</textarea>';

    // Placeholder helper
    if (draft.editable_placeholders && draft.editable_placeholders.length) {
      h += '<div class="v4-placeholders">';
      h += '<span class="v4-field-label">Placeholders to fill:</span>';
      h += '<div class="v4-ph-chips">';
      for (var i = 0; i < draft.editable_placeholders.length; i++) {
        h += '<span class="v4-ph-chip">' + esc(draft.editable_placeholders[i]) + '</span>';
      }
      h += '</div></div>';
    }

    // Optional full history sections (collapsed)
    if (draft.optional_full_history_sections && draft.optional_full_history_sections.length) {
      h += '<details class="v4-collapse">';
      h += '<summary class="v4-collapse-summary">Optional full history sections (' + draft.optional_full_history_sections.length + ' available)</summary>';
      h += '<div class="v4-collapse-body">';
      for (var si = 0; si < draft.optional_full_history_sections.length; si++) {
        h += '<span class="v4-section-chip">' + esc(draft.optional_full_history_sections[si]) + '</span>';
      }
      h += '<p class="v4-field-note">These are collapsed V3 full history prompts. Not rendered in V4 prototype.</p>';
      h += '</div></details>';
    }

    // Clear button
    h += '<div class="v4-step-actions">';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearHistory()">Reset to default draft</button>';
    h += '</div>';

    return h;
  }

  // ============================================================
  //  STEP 3: EXAMINATION
  // ============================================================
  function stepExam() {
    if (!state.selectedWorkflowId) {
      return emptyStep('Select a workflow first (Step 1) before documenting examination findings.');
    }

    var exam = getExamDetails(state.selectedWorkflowId);
    if (!exam) return emptyStep('Exam details not available for this workflow.');

    var h = '<h2 class="v4-step-h">Step 3: Examination</h2>';
    h += '<p class="v4-step-d">Document only if assessed. Select prompts that apply to this encounter.</p>';

    if (exam.safety_note) {
      h += '<div class="v4-safety-box">' + esc(exam.safety_note) + '</div>';
    }

    for (var gi = 0; gi < exam.exam_groups.length; gi++) {
      var group = exam.exam_groups[gi];
      var gOpen = true; // open by default
      h += '<div class="v4-exam-group">';
      h += '<div class="v4-exam-group-header" onclick="window._v4ToggleGroup(\'' + esc(group.group_id) + '\')">';
      h += '<span class="v4-eg-toggle" id="v4egt_' + esc(group.group_id) + '">&#9660;</span>';
      h += '<span class="v4-eg-label">' + esc(group.group_label) + '</span>';
      h += '<span class="v4-eg-count" id="v4egc_' + esc(group.group_id) + '">' + getGroupChecked(group.group_id) + '/' + group.prompts.length + '</span>';
      h += '</div>';

      h += '<div class="v4-exam-body" id="v4egb_' + esc(group.group_id) + '">';
      if (group.safety_note) {
        h += '<div class="v4-safety-box-sm">' + esc(group.safety_note) + '</div>';
      }
      for (var pi = 0; pi < group.prompts.length; pi++) {
        var prompt = group.prompts[pi];
        var key = group.group_id + '::' + prompt.prompt_id;
        var checked = state.examConfirmations[key] || false;
        h += '<label class="v4-exam-prompt' + (checked ? ' checked' : '') + '">';
        h += '<input type="checkbox"' + (checked ? ' checked' : '') + ' onchange="window._v4ToggleExam(\'' + esc(key) + '\', this.checked)">';
        h += '<span class="v4-ep-text">' + esc(prompt.prompt_text) + '</span>';
        if (prompt.warning) {
          h += '<span class="v4-ep-warn" title="' + esc(prompt.warning) + '">&#9888;</span>';
        }
        h += '</label>';
      }
      h += '</div>';
      h += '</div>';
    }

    // Clear button
    h += '<div class="v4-step-actions">';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearExam()">Clear all exam selections</button>';
    h += '</div>';

    return h;
  }

  // ============================================================
  //  STEP 4: ASSESSMENT & PLAN
  // ============================================================
  function stepPlan() {
    if (!state.selectedWorkflowId) {
      return emptyStep('Select a workflow first (Step 1) before entering assessment and plan.');
    }

    var h = '<h2 class="v4-step-h">Step 4: Assessment & Plan</h2>';
    h += '<p class="v4-step-d">Enter your impression and plan. Plan options are documentation prompts only. Select only what the clinician decided or discussed.</p>';

    // Impression
    h += '<div class="v4-plan-row">';
    h += '<label class="v4-field-label">Doctor Impression</label>';
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4Impression" oninput="window._v4UpdateImp(this.value)" placeholder="Enter your impression or assessment. Free text only.">' + esc(state.impression) + '</textarea>';
    h += '</div>';

    // Plan options
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups && plan.plan_option_groups.length) {
      h += '<div class="v4-plan-row">';
      h += '<label class="v4-field-label">Plan Documentation Options</label>';
      h += '<p class="v4-field-note">Plan options are documentation prompts only. Select only what the clinician decided or discussed.</p>';

      for (var gi = 0; gi < plan.plan_option_groups.length; gi++) {
        var pgroup = plan.plan_option_groups[gi];
        h += '<div class="v4-pog">';
        h += '<div class="v4-pog-label">' + esc(pgroup.group_label) + '</div>';
        for (var oi = 0; oi < pgroup.options.length; oi++) {
          var opt = pgroup.options[oi];
          var checked = state.planConfirmations[opt.option_id] || false;
          h += '<label class="v4-plan-opt' + (checked ? ' checked' : '') + '">';
          h += '<input type="checkbox"' + (checked ? ' checked' : '') + ' onchange="window._v4TogglePlan(\'' + esc(opt.option_id) + '\')">';
          h += '<span class="v4-po-text">' + esc(opt.option_text) + '</span>';
          h += '<span class="v4-po-cat">' + esc(fmtCat(opt.option_category)) + '</span>';
          h += '</label>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    // Doctor plan text
    h += '<div class="v4-plan-row">';
    h += '<label class="v4-field-label">Doctor Plan (free text)</label>';
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4PlanText" oninput="window._v4UpdatePlan(this.value)" placeholder="Enter any additional plan details not covered by options above.">' + esc(state.planText) + '</textarea>';
    h += '</div>';

    // Clear button
    h += '<div class="v4-step-actions">';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearPlan()">Clear impression and plan</button>';
    h += '</div>';

    return h;
  }

  // ============================================================
  //  STEP 5: CALCULATORS
  // ============================================================
  function stepCalculators() {
    var h = '<h2 class="v4-step-h">Step 5: Calculators</h2>';
    h += '<p class="v4-step-d">Related calculators are not integrated into the advanced draft yet.</p>';
    h += '<div class="v4-safety-box">Calculator results are not inserted into V4D output. Use the dedicated calculator tools page.</div>';

    // Show workflow-related calculators if available
    if (state.selectedWorkflowId) {
      var calcs = getRelatedCalcs(state.selectedWorkflowId);
      if (calcs && calcs.length) {
        h += '<div class="v4-calc-section">';
        h += '<label class="v4-field-label">Related low-risk calculators</label>';
        h += '<ul class="v4-calc-list">';
        for (var ci = 0; ci < calcs.length; ci++) {
          h += '<li>' + esc(calcs[ci]) + '</li>';
        }
        h += '</ul>';
        h += '<p class="v4-field-note">Open calculator tools page to use these calculators.</p>';
        h += '<a href="?calc=v1" class="v4-btn v4-btn-outline" target="_blank">Open calculator tools &#8599;</a>';
        h += '</div>';
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
        if (calcDef && calcDef.risk_level !== 'high') {
          result.push(calcDef.display_name || calcId);
        }
      }
      return result;
    } catch(e) {
      return [];
    }
  }

  // ============================================================
  //  STEP 6: OUTPUT
  // ============================================================
  function stepOutput() {
    var h = '<h2 class="v4-step-h">Step 6: Output</h2>';
    h += '<p class="v4-step-d">Generate a combined draft from your selected and entered content.</p>';

    h += '<div class="v4-output-tabs" id="v4OutputTabs">';
    var tabs = [
      { id:'adv-emr', label:'EMR' },
      { id:'adv-soap', label:'SOAP' },
      { id:'adv-ref', label:'Referral' },
      { id:'adv-inst', label:'Instructions' }
    ];
    for (var i = 0; i < tabs.length; i++) {
      h += '<button class="v4-out-tab' + (i === 0 ? ' active' : '') + '" onclick="window._v4SwitchTab(\'' + tabs[i].id + '\', this)">' + tabs[i].label + '</button>';
    }
    h += '</div>';

    h += '<div class="v4-output-box" id="v4OutputBox">';
    h += '<pre class="v4-output-text" id="v4OutputText">Click "Generate" to create a combined draft.</pre>';
    h += '</div>';

    h += '<div class="v4-output-actions">';
    h += '<button class="v4-btn v4-btn-primary" onclick="window._v4Generate()">Generate</button>';
    h += '<button class="v4-btn v4-btn-outline" onclick="window._v4Copy()">Copy</button>';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearOutput()">Clear</button>';
    h += '</div>';

    return h;
  }

  // ============================================================
  //  OUTPUT GENERATION
  // ============================================================
  var _currentTab = 'adv-emr';

  function buildOutput(tabId) {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    var specName = draft ? draft.workflow_display_name : '';

    // Collect exam items
    var examItems = [];
    var exam = getExamDetails(state.selectedWorkflowId);
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        for (var pi = 0; pi < exam.exam_groups[gi].prompts.length; pi++) {
          var key = exam.exam_groups[gi].group_id + '::' + exam.exam_groups[gi].prompts[pi].prompt_id;
          if (state.examConfirmations[key]) {
            examItems.push(exam.exam_groups[gi].prompts[pi].prompt_text);
          }
        }
      }
    }

    // Collect plan options
    var planOpts = [];
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups) {
      for (var gi2 = 0; gi2 < plan.plan_option_groups.length; gi2++) {
        for (var oi = 0; oi < plan.plan_option_groups[gi2].options.length; oi++) {
          var opt = plan.plan_option_groups[gi2].options[oi];
          if (state.planConfirmations[opt.option_id]) {
            planOpts.push(opt.option_text);
          }
        }
      }
    }

    var history = state.historyDraft || (draft ? draft.default_history_draft : '');
    var impression = state.impression || '[not documented]';
    var planFree = state.planText || '';

    // Clean plan text - remove filler phrases
    var cleanedPlan = cleanText(planFree);

    // Deduplicate plan options against history
    var uniquePlan = [];
    var hLower = history.toLowerCase();
    for (var pi2 = 0; pi2 < planOpts.length; pi2++) {
      var txt = planOpts[pi2];
      if (hLower.indexOf(txt.toLowerCase()) < 0) {
        uniquePlan.push(txt);
      } else {
        // Check if it's truly duplicate or just similar
        uniquePlan.push(txt);
      }
    }

    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use. Najm AI ClinicNote is an educational/productivity tool. Not a medical device.]';

    var examSection = examItems.length ? examItems.join('\n') : '[not documented]';
    var planSection = '';
    if (uniquePlan.length) planSection += uniquePlan.join('\n') + '\n';
    if (cleanedPlan) planSection += cleanedPlan + '\n';
    if (!uniquePlan.length && !cleanedPlan) planSection = '[not documented]';

    switch (tabId) {
      case 'adv-emr':
        return 'SHORT EMR NOTE' + (specName ? ' (' + specName + ')' : '') + '\n' +
          '='.repeat(40) + '\n\n' +
          'History:\n' + history + '\n\n' +
          'Examination:\n' + examSection + '\n\n' +
          'Assessment:\n' + impression + '\n\n' +
          'Plan:\n' + planSection +
          footer;

      case 'adv-soap':
        return 'SOAP NOTE' + (specName ? ' (' + specName + ')' : '') + '\n' +
          '='.repeat(40) + '\n\n' +
          'SUBJECTIVE:\n' + history + '\n\n' +
          'OBJECTIVE:\n' + examSection + '\n\n' +
          'ASSESSMENT:\n' + impression + '\n\n' +
          'PLAN:\n' + planSection +
          footer;

      case 'adv-ref':
        return 'REFERRAL DRAFT' + (specName ? ' (' + specName + ')' : '') + '\n' +
          '='.repeat(40) + '\n\n' +
          'Reason for referral:\n' + history + '\n\n' +
          'Clinical history:\n' + history + '\n\n' +
          'Examination findings:\n' + examSection + '\n\n' +
          'Current impression:\n' + impression + '\n\n' +
          'Plan / recommendations:\n' + planSection +
          '\nPlease see and advise.\n' +
          footer;

      case 'adv-inst':
        var instItems = [];
        if (uniquePlan.length) {
          for (var ii = 0; ii < uniquePlan.length; ii++) {
            var t = uniquePlan[ii].toLowerCase();
            // Only include patient-facing categories
            if (t.indexOf('patient_instruction') >= 0 || t.indexOf('safety_netting') >= 0 || t.indexOf('follow_up') >= 0) {
              instItems.push(uniquePlan[ii]);
            }
          }
        }
        // Also include free plan text if entered
        if (cleanedPlan) instItems.push(cleanedPlan);

        return 'PATIENT INSTRUCTIONS' + (specName ? ' (' + specName + ')' : '') + '\n' +
          '='.repeat(40) + '\n\n' +
          'Assessment:\n' + impression + '\n\n' +
          'Plan / Advice:\n' +
          (instItems.length ? instItems.join('\n') : '[not documented]') + '\n\n' +
          'Review with your clinician. Seek medical attention if symptoms worsen.\n' +
          footer;

      default:
        return 'Select an output format.';
    }
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

  // ============================================================
  //  SIDEBAR
  // ============================================================
  function updateSidebar() {
    var container = document.getElementById('v4SidebarContent');
    if (!container) return;

    var h = '';
    if (!state.selectedWorkflowId) {
      h = '<p class="v4-sidebar-empty">Select a workflow to begin.</p>';
    } else {
      h += '<div class="v4-si"><span class="v4-si-label">Workflow:</span><span class="v4-si-val">' + esc(state.selectedWorkflowDisplay) + '</span></div>';

      var hl = (state.historyDraft || (getHistoryDraft(state.selectedWorkflowId) || {}).default_history_draft || '').length;
      var edited = state.historyDraft && state.historyDraft !== (getHistoryDraft(state.selectedWorkflowId) || {}).default_history_draft;
      h += '<div class="v4-si"><span class="v4-si-label">History:</span><span class="v4-si-val">' + hl + ' chars' + (edited ? ' (edited)' : '') + '</span></div>';

      var ec = countExamSelected();
      h += '<div class="v4-si"><span class="v4-si-label">Exam items:</span><span class="v4-si-val">' + ec + ' selected</span></div>';

      h += '<div class="v4-si"><span class="v4-si-label">Impression:</span><span class="v4-si-val">' + (state.impression ? 'Entered' : 'Empty') + '</span></div>';

      if (state.impression && state.impression.length > 60) {
        h += '<div class="v4-si-snip">' + esc(state.impression.slice(0, 60)) + '...' + '</div>';
      }

      h += '<div class="v4-si"><span class="v4-si-label">Plan:</span><span class="v4-si-val">' + (state.planText || countPlanSelected() > 0 ? 'Entered' : 'Empty') + '</span></div>';

      var pc = countPlanSelected();
      if (pc > 0) {
        h += '<div class="v4-si"><span class="v4-si-label">Plan options:</span><span class="v4-si-val">' + pc + ' selected</span></div>';
      }
    }

    container.innerHTML = h;
  }

  // ============================================================
  //  NAVIGATION
  // ============================================================
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
      inds[i].className = 'v4-s-indicator' +
        (s === currentStep ? ' active' : '') +
        (s < currentStep ? ' done' : '');
    }
  }

  function emptyStep(msg) {
    return '<div class="v4-empty-state"><p>' + esc(msg) + '</p></div>';
  }

  function fmtCat(cat) {
    return (cat || '').replace(/_/g, ' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  function getGroupChecked(groupId) {
    var n = 0;
    for (var k in state.examConfirmations) {
      if (k.indexOf(groupId + '::') === 0 && state.examConfirmations[k]) n++;
    }
    return n;
  }

  // ============================================================
  //  WINDOW HANDLERS
  // ============================================================

  // Workflow
  window._v4SelectWf = function() {
    var sel = document.getElementById('v4WorkflowSelect');
    if (!sel) return;
    var wfId = sel.value;
    if (!wfId) return;

    state.selectedWorkflowId = wfId;
    var info = getWorkflowInfo(wfId);
    if (info) {
      state.selectedWorkflowDisplay = info.display_name;
      state.selectedWorkflowSpecialty = info.specialty;
      state.selectedWorkflowSafety = info.safety_note;
    }

    var draft = getHistoryDraft(wfId);
    state.historyDraft = draft ? draft.default_history_draft : '';
    if (draft) state.historyPlaceholders = draft.editable_placeholders || [];

    state.examConfirmations = {};
    state.planConfirmations = {};
    state.impression = '';
    state.planText = '';

    renderStep(1);
    updateSidebar();
  };

  // History
  window._v4UpdateHist = function(val) {
    state.historyDraft = val;
    checkAllPhi();
    updateSidebar();
  };

  window._v4ClearHistory = function() {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    state.historyDraft = draft ? draft.default_history_draft : '';
    var ta = document.getElementById('v4HistoryDraft');
    if (ta) ta.value = state.historyDraft;
    checkAllPhi();
    updateSidebar();
  };

  // Exam
  window._v4ToggleGroup = function(groupId) {
    var body = document.getElementById('v4egb_' + groupId);
    var toggle = document.getElementById('v4egt_' + groupId);
    if (!body || !toggle) return;
    var show = body.style.display !== 'none';
    body.style.display = show ? 'none' : '';
    toggle.innerHTML = show ? '&#9654;' : '&#9660;';
  };

  window._v4ToggleExam = function(key, checked) {
    state.examConfirmations[key] = checked;
    var parts = key.split('::');
    var groupId = parts[0];
    var countEl = document.getElementById('v4egc_' + groupId);
    if (countEl) countEl.textContent = getGroupChecked(groupId) + '/' + getGroupTotal(groupId);

    // Style the prompt label
    var labels = document.querySelectorAll('.v4-exam-prompt');
    for (var i = 0; i < labels.length; i++) {
      var cb = labels[i].querySelector('input[type="checkbox"]');
      if (cb && cb.getAttribute('onchange').indexOf(key) >= 0) {
        labels[i].classList.toggle('checked', checked);
      }
    }
    updateSidebar();
  };

  function getGroupTotal(groupId) {
    var exam = getExamDetails(state.selectedWorkflowId);
    if (!exam || !exam.exam_groups) return 0;
    for (var i = 0; i < exam.exam_groups.length; i++) {
      if (exam.exam_groups[i].group_id === groupId) return exam.exam_groups[i].prompts.length;
    }
    return 0;
  }

  window._v4ClearExam = function() {
    state.examConfirmations = {};
    renderStep(3);
    updateSidebar();
  };

  // Plan
  window._v4TogglePlan = function(optId) {
    state.planConfirmations[optId] = !state.planConfirmations[optId];
    // Update label style
    var labels = document.querySelectorAll('.v4-plan-opt');
    for (var i = 0; i < labels.length; i++) {
      var cb = labels[i].querySelector('input');
      if (cb && cb.getAttribute('onchange').indexOf(optId) >= 0) {
        labels[i].classList.toggle('checked', cb.checked);
      }
    }
    updateSidebar();
  };

  window._v4UpdateImp = function(val) {
    state.impression = val;
    checkAllPhi();
    updateSidebar();
  };

  window._v4UpdatePlan = function(val) {
    state.planText = val;
    checkAllPhi();
    updateSidebar();
  };

  window._v4ClearPlan = function() {
    state.impression = '';
    state.planText = '';
    state.planConfirmations = {};
    renderStep(4);
    updateSidebar();
  };

  // Output
  var _outputGenerated = false;

  window._v4Generate = function() {
    var text = document.getElementById('v4OutputText');
    if (!text) return;
    var tabEl = document.querySelector('.v4-out-tab.active');
    var tabId = tabEl ? tabEl.getAttribute('onclick').match(/'([^']+)'/)[1] : 'adv-emr';
    text.textContent = buildOutput(tabId);
    _outputGenerated = true;
    updateSidebar();
  };

  window._v4SwitchTab = function(tabId, btn) {
    var tabs = document.querySelectorAll('.v4-out-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');

    if (_outputGenerated) {
      var text = document.getElementById('v4OutputText');
      if (text) text.textContent = buildOutput(tabId);
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
    if (text) text.textContent = 'Click "Generate" to create a combined draft.';
    _outputGenerated = false;
  };

  // Navigation
  window._v4Prev = function() {
    if (currentStep <= 1) return;
    currentStep--;
    renderStep(currentStep);
    updateSidebar();
  };

  window._v4Next = function() {
    if (currentStep >= TOTAL_STEPS) return;
    currentStep++;
    renderStep(currentStep);
    updateSidebar();
    if (currentStep === TOTAL_STEPS) {
      // Pre-generate empty output
    }
  };

  // ============================================================
  //  INIT
  // ============================================================
  function init() {
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;

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

  // Inject styles
  var style = document.createElement('style');
  style.textContent = V4_STYLES();
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================================
  //  STYLES
  // ============================================================
  function V4_STYLES() {
    return `
#page-advanced-encounter.active{display:block}
.v4-loading{padding:60px;text-align:center;font-size:18px;color:var(--gray-500)}
.v4-safety-banner{background:var(--red-bg);border:1px solid var(--red-border);color:var(--red);text-align:center;padding:10px 16px;font-size:12px;font-weight:500;line-height:1.4;margin-bottom:8px}
.v4-phi-warning{background:var(--red-bg);border:1px solid var(--red-border);color:var(--red);padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px;display:none}

/* Stepper */
.v4-stepper{display:flex;gap:0;margin-bottom:20px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);overflow:hidden}
.v4-s-indicator{flex:1;display:flex;align-items:center;gap:6px;padding:14px 12px;font-size:12px;font-weight:500;color:var(--gray-400);border-right:1px solid var(--gray-200);transition:all .15s}
.v4-s-indicator:last-child{border-right:none}
.v4-s-indicator.active{background:var(--primary-bg);color:var(--primary)}
.v4-s-indicator.done{color:var(--green)}
.v4-s-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:var(--gray-200);color:var(--gray-600);flex-shrink:0}
.v4-s-indicator.active .v4-s-num{background:var(--primary);color:#fff}
.v4-s-indicator.done .v4-s-num{background:var(--green);color:#fff}
.v4-s-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Layout */
.v4-layout{display:grid;grid-template-columns:1fr 280px;gap:24px}
.v4-main{min-width:0}
.v4-sidebar{position:sticky;top:80px;align-self:start}
.v4-sidebar-inner{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:20px}
.v4-sidebar-title{font-size:15px;font-weight:700;color:var(--gray-800);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--gray-200)}
.v4-sidebar-empty{font-size:13px;color:var(--gray-400)}
.v4-si{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--gray-100);font-size:12px}
.v4-si-label{color:var(--gray-500)}
.v4-si-val{font-weight:600;color:var(--gray-700)}
.v4-si-snip{font-size:11px;color:var(--gray-400);margin-top:2px;margin-bottom:6px;font-style:italic}

/* Step content */
.v4-step-content{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:24px;min-height:300px}
.v4-step-h{font-size:20px;font-weight:700;color:var(--gray-900);margin-bottom:6px}
.v4-step-d{font-size:13px;color:var(--gray-500);margin-bottom:20px;line-height:1.5}

/* Workflow */
.v4-select{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:14px;font-family:var(--font);background:#fff;color:var(--gray-800)}
.v4-select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.v4-wf-info{margin-top:16px;padding:14px;background:var(--gray-50);border-radius:8px}
.v4-wf-info-row{display:flex;gap:8px;padding:3px 0;font-size:13px}
.v4-wf-info-label{font-weight:600;color:var(--gray-600);min-width:80px}
.v4-wf-info-val{color:var(--gray-800)}
.v4-autofill-context{margin-top:12px}
.v4-autofill-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.v4-af-chip{display:inline-block;padding:4px 10px;border-radius:6px;background:var(--amber-bg);border:1px solid var(--amber-border);font-size:11px;font-weight:500;color:var(--amber)}

/* Safety boxes */
.v4-safety-box{background:var(--red-bg);border:1px solid var(--red-border);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:14px;line-height:1.4}
.v4-safety-box-sm{background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:6px;padding:8px 12px;font-size:11px;color:var(--gray-600);margin-bottom:10px;line-height:1.4}

/* Textarea */
.v4-textarea{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:13px;font-family:var(--font);line-height:1.6;resize:vertical;color:var(--gray-800)}
.v4-textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.v4-textarea-lg{min-height:200px}
.v4-textarea-med{min-height:100px}

/* Field label */
.v4-field-label{display:block;font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:6px}
.v4-field-note{font-size:12px;color:var(--gray-400);margin-top:4px;line-height:1.4}

/* Placeholder chips */
.v4-placeholders{margin-top:10px}
.v4-ph-chips{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0}
.v4-ph-chip{display:inline-block;padding:3px 8px;border-radius:4px;background:var(--amber-bg);border:1px solid var(--amber-border);font-size:11px;font-family:var(--font-mono);color:var(--amber)}

/* Collapsed sections */
.v4-collapse{border:1px solid var(--gray-200);border-radius:8px;margin-top:12px}
.v4-collapse-summary{padding:10px 14px;font-size:12px;font-weight:600;color:var(--gray-600);cursor:pointer}
.v4-collapse-body{padding:8px 14px 14px;display:flex;flex-wrap:wrap;gap:5px}
.v4-section-chip{display:inline-block;padding:3px 8px;border-radius:4px;background:var(--gray-100);font-size:11px;color:var(--gray-500)}

/* Exam groups */
.v4-exam-group{border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px;overflow:hidden}
.v4-exam-group-header{display:flex;align-items:center;gap:8px;padding:12px 14px;background:var(--gray-50);cursor:pointer;font-size:13px;font-weight:600;color:var(--gray-700)}
.v4-exam-group-header:hover{background:var(--gray-100)}
.v4-eg-toggle{font-size:10px;width:16px;text-align:center}
.v4-eg-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--gray-400)}
.v4-exam-body{padding:8px 14px 14px}
.v4-exam-prompt{display:flex;align-items:flex-start;gap:8px;padding:7px 0;cursor:pointer;font-size:12px;color:var(--gray-700);line-height:1.5}
.v4-exam-prompt:hover{background:var(--gray-50);border-radius:4px}
.v4-exam-prompt.checked{color:var(--gray-900)}
.v4-exam-prompt input[type="checkbox"]{margin-top:2px;flex-shrink:0}
.v4-ep-text{flex:1}
.v4-ep-warn{font-size:13px;cursor:help;flex-shrink:0;color:var(--amber)}

/* Plan */
.v4-plan-row{margin-bottom:20px}
.v4-pog{margin-bottom:12px}
.v4-pog-label{font-size:11px;font-weight:700;color:var(--gray-600);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em}
.v4-plan-opt{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--gray-700)}
.v4-plan-opt:hover{background:var(--gray-50)}
.v4-plan-opt.checked{background:var(--primary-bg)}
.v4-plan-opt input[type="checkbox"]{margin-top:2px;flex-shrink:0}
.v4-po-text{flex:1;line-height:1.4}
.v4-po-cat{font-size:10px;color:var(--gray-400);background:var(--gray-100);padding:2px 6px;border-radius:4px;white-space:nowrap;flex-shrink:0}

/* Step actions */
.v4-step-actions{margin-top:16px;padding-top:12px;border-top:1px solid var(--gray-100)}

/* Calculators */
.v4-calc-section{margin-top:12px}
.v4-calc-list{margin:10px 0;padding-left:20px}
.v4-calc-list li{font-size:13px;color:var(--gray-700);padding:3px 0}
.v4-calc-empty{font-size:13px;color:var(--gray-400);padding:16px 0}

/* Output */
.v4-output-tabs{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.v4-out-tab{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid var(--gray-200);background:#fff;color:var(--gray-500);cursor:pointer;font-family:var(--font)}
.v4-out-tab.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.v4-output-box{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:16px;min-height:250px;max-height:550px;overflow:auto;margin-bottom:12px}
.v4-output-text{font-size:12px;font-family:var(--font-mono);white-space:pre-wrap;line-height:1.6;color:var(--gray-700)}
.v4-output-actions{display:flex;gap:8px;flex-wrap:wrap}
.v4-output-actions .v4-btn{padding:8px 18px;font-size:13px}

/* Nav */
.v4-nav{display:flex;align-items:center;justify-content:space-between;margin-top:16px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:12px 20px}
.v4-nav-right{display:flex;align-items:center;gap:12px}
.v4-step-info{font-size:13px;color:var(--gray-400);font-weight:500}

/* Buttons */
.v4-btn{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--font);display:inline-flex;align-items:center;gap:6px;text-decoration:none}
.v4-btn-primary{background:var(--primary);color:#fff}
.v4-btn-primary:hover{background:var(--primary-light)}
.v4-btn-outline{background:#fff;color:var(--primary);border:2px solid var(--primary)}
.v4-btn-outline:hover{background:var(--primary-bg)}
.v4-btn-ghost{background:transparent;color:var(--gray-600);border:1px solid var(--gray-200)}
.v4-btn-ghost:hover{background:var(--gray-50)}
.v4-btn:disabled{opacity:0.4;cursor:not-allowed}

/* Empty state */
.v4-empty-state{text-align:center;padding:60px 20px;color:var(--gray-400);font-size:15px}

/* Mobile */
@media(max-width:768px){
  .v4-layout{grid-template-columns:1fr}
  .v4-sidebar{display:none}
  .v4-stepper{overflow-x:auto}
  .v4-s-label{display:none}
  .v4-output-tabs{gap:3px}
  .v4-out-tab{font-size:11px;padding:6px 10px}
}
    `;
  }

})();
