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
    clinicalWorkflows: [],
    specialties: [],
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
    planConfirmations: {},

    // Workflow filters and optional calculator results
    selectedSpecialtyFilter: '',
    _wfSearchTerm: '',
    calculatorResults: {}
  };

  var currentStep = 1;
  var TOTAL_STEPS = 6;

  var SPECIALTY_ORDER = [
    'General Medicine / GP',
    'Pediatrics',
    'OB/GYN',
    'Orthopedics / MSK',
    'ENT',
    'Dermatology',
    'Ophthalmology',
    'Psychiatry / Mental Health',
    'Emergency / Urgent Care',
    'Cardiology',
    'Neurology',
    'Respiratory / Pulmonology',
    'Gastroenterology',
    'Endocrinology',
    'Urology / Nephrology'
  ];

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
  function buildV4HistoryFromFields(fields, chipSymptoms) {
    if (!fields) fields = {};
    chipSymptoms = chipSymptoms || [];

    // Collect known field types by scanning keys
    var duration = '';
    var concern = '';
    var associated = '';
    var negatives = '';
    var other = '';

    for (var k in fields) {
      var v = (fields[k] || '').trim();
      if (!v) continue;
      var kl = k.toLowerCase();
      if (kl.indexOf('duration') >= 0 && kl.indexOf('duration') < 5) { duration = v; }
      else if (kl.indexOf('associated') >= 0 || kl.indexOf('symptoms_if') >= 0) { associated = v; }
      else if (kl.indexOf('negatives') >= 0) { negatives = v; }
      else if (kl.indexOf('additional') >= 0) { other = v; }
      else if (!concern) { concern = v; }
    }

    // Normalize: lowercase unless proper noun (none expected here)
    function nc(s) { return s.toLowerCase(); }
    if (concern) concern = nc(concern);
    if (associated) associated = nc(associated);

    // Build the symptom list: chip symptoms first, then concern + associated
    var allSymptoms = chipSymptoms.map(nc).slice();
    if (concern && concern !== nc(duration)) {
      var concernParts = concern.split(/[,;]+/).map(function(s){return s.trim();}).filter(Boolean);
      for (var ci = 0; ci < concernParts.length; ci++) {
        var cp = nc(concernParts[ci]);
        if (allSymptoms.indexOf(cp) < 0) allSymptoms.push(cp);
      }
    }
    if (associated && allSymptoms.indexOf(associated) < 0) allSymptoms.push(associated);

    var parts = [];
    // Build natural presenting sentence
    if (allSymptoms.length > 0) {
      var symptomList = allSymptoms.reduce(function(acc, s, i) {
        if (i === 0) return s;
        if (i === allSymptoms.length - 1) return acc + ', and ' + s;
        return acc + ', ' + s;
      }, '');
      if (duration) {
        var daysMatch = duration.match(/(\d+)\s*(day|week|month|year)s?/i);
        if (daysMatch) {
          var singular = daysMatch[1] + '-' + daysMatch[2].toLowerCase();
          parts.push('Patient presents with a ' + singular + ' history of ' + symptomList + '.');
        } else {
          parts.push('Patient presents with ' + symptomList + ' for ' + duration + '.');
        }
      } else {
        parts.push('Patient presents with ' + symptomList + '.');
      }
    } else if (concern && duration) {
      parts.push('Patient presents with ' + concern + ' for ' + duration + '.');
    } else if (duration) {
      parts.push('Patient presents with symptoms for ' + duration + '.');
    }

    if (negatives) {
      var negParts = negatives.split(/[,;]+/).map(function(s){return nc(s.trim());}).filter(Boolean);
      parts.push('Relevant negatives include ' + negParts.join(', ') + '.');
    }
    if (other) parts.push(nc(other) + '.');

    return (parts.length ? parts.join(' ') : '');
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
      fetch('./data/v4_investigation_options.json').then(function(r){ return r.json(); }),
      fetch('./data/clinical_workflows.json').then(function(r){ return r.json(); })
    ]).then(function(results) {
      state.historyDrafts = results[0];
      state.examDetails = results[1];
      state.planOptions = results[2];
      state.investigationOptions = results[3];
      state.clinicalWorkflows = results[4] || [];

      var workflowMeta = {};
      var specialtySet = {};
      for (var wi = 0; wi < state.clinicalWorkflows.length; wi++) {
        var cw = state.clinicalWorkflows[wi] || {};
        var id = cw.workflow_id || cw.id || '';
        if (!id) continue;
        var spec = cw.specialty || cw.specialty_name || cw.specialty_id || cw.category || 'General Medicine / GP';
        var displayName = cw.display_name || cw.workflow_display_name || cw.name || '';
        if (!displayName && (cw.chief_complaint || cw.diagnosis)) {
          displayName = [cw.chief_complaint, cw.diagnosis].filter(Boolean).join(' - ');
        }
        workflowMeta[id] = {
          display_name: displayName || id,
          specialty: spec
        };
        specialtySet[spec] = true;
      }

      state.workflowList = state.historyDrafts.map(function(d) {
        var meta = workflowMeta[d.workflow_id] || {};
        var specialty = meta.specialty || d.specialty || 'General Medicine / GP';
        specialtySet[specialty] = true;
        return {
          workflow_id: d.workflow_id,
          display_name: d.workflow_display_name || meta.display_name || d.workflow_id,
          specialty: specialty,
          safety_note: d.safety_note || ''
        };
      });

      var ordered = [];
      for (var oi = 0; oi < SPECIALTY_ORDER.length; oi++) {
        if (specialtySet[SPECIALTY_ORDER[oi]]) ordered.push(SPECIALTY_ORDER[oi]);
      }
      Object.keys(specialtySet).sort().forEach(function(specName) {
        if (ordered.indexOf(specName) < 0) ordered.push(specName);
      });
      state.specialties = ordered;
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

  function filteredWorkflowList() {
    var searchTerm = (state._wfSearchTerm || '').toLowerCase().trim();
    var specialtyFilter = state.selectedSpecialtyFilter || '';
    return state.workflowList.filter(function(wf) {
      var specialtyMatch = !specialtyFilter || wf.specialty === specialtyFilter;
      var text = (wf.display_name + ' ' + wf.specialty + ' ' + wf.workflow_id).toLowerCase();
      var searchMatch = !searchTerm || text.indexOf(searchTerm) >= 0;
      return specialtyMatch && searchMatch;
    });
  }

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

    // First-use guidance (compact)
    html += '<div class="v4-guidance"><span class="v4-guidance-step">1. Select workflow</span> <span class="v4-guidance-arrow">/</span> <span class="v4-guidance-step">2. Review chips and fill fields</span> <span class="v4-guidance-arrow">/</span> <span class="v4-guidance-step">3. Document exam and plan</span> <span class="v4-guidance-arrow">/</span> <span class="v4-guidance-step">4. Generate combined draft</span></div>';

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
    h += '<p class="v4-step-d">Choose a specialty, then select a workflow to load Autofill chips and Advanced Mode documentation fields. All 150 workflows remain accessible.</p>';

    var filtered = filteredWorkflowList();
    h += '<div class="v4-wf-grid">';
    h += '<div class="v4-wf-search"><label class="v4-field-label">Specialty</label>';
    h += '<select class="v4-select" id="v4SpecialtySelect" onchange="window._v4SetSpecialty(this.value)">';
    h += '<option value="">All specialties</option>';
    for (var si = 0; si < state.specialties.length; si++) {
      var spec = state.specialties[si];
      h += '<option value="' + esc(spec) + '"' + (spec === state.selectedSpecialtyFilter ? ' selected' : '') + '>' + esc(spec) + '</option>';
    }
    h += '</select></div>';

    h += '<div class="v4-wf-search"><label class="v4-field-label">Search workflows</label>';
    h += '<input class="v4-search-input" type="text" id="v4WorkflowSearch" placeholder="Search by complaint, diagnosis, specialty, or workflow ID..." oninput="window._v4SearchWf(this.value)" value="' + esc(state._wfSearchTerm || '') + '"></div>';
    h += '</div>';

    h += '<div class="v4-wf-search"><label class="v4-field-label">Workflow <span class="v4-count-pill">' + filtered.length + ' shown</span></label>';
    h += '<select class="v4-select" id="v4WorkflowSelect" onchange="window._v4SelectWf()" size="8">';
    h += '<option value="">-- Select a workflow --</option>';
    for (var i = 0; i < filtered.length; i++) {
      var wf = filtered[i];
      h += '<option value="' + esc(wf.workflow_id) + '"' + (wf.workflow_id === state.selectedWorkflowId ? ' selected' : '') + '>' + esc(wf.display_name) + ' (' + esc(wf.specialty) + ')</option>';
    }
    if (filtered.length === 0) h += '<option value="" disabled>No matching workflow found.</option>';
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
    var previewText = buildV4HistoryFromFields(state.historyFields, window.V4_ENCOUNTER_STATE.selectedChips.symptoms.concat(window.V4_ENCOUNTER_STATE.customEntries.symptoms));
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
      h += '<p class="v4-calc-empty">No optional calculator is available for this workflow yet.</p>';
      return h;
    }

    h += '<div class="v4-calc-grid">';
    for (var ci = 0; ci < calcs.length; ci++) {
      var calc = calcs[ci];
      var cr = state.calculatorResults[calc.id] || {};
      h += renderCalcCard(calc, cr);
    }
    h += '</div>';
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
      var saved = cr.values && cr.values[inp.key] !== undefined ? cr.values[inp.key] : '';
      h += '<div class="v4-calc-input-row">';
      h += '<label>' + esc(inp.label) + '</label>';
      if (inp.type === 'select') {
        h += '<select id="v4calc-' + calc.id + '-' + inp.key + '" data-calc-id="' + esc(calc.id) + '" data-calc-key="' + esc(inp.key) + '" onchange="window._v4CalcInputChange(this.dataset.calcId, this.dataset.calcKey, this.value)" style="min-width:150px;margin-left:8px;padding:4px 8px;border:1px solid var(--gray-200);border-radius:4px;">';
        h += '<option value="">Select</option>';
        var opts = inp.options || [];
        for (var oi = 0; oi < opts.length; oi++) {
          h += '<option value="' + esc(opts[oi].value) + '"' + (String(saved) === String(opts[oi].value) ? ' selected' : '') + '>' + esc(opts[oi].label) + '</option>';
        }
        h += '</select>';
      } else {
        h += '<input type="' + inp.type + '" id="v4calc-' + calc.id + '-' + inp.key + '" placeholder="' + esc(inp.placeholder || '') + '" value="' + esc(saved) + '" data-calc-id="' + esc(calc.id) + '" data-calc-key="' + esc(inp.key) + '" oninput="window._v4CalcInputChange(this.dataset.calcId, this.dataset.calcKey, this.value)" style="width:110px;margin-left:8px;padding:4px 8px;border:1px solid var(--gray-200);border-radius:4px;">';
      }
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
    h += '<button class="v4-btn v4-btn-sm" data-calc-id="' + esc(calc.id) + '" onclick="window._v4DoCalc(this.dataset.calcId)">Calculate</button>';
    if (resultText) {
      var included = cr.included || false;
      h += '<button class="v4-btn v4-btn-sm ' + (included ? 'v4-btn-primary' : 'v4-btn-outline') + '" id="calc-include-btn-' + calc.id + '" data-calc-id="' + esc(calc.id) + '" onclick="window._v4ToggleCalcInclude(this.dataset.calcId)">' + (included ? 'Included in draft' : 'Include in draft') + '</button>';
    }
    h += '<button class="v4-btn v4-btn-sm v4-btn-ghost" data-calc-id="' + esc(calc.id) + '" onclick="window._v4ClearCalc(this.dataset.calcId)">Clear</button>';
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
      ipss: [{key:'score',label:'IPSS score (0-35)',type:'number',placeholder:'e.g. 15'}],
      nyha: [{key:'grade',label:'NYHA class',type:'select',options:[{value:'1',label:'Class I'},{value:'2',label:'Class II'},{value:'3',label:'Class III'},{value:'4',label:'Class IV'}]}],
      killip: [{key:'grade',label:'Killip class',type:'select',options:[{value:'1',label:'Class I'},{value:'2',label:'Class II'},{value:'3',label:'Class III'},{value:'4',label:'Class IV'}]}],
      sirs: [{key:'temp',label:'Temperature (C)',type:'number',placeholder:'e.g. 38.3'},{key:'hr',label:'Heart rate',type:'number',placeholder:'e.g. 110'},{key:'rr',label:'Respiratory rate',type:'number',placeholder:'e.g. 22'},{key:'wbc',label:'WBC (10^9/L)',type:'number',placeholder:'e.g. 13'}],
      qsofa: [{key:'rr',label:'Respiratory rate',type:'number',placeholder:'e.g. 24'},{key:'sbp',label:'Systolic BP',type:'number',placeholder:'e.g. 100'},{key:'mentalStatus',label:'Altered mental status',type:'select',options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}]}],
      fib4: [{key:'age',label:'Age (years)',type:'number',placeholder:'e.g. 55'},{key:'ast',label:'AST',type:'number',placeholder:'e.g. 40'},{key:'alt',label:'ALT',type:'number',placeholder:'e.g. 35'},{key:'platelets',label:'Platelets (10^9/L)',type:'number',placeholder:'e.g. 220'}],
      child_pugh: [{key:'bilirubin',label:'Bilirubin',type:'number',placeholder:'numeric value'},{key:'albumin',label:'Albumin',type:'number',placeholder:'numeric value'},{key:'inr',label:'INR',type:'number',placeholder:'e.g. 1.2'},{key:'ascites',label:'Ascites',type:'select',options:[{value:'none',label:'None documented'},{value:'mild',label:'Mild'},{value:'moderate_severe',label:'Moderate/severe'}]},{key:'encephalopathy',label:'Encephalopathy',type:'select',options:[{value:'none',label:'None documented'},{value:'grade1_2',label:'Grade I-II'},{value:'grade3_4',label:'Grade III-IV'}]}]
    };
    return inputs[calcId] || [];
  }

  function doCalc(calcId) {
    var values = {};
    var inputs = getCalcInputs(calcId);
    for (var ii = 0; ii < inputs.length; ii++) {
      var el = document.getElementById('v4calc-' + calcId + '-' + inputs[ii].key);
      values[inputs[ii].key] = inputs[ii].type === 'select' ? (el ? el.value : '') : (el ? parseFloat(el.value) : NaN);
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
    updateSidebar();
  }

  function clearCalc(calcId) {
    if (state.calculatorResults) delete state.calculatorResults[calcId];
    var inputs = getCalcInputs(calcId);
    for (var ii = 0; ii < inputs.length; ii++) {
      var el = document.getElementById('v4calc-' + calcId + '-' + inputs[ii].key);
      if (el) el.value = '';
    }
    var resultDiv = document.getElementById('calc-result-' + calcId);
    if (resultDiv) resultDiv.style.display = 'none';
    var btn = document.getElementById('calc-include-btn-' + calcId);
    if (btn) btn.remove();
    updateSidebar();
  }

  function onCalcInputChange(calcId, key, value) {
    if (!state.calculatorResults) state.calculatorResults = {};
    if (!state.calculatorResults[calcId]) state.calculatorResults[calcId] = { values: {}, result: '', included: false };
    if (!state.calculatorResults[calcId].values) state.calculatorResults[calcId].values = {};
    state.calculatorResults[calcId].values[key] = value;
  }

  window._v4DoCalc = doCalc;
  window._v4ToggleCalcInclude = toggleCalcInclude;
  window._v4ClearCalc = clearCalc;
  window._v4CalcInputChange = onCalcInputChange;

  function computeCalc(calcId, v) {
    var calcFns = {
      bmi: function() { if (isNaN(v.height) || isNaN(v.weight) || v.height <= 0) return null; var h = v.height / 100; var bmi = v.weight / (h * h); return { text: bmi.toFixed(1) + ' kg/m\\u00b2. Clinician interpretation required.', value: bmi }; },
      pack_years: function() { if (isNaN(v.cigarettesPerDay) || isNaN(v.yearsSmoked)) return null; var py = (v.cigarettesPerDay / 20) * v.yearsSmoked; return { text: py.toFixed(1) + ' pack-years.', value: py }; },
      mean_arterial_pressure: function() { if (isNaN(v.sbp) || isNaN(v.dbp)) return null; var map = v.dbp + (v.sbp - v.dbp) / 3; return { text: map.toFixed(0) + ' mmHg. Clinician interpretation required.', value: map }; },
      shock_index: function() { if (isNaN(v.hr) || isNaN(v.sbp) || v.sbp <= 0) return null; var si = v.hr / v.sbp; return { text: si.toFixed(2) + '. Clinician interpretation required.', value: si }; },
      mrc_dyspnea_scale: function() { if (isNaN(v.grade) || v.grade < 1 || v.grade > 5) return null; var grades = ['not troubled by breathlessness except on strenuous exercise','short of breath when hurrying on level ground or walking up a slight hill','walks slower than people of the same age because of breathlessness, or stops for breath when walking at own pace','stops for breath after walking about 100m or after a few minutes on level','too breathless to leave the house, or breathless when dressing/undressing']; return { text: 'MRC dyspnea grade ' + v.grade + ': ' + grades[Math.round(v.grade)-1] + '. Clinician interpretation required.', value: v.grade }; },
      phq_2: function() { if (isNaN(v.score) || v.score < 0 || v.score > 6) return null; return { text: 'PHQ-2 score: ' + v.score + '/6. Clinician interpretation required.', value: v.score }; },
      phq_9: function() { if (isNaN(v.score) || v.score < 0 || v.score > 27) return null; var sev = v.score <= 4 ? 'minimal' : v.score <= 9 ? 'mild' : v.score <= 14 ? 'moderate' : v.score <= 19 ? 'moderately severe' : 'severe'; return { text: 'PHQ-9 score: ' + v.score + '/27 (' + sev + '). Clinician interpretation required.', value: v.score }; },
      gad_7: function() { if (isNaN(v.score) || v.score < 0 || v.score > 21) return null; var sev = v.score <= 4 ? 'minimal' : v.score <= 9 ? 'mild' : v.score <= 14 ? 'moderate' : 'severe'; return { text: 'GAD-7 score: ' + v.score + '/21 (' + sev + '). Clinician interpretation required.', value: v.score }; },
      epworth_sleepiness_scale: function() { if (isNaN(v.score) || v.score < 0 || v.score > 24) return null; var sev = v.score <= 10 ? 'normal range' : v.score <= 12 ? 'borderline' : v.score <= 15 ? 'mild to moderate' : 'severe'; return { text: 'Epworth Sleepiness Scale: ' + v.score + '/24 (' + sev + ' sleepiness). Clinician interpretation required.', value: v.score }; },
      ipss: function() { if (isNaN(v.score) || v.score < 0 || v.score > 35) return null; var sev = v.score <= 7 ? 'mildly symptomatic' : v.score <= 19 ? 'moderately symptomatic' : 'severely symptomatic'; return { text: 'IPSS: ' + v.score + '/35 (' + sev + '). Clinician interpretation required.', value: v.score }; },
      nyha: function() { var g = parseInt(v.grade, 10); if (!g || g < 1 || g > 4) return null; return { text: 'NYHA functional class documented: Class ' + g + '. Clinician interpretation required.', value: g }; },
      killip: function() { var g = parseInt(v.grade, 10); if (!g || g < 1 || g > 4) return null; return { text: 'Killip class documented: Class ' + g + '. Clinician interpretation required.', value: g }; },
      sirs: function() { if (isNaN(v.temp) || isNaN(v.hr) || isNaN(v.rr) || isNaN(v.wbc)) return null; var score = 0; if (v.temp > 38 || v.temp < 36) score++; if (v.hr > 90) score++; if (v.rr > 20) score++; if (v.wbc > 12 || v.wbc < 4) score++; return { text: 'SIRS criteria documented: ' + score + '/4. Clinician interpretation required.', value: score }; },
      qsofa: function() { if (isNaN(v.rr) || isNaN(v.sbp) || !v.mentalStatus) return null; var score = 0; if (v.rr >= 22) score++; if (v.sbp <= 100) score++; if (v.mentalStatus === 'yes') score++; return { text: 'qSOFA score documented: ' + score + '/3. Clinician interpretation required.', value: score }; },
      fib4: function() { if (isNaN(v.age) || isNaN(v.ast) || isNaN(v.alt) || isNaN(v.platelets) || v.alt <= 0 || v.platelets <= 0) return null; var score = (v.age * v.ast) / (v.platelets * Math.sqrt(v.alt)); return { text: 'FIB-4 index: ' + score.toFixed(2) + '. Clinician interpretation required.', value: score }; },
      child_pugh: function() { if (isNaN(v.bilirubin) || isNaN(v.albumin) || isNaN(v.inr) || !v.ascites || !v.encephalopathy) return null; var score = 0; score += v.bilirubin < 2 ? 1 : (v.bilirubin <= 3 ? 2 : 3); score += v.albumin > 3.5 ? 1 : (v.albumin >= 2.8 ? 2 : 3); score += v.inr < 1.7 ? 1 : (v.inr <= 2.3 ? 2 : 3); score += v.ascites === 'none' ? 1 : (v.ascites === 'mild' ? 2 : 3); score += v.encephalopathy === 'none' ? 1 : (v.encephalopathy === 'grade1_2' ? 2 : 3); var cls = score <= 6 ? 'A' : (score <= 9 ? 'B' : 'C'); return { text: 'Child-Pugh score documented: ' + score + ' (Class ' + cls + '). Clinician interpretation required.', value: score }; }
    };
    if (calcFns[calcId]) return calcFns[calcId]();
    return null;
  }
  function getRelatedCalcs(wfId) {
    try {
      var data = window.NAJM_CLINICAL_DATA;
      if (!data || !data.calculators || !data.calculator_workflow_mapping) return [];
      var mapping = data.calculator_workflow_mapping;
      var mapList = mapping[wfId] || [];
      var result = [];
      var seen = {};
      for (var i = 0; i < mapList.length; i++) {
        var calcItem = mapList[i];
        var calcId = typeof calcItem === 'string' ? calcItem : calcItem.calculator_id;
        var calcDef = data.calculators[calcId];
        if (calcDef && !seen[calcId] && calcDef.risk_level !== 'high' && calcDef.implementation_status === 'implemented') {
          seen[calcId] = true;
          result.push({
            id: calcId,
            name: calcDef.calculator_name || calcDef.display_name || calcId,
            desc: (typeof calcItem === 'string' ? '' : calcItem.relevance_reason) || calcDef.purpose || calcDef.clinical_context || ''
          });
        }
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
    h += '<button class="v4-btn v4-btn-outline" onclick="window._v4ExportTxt()">Export TXT</button>';
    h += '<button class="v4-btn v4-btn-outline" onclick="window._v4Print()">Print / Save PDF</button>';
    h += '<button class="v4-btn v4-btn-ghost" onclick="window._v4ClearOutput()">Clear</button></div>';
    return h;
  }

  // ================================================================
  //  CONTENT ROUTER AND RENDERERS
  // ================================================================
  var _currentTab = 'adv-emr';
  var _outputGenerated = false;

  // ================================================================
  //  V4 NOTE MODEL (single structured note model, replaces regex pipeline)
  // ================================================================

  var V4_FOOTER = '\n\n---\n[Draft generated from clinician-entered information. Review and approve before use.]\n';

  function buildV4NoteModel(rawState) {
    return {
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
      },
      assessment: {
        impression: ''
      },
      plan: {
        advice: [],
        safetyNetting: [],
        followUp: [],
        referrals: [],
        investigations: []
      }
    };
  }



  // Clean final output phrases: strip prompt/template wording
  // Apply cleaner to an array of lines
  // Polish output lines: sentence case, punctuation, natural phrasing
  // Step 1: Collect fresh state from V4_ENCOUNTER_STATE
  // Step 2: Normalize
  // Step 3: Route content to output sections


  function transformPromptToNoteText(text) {
    if (!text) return '';
    text = String(text).trim();
    var omitPhrases = /^(temperature|heart rate|pulse|respiratory rate|oxygen saturation|blood pressure|weight( and bmi)?|general appearance|gait|hydrat(ion| status|ion status)|oropharyngeal examination|cervical lymphadenopathy|chest (wall examination|auscultation)|meningeal signs|tonsillar appearance|fundal height|fetal (heart auscultation|movement)|lower limb oedema|throat examination|otoscopy|respiratory effort|abdominal examination|skin rash|non-blanching rash|capillary refill|urine output context|lumbar range of motion|spinal tenderness|straight leg raise|crossed straight leg raise|lower limb (power|sensation|reflexes)|saddle sensation|neurovascular status|foot inspection|peripheral pulses|monofilament sensation|injection sites|parent or guardian report context|general appearance and activity level)$/i;
    text = text.replace(/\s*documented\s+if\s+(assessed|measured|discussed|clinician\s+decided|arranged|relevant(\s+and\s+assessed)?)\s*\.?\s*$/i, '');
    text = text.replace(/\s*recorded\s+if\s+measured\s*\.?\s*$/i, '');
    text = text.replace(/\s*reviewed\s+if\s+(available|ordered|relevant|performed)\s*\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+only\s+if\s+clinician\s+(decided|did so|arranged)\s*\.?\s*$/i, '');
    text = text.replace(/\s*documented\s+if\s+(the\s+)?clinician\s+(decided|did so|arranged)\s*\.?\s*$/i, '');
    text = text.replace(/\s*reviewed\s+or\s+discussed\s*(documented\s+if\s+clinician\s+did\s+so)?\s*\.?\s*$/i, '');
    text = text.replace(/^Rapid test result$/i, 'Rapid test');
    text = text.replace(/^(Cbc|Crp|Chest imaging|HbA1c|Renal function|Lipid profile|Urine acr|Home glucose log|Previous imaging|X-ray|Mri report|Inflammatory markers|Urinalysis|Cultures|Blood pressure trend|Antenatal labs|Glucose screening result|Ultrasound report|Urine dipstick)$/i, '$1 reviewed');
    text = text.replace(/^supportive care( advice| discussed)?$/i, 'Supportive care advised');
    text = text.replace(/^return precautions$/i, 'Return precautions discussed');
    text = text.replace(/^follow-up arranged$/i, 'Follow-up arranged');
    text = text.replace(/^hydration and rest advice$/i, 'Hydration and rest advised');
    text = text.replace(/^lifestyle advice$/i, 'Lifestyle advice discussed');
    text = text.replace(/^activity modification$/i, 'Activity modification discussed');
    text = text.replace(/^red flags explained$/i, 'Red flags explained');
    text = text.replace(/^parent or guardian advice$/i, 'Parent or guardian advice discussed');
    text = text.replace(/^hydration and feeding advice$/i, 'Hydration and feeding advised');
    text = text.replace(/^antenatal counseling$/i, 'Antenatal counseling discussed');
    text = text.replace(/^warning symptoms$/i, 'Warning symptoms discussed');
    if (omitPhrases.test(text)) return '';
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.?!]$/.test(text)) text += '.';
    return text;
  }

  function normalizeV4SelectionsToNoteModel(state$) {
    var model = buildV4NoteModel(state$);
    var ges = window.V4_ENCOUNTER_STATE;
    var hf = ges.history.fields || state$.historyFields || {};
    model.subjective.symptoms = (ges.selectedChips.symptoms || []).map(function(s) { return s.toLowerCase(); });
    model.subjective.associatedSymptoms = (ges.customEntries.symptoms || []).slice();
    for (var k in hf) {
      var v = (hf[k] || '').trim();
      if (!v) continue;
      var kl = k.toLowerCase();
      if (kl.indexOf('duration') >= 0 && kl.indexOf('duration') < 5) {
        model.subjective.duration = v;
      } else if (kl.indexOf('negatives') >= 0) {
        var negParts = v.split(/[,;]+/).map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
        for (var ni = 0; ni < negParts.length; ni++) {
          if (model.subjective.relevantNegatives.indexOf(negParts[ni]) < 0) model.subjective.relevantNegatives.push(negParts[ni]);
        }
      } else if (kl.indexOf('associated') >= 0 || kl.indexOf('symptoms_if') >= 0) {
        var av = v.toLowerCase();
        // Detect negative phrasing: route to negatives, not symptoms
        if (/^no\s/i.test(av) || /^(denies|denied|negative for)/i.test(av)) {
          if (model.subjective.relevantNegatives.indexOf(av) < 0) model.subjective.relevantNegatives.push(av);
        } else {
          model.subjective.associatedSymptoms.push(v);
        }
      } else if (kl.indexOf('additional') >= 0) {
      } else if (!model.subjective.chiefConcern) {
        model.subjective.chiefConcern = v;
      }
    }
    var negs = (ges.selectedChips.relevant_negatives || []).concat(ges.customEntries.relevant_negatives || []);
    for (var ni2 = 0; ni2 < negs.length; ni2++) {
      var n = negs[ni2].toLowerCase().trim();
      if (n && model.subjective.relevantNegatives.indexOf(n) < 0) model.subjective.relevantNegatives.push(n);
    }
    var examChips = (ges.selectedChips.exam_findings || []).concat(ges.customEntries.exam_findings || []);
    for (var ei = 0; ei < examChips.length; ei++) {
      var cleaned = transformPromptToNoteText(examChips[ei]);
      if (cleaned) model.objective.examFindings.push(cleaned);
    }
    var exam = getExamDetails(state$.workflowId);
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var key = group.group_id + '::' + group.prompts[pi].prompt_id;
          if (state$.examConfirmations[key]) {
            var cleaned2 = transformPromptToNoteText(group.prompts[pi].prompt_text);
            if (cleaned2) model.objective.examFindings.push(cleaned2);
          }
        }
      }
    }
    var examSeen = {};
    model.objective.examFindings = model.objective.examFindings.filter(function(f) {
      var key = f.toLowerCase().trim();
      if (!key || examSeen[key]) return false;
      examSeen[key] = true;
      return true;
    });
    var invChips = (ges.selectedChips.investigations || []).concat(ges.customEntries.investigations || []);
    for (var ii = 0; ii < invChips.length; ii++) {
      var cleanedInv = transformPromptToNoteText(invChips[ii]);
      if (cleanedInv) model.objective.investigations.push(cleanedInv);
    }
    var inv = getInvestigationOptions(state$.workflowId);
    if (inv && inv.investigation_groups) {
      for (var ivi = 0; ivi < inv.investigation_groups.length; ivi++) {
        var ig = inv.investigation_groups[ivi];
        for (var oi = 0; oi < ig.options.length; oi++) {
          var ikey = ig.group_id + '::' + ig.options[oi].option_id;
          if (state$.investigationConfirmations[ikey]) {
            var invNote = ig.options[oi].note_text || ig.options[oi].option_text;
            invNote = transformPromptToNoteText(invNote);
            if (invNote) model.objective.investigations.push(invNote);
          }
        }
      }
    }
    var invSeen = {};
    model.objective.investigations = model.objective.investigations.filter(function(f) {
      var key = f.toLowerCase().trim();
      if (!key || invSeen[key]) return false;
      invSeen[key] = true;
      return true;
    });

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
    model.assessment.impression = state$.impression || '[not documented]';
    var planChips = (ges.selectedChips.plan_phrases || []).concat(ges.customEntries.plan_phrases || []);
    for (var pci = 0; pci < planChips.length; pci++) {
      var cleanedPlan = transformPromptToNoteText(planChips[pci]);
      if (cleanedPlan) model.plan.advice.push(cleanedPlan);
    }
    var planOpts = getPlanOptions(state$.workflowId);
    if (planOpts && planOpts.plan_option_groups) {
      for (var pgi = 0; pgi < planOpts.plan_option_groups.length; pgi++) {
        var pg = planOpts.plan_option_groups[pgi];
        for (var poi = 0; poi < pg.options.length; poi++) {
          var opt = pg.options[poi];
          if (state$.planConfirmations[opt.option_id]) {
            var planNote = opt.note_text || opt.option_text;
            planNote = transformPromptToNoteText(planNote);
            if (!planNote) continue;
            var cat = (opt.option_category || '').toLowerCase();
            if (cat === 'follow_up') {
              model.plan.followUp.push(planNote);
            } else if (cat === 'safety_netting') {
              model.plan.safetyNetting.push(planNote);
            } else if (cat.indexOf('referral') >= 0) {
              model.plan.referrals.push(planNote);
            } else if (cat.indexOf('investigation') >= 0 || cat.indexOf('diagnostic') >= 0) {
              model.plan.investigations.push(planNote);
            } else {
              model.plan.advice.push(planNote);
            }
          }
        }
      }
    }
    if (state$.planText) {
      model.plan.advice.push(state$.planText);
    }
    var fupChips = (ges.selectedChips.follow_up || []).concat(ges.customEntries.follow_up || []);
    for (var fci = 0; fci < fupChips.length; fci++) {
      var cleanedFup = transformPromptToNoteText(fupChips[fci]);
      if (cleanedFup) model.plan.followUp.push(cleanedFup);
    }
    var planAdviceSeen = {};
    model.plan.advice = model.plan.advice.filter(function(a) {
      var key = a.toLowerCase().trim();
      if (!key || planAdviceSeen[key]) return false;
      planAdviceSeen[key] = true;
      return true;
    });
    return model;
  }


  // ================================================================
  //  RENDERERS
  // ================================================================

  function collectRawState() {
    var ges = window.V4_ENCOUNTER_STATE;
    return {
      workflowId: state.selectedWorkflowId,
      workflowName: state.selectedWorkflowDisplay,
      chips: {
        symptoms: (ges.selectedChips.symptoms || []).slice(),
        relevant_negatives: (ges.selectedChips.relevant_negatives || []).slice(),
        exam_findings: (ges.selectedChips.exam_findings || []).slice(),
        investigations: (ges.selectedChips.investigations || []).slice(),
        plan_phrases: (ges.selectedChips.plan_phrases || []).slice(),
        follow_up: (ges.selectedChips.follow_up || []).slice()
      },
      customEntries: {
        symptoms: (ges.customEntries.symptoms || []).slice(),
        relevant_negatives: (ges.customEntries.relevant_negatives || []).slice(),
        exam_findings: (ges.customEntries.exam_findings || []).slice(),
        investigations: (ges.customEntries.investigations || []).slice(),
        plan_phrases: (ges.customEntries.plan_phrases || []).slice(),
        follow_up: (ges.customEntries.follow_up || []).slice()
      },
      historyFields: ges.history.fields || {},
      examConfirmations: state.examConfirmations || {},
      investigationConfirmations: state.investigationConfirmations || {},
      impression: state.impression || '',
      planText: state.planText || '',
      planConfirmations: state.planConfirmations || {},
      calculatorResults: state.calculatorResults || {}
    };
  }

  function renderSubjective(model) {
    var s = model.subjective;
    var parts = [];
    var allSymptoms = s.symptoms.concat(s.associatedSymptoms);
    if (allSymptoms.length > 0) {
      var list = allSymptoms.reduce(function(acc, s, i) {
        if (i === 0) return s;
        if (i === allSymptoms.length - 1) return acc + ', and ' + s;
        return acc + ', ' + s;
      }, '');
      if (s.duration) {
        var dm = s.duration.match(/(\d+)\s*(day|week|month)s?/i);
        if (dm) {
          parts.push('Patient presents with a ' + dm[1] + '-' + dm[2].toLowerCase() + ' history of ' + list + '.');
        } else {
          parts.push('Patient presents with ' + list + ' for ' + s.duration + '.');
        }
      } else {
        parts.push('Patient presents with ' + list + '.');
      }
    } else if (s.chiefConcern) {
      var cc = s.chiefConcern.charAt(0).toLowerCase() + s.chiefConcern.slice(1);
      parts.push('Patient presents with ' + cc + (s.duration ? ' for ' + s.duration : '') + '.');
    }
    if (s.relevantNegatives.length > 0) {
      var noPeriodNegs = s.relevantNegatives.map(function(n) { return n.replace(/\.\s*$/, ''); });
      parts.push('Relevant negatives include ' + noPeriodNegs.join(', ') + '.');
    }
    return parts.join(' ') || '[not documented]';
  }

  function renderObjective(model) {
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
    return lines.length ? lines.join('\n') : '[not documented]';
  }

  function renderPlan(model) {
    // Collect all plan lines from all sources
    var rawLines = [];
    rawLines = rawLines.concat(model.plan.advice);
    rawLines = rawLines.concat(model.plan.safetyNetting);
    rawLines = rawLines.concat(model.plan.referrals);
    rawLines = rawLines.concat(model.plan.investigations);

    // Normalize: lowercase, strip periods for dedup comparison
    function normForDedup(s) { return s.toLowerCase().replace(/[.,;]+\s*$/g, '').trim(); }

    // Deduplicate by normalized text
    var seen = {};
    var deduped = [];
    for (var i = 0; i < rawLines.length; i++) {
      var key = normForDedup(rawLines[i]);
      if (!key || seen[key]) continue;
      seen[key] = true;
      deduped.push(rawLines[i]);
    }

    // Combine 'Hydration advised.' + 'Rest advised.' into one
    var hydIdx = -1, restIdx = -1;
    for (var hi = 0; hi < deduped.length; hi++) {
      var n = normForDedup(deduped[hi]);
      if (n === 'hydration advised') hydIdx = hi;
      if (n === 'rest advised') restIdx = hi;
    }
    if (hydIdx >= 0 && restIdx >= 0) {
      deduped.splice(Math.min(hydIdx, restIdx), 2, 'Hydration and rest advised.');
    }
    // Remove any remaining 'Hydration and rest advised.' duplicates (from Plan Assist note_text)
    for (var hri = deduped.length - 1; hri >= 0; hri--) {
      if (hri >= deduped.length) continue;
      if (normForDedup(deduped[hri]) === 'hydration and rest advised') {
        var count = 0;
        for (var ci = 0; ci < deduped.length; ci++) {
          if (normForDedup(deduped[ci]) === 'hydration and rest advised') count++;
        }
        if (count > 1) deduped.splice(hri, 1);
      }
    }

    // Process follow-up: strip periods, join, merge fragments
    var fupRaw = model.plan.followUp.map(function(s) { return s.replace(/\.\s*$/g, '').trim(); }).filter(Boolean);
    // Remove generic 'Follow-up arranged' if specific follow-up timing exists
    var hasSpecificFup = false;
    for (var fi = 0; fi < fupRaw.length; fi++) {
      if (/\d+\s+(day|week|month)/i.test(fupRaw[fi])) hasSpecificFup = true;
    }
    if (hasSpecificFup) {
      fupRaw = fupRaw.filter(function(s) { return !/^follow-up arranged$/i.test(s); });
    }
    // Deduplicate follow-up (case-insensitive)
    var fupSeen = {};
    var fupDeduped = [];
    for (var fdi = 0; fdi < fupRaw.length; fdi++) {
      var fk = fupRaw[fdi].toLowerCase().trim();
      if (!fk || fupSeen[fk]) continue;
      fupSeen[fk] = true;
      fupDeduped.push(fupRaw[fdi]);
    }
    // Assemble follow-up and normalize "sooner" phrasing.
    var fupText = fupDeduped.join(', ');
    fupText = fupText.replace(/^(\d+\s+\w+\s+if\s+not\s+improving),\s*(sooner\s+if\s+)/i, 'Follow-up in $1, or $2');
    fupText = fupText.replace(/^([a-z])/i, function(m, c) { return c.toUpperCase(); });
    fupText = fupText.replace(/,\s*or\s*([a-z])/i, function(m, c) { return ', or ' + c.toLowerCase(); });
    if (fupText && !/\.$/.test(fupText)) fupText += '.';
    if (fupText) deduped.push(fupText);

    return deduped.length ? deduped.join('\n') : '[not documented]';
  }

  function renderV4EMR(model) {
    var h = 'SHORT EMR NOTE\n' + '='.repeat(40) + '\n\n';
    var subj = renderSubjective(model);
    var obj = renderObjective(model);
    var ass = model.assessment.impression;
    var plan = renderPlan(model);
    h += 'History:\n' + subj + '\n\n';
    h += 'Examination / Investigations:\n' + obj + '\n\n';
    h += 'Assessment:\n' + ass + '\n\n';
    h += 'Plan:\n' + plan + '\n';
    return h + V4_FOOTER;
  }

  function renderV4SOAP(model) {
    var subj = renderSubjective(model);
    var obj = renderObjective(model);
    var ass = model.assessment.impression;
    var plan = renderPlan(model);
    return 'SOAP NOTE\n' + '='.repeat(40) + '\n\n' +
      'SUBJECTIVE:\n' + subj + '\n\n' +
      'OBJECTIVE:\n' + obj + '\n\n' +
      'ASSESSMENT:\n' + ass + '\n\n' +
      'PLAN:\n' + plan + '\n' + V4_FOOTER;
  }

  function renderV4Referral(model) {
    var subj = renderSubjective(model);
    var obj = renderObjective(model);
    var ass = model.assessment.impression;
    var plan = renderPlan(model);
    var hasReferralText = plan.toLowerCase().indexOf('refer') >= 0;
    var hasReferralAssess = ass.toLowerCase().indexOf('refer') >= 0;
    if (!hasReferralText && !hasReferralAssess) {
      return 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\nReferral draft: [not requested/documented]\n' + V4_FOOTER;
    }
    var r = 'REFERRAL DRAFT\n' + '='.repeat(40) + '\n\n';
    r += 'Reason for referral:\n' + subj + '\n\n';
    r += 'Clinical history:\n' + subj + '\n\n';
    r += 'Examination findings:\n' + obj + '\n\n';
    r += 'Current impression:\n' + ass + '\n\n';
    r += 'Plan / recommendations:\n' + plan + '\n\n';
    r += 'Please see and advise.\n';
    return r + V4_FOOTER;
  }

  function renderV4Instructions(model) {
    var plan = renderPlan(model);
    if (plan === '[not documented]') {
      return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n[not documented]\n' + V4_FOOTER;
    }
    return 'PATIENT INSTRUCTIONS\n' + '='.repeat(40) + '\n\n' +
      'Advice / plan discussed:\n' + plan + '\n\n' +
      'Review with your clinician. Seek medical attention if symptoms worsen.\n' + V4_FOOTER;
  }

  // ================================================================
  //  BUILD ADVANCED DRAFT (reads from V4_ENCOUNTER_STATE via collectRawState)
  // ================================================================
  function buildAdvancedDraft(tabId) {
    var raw = collectRawState();
    var model = normalizeV4SelectionsToNoteModel(raw);
    switch (tabId) {
      case 'adv-emr': return renderV4EMR(model);
      case 'adv-soap': return renderV4SOAP(model);
      case 'adv-ref': return renderV4Referral(model);
      case 'adv-inst': return renderV4Instructions(model);
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

      var calcIncluded = 0;
      var calcResults = state.calculatorResults || {};
      for (var calcId in calcResults) {
        if (calcResults[calcId] && calcResults[calcId].included) calcIncluded++;
      }
      h += '<div class="v4-si"><span class="v4-si-label">Calculator results:</span><span class="v4-si-val">' + calcIncluded + ' included</span></div>';
    }
    container.innerHTML = h;

  }

  // ================================================================
  //  WINDOW HANDLERS
  // ================================================================

  // Workflow
  window._v4SetSpecialty = function(spec) {
    state.selectedSpecialtyFilter = spec || '';
    renderStep(1);
    updateSidebar();
  };

  window._v4SearchWf = function(term) {
    state._wfSearchTerm = term;
    renderStep(1);
  };

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
    state.calculatorResults = {};

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
      var text = buildV4HistoryFromFields(state.historyFields, window.V4_ENCOUNTER_STATE.selectedChips.symptoms.concat(window.V4_ENCOUNTER_STATE.customEntries.symptoms));
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
    _currentTab = tabId;
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

  function v4CurrentOutputItem() {
    var textEl = document.getElementById('v4OutputText');
    var text = textEl ? textEl.textContent || '' : '';
    var labels = {
      'adv-emr': 'Advanced EMR note',
      'adv-soap': 'Advanced SOAP note',
      'adv-ref': 'Advanced referral draft',
      'adv-inst': 'Advanced patient instructions'
    };
    return {
      tab: _currentTab || 'adv-emr',
      label: labels[_currentTab] || 'Advanced encounter draft',
      text: text
    };
  }

  function v4ExportContext(item) {
    return {
      'Tool': 'Advanced Mode',
      'Output type': item.label,
      'Specialty': state.selectedWorkflowSpecialty || '[not selected]',
      'Workflow': state.selectedWorkflowDisplay || '[not selected]'
    };
  }

  function v4DateStamp() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  window._v4ExportTxt = function() {
    var item = v4CurrentOutputItem();
    if (!item.text || item.text.indexOf('Select all content') === 0) return;
    if (window.ClinicNoteExport && typeof window.ClinicNoteExport.exportTextFile === 'function') {
      var safeTab = item.tab.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
      window.ClinicNoteExport.exportTextFile('clinicnote-advanced-' + safeTab + '-' + v4DateStamp() + '.txt', item.label, item.text, v4ExportContext(item));
      return;
    }
    var blob = new Blob([item.text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'clinicnote-advanced-' + v4DateStamp() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  window._v4Print = function() {
    var item = v4CurrentOutputItem();
    if (!item.text || item.text.indexOf('Select all content') === 0) return;
    if (window.ClinicNoteExport && typeof window.ClinicNoteExport.printOutput === 'function') {
      window.ClinicNoteExport.printOutput(item.label, item.text, v4ExportContext(item));
      return;
    }
    var w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.write('<!doctype html><html><head><title>' + esc(item.label) + '</title><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;padding:24px}pre{white-space:pre-wrap;font-family:Consolas,monospace}</style></head><body><pre>' + esc(item.text) + '</pre></body></html>');
    w.document.close();
    w.focus();
    w.print();
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

    // Show only the Advanced Encounter page. Quick OPD Mode remains available on the clean site.
    var allPages = document.querySelectorAll('.page');
    for (var pi = 0; pi < allPages.length; pi++) {
      var pgId = allPages[pi].id;
      if (pgId === 'page-advanced-encounter') {
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
    loading.textContent = 'Loading Advanced Mode data...';
    app.appendChild(loading);

    loadV4Data().then(function() {
      app.removeChild(loading);
      renderApp();
    }).catch(function(err) {
      loading.textContent = 'Failed to load Advanced Mode data: ' + (err.message || 'unknown error');
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
.v4-wf-grid{display:grid;grid-template-columns:minmax(220px,0.8fr) minmax(260px,1.2fr);gap:12px;margin-bottom:12px}
.v4-wf-search{margin-bottom:12px}
.v4-count-pill{display:inline-block;margin-left:6px;padding:2px 7px;border-radius:999px;background:var(--gray-100);color:var(--gray-500);font-size:11px;font-weight:600}
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
.v4-chip-btn{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--gray-200);background:#fff;color:var(--gray-600);cursor:pointer;font-family:var(--font);transition:all .15s;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
.v4-chip-btn:hover{background:var(--primary-bg);border-color:var(--primary-border);color:var(--primary);transform:translateY(-1px);box-shadow:0 2px 6px rgba(0,0,0,0.08)}
.v4-chip-btn.active{background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 2px 8px rgba(0,0,0,0.15)}
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

.v4-chip-group-body{padding:10px 14px 14px}
.v4-custom-entry-row{display:flex;gap:6px;align-items:center;margin-top:4px}

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
.v4-calc-empty{font-size:13px;color:var(--gray-500);padding:14px 16px;background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px}
.v4-calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}
.v4-calc-card{background:#fff;border:1px solid var(--gray-200);border-radius:10px;padding:14px;box-shadow:0 1px 2px rgba(15,23,42,0.04)}
.v4-calc-name{font-size:15px;font-weight:700;color:var(--gray-800);margin-bottom:4px}
.v4-calc-desc{font-size:12px;color:var(--gray-500);line-height:1.45;margin-bottom:10px}
.v4-calc-inputs{display:grid;gap:8px}
.v4-calc-input-row{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--gray-700)}
.v4-calc-input-row label{font-weight:600;line-height:1.3}
.v4-calc-result{background:#f8fafc;border:1px solid var(--gray-200);border-radius:8px;padding:10px 12px;margin-top:10px;font-size:12px;line-height:1.5;color:var(--gray-800)}

.v4-output-tabs{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.v4-out-tab{padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid var(--gray-200);background:#fff;color:var(--gray-500);cursor:pointer;font-family:var(--font);transition:all .15s}
.v4-out-tab:hover{background:var(--gray-50)}
.v4-out-tab.active{background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 2px 8px rgba(0,0,0,0.12)}
.v4-output-box{background:#fbfdff;color:#0f172a;border:1px solid var(--gray-200);border-radius:10px;padding:20px;min-height:250px;max-height:600px;overflow:auto;margin-bottom:12px}
.v4-output-text{font-size:13px;font-family:var(--font-mono);white-space:pre-wrap;line-height:1.7;color:var(--gray-800)}
.v4-output-actions{display:flex;gap:10px;flex-wrap:wrap}

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

.v4-guidance{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--gray-600);line-height:1.6;text-align:center}
.v4-guidance-step{font-weight:600;color:var(--gray-700)}
.v4-guidance-arrow{color:var(--gray-400);margin:0 6px}
.v4-search-input{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:13px;font-family:var(--font);margin-bottom:8px}
.v4-search-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}

@media(max-width:768px){.v4-layout{grid-template-columns:1fr}.v4-sidebar{display:none}.v4-stepper{overflow-x:auto;font-size:10px}.v4-s-label{display:none}.v4-s-indicator{padding:10px 8px}.v4-step-content{padding:16px}.v4-step-h{font-size:17px}.v4-wf-grid{grid-template-columns:1fr}.v4-chip-btn{padding:5px 10px;font-size:11px}.v4-chip-group-header{font-size:11px}.v4-output-box{max-height:400px}.v4-output-text{font-size:12px;line-height:1.5}.v4-nav{padding:10px 14px;flex-wrap:wrap;gap:8px}.v4-guidance{font-size:11px;padding:8px 10px}.v4-guidance-arrow{display:none}.v4-guidance-step{display:block;padding:2px 0}.v4-output-tabs{gap:2px}.v4-out-tab{padding:8px 12px;font-size:11px}.v4-calc-grid{grid-template-columns:1fr}.v4-calc-input-row{align-items:flex-start;flex-direction:column}.v4-calc-input-row input,.v4-calc-input-row select{width:100%!important;margin-left:0!important}}
@media(max-width:480px){.v4-step-content{padding:12px}.v4-nav{padding:8px 10px}.v4-btn{padding:8px 14px;font-size:12px}.v4-output-actions .v4-btn{flex:1;justify-content:center}.v4-output-box{max-height:350px;padding:12px}.v4-output-text{font-size:11px}.v4-stepper{gap:2px}}
    `;
  }

})();
