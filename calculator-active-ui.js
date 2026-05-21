(function(){
  "use strict";

  var FREQ_03 = [["0","0 = Not at all"],["1","1 = Several days"],["2","2 = More than half the days"],["3","3 = Nearly every day"]];
  var DOZE_03 = [["0","0 = Would never doze"],["1","1 = Slight chance of dozing"],["2","2 = Moderate chance of dozing"],["3","3 = High chance of dozing"]];
  var IPSS_05 = [["0","0 = Not at all"],["1","1 = Less than 1 time in 5"],["2","2 = Less than half the time"],["3","3 = About half the time"],["4","4 = More than half the time"],["5","5 = Almost always"]];
  var GCS_EYE = [["4","4 = Eyes open spontaneously"],["3","3 = Eyes open to speech"],["2","2 = Eyes open to pain"],["1","1 = No eye opening"]];
  var GCS_VERBAL = [["5","5 = Oriented"],["4","4 = Confused conversation"],["3","3 = Inappropriate words"],["2","2 = Incomprehensible sounds"],["1","1 = No verbal response"]];
  var GCS_MOTOR = [["6","6 = Obeys commands"],["5","5 = Localizes pain"],["4","4 = Withdraws from pain"],["3","3 = Abnormal flexion to pain"],["2","2 = Extension to pain"],["1","1 = No motor response"]];
  var MRC_OPTIONS = [["1","1 = Not troubled by breathlessness except on strenuous exercise"],["2","2 = Short of breath when hurrying on level ground or walking up a slight hill"],["3","3 = Walks slower than people of the same age because of breathlessness or stops for breath when walking at own pace"],["4","4 = Stops for breath after about 100 meters or after a few minutes on level ground"],["5","5 = Too breathless to leave the house or breathless when dressing/undressing"]];
  var NYHA_OPTIONS = [["1","Class I = No limitation of physical activity"],["2","Class II = Slight limitation of physical activity"],["3","Class III = Marked limitation of physical activity"],["4","Class IV = Symptoms at rest or unable to carry on physical activity without discomfort"]];
  var KILLIP_OPTIONS = [["1","Class I = No clinical signs of heart failure"],["2","Class II = Rales or crackles, S3, or elevated jugular venous pressure documented"],["3","Class III = Pulmonary edema documented"],["4","Class IV = Cardiogenic shock documented"]];

  function itemFields(prefix, labels, options){return labels.map(function(label, i){return [prefix + (i + 1), (i + 1) + ". " + label, "select", options];});}
  var PHQ2 = ["Little interest or pleasure in doing things","Feeling down, depressed, or hopeless"];
  var PHQ9 = ["Little interest or pleasure in doing things","Feeling down, depressed, or hopeless","Trouble falling or staying asleep, or sleeping too much","Feeling tired or having little energy","Poor appetite or overeating","Feeling bad about yourself, or that you are a failure or have let yourself or your family down","Trouble concentrating on things, such as reading or watching television","Moving or speaking slowly, or being fidgety/restless","Thoughts that you would be better off dead, or of hurting yourself in some way"];
  var GAD7 = ["Feeling nervous, anxious, or on edge","Not being able to stop or control worrying","Worrying too much about different things","Trouble relaxing","Being so restless that it is hard to sit still","Becoming easily annoyed or irritable","Feeling afraid as if something awful might happen"];
  var EPWORTH = ["Sitting and reading","Watching TV","Sitting inactive in a public place","Passenger in a car for an hour without a break","Lying down to rest in the afternoon","Sitting and talking to someone","Sitting quietly after lunch without alcohol","In a car while stopped in traffic"];
  var IPSS = ["Incomplete emptying","Frequency","Intermittency","Urgency","Weak stream","Straining","Nocturia"];

  var ACTIVE_CALCULATORS = [
    { id:"bmi", name:"BMI", desc:"Body mass index from clinician-entered height and weight.", fields:[["height","Height (cm)","number"],["weight","Weight (kg)","number"]] },
    { id:"pack_years", name:"Pack years", desc:"Smoking exposure from clinician-entered cigarettes per day and years smoked.", fields:[["cigarettesPerDay","Cigarettes/day","number"],["yearsSmoked","Years smoked","number"]] },
    { id:"mean_arterial_pressure", name:"Mean arterial pressure", desc:"Calculated observation value from clinician-entered blood pressure.", fields:[["sbp","Systolic BP","number"],["dbp","Diastolic BP","number"]] },
    { id:"shock_index", name:"Shock index", desc:"Vital-sign ratio from clinician-entered heart rate and systolic BP.", fields:[["hr","Heart rate","number"],["sbp","Systolic BP","number"]] },
    { id:"mrc_dyspnea_scale", name:"MRC dyspnea scale", desc:"Breathlessness symptom burden documentation with clinician-selected grade.", fields:[["grade","MRC grade","select",MRC_OPTIONS]] },
    { id:"phq_2", name:"PHQ-2", desc:"Brief mood screening score from clinician-entered item responses.", fields:itemFields("q", PHQ2, FREQ_03) },
    { id:"phq_9", name:"PHQ-9", desc:"Mood documentation from clinician-entered item responses.", fields:itemFields("q", PHQ9, FREQ_03) },
    { id:"gad_7", name:"GAD-7", desc:"Anxiety documentation from clinician-entered item responses.", fields:itemFields("q", GAD7, FREQ_03) },
    { id:"epworth_sleepiness_scale", name:"Epworth Sleepiness Scale", desc:"Daytime sleepiness documentation from clinician-entered responses.", fields:itemFields("q", EPWORTH, DOZE_03) },
    { id:"ipss", name:"IPSS", desc:"Urinary symptom documentation from clinician-entered responses.", fields:itemFields("q", IPSS, IPSS_05) },
    { id:"nyha", name:"NYHA functional class", desc:"Functional class documentation when assessed.", fields:[["grade","NYHA class","select",NYHA_OPTIONS]] },
    { id:"killip", name:"Killip classification", desc:"Cardiac clinical severity class documentation when assessed.", fields:[["grade","Killip class","select",KILLIP_OPTIONS]] },
    { id:"sirs", name:"SIRS criteria", desc:"Criteria count from clinician-entered observations.", fields:[["temp","Temperature (C)","number"],["hr","Heart rate","number"],["rr","Respiratory rate","number"],["wbc","WBC","number"]] },
    { id:"qsofa", name:"qSOFA", desc:"Screening score from clinician-entered observations.", fields:[["rr","Respiratory rate","number"],["sbp","Systolic BP","number"],["mentalStatus","Altered mental status","select",["no","yes"]]] },
    { id:"fib4", name:"FIB-4 index", desc:"Liver fibrosis index from clinician-entered lab values.", fields:[["age","Age","number"],["ast","AST","number"],["alt","ALT","number"],["platelets","Platelets","number"]] },
    { id:"child_pugh", name:"Child-Pugh score", desc:"Liver disease severity score from clinician-entered values.", fields:[["bilirubin","Bilirubin","number"],["albumin","Albumin","number"],["inr","INR","number"],["ascites","Ascites","select",["none","mild","moderate_severe"]],["encephalopathy","Encephalopathy","select",["none","grade1-2","grade3-4"]]] },
    { id:"wells_pe", name:"Wells PE Score", desc:"Clinician-entered pulmonary embolism score documentation.", fields:[["dvtSymptoms","Clinical signs of DVT","select",["0","3"]],["peIsPrimaryDiagnosis","PE is primary/equally likely diagnosis","select",["0","3"]],["hrGT100","Heart rate >100","select",["0","1.5"]],["surgeryImmobilization","Surgery/immobilization <4 weeks","select",["0","1.5"]],["previousDvtPE","Previous DVT/PE","select",["0","1.5"]],["hemoptysis","Hemoptysis","select",["0","1"]],["malignancy","Active malignancy","select",["0","1"]]] },
    { id:"wells_dvt", name:"Wells DVT Score", desc:"Clinician-entered DVT score documentation.", fields:[["activeCancer","Active cancer","select",["0","1"]],["paralysisOrCast","Paralysis/cast","select",["0","1"]],["bedRestSurgery","Bed rest/surgery","select",["0","1"]],["localizedTenderness","Localized tenderness","select",["0","1"]],["entireLegSwelling","Entire leg swelling","select",["0","1"]],["calfSwelling","Calf swelling","select",["0","1"]],["pittingEdema","Pitting edema","select",["0","1"]],["collateralVeins","Collateral veins","select",["0","1"]],["alternativeDiagnosis","Alternative diagnosis as likely","select",["0","-2"]]] },
    { id:"heart", name:"HEART Score", desc:"Chest-pain score from clinician-entered components.", fields:[["history","History (0-2)","number"],["ecg","ECG (0-2)","number"],["age","Age (0-2)","number"],["riskFactors","Risk factors (0-2)","number"],["troponin","Troponin (0-2)","number"]] },
    { id:"curb65", name:"CURB-65", desc:"Pneumonia severity score from clinician-entered criteria.", fields:[["confusion","Confusion","select",["0","1"]],["ureaGT7","Urea >7","select",["0","1"]],["rrGE30","RR >=30","select",["0","1"]],["bpLow","Low BP","select",["0","1"]],["ageGE65","Age >=65","select",["0","1"]]] },
    { id:"ottawa_knee", name:"Ottawa Knee Rule", desc:"Knee injury rule documentation from clinician-entered criteria.", fields:[["ageGT55","Age >55","select",["0","1"]],["patellaTenderness","Patella tenderness","select",["0","1"]],["fibularHeadTenderness","Fibular head tenderness","select",["0","1"]],["unableToBearWeight","Unable to bear weight","select",["0","1"]],["unableToFlex90","Unable to flex 90 degrees","select",["0","1"]]] },
    { id:"ottawa_ankle", name:"Ottawa Ankle Rule", desc:"Ankle injury rule documentation from clinician-entered criteria.", fields:[["malleolarTenderness","Malleolar tenderness","select",["0","1"]],["midfootTenderness","Midfoot tenderness","select",["0","1"]],["unableToBearWeight","Unable to bear weight","select",["0","1"]]] },
    { id:"gcs", name:"Glasgow Coma Scale", desc:"GCS from clinician-selected eye, verbal, and motor responses.", fields:[["eyeOpening","Eye opening","select",GCS_EYE],["verbal","Verbal response","select",GCS_VERBAL],["motor","Motor response","select",GCS_MOTOR]] },
    { id:"mcisaac", name:"McIsaac / Centor Score", desc:"Sore-throat score from clinician-entered criteria.", fields:[["feverGT38","Fever >38C","select",["0","1"]],["tonsillarExudate","Tonsillar exudate","select",["0","1"]],["tenderCervicalNodes","Tender cervical nodes","select",["0","1"]],["noCough","Absence of cough","select",["0","1"]],["age","Age","number"]] }
  ];

  function esc(s){return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function num(v){var n=Number(v); return Number.isFinite(n) ? n : NaN;}
  function boolScore(v, score){return Number(v) === Number(score);}
  function footer(){return "Calculator output is for documentation support only. Clinician interpretation required. It does not diagnose, recommend treatment, determine referral, imaging, admission, discharge, or disposition.";}
  function fieldValue(id,key){var el=document.getElementById("active-calc-"+id+"-"+key);return el?el.value:"";}
  function strictInteger(v, min, max){var text=String(v==null?"":v).trim();if(!/^-?\d+$/.test(text))return null;var n=Number(text);if(!Number.isInteger(n)||n<min||n>max)return null;return n;}
  function collectItemValues(id, prefix, count){var vals=[];for(var i=1;i<=count;i++){vals.push(fieldValue(id, prefix+i));}return vals;}

  function lowResult(text, value){return {ok:true,text:text,safetyNote:footer(),value:value};}
  function compute(id) {
    var c = window.ClinicNoteCalculators;
    if (!c) return {ok:false,error:"Calculator module is not available."};
    var f = {};
    var def = ACTIVE_CALCULATORS.find(function(item){return item.id===id;});
    (def ? def.fields : []).forEach(function(field){f[field[0]]=fieldValue(id, field[0]);});

    if (id === "bmi") return c.calculateBMI(f.height, f.weight);
    if (id === "pack_years") return c.calculatePackYears(f.cigarettesPerDay, f.yearsSmoked);
    if (id === "mean_arterial_pressure") return c.calculateMAP(f.sbp, f.dbp);
    if (id === "shock_index") return c.calculateShockIndex(f.hr, f.sbp);
    if (id === "mrc_dyspnea_scale") return c.classifyMRCDyspnea(f.grade);
    if (id === "phq_2") return c.calculatePHQ2(f.q1, f.q2);
    if (id === "phq_9") { var phqScores=collectItemValues(id,"q",9); return c.calculatePHQ9(phqScores); }
    if (id === "gad_7") { var gadScores=collectItemValues(id,"q",7); return c.calculateGAD7(gadScores); }
    if (id === "epworth_sleepiness_scale") { var epScores=collectItemValues(id,"q",8); return c.calculateEpworth(epScores); }
    if (id === "ipss") { var ipssScores=collectItemValues(id,"q",7); return c.calculateIPSS(ipssScores); }
    if (id === "nyha") return c.calculateNYHA ? c.calculateNYHA(f.grade) : {ok:false,error:"NYHA calculator unavailable."};
    if (id === "killip") return c.calculateKillip ? c.calculateKillip(f.grade) : {ok:false,error:"Killip calculator unavailable."};
    if (id === "sirs") return calculateViaTempDom(id, f);
    if (id === "qsofa") return calculateViaTempDom(id, f);
    if (id === "fib4") return calculateViaTempDom(id, f);
    if (id === "child_pugh") return calculateViaTempDom(id, f);

    return computeHighImpact(id, f);
  }

  function calculateViaTempDom(id, f) {
    var map = {
      sirs: [["calc-sirs-temp", f.temp],["calc-sirs-hr", f.hr],["calc-sirs-rr", f.rr],["calc-sirs-wbc", f.wbc]],
      qsofa: [["calc-qsofa-rr", f.rr],["calc-qsofa-sbp", f.sbp],["calc-qsofa-mental", f.mentalStatus]],
      fib4: [["calc-fib4-age", f.age],["calc-fib4-ast", f.ast],["calc-fib4-alt", f.alt],["calc-fib4-plt", f.platelets]],
      child_pugh: [["calc-child-bili", f.bilirubin],["calc-child-alb", f.albumin],["calc-child-inr", f.inr],["calc-child-ascites", f.ascites],["calc-child-encephalopathy", f.encephalopathy]]
    };
    var created = [];
    (map[id] || []).forEach(function(pair){
      if (!document.getElementById(pair[0])) {
        var input = document.createElement("input");
        input.id = pair[0];
        input.style.display = "none";
        document.body.appendChild(input);
        created.push(input);
      }
      document.getElementById(pair[0]).value = pair[1];
    });
    var resultEl = document.getElementById("calcResult-" + id);
    if (!resultEl) {
      resultEl = document.createElement("div");
      resultEl.id = "calcResult-" + id;
      resultEl.style.display = "none";
      document.body.appendChild(resultEl);
      created.push(resultEl);
    }
    var result = window.ClinicNoteCalculators.calculateFromUI(id);
    created.forEach(function(el){ if (el.parentNode) el.parentNode.removeChild(el); });
    return result;
  }

  function computeHighImpact(id, f) {
    var result = null;
    if (id === "heart" && window.calculateHEART) result = window.calculateHEART({history:num(f.history),ecg:num(f.ecg),age:num(f.age),riskFactors:num(f.riskFactors),troponin:num(f.troponin)});
    if (id === "curb65" && window.calculateCURB65) result = window.calculateCURB65({confusion:boolScore(f.confusion,1),ureaGT7:boolScore(f.ureaGT7,1),rrGE30:boolScore(f.rrGE30,1),bpLow:boolScore(f.bpLow,1),ageGE65:boolScore(f.ageGE65,1)});
    if (id === "ottawa_knee" && window.calculateOttawaKnee) result = window.calculateOttawaKnee({ageGT55:boolScore(f.ageGT55,1),patellaTenderness:boolScore(f.patellaTenderness,1),fibularHeadTenderness:boolScore(f.fibularHeadTenderness,1),unableToBearWeight:boolScore(f.unableToBearWeight,1),unableToFlex90:boolScore(f.unableToFlex90,1)});
    if (id === "ottawa_ankle" && window.calculateOttawaAnkle) result = window.calculateOttawaAnkle({malleolarTenderness:boolScore(f.malleolarTenderness,1),midfootTenderness:boolScore(f.midfootTenderness,1),unableToBearWeight:boolScore(f.unableToBearWeight,1)});
    if (id === "wells_dvt" && window.calculateWellsDVT) result = window.calculateWellsDVT({activeCancer:boolScore(f.activeCancer,1),paralysisOrCast:boolScore(f.paralysisOrCast,1),bedRestSurgery:boolScore(f.bedRestSurgery,1),localizedTenderness:boolScore(f.localizedTenderness,1),entireLegSwelling:boolScore(f.entireLegSwelling,1),calfSwelling:boolScore(f.calfSwelling,1),pittingEdema:boolScore(f.pittingEdema,1),collateralVeins:boolScore(f.collateralVeins,1),alternativeDiagnosis:boolScore(f.alternativeDiagnosis,-2)});
    if (id === "wells_pe" && window.calculateWellsPE) result = window.calculateWellsPE({dvtSymptoms:boolScore(f.dvtSymptoms,3),peIsPrimaryDiagnosis:boolScore(f.peIsPrimaryDiagnosis,3),hrGT100:boolScore(f.hrGT100,1.5),surgeryImmobilization:boolScore(f.surgeryImmobilization,1.5),previousDvtPE:boolScore(f.previousDvtPE,1.5),hemoptysis:boolScore(f.hemoptysis,1),malignancy:boolScore(f.malignancy,1)});
    if (id === "gcs" && window.calculateGCS) {
      var gcsEye=strictInteger(f.eyeOpening,1,4);var gcsVerbal=strictInteger(f.verbal,1,5);var gcsMotor=strictInteger(f.motor,1,6);
      if(gcsEye===null||gcsVerbal===null||gcsMotor===null) return {ok:false,error:"Select Eye, Verbal, and Motor GCS responses."};
      result = window.calculateGCS({eyeOpening:gcsEye,verbal:gcsVerbal,motor:gcsMotor});
    }
    if (id === "mcisaac" && window.calculateMcIsaac) result = window.calculateMcIsaac({feverGT38:boolScore(f.feverGT38,1),tonsillarExudate:boolScore(f.tonsillarExudate,1),tenderCervicalNodes:boolScore(f.tenderCervicalNodes,1),noCough:boolScore(f.noCough,1),age:num(f.age)});
    if (!result) return {ok:false,error:"Enter required clinician-controlled values."};
    return {ok:true,text:result.interpretation,safetyNote:result.safetyNotice || footer(),value:result.score};
  }

  function card(def) {
    var h = '<article class="calculator-card" data-calculator-card="'+esc(def.id)+'"><h3>'+esc(def.name)+'</h3><p>'+esc(def.desc)+'</p><div class="calculator-fields">';
    def.fields.forEach(function(field){
      h += '<div class="form-group"><label for="active-calc-'+esc(def.id)+'-'+esc(field[0])+'">'+esc(field[1])+'</label>';
      if (field[2] === "select") {
        h += '<select id="active-calc-'+esc(def.id)+'-'+esc(field[0])+'"><option value="">Select</option>';
        field[3].forEach(function(opt){
          if (Array.isArray(opt)) {
            h += '<option value="'+esc(opt[0])+'">'+esc(opt[1])+'</option>';
          } else {
            h += '<option value="'+esc(opt)+'">'+esc(opt)+'</option>';
          }
        });
        h += '</select>';
      } else {
        h += '<input id="active-calc-'+esc(def.id)+'-'+esc(field[0])+'" type="number" step="0.1" inputmode="decimal">';
      }
      h += '</div>';
    });
    h += "</div><div class=\"calculator-actions\"><button class=\"btn btn-primary btn-sm\" type=\"button\" onclick=\"ClinicNoteActiveCalculatorUI.calculate('" + esc(def.id) + "')\">Calculate</button><button class=\"btn btn-outline btn-sm\" type=\"button\" onclick=\"ClinicNoteActiveCalculatorUI.copy('" + esc(def.id) + "')\">Copy Result</button><button class=\"btn btn-ghost btn-sm\" type=\"button\" onclick=\"ClinicNoteActiveCalculatorUI.clear('" + esc(def.id) + "')\">Clear</button></div><div id=\"activeCalcResult-" + esc(def.id) + "\" class=\"calculator-result\" role=\"status\" aria-live=\"polite\">Result will appear here.</div><div class=\"calculator-safety\">" + footer() + "</div></article>";
    return h;
  }

  function render() {
    var grid = document.querySelector("#page-calculators .calculator-grid");
    if (!grid) return;
    grid.innerHTML = ACTIVE_CALCULATORS.map(card).join("");
  }

  function calculate(id) {
    var result = compute(id);
    var el = document.getElementById("activeCalcResult-" + id);
    if (!el) return result;
    if (!result || !result.ok) {
      el.textContent = result && result.error ? result.error : "Unable to calculate. Check entered values.";
      el.setAttribute("data-result-text", "");
      el.classList.add("calc-result-error");
      return result;
    }
    var out = result.text + "\n" + result.safetyNote;
    el.textContent = out;
    el.setAttribute("data-result-text", out);
    el.classList.remove("calc-result-error");
    return result;
  }

  function copy(id) {
    var el = document.getElementById("activeCalcResult-" + id);
    var text = el ? el.getAttribute("data-result-text") || "" : "";
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function(){});
  }

  function clear(id) {
    var scope = document.querySelector("[data-calculator-card=\"" + id + "\"]");
    if (!scope) return;
    Array.prototype.forEach.call(scope.querySelectorAll("input, select"), function(input){ input.value = ""; });
    var el = document.getElementById("activeCalcResult-" + id);
    if (el) {
      el.textContent = "Result will appear here.";
      el.setAttribute("data-result-text", "");
      el.classList.remove("calc-result-error");
    }
  }

  var api = { calculators: ACTIVE_CALCULATORS, render: render, calculate: calculate, copy: copy, clear: clear };
  window.ClinicNoteActiveCalculatorUI = api;
  if (typeof globalThis !== "undefined") globalThis.ClinicNoteActiveCalculatorUI = api;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
