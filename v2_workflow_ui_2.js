// ---- V2 Workflow UI Improvements (behind feature flag) ----

// Init function to show v2 UI elements
function v2showSearchUI() {
  var v2sa = document.getElementById("v2SearchArea");
  if (window.CLINICNOTE_DATA_MODE !== "v2") {
    if (v2sa) v2sa.style.display = "none";
    var af = document.getElementById("v2AutofillControls");
    if (af) af.style.display = "none";
    return;
  }

  // Show v2 search area above specialty/visit selectors. Keep this
  // independent from the chip renderer so search and chips cannot
  // overwrite each other.
  if (!v2sa) {
    v2sa = document.createElement("div");
    v2sa.id = "v2SearchArea";
  }

  if (!v2getSearchInput()) {
    v2sa.innerHTML =
      '<div style="background:var(--white);border:2px solid var(--primary);border-radius:var(--radius-xl);padding:18px;margin-bottom:16px">' +
      '<div style="font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:8px">Search complaint or diagnosis</div>' +
      '<input id="v2WorkflowSearchInput" type="text" placeholder="Try: fever, diabetes, back pain, red eye, antenatal, anxiety, pediatric fever, rash, ear pain" style="width:100%;padding:11px 14px;border:2px solid var(--gray-300);border-radius:10px;font-size:14px;font-family:inherit;margin-bottom:6px" oninput="v2searchComplaint(this.value)">' +
      '<div style="font-size:10px;color:var(--gray-400);margin-bottom:4px">Search selects the workflow. It does not search individual chips.</div>' +
      '<div id="v2SearchResults" style="display:none;background:#fff;border:1px solid var(--gray-300);border-radius:10px;padding:6px;margin-top:2px;max-height:280px;overflow-y:auto;font-size:13px;box-shadow:var(--shadow-md)"></div>' +
      '</div>';
  }

  var smBox = document.querySelector(".speed-mode-box");
  if (smBox && smBox.parentNode && v2sa.nextSibling !== smBox) {
    smBox.parentNode.insertBefore(v2sa, smBox);
  }
  v2sa.style.display = "block";
  v2ensureAutofillControls();

  // Show v2 features within speed content (history prompts, etc.)
  var v2f = document.getElementById("v2Features");
  if (v2f) v2f.style.display = "block";
  v2ensureSpeedPresetModeMarker();
  v2preloadSpeedPresets();
}

// Run now (if DOM is ready) and also after DOMContentLoaded as fallback
v2showSearchUI();
if (document.readyState !== "complete") {
  document.addEventListener("DOMContentLoaded", v2showSearchUI);
}
window.addEventListener("load", v2showSearchUI);

function v2getSearchInput() {
  return document.getElementById("v2WorkflowSearchInput") || document.getElementById("v2Search");
}

function toggleCollapse(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "block" ? "none" : "block";
}

// ---- V2 Workflow Search ----
function v2searchComplaint(query) {
  var container = document.getElementById("v2SearchResults");
  if (!container) return;
  query = query.trim().toLowerCase();
  if (!query || query.length < 2) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }
  var v2data = window.NAJM_CLINICAL_DATA;
  if (!v2data || !v2data.diagnosisIndex) {
    container.style.display = "none";
    return;
  }
  var results = [];
  var seenIds = {};
  // Search diagnosisIndex
  var di = v2data.diagnosisIndex || [];
  for (var i = 0; i < di.length; i++) {
    var entry = di[i];
    var label = (entry.label || "").toLowerCase();
    var aliases = entry.aliases || [];
    var matchLabel = label.indexOf(query) >= 0;
    var matchAlias = false;
    for (var a = 0; a < aliases.length; a++) {
      if (aliases[a].toLowerCase().indexOf(query) >= 0) { matchAlias = true; break; }
    }
    if (matchLabel || matchAlias) {
      var wfIds = entry.workflow_ids || [];
      for (var w = 0; w < wfIds.length; w++) {
        if (!seenIds[wfIds[w]]) {
          seenIds[wfIds[w]] = true;
          results.push({ workflow_id: wfIds[w], match: entry.label });
        }
      }
    }
  }
  // Also search workflow display_names in specialties
  for (var si = 0; si < (v2data.specialties || []).length; si++) {
    var spec = v2data.specialties[si];
    var specName = spec.display_name || spec.specialty_id || "";
    var wfs = spec.workflows || [];
    for (var wi = 0; wi < wfs.length; wi++) {
      var wf = wfs[wi];
      var dn = (wf.display_name || "").toLowerCase();
      var cc = (wf.chief_complaint || "").toLowerCase();
      var dx = (wf.diagnosis || "").toLowerCase();
      if (dn.indexOf(query) >= 0 || cc.indexOf(query) >= 0 || dx.indexOf(query) >= 0) {
        if (!seenIds[wf.workflow_id]) {
          seenIds[wf.workflow_id] = true;
          results.push({ workflow_id: wf.workflow_id, match: wf.display_name });
        }
      }
    }
  }
  // Display results
  if (results.length === 0) {
    container.innerHTML = "<div style='padding:6px 8px;color:var(--gray-400);font-style:italic'>No matching workflow found. Try a broader complaint term.</div>";
    container.style.display = "block";
    return;
  }
  // Deduplicate by workflow_id and show unique results
  var html = "";
  var shown = {};
  for (var ri = 0; ri < results.length && ri < 20; ri++) {
    var r = results[ri];
    if (shown[r.workflow_id]) continue;
    shown[r.workflow_id] = true;
    // Find specialty for this workflow
    var specName = "";
    var displayName = "";
    for (var si2 = 0; si2 < (v2data.specialties || []).length; si2++) {
      var spec2 = v2data.specialties[si2];
      var wfs2 = spec2.workflows || [];
      for (var wi2 = 0; wi2 < wfs2.length; wi2++) {
        if (wfs2[wi2].workflow_id === r.workflow_id) {
          specName = spec2.display_name || spec2.specialty_id || "";
          displayName = wfs2[wi2].display_name || r.match;
          break;
        }
      }
      if (specName) break;
    }
    html += "<div style='padding:6px 10px;cursor:pointer;border-radius:6px;border-bottom:1px solid var(--gray-100)' onclick=\"v2selectWorkflow('"+r.workflow_id+"')\" onmouseover=\"this.style.background='var(--gray-50)'\" onmouseout=\"this.style.background=''\">";
    html += "<span style='font-weight:600;color:var(--gray-800)'>" + displayName + "</span>";
    if (specName) html += " <span style='font-size:10px;color:var(--gray-400)'>" + specName + "</span>";
    html += "</div>";
  }
  if (results.length > 20) {
    html += "<div style='padding:4px 8px;font-size:10px;color:var(--gray-400)'>" + (results.length - 20) + " more results...</div>";
  }
  container.innerHTML = html;
  container.style.display = "block";
}

