(function() {
  "use strict";

  var templates = null;
  var templatesBySpecialty = {};
  var selectedSpecialty = "";
  var selectedPrompts = {};
  var loadingStarted = false;
  var patched = false;

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    var mode = params.get("v3");
    return (mode === "plan-edit" || mode === "workbench") && window.CLINICNOTE_DATA_MODE === "v2";
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

  function panel() {
    return document.getElementById("v3PlanEditPanel");
  }

  function hidePanel() {
    var p = panel();
    if (!p) return;
    p.classList.remove("v3-edit-visible");
    p.style.display = "none";
    p.innerHTML = "";
  }

  function indexTemplates(list) {
    templatesBySpecialty = {};
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item) continue;
      templatesBySpecialty[item.specialty_id] = item;
      templatesBySpecialty[item.specialty_name] = item;
      templatesBySpecialty[normalize(item.specialty_id)] = item;
      templatesBySpecialty[normalize(item.specialty_name)] = item;
    }
  }

  function loadTemplates(callback) {
    if (templates) {
      callback();
      return;
    }
    if (loadingStarted) {
      setTimeout(function() { loadTemplates(callback); }, 80);
      return;
    }
    loadingStarted = true;
    fetch("./data/v3_plan_prompt_templates.json", { cache: "no-store" })
      .then(function(response) {
        if (!response.ok) throw new Error("V3 plan template request failed");
        return response.json();
      })
      .then(function(data) {
        templates = Array.isArray(data) ? data : [];
        indexTemplates(templates);
        callback();
      })
      .catch(function(error) {
        var p = panel();
        if (p && isEnabled()) {
          p.classList.add("v3-edit-visible");
          p.style.display = "block";
          p.innerHTML = '<div class="v3-history-title">V3 Plan Checklist Prototype</div><div class="v3-history-safety">Plan templates could not be loaded. OPD note generation is unchanged.</div>';
        }
        console.warn("ClinicNote V3 plan checklist could not load local templates", error);
      });
  }

  function findTemplateBySpecialty(specialtyName) {
    if (!specialtyName) return null;
    return templatesBySpecialty[specialtyName] || templatesBySpecialty[normalize(specialtyName)] || null;
  }

  function resolveCurrentWorkflow() {
    var visitSelect = document.getElementById("speedVisitType");
    var visitName = visitSelect ? visitSelect.value : "";
    var specKey = window.currentSpecialty || "";
    if (typeof window.v2resolveSelectedWorkflow === "function" && visitName && specKey) {
      return window.v2resolveSelectedWorkflow(specKey, visitName);
    }
    return null;
  }

  function resolveCurrentSpecialty() {
    var resolved = resolveCurrentWorkflow();
    if (resolved && resolved.specialty) return resolved.specialty.display_name || resolved.specialty.specialty_id || "";
    var specSelect = document.getElementById("speedSpecialty");
    if (specSelect && specSelect.value) return specSelect.value;
    return "";
  }

  function activeWorkflowId() {
    var resolved = resolveCurrentWorkflow();
    return resolved && resolved.workflow_id ? resolved.workflow_id : "";
  }

  function filterSections(template, workflowId) {
    var sections = template && template.plan_sections ? template.plan_sections.slice() : [];
    if (!workflowId) return sections;
    var matched = [];
    for (var i = 0; i < sections.length; i++) {
      var ids = sections[i].applicable_workflow_ids || [];
      if (!ids.length || ids.indexOf(workflowId) >= 0) matched.push(sections[i]);
    }
    return matched.length ? matched : sections;
  }

  function activeTemplate() {
    return findTemplateBySpecialty(resolveCurrentSpecialty() || selectedSpecialty);
  }

  function promptKey(section, prompt) {
    return (section.section_id || "section") + "__" + (prompt.prompt_id || "prompt");
  }

  function buildSpecialtyOptions(activeSpecialty) {
    var html = '<option value="">Select V3 specialty</option>';
    var list = templates || [];
    for (var i = 0; i < list.length; i++) {
      var id = list[i].specialty_id;
      html += '<option value="' + escapeHtml(id) + '"' + (id === activeSpecialty ? " selected" : "") + ">" + escapeHtml(list[i].specialty_name || id) + "</option>";
    }
    return html;
  }

  function selectedLines() {
    var template = activeTemplate();
    if (!template) return [];
    var lines = [];
    var sections = filterSections(template, activeWorkflowId()).sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var prompts = section.prompts || [];
      var sectionLines = [];
      for (var p = 0; p < prompts.length; p++) {
        var prompt = prompts[p];
        if (selectedPrompts[promptKey(section, prompt)]) sectionLines.push(prompt.prompt_text || prompt.prompt_id || "");
      }
      if (sectionLines.length) {
        lines.push(section.section_label || section.section_id || "Plan section");
        lines = lines.concat(sectionLines);
        lines.push("");
      }
    }
    return lines;
  }

  function buildDraft() {
    var template = activeTemplate();
    if (!template) return "";
    var lines = ["Plan documentation draft preview", "Specialty: " + (template.specialty_name || template.specialty_id), ""].concat(selectedLines());
    lines.push("Plan prompts document clinician-entered decisions only. They do not recommend treatment.");
    return lines.join("\n").trim();
  }

  function updatePreview() {
    var box = document.getElementById("v3PlanDraftPreview");
    if (box) box.textContent = selectedLines().length ? buildDraft() : "Plan documentation draft preview will appear here as prompts are selected.";
  }

  function render() {
    var p = panel();
    if (!p) return;
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    if (!templates) {
      p.classList.add("v3-edit-visible");
      p.style.display = "block";
      p.innerHTML = '<div class="v3-history-title">V3 Plan Checklist Prototype</div><div class="v3-history-status">Loading plan checklist prototype...</div>';
      loadTemplates(render);
      return;
    }

    var currentSpecialty = resolveCurrentSpecialty();
    var template = findTemplateBySpecialty(currentSpecialty || selectedSpecialty);
    var activeId = template ? template.specialty_id : selectedSpecialty;
    if (currentSpecialty && template) selectedSpecialty = template.specialty_id;
    var workflowId = activeWorkflowId();

    var html = '<div class="v3-history-header"><div><div class="v3-history-title">V3 Plan Documentation Checklist Prototype</div><div class="v3-history-subtitle">Temporary checklist only. It is not used to generate the OPD note.</div></div></div>';
    html += '<div class="v3-history-safety">Plan prompts document clinician-entered decisions only. Select only what the clinician decided or discussed. They do not recommend treatment.</div>';
    html += '<div class="v3-history-controls"><label for="v3PlanEditSpecialtySelect">Plan specialty</label><select id="v3PlanEditSpecialtySelect" onchange="window.v3PlanEditSelectSpecialty(this.value)">' + buildSpecialtyOptions(activeId) + '</select></div>';

    if (!template) {
      html += '<div class="v3-history-status">Select a workflow or choose a V3 specialty to preview plan documentation prompts.</div>';
    } else {
      var sections = filterSections(template, workflowId).sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var prompts = section.prompts || [];
        html += '<details class="v3-history-section">';
        html += '<summary>' + escapeHtml(section.section_label || section.section_id || "Plan section") + ' <span class="v3-history-label">' + prompts.length + ' prompts</span></summary>';
        html += '<div class="v3-history-section-body">';
        if (section.safety_note) html += '<div class="v3-history-section-note">' + escapeHtml(section.safety_note) + '</div>';
        for (var pIndex = 0; pIndex < prompts.length; pIndex++) {
          var prompt = prompts[pIndex];
          var key = promptKey(section, prompt);
          html += '<label class="v3-edit-field" style="grid-template-columns:auto 1fr;align-items:flex-start">';
          html += '<input type="checkbox" data-v3-plan-prompt="' + escapeHtml(key) + '" onchange="window.v3PlanEditToggle(this)"' + (selectedPrompts[key] ? " checked" : "") + '>';
          html += '<span><strong>' + escapeHtml(prompt.prompt_text || prompt.prompt_id || "") + '</strong><br><span class="v3-history-label">' + escapeHtml(prompt.required_level || "optional") + '</span> <span class="v3-history-label">' + escapeHtml(prompt.prompt_type || "documentation") + '</span></span>';
          html += '</label>';
        }
        html += '</div></details>';
      }
    }

    html += '<div class="v3-edit-actions"><button class="btn btn-primary btn-sm" type="button" onclick="window.v3PlanEditCopy()">Copy Draft</button><button class="btn btn-outline btn-sm" type="button" onclick="window.v3PlanEditClear()">Clear Selected Prompts</button></div>';
    html += '<div class="v3-history-title">Plan documentation draft preview</div><div id="v3PlanDraftPreview" class="v3-edit-preview"></div>';
    p.classList.add("v3-edit-visible");
    p.style.display = "block";
    p.innerHTML = html;
    updatePreview();
  }

  function patchWorkflowFunctions() {
    if (patched) return;
    if (typeof window.loadSpeedVisit !== "function" || typeof window.loadSpeedSpecialty !== "function") {
      setTimeout(patchWorkflowFunctions, 80);
      return;
    }
    patched = true;
    var originalVisit = window.loadSpeedVisit;
    window.loadSpeedVisit = function() {
      var result = originalVisit.apply(this, arguments);
      selectedPrompts = {};
      setTimeout(render, 0);
      return result;
    };
    var originalSpecialty = window.loadSpeedSpecialty;
    window.loadSpeedSpecialty = function() {
      var result = originalSpecialty.apply(this, arguments);
      selectedPrompts = {};
      setTimeout(render, 0);
      return result;
    };
  }

  function init() {
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    patchWorkflowFunctions();
    loadTemplates(render);
  }

  window.v3PlanEditSelectSpecialty = function(specialtyId) {
    selectedSpecialty = specialtyId || "";
    selectedPrompts = {};
    render();
  };

  window.v3PlanEditToggle = function(el) {
    var key = el.getAttribute("data-v3-plan-prompt");
    if (!key) return;
    if (el.checked) selectedPrompts[key] = true;
    else delete selectedPrompts[key];
    updatePreview();
  };

  window.v3PlanEditClear = function() {
    selectedPrompts = {};
    render();
  };

  window.v3PlanEditCopy = function() {
    var draft = buildDraft();
    if (!selectedLines().length) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(draft).catch(function() {});
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = draft;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  window.ClinicNoteV3PlanEdit = {
    isEnabled: isEnabled,
    render: render,
    clear: function() { selectedPrompts = {}; render(); },
    getDraft: buildDraft
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("load", render);
})();
