// ---- V2 Workflow UI Improvements (behind feature flag) ----

// Show v2 features if data=v2
(function() {
  if (window.CLINICNOTE_DATA_MODE !== "v2") return;
  // Show v2 search area (moved above specialty/visit selectors)
  var v2sa = document.getElementById("v2SearchArea");
  if (!v2sa) {
    // Fallback: create search block programmatically if not found in HTML
    var smBox = document.querySelector(".speed-mode-box");
    if (smBox) {
      var fallbackDiv = document.createElement("div");
      fallbackDiv.id = "v2SearchArea";
      fallbackDiv.style.cssText = "display:block;background:var(--white);border:2px solid var(--primary);border-radius:var(--radius-xl);padding:18px;margin-bottom:16px";
      fallbackDiv.innerHTML =
        '<div style="font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:8px">Search complaint or diagnosis</div>' +
        '<input id="v2Search" type="text" placeholder="Try: fever, diabetes, back pain, red eye, antenatal, anxiety" style="width:100%;padding:11px 14px;border:2px solid var(--gray-300);border-radius:10px;font-size:14px;font-family:inherit;margin-bottom:6px" oninput="v2searchComplaint(this.value)">' +
        '<div style="font-size:10px;color:var(--gray-400);margin-bottom:4px">Search selects the workflow. It does not search individual chips.</div>' +
        '<div id="v2SearchResults" style="display:none;background:#fff;border:1px solid var(--gray-300);border-radius:10px;padding:6px;margin-top:2px;max-height:280px;overflow-y:auto;font-size:13px"></div>';
      smBox.parentNode.insertBefore(fallbackDiv, smBox);
    } else {
      // Show visible warning if mount fails entirely
      var page = document.getElementById("page-speed");
      if (page) {
        var warnEl = document.createElement("div");
        warnEl.style.cssText = "background:var(--red-bg);border:1px solid var(--red-border);color:var(--red);padding:10px 14px;border-radius:8px;font-size:12px;font-weight:500;margin-bottom:10px";
        warnEl.textContent = "v2 search failed to load.";
        page.insertBefore(warnEl, page.firstChild);
      }
    }
  } else {
    v2sa.style.display = "block";
  }
  // Show v2 features within speed content (history prompts, etc.)
  var v2f = document.getElementById("v2Features");
  if (v2f) v2f.style.display = "block";
})();

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
          }, 50);
        }
        // Clear search
        var search = document.getElementById("v2Search");
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
          }
        }, 50);
        var search2 = document.getElementById("v2Search");
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
    b.onclick = function(){ this.classList.toggle("selected"); updateSelectedCount(); };
    if (warning) {
      b.title = warning;
      b.style.textDecoration = "underline dotted";
      b.style.textUnderlineOffset = "2px";
    }
    c.appendChild(b);
  }
}

// ---- Enhanced LoadSpeedVisit for V2 ----
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

  // Use raw v2 data for richer chips
  var v2data = window.NAJM_CLINICAL_DATA;
  if (!v2data || !v2data.specialties) return;

  // Find v2 specialty and workflow
  var v2Spec = null;
  var v2Wf = null;
  for (var si = 0; si < v2data.specialties.length; si++) {
    var s = v2data.specialties[si];
    if ((s.display_name || s.specialty_id) === specKey) {
      v2Spec = s;
      var wfs = s.workflows || [];
      for (var wi = 0; wi < wfs.length; wi++) {
        if (wfs[wi].display_name === vt) {
          v2Wf = wfs[wi];
          break;
        }
      }
      break;
    }
  }

  if (!v2Wf || !v2Wf.chips) return;

  // Fill chips using v2 data with warnings
  v2fillChipsWithWarnings("speedSymptoms", "symptoms", v2Wf.chips);
  v2fillChipsWithWarnings("speedNegs", "relevant_negatives", v2Wf.chips);
  v2fillChipsWithWarnings("speedExam", "exam_findings", v2Wf.chips);
  v2fillChipsWithWarnings("speedRedFlags", "red_flags", v2Wf.chips);
  v2fillChipsWithWarnings("speedPlans", "plan_phrases", v2Wf.chips);

  // Investigations section
  var invs = v2Wf.chips.investigations || [];
  var invSec = document.getElementById("speedInvestigationsSection");
  var invContainer = document.getElementById("speedInvs");
  if (invSec && invContainer) {
    if (invs.length > 0) {
      invSec.style.display = "block";
      v2fillChipsWithWarnings("speedInvs", "investigations", v2Wf.chips);
    } else {
      invSec.style.display = "none";
    }
  }

  // Show history layout for v2
  var layoutId = v2Spec ? (v2Spec.history_layout_id || v2Spec.specialty_id) : specKey;
  v2showHistoryLayout(layoutId);

  // Refresh summary after chip refill
  updateSelectedCount();
};