function v2selectWorkflow(workflowId) {
  var v2data = window.NAJM_CLINICAL_DATA;
  if (!v2data || !v2data.specialties) return;
  // Find the workflow
  for (var si = 0; si < v2data.specialties.length; si++) {
    var spec = v2data.specialties[si];
    var specKey = spec.display_name || spec.specialty_id;
    var wfs = spec.workflows || [];
    for (var wi = 0; wi < wfs.length; wi++) {
      if (wfs[wi].workflow_id === workflowId) {
        var wf = wfs[wi];
        var displayName = wf.display_name;
        // Set specialty dropdown
        var specSelect = document.getElementById("speedSpecialty");
        if (specSelect) {
          var foundSpec = false;
          for (var si2 = 0; si2 < specSelect.options.length; si2++) {
            if (specSelect.options[si2].value === specKey) {
              specSelect.value = specKey;
              foundSpec = true;
              break;
            }
          }
          if (!foundSpec) {
            // Try changing value directly
            specSelect.value = "";
          }
        }
        // Trigger specialty load
        loadSpeedSpecialty();
        var vtSelect = document.getElementById("speedVisitType");
        if (vtSelect) {
          // Find matching visit type after load
          setTimeout(function() {
            var vtSel = document.getElementById("speedVisitType");
            if (vtSel) {
              for (var vi = 0; vi < vtSel.options.length; vi++) {
                if (vtSel.options[vi].value === displayName) {
                  vtSel.value = displayName;
                  break;
                }
              }
              // If exact match not found, try first option
              if (!vtSel.value && vtSel.options.length > 1) {
                vtSel.value = vtSel.options[1].value;
              }
            }
            loadSpeedVisit();
            setTimeout(function() {
              var resolvedNow = v2resolveSelectedWorkflow(currentSpecialty, vtSel.value);
              if (resolvedNow) v2scheduleSpeedPresetApply(resolvedNow);
            }, 120);
          }, 50);
        }
        // Clear search
        var search = v2getSearchInput();
        if (search) search.value = "";
        var results = document.getElementById("v2SearchResults");
        if (results) { results.style.display = "none"; results.innerHTML = ""; }
        return;
      }
    }
  }
  // Fallback: try direct text search in loaded library
  var lib = window.ACTIVE_VISIT_LIBRARY;
  for (var sk in lib) {
    for (var vtk in lib[sk]) {
      var meta = lib[sk][vtk]._v2meta;
      if (meta && meta.workflow_id === workflowId) {
        var specSel = document.getElementById("speedSpecialty");
        if (specSel) specSel.value = sk;
        loadSpeedSpecialty();
        setTimeout(function() {
          var vtSel2 = document.getElementById("speedVisitType");
          if (vtSel2) {
            vtSel2.value = vtk;
            loadSpeedVisit();
            setTimeout(function() {
              var resolvedNow2 = v2resolveSelectedWorkflow(currentSpecialty, vtSel2.value);
              if (resolvedNow2) v2scheduleSpeedPresetApply(resolvedNow2);
            }, 120);
          }
        }, 50);
        var search2 = v2getSearchInput();
        if (search2) search2.value = "";
        var results2 = document.getElementById("v2SearchResults");
        if (results2) { results2.style.display = "none"; results2.innerHTML = ""; }
        return;
      }
    }
  }
}

// ---- V2 History Layout Display ----
function v2showHistoryLayout(specKey) {
  var section = document.getElementById("v2HistorySection");
  var content = document.getElementById("v2HistoryContent");
  if (!section || !content) return;
  if (!window.NAJM_CLINICAL_DATA || !window.NAJM_CLINICAL_DATA.historyLayouts) {
    section.style.display = "none";
    return;
  }
  var layout = window.NAJM_CLINICAL_DATA.historyLayouts[specKey];
  if (!layout || !layout.sections) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";
  content.style.display = "none"; // Collapsed by default
  var html = "";
  var secs = layout.sections;
  for (var i = 0; i < secs.length; i++) {
    var s = secs[i];
    var desc = s.description || "";
    var label = s.display_name || s.section_id || "";
    // Skip technical/internal sections
    if (desc.indexOf("free_text") >= 0 || desc.indexOf("examination") >= 0) continue;
    html += "<div style='margin-bottom:8px'>";
    html += "<div style='font-weight:600;color:var(--gray-700);font-size:11px'>" + label + "</div>";
    if (s.fields && s.fields.length) {
      var fieldPrompts = [];
      for (var f = 0; f < s.fields.length; f++) {
        var fp = s.fields[f].prompt || s.fields[f].field_id || "";
        if (fp) fieldPrompts.push(fp);
      }
      if (fieldPrompts.length) {
        html += "<div style='color:var(--gray-500);font-size:10px;margin-top:2px'>" + fieldPrompts.slice(0, 8).join(", ") + "</div>";
      }
    }
    html += "</div>";
  }
  content.innerHTML = html;
}

// ---- Enhanced V2 fillChips with Warnings ----
function v2fillChipsWithWarnings(containerId, chipGroupName, v2wfData) {
  var c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = "";
  var chipList = v2wfData && v2wfData[chipGroupName] ? v2wfData[chipGroupName] : [];
  for (var i = 0; i < chipList.length; i++) {
    var chip = chipList[i];
    var chipText = typeof chip === "string" ? chip : (chip.chip_text || "");
    var warning = typeof chip === "object" ? (chip.warning || "") : "";
    if (!chipText) continue;
    var b = document.createElement("button");
    var isRedFlag = containerId === "speedRedFlags" || containerId.indexOf("RedFlag") >= 0;
    b.className = "chip" + (isRedFlag ? " chip-redflag" : "");
    b.textContent = chipText;
    b.setAttribute("data-name", chipText.toLowerCase());
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    if (isRedFlag) b.setAttribute("data-redflag", "1");
    b.onclick = function(){ this.classList.toggle("selected"); this.setAttribute("aria-pressed", this.classList.contains("selected") ? "true" : "false"); updateSelectedCount(); if (typeof window.updateRedFlagBanner === "function") window.updateRedFlagBanner(); };
    if (warning) {
      b.title = warning;
      b.style.textDecoration = "underline dotted";
      b.style.textUnderlineOffset = "2px";
    }
    c.appendChild(b);
  }
}

function v2resolveSelectedWorkflow(specKey, visitName) {
  var data = window.NAJM_CLINICAL_DATA;
  if (!data || !visitName) return null;

  var workflowId = "";
  var lib = window.ACTIVE_VISIT_LIBRARY;
  if (lib && specKey && lib[specKey] && lib[specKey][visitName] && lib[specKey][visitName]._v2meta) {
    workflowId = lib[specKey][visitName]._v2meta.workflow_id || "";
  }

  var specialty = null;
  var workflow = workflowId && data.workflowsById ? data.workflowsById[workflowId] : null;
  if (!workflowId || !workflow) {
    var specs = data.specialties || [];
    for (var si = 0; si < specs.length; si++) {
      var s = specs[si];
      var sName = s.display_name || s.specialty_id || "";
      if (specKey && sName !== specKey && s.specialty_id !== specKey) continue;
      var wfs = s.workflows || [];
      for (var wi = 0; wi < wfs.length; wi++) {
        if (wfs[wi].display_name === visitName) {
          specialty = s;
          workflowId = wfs[wi].workflow_id;
          workflow = data.workflowsById && data.workflowsById[workflowId] ? data.workflowsById[workflowId] : wfs[wi];
          break;
        }
      }
      if (workflowId) {
        if (!specialty) specialty = s;
        break;
      }
    }
  }

  if (!specialty && workflow) {
    var specs2 = data.specialties || [];
    for (var sj = 0; sj < specs2.length; sj++) {
      if ((specs2[sj].display_name || specs2[sj].specialty_id) === specKey || specs2[sj].specialty_id === workflow.specialty) {
        specialty = specs2[sj];
        break;
      }
    }
  }

  if (!workflowId) return null;
  var chips = (data.chipsByWorkflow && data.chipsByWorkflow[workflowId]) || (workflow && workflow.chips) || null;
  return {
    workflow_id: workflowId,
    workflow: workflow,
    specialty: specialty,
    chips: chips
  };
}

