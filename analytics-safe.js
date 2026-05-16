(function(){
  "use strict";

  var allowedEvents = {
    page_view:true,
    seo_page_view:true,
    tool_started:true,
    workflow_search_used:true,
    specialty_selected:true,
    workflow_selected:true,
    chip_selected_count_bucket:true,
    custom_entry_count_bucket:true,
    output_generated:true,
    output_copied:true,
    output_exported_txt:true,
    output_print_started:true,
    clear_all_clicked:true,
    phi_warning_triggered:true,
    report_module_opened:true,
    report_type_selected:true,
    report_draft_generated:true,
    report_copied:true,
    report_exported_txt:true,
    report_print_started:true,
    report_cleared:true,
    report_phi_warning_triggered:true,
    feedback_clicked:true,
    template_request_clicked:true,
    future_scribe_interest_clicked:true
  };

  var allowedProperties = {
    page_path:true,
    page_type:true,
    tool_name:true,
    specialty_id:true,
    workflow_id:true,
    output_type:true,
    report_type:true,
    count_bucket:true,
    data_mode:true,
    source_page:true,
    cta_location:true,
    phi_warning_shown:true
  };

  var forbiddenKeys = {
    clinical_note:true,
    clinicalnote:true,
    note:true,
    note_text:true,
    rough_note:true,
    roughnote:true,
    generated_output:true,
    generatedoutput:true,
    output_text:true,
    outputtext:true,
    custom_text:true,
    customtext:true,
    selected_chip_text:true,
    selectedchiptext:true,
    chip_text:true,
    chiptext:true,
    symptoms:true,
    negatives:true,
    exam:true,
    investigations:true,
    plan:true,
    follow_up:true,
    followup:true,
    impression:true,
    doctor_impression:true,
    doctor_plan:true,
    patient_name:true,
    patientname:true,
    mrn:true,
    dob:true,
    email:true,
    phone:true,
    address:true,
    emirates_id:true,
    emiratesid:true,
    insurance_id:true,
    insuranceid:true
  };

  var safeEventLog = [];

  function normalizeKey(key){
    return String(key || "").replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_+|_+$/g,"").toLowerCase();
  }

  function hasSuspiciousValue(value){
    if(value === null || value === undefined) return false;
    var text = String(value);
    var patterns = [
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      /(\+?\d[\d\s().-]{7,}\d)/,
      /\b(MRN|medical\s*record|record\s*number|patient\s*id)\s*[:#-]?\s*[A-Za-z0-9-]{3,}\b/i,
      /\b(DOB|date\s*of\s*birth|d\.?\s*o\.?\s*b\.?)\b/i,
      /\b784[-\s]?\d{4}[-\s]?\d{7}[-\s]?\d\b/
    ];
    for(var i=0;i<patterns.length;i++){
      if(patterns[i].test(text)) return true;
    }
    return false;
  }

  function safeCopyProperties(properties){
    var out = {};
    var input = properties || {};
    if(Object.prototype.toString.call(input) !== "[object Object]"){
      return {error:"Properties must be a plain object."};
    }
    for(var key in input){
      if(!Object.prototype.hasOwnProperty.call(input,key)) continue;
      var normalized = normalizeKey(key);
      if(forbiddenKeys[normalized]){
        return {error:"Forbidden property key rejected: "+key};
      }
      if(!allowedProperties[key]){
        return {error:"Unknown property key rejected: "+key};
      }
      var value = input[key];
      var valueType = typeof value;
      if(value !== null && valueType !== "string" && valueType !== "number" && valueType !== "boolean"){
        return {error:"Property value must be string, number, boolean, or null: "+key};
      }
      if(hasSuspiciousValue(value)){
        return {error:"Suspicious identifier-like value rejected for: "+key};
      }
      out[key] = value;
    }
    return {properties:out};
  }

  function validateEventPayload(eventName, properties){
    if(!allowedEvents[eventName]){
      return {ok:false,reason:"Unknown event rejected: "+eventName};
    }
    var copied = safeCopyProperties(properties || {});
    if(copied.error){
      return {ok:false,reason:copied.error};
    }
    return {ok:true,eventName:eventName,properties:copied.properties};
  }

  function shouldShowDebug(){
    try {
      var search = (window.location && window.location.search) || "";
      return new URLSearchParams(search).get("analytics_debug") === "1";
    } catch(e) {
      return false;
    }
  }

  function renderDebugPanel(){
    if(!shouldShowDebug() || !document || !document.body) return;
    var panel = document.getElementById("clinicnoteAnalyticsDebug");
    if(!panel){
      panel = document.createElement("div");
      panel.id = "clinicnoteAnalyticsDebug";
      panel.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:9999;width:min(420px,calc(100vw - 24px));max-height:320px;overflow:auto;background:#fff;border:1px solid #cbd5e1;border-radius:10px;box-shadow:0 16px 40px rgba(15,23,42,.18);padding:10px;font:12px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a";
      var header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;font-weight:700";
      var title = document.createElement("span");
      title.textContent = "Analytics dry-run";
      var clear = document.createElement("button");
      clear.type = "button";
      clear.textContent = "Clear";
      clear.style.cssText = "font:inherit;font-size:11px;border:1px solid #cbd5e1;background:#f8fafc;border-radius:6px;padding:3px 8px;cursor:pointer";
      clear.onclick = clearSafeEventLog;
      header.appendChild(title);
      header.appendChild(clear);
      var pre = document.createElement("pre");
      pre.id = "clinicnoteAnalyticsDebugLog";
      pre.style.cssText = "white-space:pre-wrap;word-break:break-word;margin:0;background:#f8fafc;border-radius:8px;padding:8px;max-height:240px;overflow:auto";
      panel.appendChild(header);
      panel.appendChild(pre);
      document.body.appendChild(panel);
    }
    var log = document.getElementById("clinicnoteAnalyticsDebugLog");
    if(log){
      log.textContent = JSON.stringify(safeEventLog,null,2);
    }
  }

  function trackSafeEvent(eventName, properties){
    var validation = validateEventPayload(eventName, properties || {});
    if(!validation.ok){
      if(shouldShowDebug() && window.console && window.console.warn){
        window.console.warn("ClinicNote analytics event rejected:", validation.reason);
      }
      return validation;
    }
    safeEventLog.push({
      eventName:validation.eventName,
      properties:validation.properties,
      timestamp:new Date().toISOString()
    });
    renderDebugPanel();
    return validation;
  }

  function getSafeEventLog(){
    return safeEventLog.slice();
  }

  function clearSafeEventLog(){
    safeEventLog.length = 0;
    renderDebugPanel();
  }

  window.ClinicNoteAnalytics = {
    trackSafeEvent:trackSafeEvent,
    validateEventPayload:validateEventPayload,
    getSafeEventLog:getSafeEventLog,
    clearSafeEventLog:clearSafeEventLog
  };

  if(document && document.addEventListener){
    document.addEventListener("DOMContentLoaded",renderDebugPanel);
  }
})();
