(function() {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  if (params.get('v4') !== 'encounter2') return;

  // ================================================================
  //  GLOBAL V4 ENCOUNTER STATE (single source of truth)
  // ================================================================
  window.V4_ENCOUNTER_STATE = {
    // All available chips for the current workflow (group -> [text])
    chips: {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    },
    // Currently selected/toggled chips (group -> [text])
    selectedChips: {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    },
    // Custom entries added by user (group -> [text])
    customEntries: {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    },
    // History fields filled in Step 2
    history: {
      fields: {}  // keyed by placeholder key (e.g. "duration" -> "3 days")
    },
    // Exam confirmations synced from closure state
    exam: {
      confirmations: {}
    },
    // Investigation confirmations synced from closure state
    investigations: {
      confirmations: {}
    },
    // Assessment/impression synced from closure state
    assessment: {
      impression: ''
    },
    // Plan synced from closure state
    plan: {
      planText: '',
      confirmations: {}
    }
  };

  // ================================================================
  //  STATE (memory only, minimal)
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

    // History fields for Step 2 (key -> value, mirrors V4_ENCOUNTER_STATE.history.fields)
    historyFields: {},

    // Exam
    examConfirmations: {},

    // Investigations
    investigationConfirmations: {},

    // Plan
    impression: '',
    planText: '',
    planConfirmations: {}
  };

  var currentStep = 1;
  var TOTAL_STEPS = 6;

  var WORKFLOW_SPECIALTY = {
    'gp-fever-urti': 'General Medicine / GP',
    'gp-diabetes-followup': 'General Medicine / GP',
    'msk-low-back-pain': 'Orthopedics / MSK',
    'peds-fever': 'Pediatrics',
    'obgyn-antenatal-followup': 'OB/GYN'
  };

  // ================================================================
  //  V4 CHIP LOADING
  // ================================================================
  function v4LoadChipsIntoState(wfId) {
    var chips = {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    };
    var selectedChips = {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    };

    try {
      var data = window.NAJM_CLINICAL_DATA;
      if (!data || !data.chipsByWorkflow || !data.chipsByWorkflow[wfId]) {
        window.V4_ENCOUNTER_STATE.chips = chips;
        window.V4_ENCOUNTER_STATE.selectedChips = selectedChips;
        return;
      }

      var chipData = data.chipsByWorkflow[wfId];
      var groupKeys = ['symptoms', 'relevant_negatives', 'exam_findings', 'investigations', 'plan_phrases', 'follow_up'];

      // Load ALL chips for the workflow
      for (var group in chipData) {
        if (groupKeys.indexOf(group) < 0) continue;
        var items = chipData[group] || [];
        chips[group] = [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var text = item.chip_text || (typeof item === 'string' ? item : '');
          if (text) chips[group].push(text);
        }
      }

      // Apply Autofill: determine which chips are pre-selected by the speed preset
      try {
        var presets = null;
        // Check if v2 code already loaded presets by workflow_id
        if (window.CLINICNOTE_SPEED_PRESETS_BY_ID) {
          presets = window.CLINICNOTE_SPEED_PRESETS_BY_ID;
        }
        // Fallback: check NAJM_CLINICAL_DATA.speedPresets
        if (!presets && data && data.speedPresets) {
          presets = {};
          for (var k in data.speedPresets) {
            var entry = data.speedPresets[k];
            if (entry && entry.workflow_id) presets[entry.workflow_id] = entry;
          }
        }
        // Also check CLINICNOTE_SPEED_PRESETS
        if (!presets && window.CLINICNOTE_SPEED_PRESETS) {
          presets = {};
          var sp = window.CLINICNOTE_SPEED_PRESETS;
          for (var sk in sp) {
            var se = sp[sk];
            if (se && se.workflow_id) presets[se.workflow_id] = se;
          }
        }

        var preset = presets ? presets[wfId] : null;
        var autofillEnabled = typeof v2isSpeedPresetMode === 'function' ? v2isSpeedPresetMode() : true;

        if (preset && autofillEnabled) {
          var presetToOur = {
            'prechecked_symptoms': 'symptoms',
            'prechecked_relevant_negatives': 'relevant_negatives',
            'prechecked_exam_findings': 'exam_findings',
            'prechecked_investigations': 'investigations',
            'prechecked_plan_phrases': 'plan_phrases',
            'prechecked_follow_up': 'follow_up'
          };
          for (var pf in presetToOur) {
            var g = presetToOur[pf];
            if (!preset[pf]) continue;
            var presetTexts = {};
            for (var pi = 0; pi < preset[pf].length; pi++) {
              presetTexts[preset[pf][pi].toLowerCase().trim()] = true;
            }
            selectedChips[g] = chips[g].filter(function(ct) {
              return presetTexts[ct.toLowerCase().trim()];
            });
          }
        }
      } catch(e) { /* preset autofill not available */ }
    } catch(e) { /* silent fail */ }

    window.V4_ENCOUNTER_STATE.chips = chips;
    window.V4_ENCOUNTER_STATE.selectedChips = selectedChips;
    // Reset custom entries on workflow change
    window.V4_ENCOUNTER_STATE.customEntries = {
      symptoms: [],
      relevant_negatives: [],
      exam_findings: [],
      investigations: [],
      plan_phrases: [],
      follow_up: []
    };
  }

  // ================================================================
  //  HISTORY UTILITY
  // ================================================================
  function buildV4HistoryFromFields(fields) {
    if (!fields) return '';
    var parts = [];
    for (var key in fields) {
      var val = fields[key];
      if (val && val.trim()) {
        // Label from key: replace underscores with spaces, capitalize
        var label = key.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        parts.push(label + ': ' + val.trim());
      }
    }
    return parts.join('. ') + (parts.length ? '.' : '');
  }

  // ================================================================
  //  SYNC V4_ENCOUNTER_STATE FROM CLOSURE STATE
  // ================================================================
  function syncV4ToGlobal() {
    window.V4_ENCOUNTER_STATE.exam.confirmations = {};
    for (var ek in state.examConfirmations) {
      window.V4_ENCOUNTER_STATE.exam.confirmations[ek] = state.examConfirmations[ek];
    }

    window.V4_ENCOUNTER_STATE.investigations.confirmations = {};
    for (var ik in state.investigationConfirmations) {
      window.V4_ENCOUNTER_STATE.investigations.confirmations[ik] = state.investigationConfirmations[ik];
    }

    window.V4_ENCOUNTER_STATE.assessment.impression = state.impression || '';

    window.V4_ENCOUNTER_STATE.plan.planText = state.planText || '';
    window.V4_ENCOUNTER_STATE.plan.confirmations = {};
    for (var pk in state.planConfirmations) {
      window.V4_ENCOUNTER_STATE.plan.confirmations[pk] = state.planConfirmations[pk];
    }

    window.V4_ENCOUNTER_STATE.history.fields = {};
    for (var hk in state.historyFields) {
      window.V4_ENCOUNTER_STATE.history.fields[hk] = state.historyFields[hk];
    }
  }

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
    ['v4Impression','v4PlanText'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el && checkPHI(el.value)) found = true;
    });
    // Also check history field inputs
    var histInputs = document.querySelectorAll('.v4-hist-input');
    for (var hi = 0; hi < histInputs.length; hi++) {
      if (checkPHI(histInputs[hi].value)) found = true;
    }
    var phi = document.getElementById('v4PhiWarning');
    if (phi) phi.style.display = found ? 'block' : 'none';
  }

  // ================================================================
  //  REMOVE PLACEHOLDER SENTENCES (kept for backward compat in routing)
  // ================================================================
  function removePlaceholderSentences(text) {
    if (!text) return '';
    var lines = text.split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.match(/\[[^\]]+\]/)) continue;
      if (line) result.push(line);
    }
    text = result.join('\n');
    text = text.replace(/\[[^\]]+\]/g, '');
    text = text.replace(/\s{2,}/g, ' ').trim();
    text = text.replace(/[\.\,\;]+$/, '').trim();
    return text;
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
  //  STEP 1: WORKFLOW + CHIP GROUPS (V4-owned, no Speed Mode DOM)
  // ================================================================
  function stepWorkflow() {
    var h = '<h2 class="v4-step-h">Step 1: Select Workflow</h2>';
    h += '<p class="v4-step-d">Select a prototype workflow. V4 chip groups will load automatically for the output.</p>';
    h += '<div class="v4-proto-note">Advanced Encounter Builder currently supports 5 prototype workflows. More workflows will be added after internal review.</div>';

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

      // Chip groups from V4_ENCOUNTER_STATE
      var stateChips = window.V4_ENCOUNTER_STATE.chips || {};
      var stateSelected = window.V4_ENCOUNTER_STATE.selectedChips || {};
      var groupKeys = ['symptoms', 'relevant_negatives', 'exam_findings', 'investigations', 'plan_phrases', 'follow_up'];
      var groupLabels = {
        symptoms: 'Symptoms / Presenting Complaint',
        relevant_negatives: 'Relevant Negatives / Red Flags',
        exam_findings: 'Exam Findings',
        investigations: 'Investigations / Results',
        plan_phrases: 'Plan / Management Phrases',
        follow_up: 'Follow-up / Safety Netting'
      };
      var totalChips = 0;
      var totalSelected = 0;
      for (var gi = 0; gi < groupKeys.length; gi++) {
        totalChips += (stateChips[groupKeys[gi]] || []).length;
        totalSelected += (stateSelected[groupKeys[gi]] || []).length;
      }

      h += '<h3 class="v4-sub-h" style="margin-top:18px">Chip Groups</h3>';
      h += '<p class="v4-step-d">Select the relevant chips for each group. Selection is tracked in the global state and included in the output.</p>';

      if (totalChips === 0) {
        h += '<div class="v4-chip-badge-empty" style="display:inline-block;padding:8px 14px;border-radius:8px;background:var(--gray-50);color:var(--gray-400);border:1px solid var(--gray-200);font-size:12px">No chips available for this workflow. Chips will still be captured from data when available.</div>';
      }

      for (var gi2 = 0; gi2 < groupKeys.length; gi2++) {
        var gk = groupKeys[gi2];
        var chips = stateChips[gk] || [];
        var selected = stateSelected[gk] || [];
        var selSet = {};
        for (var si = 0; si < selected.length; si++) {
          selSet[selected[si].toLowerCase().trim()] = true;
        }

        if (chips.length === 0) continue;

        h += '<div class="v4-chip-group" data-group="' + esc(gk) + '">';
        h += '<div class="v4-chip-group-header" onclick="window._v4ToggleV4GroupCollapse(this)">';
        h += '<span class="v4-cg-toggle">&#9660;</span>';
        h += '<span class="v4-cg-label">' + esc(groupLabels[gk] || gk) + '</span>';
        h += '<span class="v4-cg-count" id="v4cgc_' + esc(gk) + '">' + selected.length + '/' + chips.length + '</span>';
        h += '</div>';
        h += '<div class="v4-chip-group-body">';
        h += '<div class="v4-chip-list">';

        for (var ci = 0; ci < chips.length; ci++) {
          var isSelected = selSet[chips[ci].toLowerCase().trim()] || false;
          h += '<button class="v4-chip-btn' + (isSelected ? ' active' : '') + '" onclick="window._v4ToggleV4Chip(\'' + esc(gk) + '\', \'' + esc(chips[ci].replace(/'/g, "\\'")) + '\')">' + esc(chips[ci]) + '</button>';
        }

        h += '</div>'; // chip-list
        h += '<div class="v4-custom-entry-row">';
        h += '<input class="v4-custom-entry-input" type="text" id="v4ce_' + esc(gk) + '" placeholder="Add custom ' + esc(groupLabels[gk].toLowerCase()) + '..." onkeydown="if(event.key===\'Enter\'){window._v4AddCustomEntry(\'' + esc(gk) + '\');event.preventDefault()}">';
        h += '<button class="v4-btn v4-btn-ghost v4-btn-sm" onclick="window._v4AddCustomEntry(\'' + esc(gk) + '\')">Add</button>';
        h += '</div>';
        h += '</div>'; // chip-group-body
        h += '</div>'; // chip-group
      }
    }

    return h;
  }

  // ================================================================
  //  STEP 2: HISTORY (fill-in-the-blank, no textarea, no brackets)
  // ================================================================
  function stepHistory() {
    if (!state.selectedWorkflowId) return emptyStep('Select a workflow first (Step 1).');
    var draft = getHistoryDraft(state.selectedWorkflowId);
    if (!draft) return emptyStep('History draft not available.');

    var h = '<h2 class="v4-step-h">Step 2: History</h2>';
    h += '<p class="v4-step-d">Fill in the fields below. Only filled fields are included in the output. Leave fields blank to omit them.</p>';
    if (draft.safety_note) h += '<div class="v4-safety-box">' + esc(draft.safety_note) + '</div>';

    // Render editable_placeholders as labeled inputs
    var placeholders = draft.editable_placeholders || [];
    if (placeholders.length > 0) {
      h += '<div class="v4-hist-fields">';
      h += '<label class="v4-field-label">History details</label>';
      h += '<div class="v4-hist-grid">';

      for (var i = 0; i < placeholders.length; i++) {
        var ph = placeholders[i];
        // Create clean key and label from placeholder text like "[duration]"
        var key = ph.replace(/[\[\]]/g, '').toLowerCase().replace(/[\s\/]+/g, '_');
        var label = ph.replace(/[\[\]]/g, '');
        var currentVal = state.historyFields[key] || window.V4_ENCOUNTER_STATE.history.fields[key] || '';

        h += '<div class="v4-hist-item">';
        h += '<label class="v4-hist-label">' + esc(label) + '</label>';
        h += '<input class="v4-hist-input" type="text" id="v4hf_' + esc(key) + '" value="' + esc(currentVal) + '" placeholder="' + esc(label) + '..." oninput="window._v4HistoryField(\'' + esc(key) + '\', this.value)">';
        h += '</div>';
      }

      h += '</div>'; // hist-grid
      h += '</div>'; // hist-fields
    } else {
      h += '<p class="v4-field-note">No editable fields defined for this workflow.</p>';
    }

    // Show the generated history preview
    h += '<div class="v4-hist-preview-wrap">';
    h += '<label class="v4-field-label" style="margin-top:16px">Generated history (auto-updates)</label>';
    h += '<div class="v4-hist-preview" id="v4HistPreview">';
    var previewText = buildV4HistoryFromFields(state.historyFields);
    h += previewText || '<span class="v4-field-note">Fill in fields above to see the generated history.</span>';
    h += '</div></div>';

    // Collapsed optional sections reference
    if (draft.optional_full_history_sections && draft.optional_full_history_sections.length) {
      h += '<details class="v4-collapse">';
      h += '<summary class="v4-collapse-summary">Optional history sections (' + draft.optional_full_history_sections.length + ' available, collapsed)</summary>';
      h += '<div class="v4-collapse-body" style="display:flex;flex-wrap:wrap;gap:5px">';
      for (var si = 0; si < draft.optional_full_history_sections.length; si++) {
        h += '<span class="v4-section-chip">' + esc(draft.optional_full_history_sections[si]) + '</span>';
      }
      h += '</div></details>';
    }

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
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4Impression" oninput="window._v4UpdateImp(this.value)" placeholder="Enter your impression or assessment. Free text only.">' + esc(state.impression) + '</textarea>';
    if (!state.impression) h += '<p class="v4-field-note" style="color:#b45309">Doctor-entered impression is empty. Assessment section will show [not documented].</p>';
    h += '</div>';

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
          h += '<span class="v4-po-cat">' + esc(opt.option_category || 'general') + '</span></label>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    // Doctor plan text
    h += '<div class="v4-plan-row"><label class="v4-field-label">Doctor Plan (free text)</label>';
    h += '<textarea class="v4-textarea v4-textarea-med" id="v4PlanText" oninput="window._v4UpdatePlan(this.value)" placeholder="Medication names/doses should be entered by the clinician if needed.">' + esc(state.planText) + '</textarea>';
    if (!state.planText && countPlan() === 0) h += '<p class="v4-field-note" style="color:#b45309">No plan entered. Plan section will show [not documented] unless Plan Assist items are selected.</p>';
    h += '</div>';

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
  //  CONTENT ROUTER AND RENDERERS
  // ================================================================
  var _currentTab = 'adv-emr';
  var _outputGenerated = false;

  // --- Internal helpers ---
  function _v4norm(t) { return String(t).toLowerCase().replace(/\.+$/, '').trim(); }
  function _v4section(label, content) {
    if (!content || content === '[not documented]' || content === '') return '';
    return label + ':\n' + content + '\n\n';
  }
  function _v4collectPlanOpts() {
    var opts = [];
    var plan = getPlanOptions(state.selectedWorkflowId);
    if (plan && plan.plan_option_groups) {
      for (var pgi = 0; pgi < plan.plan_option_groups.length; pgi++) {
        var pg = plan.plan_option_groups[pgi];
        for (var poi = 0; poi < pg.options.length; poi++) {
          if (state.planConfirmations[pg.options[poi].option_id]) opts.push(pg.options[poi]);
        }
      }
    }
    return opts;
  }
  function _v4collectExamItems() {
    var items = [];
    var exam = getExamDetails(state.selectedWorkflowId);
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        var groupItems = [];
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var key = group.group_id + '::' + group.prompts[pi].prompt_id;
          if (state.examConfirmations[key]) groupItems.push(group.prompts[pi].prompt_text);
        }
        if (groupItems.length) items.push(group.group_label + ': ' + groupItems.join('; '));
      }
    }
    return items;
  }
  function _v4collectInvItems() {
    var items = [];
    var inv = getInvestigationOptions(state.selectedWorkflowId);
    if (inv && inv.investigation_groups) {
      for (var ivi = 0; ivi < inv.investigation_groups.length; ivi++) {
        var ig = inv.investigation_groups[ivi];
        for (var oi = 0; oi < ig.options.length; oi++) {
          var ikey = ig.group_id + '::' + ig.options[oi].option_id;
          if (state.investigationConfirmations[ikey]) items.push(ig.options[oi].option_text);
        }
      }
    }
    return items;
  }
  function _v4cleanText(text) {
    if (!text) return '';
    return text
      .replace(/discussed as per clinician plan/gi, '')
      .replace(/as per clinician plan/gi, '')
      .replace(/clinician impression documented/gi, '')
      .replace(/per clinician plan/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Clean final output phrases: strip prompt/template wording
  function cleanV4OutputPhrase(text) {
    if (!text) return '';
    text = String(text).trim();
    // Remove "Status: " prefix
    text = text.replace(/^Status:\s*/i, '');
    // Strip "documented if X" suffixes
    text = text.replace(/\s*documented\s+if\s+assessed\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+measured\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+discussed\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+clinician\s+decided\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+arranged\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+relevant(\s+and\s+assessed)?\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+only\s+if\s+clinician\s+(decided|did so|arranged)\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+(the\s+)?clinician\s+(decided|did so|arranged)\.?\s*$/i, '');
    // Strip "reviewed if X" suffixes
    text = text.replace(/\s*reviewed\s+if\s+(available|ordered|relevant|performed)\.?\s*$/i, '');
    text = text.replace(/\s*reviewed\s+or\s+discussed\s+(documented\s+if\s+clinician\s+did\s+so)?\.?\s*$/i, '');
    // Clean up trailing punctuation remnants
    text = text.replace(/[,;]+\s*$/, '').trim();
    // If the entire text was consumed by cleaning, return empty
    if (!text || text === '.') return '';
    // Omit bare organ/system names that have no actual finding
    var bareOrgans = /^(temperature|heart rate|pulse|respiratory rate|oxygen saturation|blood pressure|weight(\s+and\s+bmi)?|general appearance|gait|parent or guardian report context|urine dipstick|ultrasound report|previous imaging|x-ray|mri report|cultures|inflammatory markers|lumbar range of motion|spinal tenderness|straight leg raise|crossed straight leg raise|lower limb (power|sensation|reflexes)|saddle sensation|neurovascular status|foot inspection|peripheral pulses|monofilament sensation|injection sites|capillary refill|urine output context|throat examination|otoscopy|cervical lymphadenopathy|respiratory effort|abdominal examination|skin rash|non-blanching rash|tonsillar appearance|chest wall examination|meningeal signs|fundal height|fetal heart auscultation|fetal movement|lower limb oedema|urine dipstick)$/i;
    if (bareOrgans.test(text)) return '';
    return text;
  }

  // Apply cleaner to an array of lines
  function cleanV4OutputLines(lines) {
    if (!lines || !lines.length) return [];
    var out = [];
    var seen = {};
    for (var i = 0; i < lines.length; i++) {
      var cleaned = cleanV4OutputPhrase(lines[i]);
      if (!cleaned) continue;
      var n = cleaned.toLowerCase().trim();
      if (seen[n]) continue;
      seen[n] = true;
      out.push(cleaned);
    }
    return out;
  }

  // Step 1: Collect fresh state from V4_ENCOUNTER_STATE
  function collectV4State() {
    var ges = window.V4_ENCOUNTER_STATE;
    var raw = {};

    // Workflow
    raw.workflowId = state.selectedWorkflowId;
    raw.workflowName = state.selectedWorkflowDisplay;
    raw.specialty = state.selectedWorkflowSpecialty;

    // Chips from V4_ENCOUNTER_STATE
    raw.chips = {
      symptoms: (ges.selectedChips.symptoms || []).slice(),
      relevant_negatives: (ges.selectedChips.relevant_negatives || []).slice(),
      exam_findings: (ges.selectedChips.exam_findings || []).slice(),
      investigations: (ges.selectedChips.investigations || []).slice(),
      plan_phrases: (ges.selectedChips.plan_phrases || []).slice(),
      follow_up: (ges.selectedChips.follow_up || []).slice()
    };

    // Custom entries from V4_ENCOUNTER_STATE
    raw.customEntries = {
      symptoms: (ges.customEntries.symptoms || []).slice(),
      relevant_negatives: (ges.customEntries.relevant_negatives || []).slice(),
      exam_findings: (ges.customEntries.exam_findings || []).slice(),
      investigations: (ges.customEntries.investigations || []).slice(),
      plan_phrases: (ges.customEntries.plan_phrases || []).slice(),
      follow_up: (ges.customEntries.follow_up || []).slice()
    };

    // History fields from V4_ENCOUNTER_STATE
    raw.historyFields = ges.history.fields || {};
    raw.historyDraft = buildV4HistoryFromFields(raw.historyFields);

    // Exam from closure state (already synced to V4_ENCOUNTER_STATE)
    raw.examConfirmations = state.examConfirmations || {};

    // Investigations
    raw.investigationConfirmations = state.investigationConfirmations || {};

    // Plan
    raw.impression = state.impression || '';
    raw.planText = state.planText || '';
    raw.planConfirmations = state.planConfirmations || {};

    return raw;
  }

  // Step 2: Normalize
  function normalizeV4State(raw) {
    return raw;
  }

  // Step 3: Route content to output sections
  function routeV4Content(normalized) {
    var chips = normalized.chips || {};
    var custom = normalized.customEntries || {};
    var historyDraft = _v4cleanText(normalized.historyDraft || '');
    var planFree = _v4cleanText(normalized.planText || '');
    var impression = normalized.impression || '';
    var planOpts = _v4collectPlanOpts();
    var examItems = _v4collectExamItems();
    var invItems = _v4collectInvItems();

    function dedupe(items, againstText) {
      var out = [], seen = {};
      for (var i = 0; i < items.length; i++) {
        var n = _v4norm(items[i]);
        if (!n || seen[n]) continue; seen[n] = true;
        if (againstText && historyDraft && historyDraft.toLowerCase().indexOf(n) >= 0) continue;
        out.push(items[i]);
      }
      return out;
    }

    var route = {
      historyLines: [],
      relevantNegativeLines: [],
      examinationLines: [],
      investigationLines: [],
      assessmentLines: [],
      planLines: [],
      followUpLines: [],
      patientInstructionLines: []
    };

    // History / Subjective
    if (historyDraft) route.historyLines.push(historyDraft);
    var symps = dedupe((chips.symptoms||[]).concat(custom.symptoms||[]), true);
    if (symps.length) route.historyLines.push('Symptoms: ' + symps.join('; '));
    var negs = dedupe((chips.relevant_negatives||[]).concat(custom.relevant_negatives||[]), true);
    if (negs.length) route.relevantNegativeLines.push('Relevant negatives: ' + negs.join('; '));

    // Objective
    var examChips = dedupe((chips.exam_findings||[]).concat(custom.exam_findings||[]), true);
    var allExam = examChips.concat(examItems);
    if (allExam.length) route.examinationLines = allExam;

    var invChips = dedupe((chips.investigations||[]).concat(custom.investigations||[]), false);
    var invSeen = {};
    for (var ii = 0; ii < invItems.length; ii++) invSeen[_v4norm(invItems[ii])] = true;
    var dedupedInvChips = invChips.filter(function(c) { return !invSeen[_v4norm(c)]; });
    var allInv = invItems.concat(dedupedInvChips);
    if (allInv.length) route.investigationLines = allInv;

    // Assessment
    if (impression) route.assessmentLines.push(impression);

    // Plan
    var planChips = dedupe((chips.plan_phrases||[]).concat(custom.plan_phrases||[]), false);
    var planDoc = planFree;

    var planAssistLines = [];
    var fupOptLines = [];
    var instOptLines = [];
    var seenPlanAssist = {};
    for (var poi = 0; poi < planOpts.length; poi++) {
      var opt = planOpts[poi];
      var n = _v4norm(opt.option_text);
      if (!n || seenPlanAssist[n]) continue; seenPlanAssist[n] = true;
      var cat = (opt.option_category || '').toLowerCase();
      if (cat === 'follow_up' || cat === 'safety_netting') {
        fupOptLines.push(opt.option_text);
      } else if (cat.indexOf('patient_instruction') >= 0 || cat.indexOf('lifestyle') >= 0 || cat.indexOf('counseling') >= 0) {
        instOptLines.push(opt.option_text);
      } else {
        planAssistLines.push(opt.option_text);
      }
    }

    if (planChips.length) route.planLines = route.planLines.concat(planChips);
    if (planAssistLines.length) route.planLines = route.planLines.concat(planAssistLines);
    if (planDoc) route.planLines.push(planDoc);

    var fupChips = dedupe((chips.follow_up||[]).concat(custom.follow_up||[]), false);
    route.followUpLines = fupChips.concat(fupOptLines);

    route.patientInstructionLines = instOptLines;
    if (planDoc) route.patientInstructionLines.push(planDoc);

    (function dedupFinal(arr) {
      var seen = {};
      for (var i = arr.length - 1; i >= 0; i--) {
        var n = _v4norm(arr[i]);
        if (!n || seen[n]) { arr.splice(i, 1); continue; }
        seen[n] = true;
      }
    })(route.planLines);
    (function dedupFinal(arr) {
      var seen = {};
      for (var i = arr.length - 1; i >= 0; i--) {
        var n = _v4norm(arr[i]);
        if (!n || seen[n]) { arr.splice(i, 1); continue; }
        seen[n] = true;
      }
    })(route.followUpLines);
    (function dedupFinal(arr) {
      var seen = {};
      for (var i = arr.length - 1; i >= 0; i--) {
        var n = _v4norm(arr[i]);
        if (!n || seen[n]) { arr.splice(i, 1); continue; }
        seen[n] = true;
      }
    })(route.patientInstructionLines);

    // Clean output phrasing: strip prompt/template wording from all sections
    route.historyLines = cleanV4OutputLines(route.historyLines);
    route.relevantNegativeLines = cleanV4OutputLines(route.relevantNegativeLines);
    route.examinationLines = cleanV4OutputLines(route.examinationLines);
    route.investigationLines = cleanV4OutputLines(route.investigationLines);
    route.assessmentLines = cleanV4OutputLines(route.assessmentLines);
    route.planLines = cleanV4OutputLines(route.planLines);
    route.followUpLines = cleanV4OutputLines(route.followUpLines);
    route.patientInstructionLines = cleanV4OutputLines(route.patientInstructionLines);

    return route;
  }

  // Step 4: Render EMR
  function renderV4EMR(route) {
    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';
    var h = 'SHORT EMR NOTE\n' + '='.repeat(40) + '\n\n';
    h += _v4section('History', (route.historyLines||[]).join('\n'));
    h += _v4section('Relevant negatives', (route.relevantNegativeLines||[]).join('\n'));
    h += _v4section('Examination', (route.examinationLines||[]).join('\n'));
    h += _v4section('Investigations / Results Reviewed', (route.investigationLines||[]).join('\n'));
    h += _v4section('Assessment', (route.assessmentLines||[]).join('\n'));
    h += _v4section('Plan', (route.planLines||[]).join('\n'));
    h += _v4section('Follow-up', (route.followUpLines||[]).join('\n'));
    return h + footer;
  }

  // Step 4: Render SOAP
  function renderV4SOAP(route) {
    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';
    var subj = [];
    if ((route.historyLines||[]).length) subj.push((route.historyLines||[]).join('\n'));
    if ((route.relevantNegativeLines||[]).length) subj.push((route.relevantNegativeLines||[]).join('\n'));
    var obj = [];
    // Render exam/investigation as natural line-per-finding
    if ((route.examinationLines||[]).length) obj = obj.concat(route.examinationLines);
    if ((route.investigationLines||[]).length) obj = obj.concat(route.investigationLines);
    var ass = (route.assessmentLines||[]).join('\n') || '[not documented]';
    var planParts = [];
    if ((route.planLines||[]).length) planParts = planParts.concat(route.planLines);
    if ((route.followUpLines||[]).length) planParts = planParts.concat(route.followUpLines);
    var plan = planParts.length ? planParts.join('\n') : '[not documented]';

    var s = 'SOAP NOTE\n' + '='.repeat(40) + '\n\n';
    s += 'SUBJECTIVE:\n' + (subj.length ? subj.join('\n\n') : '[not documented]') + '\n\n';
    s += 'OBJECTIVE:\n' + (obj.length ? obj.join('\n') : '[not documented]') + '\n\n';
    s += 'ASSESSMENT:\n' + ass + '\n\n';
    s += 'PLAN:\n' + plan + '\n';
    return s + footer;
  }

  // Step 4: Render Referral
  function renderV4Referral(route) {
    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';
    var planText = (route.planLines||[]).join('\n');
    var hasReferralText = planText && planText.toLowerCase().indexOf('refer') >= 0;
    var hasReferralAssess = (route.assessmentLines||[]).join(' ').toLowerCase().indexOf('refer') >= 0;
    if (!hasReferralText && !hasReferralAssess) {
      return 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\nReferral draft: [not requested/documented]\n' + footer;
    }
    var r = 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\n';
    r += _v4section('Reason for referral', (route.historyLines||[]).join('\n'));
    r += _v4section('Clinical history', (route.historyLines||[]).join('\n'));
    r += _v4section('Examination findings', (route.examinationLines||[]).join('\n'));
    r += _v4section('Investigations', (route.investigationLines||[]).join('\n'));
    r += _v4section('Current impression', (route.assessmentLines||[]).join('\n'));
    r += _v4section('Plan / recommendations', planText);
    r += _v4section('Follow-up', (route.followUpLines||[]).join('\n'));
    r += 'Please see and advise.\n';
    return r + footer;
  }

  // Step 4: Render Instructions
  function renderV4Instructions(route) {
    var footer = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';
    var lines = route.patientInstructionLines || [];
    if (!lines.length) {
      return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n[not documented]\n' + footer;
    }
    return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n' +
      'Advice / plan discussed:\n' + lines.join('\n') + '\n\n' +
      'Review with your clinician. Seek medical attention if symptoms worsen.\n' + footer;
  }

  // ================================================================
  //  BUILD ADVANCED DRAFT (reads from V4_ENCOUNTER_STATE via collectV4State)
  // ================================================================
  function buildAdvancedDraft(tabId) {
    var raw = collectV4State();
    var norm = normalizeV4State(raw);
    var route = routeV4Content(norm);
    switch (tabId) {
      case 'adv-emr': return renderV4EMR(route);
      case 'adv-soap': return renderV4SOAP(route);
      case 'adv-ref': return renderV4Referral(route);
      case 'adv-inst': return renderV4Instructions(route);
      default: return 'Select an output format.';
    }
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

      // History fields filled count
      var histVals = window.V4_ENCOUNTER_STATE.history.fields || state.historyFields || {};
      var filled = 0;
      for (var hk in histVals) { if (histVals[hk] && histVals[hk].trim()) filled++; }
      h += '<div class="v4-si"><span class="v4-si-label">History fields:</span><span class="v4-si-val">' + filled + ' filled</span></div>';

      // Chips from V4_ENCOUNTER_STATE
      var selChips = window.V4_ENCOUNTER_STATE.selectedChips || {};
      var chipCount = 0;
      for (var g in selChips) {
        if (selChips[g]) chipCount += selChips[g].length;
      }
      if (chipCount > 0) h += '<div class="v4-si"><span class="v4-si-label">Selected chips:</span><span class="v4-si-val">' + chipCount + '</span></div>';

      // Custom entries
      var customEnts = window.V4_ENCOUNTER_STATE.customEntries || {};
      var customCount = 0;
      for (var cg in customEnts) {
        if (customEnts[cg]) customCount += customEnts[cg].length;
      }
      if (customCount > 0) h += '<div class="v4-si"><span class="v4-si-label">Custom entries:</span><span class="v4-si-val">' + customCount + '</span></div>';

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

    // Debug panel
    if (window.location.search.indexOf('debug=v4') >= 0 && state.selectedWorkflowId) {
      var debugEl = document.getElementById('v4DebugPanel');
      if (!debugEl) {
        debugEl = document.createElement('div');
        debugEl.id = 'v4DebugPanel';
        debugEl.style.cssText = 'margin-top:16px;padding:12px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;font-size:11px;font-family:monospace;line-height:1.6;color:#334155;max-height:400px;overflow:auto';
        var sidebar = document.querySelector('.v4-sidebar-inner');
        if (sidebar) sidebar.appendChild(debugEl);
      }
      var raw = collectV4State();
      var route = routeV4Content(normalizeV4State(raw));
      var dbg = '<div style="font-weight:700;margin-bottom:8px;color:#0c4a6e;font-size:12px">[DEBUG] V4 Pipeline</div>';
      dbg += '<div>Workflow: ' + esc(raw.workflowId) + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Selected chips:</div>';
      for (var dg in raw.chips) {
        dbg += '<div>' + dg + ': ' + (raw.chips[dg]||[]).length + ' items</div>';
      }
      dbg += '<div style="margin-top:6px;font-weight:600">History fields:</div>';
      var histCount = 0;
      for (var fk in raw.historyFields) { if (raw.historyFields[fk]) histCount++; }
      dbg += '<div>filled: ' + histCount + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Routed content:</div>';
      dbg += '<div>historyLines: ' + (route.historyLines||[]).length + '</div>';
      dbg += '<div>relevantNegativeLines: ' + (route.relevantNegativeLines||[]).length + '</div>';
      dbg += '<div>examinationLines: ' + (route.examinationLines||[]).length + '</div>';
      dbg += '<div>investigationLines: ' + (route.investigationLines||[]).length + '</div>';
      dbg += '<div>assessmentLines: ' + (route.assessmentLines||[]).length + '</div>';
      dbg += '<div>planLines: ' + (route.planLines||[]).length + '</div>';
      dbg += '<div>followUpLines: ' + (route.followUpLines||[]).length + '</div>';
      debugEl.innerHTML = dbg;
    }
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

    // Reset all state
    state.examConfirmations = {};
    state.investigationConfirmations = {};
    state.planConfirmations = {};
    state.impression = '';
    state.planText = '';
    state.historyFields = {};

    // Load chips into V4_ENCOUNTER_STATE
    v4LoadChipsIntoState(wfId);

    // Clear history fields in global state
    window.V4_ENCOUNTER_STATE.history.fields = {};

    // Sync everything to global
    syncV4ToGlobal();

    renderStep(1);
    updateSidebar();
  };

  // Chip toggle
  window._v4ToggleV4Chip = function(group, chipText) {
    var selected = window.V4_ENCOUNTER_STATE.selectedChips[group] || [];
    var norm = chipText.toLowerCase().trim();
    var idx = -1;
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].toLowerCase().trim() === norm) { idx = i; break; }
    }
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(chipText);
    }

    // Update the Step 1 badge and button visual
    var countEl = document.getElementById('v4cgc_' + group);
    if (countEl) {
      var chips = window.V4_ENCOUNTER_STATE.chips[group] || [];
      countEl.textContent = selected.length + '/' + chips.length;
    }

    // Toggle button active state
    var buttons = document.querySelectorAll('.v4-chip-btn');
    for (var bi = 0; bi < buttons.length; bi++) {
      if (buttons[bi].textContent.trim() === chipText.trim()) {
        buttons[bi].classList.toggle('active', idx < 0);
      }
    }

    updateSidebar();
  };

  // Custom entry
  window._v4AddCustomEntry = function(group) {
    var input = document.getElementById('v4ce_' + group);
    if (!input || !input.value.trim()) return;
    var val = input.value.trim();

    var custom = window.V4_ENCOUNTER_STATE.customEntries[group] || [];
    // Avoid duplicates
    var norm = val.toLowerCase().trim();
    var dup = false;
    for (var i = 0; i < custom.length; i++) {
      if (custom[i].toLowerCase().trim() === norm) { dup = true; break; }
    }
    if (!dup) {
      custom.push(val);
    }
    input.value = '';
    updateSidebar();
  };

  // History field
  window._v4HistoryField = function(key, value) {
    state.historyFields[key] = value;
    window.V4_ENCOUNTER_STATE.history.fields[key] = value;

    // Update preview
    var preview = document.getElementById('v4HistPreview');
    if (preview) {
      var text = buildV4HistoryFromFields(state.historyFields);
      preview.textContent = text || 'Fill in fields above to see the generated history.';
    }

    checkAllPhi();
    updateSidebar();
  };

  // Collapse/expand chip group
  window._v4ToggleV4GroupCollapse = function(headerEl) {
    var body = headerEl.nextElementSibling;
    var toggle = headerEl.querySelector('.v4-cg-toggle');
    if (!body) return;
    var show = body.style.display !== 'none';
    body.style.display = show ? 'none' : '';
    if (toggle) toggle.innerHTML = show ? '&#9654;' : '&#9660;';
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
    // Sync closure state to V4_ENCOUNTER_STATE before generating
    syncV4ToGlobal();

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

    // Show V4 page alongside Speed page (for complementary tools)
    var allPages = document.querySelectorAll('.page');
    for (var pi = 0; pi < allPages.length; pi++) {
      var pgId = allPages[pi].id;
      if (pgId === 'page-advanced-encounter' || pgId === 'page-speed') {
        allPages[pi].classList.add('active');
      } else {
        allPages[pi].classList.remove('active');
      }
    }

    // Hide all Speed Mode UI when V4 is active (V4 has its own workflow selector and chip groups)
    var speedElements = [
      'v2SearchArea',
      'speedOutputBox',
      'speedGeneratedFeedbackCta',
      'speedContent',
      'speedEmptyState'
    ];
    for (var si = 0; si < speedElements.length; si++) {
      var el = document.getElementById(speedElements[si]);
      if (el) el.classList.add('v4-speed-output-hidden');
    }
    // Also hide selector rows
    var selectors = document.querySelectorAll('#page-speed .output-header, #page-speed .output-actions, #page-speed .output-footer, #page-speed .export-privacy-note, #speedContent .gen-row, .why-faster');
    for (var qi = 0; qi < selectors.length; qi++) {
      selectors[qi].classList.add('v4-speed-output-hidden');
    }
    // Hide Speed Mode specialty/visit type dropdowns, chip sections, duration, impression area
    var speedFormEls = document.querySelectorAll('#page-speed .form-group, #page-speed .speed-section, #page-speed .speed-summary, #page-speed .speed-mode-box .note-phi-warn');
    for (var fi = 0; fi < speedFormEls.length; fi++) {
      speedFormEls[fi].classList.add('v4-speed-output-hidden');
    }

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

  // ================================================================
  //  STYLES
  // ================================================================
  var style = document.createElement('style');
  style.textContent = V4_STYLES();
  document.head.appendChild(style);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

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
.v4-proto-note{font-size:11px;color:#075985;background:#e0f2fe;border:1px solid #bae6fd;border-radius:6px;padding:8px 12px;margin-bottom:14px;line-height:1.4}
.v4-select{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:14px;font-family:var(--font);background:#fff;color:var(--gray-800)}
.v4-select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
.v4-wf-info{margin-top:14px;padding:14px;background:var(--gray-50);border-radius:8px}
.v4-wf-info-row{display:flex;gap:8px;padding:3px 0;font-size:13px}
.v4-wf-info-label{font-weight:600;color:var(--gray-600);min-width:80px}
.v4-wf-info-val{color:var(--gray-800)}
.v4-speed-output-hidden{display:none!important}
.v4-safety-box{background:var(--red-bg);border:1px solid var(--red-border);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:14px;line-height:1.4}
.v4-safety-box-sm{background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:6px;padding:8px 12px;font-size:11px;color:var(--gray-600);margin-bottom:10px;line-height:1.4}

/* Chip Groups (Step 1) */
.v4-chip-group{border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px;overflow:hidden}
.v4-chip-group-header{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--gray-50);cursor:pointer;font-size:13px;font-weight:600;color:var(--gray-700)}
.v4-chip-group-header:hover{background:var(--gray-100)}
.v4-cg-toggle{font-size:10px;width:16px;text-align:center}
.v4-cg-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--gray-400)}
.v4-chip-group-body{padding:10px 14px 14px}
.v4-chip-list{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.v4-chip-btn{padding:5px 12px;border-radius:16px;font-size:12px;font-weight:500;border:1px solid var(--gray-200);background:#fff;color:var(--gray-600);cursor:pointer;font-family:var(--font);transition:all .12s}
.v4-chip-btn:hover{background:var(--gray-50);border-color:var(--gray-300)}
.v4-chip-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.v4-custom-entry-row{display:flex;gap:6px;align-items:center;margin-top:4px}
.v4-custom-entry-input{flex:1;padding:6px 10px;border:1px solid var(--gray-300);border-radius:6px;font-size:12px;font-family:var(--font)}
.v4-custom-entry-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-glow)}
.v4-btn-sm{padding:6px 12px;font-size:11px}

/* History fields (Step 2) */
.v4-hist-fields{margin-bottom:12px;padding:14px;background:var(--gray-50);border-radius:8px}
.v4-hist-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.v4-hist-item{display:flex;flex-direction:column;gap:3px}
.v4-hist-label{font-size:12px;font-weight:600;color:var(--gray-600)}
.v4-hist-input{padding:8px 10px;border:1px solid var(--gray-300);border-radius:6px;font-size:13px;font-family:var(--font)}
.v4-hist-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
@media(max-width:640px){.v4-hist-grid{grid-template-columns:1fr}}
.v4-hist-preview-wrap{margin-top:8px}
.v4-hist-preview{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:12px 14px;font-size:13px;line-height:1.6;white-space:pre-wrap;color:var(--gray-700);min-height:40px}

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