function v2countChips(chips) {
  if (!chips) return 0;
  var groups = ["symptoms", "relevant_negatives", "exam_findings", "red_flags", "investigations", "plan_phrases", "follow_up"];
  var total = 0;
  for (var i = 0; i < groups.length; i++) {
    total += (chips[groups[i]] || []).length;
  }
  return total;
}

function v2updateChipDiagnostic(count) {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  var summary = document.getElementById("speedSummary");
  if (!summary || !summary.parentNode) return;
  var diag = document.getElementById("v2LoadedChipCount");
  if (!diag) {
    diag = document.createElement("div");
    diag.id = "v2LoadedChipCount";
    diag.style.cssText = "font-size:10px;color:var(--gray-400);margin:4px 0 8px";
    summary.parentNode.insertBefore(diag, summary);
  }
  diag.textContent = "Loaded chips: " + count;
}

var V2_SPEED_PRESET_FIELDS = [
  { field: "prechecked_symptoms", group: "symptoms", containerId: "speedSymptoms" },
  { field: "prechecked_relevant_negatives", group: "relevant_negatives", containerId: "speedNegs" },
  { field: "prechecked_exam_findings", group: "exam_findings", containerId: "speedExam" },
  { field: "prechecked_investigations", group: "investigations", containerId: "speedInvs" },
  { field: "prechecked_plan_phrases", group: "plan_phrases", containerId: "speedPlans" },
  { field: "prechecked_follow_up", group: "follow_up", containerId: "speedFollowupChips" }
];

var v2SpeedPresetLoadPromise = null;
var v2SpeedPresetApplyToken = 0;

function v2isSpeedPresetMode() {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return false;
  if (typeof window.isSpeedPresetModeEnabled === "function") return window.isSpeedPresetModeEnabled();
  if (window.CLINICNOTE_SPEED_MODE === true) return true;
  try {
    return new URLSearchParams(window.location.search).get("speed") !== "off";
  } catch (e) {
    return true;
  }
}

function v2isSpeedPresetOffFallback() {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return false;
  try {
    return new URLSearchParams(window.location.search).get("speed") === "off";
  } catch (e) {
    return false;
  }
}

function v2ensureAutofillControls() {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  var searchArea = document.getElementById("v2SearchArea");
  if (!searchArea || !searchArea.parentNode) return;
  var controls = document.getElementById("v2AutofillControls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "v2AutofillControls";
    controls.style.cssText = "background:#fff;border:1px solid var(--gray-200);border-radius:12px;padding:14px 16px;margin:-4px 0 16px;box-shadow:var(--shadow);font-size:12px;color:var(--gray-700)";
    controls.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
      '<div style="min-width:220px;flex:1">' +
      '<div id="v2AutofillStatus" style="font-size:13px;font-weight:800;color:var(--gray-900);margin-bottom:4px">Autofill: ON</div>' +
      '<div style="line-height:1.45">Autofill pre-selects common documentation chips for the selected workflow. Review and untick anything that does not apply.</div>' +
      '</div>' +
      '<button id="v2AutofillToggle" type="button" class="btn btn-outline btn-sm" onclick="v2toggleAutofill()">Turn Autofill off</button>' +
      '</div>' +
      '<div style="border-top:1px solid var(--gray-200);margin-top:10px;padding-top:10px;line-height:1.45">' +
      '<div style="font-weight:800;color:var(--gray-800);margin-bottom:3px">What is Autofill?</div>' +
      '<div>Autofill pre-selects common positives, relevant negatives, exam prompts, plan phrases, and follow-up phrases for the selected workflow. It is only a starting point. Remove anything that does not apply and add your own details before generating.</div>' +
      '<div style="font-size:11px;color:var(--gray-500);margin-top:5px">Only keep findings you assessed or discussed. The final note remains a clinician-reviewed draft.</div>' +
      '</div>';
    if (searchArea.nextSibling) searchArea.parentNode.insertBefore(controls, searchArea.nextSibling);
    else searchArea.parentNode.appendChild(controls);
  }
  controls.style.display = "block";
  v2updateAutofillControls();
}

function v2updateAutofillControls() {
  var controls = document.getElementById("v2AutofillControls");
  if (!controls) return;
  if (window.CLINICNOTE_DATA_MODE !== "v2") {
    controls.style.display = "none";
    return;
  }
  var enabled = v2isSpeedPresetMode();
  var status = document.getElementById("v2AutofillStatus");
  var toggle = document.getElementById("v2AutofillToggle");
  if (status) {
    status.textContent = enabled ? "Autofill: ON" : "Autofill: OFF";
    status.style.color = enabled ? "#0f766e" : "#475569";
  }
  if (toggle) toggle.textContent = enabled ? "Turn Autofill off" : "Turn Autofill on";
}

function v2setAutofillUrl(enabled) {
  try {
    var params = new URLSearchParams(window.location.search);
    if (enabled) {
      if (params.get("speed") === "off") params.delete("speed");
    } else {
      params.set("speed", "off");
    }
    var next = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState({}, "", next);
  } catch (e) {}
}

function v2clearPresetSelectedChips() {
  var area = document.getElementById("v2ChipGroups");
  if (!area) return;
  var presetSelected = area.querySelectorAll('.chip.selected[data-v2-preset-selected="true"]');
  for (var i = 0; i < presetSelected.length; i++) {
    presetSelected[i].classList.remove("selected");
  }
  var tagged = area.querySelectorAll('[data-v2-preset-selected="true"]');
  for (var j = 0; j < tagged.length; j++) {
    tagged[j].removeAttribute("data-v2-preset-selected");
  }
  area.removeAttribute("data-v2-preset-applied-workflow");
}

function v2currentResolvedWorkflow() {
  if (typeof v2resolveSelectedWorkflow !== "function") return null;
  if (!currentSpecialty || !currentVisitType) return null;
  return v2resolveSelectedWorkflow(currentSpecialty, currentVisitType);
}

function v2setAutofillMode(enabled) {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  v2SpeedPresetApplyToken += 1;
  v2setAutofillUrl(enabled);
  window.CLINICNOTE_SPEED_MODE = enabled;
  v2ensureSpeedPresetModeMarker();
  v2updateAutofillControls();

  if (!enabled) {
    v2clearPresetSelectedChips();
    v2setSpeedPresetBanner("missing", "No Autofill defaults available for this workflow yet.", 0);
    var offBanner = document.getElementById("v2SpeedPresetBanner");
    if (offBanner) offBanner.style.display = "none";
    updateSelectedCount();
    return;
  }

  var resolved = v2currentResolvedWorkflow();
  if (resolved && resolved.workflow_id) {
    v2scheduleSpeedPresetApply(resolved);
  }
}

function v2toggleAutofill() {
  v2setAutofillMode(!v2isSpeedPresetMode());
}
window.v2toggleAutofill = v2toggleAutofill;

