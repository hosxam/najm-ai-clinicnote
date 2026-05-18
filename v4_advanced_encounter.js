(function() {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  if (params.get('v4') !== 'encounter2') return;

  // ---- State ----
  var state = {
    workflows: [],
    historyDrafts: [],
    examDetails: [],
    planOptions: [],
    selectedWorkflowId: null,
    historyDraft: '',
    placeholders: {},
    examConfirmations: {},
    planConfirmations: {},
    impression: '',
    planText: '',
    calculatorNotes: ''
  };

  var currentStep = 1;
  var totalSteps = 6;

  // ---- Data Loading ----
  function loadV4Data() {
    return Promise.all([
      fetch('./data/v4_workflow_history_drafts.json').then(function(r) { return r.json(); }),
      fetch('./data/v4_workflow_exam_details.json').then(function(r) { return r.json(); }),
      fetch('./data/v4_plan_options.json').then(function(r) { return r.json(); })
    ]).then(function(results) {
      state.historyDrafts = results[0];
      state.examDetails = results[1];
      state.planOptions = results[2];
      state.workflows = state.historyDrafts.map(function(d) {
        return { workflow_id: d.workflow_id, display_name: d.workflow_display_name };
      });
    });
  }

  // ---- Render ----
  function renderApp() {
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;
    app.classList.add('active');

    var html = '';
    html += '<div class="v4-encounter-wrapper">';
    html += '<div class="v4-encounter-main">';

    // Step indicators
    html += '<div class="v4-stepper" id="v4Stepper">';
    var stepLabels = ['Workflow', 'History', 'Exam', 'Plan', 'Calculators', 'Output'];
    for (var i = 1; i <= totalSteps; i++) {
      html += '<div class="v4-step-indicator' + (i === currentStep ? ' active' : '') + (i < currentStep ? ' done' : '') + '" data-step="' + i + '">';
      html += '<span class="v4-step-num">' + (i < currentStep ? '&#10003;' : i) + '</span>';
      html += '<span class="v4-step-label">' + stepLabels[i - 1] + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Step content
    html += '<div class="v4-step-content" id="v4StepContent"></div>';

    // Navigation
    html += '<div class="v4-nav">';
    html += '<button class="v4-btn v4-btn-ghost" id="v4PrevBtn" onclick="window._v4PrevStep()" ' + (currentStep <= 1 ? 'disabled' : '') + '>Back</button>';
    html += '<div class="v4-nav-right">';
    html += '<span class="v4-step-info">Step ' + currentStep + ' of ' + totalSteps + '</span>';
    html += '<button class="v4-btn v4-btn-primary" id="v4NextBtn" onclick="window._v4NextStep()">' + (currentStep >= totalSteps ? 'Finish' : 'Next') + '</button>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // .v4-encounter-main

    // Right sidebar - recipe summary
    html += '<div class="v4-recipe-sidebar" id="v4RecipeSidebar">';
    html += '<h3 class="v4-recipe-title">Encounter Summary</h3>';
    html += '<div id="v4RecipeContent"><p class="v4-recipe-empty">Select a workflow to begin.</p></div>';
    html += '</div>';

    html += '</div>'; // .v4-encounter-wrapper

    app.innerHTML = html;
    renderStep(currentStep);
    updateRecipe();
    updateNav();
  }

  function renderStep(step) {
    var container = document.getElementById('v4StepContent');
    if (!container) return;

    var html = '';
    switch (step) {
      case 1: html = renderWorkflowStep(); break;
      case 2: html = renderHistoryStep(); break;
      case 3: html = renderExamStep(); break;
      case 4: html = renderPlanStep(); break;
      case 5: html = renderCalculatorsStep(); break;
      case 6: html = renderOutputStep(); break;
    }
    container.innerHTML = html;
  }

  // ---- Step 1: Workflow ----
  function renderWorkflowStep() {
    var h = '<h2 class="v4-step-heading">Select Workflow</h2>';
    h += '<p class="v4-step-desc">Choose a clinical workflow to load the V4 advanced encounter prototype.</p>';
    h += '<div class="v4-workflow-grid">';
    for (var i = 0; i < state.workflows.length; i++) {
      var wf = state.workflows[i];
      var sel = wf.workflow_id === state.selectedWorkflowId;
      h += '<div class="v4-workflow-card' + (sel ? ' selected' : '') + '" data-wf="' + wf.workflow_id + '" onclick="window._v4SelectWorkflow(\'' + wf.workflow_id + '\')">';
      h += '<div class="v4-wf-icon">' + getWorkflowIcon(wf.workflow_id) + '</div>';
      h += '<div class="v4-wf-name">' + escapeHtml(wf.display_name) + '</div>';
      h += '<div class="v4-wf-id">' + escapeHtml(wf.workflow_id) + '</div>';
      if (sel) h += '<div class="v4-wf-check">&#10003;</div>';
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  function getWorkflowIcon(wfId) {
    var icons = {
      'gp-fever-urti': '\ud83e\udd12',
      'gp-diabetes-followup': '\ud83d\udc8a',
      'msk-low-back-pain': '\ud83e\uddcd\u200d\u2642\ufe0f',
      'peds-fever': '\ud83e\uddd2',
      'obgyn-antenatal-followup': '\ud83e\udd30'
    };
    return icons[wfId] || '\ud83d\udcdd';
  }

  // ---- Step 2: History ----
  function renderHistoryStep() {
    if (!state.selectedWorkflowId) {
      return '<div class="v4-empty-state"><p>Select a workflow first.</p></div>';
    }
    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) {
      return '<div class="v4-empty-state"><p>History draft not found for this workflow.</p></div>';
    }

    var h = '<h2 class="v4-step-heading">Edit History Draft</h2>';
    h += '<p class="v4-step-desc">Edit the draft below. Replace placeholders in brackets with specific details.</p>';
    h += '<div class="v4-safety-note">' + escapeHtml(draft.safety_note) + '</div>';

    // Highlight placeholders in the draft text
    var displayText = state.historyDraft || draft.default_history_draft;

    h += '<textarea class="v4-history-textarea" id="v4HistoryDraft" oninput="window._v4UpdateHistory(this.value)">' + escapeHtml(displayText) + '</textarea>';

    // Placeholder helper
    h += '<div class="v4-placeholder-helper">';
    h += '<span class="v4-helper-label">Placeholders to fill:</span>';
    if (draft.editable_placeholders && draft.editable_placeholders.length) {
      for (var i = 0; i < draft.editable_placeholders.length; i++) {
        h += '<span class="v4-placeholder-chip">' + escapeHtml(draft.editable_placeholders[i]) + '</span>';
      }
    } else {
      h += '<span class="v4-placeholder-chip">None</span>';
    }
    h += '</div>';

    return h;
  }

  // ---- Step 3: Examination ----
  function renderExamStep() {
    if (!state.selectedWorkflowId) {
      return '<div class="v4-empty-state"><p>Select a workflow first.</p></div>';
    }
    var exam = getExamDetails(state.selectedWorkflowId);
    if (!exam) {
      return '<div class="v4-empty-state"><p>Exam details not available for this workflow.</p></div>';
    }

    var h = '<h2 class="v4-step-heading">Examination Documentation</h2>';
    h += '<p class="v4-step-desc">Select exam items that were assessed. Document only if assessed.</p>';
    h += '<div class="v4-safety-note">' + escapeHtml(exam.safety_note) + '</div>';

    for (var gi = 0; gi < exam.exam_groups.length; gi++) {
      var group = exam.exam_groups[gi];
      h += '<div class="v4-exam-group">';
      h += '<div class="v4-exam-group-header" onclick="window._v4ToggleExamGroup(\'' + group.group_id + '\')">';
      h += '<span class="v4-exam-group-toggle">' + (window._v4ExamGroupOpen && window._v4ExamGroupOpen[group.group_id] ? '\u25bc' : '\u25b6') + '</span>';
      h += '<span class="v4-exam-group-label">' + escapeHtml(group.group_label) + '</span>';
      h += '<span class="v4-exam-group-count">' + getExamGroupCheckedCount(group.group_id) + '/' + group.prompts.length + '</span>';
      h += '</div>';
      h += '<div class="v4-exam-prompts"' + (window._v4ExamGroupOpen && window._v4ExamGroupOpen[group.group_id] ? '' : ' style="display:none"') + '>';
      for (var pi = 0; pi < group.prompts.length; pi++) {
        var prompt = group.prompts[pi];
        var key = group.group_id + '::' + prompt.prompt_id;
        var checked = state.examConfirmations[key] || false;
        h += '<label class="v4-exam-prompt">';
        h += '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onchange="window._v4ToggleExam(\'' + key + '\')">';
        h += '<span class="v4-prompt-text">' + escapeHtml(prompt.prompt_text) + '</span>';
        if (prompt.warning) {
          h += '<span class="v4-prompt-warning" title="' + escapeHtml(prompt.warning) + '">\u26a0\ufe0f</span>';
        }
        h += '</label>';
      }
      h += '</div>';
      h += '</div>';
    }

    return h;
  }

  // ---- Step 4: Assessment & Plan ----
  function renderPlanStep() {
    if (!state.selectedWorkflowId) {
      return '<div class="v4-empty-state"><p>Select a workflow first.</p></div>';
    }

    var h = '<h2 class="v4-step-heading">Assessment & Plan</h2>';
    h += '<p class="v4-step-desc">Enter impression and confirm plan options discussed.</p>';

    // Impression
    h += '<div class="v4-plan-section">';
    h += '<label class="v4-field-label">Doctor Impression</label>';
    h += '<textarea class="v4-input v4-impression-input" id="v4Impression" oninput="window._v4UpdateImpression(this.value)" placeholder="Enter your impression or assessment here. Free text only.">' + escapeHtml(state.impression) + '</textarea>';
    h += '</div>';

    // Plan options
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups && plan.plan_option_groups.length) {
      h += '<div class="v4-plan-section">';
      h += '<label class="v4-field-label">Plan Documentation Options</label>';
      h += '<p class="v4-field-desc">Confirm each option that was discussed or decided by the clinician.</p>';
      if (plan.safety_note) {
        h += '<div class="v4-safety-note-sm">' + escapeHtml(plan.safety_note) + '</div>';
      }

      for (var gi = 0; gi < plan.plan_option_groups.length; gi++) {
        var group = plan.plan_option_groups[gi];
        h += '<div class="v4-plan-option-group">';
        h += '<div class="v4-plan-option-group-label">' + escapeHtml(group.group_label) + '</div>';
        for (var oi = 0; oi < group.options.length; oi++) {
          var opt = group.options[oi];
          var checked = state.planConfirmations[opt.option_id] || false;
          h += '<label class="v4-plan-option">';
          h += '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onchange="window._v4TogglePlanOption(\'' + opt.option_id + '\')">';
          h += '<span class="v4-plan-option-text">' + escapeHtml(opt.option_text) + '</span>';
          h += '<span class="v4-plan-option-cat">' + escapeHtml(formatCategory(opt.option_category)) + '</span>';
          h += '</label>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    // Free text plan
    h += '<div class="v4-plan-section">';
    h += '<label class="v4-field-label">Doctor Plan (free text)</label>';
    h += '<textarea class="v4-input v4-plan-textarea" id="v4PlanText" oninput="window._v4UpdatePlanText(this.value)" placeholder="Enter any additional plan details not covered by options above.">' + escapeHtml(state.planText) + '</textarea>';
    h += '</div>';

    return h;
  }

  // ---- Step 5: Calculators ----
  function renderCalculatorsStep() {
    var h = '<h2 class="v4-step-heading">Calculators</h2>';
    h += '<p class="v4-step-desc">Optional calculator results can be included in the output.</p>';
    h += '<div class="v4-safety-note">Only include calculator values that were explicitly checked and confirmed by the clinician. High-risk calculators are not shown.</div>';

    // Show available calculators from V3 mapping
    var available = getAvailableCalculators();
    if (available && available.length) {
      for (var i = 0; i < available.length; i++) {
        var calc = available[i];
        h += '<label class="v4-calc-option">';
        h += '<input type="checkbox" onchange="window._v4ToggleCalculator(\'' + escapeHtml(calc.id) + '\', this.checked)">';
        h += '<span class="v4-calc-name">' + escapeHtml(calc.name || calc.id) + '</span>';
        if (calc.category) h += '<span class="v4-calc-cat">' + escapeHtml(calc.category) + '</span>';
        h += '</label>';
      }
    } else {
      h += '<p class="v4-empty-text">No calculator data available. Use the free text field below to enter any calculator values.</p>';
    }

    h += '<div class="v4-plan-section">';
    h += '<label class="v4-field-label">Calculator / Measurement Notes</label>';
    h += '<textarea class="v4-input v4-calc-textarea" id="v4CalcNotes" oninput="window._v4UpdateCalcNotes(this.value)" placeholder="Enter any calculator results or measurements here.">' + escapeHtml(state.calculatorNotes) + '</textarea>';
    h += '</div>';

    return h;
  }

  // ---- Step 6: Output ----
  function renderOutputStep() {
    var h = '<h2 class="v4-step-heading">Combined Output</h2>';
    h += '<p class="v4-step-desc">Review the generated draft. Copy or print as needed.</p>';

    h += '<div class="v4-output-tabs" id="v4OutputTabs">';
    var tabs = [
      { id: 'advanced-soap', label: 'SOAP' },
      { id: 'advanced-emr', label: 'EMR' },
      { id: 'advanced-fup', label: 'Follow-Up' },
      { id: 'advanced-ref', label: 'Referral' },
      { id: 'advanced-inst', label: 'Instructions' }
    ];
    for (var i = 0; i < tabs.length; i++) {
      h += '<button class="v4-output-tab' + (i === 0 ? ' active' : '') + '" onclick="window._v4SwitchOutputTab(\'' + tabs[i].id + '\')">' + tabs[i].label + '</button>';
    }
    h += '</div>';

    h += '<div class="v4-output-box" id="v4OutputBox">';
    h += '<div class="v4-output-text" id="v4OutputText"></div>';
    h += '</div>';

    h += '<div class="v4-output-actions">';
    h += '<button class="v4-btn v4-btn-primary" onclick="window._v4GenerateOutput()">Generate Output</button>';
    h += '<button class="v4-btn v4-btn-outline" onclick="window._v4CopyOutput()">Copy to Clipboard</button>';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearOutput()">Clear</button>';
    h += '</div>';

    return h;
  }

  // ---- Output Generation ----
  function generateCombinedOutput(format) {
    var draft = getHistoryDraft(state.selectedWorkflowId);
    var exam = getExamDetails(state.selectedWorkflowId);
    var plan = getPlanOptions(state.selectedWorkflowId);

    // Collect content
    var historyText = state.historyDraft || (draft ? draft.default_history_draft : '');
    var impressionText = state.impression || '[not documented]';
    var planText = state.planText || '';

    // Collect exam items
    var examItems = [];
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var prompt = group.prompts[pi];
          var key = group.group_id + '::' + prompt.prompt_id;
          if (state.examConfirmations[key]) {
            examItems.push(prompt.prompt_text);
          }
        }
      }
    }

    // Collect plan options
    var planOptions = [];
    if (plan && plan.plan_option_groups) {
      for (var gi2 = 0; gi2 < plan.plan_option_groups.length; gi2++) {
        var group2 = plan.plan_option_groups[gi2];
        for (var oi = 0; oi < group2.options.length; oi++) {
          var opt = group2.options[oi];
          if (state.planConfirmations[opt.option_id]) {
            planOptions.push(opt.option_text);
          }
        }
      }
    }

    // Deduplication: remove items that appear in history draft
    var cleanPlanOptions = [];
    for (var i2 = 0; i2 < planOptions.length; i2++) {
      var lower = planOptions[i2].toLowerCase();
      if (historyText.toLowerCase().indexOf(lower) < 0) {
        cleanPlanOptions.push(planOptions[i2]);
      }
    }

    var dc = 'Draft generated from doctor-entered information. Review before use. ClinicNote is an educational/productivity tool. Not a medical device.\n\n';
    var specName = draft ? draft.workflow_display_name : '';

    switch (format) {
      case 'advanced-soap':
        var soap = dc + 'SOAP NOTE\n';
        soap += 'Workflow: ' + specName + '\n\n';
        soap += 'SUBJECTIVE:\n' + historyText + '\n\n';
        soap += 'OBJECTIVE:\n';
        soap += examItems.length ? examItems.join('; ') + '\n\n' : '[not documented]\n\n';
        soap += 'ASSESSMENT:\n' + impressionText + '\n\n';
        soap += 'PLAN:\n';
        if (cleanPlanOptions.length) soap += cleanPlanOptions.join('; ') + '\n';
        if (planText) soap += planText + '\n';
        if (!cleanPlanOptions.length && !planText) soap += '[not documented]\n';
        if (state.calculatorNotes) soap += '\nCalculations / Measurements:\n' + state.calculatorNotes + '\n';
        return soap;

      case 'advanced-emr':
        var emr = dc + 'SHORT EMR NOTE\n';
        emr += 'Workflow: ' + specName + '\n\n';
        emr += 'HPI: ' + historyText + '\n\n';
        emr += 'Exam: ' + (examItems.length ? examItems.join('; ') : '[not documented]') + '\n\n';
        emr += 'Impression: ' + impressionText + '\n\n';
        emr += 'Plan: ';
        if (cleanPlanOptions.length) emr += cleanPlanOptions.join('; ') + '. ';
        if (planText) emr += planText + '. ';
        if (!cleanPlanOptions.length && !planText) emr += '[not documented]. ';
        if (state.calculatorNotes) emr += '\n\nCalculations: ' + state.calculatorNotes;
        return emr;

      case 'advanced-fup':
        var fup = dc + 'FOLLOW-UP NOTE\n';
        fup += 'Workflow: ' + specName + '\n\n';
        fup += 'Current status: ' + historyText + '\n\n';
        fup += 'Examination: ' + (examItems.length ? examItems.join('; ') : '[not documented]') + '\n\n';
        fup += 'Impression: ' + impressionText + '\n';
        if (state.calculatorNotes) fup += '\nCalculations: ' + state.calculatorNotes + '\n';
        fup += '\nPlan:\n';
        if (cleanPlanOptions.length) fup += cleanPlanOptions.join('\n') + '\n';
        if (planText) fup += planText + '\n';
        if (!cleanPlanOptions.length && !planText) fup += '[not documented]\n';
        return fup;

      case 'advanced-ref':
        var ref = dc + 'REFERRAL LETTER\n\n';
        ref += 'Workflow: ' + specName + '\n\n';
        ref += 'Reason for Referral: ' + historyText + '\n\n';
        ref += 'Relevant History:\n' + historyText + '\n\n';
        ref += 'Examination Findings:\n' + (examItems.length ? examItems.join('; ') : '[not documented]') + '\n\n';
        ref += 'Working Impression:\n' + impressionText + '\n\n';
        ref += 'Current Plan:\n';
        if (cleanPlanOptions.length) ref += cleanPlanOptions.join('; ') + '\n';
        if (planText) ref += planText + '\n';
        if (!cleanPlanOptions.length && !planText) ref += '[not documented]\n';
        ref += '\nPlease see and advise.\n';
        return ref;

      case 'advanced-inst':
        var inst = dc + 'PATIENT INSTRUCTIONS\n\n';
        inst += 'Assessment: ' + impressionText + '\n\n';
        if (cleanPlanOptions.length) {
          inst += 'Plan:\n';
          for (var pi3 = 0; pi3 < cleanPlanOptions.length; pi3++) {
            inst += '- ' + cleanPlanOptions[pi3] + '\n';
          }
        }
        if (planText) inst += planText + '\n';
        inst += '\nReview with your clinician. Seek medical attention if symptoms worsen.\n';
        return inst;

      default:
        return 'Select an output format.';
    }
  }

  // ---- Recipe Summary ----
  function updateRecipe() {
    var container = document.getElementById('v4RecipeContent');
    if (!container) return;

    var h = '';
    if (!state.selectedWorkflowId) {
      h = '<p class="v4-recipe-empty">Select a workflow to begin.</p>';
    } else {
      var draft = getHistoryDraft(state.selectedWorkflowId);
      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">Workflow:</span><span class="v4-recipe-value">' + escapeHtml(draft ? draft.workflow_display_name : state.selectedWorkflowId) + '</span></div>';

      var historyLength = (state.historyDraft || '').length;
      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">History:</span><span class="v4-recipe-value">' + historyLength + ' characters</span></div>';

      var examCount = countExamSelections();
      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">Exam items:</span><span class="v4-recipe-value">' + examCount + ' selected</span></div>';

      var planCount = countPlanSelections();
      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">Plan options:</span><span class="v4-recipe-value">' + planCount + ' confirmed</span></div>';

      var calcLen = (state.calculatorNotes || '').length;
      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">Calculator notes:</span><span class="v4-recipe-value">' + (calcLen ? calcLen + ' chars' : 'None') + '</span></div>';

      h += '<div class="v4-recipe-item"><span class="v4-recipe-label">Impression:</span><span class="v4-recipe-value">' + ((state.impression || '').length > 0 ? 'Entered' : 'Empty') + '</span></div>';
    }
    container.innerHTML = h;
  }

  function countExamSelections() {
    var count = 0;
    for (var key in state.examConfirmations) {
      if (state.examConfirmations[key]) count++;
    }
    return count;
  }

  function countPlanSelections() {
    var count = 0;
    for (var key in state.planConfirmations) {
      if (state.planConfirmations[key]) count++;
    }
    return count;
  }

  function getExamGroupCheckedCount(groupId) {
    var count = 0;
    for (var key in state.examConfirmations) {
      if (key.indexOf(groupId + '::') === 0 && state.examConfirmations[key]) count++;
    }
    return count;
  }

  // ---- Navigation ----
  function updateNav() {
    var prevBtn = document.getElementById('v4PrevBtn');
    var nextBtn = document.getElementById('v4NextBtn');
    var stepInfo = document.querySelector('.v4-step-info');
    if (prevBtn) prevBtn.disabled = currentStep <= 1;
    if (nextBtn) nextBtn.textContent = currentStep >= totalSteps ? 'Finish' : 'Next';
    if (stepInfo) stepInfo.textContent = 'Step ' + currentStep + ' of ' + totalSteps;

    // Update step indicators
    var indicators = document.querySelectorAll('.v4-step-indicator');
    for (var i = 0; i < indicators.length; i++) {
      var step = parseInt(indicators[i].getAttribute('data-step'), 10);
      indicators[i].className = 'v4-step-indicator' +
        (step === currentStep ? ' active' : '') +
        (step < currentStep ? ' done' : '');
    }
  }

  function prevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    renderStep(currentStep);
    updateRecipe();
    updateNav();
  }

  function nextStep() {
    if (currentStep >= totalSteps) return;
    currentStep++;
    renderStep(currentStep);
    updateRecipe();
    updateNav();
    if (currentStep === totalSteps) {
      renderOutput();
    }
  }

  function renderOutput() {
    var text = document.getElementById('v4OutputText');
    if (!text) return;
    text.textContent = generateCombinedOutput('advanced-soap');
  }

  // ---- Event Handlers ----
  window._v4SelectWorkflow = function(wfId) {
    state.selectedWorkflowId = wfId;
    var draft = getHistoryDraft(wfId);
    state.historyDraft = draft ? draft.default_history_draft : '';
    state.impression = '';
    state.planText = '';
    state.calculatorNotes = '';
    state.examConfirmations = {};
    state.planConfirmations = {};
    renderStep(1);
    updateRecipe();
    // Re-render workflow cards
    var cards = document.querySelectorAll('.v4-workflow-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('selected', cards[i].getAttribute('data-wf') === wfId);
    }
  };

  window._v4UpdateHistory = function(value) {
    state.historyDraft = value;
    updateRecipe();
  };

  window._v4ToggleExamGroup = function(groupId) {
    if (!window._v4ExamGroupOpen) window._v4ExamGroupOpen = {};
    window._v4ExamGroupOpen[groupId] = !window._v4ExamGroupOpen[groupId];
    renderStep(currentStep);
  };

  window._v4ExamGroupOpen = {};

  window._v4ToggleExam = function(key) {
    state.examConfirmations[key] = !state.examConfirmations[key];
    updateRecipe();
    // Update group count
    var parts = key.split('::');
    var groupId = parts[0];
    var groupHeader = document.querySelector('[onclick="window._v4ToggleExamGroup(\'' + groupId + '\')"]');
    if (groupHeader) {
      var countEl = groupHeader.querySelector('.v4-exam-group-count');
      if (countEl) countEl.textContent = getExamGroupCheckedCount(groupId) + '/' + countTotalInGroup(groupId);
    }
  };

  function countTotalInGroup(groupId) {
    var exam = getExamDetails(state.selectedWorkflowId);
    if (!exam || !exam.exam_groups) return 0;
    for (var i = 0; i < exam.exam_groups.length; i++) {
      if (exam.exam_groups[i].group_id === groupId) {
        return exam.exam_groups[i].prompts.length;
      }
    }
    return 0;
  }

  window._v4TogglePlanOption = function(optionId) {
    state.planConfirmations[optionId] = !state.planConfirmations[optionId];
    updateRecipe();
  };

  window._v4UpdateImpression = function(value) {
    state.impression = value;
    updateRecipe();
  };

  window._v4UpdatePlanText = function(value) {
    state.planText = value;
    updateRecipe();
  };

  window._v4UpdateCalcNotes = function(value) {
    state.calculatorNotes = value;
    updateRecipe();
  };

  window._v4ToggleCalculator = function(calcId, checked) {
    // Calculator state is tracked via calculatorNotes free text
  };

  window._v4GenerateOutput = function() {
    renderOutput();
  };

  window._v4SwitchOutputTab = function(tabId) {
    var text = document.getElementById('v4OutputText');
    if (!text) return;
    text.textContent = generateCombinedOutput(tabId);

    var tabs = document.querySelectorAll('.v4-output-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('onclick').indexOf(tabId) >= 0);
    }
  };

  window._v4CopyOutput = function() {
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
    if (text) text.textContent = '';
  };

  window._v4PrevStep = prevStep;
  window._v4NextStep = nextStep;

  // ---- Helpers ----
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

  function getAvailableCalculators() {
    try {
      var data = window.NAJM_CLINICAL_DATA;
      if (!data || !data.calculators) return [];
      var out = [];
      var calcs = data.calculators;
      var keys = Object.keys(calcs);
      for (var i = 0; i < keys.length; i++) {
        var calc = calcs[keys[i]];
        if (calc && calc.risk_level !== 'high') {
          out.push({ id: keys[i], name: calc.display_name || keys[i], category: calc.category || '' });
        }
      }
      return out;
    } catch(e) {
      return [];
    }
  }

  function formatCategory(cat) {
    return (cat || '').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ---- Init ----
  function init() {
    // Show the V4 page
    var app = document.getElementById('page-advanced-encounter');
    if (!app) return;

    // Load data
    var loadingEl = document.createElement('div');
    loadingEl.className = 'v4-loading';
    loadingEl.textContent = 'Loading V4 encounter data...';
    app.appendChild(loadingEl);

    loadV4Data().then(function() {
      app.removeChild(loadingEl);
      renderApp();
    }).catch(function(err) {
      loadingEl.textContent = 'Failed to load V4 data: ' + (err.message || 'unknown error');
    });
  }

  // Styles
  var style = document.createElement('style');
  style.textContent = getStyles();
  document.head.appendChild(style);

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---- Styles ----
  function getStyles() {
    return `
      #page-advanced-encounter.active { display: block; }
      .v4-loading { padding: 60px; text-align: center; font-size: 18px; color: var(--gray-500); }
      .v4-encounter-wrapper { display: grid; grid-template-columns: 1fr 280px; gap: 24px; max-width: 1200px; margin: 0 auto; padding: 24px; min-height: 500px; }
      .v4-encounter-main { min-width: 0; }
      .v4-stepper { display: flex; gap: 0; margin-bottom: 24px; background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-lg); overflow: hidden; }
      .v4-step-indicator { flex: 1; display: flex; align-items: center; gap: 6px; padding: 12px 10px; cursor: pointer; font-size: 11px; font-weight: 500; color: var(--gray-400); border-right: 1px solid var(--gray-200); transition: all .15s; }
      .v4-step-indicator:last-child { border-right: none; }
      .v4-step-indicator.active { background: var(--primary-bg); color: var(--primary); }
      .v4-step-indicator.done { color: var(--green); }
      .v4-step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; background: var(--gray-200); color: var(--gray-600); flex-shrink: 0; }
      .v4-step-indicator.active .v4-step-num { background: var(--primary); color: #fff; }
      .v4-step-indicator.done .v4-step-num { background: var(--green); color: #fff; }
      .v4-step-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .v4-step-content { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 28px 24px; min-height: 300px; }
      .v4-step-heading { font-size: 20px; font-weight: 700; color: var(--gray-900); margin-bottom: 6px; }
      .v4-step-desc { font-size: 13px; color: var(--gray-500); margin-bottom: 20px; line-height: 1.5; }
      .v4-safety-note { background: var(--red-bg); border: 1px solid var(--red-border); border-radius: 8px; padding: 10px 14px; font-size: 12px; color: var(--red); margin-bottom: 16px; line-height: 1.4; }
      .v4-safety-note-sm { background: var(--amber-bg); border: 1px solid var(--amber-border); border-radius: 6px; padding: 8px 12px; font-size: 11px; color: var(--gray-600); margin-bottom: 12px; line-height: 1.4; }
      .v4-empty-state { text-align: center; padding: 60px 20px; color: var(--gray-400); font-size: 15px; }
      .v4-workflow-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
      .v4-workflow-card { background: #fff; border: 2px solid var(--gray-200); border-radius: var(--radius-lg); padding: 20px 16px; cursor: pointer; text-align: center; transition: all .15s; position: relative; }
      .v4-workflow-card:hover { border-color: var(--primary-light); box-shadow: var(--shadow-md); }
      .v4-workflow-card.selected { border-color: var(--primary); background: var(--primary-bg); }
      .v4-wf-icon { font-size: 32px; margin-bottom: 8px; }
      .v4-wf-name { font-size: 13px; font-weight: 600; color: var(--gray-800); }
      .v4-wf-id { font-size: 10px; color: var(--gray-400); margin-top: 2px; }
      .v4-wf-check { position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
      .v4-history-textarea { width: 100%; min-height: 200px; padding: 14px; border: 1px solid var(--gray-300); border-radius: 8px; font-size: 13px; font-family: var(--font); line-height: 1.6; resize: vertical; }
      .v4-history-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
      .v4-placeholder-helper { margin-top: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .v4-helper-label { font-size: 11px; font-weight: 600; color: var(--gray-500); margin-right: 4px; }
      .v4-placeholder-chip { display: inline-block; padding: 3px 8px; border-radius: 4px; background: var(--amber-bg); border: 1px solid var(--amber-border); font-size: 11px; font-family: var(--font-mono); color: var(--amber); }
      .v4-exam-group { border: 1px solid var(--gray-200); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
      .v4-exam-group-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--gray-50); cursor: pointer; font-size: 13px; font-weight: 600; color: var(--gray-700); }
      .v4-exam-group-header:hover { background: var(--gray-100); }
      .v4-exam-group-toggle { font-size: 10px; width: 16px; text-align: center; }
      .v4-exam-group-count { margin-left: auto; font-size: 11px; font-weight: 500; color: var(--gray-400); }
      .v4-exam-prompts { padding: 8px 14px 14px; }
      .v4-exam-prompt { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; cursor: pointer; font-size: 12px; color: var(--gray-700); line-height: 1.5; }
      .v4-exam-prompt input[type="checkbox"] { margin-top: 2px; flex-shrink: 0; }
      .v4-prompt-text { flex: 1; }
      .v4-prompt-warning { font-size: 14px; cursor: help; flex-shrink: 0; }
      .v4-plan-section { margin-bottom: 20px; }
      .v4-field-label { display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px; }
      .v4-field-desc { font-size: 12px; color: var(--gray-500); margin-bottom: 10px; }
      .v4-input { width: 100%; padding: 10px 13px; border: 1px solid var(--gray-300); border-radius: 8px; font-size: 13px; font-family: var(--font); resize: vertical; }
      .v4-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
      .v4-impression-input { min-height: 100px; }
      .v4-plan-textarea, .v4-calc-textarea { min-height: 80px; }
      .v4-plan-option-group { margin-bottom: 12px; }
      .v4-plan-option-group-label { font-size: 12px; font-weight: 600; color: var(--gray-600); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em; }
      .v4-plan-option { display: flex; align-items: flex-start; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; color: var(--gray-700); }
      .v4-plan-option:hover { background: var(--gray-50); }
      .v4-plan-option input[type="checkbox"] { margin-top: 2px; flex-shrink: 0; }
      .v4-plan-option-text { flex: 1; line-height: 1.4; }
      .v4-plan-option-cat { font-size: 10px; color: var(--gray-400); background: var(--gray-100); padding: 1px 6px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
      .v4-calc-option { display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid var(--gray-200); border-radius: 6px; margin-bottom: 6px; cursor: pointer; font-size: 13px; }
      .v4-calc-option:hover { background: var(--gray-50); }
      .v4-calc-name { flex: 1; font-weight: 500; }
      .v4-calc-cat { font-size: 10px; color: var(--gray-400); background: var(--gray-100); padding: 1px 6px; border-radius: 4px; }
      .v4-empty-text { font-size: 13px; color: var(--gray-400); padding: 20px 0; }
      .v4-output-tabs { display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap; }
      .v4-output-tab { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid var(--gray-200); background: #fff; color: var(--gray-500); cursor: pointer; }
      .v4-output-tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
      .v4-output-box { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; padding: 16px; min-height: 200px; max-height: 500px; overflow-y: auto; margin-bottom: 12px; }
      .v4-output-text { font-size: 12px; font-family: var(--font-mono); white-space: pre-wrap; line-height: 1.5; color: var(--gray-700); }
      .v4-output-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      .v4-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding: 12px 0; }
      .v4-nav-right { display: flex; align-items: center; gap: 12px; }
      .v4-step-info { font-size: 12px; color: var(--gray-400); }
      .v4-btn { padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
      .v4-btn-primary { background: var(--primary); color: #fff; }
      .v4-btn-primary:hover { background: var(--primary-light); }
      .v4-btn-outline { background: #fff; color: var(--primary); border: 2px solid var(--primary); }
      .v4-btn-outline:hover { background: var(--primary-bg); }
      .v4-btn-ghost { background: transparent; color: var(--gray-600); border: 1px solid var(--gray-200); }
      .v4-btn-ghost:hover { background: var(--gray-50); }
      .v4-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .v4-recipe-sidebar { position: sticky; top: 100px; }
      .v4-recipe-title { font-size: 15px; font-weight: 700; color: var(--gray-800); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--gray-200); }
      .v4-recipe-empty { font-size: 13px; color: var(--gray-400); }
      .v4-recipe-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--gray-100); font-size: 12px; }
      .v4-recipe-label { color: var(--gray-500); }
      .v4-recipe-value { font-weight: 600; color: var(--gray-700); }
      @media (max-width: 768px) {
        .v4-encounter-wrapper { grid-template-columns: 1fr; }
        .v4-recipe-sidebar { display: none; }
        .v4-stepper { overflow-x: auto; }
        .v4-step-label { display: none; }
        .v4-workflow-grid { grid-template-columns: repeat(2, 1fr); }
      }
    `;
  }

})();
