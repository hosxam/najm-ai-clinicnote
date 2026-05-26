#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const v2 = fs.readFileSync(path.join(root, "v2_workflow_ui_2.js"), "utf8");
const v4 = fs.readFileSync(path.join(root, "v4_advanced_encounter.js"), "utf8");
const reportLandingPage = fs.readFileSync(path.join(root, "medical-report-draft-generator", "index.html"), "utf8");

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log("PASS: " + label);
    passed += 1;
  } else {
    console.error("FAIL: " + label);
    failed += 1;
  }
}

const helperStart = html.indexOf("function cleanFinalDraftText(text)");
const helperEnd = html.indexOf("</script>", helperStart);
check("final draft cleanup helper is present", helperStart >= 0 && helperEnd > helperStart);

const sandbox = { window: {} };
if (helperStart >= 0 && helperEnd > helperStart) {
  vm.runInNewContext(html.slice(helperStart, helperEnd), sandbox);
}
const clean = sandbox.window.cleanFinalDraftText;
check("final draft cleanup helper is executable", typeof clean === "function");

const unresolved = /\[[^\]\n]*(?:not documented|doctor impression not documented|doctor plan not documented|not requested\/documented|date to be entered by clinician|clinician review\/signature required)[^\]\n]*\]/i;

if (typeof clean === "function") {
  const quickOpd = clean(
    "SOAP NOTE\n\nSUBJECTIVE:\nDuration: [not documented]\nMain symptoms: fever, cough\n\n" +
    "OBJECTIVE:\nExamination: throat congestion\n\nASSESSMENT:\n[not documented]\n\n" +
    "PLAN:\nHydration advised\n"
  );
  check("Quick OPD omitted duration has no placeholder", !unresolved.test(quickOpd) && !/Duration:\s*$/m.test(quickOpd));
  check("Quick OPD omitted assessment removes empty section", quickOpd.indexOf("ASSESSMENT:") < 0);
  check("Quick OPD keeps entered content and populated headings", quickOpd.indexOf("SUBJECTIVE:\nMain symptoms") >= 0 && quickOpd.indexOf("PLAN:\nHydration advised") >= 0 && quickOpd.indexOf("fever, cough") >= 0);

  const advanced = clean(
    "SHORT EMR NOTE\n\nHistory:\nChest discomfort documented.\n\n" +
    "Assessment:\n[not documented]\n\nPlan:\nFollow-up arranged.\n"
  );
  check("Advanced output omits missing assessment", !unresolved.test(advanced) && advanced.indexOf("Assessment:") < 0);
  check("Advanced output keeps valid sections", advanced.indexOf("History:") >= 0 && advanced.indexOf("Plan:") >= 0 && advanced.indexOf("Chest discomfort documented.") >= 0 && advanced.indexOf("Follow-up arranged.") >= 0);

  const report = clean(
    "GENERAL CLINICAL SUMMARY DRAFT\n\nHistory:\nFever noted / [not documented]. [not documented]\n\n" +
    "Examination:\n[not documented]\n\nSignature / Review:\nReviewed and signed: [clinician review/signature required]\n[date to be entered by clinician]\n\n" +
    "Clinician review statement:\nReview before use.\n"
  );
  check("Medical Report removes unresolved placeholders", !unresolved.test(report));
  check("Medical Report omits empty sections and keeps real text", report.indexOf("Examination:") < 0 && report.indexOf("Fever noted") >= 0);
}

check("native Quick OPD outputs pass through final cleanup", /emr:\s*cleanFinalDraftText\(emr\)/.test(html) && /soap:\s*cleanFinalDraftText\(soap\)/.test(html));
check("V2 Quick OPD outputs pass through final cleanup", v2.indexOf("outputs[outputKey] = cleanFinalDraftText(outputs[outputKey])") >= 0);
check("Medical Report output passes through final cleanup", html.indexOf("return cleanFinalDraftText(out)") >= 0);
check("Medical Report public generated example has no unresolved placeholder", !unresolved.test(reportLandingPage));
check("Advanced Mode output passes through final cleanup", v4.indexOf("return finalAdvancedDraftText(draft)") >= 0);
check("Advanced Mode safety footer is not bracketed like a placeholder", v4.indexOf("[Draft generated from clinician-entered information.") < 0);

console.log("\n=== Final Draft Placeholder Output Tests ===");
console.log("Passed: " + passed);
console.log("Failed: " + failed);
process.exit(failed ? 1 : 0);
