const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const analyticsPath = path.join(root, "analytics-safe.js");
const indexPath = path.join(root, "index.html");

const source = fs.readFileSync(analyticsPath, "utf8");
const indexSource = fs.readFileSync(indexPath, "utf8");

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log("PASS", name);
  } else {
    failures += 1;
    console.error("FAIL", name + (detail ? " - " + detail : ""));
  }
}

const forbiddenSourcePatterns = [
  { name: "no localStorage usage", pattern: /\blocalStorage\b/ },
  { name: "no sessionStorage usage", pattern: /\bsessionStorage\b/ },
  { name: "no cookie usage", pattern: /\bdocument\.cookie\b/ },
  { name: "no fetch calls", pattern: /\bfetch\s*\(/ },
  { name: "no XMLHttpRequest usage", pattern: /\bXMLHttpRequest\b/ },
  { name: "no sendBeacon usage", pattern: /\bsendBeacon\b/ },
  { name: "no WebSocket usage", pattern: /\bWebSocket\b/ },
  { name: "no EventSource usage", pattern: /\bEventSource\b/ },
  { name: "no image pixel constructor", pattern: /\bnew\s+Image\s*\(/ }
];

for (const item of forbiddenSourcePatterns) {
  check(item.name, !item.pattern.test(source));
}

const thirdPartyPatterns = [
  /googletagmanager/i,
  /google-analytics/i,
  /\bgtag\b/i,
  /\bdataLayer\b/,
  /\bPlausible\b/i,
  /\bplausible\s*\(/i,
  /\bposthog\b/i
];

check(
  "no third-party analytics references in app or module",
  !thirdPartyPatterns.some((pattern) => pattern.test(source) || pattern.test(indexSource))
);

const documentStub = {
  body: null,
  addEventListener() {},
  getElementById() {
    return null;
  },
  createElement() {
    return {
      style: {},
      appendChild() {},
      set textContent(value) {
        this._textContent = value;
      },
      get textContent() {
        return this._textContent || "";
      }
    };
  }
};

const sandbox = {
  window: {
    location: { search: "" },
    console
  },
  document: documentStub,
  URLSearchParams,
  Date,
  console
};
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "analytics-safe.js" });

const analytics = sandbox.window.ClinicNoteAnalytics;
check("analytics API exposed", !!analytics);
check("trackSafeEvent exposed", typeof analytics.trackSafeEvent === "function");
check("validateEventPayload exposed", typeof analytics.validateEventPayload === "function");
check("getSafeEventLog exposed", typeof analytics.getSafeEventLog === "function");
check("clearSafeEventLog exposed", typeof analytics.clearSafeEventLog === "function");

analytics.clearSafeEventLog();

const allowed = analytics.validateEventPayload("workflow_selected", {
  workflow_id: "diabetes-follow-up",
  specialty_id: "general-medicine",
  data_mode: "v2"
});
check("allowed event passes", allowed.ok === true);

const unknown = analytics.validateEventPayload("unsafe_event", {});
check("unknown event rejected", unknown.ok === false);

const badKey = analytics.validateEventPayload("output_generated", { note_text: "unsafe" });
check("forbidden property key rejected", badKey.ok === false);

const emailValue = analytics.validateEventPayload("feedback_clicked", { source_page: "doctor@example.com" });
check("email value rejected", emailValue.ok === false);

const phoneValue = analytics.validateEventPayload("feedback_clicked", { source_page: "+971 50 123 4567" });
check("phone value rejected", phoneValue.ok === false);

const mrnValue = analytics.validateEventPayload("feedback_clicked", { source_page: "MRN: ABC12345" });
check("MRN-like value rejected", mrnValue.ok === false);

const dobValue = analytics.validateEventPayload("feedback_clicked", { source_page: "DOB 01/01/1990" });
check("DOB-like value rejected", dobValue.ok === false);

const generatedOutputKey = analytics.validateEventPayload("output_generated", { generated_output: "SOAP NOTE text" });
check("generated output key rejected", generatedOutputKey.ok === false);

const roughNoteKey = analytics.validateEventPayload("output_generated", { rough_note: "patient note text" });
check("rough note key rejected", roughNoteKey.ok === false);

const customTextKey = analytics.validateEventPayload("output_generated", { custom_text: "custom symptom text" });
check("custom free text key rejected", customTextKey.ok === false);

const safeTrack = analytics.trackSafeEvent("output_generated", {
  tool_name: "opd_speed_mode",
  workflow_id: "diabetes-follow-up",
  output_type: "emr",
  data_mode: "v2"
});
const safeExportTrack = analytics.trackSafeEvent("output_exported_txt", {
  tool_name: "opd_speed_mode",
  output_type: "soap",
  data_mode: "v2"
});
const safeReportPrintTrack = analytics.trackSafeEvent("report_print_started", {
  tool_name: "medical_report_draft",
  report_type: "general",
  data_mode: "v2"
});
analytics.trackSafeEvent("output_generated", { output_text: "unsafe generated content" });
const log = analytics.getSafeEventLog();
check("safe event tracked", safeTrack.ok === true);
check("export events are allowlisted", safeExportTrack.ok === true && safeReportPrintTrack.ok === true);
check("event log stores only safe events", log.length === 3 && log[0].eventName === "output_generated" && log[1].eventName === "output_exported_txt" && log[2].eventName === "report_print_started");
check("event log excludes clinical/output text", JSON.stringify(log).indexOf("unsafe generated content") === -1);

if (failures > 0) {
  console.error(`Analytics safety validation failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log("Analytics safety validation passed.");