function v2ensureSpeedPresetModeMarker() {
  var header = document.querySelector("#page-speed .page-header");
  if (!header) return;
  var marker = document.getElementById("v2SpeedPresetModeMarker");
  if (!marker) {
    marker = document.createElement("div");
    marker.id = "v2SpeedPresetModeMarker";
    marker.style.cssText = "display:none;margin-top:10px;font-size:12px;font-weight:800;color:#075985;background:#e0f2fe;border:1px solid #bae6fd;border-radius:999px;padding:7px 11px;width:max-content;max-width:100%";
    header.appendChild(marker);
  }
  if (v2isSpeedPresetMode()) {
    marker.textContent = "Autofill: ON";
    marker.style.cssText = "display:inline-flex;margin-top:10px;font-size:12px;font-weight:800;color:#075985;background:#e0f2fe;border:1px solid #bae6fd;border-radius:999px;padding:7px 11px;width:max-content;max-width:100%";
  } else if (v2isSpeedPresetOffFallback()) {
    marker.textContent = "Autofill: OFF";
    marker.style.cssText = "display:inline-flex;margin-top:10px;font-size:12px;font-weight:800;color:#475569;background:#f8fafc;border:1px solid #cbd5e1;border-radius:999px;padding:7px 11px;width:max-content;max-width:100%";
  } else {
    marker.style.display = "none";
  }
}

function v2preloadSpeedPresets() {
  if (!v2isSpeedPresetMode()) return;
  v2loadSpeedPresets();
}

function v2loadSpeedPresets() {
  if (!v2isSpeedPresetMode()) return Promise.resolve(null);
  if (window.CLINICNOTE_SPEED_PRESETS_BY_ID) {
    return Promise.resolve(window.CLINICNOTE_SPEED_PRESETS_BY_ID);
  }
  if (v2SpeedPresetLoadPromise) return v2SpeedPresetLoadPromise;
  if (typeof fetch !== "function") {
    console.warn("Najm AI: Autofill defaults cannot load because fetch is unavailable.");
    return Promise.resolve(null);
  }
  v2SpeedPresetLoadPromise = fetch("./data/speed_presets.json?v=v7-autofill-defaults", { cache: "no-store" })
    .then(function(resp) {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.json();
    })
    .then(function(list) {
      var byId = {};
      if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
          if (list[i] && list[i].workflow_id) byId[list[i].workflow_id] = list[i];
        }
      }
      window.CLINICNOTE_SPEED_PRESETS = list;
      window.CLINICNOTE_SPEED_PRESETS_BY_ID = byId;
      return byId;
    })
    .catch(function(err) {
      console.warn("Najm AI: Autofill defaults could not be loaded.", err);
      window.CLINICNOTE_SPEED_PRESET_LOAD_ERROR = String(err && err.message ? err.message : err);
      return null;
    });
  return v2SpeedPresetLoadPromise;
}

function v2ensureSpeedPresetBanner() {
  var area = v2ensureChipGroupsArea();
  if (!area) return null;
  var banner = document.getElementById("v2SpeedPresetBanner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "v2SpeedPresetBanner";
    banner.style.cssText = "display:none;border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12px;line-height:1.45;border:1px solid #bae6fd;background:#eff6ff;color:#075985";
    area.insertBefore(banner, area.firstChild);
  }
  return banner;
}

function v2setSpeedPresetBanner(kind, message, count) {
  if (!v2isSpeedPresetMode()) {
    var hidden = document.getElementById("v2SpeedPresetBanner");
    if (hidden) hidden.style.display = "none";
    return;
  }
  var banner = v2ensureSpeedPresetBanner();
  if (!banner) return;
  var styles = {
    loaded: "display:block;border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12px;line-height:1.45;border:1px solid #99f6e4;background:#f0fdfa;color:#0f766e",
    missing: "display:block;border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12px;line-height:1.45;border:1px solid #fde68a;background:#fffbeb;color:#92400e",
    loading: "display:block;border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12px;line-height:1.45;border:1px solid #bae6fd;background:#eff6ff;color:#075985",
    error: "display:block;border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12px;line-height:1.45;border:1px solid var(--red-border);background:var(--red-bg);color:var(--red)"
  };
  banner.style.cssText = styles[kind] || styles.loading;
  banner.innerHTML = "<strong>" + v2escapeHtml(message) + "</strong>" + (typeof count === "number" ? "<div>Autofill chips loaded: " + count + "</div>" : "");
}

function v2selectPresetChips(preset) {
  var area = document.getElementById("v2ChipGroups");
  if (!area || !preset) return { selected: 0, missing: [] };
  var selected = 0;
  var missing = [];
  for (var f = 0; f < V2_SPEED_PRESET_FIELDS.length; f++) {
    var cfg = V2_SPEED_PRESET_FIELDS[f];
    var values = preset[cfg.field] || [];
    for (var v = 0; v < values.length; v++) {
      var expected = String(values[v] || "").trim();
      if (!expected) continue;
      var buttons = area.querySelectorAll('.chip[data-v2-group="' + cfg.group + '"]');
      var matched = false;
      for (var b = 0; b < buttons.length; b++) {
        var actual = buttons[b].getAttribute("data-value") || buttons[b].textContent || "";
        if (actual.trim() === expected) {
          buttons[b].classList.add("selected");
          buttons[b].setAttribute("data-v2-preset-selected", "true");
          matched = true;
          selected += 1;
          break;
        }
      }
      if (!matched) missing.push(cfg.group + ": " + expected);
    }
  }
  return { selected: selected, missing: missing };
}

function v2speedPresetModeLabel() {
  try {
    var speed = new URLSearchParams(window.location.search).get("speed");
    return speed === "v1" ? "v1" : "default";
  } catch (e) {
    return "default";
  }
}

function v2applySpeedPreset(resolved, token) {
  if (!v2isSpeedPresetMode()) return Promise.resolve(null);
  var workflowId = resolved && resolved.workflow_id ? resolved.workflow_id : "";
  var workflowName = currentVisitType || "";
  var area = document.getElementById("v2ChipGroups");
  if (area && workflowId && area.getAttribute("data-v2-preset-applied-workflow") === workflowId) {
    return Promise.resolve(window.CLINICNOTE_SPEED_PRESET_DEBUG || null);
  }
  v2setSpeedPresetBanner("loading", "Checking Autofill defaults...", null);
  return v2loadSpeedPresets().then(function(presetsById) {
    if (token && token !== v2SpeedPresetApplyToken) return null;
    var preset = presetsById && workflowId ? presetsById[workflowId] : null;
    var debug = {
      speed_flag: v2speedPresetModeLabel(),
      selected_workflow_display_name: workflowName,
      resolved_workflow_id: workflowId,
      preset_exists: !!preset,
      preset_chip_count: 0,
      missing_chip_text: []
    };
    if (!preset) {
      window.CLINICNOTE_SPEED_PRESET_DEBUG = debug;
      if (area && workflowId) area.removeAttribute("data-v2-preset-applied-workflow");
      v2setSpeedPresetBanner("missing", "No Autofill defaults available for this workflow yet.", 0);
      updateSelectedCount();
      console.info("Najm AI Autofill", debug);
      return debug;
    }
    var result = v2selectPresetChips(preset);
    debug.preset_chip_count = result.selected;
    debug.missing_chip_text = result.missing;
    window.CLINICNOTE_SPEED_PRESET_DEBUG = debug;
    if (result.selected > 0) {
      area = document.getElementById("v2ChipGroups");
      if (area && workflowId) area.setAttribute("data-v2-preset-applied-workflow", workflowId);
      v2setSpeedPresetBanner("loaded", "Autofill loaded common defaults. Review and untick anything that does not apply.", result.selected);
    } else {
      if (area && workflowId) area.removeAttribute("data-v2-preset-applied-workflow");
      v2setSpeedPresetBanner("missing", "Autofill defaults found, but no matching chip buttons were selected.", 0);
    }
    updateSelectedCount();
    console.info("Najm AI Autofill", debug);
    return debug;
  }).catch(function(err) {
    window.CLINICNOTE_SPEED_PRESET_DEBUG = {
      speed_flag: v2speedPresetModeLabel(),
      selected_workflow_display_name: workflowName,
      resolved_workflow_id: workflowId,
      preset_exists: false,
      preset_chip_count: 0,
      error: String(err && err.message ? err.message : err)
    };
    v2setSpeedPresetBanner("error", "Autofill defaults could not be loaded for this workflow.", 0);
    updateSelectedCount();
    return window.CLINICNOTE_SPEED_PRESET_DEBUG;
  });
}

