(function() {
  "use strict";

  function isEnabled() {
    var params = new URLSearchParams(window.location.search);
    return params.get("v3") === "workbench" && window.CLINICNOTE_DATA_MODE === "v2";
  }

  function panel() {
    return document.getElementById("v3WorkbenchBanner");
  }

  function render() {
    var p = panel();
    if (!p) return;
    if (!isEnabled()) {
      p.classList.remove("v3-workbench-visible");
      p.style.display = "none";
      p.innerHTML = "";
      return;
    }
    p.classList.add("v3-workbench-visible");
    p.style.display = "block";
    p.innerHTML =
      '<div class="v3-history-title">Internal V3 Workbench Preview</div>' +
      '<div class="v3-history-subtitle">Internal review mode combining V3 history capture, exam checklist, plan checklist, and optional low-risk calculator suggestions beside the existing OPD workflow.</div>' +
      '<div class="v3-history-safety">Internal preview only. Draft panels do not generate OPD notes, insert calculator results, diagnose, recommend treatment, store data, or send clinical text anywhere.</div>';
  }

  window.ClinicNoteV3Workbench = {
    isEnabled: isEnabled,
    render: render
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
  window.addEventListener("load", render);
})();