// ---- V2 Improved Selected Item Summary (showing grouped items) ----
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
    { id: "speedPlans", label: "Plans" }
  ];
  var total = 0;
  var html = "";
  for (var g = 0; g < groups.length; g++) {
    var container = document.getElementById(groups[g].id);
    if (!container) continue;
    var selected = container.querySelectorAll(".chip.selected");
    if (selected.length === 0) continue;
    var names = [];
    for (var s = 0; s < selected.length; s++) {
      names.push(selected[s].textContent);
    }
    total += selected.length;
    html += "<span><strong>" + groups[g].label + ":</strong> " + names.join(", ") + "</span>";
  }
  if (total === 0) {
    html = "<span>No quick items selected yet.</span>";
  }
  html += "<button class='btn btn-ghost btn-xs' onclick='v2clearAllSelections()' style='margin-left:auto'>Clear All</button>";
  summary.innerHTML = html;
};

function v2clearAllSelections() {
  var ids = ["speedSymptoms","speedNegs","speedExam","speedRedFlags","speedPlans","speedInvs"];
  for (var i = 0; i < ids.length; i++) {
    var c = document.getElementById(ids[i]);
    if (c) {
      var sel = c.querySelectorAll(".chip.selected");
      for (var j = 0; j < sel.length; j++) { sel[j].classList.remove("selected"); }
    }
  }
  updateSelectedCount();
}

// ---- Enhanced GenerateAllOutputs for V2 (includes investigations) ----
var _origGenerateAllOutputs = generateAllOutputs;
generateAllOutputs = function() {
  if (window.CLINICNOTE_DATA_MODE !== "v2") {
    _origGenerateAllOutputs();
    return;
  }
  // Get selected items
  var selectedSymptoms = getSelectedChips("speedSymptoms");
  var selectedNegs = getSelectedChips("speedNegs");
  var selectedExam = getSelectedChips("speedExam");
  var selectedRedFlags = getSelectedChips("speedRedFlags");
  var selectedInvs = getSelectedChips("speedInvs");
  var selectedPlans = getSelectedChips("speedPlans");

  var duration = document.getElementById("speedDuration").value.trim();
  var impression = document.getElementById("speedImpression").value.trim();
  var plan = document.getElementById("speedPlan").value.trim();
  var followup = document.getElementById("speedFollowup").value.trim();
  var refReason = document.getElementById("speedReferralReason").value.trim();
  var refSpecialty = document.getElementById("speedReferralSpecialty").value.trim();
  var specName = currentSpecialty;
  var visitName = currentVisitType;

  // Build text strings
  var sympStr = selectedSymptoms.join(", ") || "[not documented]";
  var negStr = selectedNegs.join(", ") || "[not documented]";
  var examStr = selectedExam.join(", ") || "[not documented]";
  var invStr = selectedInvs.join(", ") || "";
  var planPhrasesStr = selectedPlans.join(", ") || "";
  var dc = "Najm AI ClinicNote is an educational/productivity documentation assistant. All content must be reviewed and verified by a licensed clinician.\n\n";

  // Combine doctor plan + selected plan phrases
  var fullPlan = plan;
  if (planPhrasesStr && plan) {
    fullPlan = plan + "\n- " + planPhrasesStr;
  } else if (planPhrasesStr) {
    fullPlan = planPhrasesStr;
  }
  if (!fullPlan) fullPlan = "[doctor plan not documented]";

  // Red flags in output
  var rfStr = selectedRedFlags.join(", ") || "";

  // Impression
  var impStr = impression || "[doctor impression not documented]";

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
  outputs.inst += "Diagnosis: " + impStr + "\n\n";
  outputs.inst += "Doctor advice:\n" + plan + "\n\n";
  outputs.inst += "Medications:\n" + plan + "\n\n";
  outputs.inst += "When to seek help:\n" + rfStr + "\n\n";
  outputs.inst += "Follow-up: " + (followup || "As advised") + "\n";

  window._speedOutputs = outputs;
  window._activeSpeedTab = window._activeSpeedTab || "emr";
  renderSpeedOutput(window._activeSpeedTab);
};
