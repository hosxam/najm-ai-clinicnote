// Najm AI ClinicNote - Expanded Speed Mode Visit Library
// 75 visit types across 8 specialties

var VISIT_LIBRARY = {
 "General Medicine / GP": {
  "Fever / URTI": {
   "symptoms": [
    "fever",
    "cough",
    "sore throat",
    "runny nose",
    "body aches",
    "fatigue",
    "chills",
    "loss of appetite",
    "sneezing",
    "malaise",
    "nasal congestion"
   ],
   "negatives": [
    "no chest pain",
    "no SOB",
    "no wheezing",
    "no hemoptysis",
    "no vomiting",
    "no rash",
    "no neck stiffness",
    "no photophobia",
    "no confusion"
   ],
   "exam": [
    "Temp 38.7",
    "HR 92",
    "BP 125/80",
    "RR 18",
    "O2 sat 98%",
    "Pharynx injected",
    "Tonsils enlarged",
    "Chest clear"
   ],
   "redFlags": [
    "High fever >40",
    "Stiff neck",
    "Petechial rash",
    "Altered mental status",
    "Respiratory distress"
   ],
   "planPhrases": [
    "Antipyretics as needed",
    "Increased oral fluids and rest",
    "Symptomatic treatment for congestion",
    "Salt water gargle",
    "Return if fever persists >72h"
   ],
   "followUp": [
    "5-7 days if no improvement",
    "Return for persistent fever >72h",
    "If worsening"
   ]
  },
  "Cough": {
   "symptoms": [
    "cough",
    "productive cough",
    "dry cough",
    "sputum",
    "dyspnea",
    "wheezing",
    "chest tightness",
    "fever",
    "night sweats",
    "weight loss"
   ],
   "negatives": [
    "no hemoptysis",
    "no night sweats",
    "no weight loss",
    "no chest pain",
    "no fever",
    "no orthopnea",
    "no PND",
    "no edema"
   ],
   "exam": [
    "RR 16",
    "O2 sat 97% RA",
    "Chest clear",
    "No wheeze",
    "No crackles",
    "Throat normal",
    "No lymphadenopathy"
   ],
   "redFlags": [
    "Hemoptysis",
    "Weight loss",
    "Night sweats",
    "Chest pain",
    "Cough >3 weeks"
   ],
   "planPhrases": [
    "Cough suppressant",
    "Expectorant",
    "Increase fluids",
    "Avoid smoke/irritants",
    "Chest Xray if prolonged",
    "Return if cough >3 weeks or hemoptysis"
   ],
   "followUp": [
    "7-10 days",
    "CXR for cough >3 weeks",
    "Earlier if worsening"
   ]
  },
  "Sore throat": {
   "symptoms": [
    "sore throat",
    "painful swallowing",
    "fever",
    "headache",
    "malaise",
    "enlarged tonsils",
    "hoarse voice",
    "ear pain",
    "loss of appetite"
   ],
   "negatives": [
    "no cough",
    "no runny nose",
    "no rash",
    "no abdominal pain",
    "no difficulty breathing",
    "no drooling",
    "no muffled voice",
    "no trismus"
   ],
   "exam": [
    "Temp 38.2",
    "Pharynx erythematous",
    "Tonsils enlarged with exudate",
    "Cervical lymphadenopathy",
    "Tympanic membranes normal"
   ],
   "redFlags": [
    "Drooling/muffled voice",
    "Trismus",
    "Stridor",
    "Respiratory distress"
   ],
   "planPhrases": [
    "Analgesics",
    "Salt water gargle",
    "Warm fluids",
    "Antibiotics if Centor >=3",
    "Complete course",
    "Return if difficulty swallowing"
   ],
   "followUp": [
    "48-72h",
    "Earlier if severe/dehydration",
    "If abscess suspected"
   ]
  },
  "Headache": {
   "symptoms": [
    "headache",
    "throbbing",
    "pressure",
    "photophobia",
    "phonophobia",
    "nausea",
    "vomiting",
    "visual changes",
    "aura",
    "neck stiffness",
    "fatigue"
   ],
   "negatives": [
    "no fever",
    "no neck stiffness",
    "no photophobia",
    "no focal deficit",
    "no vision loss",
    "no head trauma",
    "no confusion",
    "no seizure"
   ],
   "exam": [
    "BP 125/82",
    "HR 76",
    "Neuro exam normal",
    "Cranial nerves intact",
    "Fundoscopy normal",
    "No meningeal signs",
    "No sinus tenderness"
   ],
   "redFlags": [
    "Thunderclap headache",
    "Neck stiffness/fever",
    "Focal deficit",
    "Head trauma",
    "Vision changes",
    "New onset >50 years"
   ],
   "planPhrases": [
    "Simple analgesics",
    "Triptans if migraine",
    "Rest in dark quiet room",
    "Hydration",
    "Sleep hygiene",
    "Return if new/worsening"
   ],
   "followUp": [
    "2-4 weeks recurring",
    "ER if sudden severe",
    "If pattern changes"
   ]
  },
  "Dizziness": {
   "symptoms": [
    "dizziness",
    "vertigo",
    "lightheadedness",
    "imbalance",
    "nausea",
    "vomiting",
    "tinnitus",
    "hearing loss",
    "headache",
    "blurred vision",
    "palpitations"
   ],
   "negatives": [
    "no focal weakness",
    "no speech difficulty",
    "no chest pain",
    "no palpitations",
    "no trauma",
    "no fever",
    "no diplopia",
    "no numbness"
   ],
   "exam": [
    "BP 118/76 supine 112/72 standing",
    "HR 72",
    "Neuro normal",
    "Nystagmus absent",
    "Dix-Hallpike negative",
    "Romberg negative",
    "Ears normal"
   ],
   "redFlags": [
    "Focal deficit CVA/TIA",
    "Syncope/cardiac",
    "Head trauma",
    "Meningeal signs",
    "Chest pain/palpitations"
   ],
   "planPhrases": [
    "Vestibular suppressants",
    "Antiemetics",
    "Epley if BPPV",
    "Fall precautions",
    "Avoid driving",
    "Hydration if orthostatic",
    "Return if focal symptoms or syncope"
   ],
   "followUp": [
    "3-5 days",
    "Balance exercises chronic",
    "Neuro referral indicated"
   ]
  },
  "Fatigue": {
   "symptoms": [
    "fatigue",
    "low energy",
    "sleepiness",
    "poor concentration",
    "muscle weakness",
    "mood changes",
    "weight changes",
    "headache",
    "palpitations",
    "SOB on exertion"
   ],
   "negatives": [
    "no fever",
    "no night sweats",
    "no weight loss",
    "no chest pain",
    "no joint pain",
    "no rash",
    "no depression",
    "no suicidal thoughts"
   ],
   "exam": [
    "BP 120/78",
    "HR 76",
    "Temp 36.8",
    "Pallor absent",
    "Thyroid normal",
    "Chest clear",
    "CVS normal",
    "Abdomen soft"
   ],
   "redFlags": [
    "Weight loss",
    "Night sweats",
    "FUO",
    "Lymphadenopathy",
    "Pallor",
    "Thyroid mass",
    "Depression/suicidal"
   ],
   "planPhrases": [
    "Labs: CBC, TSH, ferritin, B12, vit D, glucose",
    "Screen PHQ-9",
    "Sleep hygiene",
    "Exercise balanced diet",
    "Caffeine reduction",
    "Return for lab review"
   ],
   "followUp": [
    "1 week lab results",
    "Monthly improving",
    "If persists >3 months"
   ]
  },
  "Abdominal pain": {
   "symptoms": [
    "abdominal pain",
    "cramping",
    "bloating",
    "nausea",
    "vomiting",
    "diarrhea",
    "constipation",
    "heartburn",
    "loss of appetite",
    "early satiety"
   ],
   "negatives": [
    "no fever",
    "no hematemesis",
    "no melena",
    "no hematochezia",
    "no jaundice",
    "no dysuria",
    "no trauma",
    "no peritoneal signs"
   ],
   "exam": [
    "BP 125/82",
    "HR 78",
    "Temp 36.9",
    "Abdomen soft",
    "No distension",
    "No guarding",
    "No rebound",
    "Bowel sounds present",
    "No organomegaly"
   ],
   "redFlags": [
    "Severe localized pain",
    "Hematemesis/melena",
    "Fever with pain",
    "Jaundice",
    "Weight loss",
    "Palpable mass"
   ],
   "planPhrases": [
    "Antispasmodic",
    "PPI if dyspepsia",
    "Antiemetic",
    "BRAT diet",
    "Avoid NSAIDs",
    "Return if severe/worsening",
    "US abdomen if biliary"
   ],
   "followUp": [
    "3-5 days",
    "US abdomen",
    "Gastro referral chronic"
   ]
  },
  "Nausea / vomiting": {
   "symptoms": [
    "nausea",
    "vomiting",
    "abdominal discomfort",
    "loss of appetite",
    "dizziness",
    "headache",
    "diarrhea",
    "fever",
    "sweating",
    "weakness"
   ],
   "negatives": [
    "no hematemesis",
    "no melena",
    "no severe pain",
    "no head trauma",
    "no meningitis signs",
    "no focal deficit",
    "no known pregnancy"
   ],
   "exam": [
    "BP 115/75",
    "HR 84",
    "Temp 36.9",
    "Mucous membranes dry",
    "Skin turgor normal",
    "Abdomen soft",
    "Neuro normal"
   ],
   "redFlags": [
    "Hematemesis",
    "Severe abdominal pain",
    "Head trauma",
    "Meningeal signs",
    "Dehydration",
    "Electrolyte imbalance"
   ],
   "planPhrases": [
    "Antiemetic",
    "Clear liquid diet",
    "BRAT diet",
    "Oral rehydration",
    "Small frequent meals",
    "IV fluids if unable"
   ],
   "followUp": [
    "24-48h",
    "IV fluids dehydrated",
    "Recurrent episodes"
   ]
  },
  "Diarrhea": {
   "symptoms": [
    "diarrhea",
    "watery stools",
    "frequent stools",
    "urgency",
    "cramping",
    "bloating",
    "nausea",
    "vomiting",
    "fever",
    "dehydration",
    "malaise"
   ],
   "negatives": [
    "no blood in stool",
    "no mucus",
    "no melena",
    "no severe pain",
    "no fever >38.5",
    "no recent antibiotics",
    "no travel history",
    "no known IBD"
   ],
   "exam": [
    "BP 120/78",
    "HR 80",
    "Temp 37.5",
    "Mucous slightly dry",
    "Cap refill <2 sec",
    "Abdomen mild tenderness",
    "Bowel sounds hyperactive"
   ],
   "redFlags": [
    "Bloody diarrhea",
    "High fever >38.5",
    "Severe dehydration",
    "Recent antibiotics",
    "Travel endemic",
    "Immunocompromised"
   ],
   "planPhrases": [
    "ORS",
    "BRAT diet",
    "Antidiarrheal if no blood/fever",
    "Probiotics",
    "Avoid dairy/fatty",
    "Return if bloody stool/high fever",
    "Stool culture if prolonged"
   ],
   "followUp": [
    "48-72h",
    "Stool culture",
    "IV fluids"
   ]
  },
  "Constipation": {
   "symptoms": [
    "constipation",
    "infrequent stools",
    "hard stools",
    "straining",
    "incomplete evacuation",
    "bloating",
    "abdominal discomfort",
    "nausea",
    "laxative dependency",
    "hemorrhoids"
   ],
   "negatives": [
    "no blood in stool",
    "no melena",
    "no weight loss",
    "no fever",
    "no severe pain",
    "no colon cancer family hx",
    "no change >6 weeks"
   ],
   "exam": [
    "Abdomen soft",
    "Mild distension",
    "No guarding",
    "Bowel sounds present",
    "No masses",
    "Rectal exam normal"
   ],
   "redFlags": [
    "Blood in stool",
    "Weight loss",
    "Severe pain",
    "Colon cancer family hx",
    "Change >6 weeks >50 years",
    "Iron deficiency anemia"
   ],
   "planPhrases": [
    "Increase fiber and fluids",
    "Regular exercise",
    "Bulk-forming laxatives",
    "Osmotic laxatives if needed",
    "Avoid chronic stimulant use",
    "Return if blood or severe pain"
   ],
   "followUp": [
    "2-4 weeks lifestyle",
    "Earlier if alarming",
    "Gastro referral chronic"
   ]
  },
  "Chest pain": {
   "symptoms": [
    "chest pain",
    "tightness",
    "pressure",
    "burning",
    "radiating pain",
    "dyspnea",
    "palpitations",
    "nausea",
    "sweating",
    "dizziness"
   ],
   "negatives": [
    "no radiation to arm/jaw",
    "no dyspnea at rest",
    "no palpitations",
    "no syncope",
    "no fever/cough",
    "no trauma",
    "no known CAD"
   ],
   "exam": [
    "BP 128/82",
    "HR 76",
    "O2 sat 98%",
    "CVS S1S2 normal",
    "No murmurs",
    "Chest clear",
    "Chest wall nontender",
    "Epigastrium soft"
   ],
   "redFlags": [
    "Exertional chest pain",
    "Radiation arm/jaw/back",
    "Dyspnea/syncope",
    "Hemodynamic instability",
    "ECG changes",
    "Known CAD/risk factors"
   ],
   "planPhrases": [
    "Urgent ECG",
    "Cardiac enzymes",
    "Anti-anginal if ischemic",
    "PPI if GERD",
    "Chest wall analgesia MSK",
    "Risk factor modification",
    "Return if worsening"
   ],
   "followUp": [
    "ER acute cardiac suspicion",
    "Cardiology referral",
    "PPI trial GERD"
   ]
  },
  "Palpitations": {
   "symptoms": [
    "palpitations",
    "racing heart",
    "skipped beats",
    "fluttering",
    "dizziness",
    "lightheadedness",
    "chest discomfort",
    "SOB",
    "anxiety",
    "sweating",
    "fatigue"
   ],
   "negatives": [
    "no syncope",
    "no chest pain",
    "no dyspnea at rest",
    "no known heart disease",
    "no family sudden death",
    "no thyroid disease",
    "no excessive caffeine"
   ],
   "exam": [
    "BP 122/78",
    "HR 82",
    "CVS S1S2 normal",
    "No murmurs",
    "Thyroid normal",
    "Chest clear"
   ],
   "redFlags": [
    "Syncope/near-syncope",
    "Chest pain with palpitations",
    "Known structural heart disease",
    "Family sudden death",
    "Sustained tachycardia",
    "Hemodynamic instability"
   ],
   "planPhrases": [
    "ECG",
    "Holter monitor",
    "Echo to assess structure",
    "Avoid caffeine/stimulants",
    "Stress reduction",
    "Beta blocker if benign",
    "Return if syncope or chest pain"
   ],
   "followUp": [
    "After Holter 1-2 weeks",
    "Cardiology referral",
    "EP if needed"
   ]
  },
  "Shortness of breath": {
   "symptoms": [
    "SOB",
    "dyspnea on exertion",
    "orthopnea",
    "PND",
    "wheezing",
    "cough",
    "sputum",
    "chest tightness",
    "fatigue",
    "leg swelling",
    "palpitations"
   ],
   "negatives": [
    "no chest pain",
    "no syncope",
    "no hemoptysis",
    "no fever",
    "no known COPD/asthma",
    "no smoking",
    "no known DVT"
   ],
   "exam": [
    "RR 20",
    "O2 sat 95%",
    "BP 135/85",
    "HR 88",
    "Chest dec breath sounds",
    "Wheeze expiratory",
    "No crackles",
    "JVP not elevated",
    "No leg edema"
   ],
   "redFlags": [
    "Acute severe dyspnea",
    "Chest pain",
    "Hemoptysis",
    "Hypoxia",
    "Stridor",
    "Anaphylaxis",
    "Pneumothorax"
   ],
   "planPhrases": [
    "Bronchodilators if obstructive",
    "O2 if hypoxic",
    "Chest Xray",
    "PFTs if chronic",
    "Echo if cardiac",
    "Smoking cessation",
    "Return if worsening"
   ],
   "followUp": [
    "1-2 weeks after treatment",
    "PFTs chronic",
    "Cardiology/pulmonology referral"
   ]
  },
  "HTN f/u": {
   "symptoms": [
    "asymptomatic",
    "headache",
    "dizziness",
    "vision changes",
    "chest pain",
    "dyspnea",
    "palpitations",
    "edema",
    "fatigue",
    "epistaxis"
   ],
   "negatives": [
    "no chest pain",
    "no dyspnea",
    "no palpitations",
    "no syncope",
    "no vision changes",
    "no edema",
    "no claudication",
    "no end organ damage"
   ],
   "exam": [
    "BP 148/92 seated",
    "BP 144/90 right",
    "HR 76",
    "BMI 28",
    "CVS S1S2 normal",
    "No murmurs",
    "No bruit",
    "Fundoscopy normal",
    "Chest clear"
   ],
   "redFlags": [
    "BP >180/120 crisis",
    "Vision changes",
    "Chest pain",
    "Dyspnea",
    "Neurologic symptoms",
    "Renal impairment",
    "End-organ damage"
   ],
   "planPhrases": [
    "Continue antihypertensives",
    "DASH diet low sodium",
    "Exercise",
    "Weight management",
    "Limit alcohol",
    "Home BP monitoring",
    "Return if >160/100"
   ],
   "followUp": [
    "3-6 months stable",
    "2-4 weeks med adjustment",
    "ER if >180/120"
   ]
  },
  "DM f/u": {
   "symptoms": [
    "asymptomatic",
    "polyuria",
    "polydipsia",
    "fatigue",
    "blurred vision",
    "weight changes",
    "frequent infections",
    "slow healing",
    "neuropathy",
    "hypoglycemia"
   ],
   "negatives": [
    "no hypoglycemic episodes",
    "no DKA symptoms",
    "no vision changes",
    "no chest pain",
    "no foot ulcers",
    "no infections",
    "no known nephropathy"
   ],
   "exam": [
    "BP 130/82",
    "HR 78",
    "BMI 29",
    "Fundoscopy mild NPDR",
    "CVS normal",
    "Foot exam normal",
    "Skin no infections"
   ],
   "redFlags": [
    "Severe hypoglycemia",
    "DKA/HHS signs",
    "New vision changes",
    "Foot ulcer",
    "Chest pain",
    "Rapid weight loss",
    "Worsening renal function"
   ],
   "planPhrases": [
    "Continue metformin/regimen",
    "HbA1c target <7%",
    "Dietary counseling",
    "Exercise 150 min/week",
    "Foot care daily",
    "Glucose monitoring",
    "Return for lab review"
   ],
   "followUp": [
    "3 months HbA1c",
    "Annual eye foot renal exam",
    "1-2 weeks med adjustment"
   ]
  },
  "Thyroid f/u": {
   "symptoms": [
    "fatigue",
    "weight changes",
    "temp intolerance",
    "mood changes",
    "palpitations",
    "tremor",
    "constipation",
    "diarrhea",
    "skin/hair changes",
    "neck fullness"
   ],
   "negatives": [
    "no palpitations",
    "no chest pain",
    "no vision changes",
    "no dysphagia",
    "no voice changes",
    "no neck mass growth"
   ],
   "exam": [
    "BP 122/76",
    "HR 74",
    "Thyroid normal no nodules",
    "No goiter",
    "Eyes normal",
    "Skin normal",
    "Tremor absent",
    "Reflexes normal"
   ],
   "redFlags": [
    "Thyroid nodule >1cm",
    "Rapidly growing mass",
    "Hoarseness/dysphagia",
    "Thyroid eye disease",
    "A.fib",
    "Myxedema/thyrotoxicosis"
   ],
   "planPhrases": [
    "Continue levothyroxine/antithyroid",
    "Empty stomach 30min before breakfast",
    "Monitor TSH 6-12 weeks after dose change",
    "Avoid soy/calcium/iron within 4h",
    "Return if hyper/hypothyroid"
   ],
   "followUp": [
    "6-12 weeks after dose",
    "6-12 months stable",
    "Annual TSH"
   ]
  },
  "Dyslipidemia f/u": {
   "symptoms": [
    "asymptomatic",
    "fatigue",
    "chest pain",
    "claudication",
    "xanthomas",
    "xanthelasma",
    "corneal arcus"
   ],
   "negatives": [
    "no chest pain",
    "no claudication",
    "no TIA/stroke",
    "no known CAD",
    "no pancreatitis"
   ],
   "exam": [
    "BP 125/80",
    "HR 74",
    "BMI 27",
    "CVS normal",
    "No carotid bruit",
    "Peripheral pulses intact"
   ],
   "redFlags": [
    "Very high LDL >190",
    "Triglycerides >500",
    "Known CAD",
    "DM with high LDL",
    "Family premature CAD"
   ],
   "planPhrases": [
    "Continue statin",
    "Reduce saturated fats",
    "Exercise 150 min/week",
    "Weight management",
    "Ezetimibe if needed",
    "Check lipids 3-6 months"
   ],
   "followUp": [
    "3-6 months lipids",
    "Annual stable",
    "Cardiology if high risk"
   ]
  },
  "Medication refill": {
   "symptoms": [
    "asymptomatic",
    "stable on meds",
    "running out",
    "mild side effects",
    "general wellbeing"
   ],
   "negatives": [
    "no new symptoms",
    "no side effects",
    "no drug interactions",
    "no pregnancy",
    "no status change"
   ],
   "exam": [
    "BP 125/80",
    "HR 76",
    "Temp 36.8",
    "General exam unremarkable",
    "CVS normal",
    "Chest clear",
    "Abdomen soft"
   ],
   "redFlags": [
    "Non-compliance",
    "Adverse reaction",
    "Dose adjustment needed",
    "Drug interaction",
    "New diagnosis"
   ],
   "planPhrases": [
    "Refill as prescribed",
    "Emphasize adherence",
    "Review medication list",
    "Discuss side effects",
    "Plan next lab monitoring"
   ],
   "followUp": [
    "Per chronic disease schedule",
    "Earlier if new symptoms",
    "Annual medication review"
   ]
  },
  "Lab result review": {
   "symptoms": [
    "asymptomatic",
    "concerned about results",
    "fatigue",
    "general checkup"
   ],
   "negatives": [
    "no new symptoms",
    "no acute complaints",
    "no medication changes"
   ],
   "exam": [
    "BP 122/78",
    "HR 74",
    "Temp 36.8",
    "General exam unremarkable"
   ],
   "redFlags": [
    "Critical lab values",
    "Rapid worsening",
    "Urgent intervention",
    "Lab error suspected"
   ],
   "planPhrases": [
    "Results discussed with patient",
    "Continue current management",
    "Adjust meds based on trends",
    "Schedule repeat labs"
   ],
   "followUp": [
    "Per lab recommendation",
    "3-6 months routine",
    "1-2 weeks if adjusted"
   ]
  },
  "Wellness check": {
   "symptoms": [
    "asymptomatic",
    "annual checkup",
    "health maintenance",
    "vaccination update",
    "cancer screening",
    "preventive counseling"
   ],
   "negatives": [
    "no acute complaints",
    "no new symptoms",
    "no concerning family hx"
   ],
   "exam": [
    "BP 122/76",
    "HR 72",
    "Temp 36.8",
    "BMI 26",
    "CVS normal",
    "Chest clear",
    "Abdomen soft",
    "Skin normal",
    "Thyroid normal"
   ],
   "redFlags": [
    "New abnormal vitals",
    "New mass/lesion",
    "Abnormal screening",
    "High risk behaviors"
   ],
   "planPhrases": [
    "Age-appropriate cancer screening",
    "Vaccination update",
    "Lipid panel glucose",
    "Counseling diet exercise smoking",
    "Update history",
    "Next check 1 year"
   ],
   "followUp": [
    "1 year wellness check",
    "Follow up abnormal screens",
    "Address concerns"
   ]
  }
 },
 "Orthopedics / MSK": {
  "Low back pain": {
   "symptoms": [
    "low back pain",
    "radiating leg pain",
    "numbness",
    "tingling",
    "weakness",
    "stiffness",
    "muscle spasm",
    "pain movement",
    "difficulty standing",
    "morning stiffness"
   ],
   "negatives": [
    "no saddle anesthesia",
    "no bowel/bladder",
    "no fever",
    "no weight loss",
    "no night pain",
    "no trauma",
    "no IV drug use",
    "no prior spinal surgery"
   ],
   "exam": [
    "Lumbar reduced ROM flexion",
    "Paraspinal tenderness",
    "No step-off",
    "SLR negative",
    "Motor 5/5",
    "Sensation intact",
    "Reflexes intact",
    "Hip normal"
   ],
   "redFlags": [
    "Cauda equina",
    "Fever/back pain infection",
    "Weight loss malignancy",
    "Trauma fracture",
    "IV drug use",
    "Osteoporosis",
    "Night pain"
   ],
   "planPhrases": [
    "NSAIDs",
    "Muscle relaxants",
    "Normal activities within pain limits",
    "Avoid prolonged bed rest",
    "PT core strengthening",
    "Heat/cold therapy",
    "Return if leg weakness or incontinence"
   ],
   "followUp": [
    "1-2 weeks if no improvement",
    "Earlier if red flags",
    "Ortho/neuro if radicular"
   ]
  },
  "Neck pain": {
   "symptoms": [
    "neck pain",
    "stiffness",
    "headache",
    "shoulder pain",
    "arm pain",
    "numbness",
    "tingling",
    "weakness",
    "limited ROM",
    "pain movement",
    "muscle spasm"
   ],
   "negatives": [
    "no trauma",
    "no fever",
    "no weight loss",
    "no night pain",
    "no bowel/bladder",
    "no gait difficulty",
    "no prior neck surgery"
   ],
   "exam": [
    "Cervical limited ROM",
    "Paraspinal tenderness",
    "Spurling negative",
    "Motor 5/5 upper",
    "Sensation intact",
    "Reflexes 2+",
    "Shoulder normal"
   ],
   "redFlags": [
    "Myelopathy signs",
    "Trauma fracture",
    "Fever infection",
    "Weight loss malignancy",
    "Radicular weakness",
    "Bowel/bladder symptoms"
   ],
   "planPhrases": [
    "NSAIDs",
    "Muscle relaxants",
    "Gentle neck ROM exercises",
    "Posture correction",
    "Heat therapy",
    "Return if arm weakness or gait difficulty"
   ],
   "followUp": [
    "2 weeks no improvement",
    "PT chronic",
    "Ortho/neuro if radicular"
   ]
  },
  "Knee pain": {
   "symptoms": [
    "knee pain",
    "swelling",
    "stiffness",
    "locking",
    "buckling",
    "instability",
    "difficulty weight bearing",
    "crepitus",
    "morning stiffness",
    "pain stairs",
    "pain squatting"
   ],
   "negatives": [
    "no acute trauma",
    "no locking",
    "no giving way",
    "no fever",
    "no redness",
    "no known gout",
    "no prior knee surgery"
   ],
   "exam": [
    "Knee mild effusion",
    "ROM 0-120",
    "No erythema",
    "McMurray negative",
    "Lachman negative",
    "Collateral ligaments stable",
    "Patellofemoral positive"
   ],
   "redFlags": [
    "Acute locked knee",
    "Septic arthritis",
    "Unable to bear weight",
    "Ligament instability",
    "Joint replacement concerns"
   ],
   "planPhrases": [
    "Activity modification rest",
    "Ice therapy",
    "NSAIDs",
    "Quad strengthening",
    "Weight management",
    "Knee sleeve",
    "Return if acute swelling or locking"
   ],
   "followUp": [
    "2-4 weeks conservative",
    "MRI meniscal/ligament injury",
    "Ortho if chronic"
   ]
  },
  "Shoulder pain": {
   "symptoms": [
    "shoulder pain",
    "limited ROM",
    "night pain",
    "overhead pain",
    "weakness",
    "stiffness",
    "clicking",
    "grinding",
    "instability",
    "previous injury"
   ],
   "negatives": [
    "no acute trauma",
    "no dislocation",
    "no fever",
    "no swelling",
    "no numbness",
    "no neck pain",
    "no known rotator cuff pathology"
   ],
   "exam": [
    "Shoulder active ROM limited 120",
    "Passive ROM mildly limited",
    "Neer positive",
    "Hawkins positive",
    "Drop arm negative",
    "Painful arc 60-120",
    "Cervical normal"
   ],
   "redFlags": [
    "Acute rotator cuff tear",
    "Dislocation/fracture",
    "Septic arthritis",
    "Adhesive capsulitis",
    "Cervical radiculopathy",
    "Tumor night pain weight loss"
   ],
   "planPhrases": [
    "NSAIDs",
    "PT rotator cuff strengthening",
    "Avoid overhead lifting",
    "Ice after activity",
    "Corticosteroid injection if severe",
    "Return if acute weakness"
   ],
   "followUp": [
    "4-6 weeks PT",
    "MRI rotator cuff tear",
    "Ortho surgery eval"
   ]
  },
  "Hip pain": {
   "symptoms": [
    "hip pain",
    "groin pain",
    "buttock pain",
    "limited motion",
    "stiffness",
    "limping",
    "pain weight bearing",
    "difficulty walking",
    "night pain",
    "clicking"
   ],
   "negatives": [
    "no acute trauma",
    "no fever",
    "no known AVN",
    "no prior hip surgery",
    "no hip dysplasia",
    "no corticosteroid use"
   ],
   "exam": [
    "Hip ROM limited internal rotation",
    "Pain arc flexion/rotation",
    "Trendelenburg negative",
    "Leg lengths equal",
    "Gait antalgic",
    "Lumbar normal"
   ],
   "redFlags": [
    "Unable to bear weight",
    "Septic arthritis",
    "AVN risk",
    "Fracture",
    "Rapid onset severe"
   ],
   "planPhrases": [
    "Activity modification",
    "NSAIDs",
    "PT hip strengthening",
    "Walking aid if needed",
    "Weight management",
    "Return if unable to bear weight"
   ],
   "followUp": [
    "4-6 weeks PT",
    "Xray/MRI suspected OA/AVN",
    "Ortho severe OA"
   ]
  },
  "Ankle / foot pain": {
   "symptoms": [
    "ankle pain",
    "foot pain",
    "swelling",
    "difficulty walking",
    "bruising",
    "instability",
    "pain weight bearing",
    "stiffness",
    "numbness",
    "tingling"
   ],
   "negatives": [
    "no acute trauma",
    "no open wound",
    "no fever",
    "no known gout",
    "no DVT symptoms",
    "no diabetes",
    "no prior ankle surgery"
   ],
   "exam": [
    "Ankle mild swelling",
    "Erythema absent",
    "ROM limited",
    "Lateral ligament tenderness",
    "Anterior drawer test",
    "Squeeze test",
    "Neurovascular intact"
   ],
   "redFlags": [
    "Unable to bear weight",
    "Open fracture",
    "Septic joint",
    "DVT suspicion",
    "Compartment syndrome",
    "Gout flare"
   ],
   "planPhrases": [
    "RICE protocol",
    "NSAIDs",
    "Weight bearing as tolerated",
    "Ankle brace if instability",
    "PT balance strength",
    "Return if unable to bear weight or infection"
   ],
   "followUp": [
    "1-2 weeks",
    "Xray fracture suspected",
    "Ortho chronic instability"
   ]
  },
  "Wrist / hand pain": {
   "symptoms": [
    "wrist pain",
    "hand pain",
    "swelling",
    "stiffness",
    "numbness",
    "tingling",
    "weakness",
    "decreased grip",
    "pain movement",
    "clicking",
    "triggering"
   ],
   "negatives": [
    "no acute trauma",
    "no fever",
    "no known RA",
    "no known OA",
    "no prior wrist surgery",
    "no diabetes"
   ],
   "exam": [
    "Wrist mild swelling",
    "ROM limited",
    "No deformity",
    "Finkelstein test",
    "Phalen negative",
    "Tinel negative",
    "Grip strength reduced"
   ],
   "redFlags": [
    "Acute fracture",
    "Septic arthritis",
    "Compartment syndrome",
    "Acute carpal tunnel severe",
    "Tendon rupture"
   ],
   "planPhrases": [
    "Splint rest activity mod",
    "NSAIDs",
    "PT strengthening",
    "Carpal tunnel exercises",
    "Ergonomic modifications",
    "Return if acute trauma"
   ],
   "followUp": [
    "2 weeks conservative",
    "EMG if carpal tunnel",
    "Hand surgery chronic"
   ]
  },
  "Acute sprain": {
   "symptoms": [
    "pain",
    "swelling",
    "bruising",
    "limited motion",
    "difficulty weight bearing",
    "instability",
    "tenderness",
    "warmth"
   ],
   "negatives": [
    "no open wound",
    "no deformity",
    "no neurovascular compromise",
    "no prior injury same site",
    "no ligament laxity"
   ],
   "exam": [
    "Localized swelling",
    "Ecchymosis",
    "Tenderness over ligament",
    "ROM limited by pain",
    "Ligament stress test",
    "No crepitus",
    "Neurovascular intact"
   ],
   "redFlags": [
    "Unable to bear weight",
    "Open fracture",
    "Neurovascular compromise",
    "Joint dislocation",
    "Compartment syndrome"
   ],
   "planPhrases": [
    "RICE first 48h",
    "NSAIDs",
    "Weight bearing as tolerated",
    "Compression bandage",
    "Elevation",
    "PT rehabilitation",
    "Return if unable to bear weight"
   ],
   "followUp": [
    "1 week reassess",
    "PT referral",
    "Xray if fracture suspected"
   ]
  },
  "Fracture f/u": {
   "symptoms": [
    "f/u post fracture",
    "pain improving",
    "swelling decreasing",
    "ROM improving",
    "weight bearing progress",
    "cast condition",
    "activity limitations"
   ],
   "negatives": [
    "no new trauma",
    "no wound issues",
    "no cast complications",
    "no neuro symptoms",
    "no DVT symptoms"
   ],
   "exam": [
    "Cast intact dry",
    "No pressure sores",
    "Fingers/toes pink warm",
    "Cap refill <2 sec",
    "Sensation intact",
    "Motor intact",
    "Swelling mild"
   ],
   "redFlags": [
    "Cast complications",
    "Neurovascular compromise",
    "Non-union/malunion",
    "Infection signs",
    "DVT/PE"
   ],
   "planPhrases": [
    "Continue immobilization",
    "Weight bearing as instructed",
    "Monitor for cast complications",
    "Elevate when resting",
    "PT after cast removal",
    "Return if severe pain or cast issues"
   ],
   "followUp": [
    "Per fracture protocol",
    "Xray healing",
    "Ortho as scheduled"
   ]
  },
  "Post-op f/u": {
   "symptoms": [
    "post-operative f/u",
    "wound healing",
    "pain control",
    "ROM progress",
    "weight bearing",
    "swelling",
    "drainage",
    "activity restrictions"
   ],
   "negatives": [
    "no fever",
    "no wound drainage",
    "no excessive pain",
    "no neuro symptoms",
    "no DVT symptoms",
    "no wound dehiscence"
   ],
   "exam": [
    "Wound clean dry intact",
    "Suture line well-approximated",
    "No erythema",
    "No discharge",
    "ROM per protocol",
    "Swelling mild",
    "Distal neurovascular intact"
   ],
   "redFlags": [
    "Wound infection",
    "Dehiscence",
    "DVT/PE",
    "Excessive pain",
    "Neurovascular compromise"
   ],
   "planPhrases": [
    "Continue wound care",
    "Progress ROM per PT",
    "Weight bearing per protocol",
    "Pain managed with prescribed meds",
    "Return if fever or wound drainage"
   ],
   "followUp": [
    "Per surgical protocol",
    "PT f/u",
    "Surgeon f/u scheduled"
   ]
  },
  "OA f/u": {
   "symptoms": [
    "joint pain",
    "stiffness",
    "worsening over time",
    "morning stiffness <30 min",
    "crepitus",
    "limited ROM",
    "functional limitation",
    "pain activity",
    "relief with rest"
   ],
   "negatives": [
    "no acute trauma",
    "no effusion",
    "no fever",
    "no night pain",
    "no joint instability",
    "no locking"
   ],
   "exam": [
    "Joint mild-moderate crepitus",
    "ROM limited",
    "No effusion",
    "Joint line tenderness",
    "No instability",
    "Gait antalgic"
   ],
   "redFlags": [
    "Rapid worsening",
    "Acute effusion",
    "Locking",
    "Giving way",
    "Severe functional limitation"
   ],
   "planPhrases": [
    "Continue analgesics PRN",
    "PT strengthening and ROM",
    "Weight management",
    "Walking aid",
    "Joint protection",
    "Consider intra-articular injection",
    "Referral joint replacement evaluation"
   ],
   "followUp": [
    "3-6 months",
    "Xray progression",
    "Ortho surgical eval"
   ]
  },
  "Sports injury": {
   "symptoms": [
    "sports injury",
    "acute injury",
    "swelling",
    "bruising",
    "limited motion",
    "weakness",
    "instability",
    "clicking",
    "locking",
    "pop sensation"
   ],
   "negatives": [
    "no open wound",
    "no fracture deformity",
    "no neurovascular deficit",
    "no prior surgery same site",
    "no chronic condition"
   ],
   "exam": [
    "Swelling ecchymosis",
    "Tenderness localized",
    "ROM limited",
    "Ligament stress test",
    "Special tests per joint",
    "Muscle strength",
    "Neurovascular intact"
   ],
   "redFlags": [
    "Fracture/dislocation",
    "Complete tendon rupture",
    "Neurovascular compromise",
    "Compartment syndrome",
    "Concussion head injury"
   ],
   "planPhrases": [
    "RICE protocol",
    "NSAIDs",
    "Activity restriction",
    "PT referral",
    "Gradual return to sport",
    "Return if severe pain or instability"
   ],
   "followUp": [
    "1 week reassess",
    "PT rehabilitation",
    "Ortho/sports med severe"
   ]
  }
 },
 "Pediatrics": {
  "Pediatric fever": {
   "symptoms": [
    "fever",
    "irritability",
    "decreased feeding",
    "vomiting",
    "diarrhea",
    "rash",
    "cough",
    "runny nose",
    "ear pain",
    "lethargy",
    "poor sleep"
   ],
   "negatives": [
    "no stiff neck",
    "no petechiae",
    "no seizure",
    "no dehydration",
    "no difficulty breathing",
    "no known sick contact",
    "immunizations up to date"
   ],
   "exam": [
    "Temp 38.9 C",
    "HR 130",
    "RR 28",
    "O2 sat 99%",
    "Well appearing",
    "Hydrated",
    "Throat mildly injected",
    "Ears normal",
    "Chest clear",
    "Cap refill <2 sec"
   ],
   "redFlags": [
    "Fever >40 C",
    "Lethargy/irritable",
    "Petechial/purpuric rash",
    "Stiff neck",
    "Seizure",
    "Dehydration",
    "Age <3 months fever"
   ],
   "planPhrases": [
    "Antipyretics paracetamol/ibuprofen",
    "Encourage feeds hydration",
    "Dress lightly",
    "Monitor urine output",
    "Return if fever >72h or worsening"
   ],
   "followUp": [
    "48-72h if no improvement",
    "If fever >5 days",
    "If new symptoms"
   ]
  },
  "Pediatric cough/cold": {
   "symptoms": [
    "cough",
    "runny nose",
    "nasal congestion",
    "fever",
    "sneezing",
    "sore throat",
    "decreased appetite",
    "irritability",
    "difficulty sleeping",
    "ear pulling"
   ],
   "negatives": [
    "no difficulty breathing",
    "no wheezing",
    "no stridor",
    "no cyanosis",
    "no dehydration",
    "no ear discharge",
    "no known asthma"
   ],
   "exam": [
    "Temp 37.8",
    "Well appearing",
    "Nasal congestion",
    "Throat mildly injected",
    "Tympanic normal",
    "Chest clear",
    "No lymphadenopathy"
   ],
   "redFlags": [
    "Respiratory distress",
    "Stridor",
    "Wheezing",
    "Cyanosis",
    "Dehydration",
    "Poor feeding",
    "Apnea"
   ],
   "planPhrases": [
    "Nasal saline drops suction",
    "Antipyretics if fever",
    "Encourage fluids",
    "Humidified air",
    "Honey if >1 year for cough",
    "Return if difficulty breathing or dehydration"
   ],
   "followUp": [
    "5-7 days",
    "If respiratory distress",
    "If poor feeding"
   ]
  },
  "Vomiting / diarrhea": {
   "symptoms": [
    "vomiting",
    "diarrhea",
    "abdominal cramps",
    "fever",
    "decreased appetite",
    "lethargy",
    "dry mouth",
    "decreased urine",
    "crying",
    "irritability"
   ],
   "negatives": [
    "no blood in stool",
    "no bilious vomiting",
    "no severe pain",
    "no seizure",
    "no head trauma",
    "no known food allergy"
   ],
   "exam": [
    "Temp 37.5",
    "HR 120",
    "Mildly dry mucous membranes",
    "Cap refill <2 sec",
    "Abdomen soft",
    "Bowel sounds hyperactive",
    "Skin turgor normal",
    "Fontanelle normal"
   ],
   "redFlags": [
    "Bilious vomiting",
    "Bloody stool",
    "Severe dehydration",
    "Lethargy",
    "Seizure",
    "Abdominal distension",
    "Intussusception signs"
   ],
   "planPhrases": [
    "ORS small frequent sips",
    "Continue breastmilk/formula",
    "BRAT diet if age appropriate",
    "Antipyretics",
    "Monitor wet diapers",
    "Return if bilious vomiting or bloody stool"
   ],
   "followUp": [
    "24-48h",
    "ER severe dehydration",
    "If unable to tolerate oral"
   ]
  },
  "Rash": {
   "symptoms": [
    "rash",
    "fever",
    "itching",
    "irritability",
    "decreased sleep",
    "cough",
    "coryza",
    "conjunctivitis",
    "joint pain",
    "malaise"
   ],
   "negatives": [
    "no fever >40",
    "no petechiae",
    "no blistering",
    "no mucosal involvement",
    "no joint swelling",
    "no known allergy",
    "immunizations up to date"
   ],
   "exam": [
    "Temp 37.2",
    "Well appearing",
    "Mild pruritic maculopapular rash trunk",
    "No petechiae",
    "No vesicles",
    "Mucous membranes clear",
    "No lymphadenopathy"
   ],
   "redFlags": [
    "Petechiae/purpura",
    "Blistering rash",
    "Mucosal involvement",
    "High fever with rash",
    "Toxic appearance",
    "Meningococcemia signs"
   ],
   "planPhrases": [
    "Antihistamine itching",
    "Topical calamine",
    "Antipyretics",
    "Cool compresses",
    "Avoid scratching",
    "Return if high fever or petechiae"
   ],
   "followUp": [
    "3-5 days",
    "If fever persists",
    "If rash spreads"
   ]
  },
  "Poor feeding": {
   "symptoms": [
    "poor feeding",
    "decreased appetite",
    "weight loss/poor gain",
    "fussiness",
    "crying with feeds",
    "vomiting",
    "reflux",
    "constipation",
    "diarrhea",
    "fatigue"
   ],
   "negatives": [
    "no fever",
    "no vomiting",
    "no diarrhea",
    "no respiratory distress",
    "no known medical conditions",
    "birth history normal"
   ],
   "exam": [
    "Well appearing",
    "Hydrated",
    "Weight on growth curve",
    "Abdomen soft",
    "Normal oromotor function",
    "Oral mucosa normal"
   ],
   "redFlags": [
    "Significant weight loss",
    "Dehydration",
    "Projectile vomiting",
    "Respiratory distress",
    "Cyanosis with feeds"
   ],
   "planPhrases": [
    "Frequent small feeds",
    "Burp well during/after feeds",
    "Position upright after feeds",
    "Monitor wet diapers",
    "Growth chart monitoring",
    "Return if poor weight gain or dehydration"
   ],
   "followUp": [
    "1-2 weeks weight check",
    "Weight loss continues",
    "Pediatric GI referral"
   ]
  },
  "Ear pain": {
   "symptoms": [
    "ear pain",
    "fever",
    "irritability",
    "pulling at ear",
    "difficulty hearing",
    "congestion",
    "cough",
    "runny nose",
    "decreased appetite",
    "poor sleep"
   ],
   "negatives": [
    "no ear discharge",
    "no dizziness",
    "no head trauma",
    "no known ear problems",
    "no foreign body"
   ],
   "exam": [
    "Temp 38.0",
    "TM erythematous bulging",
    "Decreased mobility",
    "Throat normal",
    "Nasal congestion",
    "Cervical lymph nodes normal"
   ],
   "redFlags": [
    "Post-auricular swelling mastoiditis",
    "Ear discharge >2 weeks",
    "Fever >40",
    "Severe pain",
    "Hearing loss"
   ],
   "planPhrases": [
    "Analgesics",
    "Antipyretics",
    "Observation if >6 months non-severe",
    "Antibiotics if <6 months or severe",
    "Return if worsening or ear discharge"
   ],
   "followUp": [
    "48-72h",
    "If ear discharge",
    "ENT recurrent OM"
   ]
  },
  "Pediatric abdominal pain": {
   "symptoms": [
    "abdominal pain",
    "cramping",
    "vomiting",
    "diarrhea",
    "constipation",
    "fever",
    "decreased appetite",
    "pallor",
    "lethargy",
    "pain movement"
   ],
   "negatives": [
    "no bilious vomiting",
    "no blood in stool",
    "no severe localized pain",
    "no dysuria",
    "no known chronic condition",
    "no abdominal distension"
   ],
   "exam": [
    "Temp 37.0",
    "Well or mildly uncomfortable",
    "Abdomen soft",
    "No guarding/rebound",
    "Bowel sounds present",
    "No masses",
    "No hernias"
   ],
   "redFlags": [
    "Bilious vomiting",
    "Bloody stool",
    "Severe localized pain RLQ",
    "Abdominal distension",
    "Peritoneal signs",
    "Intussusception"
   ],
   "planPhrases": [
    "BRAT diet",
    "Encourage fluids",
    "Antipyretics",
    "Pain monitoring",
    "Return if severe pain or bilious vomiting"
   ],
   "followUp": [
    "24-48h",
    "RLQ pain",
    "Pediatric surgery if appy"
   ]
  },
  "Routine pediatric f/u": {
   "symptoms": [
    "routine check-up",
    "growth monitoring",
    "development assessment",
    "vaccination review",
    "feeding concerns",
    "sleep patterns",
    "behavior"
   ],
   "negatives": [
    "no acute illness",
    "no fever",
    "no concerning symptoms",
    "development on track"
   ],
   "exam": [
    "Growth parameters on chart",
    "Weight height head circumference",
    "Development age appropriate",
    "Heart sounds normal",
    "Lungs clear",
    "Abdomen soft",
    "Hips stable"
   ],
   "redFlags": [
    "Growth faltering",
    "Developmental delay",
    "Abnormal vitals",
    "Significant findings"
   ],
   "planPhrases": [
    "Growth development on track",
    "Next vaccines due",
    "Anticipatory guidance per age",
    "Accident prevention",
    "Nutrition advice",
    "Next well-child visit"
   ],
   "followUp": [
    "Per vaccination schedule",
    "3-6 months routine",
    "Earlier if concerns"
   ]
  },
  "Vaccination visit": {
   "symptoms": [
    "routine vaccination",
    "vaccine due",
    "well child",
    "no acute illness",
    "parental questions",
    "previous vaccine reactions"
   ],
   "negatives": [
    "no fever",
    "no acute illness",
    "no known vaccine allergy",
    "no severe reaction history",
    "no contraindications"
   ],
   "exam": [
    "Well appearing",
    "Temp 36.8",
    "Growth parameters stable",
    "Development age appropriate",
    "Vaccines administered per schedule"
   ],
   "redFlags": [
    "Severe allergic reaction history",
    "Encephalopathy",
    "Active severe illness",
    "Immunocompromised",
    "Specific contraindications per vaccine"
   ],
   "planPhrases": [
    "Vaccines administered per national schedule",
    "Parental consent obtained",
    "Observation for 15-30 min post-vaccination",
    "Counsel on expected side effects and management",
    "Schedule next vaccination",
    "Return for fever or severe reactions"
   ],
   "followUp": [
    "Per schedule",
    "Next dose due date",
    "If adverse reaction"
   ]
  },
  "School / sick note": {
   "symptoms": [
    "request for medical note",
    "school absence",
    "sick days",
    "clearance to return",
    "sports clearance"
   ],
   "negatives": [
    "no ongoing concerning symptoms",
    "no active infection",
    "no unaddressed issues",
    "fit to resume activities"
   ],
   "exam": [
    "Temp normal",
    "General exam unremarkable",
    "No findings on targeted exam"
   ],
   "redFlags": [
    "Persistent unexplained symptoms",
    "Undiagnosed condition",
    "Chronic illness need school accommodation"
   ],
   "planPhrases": [
    "Exam normal",
    "Fit to resume school/activity",
    "Note provided",
    "Recommend follow-up with school nurse if needed",
    "Return if symptoms recur"
   ],
   "followUp": [
    "PRN",
    "Earlier if new symptoms",
    "Per request"
   ]
  }
 },
 "ENT": {
  "Ear pain": {
   "symptoms": [
    "ear pain",
    "ear fullness",
    "hearing loss",
    "discharge",
    "dizziness",
    "fever",
    "itching ear",
    "tinnitus",
    "otalgia"
   ],
   "negatives": [
    "no trauma",
    "no foreign body",
    "no known perforation",
    "no tinnitus",
    "no vertigo",
    "no recent swimming"
   ],
   "exam": [
    "Canal normal",
    "Canal erythematous",
    "Canal edematous",
    "TM normal",
    "TM injected",
    "TM perforation",
    "Discharge present",
    "No mastoid tenderness"
   ],
   "redFlags": [
    "Post-auricular swelling",
    "Fever with ear pain",
    "Discharge with pain",
    "Hearing loss sudden",
    "Facial nerve palsy"
   ],
   "planPhrases": [
    "Analgesics",
    "Aural hygiene",
    "Keep ear dry",
    "Topical antibiotics if AOE",
    "Oral antibiotics if AOM",
    "Return if severe pain or discharge"
   ],
   "followUp": [
    "48-72h",
    "If discharge",
    "ENT referral"
   ]
  },
  "Hearing complaint": {
   "symptoms": [
    "hearing loss",
    "gradual hearing loss",
    "sudden hearing loss",
    "unilateral loss",
    "bilateral loss",
    "ear fullness",
    "tinnitus",
    "difficulty understanding speech",
    "asking repeats"
   ],
   "negatives": [
    "no ear pain",
    "no discharge",
    "no dizziness",
    "no trauma",
    "no known noise exposure",
    "no recent infections"
   ],
   "exam": [
    "Canal clear",
    "TM normal",
    "TM retracted",
    "TM perforated",
    "Rinne test",
    "Weber test",
    "Whispered voice test"
   ],
   "redFlags": [
    "Sudden sensorineural loss",
    "Unilateral loss",
    "Trauma",
    "Conductive with middle ear signs",
    "Sudden worsening"
   ],
   "planPhrases": [
    "Audiometry referral",
    "Hearing aid evaluation",
    "Ear wax removal if impacted",
    "Middle ear assessment",
    "Return if sudden loss or trauma"
   ],
   "followUp": [
    "Audiogram",
    "ENT referral if SNHL",
    "Hearing aid eval"
   ]
  },
  "Tinnitus": {
   "symptoms": [
    "ringing in ears",
    "buzzing sound",
    "hissing",
    "roaring",
    "pulsatile tinnitus",
    "non-pulsatile tinnitus",
    "unilateral",
    "bilateral",
    "hearing loss",
    "dizziness",
    "stress",
    "poor sleep"
   ],
   "negatives": [
    "no sudden hearing loss",
    "no vertigo",
    "no ear pain",
    "no discharge",
    "no head trauma",
    "no ototoxic meds",
    "no known vascular lesion"
   ],
   "exam": [
    "Canal clear",
    "TM normal",
    "Neuro exam normal",
    "Hearing grossly intact",
    "No bruit over ear",
    "Neck no bruit"
   ],
   "redFlags": [
    "Pulsatile tinnitus (vascular lesion)",
    "Sudden unilateral loss",
    "Ototoxic medications",
    "Acoustic neuroma suspicion",
    "Psychiatric distress"
   ],
   "planPhrases": [
    "Audiometry",
    "Avoid loud noise",
    "Stress reduction/sleep hygiene",
    "Sound therapy/masking",
    "Limit caffeine/alcohol",
    "ENT/audiology referral",
    "Return if pulsatile or unilateral"
   ],
   "followUp": [
    "Audiogram",
    "ENT if persistent",
    "MRI if pulsatile"
   ]
  },
  "Dizziness / vertigo": {
   "symptoms": [
    "vertigo",
    "room spinning",
    "imbalance",
    "nausea",
    "vomiting",
    "headache",
    "hearing loss",
    "tinnitus",
    "ear fullness",
    "lightheadedness"
   ],
   "negatives": [
    "no focal weakness",
    "no speech difficulty",
    "no chest pain",
    "no palpitations",
    "no trauma",
    "no fever",
    "no known cardiac condition"
   ],
   "exam": [
    "BP supine 120/78 standing 115/75",
    "HR 74",
    "Ears normal",
    "Nystagmus absent",
    "Dix-Hallpike negative",
    "Romberg negative",
    "Neuro grossly normal"
   ],
   "redFlags": [
    "Focal neuro deficit",
    "Syncope",
    "Head trauma",
    "Meningeal signs",
    "Cardiac symptoms"
   ],
   "planPhrases": [
    "Vestibular suppressants (betahistine)",
    "Antiemetics",
    "Epley if BPPV",
    "Fall precautions",
    "Avoid driving",
    "Hydration",
    "Return if focal symptoms"
   ],
   "followUp": [
    "3-5 days",
    "Balance exercises",
    "ENT/neuro referral"
   ]
  },
  "Nasal congestion": {
   "symptoms": [
    "nasal congestion",
    "stuffy nose",
    "runny nose",
    "sneezing",
    "postnasal drip",
    "snoring",
    "mouth breathing",
    "loss of smell",
    "headache",
    "facial pressure"
   ],
   "negatives": [
    "no fever",
    "no sinus pain",
    "no epistaxis",
    "no known polyps",
    "no deviated septum",
    "no allergy diagnosis"
   ],
   "exam": [
    "Nasal mucosa erythematous",
    "Nasal mucosa pale",
    "Turbinates hypertrophied",
    "Clear discharge",
    "Septum midline",
    "No polyps",
    "Sinus tenderness absent"
   ],
   "redFlags": [
    "Unilateral symptoms possible neoplasm",
    "Epistaxis",
    "Polyps",
    "Septal perforation",
    "Cacosmia"
   ],
   "planPhrases": [
    "Saline nasal spray",
    "Antihistamine if allergies",
    "Decongestant short term",
    "Nasal steroid spray",
    "Avoid triggers",
    "Return if unilateral or bleeding"
   ],
   "followUp": [
    "2 weeks",
    "Allergy testing",
    "ENT if polyps/septal"
   ]
  },
  "Sinus symptoms": {
   "symptoms": [
    "facial pain",
    "frontal headache",
    "nasal congestion",
    "purulent discharge",
    "postnasal drip",
    "fever",
    "hyposmia",
    "cough",
    "tooth pain",
    "ear fullness",
    "fatigue"
   ],
   "negatives": [
    "no vision changes",
    "no periorbital swelling",
    "no diplopia",
    "no severe headache",
    "no known nasal polyps",
    "no immunocompromised"
   ],
   "exam": [
    "Temp 37.8",
    "Facial tenderness frontal/maxillary",
    "Nasal mucosa inflamed",
    "Purulent discharge",
    "Throat normal",
    "Transillumination reduced"
   ],
   "redFlags": [
    "Periorbital edema",
    "Diplopia",
    "Vision changes",
    "Severe frontal headache",
    "Meningeal signs"
   ],
   "planPhrases": [
    "Nasal saline irrigation",
    "Decongestants short term",
    "Nasal steroid spray",
    "Analgesics",
    "Antibiotics if bacterial suspected (amoxicillin)",
    "Return if vision changes or severe headache"
   ],
   "followUp": [
    "7-10 days",
    "CT sinuses if chronic",
    "ENT referral"
   ]
  },
  "Sore throat / tonsillitis": {
   "symptoms": [
    "sore throat",
    "painful swallowing",
    "fever",
    "enlarged tonsils",
    "exudate",
    "hoarse voice",
    "ear pain",
    "neck pain",
    "loss of appetite",
    "malaise"
   ],
   "negatives": [
    "no cough",
    "no runny nose",
    "no conjunctivitis",
    "no difficulty breathing",
    "no drooling",
    "no muffled voice",
    "no trismus"
   ],
   "exam": [
    "Temp 38.2",
    "Pharynx erythematous",
    "Tonsils enlarged with exudate",
    "Cervical lymphadenopathy",
    "Tympanic normal",
    "Uvula midline"
   ],
   "redFlags": [
    "Peritonsillar abscess",
    "Epiglottitis",
    "Airway compromise",
    "Sepsis",
    "Dehydration"
   ],
   "planPhrases": [
    "Analgesics",
    "Salt water gargle",
    "Warm fluids",
    "Antibiotics if Centor >=3 (penicillin/amoxicillin)",
    "Complete course",
    "Return if difficulty swallowing liquids"
   ],
   "followUp": [
    "48-72h",
    "Earlier if severe",
    "ENT if recurrent"
   ]
  },
  "Voice complaint": {
   "symptoms": [
    "hoarseness",
    "voice change",
    "vocal fatigue",
    "loss of voice",
    "dry throat",
    "cough",
    "throat clearing",
    "GERD symptoms",
    "postnasal drip",
    "singing difficulty"
   ],
   "negatives": [
    "no hemoptysis",
    "no dysphagia",
    "no odynophagia",
    "no weight loss",
    "no smoking",
    "no known laryngeal pathology"
   ],
   "exam": [
    "Voice quality mildly hoarse",
    "Larynx not visualized (no scope)",
    "Throat normal",
    "Neck no lymphadenopathy",
    "Thyroid normal",
    "No stridor"
   ],
   "redFlags": [
    "Hemoptysis",
    "Dysphagia",
    "Weight loss",
    "Stridor",
    "Smoker >45 years",
    "Persistent >3 weeks"
   ],
   "planPhrases": [
    "Voice rest",
    "Hydration",
    "Avoid throat clearing",
    "GERD treatment if suspected",
    "Humidified air",
    "Smoking cessation",
    "Return if hoarseness >3 weeks or hemoptysis"
   ],
   "followUp": [
    "2-3 weeks voice rest",
    "ENT if >3 weeks",
    "Laryngoscopy if persistent"
   ]
  }
 },
 "Dermatology": {
  "Rash": {
   "symptoms": [
    "rash",
    "itching",
    "burning",
    "scaling",
    "dryness",
    "redness",
    "blisters",
    "oozing",
    "pain",
    "fever"
   ],
   "negatives": [
    "no fever",
    "no new medication",
    "no known trigger",
    "no joint pain",
    "no mucosal involvement",
    "no systemic symptoms"
   ],
   "exam": [
    "Erythematous rash",
    "Dry scaly patches",
    "Maculopapular",
    "Vesicular",
    "Well-demarcated",
    "No secondary infection"
   ],
   "redFlags": [
    "Fever with rash",
    "Mucosal involvement",
    "Blistering extensive",
    "Painful rash",
    "Rapid spread",
    "Systemic symptoms"
   ],
   "planPhrases": [
    "Emollients",
    "Topical corticosteroids as per clinician",
    "Antihistamine",
    "Avoid irritants",
    "Sun protection",
    "Return if spreads or worsens"
   ],
   "followUp": [
    "2 weeks",
    "If fever develops",
    "Dermatology if chronic"
   ]
  },
  "Acne": {
   "symptoms": [
    "acne",
    "pimples",
    "blackheads",
    "whiteheads",
    "cysts",
    "nodules",
    "scarring",
    "oily skin",
    "painful lesions",
    "face/chest/back"
   ],
   "negatives": [
    "no fever",
    "no new medications",
    "no steroid use",
    "no known PCOS",
    "previous treatments tried"
   ],
   "exam": [
    "Comedonal acne face",
    "Papules",
    "Pustules",
    "Nodules",
    "Cysts",
    "Scarring present",
    "No signs of infection"
   ],
   "redFlags": [
    "Nodulocystic severe",
    "Acne fulminans",
    "Scarring rapid",
    "Psychological distress",
    "Signs of PCOS"
   ],
   "planPhrases": [
    "Topical retinoids at night",
    "Benzoyl peroxide wash",
    "Topical antibiotics (clindamycin)",
    "Oral antibiotics if moderate-severe",
    "Avoid picking/popping",
    "Gentle skincare routine",
    "Return if severe/cystic"
   ],
   "followUp": [
    "4-6 weeks treatment trial",
    "Dermatology if severe",
    "Hormonal eval if indicated"
   ]
  },
  "Eczema / dermatitis": {
   "symptoms": [
    "itchy skin",
    "red skin",
    "dry patches",
    "scaling",
    "cracking",
    "oozing",
    "skin thickening",
    "sleep disturbance",
    "flexural involvement"
   ],
   "negatives": [
    "no fever",
    "no known trigger",
    "no new skincare",
    "no known allergen",
    "no systemic symptoms"
   ],
   "exam": [
    "Erythematous patches flexures",
    "Dry skin",
    "Excoriations",
    "Lichenification",
    "Cracking",
    "No secondary infection"
   ],
   "redFlags": [
    "Secondary bacterial infection",
    "Eczema herpeticum",
    "Generalized erythroderma",
    "Severe sleep disturbance",
    "Failure of treatment"
   ],
   "planPhrases": [
    "Emollients liberally",
    "Topical corticosteroids short term",
    "Avoid triggers/irritants",
    "Wet wraps if severe",
    "Antihistamines for itch",
    "Avoid scratching",
    "Return if signs of infection"
   ],
   "followUp": [
    "2-4 weeks",
    "Dermatology if severe",
    "Allergy testing if triggers"
   ]
  },
  "Fungal infection": {
   "symptoms": [
    "itching",
    "scaly rash",
    "ring-shaped lesions",
    "redness",
    "cracking",
    "skin maceration",
    "discolored nails",
    "thick nails",
    "groin involvement",
    "feet involvement"
   ],
   "negatives": [
    "no fever",
    "no known immunocompromised",
    "no DM",
    "no known allergy to antifungals",
    "no prior treatment"
   ],
   "exam": [
    "Annular erythematous plaque",
    "Scaling border",
    "Clear center",
    "Skin scraping positive",
    "Nail discoloration",
    "Nail thickening",
    "Interdigital maceration"
   ],
   "redFlags": [
    "Immunocompromised",
    "DM with severe infection",
    "Extensive involvement",
    "Chest pain (systemic)",
    "Treatment failure"
   ],
   "planPhrases": [
    "Topical antifungals (clotrimazole/terbinafine)",
    "Keep area clean and dry",
    "Avoid sharing towels",
    "Complete full course even if improving",
    "Oral antifungals if extensive/nail",
    "Return if worsening or treatment failure"
   ],
   "followUp": [
    "2-4 weeks",
    "Dermatology if nail",
    "Oral antifungals severe"
   ]
  },
  "Urticaria": {
   "symptoms": [
    "hives",
    "welts",
    "itching",
    "swelling lips/eyes",
    "red raised patches",
    "wheals",
    "burning",
    "angioedema",
    "shortness of breath",
    "triggers food/drugs"
   ],
   "negatives": [
    "no fever",
    "no joint pain",
    "no known allergen",
    "no recent medication change",
    "no previous severe reactions"
   ],
   "exam": [
    "Urticarial wheals trunk/extremities",
    "Individual lesions <24h",
    "No blistering",
    "No mucosal lesions",
    "Angioedema absent",
    "Dermographism"
   ],
   "redFlags": [
    "Respiratory difficulty/angioedema",
    "Anaphylaxis signs",
    "Mucosal involvement",
    "Persistent >6 weeks",
    "Known allergen"
   ],
   "planPhrases": [
    "Antihistamines (cetirizine/loratadine)",
    "Avoid known triggers",
    "Cool compresses",
    "Short course oral steroids if severe",
    "Epinephrine auto-injector if history of anaphylaxis",
    "Return if respiratory difficulty or lip swelling"
   ],
   "followUp": [
    "1-2 weeks",
    "Dermatology if chronic",
    "Allergy testing"
   ]
  },
  "Wound review": {
   "symptoms": [
    "wound check",
    "healing progress",
    "drainage",
    "pain",
    "redness",
    "swelling",
    "fever",
    "dressing change"
   ],
   "negatives": [
    "no fever",
    "no purulent drainage",
    "no increasing pain",
    "no wound dehiscence",
    "no systemic symptoms"
   ],
   "exam": [
    "Wound clean dry",
    "No erythema",
    "No discharge",
    "Wound edges well-approximated",
    "Granulation tissue present",
    "No necrosis",
    "Sutures intact"
   ],
   "redFlags": [
    "Wound infection signs",
    "Dehiscence",
    "Necrosis",
    "Purulent drainage",
    "Fever",
    "Cellulitis"
   ],
   "planPhrases": [
    "Wound clean healing well",
    "Continue wound care as instructed",
    "Keep wound clean and dry",
    "Monitor for signs of infection",
    "Suture removal per timeline",
    "Return if fever, increasing pain, or purulent drainage"
   ],
   "followUp": [
    "Per wound care protocol",
    "If infection signs",
    "Wound care f/u"
   ]
  },
  "Skin lesion review": {
   "symptoms": [
    "skin lesion for review",
    "new mole",
    "changing mole",
    "irregular shape",
    "darkening",
    "bleeding",
    "itchy mole",
    "family hx melanoma"
   ],
   "negatives": [
    "no rapid change",
    "no bleeding",
    "no itching",
    "no ulceration",
    "no known melanoma",
    "previous benign biopsies"
   ],
   "exam": [
    "Lesion location documented",
    "Size mm",
    "Asymmetric borders",
    "Color variegated",
    "Diameter >6mm",
    "ABCDE criteria assessed",
    "Dermatoscopy if available"
   ],
   "redFlags": [
    "ABCDE criteria met",
    "Changing lesion",
    "Bleeding/ulceration",
    "Family hx melanoma",
    "Many atypical nevi"
   ],
   "planPhrases": [
    "ABCDE assessed",
    "Lesion appears benign",
    "Monitor changes",
    "Sun protection advice",
    "Regular self-exam",
    "Return if changes or new lesion",
    "Dermatology referral if suspicious"
   ],
   "followUp": [
    "3-6 months",
    "Dermatology if suspicious",
    "Excision biopsy if indicated"
   ]
  },
  "Hair loss": {
   "symptoms": [
    "hair loss",
    "thinning hair",
    "bald patches",
    "excessive shedding",
    "scalp itching",
    "scalp burning",
    "hair breakage",
    "recent stress",
    "weight changes",
    "medication changes"
   ],
   "negatives": [
    "no fever",
    "no scalp lesions",
    "no known thyroid disease",
    "no iron deficiency",
    "no known autoimmune",
    "no recent chemotherapy"
   ],
   "exam": [
    "Scalp normal",
    "No erythema",
    "No scaling",
    "Hair pull test",
    "Pattern hair loss",
    "Patchy hair loss",
    "No scarring"
   ],
   "redFlags": [
    "Rapid hair loss",
    "Scarring alopecia",
    "Systemic symptoms",
    "Thyroid/iron deficiency",
    "Severe psychological distress"
   ],
   "planPhrases": [
    "Basic labs: CBC, TSH, ferritin, vitamin D, iron studies",
    "Gentle hair care",
    "Avoid heat/chemical treatments",
    "Minoxidil if pattern hair loss",
    "Nutritional optimization",
    "Stress reduction",
    "Return if worsening"
   ],
   "followUp": [
    "3 months",
    "Dermatology if scarring",
    "Endocrine if hormonal"
   ]
  }
 },
 "OB/GYN": {
  "Antenatal f/u": {
   "symptoms": [
    "routine antenatal visit",
    "gestational age",
    "fetal movements",
    "fundal height",
    "contractions",
    "leakage",
    "bleeding",
    "BP",
    "weight",
    "edema",
    "urinary symptoms"
   ],
   "negatives": [
    "no bleeding",
    "no leakage",
    "no contractions",
    "no fever",
    "no reduced fetal movements",
    "no headache/visual changes"
   ],
   "exam": [
    "Temp 36.8",
    "BP 120/78",
    "HR 76",
    "Fundal height appropriate for dates",
    "Fetal heart rate auscultated",
    "Fetal movements reported",
    "Urine dip normal",
    "Edema mild"
   ],
   "redFlags": [
    "Severe HTN",
    "Proteinuria",
    "Reduced fetal movements",
    "Bleeding",
    "Leakage",
    "Severe edema",
    "Headache/visual changes"
   ],
   "planPhrases": [
    "Fundal height FH cm",
    "Fetal heart rate reassuring",
    "Maternal vitals stable",
    "Routine antenatal care continued",
    "Next visit scheduled",
    "Iron/folate supplementation",
    "Return if reduced movements, bleeding, or leak"
   ],
   "followUp": [
    "Per antenatal schedule",
    "2-4 weeks",
    "Earlier if concerns"
   ]
  },
  "Pelvic pain": {
   "symptoms": [
    "pelvic pain",
    "lower abdominal pain",
    "cramping",
    "spotting",
    "discharge",
    "fever",
    "nausea",
    "dysuria",
    "dyspareunia",
    "LMP"
   ],
   "negatives": [
    "no fever",
    "no heavy bleeding",
    "no IUD in situ",
    "no known pregnancy",
    "no STI symptoms",
    "no prior pelvic surgery"
   ],
   "exam": [
    "BP 120/78",
    "HR 76",
    "Temp 36.9",
    "Abdomen soft",
    "Suprapubic tenderness",
    "No guarding",
    "No rebound",
    "Cervical motion tenderness"
   ],
   "redFlags": [
    "Ectopic pregnancy",
    "PID/Tubo-ovarian abscess",
    "Appendicitis",
    "Ovarian torsion",
    "Septic abortion"
   ],
   "planPhrases": [
    "Analgesics",
    "Urine pregnancy test",
    "US pelvis if indicated",
    "STI screening if suspected",
    "Referral to gynecology",
    "Return if severe pain or fever"
   ],
   "followUp": [
    "48-72h",
    "US pelvis",
    "Gynecology referral"
   ]
  },
  "Irregular bleeding": {
   "symptoms": [
    "irregular bleeding",
    "heavy bleeding",
    "prolonged bleeding",
    "spotting between periods",
    "post-coital bleeding",
    "postmenopausal bleeding",
    "LMP",
    "cycle length",
    "pain",
    "clots",
    "fatigue",
    "dizziness"
   ],
   "negatives": [
    "no pregnancy",
    "no IUD",
    "no known fibroids",
    "no known coagulopathy",
    "normal pap history",
    "no new medications"
   ],
   "exam": [
    "BP 120/76",
    "HR 74",
    "Abdomen soft",
    "No masses",
    "Speculum: cervix normal",
    "Bimanual: uterus normal no adnexal masses"
   ],
   "redFlags": [
    "Severe hemorrhage",
    "Postmenopausal bleeding",
    "Post-coital bleeding",
    "Pregnancy complication",
    "Hemodynamic instability"
   ],
   "planPhrases": [
    "Pregnancy test",
    "CBC",
    "TSH",
    "US pelvis",
    "Consider endometrial biopsy if >45 or risk factors",
    "Referral to gynecology",
    "Return if heavy bleed causing dizziness"
   ],
   "followUp": [
    "1-2 weeks",
    "Gynecology referral",
    "Endometrial biopsy"
   ]
  },
  "Vaginal discharge": {
   "symptoms": [
    "vaginal discharge",
    "itching",
    "burning",
    "odor",
    "discharge color change",
    "dysuria",
    "dyspareunia",
    "irritation",
    "swelling",
    "recurrent"
   ],
   "negatives": [
    "no fever",
    "no abdominal pain",
    "no pregnancy",
    "no known STI exposure",
    "no prior abnormal pap"
   ],
   "exam": [
    "Vulva normal",
    "Vaginal mucosa normal",
    "Discharge thin white",
    "Discharge thick curdy",
    "Discharge yellow/green",
    "Cervix normal",
    "No cervical motion tenderness"
   ],
   "redFlags": [
    "PID signs",
    "Pregnancy with discharge",
    "Severe itching",
    "Recurrent infections",
    "STI exposure"
   ],
   "planPhrases": [
    "Vaginal swab for microscopy/culture",
    "Topical antifungals if yeast",
    "Metronidazole if BV/trichomonas",
    "Avoid douching",
    "Complete course",
    "Partner treatment if STI",
    "Return if persistent or recurrent"
   ],
   "followUp": [
    "1 week after treatment",
    "STI screening",
    "Gynecology referral recurrent"
   ]
  },
  "Contraception counseling": {
   "symptoms": [
    "contraception counseling",
    "current method",
    "desired method",
    "side effects",
    "satisfaction with current",
    "LMP",
    "pregnancy history",
    "smoking",
    "migraine",
    "medical history"
   ],
   "negatives": [
    "no current pregnancy",
    "no contraindications",
    "no unresolved concerns",
    "no abnormal bleeding",
    "no known thrombophilia"
   ],
   "exam": [
    "BP normal",
    "BMI documented",
    "General exam normal",
    "Pregnancy test negative"
   ],
   "redFlags": [
    "Contraindications to estrogen",
    "Migraine with aura (combined OCP)",
    "VTE history",
    "Smoking >35 (combined OCP)",
    "HTN",
    "Breast cancer history"
   ],
   "planPhrases": [
    "Counseling on available methods provided",
    "Combined OCP/patch/ring",
    "Progestin-only pill",
    "IUD (copper/levonorgestrel)",
    "Implant",
    "DMPA injection",
    "Barrier methods",
    "Counseling on LARC methods",
    "Return for specific method initiation"
   ],
   "followUp": [
    "Per method follow-up",
    "3 months for new method",
    "Annual well-woman"
   ]
  },
  "Dysmenorrhea": {
   "symptoms": [
    "painful periods",
    "cramping",
    "lower abdominal pain",
    "back pain",
    "nausea",
    "vomiting",
    "diarrhea",
    "headache",
    "fatigue",
    "pain radiating legs",
    "LMP",
    "cycle regularity"
   ],
   "negatives": [
    "no fever",
    "no heavy bleeding",
    "no irregular cycles",
    "no dyspareunia",
    "no IUD",
    "no known endometriosis"
   ],
   "exam": [
    "BP 120/78",
    "HR 74",
    "Abdomen soft",
    "No masses",
    "No tenderness",
    "Bimanual normal"
   ],
   "redFlags": [
    "Severe pain not responding to treatment",
    "Secondary dysmenorrhea",
    "Endometriosis suspected",
    "Pelvic pathology",
    "Impact on daily life"
   ],
   "planPhrases": [
    "NSAIDs starting before pain onset",
    "Heat therapy",
    "Regular exercise",
    "Consider OCP for cycle control",
    "TENS unit for some patients",
    "Dietary modifications",
    "Return if severe or not responding"
   ],
   "followUp": [
    "3 months treatment trial",
    "US pelvis",
    "Gynecology if severe"
   ]
  },
  "Postnatal f/u": {
   "symptoms": [
    "postnatal follow-up",
    "mood",
    "breastfeeding",
    "lochia",
    "perineal healing",
    "c-section wound",
    "pain",
    "sleep",
    "appetite",
    "contraception"
   ],
   "negatives": [
    "no fever",
    "no excessive bleeding",
    "no severe perineal pain",
    "no wound infection",
    "no breast engorgement signs",
    "no depression"
   ],
   "exam": [
    "BP 120/78",
    "HR 74",
    "Temp 36.8",
    "Breasts normal",
    "Lochia normal",
    "Perineum healing",
    "C-section wound clean",
    "Abdomen soft",
    "Fundus non-palpable"
   ],
   "redFlags": [
    "PPH signs",
    "Postpartum endometritis",
    "Wound infection",
    "Severe depression",
    "Mastitis"
   ],
   "planPhrases": [
    "Mood screen (EPDS)",
    "Breastfeeding support",
    "Lochia normal",
    "Perineal/c-section wound healing well",
    "Family planning counseling",
    "Return if fever, heavy bleeding, or mood concerns"
   ],
   "followUp": [
    "6 weeks postpartum",
    "Earlier if concerns",
    "Per institutional protocol"
   ]
  }
 },
 "Urology": {
  "Dysuria / UTI": {
   "symptoms": [
    "dysuria",
    "frequency",
    "urgency",
    "suprapubic pain",
    "hematuria",
    "fever",
    "flank pain",
    "urine odor",
    "cloudy urine",
    "nausea"
   ],
   "negatives": [
    "no fever",
    "no flank pain",
    "no known pregnancy",
    "no known kidney stones",
    "no recent catheter",
    "no known urologic abnormality"
   ],
   "exam": [
    "Temp 37.5 if fever",
    "Suprapubic tenderness",
    "CVA tenderness absent",
    "Abdomen soft",
    "External genitalia normal"
   ],
   "redFlags": [
    "Pyelonephritis signs",
    "Fever with flank pain",
    "Hematuria",
    "Recurrent UTIs",
    "Pregnancy",
    "Male with UTI symptoms"
   ],
   "planPhrases": [
    "Urine dipstick",
    "Urine culture if indicated",
    "Antibiotics as per local guidelines",
    "Increase fluid intake",
    "Avoid irritants (caffeine, alcohol)",
    "Return if fever, flank pain, or hematuria"
   ],
   "followUp": [
    "48-72h after antibiotics",
    "Urine culture",
    "Urology if recurrent"
   ]
  },
  "Flank pain": {
   "symptoms": [
    "flank pain",
    "loin pain",
    "hematuria",
    "nausea",
    "vomiting",
    "fever",
    "dysuria",
    "frequency",
    "urgency",
    "previous stones"
   ],
   "negatives": [
    "no fever",
    "no hematuria",
    "no known stones",
    "no prior urologic surgery",
    "no trauma",
    "no pregnancy"
   ],
   "exam": [
    "Temp 36.9",
    "CVA tenderness positive",
    "Abdomen soft",
    "No guarding",
    "Costovertebral tenderness",
    "External genitalia normal"
   ],
   "redFlags": [
    "Fever with flank pain (pyelo)",
    "Anuria/obstruction",
    "Severe pain",
    "Hematuria with obstruction",
    "Solitary kidney with pain"
   ],
   "planPhrases": [
    "Analgesia (NSAIDs/paracetamol)",
    "Hydration",
    "Urine dipstick",
    "KUB US or CT KUB if stone suspected",
    "Strain urine for stones",
    "Return if fever, anuria, or severe pain",
    "Urology referral if obstructed"
   ],
   "followUp": [
    "48-72h",
    "KUB/CT",
    "Urology if stone/nephrolithiasis"
   ]
  },
  "Frequency / urgency": {
   "symptoms": [
    "urinary frequency",
    "urgency",
    "nocturia",
    "incomplete emptying",
    "weak stream",
    "straining",
    "hesitancy",
    "dysuria",
    "hematuria",
    "suprapubic pain"
   ],
   "negatives": [
    "no fever",
    "no hematuria",
    "no known UTI",
    "no neurological symptoms",
    "no prior urologic surgery",
    "no known diabetes"
   ],
   "exam": [
    "Temp 36.8",
    "Suprapubic nontender",
    "Prostate exam if male",
    "External genitalia normal",
    "Neurological exam normal"
   ],
   "redFlags": [
    "Hematuria",
    "Acute retention",
    "Cytological suspicion",
    "Neurological deficit",
    "Significant renal impairment"
   ],
   "planPhrases": [
    "Urine dipstick/culture",
    "Avoid caffeine and alcohol",
    "Bladder training",
    "Pelvic floor exercises in some",
    "Alpha blockers if BPH symptoms",
    "Return if hematuria or retention"
   ],
   "followUp": [
    "2 weeks",
    "US bladder/post-void residual",
    "Urology referral"
   ]
  },
  "Hematuria": {
   "symptoms": [
    "visible blood in urine",
    "microscopic hematuria",
    "dysuria",
    "frequency",
    "flank pain",
    "lower abdominal pain",
    "fever",
    "clots in urine",
    "previous stones",
    "smoking history"
   ],
   "negatives": [
    "no fever",
    "no flank pain",
    "no known trauma",
    "no recent vigorous exercise",
    "no anticoagulants",
    "no menstruation"
   ],
   "exam": [
    "BP 125/80",
    "Abdomen soft",
    "No masses",
    "No CVA tenderness",
    "External genitalia normal",
    "Prostate normal if male"
   ],
   "redFlags": [
    "Gross hematuria with clots",
    "Painless hematuria >35 years",
    "Smoker with hematuria",
    "Known bladder/renal cancer risk",
    "Anticoagulation with significant hematuria"
   ],
   "planPhrases": [
    "Urinalysis and microscopy",
    "Urine culture to exclude infection",
    "Cytology if indicated",
    "US renal tract or CT urogram",
    "Cystoscopy if persistent",
    "Smoking cessation",
    "Return if clots, pain, or recurrent"
   ],
   "followUp": [
    "2 weeks after initial",
    "Cystoscopy if persistent",
    "Urology if >35 with risk factors"
   ]
  },
  "Male LUTS": {
   "symptoms": [
    "urinary frequency",
    "urgency",
    "nocturia",
    "weak stream",
    "hesitancy",
    "straining",
    "incomplete emptying",
    "dribbling",
    "intermittency",
    "dysuria"
   ],
   "negatives": [
    "no hematuria",
    "no fever",
    "no acute retention",
    "no known neurologic disease",
    "no prior prostate surgery"
   ],
   "exam": [
    "DRE: prostate enlarged smooth non-tender",
    "Abdomen suprapubic nontender",
    "External genitalia normal",
    "Neurological exam normal"
   ],
   "redFlags": [
    "Acute retention",
    "Hematuria",
    "Prostate nodule/suspicious DRE",
    "Elevated PSA",
    "Renal impairment"
   ],
   "planPhrases": [
    "IPSS score documented",
    "Lifestyle modifications: reduce evening fluids",
    "Avoid decongestants/antihistamines",
    "Alpha blockers (tamsulosin) if moderate symptoms",
    "5-ARI if large prostate",
    "PSA discussion and screening if appropriate",
    "Return if retention, hematuria, or worsening"
   ],
   "followUp": [
    "4-6 weeks for medication trial",
    "PSA and DRE",
    "Urology referral"
   ]
  }
 },
 "Mental Health": {
  "Anxiety symptoms": {
   "symptoms": [
    "anxiety",
    "worry",
    "restlessness",
    "fatigue",
    "poor concentration",
    "irritability",
    "muscle tension",
    "sleep difficulty",
    "palpitations",
    "shortness of breath",
    "chest tightness",
    "dizziness",
    "GI symptoms",
    "panic attacks",
    "avoidance"
   ],
   "negatives": [
    "no suicidal thoughts",
    "no self-harm",
    "no psychosis",
    "no mania",
    "no substance use",
    "no known medical cause",
    "no prior psychiatric admission"
   ],
   "exam": [
    "BP 125/80",
    "HR 80",
    "Alert and oriented",
    "Mood anxious",
    "Affect anxious/restless",
    "Speech normal",
    "No psychomotor agitation",
    "No suicidal or homicidal ideation"
   ],
   "redFlags": [
    "Suicidal ideation",
    "Self-harm",
    "Panic attacks with severe distress",
    "Functional impairment",
    "Co-morbid depression",
    "Psychosis"
   ],
   "planPhrases": [
    "Reassurance and validation",
    "Breathing exercises",
    "Regular exercise",
    "Sleep hygiene",
    "Caffeine/stimulant reduction",
    "Mild-moderate: CBT, consider SSRI (sertraline)",
    "Return if worsening or suicidal thoughts"
   ],
   "followUp": [
    "2-4 weeks",
    "Psychiatry if severe",
    "CBT referral"
   ]
  },
  "Low mood": {
   "symptoms": [
    "low mood",
    "sadness",
    "anhedonia",
    "fatigue",
    "low energy",
    "poor concentration",
    "sleep changes",
    "appetite changes",
    "weight changes",
    "hopelessness",
    "worthlessness",
    "guilt",
    "irritability",
    "social withdrawal"
   ],
   "negatives": [
    "no suicidal thoughts",
    "no self-harm",
    "no psychosis",
    "no mania",
    "no substance use",
    "no known bipolar",
    "no known medical cause",
    "supportive family"
   ],
   "exam": [
    "BP 120/78",
    "HR 74",
    "Alert",
    "Mood depressed",
    "Affect blunted/flat",
    "Psychomotor slow",
    "Speech normal",
    "No suicidal ideation",
    "No psychotic features",
    "PHQ-9 score"
   ],
   "redFlags": [
    "Suicidal ideation with plan",
    "Active self-harm",
    "Psychosis",
    "Bipolar suspicion",
    "Severe weight loss",
    "Functional decline"
   ],
   "planPhrases": [
    "PHQ-9 documented",
    "Safety assessment: no acute risk",
    "Sleep hygiene",
    "Regular exercise",
    "Social engagement",
    "Consider SSRI if moderate-severe (sertraline)",
    "Return if worsening or suicidal thoughts",
    "Psychiatry referral if severe"
   ],
   "followUp": [
    "2-4 weeks",
    "Psychiatry if severe/psychotic",
    "Therapy referral"
   ]
  },
  "Sleep difficulty": {
   "symptoms": [
    "insomnia",
    "difficulty falling asleep",
    "difficulty staying asleep",
    "early morning waking",
    "unrefreshing sleep",
    "daytime fatigue",
    "irritability",
    "poor concentration",
    "snoring",
    "leg movements",
    "nightmares",
    "stress",
    "caffeine use",
    "screen time"
   ],
   "negatives": [
    "no suicidal thoughts",
    "no mania",
    "no sleep apnea diagnosis",
    "no RLS diagnosis",
    "no significant medical cause",
    "no substance use"
   ],
   "exam": [
    "BP 120/76",
    "HR 72",
    "Alert oriented",
    "Mood within normal",
    "No signs of sleep deprivation"
   ],
   "redFlags": [
    "Sleep apnea with hypoxia",
    "Narcolepsy",
    "Severe insomnia with functional impairment",
    "Bipolar disorder (reduced sleep need)",
    "Suicidal thoughts"
   ],
   "planPhrases": [
    "Sleep hygiene counseling",
    "Consistent sleep/wake schedule",
    "Reduce screens 1h before bed",
    "Limit caffeine after 2pm",
    "Avoid alcohol as sleep aid",
    "Melatonin low dose short-term",
    "Referral for CBT-I",
    "Return if mood symptoms or severe impairment"
   ],
   "followUp": [
    "2-4 weeks sleep hygiene",
    "CBT-I referral",
    "Sleep study if apnea suspected"
   ]
  },
  "Stress-related symptoms": {
   "symptoms": [
    "stress",
    "overwhelmed",
    "fatigue",
    "headache",
    "muscle tension",
    "GI symptoms",
    "irritability",
    "poor concentration",
    "sleep difficulty",
    "appetite changes",
    "mood swings",
    "social withdrawal"
   ],
   "negatives": [
    "no suicidal thoughts",
    "no self-harm",
    "no psychosis",
    "no mania",
    "no medical cause",
    "no prior psychiatric history"
   ],
   "exam": [
    "BP 125/78",
    "HR 76",
    "Alert oriented",
    "Mood stressed/anxious",
    "Affect reactive",
    "Speech normal",
    "No acute distress"
   ],
   "redFlags": [
    "Functional decline",
    "Suicidal ideation",
    "Panic attacks",
    "Co-morbid depression",
    "Burnout severe"
   ],
   "planPhrases": [
    "Stress management techniques",
    "Regular exercise",
    "Mindfulness/relaxation",
    "Work-life balance",
    "Sleep hygiene",
    "Caffeine reduction",
    "Counseling referral if needed",
    "Return if worsening or mood changes"
   ],
   "followUp": [
    "2-4 weeks",
    "Counseling referral",
    "Psychiatry if severe"
   ]
  },
  "Panic symptoms": {
   "symptoms": [
    "panic attacks",
    "sudden fear",
    "chest pain",
    "palpitations",
    "shortness of breath",
    "dizziness",
    "sweating",
    "trembling",
    "nausea",
    "choking sensation",
    "depersonalization",
    "fear of dying",
    "fear of losing control",
    "avoidance",
    "agoraphobia"
   ],
   "negatives": [
    "no suicidal thoughts",
    "no medical cause (ECG, thyroid)",
    "no substance-induced",
    "no known cardiac condition"
   ],
   "exam": [
    "BP 130/80 during episode",
    "HR 88",
    "Alert oriented",
    "Acute distress",
    "No cardiac signs",
    "Respiratory normal",
    "Neuro normal"
   ],
   "redFlags": [
    "Suicidal ideation",
    "Medical cause (arrhythmia, PE, thyrotoxicosis)",
    "Severe agoraphobia",
    "Functional impairment",
    "Frequent ER visits"
   ],
   "planPhrases": [
    "Validate experience",
    "Breathing exercises (slow breathing)",
    "Grounding techniques",
    "Avoid avoidance",
    "CBT referral strongly recommended",
    "SSRI if frequent (sertraline)",
    "Return if worsening or suicidal thoughts"
   ],
   "followUp": [
    "1-2 weeks initial",
    "CBT referral",
    "Psychiatry if severe"
   ]
  }
 }
};