function v2scheduleSpeedPresetApply(resolved) {
  if (!v2isSpeedPresetMode()) {
    v2SpeedPresetApplyToken += 1;
    v2setSpeedPresetBanner("missing", "No Autofill defaults available for this workflow yet.", 0);
    var offBanner = document.getElementById("v2SpeedPresetBanner");
    if (offBanner) offBanner.style.display = "none";
    updateSelectedCount();
    return;
  }
  if (!resolved || !resolved.workflow_id) return;
  var token = ++v2SpeedPresetApplyToken;
  var attempts = [0, 80, 220];
  for (var i = 0; i < attempts.length; i++) {
    (function(delay) {
      setTimeout(function() {
        if (token !== v2SpeedPresetApplyToken) return;
        var area = document.getElementById("v2ChipGroups");
        if (!area || !area.querySelector('.chip[data-v2-group]')) return;
        v2applySpeedPreset(resolved, token);
      }, delay);
    })(attempts[i]);
  }
}

function v2ensureChipGroupsArea() {
  var existing = document.getElementById("v2ChipGroups");
  if (existing) return existing;
  var area = document.createElement("div");
  area.id = "v2ChipGroups";
  area.style.cssText = "display:block;margin:14px 0 22px";

  var v2Features = document.getElementById("v2Features");
  if (v2Features && v2Features.parentNode) {
    v2Features.parentNode.insertBefore(area, v2Features.nextSibling);
    return area;
  }

  var content = document.getElementById("speedContent");
  if (content) {
    var durationSection = document.getElementById("speedDuration");
    var anchor = durationSection;
    while (anchor && !anchor.classList.contains("speed-section")) anchor = anchor.parentNode;
    if (anchor && anchor.parentNode === content) content.insertBefore(area, anchor);
    else content.insertBefore(area, content.firstChild);
  }
  return area;
}

function v2setLegacyChipSectionsVisible(visible) {
  var ids = [
    "speedSymptomSection",
    "speedNegSection",
    "speedExamSection",
    "speedRedFlagSection",
    "speedInvestigationsSection",
    "speedPlanSection"
  ];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.style.display = visible ? "" : "none";
  }
}

function v2escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function v2renderChipButton(chip, group, containerId) {
  var chipText = typeof chip === "string" ? chip : (chip.chip_text || "");
  if (!chipText) return null;
  var warning = typeof chip === "object" ? (chip.warning || "") : "";
  var b = document.createElement("button");
  b.className = "chip" + (group === "red_flags" ? " chip-redflag" : "");
  b.type = "button";
  b.textContent = chipText;
  b.setAttribute("data-name", chipText.toLowerCase());
  b.setAttribute("data-value", chipText);
  b.setAttribute("data-container", containerId);
  b.setAttribute("data-v2-group", group);
  if (warning) {
    b.title = warning;
    b.style.textDecoration = "underline dotted";
    b.style.textUnderlineOffset = "2px";
  }
  b.onclick = function() {
    this.classList.toggle("selected");
    updateSelectedCount();
  };
  return b;
}

var V2_CUSTOM_ENTRY_GROUPS = [
  { key: "symptoms", label: "Add custom symptom / positive", inputId: "v2CustomSymptom", listId: "v2CustomSymptomList", containerId: "speedSymptoms", placeholder: "e.g., symptoms worse at night" },
  { key: "relevant_negatives", label: "Add custom relevant negative", inputId: "v2CustomNegative", listId: "v2CustomNegativeList", containerId: "speedNegs", placeholder: "e.g., no recent travel" },
  { key: "exam_findings", label: "Add custom exam finding", inputId: "v2CustomExam", listId: "v2CustomExamList", containerId: "speedExam", placeholder: "e.g., mild epigastric tenderness" },
  { key: "red_flags", label: "Add custom red flag / safety note", inputId: "v2CustomRedFlag", listId: "v2CustomRedFlagList", containerId: "speedRedFlags", placeholder: "e.g., worsening pain reported" },
  { key: "investigations", label: "Add custom investigation / result", inputId: "v2CustomInvestigation", listId: "v2CustomInvestigationList", containerId: "speedInvs", placeholder: "e.g., HbA1c reviewed" },
  { key: "plan_phrases", label: "Add custom plan phrase", inputId: "v2CustomPlanPhrase", listId: "v2CustomPlanPhraseList", containerId: "speedPlans", placeholder: "e.g., dietary counseling discussed" },
  { key: "follow_up", label: "Add custom follow-up phrase", inputId: "v2CustomFollowup", listId: "v2CustomFollowupList", containerId: "speedFollowupChips", placeholder: "e.g., review in 3 months" }
];

function v2customGroupByInput(inputId) {
  for (var i = 0; i < V2_CUSTOM_ENTRY_GROUPS.length; i++) {
    if (V2_CUSTOM_ENTRY_GROUPS[i].inputId === inputId) return V2_CUSTOM_ENTRY_GROUPS[i];
  }
  return null;
}

function v2customGroupByKey(key) {
  for (var i = 0; i < V2_CUSTOM_ENTRY_GROUPS.length; i++) {
    if (V2_CUSTOM_ENTRY_GROUPS[i].key === key) return V2_CUSTOM_ENTRY_GROUPS[i];
  }
  return null;
}

function v2renderCustomSafetyNote(area) {
  var note = document.createElement("div");
  note.id = "v2CustomSafetyNote";
  note.style.cssText = "font-size:11px;color:var(--red);background:var(--red-bg);border:1px solid var(--red-border);border-radius:8px;padding:8px 10px;margin:0 0 12px";
  note.textContent = "Use de-identified text only. Do not enter names, MRNs, phone numbers, exact dates of birth, addresses, or other patient identifiers.";
  area.appendChild(note);

  var warning = document.createElement("div");
  warning.id = "v2CustomPhiWarning";
  warning.className = "phi-warning";
  warning.textContent = "Potential patient-identifiable information detected in a custom entry. Please remove names, IDs, dates of birth, phone numbers, Emirates IDs, or email addresses.";
  area.appendChild(warning);
}

function v2bindCustomInput(input, cfg) {
  input.oninput = v2scanCustomPHI;
  input.onkeydown = function(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      v2addCustomEntry(cfg.inputId);
    }
  };
}

