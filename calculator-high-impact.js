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
  window.CALCULATOR_REGISTRY = CALCULATOR_REGISTRY;
}
