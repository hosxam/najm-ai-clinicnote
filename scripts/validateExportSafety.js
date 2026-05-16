const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const exportPath = path.join(root, "export-local.js");
const indexPath = path.join(root, "index.html");

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log("PASS", name);
  } else {
    failures += 1;
    console.error("FAIL", name + (detail ? " - " + detail : ""));
  }
}

check("export-local.js exists", fs.existsSync(exportPath));

const source = fs.existsSync(exportPath) ? fs.readFileSync(exportPath, "utf8") : "";
const indexSource = fs.readFileSync(indexPath, "utf8");

const forbiddenSourcePatterns = [
  { name: "no fetch calls", pattern: /\bfetch\s*\(/ },
  { name: "no XMLHttpRequest usage", pattern: /\bXMLHttpRequest\b/ },
  { name: "no sendBeacon usage", pattern: /\bsendBeacon\b/ },
  { name: "no WebSocket usage", pattern: /\bWebSocket\b/ },
  { name: "no EventSource usage", pattern: /\bEventSource\b/ },
  { name: "no localStorage usage", pattern: /\blocalStorage\b/ },
  { name: "no sessionStorage usage", pattern: /\bsessionStorage\b/ },
  { name: "no cookie usage", pattern: /\bdocument\.cookie\b/ }
];

for (const item of forbiddenSourcePatterns) {
  check(item.name, !item.pattern.test(source));
}

const thirdPartyExportPatterns = [
  /jspdf/i,
  /pdfmake/i,
  /html2canvas/i,
  /cloudconvert/i,
  /api2pdf/i,
  /pdfcrowd/i,
  /docraptor/i
];

check(
  "no third-party export scripts",
  !thirdPartyExportPatterns.some((pattern) => pattern.test(source) || pattern.test(indexSource))
);

check(
  "review footer exists",
  source.includes("Draft generated from clinician-entered de-identified information. Review, edit, and approve before use.")
);
check("TXT export uses Blob", /\bnew\s+Blob\s*\(/.test(source));
check("TXT export uses object URL", /\bURL\.createObjectURL\s*\(/.test(source));
check("TXT export revokes object URL", /\bURL\.revokeObjectURL\s*\(/.test(source));
check("print export uses browser print", /\.print\s*\(/.test(source));
check("print export does not reference external service", !/https?:\/\//i.test(source));

check("export helper script included", indexSource.includes("./export-local.js?v=local-export"));
check("OPD Export TXT button exists", /onclick="exportSpeedText\(\)"/.test(indexSource));
check("OPD Print button exists", /onclick="printSpeedOutput\(\)"/.test(indexSource));
check("Report Export TXT button exists", /onclick="exportMedicalReportText\(\)"/.test(indexSource));
check("Report Print button exists", /onclick="printMedicalReport\(\)"/.test(indexSource));
check(
  "local export privacy note exists",
  indexSource.includes("Exports are created locally in your browser. Nothing is uploaded or stored by Najm AI.")
);

const documentStub = {
  body: {
    appendChild() {},
    removeChild() {}
  },
  createElement() {
    return {
      style: {},
      setAttribute() {},
      click() {},
      contentDocument: {
        open() {},
        write() {},
        close() {}
      },
      contentWindow: {
        document: { open() {}, write() {}, close() {} },
        focus() {},
        print() {}
      }
    };
  }
};

const sandbox = {
  window: {},
  document: documentStub,
  Blob: function Blob(parts, options) {
    this.parts = parts;
    this.options = options;
  },
  URL: {
    createObjectURL() {
      return "blob:clinicnote-test";
    },
    revokeObjectURL() {}
  },
  setTimeout(fn) {
    if (typeof fn === "function") fn();
  }
};
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "export-local.js" });

const helper = sandbox.window.ClinicNoteExport;
check("ClinicNoteExport API exposed", !!helper);
check("exportTextFile exposed", helper && typeof helper.exportTextFile === "function");
check("printOutput exposed", helper && typeof helper.printOutput === "function");
check("buildExportDocument exposed", helper && typeof helper.buildExportDocument === "function");
check("sanitizeFilename exposed", helper && typeof helper.sanitizeFilename === "function");
check("getReviewFooter exposed", helper && typeof helper.getReviewFooter === "function");

if (helper) {
  check("sanitizeFilename strips unsafe filename characters", helper.sanitizeFilename("Clinic Note: SOAP / Today") === "clinic-note-soap-today");
  const doc = helper.buildExportDocument("Najm AI ClinicNote - EMR", "SHORT EMR NOTE\nExample body", {
    Tool: "OPD Speed Mode",
    "Output type": "EMR"
  });
  check("print document includes title", doc.includes("Najm AI ClinicNote - EMR"));
  check("print document includes review footer", doc.includes(helper.getReviewFooter()));
  check("print document excludes analytics debug log wording", !/Analytics dry-run|ClinicNoteAnalytics|safeEventLog/.test(doc));
}

if (failures > 0) {
  console.error(`Export safety validation failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log("Export safety validation passed.");

