/*
 * ClinicNote chip persistence (Step 2 — revised).
 *
 * Persists chip selections per specialty+visitType so switching workflows
 * and coming back restores your previous selections. Uses localStorage
 * with 24h auto-expiry. No patient data is stored — only chip label text.
 */
(function () {
  "use strict";

  var KEY_PREFIX = "cn-chips-";
  var EXPIRY_MS = 24 * 60 * 60 * 1000;
  var V2_CONTAINERS = [
    "speedSymptoms",
    "speedNegs",
    "speedExam",
    "speedRedFlags",
    "speedInvs",
    "speedPlans"
  ];

  // --- Storage helpers ---
  function makeKey(specialty, visitType) {
    return KEY_PREFIX + (specialty || "") + "|" + (visitType || "");
  }

  function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSetItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // --- State tracking ---
  // We track the "last active" specialty+visitType so we can save
  // BEFORE the UI wipes the chips on navigation.
  var lastSpecialty = "";
  var lastVisitType = "";

  function getCurrentSpecialty() {
    var el = document.getElementById("speedSpecialty");
    return el ? el.value || "" : "";
  }
  function getCurrentVisitType() {
    var el = document.getElementById("speedVisitType");
    return el ? el.value || "" : "";
  }

  // --- Read current chip selections from the DOM ---
  function readSelections() {
    var out = {};
    var hasAny = false;
    for (var i = 0; i < V2_CONTAINERS.length; i++) {
      var id = V2_CONTAINERS[i];
      var container = document.getElementById(id);
      if (!container) continue;
      var selected = container.querySelectorAll(".chip.selected, .chip[aria-pressed='true']");
      var arr = [];
      for (var j = 0; j < selected.length; j++) {
        var txt = (selected[j].textContent || "").trim();
        if (txt) { arr.push(txt); hasAny = true; }
      }
      if (arr.length) out[id] = arr;
    }
    return hasAny ? out : null;
  }

  // --- Save selections for a given specialty+visitType ---
  function saveFor(specialty, visitType, selections) {
    if (!specialty || !visitType || !selections) return;
    var key = makeKey(specialty, visitType);
    var data = { ts: Date.now(), selections: selections };
    safeSetItem(key, JSON.stringify(data));
  }

  // Save the current visible state under lastSpecialty/lastVisitType
  function saveCurrentState() {
    if (!lastSpecialty || !lastVisitType) return;
    var sel = readSelections();
    if (sel) {
      saveFor(lastSpecialty, lastVisitType, sel);
    }
  }

  // --- Restore selections for the current specialty+visitType ---
  function restoreCurrentState() {
    var specialty = getCurrentSpecialty();
    var visitType = getCurrentVisitType();
    if (!specialty || !visitType) return;

    var key = makeKey(specialty, visitType);
    var raw = safeGetItem(key);
    if (!raw) return;

    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    if (!data || !data.ts || !data.selections) return;
    if (Date.now() - data.ts > EXPIRY_MS) return;

    var selections = data.selections;
    for (var i = 0; i < V2_CONTAINERS.length; i++) {
      var id = V2_CONTAINERS[i];
      if (!selections[id] || !selections[id].length) continue;
      var container = document.getElementById(id);
      if (!container) continue;

      // Build a lookup of wanted chip texts
      var wanted = {};
      for (var w = 0; w < selections[id].length; w++) {
        wanted[selections[id][w].trim().toLowerCase()] = true;
      }

      // Apply .selected to matching chips
      var chips = container.querySelectorAll(".chip");
      for (var c = 0; c < chips.length; c++) {
        var label = (chips[c].textContent || "").trim().toLowerCase();
        if (wanted[label]) {
          chips[c].classList.add("selected");
          chips[c].setAttribute("aria-pressed", "true");
        }
      }
    }

    // Update tracking
    lastSpecialty = specialty;
    lastVisitType = visitType;
  }

  // --- Hook into the app's workflow ---

  // 1. Save on every chip click (debounced)
  var saveTimer = null;
  function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      lastSpecialty = getCurrentSpecialty();
      lastVisitType = getCurrentVisitType();
      saveCurrentState();
    }, 150);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.classList) return;
    if (t.classList.contains("chip") || (t.closest && t.closest(".chip"))) {
      debouncedSave();
    }
  }, true);

  // 2. Hook loadSpeedVisit — after chips render, restore saved state.
  //    We wrap the global function so we run after fillChips() completes.
  function hookLoadSpeedVisit() {
    if (typeof window.loadSpeedVisit !== "function") return false;
    if (window.loadSpeedVisit._chipPersistHooked) return true;

    var original = window.loadSpeedVisit;
    window.loadSpeedVisit = function () {
      // Before loading new visit, save current selections
      saveCurrentState();

      // Call original (renders new chips)
      original.apply(this, arguments);

      // Update tracking to new state
      lastSpecialty = getCurrentSpecialty();
      lastVisitType = getCurrentVisitType();

      // Restore after a brief delay (chips just rendered via fillChips)
      setTimeout(restoreCurrentState, 50);
    };
    window.loadSpeedVisit._chipPersistHooked = true;
    return true;
  }

  // 3. Hook loadSpeedSpecialty — save before specialty wipes chips
  function hookLoadSpeedSpecialty() {
    if (typeof window.loadSpeedSpecialty !== "function") return false;
    if (window.loadSpeedSpecialty._chipPersistHooked) return true;

    var original = window.loadSpeedSpecialty;
    window.loadSpeedSpecialty = function () {
      // Save current state before the specialty change wipes everything
      saveCurrentState();
      // Call original
      original.apply(this, arguments);
      // Update tracking (visit type is now empty)
      lastSpecialty = getCurrentSpecialty();
      lastVisitType = "";
    };
    window.loadSpeedSpecialty._chipPersistHooked = true;
    return true;
  }

  // Try hooking immediately and retry if functions aren't defined yet
  var hookAttempts = 0;
  (function tryHook() {
    var a = hookLoadSpeedVisit();
    var b = hookLoadSpeedSpecialty();
    if ((!a || !b) && ++hookAttempts < 30) {
      setTimeout(tryHook, 200);
    }
  })();

  // 4. On initial page load, restore if a workflow is already selected
  function initialRestore() {
    lastSpecialty = getCurrentSpecialty();
    lastVisitType = getCurrentVisitType();
    if (lastSpecialty && lastVisitType) {
      setTimeout(restoreCurrentState, 300);
      setTimeout(restoreCurrentState, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialRestore);
  } else {
    initialRestore();
  }

  // 5. Save before page unload
  window.addEventListener("beforeunload", function () {
    saveCurrentState();
  });

  // Expose for debugging
  window.ClinicNoteChipPersistence = {
    save: saveCurrentState,
    restore: restoreCurrentState,
    clear: function () {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(KEY_PREFIX) === 0) keys.push(k);
        }
        keys.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    },
    debug: function () {
      var out = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(KEY_PREFIX) === 0) {
            out[k] = JSON.parse(localStorage.getItem(k));
          }
        }
      } catch (e) {}
      return out;
    }
  };
})();
