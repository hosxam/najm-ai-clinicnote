const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const registryPath = path.join(ROOT, "data", "v3_calculator_registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const failures = [];
const passed = [];

function fail(label, message) {
  failures.push(`${label}: ${message}`);
}

function pass(label) {
  passed.push(label);
}

function assert(condition, label, message) {
  if (!condition) fail(label, message);
}

function assertEqual(actual, expected, label, field) {
  if (actual !== expected) {
    fail(label, `${field} expected ${expected}, got ${actual}`);
  }
}

function assertApprox(actual, expected, tolerance, label, field) {
  if (Math.abs(actual - expected) > tolerance) {
    fail(label, `${field} expected ${expected} +/- ${tolerance}, got ${actual}`);
  }
}

function outputText(result) {
  if (!result) return "";
  return [
    result.text,
    result.safetyNote,
    result.interpretation,
    result.safetyNotice,
    result.risk,
    result.label
  ].filter(Boolean).join(" ");
}

const unsafeOutputPatterns = [
  /\bprescribe\b/i,
  /start antibiotic/i,
  /start insulin/i,
  /give IV/i,
  /send to ER/i,
  /call emergency services/i,
  /urgent admission required/i,
  /antibiotics recommended/i,
  /CT required/i,
  /PE likely, treat/i,
  /recommended treatment/i,
  /treatment recommendation/i,
  /\bmust admit\b/i,
  /\bmust discharge\b/i,
  /\bdiagnosed with\b/i,
  /\bdiagnosis:\b/i
];

function assertSafeOutput(result, label) {
  const text = outputText(result);
  assert(text.length > 0, label, "output text/safety text is empty");
  for (const pattern of unsafeOutputPatterns) {
    assert(!pattern.test(text), label, `unsafe output phrase matched ${pattern}`);
  }
  assert(
    /document|documentation|clinician|clinical assessment|local protocol|screening/i.test(text),
    label,
    "output lacks documentation-support or clinician-interpretation wording"
  );
}

function loadCalculatorTools() {
  const elements = new Map();
  function element(value = "") {
    return {
      value,
      textContent: "",
      attrs: {},
      setAttribute(name, val) { this.attrs[name] = val; },
      getAttribute(name) { return this.attrs[name]; },
      classList: { add() {}, remove() {} }
    };
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element(""));
      return elements.get(id);
    },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return element(""); },
    body: { appendChild() {}, removeChild() {} }
  };
  const context = {
    window: {},
    document,
    navigator: {},
    console,
    Number,
    Math,
    parseInt,
    isNaN
  };
  context.window.calculateGCS = params => {
    const eye = Number(params.eyeOpening);
    const verbal = Number(params.verbal);
    const motor = Number(params.motor);
    const score = eye + verbal + motor;
    return {
      score,
      interpretation: `GCS ${score}/15 - documentation support only.`,
      safetyNotice: "Score calculated for documentation support only. Clinician interpretation required."
    };
  };
  const source = fs.readFileSync(path.join(ROOT, "calculator-tools.js"), "utf8");
  vm.runInNewContext(source, context, { filename: "calculator-tools.js" });
  return {
    api: context.window.ClinicNoteCalculators,
    setValue(id, value) {
      document.getElementById(id).value = value;
    }
  };
}

const low = loadCalculatorTools();
const high = require(path.join(ROOT, "calculator-high-impact.js"));

