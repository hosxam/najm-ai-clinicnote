/**
 * calculator-high-impact.js
 *
 * Clinical score calculators for documentation support only.
 * All outputs include the mandatory safety notice:
 *   "Score calculated for documentation support only. Clinician interpretation required."
 *
 * Each function receives a single `params` object with named inputs.
 * Returns { score, label, risk, interpretation, safetyNotice }.
 *
 * Sources are cited inline.
 */

// ──────────────────────────────────────────────
// 1. HEART Score (0‑10)
//    Six et al. 2008
// ──────────────────────────────────────────────
function calculateHEART(params) {
  const {
    history,   // 0‑2
    ecg,       // 0‑2
    age,       // 0‑2
    riskFactors, // 0‑2
    troponin   // 0‑2
  } = params;

  const score = (history ?? 0) + (ecg ?? 0) + (age ?? 0) + (riskFactors ?? 0) + (troponin ?? 0);

  let risk;
  if (score <= 3) risk = 'Low (1.7% MACE)';
  else if (score <= 6) risk = 'Moderate (13‑16% MACE)';
  else risk = 'High (50‑65% MACE)';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score,
    label: 'HEART Score',
    risk,
    interpretation: `HEART Score ${score}/10 – ${risk}. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 2. CURB‑65 (0‑5)
//    Lim et al. 2003
// ──────────────────────────────────────────────
function calculateCURB65(params) {
  const {
    confusion, // boolean
    ureaGT7,   // boolean (Urea > 7 mmol/L)
    rrGE30,    // boolean (Respiratory rate ≥ 30/min)
    bpLow,     // boolean (SBP < 90 or DBP ≤ 60)
    ageGE65    // boolean (Age ≥ 65)
  } = params;

  let score = 0;
  if (confusion) score += 1;
  if (ureaGT7) score += 1;
  if (rrGE30) score += 1;
  if (bpLow) score += 1;
  if (ageGE65) score += 1;

  let mortalityRisk;
  if (score === 0) mortalityRisk = 'Low (0.7%)';
  else if (score === 1) mortalityRisk = 'Low (2.1%)';
  else if (score === 2) mortalityRisk = 'Moderate (9.2%)';
  else if (score === 3) mortalityRisk = 'High (14.5%)';
  else mortalityRisk = 'Very high (≥ 40%)';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score,
    label: 'CURB‑65',
    risk: mortalityRisk,
    interpretation: `CURB‑65 Score ${score}/5 – ${mortalityRisk} 30‑day mortality. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 3. Ottawa Knee Rule (binary)
//    Stiell et al. 1995
// ──────────────────────────────────────────────
function calculateOttawaKnee(params) {
  const {
    ageGT55,           // boolean
    patellaTenderness, // boolean
    fibularHeadTenderness, // boolean
    unableToBearWeight, // boolean
    unableToFlex90     // boolean
  } = params;

  const criteriaMet =
    (ageGT55) ||
    (patellaTenderness) ||
    (fibularHeadTenderness) ||
    (unableToBearWeight) ||
    (unableToFlex90);

  const label = 'Ottawa Knee Rule';
  const risk = criteriaMet ? 'X‑ray indicated per rule' : 'X‑ray not indicated per rule';
  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score: criteriaMet ? 1 : 0,
    label,
    risk,
    interpretation: `Ottawa Knee Rule: ${criteriaMet ? 'X‑ray indicated' : 'X‑ray not indicated'} per rule. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 4. Ottawa Ankle Rule (binary)
//    Stiell et al. 1992
// ──────────────────────────────────────────────
function calculateOttawaAnkle(params) {
  const {
    malleolarTenderness, // boolean (posterior edge or tip of either malleolus)
    midfootTenderness,   // boolean (base of 5th metatarsal or navicular)
    unableToBearWeight   // boolean (immediate and in ED)
  } = params;

  const criteriaMet = (malleolarTenderness) || (midfootTenderness) || (unableToBearWeight);

  const label = 'Ottawa Ankle Rule';
  const risk = criteriaMet ? 'X‑ray indicated per rule' : 'X‑ray not indicated per rule';
  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score: criteriaMet ? 1 : 0,
    label,
    risk,
    interpretation: `Ottawa Ankle Rule: ${criteriaMet ? 'X‑ray indicated' : 'X‑ray not indicated'} per rule. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 5. Wells DVT Score
//    Wells et al. 1997
// ──────────────────────────────────────────────
function calculateWellsDVT(params) {
  const {
    activeCancer,          // +1
    paralysisOrCast,       // +1
    bedRestSurgery,        // +1 (recent bed rest >3 days or major surgery within 12 weeks)
    localizedTenderness,   // +1
    entireLegSwelling,     // +1
    calfSwelling,          // +1 (≥3 cm compared to asymptomatic leg)
    pittingEdema,          // +1
    collateralVeins,       // +1
    alternativeDiagnosis   // −2 (alternative diagnosis as likely or more likely)
  } = params;

  let score = 0;
  if (activeCancer) score += 1;
  if (paralysisOrCast) score += 1;
  if (bedRestSurgery) score += 1;
  if (localizedTenderness) score += 1;
  if (entireLegSwelling) score += 1;
  if (calfSwelling) score += 1;
  if (pittingEdema) score += 1;
  if (collateralVeins) score += 1;
  if (alternativeDiagnosis) score -= 2;

  let risk;
  if (score >= 3) risk = 'High probability';
  else if (score >= 1) risk = 'Moderate probability';
  else risk = 'Low probability';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score,
    label: 'Wells DVT Score',
    risk,
    interpretation: `Wells DVT Score ${score} – ${risk}. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 6. Wells PE Score
//    Wells et al. 2000
// ──────────────────────────────────────────────
function calculateWellsPE(params) {
  const {
    dvtSymptoms,           // +3 (clinical signs of DVT)
    peIsPrimaryDiagnosis,  // +3 (PE is #1 diagnosis or equally likely)
    hrGT100,               // +1.5 (heart rate > 100)
    surgeryImmobilization, // +1.5 (surgery or immobilization within 4 weeks)
    previousDvtPE,         // +1.5 (previous DVT or PE)
    hemoptysis,            // +1
    malignancy             // +1 (active cancer)
  } = params;

  let score = 0;
  if (dvtSymptoms) score += 3;
  if (peIsPrimaryDiagnosis) score += 3;
  if (hrGT100) score += 1.5;
  if (surgeryImmobilization) score += 1.5;
  if (previousDvtPE) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;

  let risk;
  if (score > 6) risk = 'High probability';
  else if (score > 4) risk = 'Moderate probability';
  else risk = 'Low probability';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score,
    label: 'Wells PE Score',
    risk,
    interpretation: `Wells PE Score ${score} – ${risk}. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 7. Glasgow Coma Scale (GCS) 3‑15
//    Teasdale & Jennett 1974
// ──────────────────────────────────────────────
function calculateGCS(params) {
  const {
    eyeOpening,   // 1‑4
    verbal,       // 1‑5
    motor         // 1‑6
  } = params;

  const eye = Math.min(Math.max(eyeOpening ?? 1, 1), 4);
  const verb = Math.min(Math.max(verbal ?? 1, 1), 5);
  const mot = Math.min(Math.max(motor ?? 1, 1), 6);

  const total = eye + verb + mot;

  let category;
  if (total <= 8) category = 'Severe (GCS ≤ 8)';
  else if (total <= 12) category = 'Moderate (GCS 9‑12)';
  else category = 'Minor (GCS 13‑15)';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score: total,
    label: 'Glasgow Coma Scale',
    risk: category,
    interpretation: `GCS ${total}/15 – ${category}. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 8. McIsaac / Centor Score (0‑5)
//    McIsaac et al. 1998
// ──────────────────────────────────────────────
function calculateMcIsaac(params) {
  const {
    feverGT38,          // boolean (temperature > 38 °C)
    tonsillarExudate,   // boolean
    tenderCervicalNodes, // boolean
    noCough,            // boolean (absence of cough)
    age                 // number (years)
  } = params;

  let score = 0;
  if (feverGT38) score += 1;
  if (tonsillarExudate) score += 1;
  if (tenderCervicalNodes) score += 1;
  if (noCough) score += 1;

  // Age adjustment
  if (age >= 45) score -= 1;
  else if (age >= 15) score += 0; // no change
  else if (age >= 3) score += 1;
  else score += 0; // age < 3, no adjustment per original

  // Clamp to 0‑5
  score = Math.max(0, Math.min(5, score));

  let risk;
  if (score <= 1) risk = 'Low (≤ 10% Group A Strep)';
  else if (score === 2) risk = 'Moderate (15‑20% Group A Strep)';
  else if (score === 3) risk = 'Moderate (30‑35% Group A Strep)';
  else risk = 'High (≥ 50% Group A Strep)';

  const safetyNotice = 'Score calculated for documentation support only. Clinician interpretation required.';

  return {
    score,
    label: 'McIsaac / Centor Score',
    risk,
    interpretation: `McIsaac Score ${score}/5 – ${risk}. Local protocol applies.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 9. CHA2DS2-VASc (0‑9)
//    Lip et al. 2010 (validated in atrial fibrillation)
// ──────────────────────────────────────────────
function calculateCHA2DS2VASc(params) {
  const {
    chf,             // +1 Congestive heart failure
    hypertension,    // +1
    age75plus,       // +2 Age ≥75
    diabetes,        // +1
    strokeOrTia,     // +2 Previous stroke/TIA/thromboembolism
    vascularDisease, // +1 MI, PAD, aortic plaque
    age65to74,       // +1
    female           // +1 (sex category)
  } = params;

  let score = 0;
  if (chf) score += 1;
  if (hypertension) score += 1;
  if (age75plus) score += 2;
  if (diabetes) score += 1;
  if (strokeOrTia) score += 2;
  if (vascularDisease) score += 1;
  if (age65to74) score += 1;
  if (female) score += 1;

  // Clamp to 0‑9 (note: age75plus and age65to74 should not both be set)
  if (score > 9) score = 9;
  if (score < 0) score = 0;

  let risk;
  if (score === 0) risk = 'Low (no anticoagulation)';
  else if (score === 1) risk = 'Low‑moderate (consider anticoagulation, especially if female=1 only, no anticoag)';
  else risk = 'Moderate‑high (anticoagulation indicated)';

  const safetyNotice = 'Score calculated for documentation support only. Anticoagulation decision requires clinician judgement and risk‑benefit assessment.';

  return {
    score,
    label: 'CHA2DS2-VASc',
    risk,
    interpretation: `CHA2DS2-VASc score ${score}/9 — ${risk}. Anticoagulation decision per local protocol.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 10. HAS-BLED (0‑9)
//     Pisters et al. 2010
// ──────────────────────────────────────────────
function calculateHASBLED(params) {
  const {
    hypertensionUncontrolled, // +1 (SBP >160)
    abnormalRenalFunction,    // +1 (Cr ≥200 µmol/L or dialysis)
    abnormalLiverFunction,    // +1
    strokeHistory,            // +1
    bleedingHistory,          // +1
    labileINR,                // +1
    ageGT65,                  // +1
    drugsAlcohol,             // +1 (antiplatelets/NSAIDs OR alcohol)
    drugsAlcoholBoth          // +1 (additional point if BOTH drugs AND alcohol)
  } = params;

  let score = 0;
  if (hypertensionUncontrolled) score += 1;
  if (abnormalRenalFunction) score += 1;
  if (abnormalLiverFunction) score += 1;
  if (strokeHistory) score += 1;
  if (bleedingHistory) score += 1;
  if (labileINR) score += 1;
  if (ageGT65) score += 1;
  if (drugsAlcohol) score += 1;
  if (drugsAlcoholBoth) score += 1;

  if (score > 9) score = 9;
  if (score < 0) score = 0;

  let risk;
  if (score <= 2) risk = 'Low risk';
  else risk = 'High risk (caution with anticoagulation, address modifiable risk factors)';

  const safetyNotice = 'Score calculated for documentation support only. Anticoagulation decision requires clinician judgement and risk‑benefit assessment.';

  return {
    score,
    label: 'HAS-BLED',
    risk,
    interpretation: `HAS-BLED score ${score}/9 — ${risk}. Address modifiable bleeding risk factors.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 11. eGFR (CKD-EPI 2021, race‑free)
//     Inker et al. 2021, NEJM
// ──────────────────────────────────────────────
function calculateEGFR(params) {
  const {
    creatinine, // µmol/L
    age,        // years
    female      // boolean
  } = params;

  const cr = Number(creatinine);
  const yr = Number(age);
  if (!Number.isFinite(cr) || cr <= 0 || !Number.isFinite(yr) || yr < 0) {
    return {
      score: null,
      label: 'eGFR (CKD-EPI 2021)',
      risk: 'Insufficient input',
      interpretation: 'eGFR could not be calculated. Provide a positive creatinine and age.',
      safetyNotice: 'eGFR is an estimate for documentation support only; clinician interpretation required. Acute kidney injury, extremes of body size, or rapidly changing creatinine reduce accuracy.'
    };
  }

  // Convert µmol/L to mg/dL
  const crMgDl = cr / 88.4;

  let k, alpha, multiplier;
  if (female) {
    k = 0.7;
    alpha = -0.241;
    multiplier = 1.012;
  } else {
    k = 0.9;
    alpha = -0.302;
    multiplier = 1.0;
  }

  const ratio = crMgDl / k;
  const minVal = Math.min(ratio, 1);
  const maxVal = Math.max(ratio, 1);
  const egfrRaw = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, yr) * multiplier;
  const egfr = Math.round(egfrRaw);

  let stage, description;
  if (egfr >= 90) { stage = 'G1'; description = 'normal/high'; }
  else if (egfr >= 60) { stage = 'G2'; description = 'mildly decreased'; }
  else if (egfr >= 45) { stage = 'G3a'; description = 'mild‑moderate'; }
  else if (egfr >= 30) { stage = 'G3b'; description = 'moderate‑severe'; }
  else if (egfr >= 15) { stage = 'G4'; description = 'severely decreased'; }
  else { stage = 'G5'; description = 'kidney failure'; }

  const safetyNotice = 'eGFR is an estimate for documentation support only; clinician interpretation required. Acute kidney injury, extremes of body size, or rapidly changing creatinine reduce accuracy.';

  return {
    score: egfr,
    label: 'eGFR (CKD-EPI 2021)',
    risk: `CKD stage ${stage} (${description})`,
    interpretation: `eGFR ${egfr} mL/min/1.73m² — CKD stage ${stage} (${description}). Albuminuria adds risk stratification.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// 12. NEWS2 (National Early Warning Score 2)
//     Royal College of Physicians 2017
// ──────────────────────────────────────────────
function calculateNEWS2(params) {
  const {
    respiratoryRate,     // breaths/min
    spo2,                // %
    onSupplementalO2,    // boolean
    temperature,         // °C
    systolicBP,          // mmHg
    heartRate,           // bpm
    consciousness,       // 'alert' | 'confused' | other
    hypercapnicTarget    // boolean — use Scale 2 thresholds for SpO2
  } = params;

  function rrPoints(rr) {
    if (!Number.isFinite(rr)) return 0;
    if (rr <= 8) return 3;
    if (rr <= 11) return 1;
    if (rr <= 20) return 0;
    if (rr <= 24) return 2;
    return 3;
  }

  function spo2Scale1Points(o2) {
    if (!Number.isFinite(o2)) return 0;
    if (o2 <= 91) return 3;
    if (o2 <= 93) return 2;
    if (o2 <= 95) return 1;
    return 0;
  }

  function spo2Scale2Points(o2, onO2) {
    if (!Number.isFinite(o2)) return 0;
    if (o2 <= 83) return 3;
    if (o2 <= 85) return 2;
    if (o2 <= 87) return 1;
    if (o2 <= 92) return 0;
    // 93+ : depends on supplemental O2
    if (!onO2) return 0;
    if (o2 <= 94) return 1;
    if (o2 <= 96) return 2;
    return 3;
  }

  function tempPoints(t) {
    if (!Number.isFinite(t)) return 0;
    if (t <= 35.0) return 3;
    if (t <= 36.0) return 1;
    if (t <= 38.0) return 0;
    if (t <= 39.0) return 1;
    return 2;
  }

  function sbpPoints(sbp) {
    if (!Number.isFinite(sbp)) return 0;
    if (sbp <= 90) return 3;
    if (sbp <= 100) return 2;
    if (sbp <= 110) return 1;
    if (sbp <= 219) return 0;
    return 3;
  }

  function hrPoints(hr) {
    if (!Number.isFinite(hr)) return 0;
    if (hr <= 40) return 3;
    if (hr <= 50) return 1;
    if (hr <= 90) return 0;
    if (hr <= 110) return 1;
    if (hr <= 130) return 2;
    return 3;
  }

  const rr = Number(respiratoryRate);
  const o2 = Number(spo2);
  const t = Number(temperature);
  const sbp = Number(systolicBP);
  const hr = Number(heartRate);

  const pRR = rrPoints(rr);
  const pO2 = hypercapnicTarget
    ? spo2Scale2Points(o2, !!onSupplementalO2)
    : spo2Scale1Points(o2);
  const pSupp = onSupplementalO2 ? 2 : 0;
  const pTemp = tempPoints(t);
  const pSbp = sbpPoints(sbp);
  const pHr = hrPoints(hr);
  const pCons = (consciousness && String(consciousness).toLowerCase() !== 'alert') ? 3 : 0;

  const total = pRR + pO2 + pSupp + pTemp + pSbp + pHr + pCons;
  const components = [pRR, pO2, pSupp, pTemp, pSbp, pHr, pCons];
  const anySingleThree = components.some(function(p){ return p === 3; });

  let risk, action;
  if (total >= 7) {
    risk = 'High';
    action = 'Emergency clinical review; consider critical care';
  } else if (total >= 5 || anySingleThree) {
    risk = 'Medium';
    action = 'Urgent clinical review';
  } else {
    risk = 'Low';
    action = 'Ward observation';
  }

  const safetyNotice = 'Single time‑point score. Trend matters more than absolute value. Local protocol applies.';

  return {
    score: total,
    label: 'NEWS2',
    risk,
    interpretation: `NEWS2 score ${total}/20 — ${risk} risk. ${action}.`,
    safetyNotice
  };
}

// ──────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────
const CALCULATOR_REGISTRY = [
  {
    id: 'heart',
    name: 'HEART Score',
    category: 'Cardiology',
    inputFields: [
      { name: 'history', type: 'number', min: 0, max: 2, label: 'History (0‑2)' },
      { name: 'ecg', type: 'number', min: 0, max: 2, label: 'ECG (0‑2)' },
      { name: 'age', type: 'number', min: 0, max: 2, label: 'Age (0‑2)' },
      { name: 'riskFactors', type: 'number', min: 0, max: 2, label: 'Risk factors (0‑2)' },
      { name: 'troponin', type: 'number', min: 0, max: 2, label: 'Troponin (0‑2)' }
    ],
    fn: calculateHEART
  },
  {
    id: 'curb65',
    name: 'CURB‑65',
    category: 'Respiratory / Infectious Disease',
    inputFields: [
      { name: 'confusion', type: 'boolean', label: 'Confusion' },
      { name: 'ureaGT7', type: 'boolean', label: 'Urea > 7 mmol/L' },
      { name: 'rrGE30', type: 'boolean', label: 'Respiratory rate ≥ 30/min' },
      { name: 'bpLow', type: 'boolean', label: 'SBP < 90 or DBP ≤ 60' },
      { name: 'ageGE65', type: 'boolean', label: 'Age ≥ 65' }
    ],
    fn: calculateCURB65
  },
  {
    id: 'ottawaKnee',
    name: 'Ottawa Knee Rule',
    category: 'Orthopedics',
    inputFields: [
      { name: 'ageGT55', type: 'boolean', label: 'Age > 55' },
      { name: 'patellaTenderness', type: 'boolean', label: 'Patella tenderness' },
      { name: 'fibularHeadTenderness', type: 'boolean', label: 'Fibular head tenderness' },
      { name: 'unableToBearWeight', type: 'boolean', label: 'Unable to bear weight (immediate & in ED)' },
      { name: 'unableToFlex90', type: 'boolean', label: 'Unable to flex knee to 90°' }
    ],
    fn: calculateOttawaKnee
  },
  {
    id: 'ottawaAnkle',
    name: 'Ottawa Ankle Rule',
    category: 'Orthopedics',
    inputFields: [
      { name: 'malleolarTenderness', type: 'boolean', label: 'Malleolar tenderness (posterior edge or tip)' },
      { name: 'midfootTenderness', type: 'boolean', label: 'Midfoot tenderness (base 5th metatarsal / navicular)' },
      { name: 'unableToBearWeight', type: 'boolean', label: 'Unable to bear weight (immediate & in ED)' }
    ],
    fn: calculateOttawaAnkle
  },
  {
    id: 'wellsDVT',
    name: 'Wells DVT Score',
    category: 'Vascular / Hematology',
    inputFields: [
      { name: 'activeCancer', type: 'boolean', label: 'Active cancer' },
      { name: 'paralysisOrCast', type: 'boolean', label: 'Paralysis, paresis, or recent plaster immobilization' },
      { name: 'bedRestSurgery', type: 'boolean', label: 'Bed rest >3 days or major surgery within 12 weeks' },
      { name: 'localizedTenderness', type: 'boolean', label: 'Localized tenderness along deep vein distribution' },
      { name: 'entireLegSwelling', type: 'boolean', label: 'Entire leg swollen' },
      { name: 'calfSwelling', type: 'boolean', label: 'Calf swelling ≥3 cm compared to asymptomatic leg' },
      { name: 'pittingEdema', type: 'boolean', label: 'Pitting edema confined to symptomatic leg' },
      { name: 'collateralVeins', type: 'boolean', label: 'Collateral superficial veins (non‑varicose)' },
      { name: 'alternativeDiagnosis', type: 'boolean', label: 'Alternative diagnosis as likely or more likely' }
    ],
    fn: calculateWellsDVT
  },
  {
    id: 'wellsPE',
    name: 'Wells PE Score',
    category: 'Vascular / Pulmonary',
    inputFields: [
      { name: 'dvtSymptoms', type: 'boolean', label: 'Clinical signs of DVT (swelling, pain)' },
      { name: 'peIsPrimaryDiagnosis', type: 'boolean', label: 'PE is #1 diagnosis or equally likely' },
      { name: 'hrGT100', type: 'boolean', label: 'Heart rate > 100' },
      { name: 'surgeryImmobilization', type: 'boolean', label: 'Surgery or immobilization within 4 weeks' },
      { name: 'previousDvtPE', type: 'boolean', label: 'Previous DVT or PE' },
      { name: 'hemoptysis', type: 'boolean', label: 'Hemoptysis' },
      { name: 'malignancy', type: 'boolean', label: 'Active cancer' }
    ],
    fn: calculateWellsPE
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale',
    category: 'Neurology / Trauma',
    inputFields: [
      { name: 'eyeOpening', type: 'number', min: 1, max: 4, label: 'Eye opening (1‑4)' },
      { name: 'verbal', type: 'number', min: 1, max: 5, label: 'Verbal response (1‑5)' },
      { name: 'motor', type: 'number', min: 1, max: 6, label: 'Motor response (1‑6)' }
    ],
    fn: calculateGCS
  },
  {
    id: 'mcisaac',
    name: 'McIsaac / Centor Score',
    category: 'Infectious Disease / ENT',
    inputFields: [
      { name: 'feverGT38', type: 'boolean', label: 'Temperature > 38 °C' },
      { name: 'tonsillarExudate', type: 'boolean', label: 'Tonsillar exudate' },
      { name: 'tenderCervicalNodes', type: 'boolean', label: 'Tender anterior cervical lymph nodes' },
      { name: 'noCough', type: 'boolean', label: 'Absence of cough' },
      { name: 'age', type: 'number', min: 0, max: 120, label: 'Age (years)' }
    ],
    fn: calculateMcIsaac
  },
  {
    id: 'cha2ds2_vasc',
    name: 'CHA2DS2-VASc',
    category: 'Cardiology',
    inputFields: [
      { name: 'chf', type: 'boolean', label: 'Congestive heart failure' },
      { name: 'hypertension', type: 'boolean', label: 'Hypertension' },
      { name: 'age75plus', type: 'boolean', label: 'Age ≥75' },
      { name: 'diabetes', type: 'boolean', label: 'Diabetes' },
      { name: 'strokeOrTia', type: 'boolean', label: 'Previous stroke / TIA / thromboembolism' },
      { name: 'vascularDisease', type: 'boolean', label: 'Vascular disease (MI, PAD, aortic plaque)' },
      { name: 'age65to74', type: 'boolean', label: 'Age 65‑74' },
      { name: 'female', type: 'boolean', label: 'Female sex' }
    ],
    fn: calculateCHA2DS2VASc
  },
  {
    id: 'has_bled',
    name: 'HAS-BLED',
    category: 'Cardiology / Hematology',
    inputFields: [
      { name: 'hypertensionUncontrolled', type: 'boolean', label: 'Uncontrolled hypertension (SBP >160)' },
      { name: 'abnormalRenalFunction', type: 'boolean', label: 'Abnormal renal function (Cr ≥200 µmol/L or dialysis)' },
      { name: 'abnormalLiverFunction', type: 'boolean', label: 'Abnormal liver function' },
      { name: 'strokeHistory', type: 'boolean', label: 'History of stroke' },
      { name: 'bleedingHistory', type: 'boolean', label: 'History of major bleeding or predisposition' },
      { name: 'labileINR', type: 'boolean', label: 'Labile INR' },
      { name: 'ageGT65', type: 'boolean', label: 'Age >65' },
      { name: 'drugsAlcohol', type: 'boolean', label: 'Drugs (antiplatelets/NSAIDs) or alcohol' },
      { name: 'drugsAlcoholBoth', type: 'boolean', label: 'BOTH drugs and alcohol (additional point)' }
    ],
    fn: calculateHASBLED
  },
  {
    id: 'egfr_ckd_epi',
    name: 'eGFR (CKD-EPI 2021)',
    category: 'Nephrology',
    inputFields: [
      { name: 'creatinine', type: 'number', min: 1, max: 2000, label: 'Serum creatinine (µmol/L)' },
      { name: 'age', type: 'number', min: 0, max: 120, label: 'Age (years)' },
      { name: 'female', type: 'boolean', label: 'Female sex' }
    ],
    fn: calculateEGFR
  },
  {
    id: 'news2',
    name: 'NEWS2',
    category: 'General / Acute Medicine',
    inputFields: [
      { name: 'respiratoryRate', type: 'number', min: 0, max: 80, label: 'Respiratory rate (breaths/min)' },
      { name: 'spo2', type: 'number', min: 50, max: 100, label: 'SpO2 (%)' },
      { name: 'onSupplementalO2', type: 'boolean', label: 'On supplemental oxygen' },
      { name: 'temperature', type: 'number', min: 25, max: 45, label: 'Temperature (°C)' },
      { name: 'systolicBP', type: 'number', min: 30, max: 300, label: 'Systolic BP (mmHg)' },
      { name: 'heartRate', type: 'number', min: 0, max: 250, label: 'Heart rate (bpm)' },
      { name: 'consciousness', type: 'select', options: ['alert', 'confused'], label: 'Consciousness (AVPU/CVPU)' },
      { name: 'hypercapnicTarget', type: 'boolean', label: 'Hypercapnic target (use SpO2 Scale 2)' }
    ],
    fn: calculateNEWS2
  }
];

// Export for Node.js or make available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateHEART,
    calculateCURB65,
    calculateOttawaKnee,
    calculateOttawaAnkle,
    calculateWellsDVT,
    calculateWellsPE,
    calculateGCS,
    calculateMcIsaac,
    calculateCHA2DS2VASc,
    calculateHASBLED,
    calculateEGFR,
    calculateNEWS2,
    CALCULATOR_REGISTRY
  };
} else if (typeof window !== 'undefined') {
  window.calculateHEART = calculateHEART;
  window.calculateCURB65 = calculateCURB65;
  window.calculateOttawaKnee = calculateOttawaKnee;
  window.calculateOttawaAnkle = calculateOttawaAnkle;
  window.calculateWellsDVT = calculateWellsDVT;
  window.calculateWellsPE = calculateWellsPE;
  window.calculateGCS = calculateGCS;
  window.calculateMcIsaac = calculateMcIsaac;
  window.calculateCHA2DS2VASc = calculateCHA2DS2VASc;
  window.calculateHASBLED = calculateHASBLED;
  window.calculateEGFR = calculateEGFR;
  window.calculateNEWS2 = calculateNEWS2;
  window.CALCULATOR_REGISTRY = CALCULATOR_REGISTRY;
}