function v2renderInlineCustomControls(section, cfg) {
  var wrap = document.createElement("div");
  wrap.setAttribute("data-v2-custom-row", cfg.key);
  wrap.style.cssText = "border-top:1px solid var(--gray-200);margin-top:8px;padding-top:8px";

  var label = document.createElement("label");
  label.setAttribute("for", cfg.inputId);
  label.style.cssText = "display:block;font-size:10px;font-weight:600;color:var(--gray-600);margin-bottom:4px";
  label.textContent = cfg.label;
  wrap.appendChild(label);

  var row = document.createElement("div");
  row.style.cssText = "display:flex;gap:6px;align-items:center";

  var input = document.createElement("input");
  input.id = cfg.inputId;
  input.type = "text";
  input.placeholder = cfg.placeholder;
  input.setAttribute("data-v2-custom-input", cfg.inputId);
  input.style.cssText = "flex:1;min-width:0;padding:7px 10px;border:1px solid var(--gray-300);border-radius:6px;font-size:11px;font-family:inherit";
  row.appendChild(input);

  var add = document.createElement("button");
  add.type = "button";
  add.className = "btn btn-ghost btn-xs";
  add.textContent = "Add";
  add.onclick = function() { v2addCustomEntry(cfg.inputId); };
  row.appendChild(add);

  wrap.appendChild(row);

  var list = document.createElement("div");
  list.id = cfg.listId;
  list.className = "chip-group";
  list.style.cssText = "margin-top:6px;margin-bottom:0";
  wrap.appendChild(list);

  section.appendChild(wrap);
  v2bindCustomInput(input, cfg);
}

function v2addCustomEntry(inputId) {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  var cfg = v2customGroupByInput(inputId);
  var input = document.getElementById(inputId);
  if (!cfg || !input) return;
  var value = input.value.trim();
  if (!value) return;

  var list = document.getElementById(cfg.listId);
  if (!list) return;

  var b = document.createElement("button");
  b.className = "chip selected" + (cfg.key === "red_flags" ? " chip-redflag" : "");
  b.type = "button";
  b.textContent = "custom: " + value;
  b.title = "Click to remove this custom entry";
  b.setAttribute("data-name", value.toLowerCase());
  b.setAttribute("data-value", value);
  b.setAttribute("data-container", cfg.containerId);
  b.setAttribute("data-v2-group", cfg.key);
  b.setAttribute("data-v2-custom-entry", "true");
  b.onclick = function() {
    if (this.parentNode) this.parentNode.removeChild(this);
    v2scanCustomPHI();
    updateSelectedCount();
  };
  list.appendChild(b);
  input.value = "";
  v2scanCustomPHI();
  updateSelectedCount();
}

function v2scanCustomPHI() {
  var found = false;
  var inputs = document.querySelectorAll("#v2ChipGroups [data-v2-custom-input]");
  for (var i = 0; i < inputs.length; i++) {
    if (v2detectCustomPHI(inputs[i].value || "")) found = true;
  }
  var entries = document.querySelectorAll("#v2ChipGroups [data-v2-custom-entry]");
  for (var e = 0; e < entries.length; e++) {
    var val = entries[e].getAttribute("data-value") || entries[e].textContent || "";
    if (v2detectCustomPHI(val)) found = true;
  }
  var warning = document.getElementById("v2CustomPhiWarning");
  if (warning) warning.classList.toggle("show", found);
  var existingWarning = document.getElementById("phiWarning");
  if (existingWarning && window.CLINICNOTE_DATA_MODE === "v2") existingWarning.classList.toggle("show", found);
  return found;
}

function v2detectCustomPHI(text) {
  if (!text || !text.trim()) return false;
  if (typeof detectPHI === "function" && detectPHI(text)) return true;
  var mrn = /\b(MRN|medical\s*record|record\s*number|patient\s*id|emirates\s*id|eid|id\s*number)\s*[:#-]?\s*[A-Za-z0-9-]{4,}\b/i;
  var emiratesId = /\b784[-\s]?\d{4}[-\s]?\d{7}[-\s]?\d\b/;
  var exactDob = /\b(date\s*of\s*birth|dob|d\.?\s*o\.?\s*b\.?)\s*[:#-]?\s*\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/i;
  var nameField = /\b(patient\s*name|pt\.?\s*name|name)\s*:\s*[A-Z][A-Za-z]+/i;
  return mrn.test(text) || emiratesId.test(text) || exactDob.test(text) || nameField.test(text);
}

function v2clearCustomEntries() {
  var root = document.getElementById("v2ChipGroups");
  if (!root) return;
  var entries = root.querySelectorAll("[data-v2-custom-entry]");
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].parentNode) entries[i].parentNode.removeChild(entries[i]);
  }
  var inputs = root.querySelectorAll("[data-v2-custom-input]");
  for (var j = 0; j < inputs.length; j++) inputs[j].value = "";
  var warning = document.getElementById("v2CustomPhiWarning");
  if (warning) warning.classList.remove("show");
}

function v2renderVisibleChipGroups(chips) {
  var area = v2ensureChipGroupsArea();
  if (!area) return;
  area.innerHTML = "";
  area.removeAttribute("data-v2-preset-applied-workflow");
  area.style.display = "block";
  v2setLegacyChipSectionsVisible(false);
  v2renderCustomSafetyNote(area);

  var groups = [
    { key: "symptoms", label: "Symptoms", containerId: "speedSymptoms" },
    { key: "relevant_negatives", label: "Relevant negatives", containerId: "speedNegs" },
    { key: "exam_findings", label: "Exam findings", containerId: "speedExam" },
    { key: "red_flags", label: "Red flags", containerId: "speedRedFlags" },
    { key: "investigations", label: "Investigations / results reviewed", containerId: "speedInvs" },
    { key: "plan_phrases", label: "Plan phrases", containerId: "speedPlans" },
    { key: "follow_up", label: "Follow-up phrases", containerId: "speedFollowupChips" }
  ];

  for (var g = 0; g < groups.length; g++) {
    var cfg = groups[g];
    var customCfg = v2customGroupByKey(cfg.key);
    var list = chips && chips[cfg.key] ? chips[cfg.key] : [];
    var section = document.createElement("div");
    section.className = "speed-section";
    section.setAttribute("data-v2-chip-section", cfg.key);
    section.style.marginBottom = "18px";

    var title = document.createElement("div");
    title.className = "speed-section-title";
    title.textContent = cfg.label;
    section.appendChild(title);

    var groupEl = document.createElement("div");
    groupEl.className = "chip-group";
    groupEl.setAttribute("data-container", cfg.containerId);
    for (var i = 0; i < list.length; i++) {
      var btn = v2renderChipButton(list[i], cfg.key, cfg.containerId);
      if (btn) groupEl.appendChild(btn);
    }
    if (!groupEl.children.length) {
      var empty = document.createElement("div");
      empty.style.cssText = "font-size:11px;color:var(--gray-400);font-style:italic;margin-bottom:10px";
      empty.textContent = "No quick chips configured for this group.";
      groupEl.appendChild(empty);
    }
    section.appendChild(groupEl);
    if (customCfg) v2renderInlineCustomControls(section, customCfg);
    area.appendChild(section);
  }
  v2scanCustomPHI();
}

function v2getSelectedChipItems(containerId) {
  var area = document.getElementById("v2ChipGroups");
  var selector = '.chip.selected[data-container="' + containerId + '"]';
  var out = [];
  if (area) {
    var chips = area.querySelectorAll(selector);
    for (var i = 0; i < chips.length; i++) {
      out.push({
        value: chips[i].getAttribute("data-value") || chips[i].textContent,
        custom: chips[i].getAttribute("data-v2-custom-entry") === "true"
      });
    }
  }
  return out;
}

function v2getSelectedChips(containerId) {
  var items = v2getSelectedChipItems(containerId);
  var out = [];
  for (var i = 0; i < items.length; i++) out.push(items[i].value);
  return out;
}

