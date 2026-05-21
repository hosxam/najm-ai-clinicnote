(function(){
  "use strict";

  var MRC_OPTIONS = {
    "1": "Not troubled by breathlessness except on strenuous exercise",
    "2": "Short of breath when hurrying on level ground or walking up a slight hill",
    "3": "Walks slower than people of the same age because of breathlessness or stops for breath when walking at own pace",
    "4": "Stops for breath after about 100 meters or after a few minutes on level ground",
    "5": "Too breathless to leave the house or breathless when dressing/undressing"
  };

  var FREQUENCY_0_3_OPTIONS = [
    { value: "0", label: "0 = Not at all" },
    { value: "1", label: "1 = Several days" },
    { value: "2", label: "2 = More than half the days" },
    { value: "3", label: "3 = Nearly every day" }
  ];

  var DOZE_0_3_OPTIONS = [
    { value: "0", label: "0 = Would never doze" },
    { value: "1", label: "1 = Slight chance of dozing" },
    { value: "2", label: "2 = Moderate chance of dozing" },
    { value: "3", label: "3 = High chance of dozing" }
  ];

  var IPSS_0_5_OPTIONS = [
    { value: "0", label: "0 = Not at all" },
    { value: "1", label: "1 = Less than 1 time in 5" },
    { value: "2", label: "2 = Less than half the time" },
    { value: "3", label: "3 = About half the time" },
    { value: "4", label: "4 = More than half the time" },
    { value: "5", label: "5 = Almost always" }
  ];

  var NYHA_OPTIONS = [
    { value: "1", label: "Class I = No limitation of physical activity" },
    { value: "2", label: "Class II = Slight limitation of physical activity" },
    { value: "3", label: "Class III = Marked limitation of physical activity" },
    { value: "4", label: "Class IV = Symptoms at rest or unable to carry on physical activity without discomfort" }
  ];

  var KILLIP_OPTIONS = [
    { value: "1", label: "Class I = No clinical signs of heart failure" },
    { value: "2", label: "Class II = Rales or crackles, S3, or elevated jugular venous pressure documented" },
    { value: "3", label: "Class III = Pulmonary edema documented" },
    { value: "4", label: "Class IV = Cardiogenic shock documented" }
  ];

  var GCS_EYE_OPTIONS = [
    { value: "4", label: "4 = Eyes open spontaneously" },
    { value: "3", label: "3 = Eyes open to speech" },
    { value: "2", label: "2 = Eyes open to pain" },
    { value: "1", label: "1 = No eye opening" }
  ];

  var GCS_VERBAL_OPTIONS = [
    { value: "5", label: "5 = Oriented" },
    { value: "4", label: "4 = Confused conversation" },
    { value: "3", label: "3 = Inappropriate words" },
    { value: "2", label: "2 = Incomprehensible sounds" },
    { value: "1", label: "1 = No verbal response" }
  ];

  var GCS_MOTOR_OPTIONS = [
    { value: "6", label: "6 = Obeys commands" },
    { value: "5", label: "5 = Localizes pain" },
    { value: "4", label: "4 = Withdraws from pain" },
    { value: "3", label: "3 = Abnormal flexion to pain" },
    { value: "2", label: "2 = Extension to pain" },
    { value: "1", label: "1 = No motor response" }
  ];

  var PHQ2_ITEMS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless"
  ];

  var PHQ9_ITEMS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading or watching television",
    "Moving or speaking so slowly that other people could have noticed, or being so fidgety/restless that you move around more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way"
  ];

  var GAD7_ITEMS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ];

  var EPWORTH_ITEMS = ["Sitting and reading", "Watching TV", "Sitting inactive in public", "Passenger in car for 1 hour", "Lying down in afternoon", "Sitting and talking", "Sitting quietly after lunch", "Car stopped in traffic"];

  var IPSS_ITEMS = ["Incomplete emptying", "Frequency", "Intermittency", "Urgency", "Weak stream", "Straining", "Nocturia"];

  var calculators = [
    { id: "bmi", name: "BMI" },
    { id: "pack_years", name: "Pack years" },
    { id: "mean_arterial_pressure", name: "Mean arterial pressure" },
    { id: "shock_index", name: "Shock index" },
    { id: "mrc_dyspnea_scale", name: "MRC dyspnea scale" },
    { id: "phq_2", name: "PHQ-2" },
    { id: "phq_9", name: "PHQ-9" },
    { id: "gad_7", name: "GAD-7" },
    { id: "epworth_sleepiness_scale", name: "Epworth Sleepiness Scale" },
    { id: "ipss", name: "IPSS" },
    { id: "nyha", name: "NYHA functional class" },
    { id: "killip", name: "Killip classification" },
    { id: "gcs", name: "Glasgow Coma Scale" },
    { id: "sirs", name: "SIRS criteria" },
    { id: "qsofa", name: "qSOFA" },
    { id: "fib4", name: "FIB-4 index" },
    { id: "child_pugh", name: "Child-Pugh score" }
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

  function strictInteger(value, min, max) {
    var text = String(value === undefined || value === null ? "" : value).trim();
    if (!/^-?\d+$/.test(text)) return null;
    var numberValue = Number(text);
    if (!Number.isInteger(numberValue) || numberValue < min || numberValue > max) return null;
    return numberValue;
  }

  function collectSelectSeries(prefix, count) {
    var values = [];
    for (var i = 1; i <= count; i++) {
      var el = byId(prefix + i);
      values.push(el ? el.value : "");
    }
    return values;
  }

  function sumResponses(scores, count, min, max, label) {
    if (!Array.isArray(scores) || scores.length !== count) {
      return { ok: false, error: "Select a response for each " + label + " item." };
    }
    var sum = 0;
    for (var i = 0; i < count; i++) {
      var v = strictInteger(scores[i], min, max);
      if (v === null) return { ok: false, error: "Each " + label + " response must be " + min + "-" + max + "." };
      sum += v;
    }
    return { ok: true, value: sum };
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

  // ---- PHQ-2 (low-risk screening tool) ----
  function calculatePHQ2(q1, q2) {
    var v1 = strictInteger(q1, 0, 3);
    var v2 = strictInteger(q2, 0, 3);
    if (v1 === null || v2 === null) {
      return { ok: false, error: "Select a response (0-3) for each PHQ-2 question." };
    }
    var score = v1 + v2;
    return {
      ok: true, calculatorId: "phq_2", value: score,
      text: "PHQ-2 score: " + score + " / 6.",
      safetyNote: "Documentation support only. Clinician interpretation required."
    };
  }

  // ---- PHQ-9 (low-risk screening tool) ----
  function calculatePHQ9(scores) {
    var summed = sumResponses(scores, 9, 0, 3, "PHQ-9");
    if (!summed.ok) return summed;
    var item9 = strictInteger(scores[8], 0, 3);
    var item9Note = item9 > 0 ? " Item 9 was marked above 0. This requires clinician review and local protocol." : "";
    return {
      ok: true, calculatorId: "phq_9", value: summed.value,
      text: "PHQ-9 score: " + summed.value + " / 27." + item9Note,
      safetyNote: "Documentation support only. Clinician interpretation required."
    };
  }

  // ---- GAD-7 (low-risk screening tool) ----
  function calculateGAD7(scores) {
    var summed = sumResponses(scores, 7, 0, 3, "GAD-7");
    if (!summed.ok) return summed;
    return {
      ok: true, calculatorId: "gad_7", value: summed.value,
      text: "GAD-7 score: " + summed.value + " / 21.",
      safetyNote: "Documentation support only. Clinician interpretation required."
    };
  }

  // ---- Epworth Sleepiness Scale (low-risk screening tool) ----
  function calculateEpworth(scores) {
    var summed = sumResponses(scores, 8, 0, 3, "Epworth");
    if (!summed.ok) return summed;
    return {
      ok: true, calculatorId: "epworth_sleepiness_scale", value: summed.value,
      text: "Epworth Sleepiness Scale score: " + summed.value + " / 24.",
      safetyNote: "Documentation support only. Clinician interpretation required."
    };
  }

  // ---- IPSS (low-risk documentation tool) ----
  function calculateIPSS(scores) {
    var summed = sumResponses(scores, 7, 0, 5, "IPSS");
    if (!summed.ok) return summed;
    return {
      ok: true, calculatorId: "ipss", value: summed.value,
      text: "IPSS score: " + summed.value + " / 35.",
      safetyNote: "Documentation support only. Clinician interpretation required."
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
    } else if (calculatorId === "phq_2") {
      result = calculatePHQ2(byId("calc-phq2-q1").value, byId("calc-phq2-q2").value);
    } else if (calculatorId === "phq_9") {
      result = calculatePHQ9(collectSelectSeries("calc-phq9-q", 9));
    } else if (calculatorId === "gad_7") {
      result = calculateGAD7(collectSelectSeries("calc-gad7-q", 7));
    } else if (calculatorId === "epworth_sleepiness_scale") {
      result = calculateEpworth(collectSelectSeries("calc-epworth-q", 8));
    } else if (calculatorId === "ipss") {
      result = calculateIPSS(collectSelectSeries("calc-ipss-q", 7));
    } else if (calculatorId === "nyha") {
      result = calculateNYHA(byId("calc-nyha-grade").value);
    } else if (calculatorId === "killip") {
      result = calculateKillip(byId("calc-killip-class").value);
    } else if (calculatorId === "gcs") {
      var eye = strictInteger(byId("calc-gcs-eye").value, 1, 4);
      var verbal = strictInteger(byId("calc-gcs-verbal").value, 1, 5);
      var motor = strictInteger(byId("calc-gcs-motor").value, 1, 6);
      if (eye === null || verbal === null || motor === null) {
        result = { ok: false, error: "Select Eye, Verbal, and Motor GCS responses." };
      } else if (typeof window.calculateGCS === "function") {
        var gcs = window.calculateGCS({ eyeOpening: eye, verbal: verbal, motor: motor });
        result = { ok: true, calculatorId: "gcs", value: gcs.score, text: gcs.interpretation, safetyNote: gcs.safetyNotice };
      } else {
        result = { ok: false, error: "GCS calculator is not available." };
      }
    } else if (calculatorId === "sirs") {
      var _t=Number(byId("calc-sirs-temp").value)||undefined;
      var _h=Number(byId("calc-sirs-hr").value)||undefined;
      var _r=Number(byId("calc-sirs-rr").value)||undefined;
      var _w=Number(byId("calc-sirs-wbc").value)||undefined;
      result=calculateSIRS(_t,_h,_r,_w);
    } else if (calculatorId === "qsofa") {
      var _rr=Number(byId("calc-qsofa-rr").value)||undefined;
      var _sbp=Number(byId("calc-qsofa-sbp").value)||undefined;
      var _mental=byId("calc-qsofa-mental").value==="yes";
      result=calculateQSOFA(_rr,_sbp,_mental);
    } else if (calculatorId === "fib4") {
      result = calculateFIB4(
        Number(byId("calc-fib4-age").value),
        Number(byId("calc-fib4-ast").value),
        Number(byId("calc-fib4-alt").value),
        Number(byId("calc-fib4-plt").value)
      );
    } else if (calculatorId === "child_pugh") {
      result = calculateChildPugh(
        Number(byId("calc-child-bili").value),
        Number(byId("calc-child-alb").value),
        Number(byId("calc-child-inr").value),
        byId("calc-child-ascites").value,
        byId("calc-child-encephalopathy").value
      );
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
  // -- NYHA Functional Classification --
  function calculateNYHA(grade) {
    var grades = {1:'Class I: No limitation of physical activity.',2:'Class II: Slight limitation of physical activity.',3:'Class III: Marked limitation of physical activity.',4:'Class IV: Unable to carry on any physical activity without discomfort.'};
    var g=strictInteger(grade,1,4);
    if(g===null)return{ok:false,error:"Select NYHA class (1-4)."};
    return{ok:true,calculatorId:"nyha",value:g,text:"NYHA functional class: "+grades[g],safetyNote:"Documentation support only. Clinician interpretation required."};
  }

  // -- Killip Classification --
  function calculateKillip(killipClass) {
    var classes = {1:'Class I: No clinical signs of heart failure.',2:'Class II: Signs of heart failure.',3:'Class III: Acute pulmonary oedema.',4:'Class IV: Cardiogenic shock.'};
    var k=strictInteger(killipClass,1,4);
    if(k===null)return{ok:false,error:"Select Killip class (1-4)."};
    return{ok:true,calculatorId:"killip",value:k,text:"Killip class: "+classes[k],safetyNote:"Documentation support only. Clinician interpretation required."};
  }

  // -- SIRS Criteria --
  function calculateSIRS(temp,hr,rr,wbc) {
    var c=0; if(temp!==undefined&&(temp<36||temp>38))c++; if(hr!==undefined&&hr>90)c++; if(rr!==undefined&&rr>20)c++; if(wbc!==undefined&&(wbc<4||wbc>12))c++;
    return{ok:true,calculatorId:"sirs",value:c,text:"SIRS criteria: "+c+"/4. "+(c>=2?"Two or more criteria present.":"Less than 2 criteria.")+" Clinician interpretation required.",safetyNote:"SIRS criteria are documentation aids. Do not determine sepsis management independently."};
  }

  // -- qSOFA --
  function calculateQSOFA(rr,sbp,mentalStatus) {
    var c=0; if(rr!==undefined&&rr>=22)c++; if(sbp!==undefined&&sbp<=100)c++; if(mentalStatus)c++;
    return{ok:true,calculatorId:"qsofa",value:c,text:"qSOFA: "+c+"/3. "+(c>=2?"Higher risk of in-hospital mortality.":"Low qSOFA score.")+" Clinician interpretation required.",safetyNote:"qSOFA is a screening tool. Does not determine sepsis management. Clinical assessment required."};
  }

  // -- FIB-4 --
  function calculateFIB4(age,ast,alt,plt) {
    var a=Number(age),as=Number(ast),al=Number(alt),p=Number(plt);
    if(!a||!as||!al||!p||as<=0||al<=0||p<=0)return{ok:false,error:"Enter age, AST, ALT, and platelets as positive numbers."};
    var f=(a*as)/(p*Math.sqrt(al));
    var cat=f<1.30?"Low probability of advanced fibrosis.":f>2.67?"Higher probability. Further evaluation indicated.":"Indeterminate range.";
    return{ok:true,calculatorId:"fib4",value:f,text:"FIB-4: "+f.toFixed(2)+". "+cat,safetyNote:"FIB-4 is a non-invasive fibrosis index. Does not replace liver biopsy or clinical assessment."};
  }

  // -- Child-Pugh Score --
  function calculateChildPugh(bilirubin,albumin,inr,ascites,encephalopathy) {
    var bili=Number(bilirubin),alb=Number(albumin),inrVal=Number(inr);
    if(!Number.isFinite(bili)||!Number.isFinite(alb)||!Number.isFinite(inrVal)||bili<=0||alb<=0||inrVal<=0)return{ok:false,error:"Enter bilirubin, albumin, and INR as positive numbers."};
    var bPts=bili<=2?1:bili<=3?2:3; var aPts=alb>=3.5?1:alb>=2.8?2:3;
    var iPts=inrVal<1.7?1:inrVal<2.3?2:3;
    var ascPts=ascites==="none"?1:ascites==="mild"?2:3;
    var encPts=encephalopathy==="none"?1:encephalopathy==="grade1-2"?2:3;
    var total=bPts+aPts+iPts+ascPts+encPts;
    var cls=total<=6?"Child-Pugh A":total<=9?"Child-Pugh B":"Child-Pugh C";
    return{ok:true,calculatorId:"child_pugh",value:total,text:"Child-Pugh: "+total+" ("+cls+").",safetyNote:"Child-Pugh score documents liver disease severity. Does not determine management. Clinical assessment required."};
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function(ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch];
    });
  }

  function optionHtml(options) {
    var html = '<option value="">Select</option>';
    for (var i = 0; i < options.length; i++) {
      html += '<option value="' + escapeHtml(options[i].value) + '">' + escapeHtml(options[i].label) + '</option>';
    }
    return html;
  }

  function questionFields(prefix, items, options) {
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var id = prefix + (i + 1);
      html += '<div class="form-group"><label for="' + id + '">' + (i + 1) + '. ' + escapeHtml(items[i]) + '</label><select id="' + id + '">' + optionHtml(options) + '</select></div>';
    }
    return html;
  }

  function renderSelectField(id, label, options) {
    return '<div class="form-group"><label for="' + id + '">' + escapeHtml(label) + '</label><select id="' + id + '">' + optionHtml(options) + '</select></div>';
  }

  function renderCalculatorCard(calc) {
    var meta = getCalculatorCardMeta(calc.id);
    if (!meta) return "";
    return '<article class="calculator-card" data-calculator-card="' + escapeHtml(calc.id) + '">' +
      '<h3>' + escapeHtml(calc.name) + '</h3>' +
      '<p>' + escapeHtml(meta.description) + '</p>' +
      '<div class="calculator-fields" style="grid-template-columns:1fr">' + meta.fields + '</div>' +
      '<div class="calculator-actions">' +
      '<button class="btn btn-primary btn-sm" type="button" onclick="ClinicNoteCalculators.calculateFromUI(&quot;' + escapeHtml(calc.id) + '&quot;)">Calculate</button>' +
      '<button class="btn btn-outline btn-sm" type="button" onclick="ClinicNoteCalculators.copyCalculatorResult(&quot;' + escapeHtml(calc.id) + '&quot;)">Copy Result</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" onclick="ClinicNoteCalculators.clearCalculatorInputs(&quot;' + escapeHtml(calc.id) + '&quot;)">Clear</button>' +
      '</div>' +
      '<div id="calcResult-' + escapeHtml(calc.id) + '" class="calculator-result" role="status" aria-live="polite">Result will appear here.</div>' +
      '<div class="calculator-safety">' + escapeHtml(meta.safety) + '</div>' +
      '</article>';
  }

  function getCalculatorCardMeta(calculatorId) {
    var support = "Documentation support only. Clinician interpretation required.";
    var map = {
      phq_2: {
        description: "Two-item mood screening documentation from clinician-entered responses.",
        fields: '<p class="calculator-safety">Over the last 2 weeks, how often has the patient been bothered by:</p>' + questionFields("calc-phq2-q", PHQ2_ITEMS, FREQUENCY_0_3_OPTIONS),
        safety: support
      },
      phq_9: {
        description: "Nine-item mood questionnaire documentation from clinician-entered responses.",
        fields: '<p class="calculator-safety">Over the last 2 weeks, how often has the patient been bothered by:</p>' + questionFields("calc-phq9-q", PHQ9_ITEMS, FREQUENCY_0_3_OPTIONS),
        safety: "Item 9 requires clinician review and local protocol if marked above 0."
      },
      gad_7: {
        description: "Seven-item anxiety questionnaire documentation from clinician-entered responses.",
        fields: '<p class="calculator-safety">Over the last 2 weeks, how often has the patient been bothered by:</p>' + questionFields("calc-gad7-q", GAD7_ITEMS, FREQUENCY_0_3_OPTIONS),
        safety: support
      },
      epworth_sleepiness_scale: {
        description: "Sleepiness questionnaire documentation from clinician-entered situation responses.",
        fields: '<p class="calculator-safety">How likely is the patient to doze off or fall asleep in these situations?</p>' + questionFields("calc-epworth-q", EPWORTH_ITEMS, DOZE_0_3_OPTIONS),
        safety: support
      },
      ipss: {
        description: "Urinary symptom score documentation from clinician-entered symptom responses.",
        fields: '<p class="calculator-safety">Over the past month, how often has the patient had:</p>' + questionFields("calc-ipss-q", IPSS_ITEMS, IPSS_0_5_OPTIONS),
        safety: support
      },
      nyha: {
        description: "Functional class documentation with class descriptions.",
        fields: renderSelectField("calc-nyha-grade", "NYHA functional class", NYHA_OPTIONS),
        safety: support
      },
      killip: {
        description: "Killip class documentation with class descriptions.",
        fields: renderSelectField("calc-killip-class", "Killip class", KILLIP_OPTIONS),
        safety: support
      },
      gcs: {
        description: "Glasgow Coma Scale documentation from Eye, Verbal, and Motor responses.",
        fields: renderSelectField("calc-gcs-eye", "Eye opening", GCS_EYE_OPTIONS) + renderSelectField("calc-gcs-verbal", "Verbal response", GCS_VERBAL_OPTIONS) + renderSelectField("calc-gcs-motor", "Motor response", GCS_MOTOR_OPTIONS),
        safety: support
      }
    };
    return map[calculatorId] || null;
  }

  function mountMissingCalculatorCards() {
    var grid = document.querySelector(".calculator-grid");
    if (!grid) return;
    for (var i = 0; i < calculators.length; i++) {
      var calc = calculators[i];
      if (!getCalculatorCardMeta(calc.id)) continue;
      if (document.querySelector('[data-calculator-card="' + calc.id + '"]')) continue;
      grid.insertAdjacentHTML("beforeend", renderCalculatorCard(calc));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountMissingCalculatorCards);
  } else {
    mountMissingCalculatorCards();
  }


  window.ClinicNoteCalculators = {
    calculators: calculators,
    calculateBMI: calculateBMI,
    calculatePackYears: calculatePackYears,
    calculateMAP: calculateMAP,
    calculateShockIndex: calculateShockIndex,
    classifyMRCDyspnea: classifyMRCDyspnea,
    calculatePHQ2: calculatePHQ2,
    calculatePHQ9: calculatePHQ9,
    calculateGAD7: calculateGAD7,
    calculateEpworth: calculateEpworth,
    calculateIPSS: calculateIPSS,
    clearCalculatorInputs: clearCalculatorInputs,
    getCalculatorSafetyFooter: getCalculatorSafetyFooter,
    calculateFromUI: calculateFromUI,
    copyCalculatorResult: copyCalculatorResult
  };
})();