const uiCases = {
  nyha: {
    set: () => low.setValue("calc-nyha-grade", "2"),
    verify: result => {
      assertEqual(result.ok, true, "nyha", "ok");
      assertEqual(result.value, 2, "nyha", "value");
      assert(/Class II/.test(result.text), "nyha", "expected Class II text");
    },
    invalid: () => {
      low.setValue("calc-nyha-grade", "");
      const result = low.api.calculateFromUI("nyha");
      assertEqual(result.ok, false, "nyha invalid", "ok");
      low.setValue("calc-nyha-grade", "2.5");
      assertEqual(low.api.calculateFromUI("nyha").ok, false, "nyha decimal invalid", "ok");
    }
  },
  killip: {
    set: () => low.setValue("calc-killip-class", "3"),
    verify: result => {
      assertEqual(result.ok, true, "killip", "ok");
      assertEqual(result.value, 3, "killip", "value");
      assert(/Class III/.test(result.text), "killip", "expected Class III text");
    },
    invalid: () => {
      low.setValue("calc-killip-class", "");
      const result = low.api.calculateFromUI("killip");
      assertEqual(result.ok, false, "killip invalid", "ok");
      low.setValue("calc-killip-class", "3.5");
      assertEqual(low.api.calculateFromUI("killip").ok, false, "killip decimal invalid", "ok");
    }
  },
  gcs: {
    set: () => {
      low.setValue("calc-gcs-eye", "4");
      low.setValue("calc-gcs-verbal", "5");
      low.setValue("calc-gcs-motor", "6");
    },
    verify: result => {
      assertEqual(result.ok, true, "gcs ui", "ok");
      assertEqual(result.value, 15, "gcs ui", "value");
      assert(/15\/15/.test(result.text), "gcs ui", "expected 15/15 text");
    },
    invalid: () => {
      low.setValue("calc-gcs-eye", "4.5");
      low.setValue("calc-gcs-verbal", "5");
      low.setValue("calc-gcs-motor", "6");
      assertEqual(low.api.calculateFromUI("gcs").ok, false, "gcs ui decimal invalid", "ok");
    }
  },
  sirs: {
    set: () => {
      low.setValue("calc-sirs-temp", "39");
      low.setValue("calc-sirs-hr", "100");
      low.setValue("calc-sirs-rr", "22");
      low.setValue("calc-sirs-wbc", "13");
    },
    verify: result => {
      assertEqual(result.ok, true, "sirs", "ok");
      assertEqual(result.value, 4, "sirs", "value");
      assert(/4\/4/.test(result.text), "sirs", "expected 4/4 text");
    },
    invalid: () => {
      low.setValue("calc-sirs-temp", "");
      low.setValue("calc-sirs-hr", "");
      low.setValue("calc-sirs-rr", "");
      low.setValue("calc-sirs-wbc", "");
      const result = low.api.calculateFromUI("sirs");
      assertEqual(result.ok, true, "sirs missing", "ok");
      assertEqual(result.value, 0, "sirs missing", "value");
    }
  },
  qsofa: {
    set: () => {
      low.setValue("calc-qsofa-rr", "22");
      low.setValue("calc-qsofa-sbp", "95");
      low.setValue("calc-qsofa-mental", "yes");
    },
    verify: result => {
      assertEqual(result.ok, true, "qsofa", "ok");
      assertEqual(result.value, 3, "qsofa", "value");
      assert(/3\/3/.test(result.text), "qsofa", "expected 3/3 text");
    },
    invalid: () => {
      low.setValue("calc-qsofa-rr", "");
      low.setValue("calc-qsofa-sbp", "");
      low.setValue("calc-qsofa-mental", "");
      const result = low.api.calculateFromUI("qsofa");
      assertEqual(result.ok, true, "qsofa missing", "ok");
      assertEqual(result.value, 0, "qsofa missing", "value");
    }
  },
  fib4: {
    set: () => {
      low.setValue("calc-fib4-age", "45");
      low.setValue("calc-fib4-ast", "30");
      low.setValue("calc-fib4-alt", "30");
      low.setValue("calc-fib4-plt", "200");
    },
    verify: result => {
      assertEqual(result.ok, true, "fib4", "ok");
      assertApprox(result.value, 1.232, 0.01, "fib4", "value");
      assert(/FIB-4: 1\.23/.test(result.text), "fib4", "expected rounded text");
    },
    invalid: () => {
      low.setValue("calc-fib4-age", "");
      low.setValue("calc-fib4-ast", "30");
      low.setValue("calc-fib4-alt", "30");
      low.setValue("calc-fib4-plt", "200");
      const result = low.api.calculateFromUI("fib4");
      assertEqual(result.ok, false, "fib4 invalid", "ok");
    }
  },
  child_pugh: {
    set: () => {
      low.setValue("calc-child-bili", "1");
      low.setValue("calc-child-alb", "4");
      low.setValue("calc-child-inr", "1.2");
      low.setValue("calc-child-ascites", "none");
      low.setValue("calc-child-encephalopathy", "none");
    },
    verify: result => {
      assertEqual(result.ok, true, "child_pugh", "ok");
      assertEqual(result.value, 5, "child_pugh", "value");
      assert(/Child-Pugh A/.test(result.text), "child_pugh", "expected class A text");
    },
    invalid: () => {
      low.setValue("calc-child-bili", "");
      low.setValue("calc-child-alb", "4");
      low.setValue("calc-child-inr", "1.2");
      low.setValue("calc-child-ascites", "none");
      low.setValue("calc-child-encephalopathy", "none");
      const result = low.api.calculateFromUI("child_pugh");
      assertEqual(result.ok, false, "child_pugh invalid", "ok");
    }
  }
};