// ---- Enhanced LoadSpeedVisit for V2 ----
// loadSpeedVisit is defined later (in index.html inline script) so we
// cannot capture _origLoadSpeedVisit at parse time. Instead we poll
// until it exists, then patch it.
(function v2patchLoadSpeedVisit() {
  if (typeof loadSpeedVisit !== "function") {
    setTimeout(v2patchLoadSpeedVisit, 50);
    return;
  }
  var _origLoadSpeedVisit = loadSpeedVisit;
  loadSpeedVisit = function() {
    _origLoadSpeedVisit();
    // If v2, enhance: show investigations, history layout, chip warnings, improved summary
    if (window.CLINICNOTE_DATA_MODE !== "v2") {
      // Hide v2-only elements
      var invSec = document.getElementById("speedInvestigationsSection");
      if (invSec) invSec.style.display = "none";
      return;
    }

    var vt = document.getElementById("speedVisitType").value;
    var specKey = currentSpecialty;
    if (!vt || !specKey) return;

    var resolved = v2resolveSelectedWorkflow(specKey, vt);
    if (!resolved || !resolved.chips) {
      console.warn("Najm AI: v2 chips could not be resolved for selected workflow", { specialty: specKey, visit: vt });
      v2updateChipDiagnostic(0);
      return;
    }

    var v2Spec = resolved.specialty;
    var chips = resolved.chips;

    v2clearCustomEntries();
    v2renderVisibleChipGroups(chips);

    v2fillChipsWithWarnings("speedSymptoms", "symptoms", chips);
    v2fillChipsWithWarnings("speedNegs", "relevant_negatives", chips);
    v2fillChipsWithWarnings("speedExam", "exam_findings", chips);
    v2fillChipsWithWarnings("speedRedFlags", "red_flags", chips);
    v2fillChipsWithWarnings("speedPlans", "plan_phrases", chips);

    var invSec = document.getElementById("speedInvestigationsSection");
    var invContainer = document.getElementById("speedInvs");
    if (invSec && invContainer) {
      var v2Invs = chips.investigations || [];
      if (v2Invs.length > 0) {
        invSec.style.display = "block";
        v2fillChipsWithWarnings("speedInvs", "investigations", chips);
      } else {
        invSec.style.display = "none";
        invContainer.innerHTML = "";
      }
    }

    // Show history layout for v2
    var layoutId = v2Spec ? (v2Spec.history_layout_id || v2Spec.specialty_id) : specKey;
    v2showHistoryLayout(layoutId);

    v2updateChipDiagnostic(v2countChips(chips));

    // Refresh summary after chip refill. Presets are scheduled after
    // visible buttons exist so live/cache timing cannot race rendering.
    v2scheduleSpeedPresetApply(resolved);
    updateSelectedCount();
  };
})();

// ---- V2 Selected Chip Source ----
(function v2patchGetSelectedChips() {
  if (typeof getSelectedChips !== "function") {
    setTimeout(v2patchGetSelectedChips, 50);
    return;
  }
  var _origGetSelectedChips = getSelectedChips;
  getSelectedChips = function(containerId) {
    if (window.CLINICNOTE_DATA_MODE === "v2") {
      var v2Selected = v2getSelectedChips(containerId);
      if (v2Selected.length || document.getElementById("v2ChipGroups")) return v2Selected;
    }
    return _origGetSelectedChips(containerId);
  };
})();

// ---- V2 Improved Selected Item Summary (showing grouped items) ----
(function v2patchUpdateSelectedCount() {
  if (typeof updateSelectedCount !== "function") {
    setTimeout(v2patchUpdateSelectedCount, 50);
    return;
  }
  var _origUpdateSelectedCount = updateSelectedCount;
  updateSelectedCount = function() {
    _origUpdateSelectedCount();
    if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  var summary = document.getElementById("speedSummary");
  if (!summary) return;
  var groups = [
    { id: "speedSymptoms", label: "Symptoms" },
    { id: "speedNegs", label: "Negatives" },
    { id: "speedExam", label: "Exam" },
    { id: "speedRedFlags", label: "Red flags" },
    { id: "speedInvs", label: "Investigations" },
    { id: "speedPlans", label: "Plans" },
    { id: "speedFollowupChips", label: "Follow-up" }
  ];
  var total = 0;
  var html = "";
  for (var g = 0; g < groups.length; g++) {
    var names = [];
    if (document.getElementById("v2ChipGroups")) {
      var items = v2getSelectedChipItems(groups[g].id);
      for (var it = 0; it < items.length; it++) {
        names.push((items[it].custom ? "custom: " : "") + items[it].value);
      }
    } else {
      var container = document.getElementById(groups[g].id);
      if (!container) continue;
      var selected = container.querySelectorAll(".chip.selected");
      for (var s = 0; s < selected.length; s++) {
        names.push(selected[s].textContent);
      }
    }
    if (names.length === 0) continue;
    total += names.length;
    for (var n = 0; n < names.length; n++) names[n] = v2escapeHtml(names[n]);
    html += "<span><strong>" + groups[g].label + ":</strong> " + names.join(", ") + "</span>";
  }
  if (total === 0) {
    html = "<span>No quick items selected yet.</span>";
  }
  html += "<button class='btn btn-ghost btn-xs' onclick='v2clearAllSelections()' style='margin-left:auto'>Clear All</button>";
  summary.innerHTML = html;
  };
})();

function v2clearAllSelections() {
  var ids = ["speedSymptoms","speedNegs","speedExam","speedRedFlags","speedPlans","speedInvs","speedFollowupChips"];
  for (var i = 0; i < ids.length; i++) {
    var c = document.getElementById(ids[i]);
    if (c) {
      var sel = c.querySelectorAll(".chip.selected");
      for (var j = 0; j < sel.length; j++) { sel[j].classList.remove("selected"); }
    }
  }
  var area = document.getElementById("v2ChipGroups");
  if (area) {
    var v2sel = area.querySelectorAll(".chip.selected");
    for (var k = 0; k < v2sel.length; k++) { v2sel[k].classList.remove("selected"); }
  }
  v2clearCustomEntries();
  v2scanCustomPHI();
  updateSelectedCount();
}

// Keep the existing Clear All button behavior aligned with the dedicated v2 chips.
(function v2patchClearSpeed() {
  if (typeof clearSpeed !== "function") {
    setTimeout(v2patchClearSpeed, 50);
    return;
  }
  var _origClearSpeed = clearSpeed;
  clearSpeed = function() {
    _origClearSpeed();
    if (window.CLINICNOTE_DATA_MODE === "v2") v2clearAllSelections();
  };
})();

