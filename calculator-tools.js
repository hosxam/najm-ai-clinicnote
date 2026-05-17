(function(){
  "use strict";

  var MRC_OPTIONS = {
    "1": "Breathless only with strenuous exercise",
    "2": "Short of breath when hurrying on level ground or walking up a slight hill",
    "3": "Walks slower than people of the same age because of breathlessness or stops for breath when walking at own pace",
    "4": "Stops for breath after about 100 meters or after a few minutes on level ground",
    "5": "Too breathless to leave the house or breathless when dressing/undressing"
  };

  var calculators = [
    { id: "bmi", name: "BMI" },
    { id: "pack_years", name: "Pack years" },
    { id: "mean_arterial_pressure", name: "Mean arterial pressure" },
    { id: "shock_index", name: "Shock index" },
    { id: "mrc_dyspnea_scale", name: "MRC dyspnea scale" }
  ];

  function toPositiveNumber(value) {
    var numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue <= 0) return null;
    return numberValue;
  }

  function roundTo(value, places) {
    var factor = Math.pow(10, places);
    return Math.round(value * factor) / factor;
  }

  function calculateBMI(heightCm, weightKg) {
    var height = toPositiveNumber(heightCm);
    var weight = toPositiveNumber(weightKg);
    if (!height || !weight) {
      return { ok: false, error: "Enter height and weight as positive numbers." };
    }
    var heightM = height / 100;
    var bmi = roundTo(weight / (heightM * heightM), 1);
    var category = "obesity range";
    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal range";
    else if (bmi < 30) category = "overweight";
    return {
      ok: true,
      calculatorId: "bmi",
      value: bmi,
      category: category,
      text: "BMI: " + bmi.toFixed(1) + " kg/m2 (" + category + ").",
      safetyNote: "BMI is a screening/documentation measure and does not replace clinician assessment."
    };
  }

  function calculatePackYears(cigarettesPerDay, yearsSmoked) {
    var cigarettes = toPositiveNumber(cigarettesPerDay);
    var years = toPositiveNumber(yearsSmoked);
    if (!cigarettes || !years) {
      return { ok: false, error: "Enter cigarettes per day and years smoked as positive numbers." };
    }
    var packYears = roundTo((cigarettes / 20) * years, 1);
    return {
      ok: true,
      calculatorId: "pack_years",
      value: packYears,
      text: "Pack years: " + packYears.toFixed(1) + ".",
      safetyNote: "Pack years are for smoking exposure documentation only."
    };
  }

  function calculateMAP(systolicBp, diastolicBp) {
    var sbp = toPositiveNumber(systolicBp);
    var dbp = toPositiveNumber(diastolicBp);
    if (!sbp || !dbp) {
      return { ok: false, error: "Enter systolic and diastolic blood pressure as positive numbers." };
    }
    var map = Math.round((sbp + (2 * dbp)) / 3);
    return {
      ok: true,
      calculatorId: "mean_arterial_pressure",
      value: map,
      text: "Mean arterial pressure: " + map + " mmHg.",
      safetyNote: "MAP is a calculated value for documentation. Interpret in clinical context."
    };
  }

  function calculateShockIndex(heartRate, systolicBp) {
    var hr = toPositiveNumber(heartRate);
    var sbp = toPositiveNumber(systolicBp);
    if (!hr || !sbp) {
      return { ok: false, error: "Enter heart rate and systolic blood pressure as positive numbers." };
    }
    var index = roundTo(hr / sbp, 2);
    return {
      ok: true,
      calculatorId: "shock_index",
      value: index,
      text: "Shock index: " + index.toFixed(2) + ".",
      safetyNote: "Shock index is a documentation calculation and does not determine management by itself."
    };
  }

  function classifyMRCDyspnea(grade) {
    var key = String(grade || "");
    var description = MRC_OPTIONS[key];
    if (!description) {
      return { ok: false, error: "Select an MRC dyspnea grade." };
    }
    return {
      ok: true,
      calculatorId: "mrc_dyspnea_scale",
      grade: key,
      description: description,
      text: "MRC dyspnea grade " + key + ": " + description + ".",
      safetyNote: "MRC dyspnea grade documents symptom burden. It does not establish a diagnosis or recommend treatment."
    };
  }

  function getCalculatorSafetyFooter() {
    return "Calculator values are processed locally in your browser. Do not enter patient-identifiable information. Calculator outputs are documentation aids only and do not diagnose, recommend treatment, or replace clinician judgment.";
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setResult(calculatorId, result) {
    var el = byId("calcResult-" + calculatorId);
    if (!el) return;
    if (!result || !result.ok) {
      el.textContent = result && result.error ? result.error : "Unable to calculate. Check entered values.";
      el.setAttribute("data-result-text", "");
      el.classList.add("calc-result-error");
      return;
    }
    var output = result.text + "\n" + result.safetyNote;
    el.textContent = output;
    el.setAttribute("data-result-text", output);
    el.classList.remove("calc-result-error");
  }

  function calculateFromUI(calculatorId) {
    var result;
    if (calculatorId === "bmi") {
      result = calculateBMI(byId("calc-bmi-height").value, byId("calc-bmi-weight").value);
    } else if (calculatorId === "pack_years") {
      result = calculatePackYears(byId("calc-pack-cigarettes").value, byId("calc-pack-years").value);
    } else if (calculatorId === "mean_arterial_pressure") {
      result = calculateMAP(byId("calc-map-sbp").value, byId("calc-map-dbp").value);
    } else if (calculatorId === "shock_index") {
      result = calculateShockIndex(byId("calc-shock-hr").value, byId("calc-shock-sbp").value);
    } else if (calculatorId === "mrc_dyspnea_scale") {
      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);
    } else {
      result = { ok: false, error: "Calculator is not available." };
    }
    setResult(calculatorId, result);
    return result;
  }

  function clearCalculatorInputs(calculatorId) {
    var scope = calculatorId ? document.querySelector("[data-calculator-card=\"" + calculatorId + "\"]") : document;
    if (!scope) return;
    var inputs = scope.querySelectorAll("input, select");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
    var results = scope.querySelectorAll("[id^=\"calcResult-\"]");
    for (var j = 0; j < results.length; j++) {
      results[j].textContent = "Result will appear here.";
      results[j].setAttribute("data-result-text", "");
      results[j].classList.remove("calc-result-error");
    }
  }

  function copyCalculatorResult(calculatorId) {
    var el = byId("calcResult-" + calculatorId);
    if (!el) return;
    var text = el.getAttribute("data-result-text") || "";
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function(){});
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  window.ClinicNoteCalculators = {
    calculators: calculators,
    calculateBMI: calculateBMI,
    calculatePackYears: calculatePackYears,
    calculateMAP: calculateMAP,
    calculateShockIndex: calculateShockIndex,
    classifyMRCDyspnea: classifyMRCDyspnea,
    clearCalculatorInputs: clearCalculatorInputs,
    getCalculatorSafetyFooter: getCalculatorSafetyFooter,
    calculateFromUI: calculateFromUI,
    copyCalculatorResult: copyCalculatorResult
  };
})();
