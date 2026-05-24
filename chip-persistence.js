/*
 * ClinicNote chip persistence (revised).
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

    // V2 mode: chips live inside #v2ChipGroups with data-container attributes
    var v2Area = document.getElementById("v2ChipGroups");
    if (v2Area && v2Area.style.display !== "none") {
      var selected = v2Area.querySelectorAll(".chip.selected");
      for (var i = 0; i < selected.length; i++) {
        var container = selected[i].getAttribute("data-container") || "unknown";
        var txt = (selected[i].textContent || "").trim();
        if (txt) {
          if (!out[container]) out[container] = [];
          out[container].push(txt);
          hasAny = true;
        }
      }
      return hasAny ? out : null;
    }

    // Fallback: legacy v1 mode with individual containers
    for (var j = 0; j < V2_CONTAINERS.length; j++) {
      var id = V2_CONTAINERS[j];
      var container2 = document.getElementById(id);
      if (!container2) continue;
      var sel = container2.querySelectorAll(".chip.selected");
      var arr = [];
      for (var k = 0; k < sel.length; k++) {
        var t = (sel[k].textContent || "").trim();
        if (t) { arr.push(t); hasAny = true; }
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

    // V2 mode: chips live inside #v2ChipGroups with data-container attributes
    var v2Area = document.getElementById("v2ChipGroups");
    if (v2Area && v2Area.style.display !== "none") {
      var allChips = v2Area.querySelectorAll(".chip");
      for (var i = 0; i < allChips.length; i++) {
        var container = allChips[i].getAttribute("data-container") || "unknown";
        var label = (allChips[i].textContent || "").trim().toLowerCase();
        if (selections[container]) {
          for (var s = 0; s < selections[container].length; s++) {
            if (selections[container][s].trim().toLowerCase() === label) {
              allChips[i].classList.add("selected");
              break;
            }
          }
        }
      }
      // Update count display
      if (typeof updateSelectedCount === "function") {
        try { updateSelectedCount(); } catch (e) {}
      }
      lastSpecialty = specialty;
      lastVisitType = visitType;
      return;
    }

    // Fallback: legacy v1 containers
    for (var j = 0; j < V2_CONTAINERS.length; j++) {
      var id = V2_CONTAINERS[j];
      if (!selections[id] || !selections[id].length) continue;
      var cont = document.getElementById(id);
      if (!cont) continue;

      var wanted = {};
      for (var w = 0; w < selections[id].length; w++) {
        wanted[selections[id][w].trim().toLowerCase()] = true;
      }

      var chips = cont.querySelectorAll(".chip");
      for (var c = 0; c < chips.length; c++) {
        var lbl = (chips[c].textContent || "").trim().toLowerCase();
        if (wanted[lbl]) {
          chips[c].classList.add("selected");
          chips[c].setAttribute("aria-pressed", "true");
        }
      }
    }

    lastSpecialty = specialty;
    lastVisitType = visitType;
  }

  // --- Chip click: save after selection ---
  var saveTimer = null;
  function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      lastSpecialty = getCurrentSpecialty();
      lastVisitType = getCurrentVisitType();
      console.log("[chip-persist] saving for:", lastSpecialty, "|", lastVisitType);
      var sel = readSelections();
      console.log("[chip-persist] selections:", sel);
      if (sel) {
        saveFor(lastSpecialty, lastVisitType, sel);
        console.log("[chip-persist] saved OK");
      } else {
        console.log("[chip-persist] nothing to save (no selections found)");
      }
    }, 300);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.classList) return;
    if (t.classList.contains("chip") || (t.closest && t.closest(".chip"))) {
      console.log("[chip-persist] chip clicked, scheduling save");
      debouncedSave();
    }
  }, true);

  // --- MutationObserver: detect when chips are rendered ---
  // This is the reliable way to know when fillChips() has run,
  // regardless of how loadSpeedVisit is called (inline onchange, etc.)
  var speedContent = null;
  var observer = null;

  function setupObserver() {
    // Watch v2ChipGroups (the actual chip container in v2 mode)
    var v2Area = document.getElementById("v2ChipGroups");
    var speedContent = document.getElementById("speedContent");
    var target = v2Area || speedContent;
    if (!target) return;

    observer = new MutationObserver(function () {
      var newSpecialty = getCurrentSpecialty();
      var newVisitType = getCurrentVisitType();
      console.log("[chip-persist] DOM mutation detected, specialty:", newSpecialty, "visit:", newVisitType);

      if (newSpecialty && newVisitType) {
        lastSpecialty = newSpecialty;
        lastVisitType = newVisitType;
        setTimeout(function () {
          console.log("[chip-persist] attempting restore for:", newSpecialty, "|", newVisitType);
          restoreCurrentState();
        }, 60);
      }
    });

    observer.observe(target, { childList: true, subtree: true });
    console.log("[chip-persist] observer attached to:", target.id);
  }

  // --- Specialty change: save before chips are wiped ---
  // Use capturing phase to fire BEFORE the onchange handler runs loadSpeedSpecialty
  var specialtyEl = null;

  function setupSpecialtyListener() {
    specialtyEl = document.getElementById("speedSpecialty");
    if (!specialtyEl) return;

    // mousedown/pointerdown fires BEFORE the value changes
    specialtyEl.addEventListener("mousedown", function () {
      saveCurrentState();
    });
    specialtyEl.addEventListener("touchstart", function () {
      saveCurrentState();
    });
    // Also save on focus (covers keyboard navigation)
    specialtyEl.addEventListener("focus", function () {
      saveCurrentState();
    });
  }

  // --- Visit type change: save old state before new chips load ---
  var visitTypeEl = null;

  function setupVisitTypeListener() {
    visitTypeEl = document.getElementById("speedVisitType");
    if (!visitTypeEl) return;

    visitTypeEl.addEventListener("mousedown", function () {
      saveCurrentState();
    });
    visitTypeEl.addEventListener("touchstart", function () {
      saveCurrentState();
    });
    visitTypeEl.addEventListener("focus", function () {
      saveCurrentState();
    });
  }

  // --- Initialize ---
  function init() {
    lastSpecialty = getCurrentSpecialty();
    lastVisitType = getCurrentVisitType();
    console.log("[chip-persist] init, specialty:", lastSpecialty, "visit:", lastVisitType);
    console.log("[chip-persist] speedContent element:", !!document.getElementById("speedContent"));

    setupObserver();
    setupSpecialtyListener();
    setupVisitTypeListener();

    if (lastSpecialty && lastVisitType) {
      setTimeout(restoreCurrentState, 300);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Save before page unload
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
