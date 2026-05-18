(function() {
  "use strict";

  var templates = null;
  var templatesBySpecialty = {};
  var selectedSpecialty = "";
  var answers = {};
  var loadingStarted = false;
  var patched = false;

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    return params.get("v3") === "history-edit" && window.CLINICNOTE_DATA_MODE === "v2";
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
    return document.getElementById("v3HistoryEditPanel");
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
          p.classList.add("v3-edit-visible");
          p.style.display = "block";
          p.innerHTML = '<div class="v3-history-title">V3 Editable History Capture</div><div class="v3-history-safety">History templates could not be loaded. OPD note generation is unchanged.</div>';
        }
        console.warn("ClinicNote V3 editable history could not load local templates", error);
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

  function activeTemplate() {
    var current = resolveCurrentSpecialty();
    var active = current || selectedSpecialty;
    return findTemplateBySpecialty(active);
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

  function answerKey(section, prompt) {
    return (section.section_id || "section") + "__" + (prompt.prompt_id || "prompt");
  }

  function inputHtml(section, prompt) {
    var key = answerKey(section, prompt);
    var value = answers[key] || "";
    var type = prompt.input_type || "text";
    var label = escapeHtml(prompt.prompt_text || prompt.prompt_id || "History prompt");
    var html = '<div class="v3-edit-field">';
    html += '<label for="v3HistoryAnswer_' + escapeHtml(key) + '">' + label + '</label>';
    if (type === "textarea") {
      html += '<textarea id="v3HistoryAnswer_' + escapeHtml(key) + '" data-v3-history-answer="' + escapeHtml(key) + '" oninput="window.v3HistoryEditUpdate(this)">' + escapeHtml(value) + '</textarea>';
    } else if (type === "select" || type === "multi_select") {
      html += '<select id="v3HistoryAnswer_' + escapeHtml(key) + '" data-v3-history-answer="' + escapeHtml(key) + '" ' + (type === "multi_select" ? "multiple " : "") + 'onchange="window.v3HistoryEditUpdate(this)">';
      html += '<option value="">Not documented</option>';
      var values = prompt.values || [];
      for (var i = 0; i < values.length; i++) {
        var option = String(values[i]);
        var selected = type === "multi_select" ? String(value).split(" | ").indexOf(option) >= 0 : value === option;
        html += '<option value="' + escapeHtml(option) + '"' + (selected ? " selected" : "") + ">" + escapeHtml(option) + "</option>";
      }
      html += '</select>';
    } else if (type === "boolean") {
      html += '<select id="v3HistoryAnswer_' + escapeHtml(key) + '" data-v3-history-answer="' + escapeHtml(key) + '" onchange="window.v3HistoryEditUpdate(this)">';
      html += '<option value="">Not documented</option><option value="Yes"' + (value === "Yes" ? " selected" : "") + '>Yes</option><option value="No"' + (value === "No" ? " selected" : "") + '>No</option>';
      html += '</select>';
    } else {
      var inputType = type === "number" || type === "date" ? type : "text";
      html += '<input id="v3HistoryAnswer_' + escapeHtml(key) + '" type="' + inputType + '" data-v3-history-answer="' + escapeHtml(key) + '" value="' + escapeHtml(value) + '" oninput="window.v3HistoryEditUpdate(this)">';
    }
    html += '<div class="v3-history-prompt-meta"><span class="v3-history-label">' + escapeHtml(prompt.required_level || "optional") + '</span><span class="v3-history-label">' + escapeHtml(type) + '</span></div>';
    if (prompt.warning) html += '<div class="v3-history-warning">' + escapeHtml(prompt.warning) + '</div>';
    html += '</div>';
    return html;
  }

  function detectIdentifier(text) {
    if (!text || !text.trim()) return false;
    if (typeof window.detectReportPHI === "function" && window.detectReportPHI(text)) return true;
    if (typeof window.detectPHI === "function" && window.detectPHI(text)) return true;
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
    for (var key in answers) {
      if (Object.prototype.hasOwnProperty.call(answers, key) && detectIdentifier(answers[key])) found = true;
    }
    var warning = document.getElementById("v3HistoryEditPhiWarning");
    if (warning) warning.classList.toggle("show", found);
    return found;
  }

  function buildDraft() {
    var template = activeTemplate();
    if (!template) return "";
    var lines = ["History draft preview", "Specialty: " + (template.specialty_name || template.specialty_id), ""];
    var sections = (template.sections || []).slice().sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var sectionLines = [];
      var prompts = section.prompts || [];
      for (var p = 0; p < prompts.length; p++) {
        var prompt = prompts[p];
        var value = (answers[answerKey(section, prompt)] || "").trim();
        if (value) sectionLines.push((prompt.prompt_text || prompt.prompt_id || "Prompt") + ": " + value);
      }
      if (sectionLines.length) {
        lines.push(section.section_label || section.section_id || "Section");
        lines = lines.concat(sectionLines);
        lines.push("");
      }
    }
    lines.push("History capture is a temporary browser-only draft. Review and edit before use.");
    return lines.join("\n").trim();
  }

  function updateDraftPreview() {
    updatePhiWarning();
    var box = document.getElementById("v3HistoryDraftPreview");
    if (box) box.textContent = buildDraft() || "History draft preview will appear here as answers are entered.";
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
      p.innerHTML = '<div class="v3-history-title">V3 Editable History Capture</div><div class="v3-history-status">Loading history capture prototype...</div>';
      loadTemplates(render);
      return;
    }

    var currentSpecialty = resolveCurrentSpecialty();
    var template = findTemplateBySpecialty(currentSpecialty || selectedSpecialty);
    var activeId = template ? template.specialty_id : selectedSpecialty;
    if (currentSpecialty && template) selectedSpecialty = template.specialty_id;

    var html = '<div class="v3-history-header"><div><div class="v3-history-title">V3 Editable History Capture Prototype</div><div class="v3-history-subtitle">History capture is a temporary browser-only draft. It is not used to generate the OPD note.</div></div></div>';
    html += '<div class="v3-history-safety">History capture is a temporary browser-only draft. Do not enter patient identifiers. This does not diagnose, recommend treatment, or replace clinician judgment.</div>';
    html += '<div id="v3HistoryEditPhiWarning" class="phi-warning">Possible patient-identifiable information detected. Remove identifiers before copying or using this draft.</div>';
    html += '<div class="v3-history-controls"><label for="v3HistoryEditSpecialtySelect">History specialty</label><select id="v3HistoryEditSpecialtySelect" onchange="window.v3HistoryEditSelectSpecialty(this.value)">' + buildSpecialtyOptions(activeId) + '</select></div>';

    if (!template) {
      html += '<div class="v3-history-status">Select a workflow or choose a V3 specialty to start a temporary history draft.</div>';
      html += '<div class="v3-edit-actions"><button class="btn btn-outline btn-sm" type="button" onclick="window.v3HistoryEditClear()">Clear History Answers</button></div>';
      html += '<div id="v3HistoryDraftPreview" class="v3-edit-preview">History draft preview will appear here as answers are entered.</div>';
      p.classList.add("v3-edit-visible");
      p.style.display = "block";
      p.innerHTML = html;
      return;
    }

    var sections = (template.sections || []).slice().sort(function(a, b) { return (a.display_order || 0) - (b.display_order || 0); });
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var prompts = section.prompts || [];
      html += '<details class="v3-history-section">';
      html += '<summary>' + escapeHtml(section.section_label || section.section_id || "History section") + ' <span class="v3-history-label">' + prompts.length + ' prompts</span></summary>';
      html += '<div class="v3-history-section-body">';
      if (section.safety_note) html += '<div class="v3-history-section-note">' + escapeHtml(section.safety_note) + '</div>';
      for (var pIndex = 0; pIndex < prompts.length; pIndex++) html += inputHtml(section, prompts[pIndex]);
      html += '</div></details>';
    }

    html += '<div class="v3-edit-actions"><button class="btn btn-primary btn-sm" type="button" onclick="window.v3HistoryEditCopy()">Copy History Draft</button><button class="btn btn-outline btn-sm" type="button" onclick="window.v3HistoryEditClear()">Clear History Answers</button></div>';
    html += '<div class="v3-history-title">History draft preview</div><div id="v3HistoryDraftPreview" class="v3-edit-preview"></div>';
    p.classList.add("v3-edit-visible");
    p.style.display = "block";
    p.innerHTML = html;
    updateDraftPreview();
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

  function init() {
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    patchWorkflowFunctions();
    loadTemplates(render);
  }

  window.v3HistoryEditSelectSpecialty = function(specialtyId) {
    selectedSpecialty = specialtyId || "";
    answers = {};
    render();
  };

  window.v3HistoryEditUpdate = function(el) {
    var key = el.getAttribute("data-v3-history-answer");
    if (!key) return;
    if (el.multiple) {
      var selected = [];
      for (var i = 0; i < el.options.length; i++) if (el.options[i].selected && el.options[i].value) selected.push(el.options[i].value);
      answers[key] = selected.join(" | ");
    } else {
      answers[key] = String(el.value || "").trim();
    }
    updateDraftPreview();
  };

  window.v3HistoryEditClear = function() {
    answers = {};
    render();
  };

  window.v3HistoryEditCopy = function() {
    var draft = buildDraft();
    if (!draft) return;
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

  window.ClinicNoteV3HistoryEdit = {
    isEnabled: isEnabled,
    render: render,
    clear: function() { answers = {}; render(); },
    getDraft: buildDraft
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", render);
})();
