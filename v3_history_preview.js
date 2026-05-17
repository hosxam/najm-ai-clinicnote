(function() {
  "use strict";

  var templates = null;
  var templatesBySpecialty = {};
  var selectedPreviewSpecialty = "";
  var loadingStarted = false;
  var patched = false;

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    return params.get("v3") === "history" && window.CLINICNOTE_DATA_MODE === "v2";
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
    return document.getElementById("v3HistoryPreviewPanel");
  }

  function hidePanel() {
    var p = panel();
    if (!p) return;
    p.classList.remove("v3-history-visible");
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
    fetch("./data/v3_specialty_history_templates.json", { cache: "no-store" })
      .then(function(response) {
        if (!response.ok) throw new Error("V3 history template request failed");
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
          p.classList.add("v3-history-visible");
          p.style.display = "block";
          p.innerHTML =
            '<div class="v3-history-title">V3 Specialty History Prompts Preview</div>' +
            '<div class="v3-history-safety">History prompts could not be loaded. OPD note generation is unchanged.</div>';
        }
        console.warn("ClinicNote V3 history preview could not load local templates", error);
      });
  }

  function findTemplateBySpecialty(specialtyName) {
    if (!specialtyName) return null;
    return templatesBySpecialty[specialtyName] || templatesBySpecialty[normalize(specialtyName)] || null;
  }

  function resolveCurrentSpecialty() {
    var visitSelect = document.getElementById("speedVisitType");
    var visitName = visitSelect ? visitSelect.value : "";
    var specKey = window.currentSpecialty || "";

    if (typeof window.v2resolveSelectedWorkflow === "function" && visitName && specKey) {
      var resolved = window.v2resolveSelectedWorkflow(specKey, visitName);
      if (resolved && resolved.specialty) {
        return resolved.specialty.display_name || resolved.specialty.specialty_id || specKey;
      }
      if (resolved && resolved.workflow && resolved.workflow.specialty) return resolved.workflow.specialty;
    }

    var specSelect = document.getElementById("speedSpecialty");
    if (specSelect && specSelect.value) return specSelect.value;
    return "";
  }

  function buildSpecialtyOptions(activeSpecialty) {
    var html = '<option value="">Select V3 specialty to preview</option>';
    var list = templates || [];
    for (var i = 0; i < list.length; i++) {
      var id = list[i].specialty_id;
      html += '<option value="' + escapeHtml(id) + '"' + (id === activeSpecialty ? " selected" : "") + ">" + escapeHtml(list[i].specialty_name || id) + "</option>";
    }
    return html;
  }

  function renderHeader(activeSpecialty, statusText) {
    return (
      '<div class="v3-history-header">' +
        '<div>' +
          '<div class="v3-history-title">V3 Specialty History Prompts Preview</div>' +
          '<div class="v3-history-subtitle">Preview-only documentation prompts. Not used to generate the note yet.</div>' +
        '</div>' +
      '</div>' +
      '<div class="v3-history-safety">Use only de-identified information. History prompts are documentation support only. They do not diagnose, recommend treatment, or replace clinician judgment.</div>' +
      '<div class="v3-history-controls">' +
        '<label for="v3HistorySpecialtySelect">Preview specialty</label>' +
        '<select id="v3HistorySpecialtySelect" onchange="window.v3HistoryPreviewSelectSpecialty(this.value)">' +
          buildSpecialtyOptions(activeSpecialty) +
        '</select>' +
      '</div>' +
      '<div class="v3-history-status">' + escapeHtml(statusText || "") + '</div>'
    );
  }

  function renderTemplate(template, activeSpecialty, statusText) {
    var html = renderHeader(activeSpecialty, statusText);
    var sections = template && template.sections ? template.sections.slice() : [];
    sections.sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    if (!sections.length) {
      html += '<div class="v3-history-status">No sections available in this draft template.</div>';
      return html;
    }

    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var prompts = section.prompts || [];
      html += '<details class="v3-history-section">';
      html += '<summary>' + escapeHtml(section.section_label || section.section_id || "History section") + ' <span class="v3-history-label">' + prompts.length + ' prompts</span></summary>';
      html += '<div class="v3-history-section-body">';
      if (section.safety_note) html += '<div class="v3-history-section-note">' + escapeHtml(section.safety_note) + '</div>';
      html += '<ul class="v3-history-prompts">';
      for (var p = 0; p < prompts.length; p++) {
        var prompt = prompts[p];
        html += '<li>';
        html += '<div>' + escapeHtml(prompt.prompt_text || prompt.prompt_id || "") + '</div>';
        html += '<div class="v3-history-prompt-meta">';
        html += '<span class="v3-history-label">' + escapeHtml(prompt.required_level || "optional") + '</span>';
        if (prompt.input_type) html += '<span class="v3-history-label">' + escapeHtml(prompt.input_type) + '</span>';
        html += '</div>';
        if (prompt.warning) html += '<div class="v3-history-warning">' + escapeHtml(prompt.warning) + '</div>';
        html += '</li>';
      }
      html += '</ul></div></details>';
    }
    return html;
  }

  function render() {
    var p = panel();
    if (!p) return;
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    if (!templates) {
      p.classList.add("v3-history-visible");
      p.style.display = "block";
      p.innerHTML = '<div class="v3-history-title">V3 Specialty History Prompts Preview</div><div class="v3-history-status">Loading preview prompts...</div>';
      loadTemplates(render);
      return;
    }

    var currentSpecialty = resolveCurrentSpecialty();
    var activeSpecialty = currentSpecialty || selectedPreviewSpecialty;
    var template = findTemplateBySpecialty(activeSpecialty);
    var status = "";

    if (currentSpecialty && template) {
      activeSpecialty = template.specialty_id;
      selectedPreviewSpecialty = activeSpecialty;
      status = "Matched to selected specialty: " + (template.specialty_name || template.specialty_id) + ".";
    } else if (selectedPreviewSpecialty) {
      template = findTemplateBySpecialty(selectedPreviewSpecialty);
      activeSpecialty = template ? template.specialty_id : selectedPreviewSpecialty;
      status = template ? "Previewing selected V3 specialty: " + (template.specialty_name || template.specialty_id) + "." : "";
    } else {
      status = "Select a workflow or choose a V3 specialty to preview history prompts.";
    }

    p.classList.add("v3-history-visible");
    p.style.display = "block";

    if (!template) {
      p.innerHTML = renderHeader(activeSpecialty, currentSpecialty ? "No V3 history template available for this specialty yet." : status);
      return;
    }
    p.innerHTML = renderTemplate(template, activeSpecialty, status);
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
      setTimeout(render, 0);
      return result;
    };
    var originalSpecialty = window.loadSpeedSpecialty;
    window.loadSpeedSpecialty = function() {
      var result = originalSpecialty.apply(this, arguments);
      setTimeout(render, 0);
      return result;
    };
  }

  function bindFallbackEvents() {
    var spec = document.getElementById("speedSpecialty");
    var visit = document.getElementById("speedVisitType");
    if (spec && !spec.getAttribute("data-v3-history-bound")) {
      spec.setAttribute("data-v3-history-bound", "true");
      spec.addEventListener("change", function() { setTimeout(render, 0); });
    }
    if (visit && !visit.getAttribute("data-v3-history-bound")) {
      visit.setAttribute("data-v3-history-bound", "true");
      visit.addEventListener("change", function() { setTimeout(render, 0); });
    }
  }

  function init() {
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    bindFallbackEvents();
    patchWorkflowFunctions();
    loadTemplates(render);
  }

  window.v3HistoryPreviewSelectSpecialty = function(specialtyId) {
    selectedPreviewSpecialty = specialtyId || "";
    render();
  };

  window.ClinicNoteV3HistoryPreview = {
    isEnabled: isEnabled,
    render: render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", function() {
    bindFallbackEvents();
    render();
  });
})();