const cases = {
  bmi: {
    run: () => low.api.calculateBMI(170, 75),
    verify: result => {
      assertEqual(result.ok, true, "bmi", "ok");
      assertEqual(result.value, 26, "bmi", "value");
      assert(/26\.0/.test(result.text), "bmi", "expected one decimal in output");
    },
    invalid: () => assertEqual(low.api.calculateBMI(0, 75).ok, false, "bmi invalid", "ok")
  },
  pack_years: {
    run: () => low.api.calculatePackYears(15, 10),
    verify: result => {
      assertEqual(result.ok, true, "pack_years", "ok");
      assertEqual(result.value, 7.5, "pack_years", "value");
    },
    invalid: () => assertEqual(low.api.calculatePackYears("", 10).ok, false, "pack_years invalid", "ok")
  },
  mean_arterial_pressure: {
    run: () => low.api.calculateMAP(120, 80),
    verify: result => {
      assertEqual(result.ok, true, "mean_arterial_pressure", "ok");
      assertEqual(result.value, 93, "mean_arterial_pressure", "value");
    },
    invalid: () => assertEqual(low.api.calculateMAP(120, "").ok, false, "mean_arterial_pressure invalid", "ok")
  },
  shock_index: {
    run: () => low.api.calculateShockIndex(90, 120),
    verify: result => {
      assertEqual(result.ok, true, "shock_index", "ok");
      assertEqual(result.value, 0.75, "shock_index", "value");
    },
    invalid: () => assertEqual(low.api.calculateShockIndex(90, 0).ok, false, "shock_index invalid", "ok")
  },
  mrc_dyspnea_scale: {
    run: () => low.api.classifyMRCDyspnea(3),
    verify: result => {
      assertEqual(result.ok, true, "mrc_dyspnea_scale", "ok");
      assertEqual(result.grade, "3", "mrc_dyspnea_scale", "grade");
      assert(/Walks slower/.test(result.description), "mrc_dyspnea_scale", "expected grade 3 description");
    },
    invalid: () => assertEqual(low.api.classifyMRCDyspnea("").ok, false, "mrc_dyspnea_scale invalid", "ok")
  },
  phq_2: {
    run: () => low.api.calculatePHQ2(1, 2),
    verify: result => {
      assertEqual(result.ok, true, "phq_2", "ok");
      assertEqual(result.value, 3, "phq_2", "value");
    },
    invalid: () => {
      assertEqual(low.api.calculatePHQ2(4, 1).ok, false, "phq_2 invalid", "ok");
      assertEqual(low.api.calculatePHQ2(1.5, 1).ok, false, "phq_2 decimal invalid", "ok");
    }
  },
  phq_9: {
    run: () => low.api.calculatePHQ9([0, 1, 2, 3, 0, 1, 2, 3, 1]),
    verify: result => {
      assertEqual(result.ok, true, "phq_9", "ok");
      assertEqual(result.value, 13, "phq_9", "value");
      assert(/Item 9 was marked above 0/.test(result.text), "phq_9", "expected item 9 review note");
    },
    invalid: () => {
      assertEqual(low.api.calculatePHQ9([1, 2]).ok, false, "phq_9 invalid", "ok");
      assertEqual(low.api.calculatePHQ9([0, 1, 2, 3, 0, 1, 2, 3, 1.5]).ok, false, "phq_9 decimal invalid", "ok");
    }
  },
  gad_7: {
    run: () => low.api.calculateGAD7([0, 1, 2, 3, 0, 1, 2]),
    verify: result => {
      assertEqual(result.ok, true, "gad_7", "ok");
      assertEqual(result.value, 9, "gad_7", "value");
    },
    invalid: () => {
      assertEqual(low.api.calculateGAD7([1, 2]).ok, false, "gad_7 invalid", "ok");
      assertEqual(low.api.calculateGAD7([0, 1, 2, 3, 0, 1, 2.5]).ok, false, "gad_7 decimal invalid", "ok");
    }
  },
  epworth_sleepiness_scale: {
    run: () => low.api.calculateEpworth([0, 1, 2, 3, 0, 1, 2, 3]),
    verify: result => {
      assertEqual(result.ok, true, "epworth_sleepiness_scale", "ok");
      assertEqual(result.value, 12, "epworth_sleepiness_scale", "value");
    },
    invalid: () => {
      assertEqual(low.api.calculateEpworth([1, 2]).ok, false, "epworth_sleepiness_scale invalid", "ok");
      assertEqual(low.api.calculateEpworth([0, 1, 2, 3, 0, 1, 2, 3.5]).ok, false, "epworth_sleepiness_scale decimal invalid", "ok");
    }
  },
  ipss: {
    run: () => low.api.calculateIPSS([1, 2, 3, 4, 0, 1, 2]),
    verify: result => {
      assertEqual(result.ok, true, "ipss", "ok");
      assertEqual(result.value, 13, "ipss", "value");
    },
    invalid: () => {
      assertEqual(low.api.calculateIPSS([1, 2]).ok, false, "ipss invalid", "ok");
      assertEqual(low.api.calculateIPSS([1, 2, 3, 4, 0, 1, 2.5]).ok, false, "ipss decimal invalid", "ok");
    }
  },
  nyha: uiCases.nyha,
  killip: uiCases.killip,
  sirs: uiCases.sirs,
  qsofa: uiCases.qsofa,
  fib4: uiCases.fib4,
  child_pugh: uiCases.child_pugh,
  wells_pe: {
    run: () => high.calculateWellsPE({ dvtSymptoms: true, peIsPrimaryDiagnosis: false, hrGT100: true, surgeryImmobilization: false, previousDvtPE: true, hemoptysis: false, malignancy: false }),
    verify: result => {
      assertEqual(result.score, 6, "wells_pe", "score");
      assert(/Moderate probability/.test(result.risk), "wells_pe", "expected moderate probability");
    },
    invalid: () => assertEqual(typeof high.calculateWellsPE({}).score, "number", "wells_pe missing", "score type")
  },
  wells_dvt: {
    run: () => high.calculateWellsDVT({ activeCancer: true, paralysisOrCast: false, bedRestSurgery: false, localizedTenderness: true, entireLegSwelling: false, calfSwelling: false, pittingEdema: false, collateralVeins: false, alternativeDiagnosis: false }),
    verify: result => {
      assertEqual(result.score, 2, "wells_dvt", "score");
      assert(/Moderate probability/.test(result.risk), "wells_dvt", "expected moderate probability");
    },
    invalid: () => assertEqual(typeof high.calculateWellsDVT({}).score, "number", "wells_dvt missing", "score type")
  },
  heart: {
    run: () => high.calculateHEART({ history: 1, ecg: 1, age: 1, riskFactors: 1, troponin: 1 }),
    verify: result => {
      assertEqual(result.score, 5, "heart", "score");
      assert(/Moderate/.test(result.risk), "heart", "expected moderate risk label");
    },
    invalid: () => assertEqual(typeof high.calculateHEART({}).score, "number", "heart missing", "score type")
  },
  curb65: {
    run: () => high.calculateCURB65({ confusion: true, ureaGT7: false, rrGE30: true, bpLow: false, ageGE65: true }),
    verify: result => {
      assertEqual(result.score, 3, "curb65", "score");
      assert(/High/.test(result.risk), "curb65", "expected high label");
    },
    invalid: () => assertEqual(typeof high.calculateCURB65({}).score, "number", "curb65 missing", "score type")
  },
  ottawa_knee: {
    run: () => high.calculateOttawaKnee({ ageGT55: true, patellaTenderness: false, fibularHeadTenderness: false, unableToBearWeight: false, unableToFlex90: false }),
    verify: result => {
      assertEqual(result.score, 1, "ottawa_knee", "score");
      assert(/indicated/i.test(result.interpretation), "ottawa_knee", "expected indicated text");
    },
    invalid: () => assertEqual(typeof high.calculateOttawaKnee({}).score, "number", "ottawa_knee missing", "score type")
  },
  ottawa_ankle: {
    run: () => high.calculateOttawaAnkle({ malleolarTenderness: false, midfootTenderness: false, unableToBearWeight: false }),
    verify: result => {
      assertEqual(result.score, 0, "ottawa_ankle", "score");
      assert(/not indicated/i.test(result.interpretation), "ottawa_ankle", "expected not indicated text");
    },
    invalid: () => assertEqual(typeof high.calculateOttawaAnkle({}).score, "number", "ottawa_ankle missing", "score type")
  },
  gcs: {
    run: () => high.calculateGCS({ eyeOpening: 4, verbal: 5, motor: 6 }),
    verify: result => {
      assertEqual(result.score, 15, "gcs", "score");
      assert(/15\/15/.test(result.interpretation), "gcs", "expected 15/15 text");
      uiCases.gcs.set();
      uiCases.gcs.verify(low.api.calculateFromUI("gcs"));
    },
    invalid: () => {
      assertEqual(high.calculateGCS({ eyeOpening: 99, verbal: -1, motor: 0 }).score, 6, "gcs invalid", "clamped score");
      uiCases.gcs.invalid();
    }
  },
  mcisaac: {
    run: () => high.calculateMcIsaac({ feverGT38: true, tonsillarExudate: true, tenderCervicalNodes: false, noCough: true, age: 10 }),
    verify: result => {
      assertEqual(result.score, 4, "mcisaac", "score");
      assert(/High/.test(result.risk), "mcisaac", "expected high label");
    },
    invalid: () => assertEqual(typeof high.calculateMcIsaac({}).score, "number", "mcisaac missing", "score type")
  }
};