// ---- Enhanced GenerateAllOutputs for V2 (includes investigations) ----
(function v2patchGenerateAllOutputs() {
  if (typeof generateAllOutputs !== "function") {
    setTimeout(v2patchGenerateAllOutputs, 50);
    return;
  }
  var _origGenerateAllOutputs = generateAllOutputs;
  generateAllOutputs = function() {
    if (window.CLINICNOTE_DATA_MODE !== "v2") {
      _origGenerateAllOutputs();
      return;
    }
  // Get selected items
  var cleaner = typeof cleanOutputPhrase === "function" ? cleanOutputPhrase : function(value) { return String(value || "").trim(); };
  var listCleaner = typeof cleanOutputPhraseList === "function" ? cleanOutputPhraseList : function(items) {
    var out = [];
    for (var i = 0; i < (items || []).length; i++) {
      var cleaned = cleaner(items[i]);
      if (cleaned) out.push(cleaned);
    }
    return out;
  };
  var selectedSymptoms = listCleaner(getSelectedChips("speedSymptoms"));
  var selectedNegs = listCleaner(getSelectedChips("speedNegs"));
  var selectedExam = listCleaner(getSelectedChips("speedExam"));
  var selectedRedFlags = listCleaner(getSelectedChips("speedRedFlags"));
  var selectedInvs = listCleaner(getSelectedChips("speedInvs"));
  var selectedPlans = listCleaner(getSelectedChips("speedPlans"));
  var selectedFollowUps = listCleaner(v2getSelectedChips("speedFollowupChips"));

  var duration = cleaner(document.getElementById("speedDuration").value);
  var impression = cleaner(document.getElementById("speedImpression").value);
  var plan = cleaner(document.getElementById("speedPlan").value);
  var followup = cleaner(document.getElementById("speedFollowup").value);
  if (!followup && selectedFollowUps.length) followup = selectedFollowUps.join(", ");
  var refReason = cleaner(document.getElementById("speedReferralReason").value);
  var refSpecialty = cleaner(document.getElementById("speedReferralSpecialty").value);
  var specName = currentSpecialty;
  var visitName = currentVisitType;

  // Build text strings
  var sympStr = selectedSymptoms.join(", ") || "[not documented]";
  var negStr = selectedNegs.join(", ") || "[not documented]";
  var examStr = selectedExam.join(", ") || "[not documented]";
  var invStr = selectedInvs.join(", ") || "";
  var planPhrasesStr = selectedPlans.join(", ") || "";
  var dc = "Najm AI ClinicNote is an educational/productivity documentation assistant. All content must be reviewed and verified by a licensed clinician.\n\n";
  var seekHelpItems = selectedRedFlags.slice();
  var seekHelpPattern = /return precautions|warning signs|seek help|red flag|worsen|worsening|concern|fever|unable/i;
  for (var shp = 0; shp < selectedPlans.length; shp++) {
    if (seekHelpPattern.test(selectedPlans[shp]) && seekHelpItems.indexOf(selectedPlans[shp]) < 0) {
      seekHelpItems.push(selectedPlans[shp]);
    }
  }
  for (var shf = 0; shf < selectedFollowUps.length; shf++) {
    if (seekHelpPattern.test(selectedFollowUps[shf]) && seekHelpItems.indexOf(selectedFollowUps[shf]) < 0) {
      seekHelpItems.push(selectedFollowUps[shf]);
    }
  }

  // Combine doctor plan + selected plan phrases
  var fullPlan = plan;
  if (planPhrasesStr && plan) {
    fullPlan = plan + "\n- " + planPhrasesStr;
  } else if (planPhrasesStr) {
    fullPlan = planPhrasesStr;
  }
  if (!fullPlan) fullPlan = "[not documented]";

  // Red flags in output
  var rfStr = selectedRedFlags.join(", ") || "";

  // Impression
  var impStr = impression || "[not documented]";

  var outputs = {};

  // EMR
  outputs.emr = dc + "SHORT EMR NOTE\n";
  outputs.emr += "Specialty: " + specName + " | Visit: " + visitName + "\n\n";
  outputs.emr += "CC: " + sympStr + "\n";
  outputs.emr += "HPI: " + (duration ? duration + ". " : "") + "\n";
  if (negStr !== "[not documented]") outputs.emr += "Relevant negatives: " + negStr + "\n";
  outputs.emr += "Exam: " + examStr + "\n";
  if (invStr) outputs.emr += "Investigations/results reviewed: " + invStr + "\n";
  outputs.emr += "Impression: " + impStr + "\n";
  outputs.emr += "Plan: " + fullPlan + "\n";
  if (followup) outputs.emr += "Follow-up: " + followup + "\n";
  if (rfStr) outputs.emr += "Red flags considered: " + rfStr + "\n";

  // SOAP
  outputs.soap = dc + "SOAP NOTE\n";
  outputs.soap += "Specialty: " + specName + " | Visit: " + visitName + "\n\n";
  outputs.soap += "SUBJECTIVE:\n";
  outputs.soap += "Duration: " + (duration || "[not documented]") + "\n";
  outputs.soap += "Main symptoms: " + sympStr + "\n";
  if (negStr !== "[not documented]") outputs.soap += "Relevant negatives: " + negStr + "\n";
  outputs.soap += "\nOBJECTIVE:\n";
  outputs.soap += "Examination: " + examStr + "\n";
  if (invStr) outputs.soap += "Investigations: " + invStr + "\n";
  if (rfStr) outputs.soap += "Red flags: " + rfStr + "\n";
  outputs.soap += "\nASSESSMENT:\n" + impStr + "\n\n";
  outputs.soap += "PLAN:\n" + fullPlan + "\n";
  if (followup) outputs.soap += "\nFollow-up: " + followup + "\n";

  // Follow-up
  outputs.fup = dc + "FOLLOW-UP NOTE\n";
  outputs.fup += "Specialty: " + specName + " | Visit: " + visitName + "\n\n";
  outputs.fup += "Interval: " + (followup || "[not documented]") + "\n";
  outputs.fup += "Current status: " + sympStr + "\n";
  if (invStr) outputs.fup += "Investigations/results reviewed: " + invStr + "\n";
  outputs.fup += "Examination: " + examStr + "\n";
  if (negStr !== "[not documented]") outputs.fup += "Relevant negatives: " + negStr + "\n";
  outputs.fup += "Impression: " + impStr + "\n";
  outputs.fup += "Plan: " + fullPlan + "\n";

  // Referral
  outputs.ref = dc + "REFERRAL LETTER\n";
  outputs.ref += "Specialty: " + specName + " | Visit: " + visitName + "\n";
  if (refSpecialty) outputs.ref += "Referred to: " + refSpecialty + "\n\n";
  else outputs.ref += "\n";
  outputs.ref += "Reason for referral: " + (refReason || sympStr) + "\n";
  outputs.ref += "History: " + (duration ? duration : "") + "\n";
  outputs.ref += "Exam findings: " + examStr + "\n";
  if (invStr) outputs.ref += "Investigations/results reviewed: " + invStr + "\n";
  outputs.ref += "Working impression: " + impStr + "\n";
  outputs.ref += "Current plan: " + fullPlan + "\n";
  outputs.ref += "Request: Please see and advise.\n";

  // Instructions (no investigations, only doctor plan)
  outputs.inst = dc + "PATIENT INSTRUCTIONS\n\n";
  outputs.inst += "Assessment: " + impStr + "\n\n";
  outputs.inst += "Doctor advice / plan:\n";
  if (plan) outputs.inst += plan + "\n";
  if (selectedPlans.length) outputs.inst += "- " + selectedPlans.join("\n- ") + "\n";
  if (!plan && !selectedPlans.length) outputs.inst += "[not documented]\n";
  outputs.inst += "\n";
  if (seekHelpItems.length) outputs.inst += "When to seek help:\n" + seekHelpItems.join(", ") + "\n\n";
  outputs.inst += "Follow-up: " + (followup || "[not documented]") + "\n";

  window._speedOutputs = outputs;
  window._activeSpeedTab = window._activeSpeedTab || "emr";
  renderSpeedOutput(window._activeSpeedTab);
  };
})();
