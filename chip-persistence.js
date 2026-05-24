/*
 * ClinicNote chip persistence (Step 2).
 *
 * Persists user chip selections (v2 speed mode + v4 Advanced Mode) across page
 * reloads using localStorage. Same-workflow only — switching specialty or
 * workflow clears stale state. Auto-expires after 24h.
 *
 * Storage key: clinicnote-chips-v1
 * Stored shape: {
 *   ts: <epoch ms>,
 *   workflow: "<specialty>|<v4WorkflowId>",
 *   v2: { speedSymptoms: ["..."], speedNegs: [...], ... },
 *   v4: { symptoms: [...], relevant_negatives: [...], ... },
 *   customEntries: { symptoms: [...], ... }
 * }
 *
 * Privacy note: chip texts are short clinical templates (e.g. "Pleuritic chest
 * pain"). They contain no patient identifiers and never leave the device.
 */
(function () {
  "use strict";

  var KEY_PREFIX = "clinicnote-chips-";
  var EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
  var V2_CONTAINERS = [
    "speedSymptoms",
    "speedNegs",
    "speedExam",
    "speedRedFlags",
    "speedInvs",
    "speedPlans"
  ];
  var SAVE_DEBOUNCE_MS = 80;

  function getKey() { return KEY_PREFIX + getCurrentWorkflowKey(); }
  function safeGet() {
    try { return localStorage.getItem(getKey()); } catch (e) { return null; }
  }
  function safeSet(value) {
    try { localStorage.setItem(getKey(), value); } catch (e) {}
  }
  function safeRemove() {
    try { localStorage.removeItem(getKey()); } catch (e) {}
  }

  function getCurrentWorkflowKey() {
    var specialty = "";
    var s = document.getElementById("speedSpecialty");
    if (s && s.value) specialty = String(s.value);
    var v4wf = "";
    if (window.V4_ENCOUNTER_STATE && window.V4_ENCOUNTER_STATE.workflowId) {
      v4wf = String(window.V4_ENCOUNTER_STATE.workflowId);
    }
    return specialty + "|" + v4wf;
  }

  function readV2Selections() {
    var out = {};
    for (var i = 0; i < V2_CONTAINERS.length; i++) {
      var id = V2_CONTAINERS[i];
      var c = document.getElementById(id);
      if (!c) continue;
      var nodes = c.querySelectorAll(".chip.selected, .chip[aria-pressed=\"true\"]");
      var arr = [];
      for (var j = 0; j < nodes.length; j++) {
        var t = (nodes[j].textContent || "").trim();
        if (t) arr.push(t);
      }
      out[id] = arr;
    }
    return out;
  }

  function snapshot() {
    var data = {
      ts: Date.now(),
      workflow: getCurrentWorkflowKey(),
      v2: readV2Selections(),
      v4: {},
      customEntries: {}
    };
    if (window.V4_ENCOUNTER_STATE && window.V4_ENCOUNTER_STATE.selectedChips) {
      try { data.v4 = JSON.parse(JSON.stringify(window.V4_ENCOUNTER_STATE.selectedChips)); } catch (e) {}
    }
    if (window.V4_ENCOUNTER_STATE && window.V4_ENCOUNTER_STATE.customEntries) {
      try { data.customEntries = JSON.parse(JSON.stringify(window.V4_ENCOUNTER_STATE.customEntries)); } catch (e) {}
    }
    return data;
  }

  var saveTimer = null;
  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { safeSet(JSON.stringify(snapshot())); } catch (e) {}
    }, SAVE_DEBOUNCE_MS);
  }

  function restore() {
    var raw = safeGet();
    if (!raw) return;
    var data;
    try { data = JSON.parse(raw); } catch (e) { safeRemove(); return; }
    if (!data || typeof data.ts !== "number") { safeRemove(); return; }
    if (Date.now() - data.ts > EXPIRY_MS) { safeRemove(); return; }

    // Restore v2 chips by re-applying .selected class on text-matched chips.
    var v2 = data.v2 || {};
    Object.keys(v2).forEach(function (id) {
      var c = document.getElementById(id);
      if (!c) return;
      var wanted = {};
      var list = v2[id] || [];
      for (var i = 0; i < list.length; i++) {
        var t = (list[i] || "").trim().toLowerCase();
        if (t) wanted[t] = true;
      }
      var chips = c.querySelectorAll(".chip");
      for (var k = 0; k < chips.length; k++) {
        var label = (chips[k].textContent || "").trim().toLowerCase();
        if (wanted[label]) {
          chips[k].classList.add("selected");
          chips[k].setAttribute("aria-pressed", "true");
        }
      }
    });

    // Restore v4 selectedChips and customEntries in-place (avoid replacing the object reference).
    if (window.V4_ENCOUNTER_STATE) {
      var s = window.V4_ENCOUNTER_STATE.selectedChips;
      if (s && data.v4) {
        Object.keys(data.v4).forEach(function (g) {
          if (Array.isArray(data.v4[g]) && Array.isArray(s[g])) {
            s[g].length = 0;
            for (var i = 0; i < data.v4[g].length; i++) s[g].push(data.v4[g][i]);
          }
        });
      }
      var ce = window.V4_ENCOUNTER_STATE.customEntries;
      if (ce && data.customEntries) {
        Object.keys(data.customEntries).forEach(function (g) {
          if (Array.isArray(data.customEntries[g]) && Array.isArray(ce[g])) {
            ce[g].length = 0;
            for (var i = 0; i < data.customEntries[g].length; i++) ce[g].push(data.customEntries[g][i]);
          }
        });
      }

      // Re-apply .active class to v4 chip buttons that match restored selections.
      var allActive = {};
      Object.keys(data.v4 || {}).forEach(function (g) {
        (data.v4[g] || []).forEach(function (txt) {
          allActive[(txt || "").trim().toLowerCase()] = true;
        });
      });
      var btns = document.querySelectorAll(".v4-chip-btn");
      for (var bi = 0; bi < btns.length; bi++) {
        var label = (btns[bi].textContent || "").trim().toLowerCase();
        btns[bi].classList.toggle("active", !!allActive[label]);
      }

      // Refresh count badges if helper exists.
      if (typeof window.updateSidebar === "function") {
        try { window.updateSidebar(); } catch (e) {}
      }
    }
  }

  // Save after any chip click (event delegation handles both v2 and v4).
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.classList) return;
    var isChip = t.classList.contains("chip") ||
                 t.classList.contains("v4-chip-btn") ||
                 (t.closest && (t.closest(".chip") || t.closest(".v4-chip-btn")));
    if (isChip) save();
  }, true);

  // Save when a custom entry is added in v4 (hook the existing global helper).
  function wrapV4Helpers() {
    if (typeof window._v4AddCustomEntry === "function" && !window._v4AddCustomEntry._chipPersistWrapped) {
      var orig = window._v4AddCustomEntry;
      window._v4AddCustomEntry = function () {
        var r = orig.apply(this, arguments);
        save();
        return r;
      };
      window._v4AddCustomEntry._chipPersistWrapped = true;
    }
  }
  // Helpers may be defined after this script loads; retry briefly.
  var wrapAttempts = 0;
  (function tryWrap() {
    wrapV4Helpers();
    if (++wrapAttempts < 20 && (!window._v4AddCustomEntry || !window._v4AddCustomEntry._chipPersistWrapped)) {
      setTimeout(tryWrap, 250);
    }
  })();

  // Workflow change: save current state under the old workflow key before switching.
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "speedSpecialty") {
      // Force an immediate save of the current state (old specialty) before the UI resets.
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = null;
      try { safeSet(JSON.stringify(snapshot())); } catch (ex) {}
      // After the new chips render, restore any saved state for the new workflow.
      setTimeout(restore, 800);
      setTimeout(restore, 1800);
    }
  }, true);

  // Restore once chips have rendered. Run on DOM ready and again after a short
  // delay to catch dynamically-rendered chip groups.
  function scheduleRestore() {
    setTimeout(restore, 600);
    setTimeout(restore, 1500);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRestore);
  } else {
    scheduleRestore();
  }

  // Expose for debugging / explicit clear.
  window.ClinicNoteChipPersistence = {
    save: save,
    restore: restore,
    clear: safeRemove,
    snapshot: snapshot
  };
})();