const implemented = registry.filter(calc => calc.implementation_status === "implemented");
const implementedIds = implemented.map(calc => calc.calculator_id).sort();
const caseIds = Object.keys(cases).sort();

for (const calc of implemented) {
  const label = `registry ${calc.calculator_id}`;
  assert(calc.calculator_name && calc.calculator_name.trim(), label, "missing calculator_name");
  assert(Array.isArray(calc.input_fields) && calc.input_fields.length > 0, label, "missing input_fields");
  assert(Array.isArray(calc.output_fields) && calc.output_fields.length > 0, label, "missing output_fields");
  assert(calc.safety_note && calc.safety_note.trim(), label, "missing safety_note");
}

for (const id of implementedIds) {
  assert(cases[id], id, "implemented calculator lacks output test coverage");
}

for (const id of caseIds) {
  assert(implementedIds.includes(id), id, "test case targets calculator not marked implemented");
}

for (const [id, test] of Object.entries(cases)) {
  try {
    if (test.set) test.set();
    const result = test.run ? test.run() : low.api.calculateFromUI(id);
    test.verify(result);
    assertSafeOutput(result, id);
    if (test.invalid) test.invalid();
    pass(id);
  } catch (error) {
    fail(id, error && error.stack ? error.stack : String(error));
  }
}

if (failures.length) {
  console.error("Calculator output regression tests failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`Passed before failure report: ${passed.length}`);
  process.exit(1);
}

console.log(`Calculator output regression tests passed: ${passed.length} calculators.`);
console.log(`Covered calculators: ${passed.sort().join(", ")}`);
