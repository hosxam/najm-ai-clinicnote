(function() {
  "use strict";

  var mappings = null;
  var mappingsByWorkflow = {};
  var loadingStarted = false;
  var patched = false;

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    var mode = params.get("v3");
    return (mode === "calculators" || mode === "all") && window.CLINICNOTE_DATA_MODE === "v2";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function panel() {
    return document.getElementById("v3CalculatorSuggestionsPanel");
  }

  function hidePanel() {
    var p = panel();
    if (!p) return;
    p.classList.remove("v3-calculator-visible");
    p.style.display = "none";
    p.innerHTML = "";
  }

  function indexMappings(list) {
    mappingsByWorkflow = {};
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item && item.workflow_id) mappingsByWorkflow[item.workflow_id] = item;
    }
  }

  function loadMappings(callback) {
    if (mappings) {
      callback();
      return;
    }
    if (loadingStarted) {
      setTimeout(function() { loadMappings(callback); }, 80);
      return;
    }
    loadingStarted = true;
    fetch("./data/v3_calculator_workflow_map.json", { cache: "no-store" })
      .then(function(response) {
        if (!response.ok) throw new Error("V3 calculator mapping request failed");
        return response.json();
      })
      .then(function(data) {
        mappings = Array.isArray(data) ? data : [];
        indexMappings(mappings);
        callback();
      })
      .catch(function(error) {
        var p = panel();
        if (p && isEnabled()) {
          p.classList.add("v3-calculator-visible");
          p.style.display = "block";
          p.innerHTML =
            '<div class="v3-history-title">V3 Calculator Suggestions Preview</div>' +
            '<div class="v3-history-safety">Calculator mappings could not be loaded. OPD note generation is unchanged.</div>';
        }
        console.warn("ClinicNote V3 calculator suggestions could not load local mappings", error);
      });
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

  function implementedLowRiskSuggestions(mapping) {
    var list = mapping && Array.isArray(mapping.suggested_calculators) ? mapping.suggested_calculators : [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i] || {};
      if (item.implementation_status === "implemented" && item.risk_level === "low") out.push(item);
    }
    out.sort(function(a, b) { return (a.display_priority || 99) - (b.display_priority || 99); });
    return out;
  }

  function renderHeader(statusText) {
    return (
      '<div class="v3-history-header">' +
        '<div>' +
          '<div class="v3-history-title">V3 Calculator Suggestions Preview</div>' +
          '<div class="v3-history-subtitle">Preview-only optional calculator suggestions. Not inserted into notes.</div>' +
        '</div>' +
      '</div>' +
      '<div class="v3-history-safety">Optional related calculator. Use only if clinically relevant. Clinician-entered values only. Suggestions do not diagnose, recommend treatment, or replace clinician judgment.</div>' +
      '<div class="v3-history-status">' + escapeHtml(statusText || "") + '</div>'
    );
  }

  function renderSuggestions(mapping, suggestions, workflowId) {
    var html = renderHeader("Matched workflow: " + (mapping.workflow_display_name || workflowId) + " (" + workflowId + ").");
    if (!suggestions.length) {
      html += '<div class="v3-history-status">No implemented low-risk calculator suggestions are available for this workflow yet. High-risk registry-only placeholders are intentionally hidden.</div>';
      return html;
    }
    html += '<div class="v3-history-prompts">';
    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      html += '<div class="v3-history-section" style="padding:10px 12px">';
      html += '<div class="v3-history-title">' + escapeHtml(suggestion.calculator_name || suggestion.calculator_id) + '</div>';
      html += '<div class="v3-history-section-note">' + escapeHtml(suggestion.relevance_reason || "") + '</div>';
      html += '<div class="v3-history-prompt-meta">';
      html += '<span class="v3-history-label">optional</span>';
      html += '<span class="v3-history-label">low risk</span>';
      html += '<span class="v3-history-label">implemented</span>';
      html += '</div>';
      if (suggestion.trigger_context) html += '<div class="v3-history-warning">' + escapeHtml(suggestion.trigger_context) + '</div>';
      if (suggestion.safety_note) html += '<div class="v3-history-section-note" style="margin-top:8px">' + escapeHtml(suggestion.safety_note) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function render() {
    var p = panel();
    if (!p) return;
    if (!isEnabled()) {
      hidePanel();
      return;
    }
    if (!mappings) {
      p.classList.add("v3-calculator-visible");
      p.style.display = "block";
      p.innerHTML = '<div class="v3-history-title">V3 Calculator Suggestions Preview</div><div class="v3-history-status">Loading calculator mapping preview...</div>';
      loadMappings(render);
      return;
    }

    var resolved = resolveCurrentWorkflow();
    var workflowId = resolved && resolved.workflow_id ? resolved.workflow_id : "";
    p.classList.add("v3-calculator-visible");
    p.style.display = "block";

    if (!workflowId) {
      p.innerHTML = renderHeader("Select a workflow to preview optional low-risk calculator suggestions.");
      return;
    }

    var mapping = mappingsByWorkflow[workflowId];
    if (!mapping) {
      p.innerHTML = renderHeader("No calculator mapping exists for this workflow yet.");
      return;
    }

    p.innerHTML = renderSuggestions(mapping, implementedLowRiskSuggestions(mapping), workflowId);
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
    if (spec && !spec.getAttribute("data-v3-calculator-bound")) {
      spec.setAttribute("data-v3-calculator-bound", "true");
      spec.addEventListener("change", function() { setTimeout(render, 0); });
    }
    if (visit && !visit.getAttribute("data-v3-calculator-bound")) {
      visit.setAttribute("data-v3-calculator-bound", "true");
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
    loadMappings(render);
  }

  window.ClinicNoteV3CalculatorSuggestions = {
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
