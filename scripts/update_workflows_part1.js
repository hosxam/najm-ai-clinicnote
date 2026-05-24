/**
 * scripts/update_workflows_part1.js
 *
 * PART 1: Splits peds-fever into peds-fever-infant and peds-fever-child.
 * PART 2: Adds 5 missing high-value workflows.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ─── Helpers to build chips ──────────────────────────────────

function makeChip(workflowId, group, order, text, searchTerms, tags) {
  return {
    chip_id: `${workflowId}-${group}-${order}`,
    group: group,
    chip_text: text,
    order: order,
    search_terms: Array.isArray(searchTerms) ? searchTerms : [searchTerms],
    tags: Array.isArray(tags) ? tags : [tags]
  };
}

function buildWorkflowChips(workflowId, groups) {
  const chips = [];
  for (const [groupName, list] of Object.entries(groups)) {
    list.forEach((entry, idx) => {
      chips.push(makeChip(workflowId, groupName, idx + 1, entry.text, entry.search, entry.tags));
    });
  }
  return chips;
}

const CHIP_GROUPS_FULL = [
  { group: 'symptoms', order: 1, prompt: 'Select symptoms present' },
  { group: 'relevant_negatives', order: 2, prompt: 'Select negatives ruled out' },
  { group: 'exam_findings', order: 3, prompt: 'Select examination findings' },
  { group: 'red_flags', order: 4, prompt: 'Red flags discussed with patient' },
  { group: 'investigations', order: 5, prompt: 'Investigations ordered' },
  { group: 'plan_phrases', order: 6, prompt: 'Select plan items' },
  { group: 'follow_up', order: 7, prompt: 'Follow-up interval' }
];

// ─── peds-fever-infant ───────────────────────────────────────

const infantChips = buildWorkflowChips('peds-fever-infant', {
  symptoms: [
    { text: 'fever 38.2°C 12 hours', search: ['fever'], tags: ['38.2°C'] },
    { text: 'age 6 weeks', search: ['age'], tags: ['6 weeks'] },
    { text: 'first febrile illness', search: ['first'], tags: ['febrile'] },
    { text: 'reduced feeding (less than half normal volume)', search: ['reduced'], tags: ['feeding'] },
    { text: 'last wet nappy 8 hours ago', search: ['wet'], tags: ['urine'] },
    { text: 'irritable when handled', search: ['irritable'], tags: ['handling'] },
    { text: 'lethargic between feeds', search: ['lethargic'], tags: ['activity'] },
    { text: 'no cough or coryza', search: ['no'], tags: ['respiratory'] },
    { text: 'no vomiting or diarrhoea', search: ['no'], tags: ['GI'] },
    { text: 'no rash', search: ['no'], tags: ['rash'] },
    { text: 'no apnoeic episodes', search: ['no'], tags: ['apnoea'] },
    { text: 'born at term, uncomplicated delivery', search: ['born'], tags: ['birth'] },
    { text: 'maternal GBS status negative', search: ['maternal'], tags: ['perinatal'] },
    { text: 'mother afebrile in labour, no prolonged rupture of membranes', search: ['mother'], tags: ['perinatal'] },
    { text: 'immunisations not yet started (under 8 weeks)', search: ['immunisations'], tags: ['vaccination'] },
    { text: 'no sick contacts at home', search: ['no'], tags: ['contacts'] }
  ],
  relevant_negatives: [
    { text: 'no non-blanching rash', search: ['no'], tags: ['rash'] },
    { text: 'no bulging fontanelle', search: ['no'], tags: ['fontanelle'] },
    { text: 'no neck stiffness', search: ['no'], tags: ['meningism'] },
    { text: 'no high-pitched cry', search: ['no'], tags: ['cry'] },
    { text: 'no seizure activity', search: ['no'], tags: ['seizure'] },
    { text: 'no apnoea or grunting', search: ['no'], tags: ['respiratory'] },
    { text: 'no cyanosis', search: ['no'], tags: ['cyanosis'] },
    { text: 'no mottling reported', search: ['no'], tags: ['mottling'] },
    { text: 'no recent travel or returning traveller contact', search: ['no'], tags: ['exposure'] },
    { text: 'no recent antibiotics', search: ['no'], tags: ['antibiotics'] },
    { text: 'no surgical history', search: ['no'], tags: ['surgery'] },
    { text: 'no congenital anomaly known', search: ['no'], tags: ['congenital'] }
  ],
  exam_findings: [
    { text: 'temp 38.4°C, HR 168, RR 52, SpO2 97% RA', search: ['temp'], tags: ['vitals'] },
    { text: 'weight 4.6kg (50th centile)', search: ['weight'], tags: ['centile'] },
    { text: 'CRT 3 seconds peripherally', search: ['CRT'], tags: ['perfusion'] },
    { text: 'anterior fontanelle flat and soft', search: ['fontanelle'], tags: ['anterior'] },
    { text: 'colour pink centrally, mild peripheral mottling', search: ['colour'], tags: ['perfusion'] },
    { text: 'tone normal for age', search: ['tone'], tags: ['neurological'] },
    { text: 'cry strong, consolable in mother\'s arms', search: ['cry'], tags: ['behaviour'] },
    { text: 'feeds taken 60mL of usual 90mL', search: ['feeds'], tags: ['feeding'] },
    { text: 'no rash on full skin examination', search: ['no'], tags: ['skin'] },
    { text: 'chest clear, no recession', search: ['chest'], tags: ['respiratory'] },
    { text: 'heart sounds normal, no murmur', search: ['heart'], tags: ['cardiac'] },
    { text: 'abdomen soft, no organomegaly', search: ['abdomen'], tags: ['GI'] },
    { text: 'umbilicus clean and dry', search: ['umbilicus'], tags: ['skin'] },
    { text: 'NICE traffic light: AMBER (age <3 months drives risk)', search: ['NICE'], tags: ['amber'] }
  ],
  red_flags: [
    { text: 'age <3 months with fever ≥38°C (full septic screen indicated)', search: ['age'], tags: ['<3 months'] },
    { text: 'bulging or tense fontanelle', search: ['bulging'], tags: ['meningitis'] },
    { text: 'non-blanching rash (meningococcal sepsis)', search: ['non-blanching'], tags: ['rash'] },
    { text: 'inconsolable crying or high-pitched cry', search: ['inconsolable'], tags: ['neurological'] },
    { text: 'lethargic, mottled, pale or blue', search: ['lethargic'], tags: ['perfusion'] },
    { text: 'poor feeding (<half of normal volume)', search: ['poor'], tags: ['feeding'] },
    { text: 'no wet nappy >12 hours (severe dehydration)', search: ['no'], tags: ['dehydration'] },
    { text: 'apnoea or grunting respirations', search: ['apnoea'], tags: ['respiratory'] },
    { text: 'cyanosis or oxygen saturations <92%', search: ['cyanosis'], tags: ['hypoxia'] },
    { text: 'seizure or focal neurological signs', search: ['seizure'], tags: ['neurological'] },
    { text: 'severe tachycardia (HR >180) or bradycardia', search: ['tachycardia'], tags: ['vitals'] },
    { text: 'CRT >3 seconds centrally', search: ['CRT'], tags: ['perfusion'] },
    { text: 'temperature <36°C or >38.5°C', search: ['temperature'], tags: ['hypothermia'] }
  ],
  investigations: [
    { text: 'FBC: WCC 18.2, neutrophils 12.4', search: ['FBC'], tags: ['bloods'] },
    { text: 'CRP 42 mg/L', search: ['CRP'], tags: ['inflammatory'] },
    { text: 'blood culture: sent (peripheral)', search: ['blood'], tags: ['microbiology'] },
    { text: 'urine: clean catch sent for microscopy and culture', search: ['urine'], tags: ['microbiology'] },
    { text: 'urine dip: leucocytes positive, nitrites negative', search: ['urine'], tags: ['urinalysis'] },
    { text: 'capillary blood gas: lactate 1.8, pH 7.36', search: ['gas'], tags: ['bloods'] },
    { text: 'glucose 4.8 mmol/L', search: ['glucose'], tags: ['bloods'] },
    { text: 'U&E and creatinine: normal', search: ['U&E'], tags: ['bloods'] },
    { text: 'CXR: no focal consolidation', search: ['CXR'], tags: ['imaging'] },
    { text: 'lumbar puncture: clear, sent for MCS and PCR', search: ['lumbar'], tags: ['CSF'] },
    { text: 'CSF: WCC 2, protein 0.3, glucose 3.2', search: ['CSF'], tags: ['bloods'] },
    { text: 'viral PCR (HSV, enterovirus, parechovirus): sent', search: ['viral'], tags: ['microbiology'] }
  ],
  plan_phrases: [
    { text: 'admit to paediatric ward for septic screen', search: ['admit'], tags: ['admission'] },
    { text: 'IV access secured', search: ['IV'], tags: ['procedure'] },
    { text: 'empirical IV antibiotics started after cultures (clinician decision)', search: ['empirical'], tags: ['medication'] },
    { text: 'IV fluids: maintenance commenced', search: ['IV'], tags: ['fluids'] },
    { text: 'continuous cardiorespiratory monitoring', search: ['monitoring'], tags: ['observation'] },
    { text: 'PEWS chart commenced', search: ['PEWS'], tags: ['observation'] },
    { text: 'paracetamol suspension (weight-based, clinician dose)', search: ['paracetamol'], tags: ['medication'] },
    { text: 'paediatric registrar review and consultant informed', search: ['registrar'], tags: ['escalation'] },
    { text: 'parents informed and consent for LP discussed', search: ['parents'], tags: ['communication'] },
    { text: 'no NSAIDs in first 3 months of life', search: ['no'], tags: ['safety'] },
    { text: 'safeguarding considered, no concerns raised', search: ['safeguarding'], tags: ['safety'] },
    { text: 'breastfeeding encouraged on demand', search: ['breastfeeding'], tags: ['feeding'] },
    { text: 'NICE NG143 fever in under 5s pathway followed', search: ['NICE'], tags: ['guideline'] },
    { text: 'document time of antibiotic administration', search: ['document'], tags: ['record'] }
  ],
  follow_up: [
    { text: 'reassess in 1 hour after antibiotics', search: ['reassess'], tags: ['acute'] },
    { text: 'inpatient observation minimum 48 hours', search: ['inpatient'], tags: ['admission'] },
    { text: 'paediatric outpatient review on discharge', search: ['outpatient'], tags: ['followup'] },
    { text: 'GP follow-up within 48 hours of discharge', search: ['GP'], tags: ['followup'] },
    { text: 'health visitor notified', search: ['health'], tags: ['community'] },
    { text: 'return immediately if any red flag develops', search: ['return'], tags: ['safetynet'] },
    { text: '111 or 999 if deterioration at home', search: ['111'], tags: ['safetynet'] }
  ]
});

// ─── peds-fever-child ───────────────────────────────────────

const childChips = buildWorkflowChips('peds-fever-child', {
  symptoms: [
    { text: 'fever 39.0°C 2 days', search: ['fever'], tags: ['39.0°C'] },
    { text: 'age 18 months', search: ['age'], tags: ['18 months'] },
    { text: 'irritable but consolable', search: ['irritable'], tags: ['behaviour'] },
    { text: 'reduced oral intake', search: ['reduced'], tags: ['feeding'] },
    { text: 'runny nose, clear discharge', search: ['runny'], tags: ['URTI'] },
    { text: 'mild dry cough', search: ['cough'], tags: ['respiratory'] },
    { text: 'sore throat reported by parent', search: ['sore'], tags: ['ENT'] },
    { text: 'pulling at right ear', search: ['ear'], tags: ['otalgia'] },
    { text: 'reduced appetite for solids', search: ['appetite'], tags: ['feeding'] },
    { text: 'wet nappies 4 today (usually 6)', search: ['wet'], tags: ['hydration'] },
    { text: 'sleeping more than usual', search: ['sleeping'], tags: ['behaviour'] },
    { text: 'no rigors', search: ['no'], tags: ['rigors'] },
    { text: 'no vomiting or diarrhoea', search: ['no'], tags: ['GI'] },
    { text: 'no rash noticed by parents', search: ['no'], tags: ['rash'] },
    { text: 'sick contacts at nursery (URTI circulating)', search: ['sick'], tags: ['exposure'] },
    { text: 'fully immunised for age', search: ['immunised'], tags: ['vaccination'] },
    { text: 'no recent travel', search: ['no'], tags: ['travel'] }
  ],
  relevant_negatives: [
    { text: 'no non-blanching rash (parent and clinician check)', search: ['no'], tags: ['rash'] },
    { text: 'no neck stiffness', search: ['no'], tags: ['meningism'] },
    { text: 'no photophobia', search: ['no'], tags: ['neurological'] },
    { text: 'no bulging fontanelle (still palpable, flat)', search: ['no'], tags: ['fontanelle'] },
    { text: 'no seizures', search: ['no'], tags: ['neurological'] },
    { text: 'no limb pain or refusal to weight-bear', search: ['no'], tags: ['MSK'] },
    { text: 'no dysuria or offensive urine', search: ['no'], tags: ['urinary'] },
    { text: 'no abdominal pain', search: ['no'], tags: ['abdomen'] },
    { text: 'no respiratory distress at rest', search: ['no'], tags: ['respiratory'] },
    { text: 'no drooling or stridor', search: ['no'], tags: ['airway'] },
    { text: 'no recent antibiotics', search: ['no'], tags: ['antibiotics'] }
  ],
  exam_findings: [
    { text: 'temp 38.6°C, HR 138, RR 28, SpO2 98% RA', search: ['temp'], tags: ['vitals'] },
    { text: 'weight 12.0kg (50th centile)', search: ['weight'], tags: ['centile'] },
    { text: 'alert, interactive, smiling at parent', search: ['alert'], tags: ['behaviour'] },
    { text: 'CRT <2 seconds, well perfused', search: ['CRT'], tags: ['perfusion'] },
    { text: 'mucous membranes moist', search: ['mucous'], tags: ['hydration'] },
    { text: 'no rash on full body examination', search: ['no'], tags: ['skin'] },
    { text: 'ENT: tympanic membranes erythematous and bulging on right', search: ['ENT'], tags: ['otitis'] },
    { text: 'left tympanic membrane normal', search: ['TM'], tags: ['ear'] },
    { text: 'throat: tonsils enlarged grade 2, no exudate', search: ['throat'], tags: ['ENT'] },
    { text: 'cervical lymph nodes mildly enlarged, mobile, non-tender', search: ['cervical'], tags: ['nodes'] },
    { text: 'chest clear bilaterally, no recession', search: ['chest'], tags: ['respiratory'] },
    { text: 'heart sounds normal, no murmur', search: ['heart'], tags: ['cardiac'] },
    { text: 'abdomen soft, no tenderness, no organomegaly', search: ['abdomen'], tags: ['GI'] },
    { text: 'no joint swelling, full range of movement', search: ['joint'], tags: ['MSK'] },
    { text: 'NICE traffic light: GREEN (low risk for serious illness)', search: ['NICE'], tags: ['traffic light'] }
  ],
  red_flags: [
    { text: 'non-blanching rash (meningococcal sepsis)', search: ['non-blanching'], tags: ['rash'] },
    { text: 'neck stiffness, photophobia or Kernig sign', search: ['neck'], tags: ['meningism'] },
    { text: 'mottled, ashen, blue or pale appearance', search: ['mottled'], tags: ['perfusion'] },
    { text: 'CRT ≥3 seconds or weak peripheral pulses', search: ['CRT'], tags: ['perfusion'] },
    { text: 'tachypnoea, grunting or moderate-severe recession', search: ['tachypnoea'], tags: ['respiratory'] },
    { text: 'oxygen saturations ≤92% in air', search: ['saturations'], tags: ['hypoxia'] },
    { text: 'reduced consciousness or unresponsive to social cues', search: ['consciousness'], tags: ['neurological'] },
    { text: 'seizure (febrile or focal)', search: ['seizure'], tags: ['neurological'] },
    { text: 'fever ≥5 days unexplained (consider Kawasaki)', search: ['fever'], tags: ['Kawasaki'] },
    { text: 'limb pain or refusal to weight-bear (septic arthritis)', search: ['limb'], tags: ['MSK'] },
    { text: 'severe dehydration: dry mucous membranes, sunken eyes, no tears', search: ['dehydration'], tags: ['hydration'] },
    { text: 'bile-stained vomiting', search: ['bile'], tags: ['GI'] }
  ],
  investigations: [
    { text: 'urine dip (clean catch): negative for nitrites and leucocytes', search: ['urine'], tags: ['urinalysis'] },
    { text: 'urine MC&S: not sent (dip negative)', search: ['urine'], tags: ['microbiology'] },
    { text: 'CRP 18 mg/L (mildly elevated)', search: ['CRP'], tags: ['inflammatory'] },
    { text: 'FBC: WCC 11.8, neutrophils 7.4 (within normal range for age)', search: ['FBC'], tags: ['bloods'] },
    { text: 'blood culture: not indicated (NICE green, well child)', search: ['blood'], tags: ['microbiology'] },
    { text: 'throat swab: not indicated routinely', search: ['throat'], tags: ['microbiology'] },
    { text: 'CXR: not indicated, no focal respiratory signs', search: ['CXR'], tags: ['imaging'] },
    { text: 'lumbar puncture: not indicated', search: ['LP'], tags: ['CSF'] },
    { text: 'capillary glucose 5.4 mmol/L', search: ['glucose'], tags: ['bloods'] },
    { text: 'rapid strep test: negative', search: ['strep'], tags: ['microbiology'] }
  ],
  plan_phrases: [
    { text: 'paracetamol suspension PRN for distress', search: ['paracetamol'], tags: ['medication'] },
    { text: 'ibuprofen suspension PRN for distress', search: ['ibuprofen'], tags: ['medication'] },
    { text: 'do not alternate antipyretics routinely', search: ['alternate'], tags: ['medication'] },
    { text: 'encourage oral fluids: small sips frequently', search: ['fluids'], tags: ['hydration'] },
    { text: 'oral rehydration solution if reduced intake', search: ['ORS'], tags: ['hydration'] },
    { text: 'do not over-wrap child', search: ['wrap'], tags: ['advice'] },
    { text: 'monitor for dehydration: wet nappies, alertness', search: ['monitor'], tags: ['advice'] },
    { text: 'safety-net advice given verbally and in writing', search: ['safety-net'], tags: ['advice'] },
    { text: 'NICE NG143 fever in under 5s leaflet provided', search: ['NICE'], tags: ['guideline'] },
    { text: 'amoxicillin suspension if otitis media confirmed (clinician decision)', search: ['amoxicillin'], tags: ['medication'] },
    { text: 'school or nursery exclusion until fever-free 24 hours', search: ['school'], tags: ['advice'] },
    { text: 'viral illness most likely: supportive care', search: ['viral'], tags: ['diagnosis'] },
    { text: 'avoid aspirin in under 16s', search: ['aspirin'], tags: ['safety'] },
    { text: 'parental observation chart provided', search: ['observation'], tags: ['advice'] }
  ],
  follow_up: [
    { text: 'review in 48 hours if fever persists', search: ['review'], tags: ['routine'] },
    { text: 'GP review next day if not improving', search: ['GP'], tags: ['routine'] },
    { text: 'return immediately if non-blanching rash, drowsy, fitting or not drinking', search: ['return'], tags: ['safetynet'] },
    { text: 'attend ED if any NICE amber or red feature', search: ['ED'], tags: ['safetynet'] },
    { text: 'call 111 if concerned overnight', search: ['111'], tags: ['safetynet'] },
    { text: 'return earlier if fever ≥5 days', search: ['return'], tags: ['Kawasaki'] }
  ]
});

// ─── ophth-diabetic-retinopathy-screening ───────────────────

const dmRetinopathyChips = buildWorkflowChips('ophth-diabetic-retinopathy-screening', {
  symptoms: [
    { text: 'attending for annual diabetic eye screening', search: ['screening'], tags: ['routine'] },
    { text: 'no new visual symptoms', search: ['no'], tags: ['asymptomatic'] },
    { text: 'type 2 diabetes 12 years duration', search: ['T2DM'], tags: ['history'] },
    { text: 'last HbA1c 64 mmol/mol', search: ['HbA1c'], tags: ['glycaemic'] },
    { text: 'on metformin and gliclazide', search: ['metformin'], tags: ['medication history'] },
    { text: 'no previous laser treatment or intravitreal injections', search: ['no'], tags: ['history'] },
    { text: 'no floaters or flashing lights', search: ['no'], tags: ['symptoms'] },
    { text: 'no sudden vision loss', search: ['no'], tags: ['symptoms'] },
    { text: 'last screening 12 months ago: R1M0', search: ['previous'], tags: ['history'] },
    { text: 'BP 138/82 today', search: ['BP'], tags: ['risk factor'] },
    { text: 'smoker, 10 pack-years', search: ['smoker'], tags: ['risk factor'] },
    { text: 'cataract surgery right eye 2 years ago', search: ['cataract'], tags: ['ocular history'] }
  ],
  relevant_negatives: [
    { text: 'no diabetic foot ulceration', search: ['no'], tags: ['comorbidity'] },
    { text: 'no nephropathy', search: ['no'], tags: ['comorbidity'] },
    { text: 'no neuropathy symptoms', search: ['no'], tags: ['comorbidity'] },
    { text: 'no hypertension uncontrolled', search: ['no'], tags: ['risk factor'] },
    { text: 'not pregnant', search: ['no'], tags: ['pregnancy'] },
    { text: 'no recent rapid HbA1c improvement', search: ['no'], tags: ['glycaemic'] },
    { text: 'no glaucoma or macular degeneration', search: ['no'], tags: ['ocular'] }
  ],
  exam_findings: [
    { text: 'visual acuity right 6/9, left 6/12', search: ['acuity'], tags: ['vision'] },
    { text: 'pinhole right 6/6, left 6/9', search: ['pinhole'], tags: ['vision'] },
    { text: 'pupils equal and reactive, no RAPD', search: ['pupils'], tags: ['neuro-ophth'] },
    { text: 'IOP right 16, left 17 mmHg', search: ['IOP'], tags: ['pressure'] },
    { text: 'anterior segment unremarkable bilaterally', search: ['anterior'], tags: ['exam'] },
    { text: 'lens clear left, IOL in situ right (PCO mild)', search: ['lens'], tags: ['exam'] },
    { text: 'right eye: dot haemorrhages and microaneurysms in mid-periphery', search: ['haemorrhages'], tags: ['retinopathy'] },
    { text: 'left eye: scattered microaneurysms only', search: ['microaneurysms'], tags: ['retinopathy'] },
    { text: 'no cotton wool spots', search: ['no'], tags: ['retinopathy'] },
    { text: 'no IRMA, no venous beading', search: ['no'], tags: ['retinopathy'] },
    { text: 'no neovascularisation at disc or elsewhere', search: ['no'], tags: ['retinopathy'] },
    { text: 'no vitreous haemorrhage', search: ['no'], tags: ['retinopathy'] },
    { text: 'macula: no exudates within 1 disc diameter of fovea', search: ['macula'], tags: ['maculopathy'] },
    { text: 'OCT macula: central foveal thickness 248 microns', search: ['OCT'], tags: ['imaging'] },
    { text: 'fundus photographs: gradable both eyes', search: ['fundus'], tags: ['imaging'] },
    { text: 'grading: right R1M0, left R1M0', search: ['grading'], tags: ['classification'] }
  ],
  red_flags: [
    { text: 'sudden painless visual loss (vitreous haemorrhage or retinal detachment)', search: ['sudden'], tags: ['urgent'] },
    { text: 'new floaters with photopsia', search: ['floaters'], tags: ['urgent'] },
    { text: 'neovascularisation at disc (NVD) or elsewhere (NVE)', search: ['neovascularisation'], tags: ['proliferative'] },
    { text: 'pre-retinal or vitreous haemorrhage', search: ['haemorrhage'], tags: ['proliferative'] },
    { text: 'retinal detachment signs: shadow, curtain', search: ['detachment'], tags: ['urgent'] },
    { text: 'macular oedema reducing central vision', search: ['oedema'], tags: ['maculopathy'] },
    { text: 'rubeosis iridis', search: ['rubeosis'], tags: ['advanced'] },
    { text: 'pregnancy with any retinopathy (rapid progression risk)', search: ['pregnancy'], tags: ['risk'] }
  ],
  investigations: [
    { text: 'mydriatic fundus photography: gradable images', search: ['fundus'], tags: ['screening'] },
    { text: 'visual acuity Snellen chart at 6 metres', search: ['acuity'], tags: ['screening'] },
    { text: 'OCT macula performed: no diabetic macular oedema', search: ['OCT'], tags: ['imaging'] },
    { text: 'fluorescein angiography: not indicated', search: ['fluorescein'], tags: ['imaging'] },
    { text: 'HbA1c reviewed: 64 mmol/mol', search: ['HbA1c'], tags: ['systemic'] },
    { text: 'BP recorded: 138/82', search: ['BP'], tags: ['systemic'] },
    { text: 'urine ACR if available: 2.1 mg/mmol', search: ['ACR'], tags: ['systemic'] }
  ],
  plan_phrases: [
    { text: 'grading: R1M0 both eyes (background retinopathy, no maculopathy)', search: ['R1M0'], tags: ['grading'] },
    { text: 'recall annual screening as per NHS DESP pathway', search: ['recall'], tags: ['routine'] },
    { text: 'no laser photocoagulation indicated today', search: ['no'], tags: ['plan'] },
    { text: 'no intravitreal anti-VEGF indicated today', search: ['no'], tags: ['plan'] },
    { text: 'optimise HbA1c with diabetes team', search: ['optimise'], tags: ['systemic'] },
    { text: 'optimise blood pressure control', search: ['BP'], tags: ['systemic'] },
    { text: 'lipid review at GP', search: ['lipids'], tags: ['systemic'] },
    { text: 'smoking cessation advice given', search: ['smoking'], tags: ['advice'] },
    { text: 'patient counselled on retinopathy grade and progression risk', search: ['counselled'], tags: ['advice'] },
    { text: 'driving: meets DVLA visual standards', search: ['driving'], tags: ['advice'] },
    { text: 'GP letter sent with grading and recommendations', search: ['letter'], tags: ['communication'] },
    { text: 'if R2/R3 progression: refer to hospital eye service', search: ['refer'], tags: ['plan'] },
    { text: 'if M1: refer to medical retina clinic', search: ['M1'], tags: ['plan'] }
  ],
  follow_up: [
    { text: 'rescreen in 12 months', search: ['rescreen'], tags: ['routine'] },
    { text: 'rescreen in 6 months if R2 (pre-proliferative)', search: ['6 months'], tags: ['surveillance'] },
    { text: 'urgent referral if R3 (proliferative) or M1 (maculopathy)', search: ['urgent'], tags: ['referral'] },
    { text: 'return immediately if sudden vision change or floaters', search: ['return'], tags: ['safetynet'] },
    { text: 'pregnancy: rescreen each trimester', search: ['pregnancy'], tags: ['surveillance'] }
  ]
});

// ─── psych-adhd-assessment ───────────────────────────────────

const adhdChips = buildWorkflowChips('psych-adhd-assessment', {
  symptoms: [
    { text: 'parent-reported inattention since age 5', search: ['inattention'], tags: ['symptom'] },
    { text: 'difficulty sustaining attention on schoolwork', search: ['attention'], tags: ['symptom'] },
    { text: 'easily distracted by extraneous stimuli', search: ['distracted'], tags: ['symptom'] },
    { text: 'often loses items needed for tasks', search: ['loses'], tags: ['symptom'] },
    { text: 'forgetful in daily activities', search: ['forgetful'], tags: ['symptom'] },
    { text: 'difficulty organising tasks, fails to complete', search: ['organising'], tags: ['symptom'] },
    { text: 'avoids tasks requiring sustained mental effort', search: ['avoids'], tags: ['symptom'] },
    { text: 'fidgets, taps hands or feet', search: ['fidgets'], tags: ['hyperactivity'] },
    { text: 'leaves seat in classroom inappropriately', search: ['seat'], tags: ['hyperactivity'] },
    { text: 'restless, "on the go" most of the day', search: ['restless'], tags: ['hyperactivity'] },
    { text: 'talks excessively', search: ['talks'], tags: ['hyperactivity'] },
    { text: 'interrupts others or blurts out answers', search: ['interrupts'], tags: ['impulsivity'] },
    { text: 'difficulty waiting turn', search: ['waiting'], tags: ['impulsivity'] },
    { text: 'symptoms present in school AND home', search: ['two settings'], tags: ['DSM-5'] },
    { text: 'symptoms present before age 12', search: ['onset'], tags: ['DSM-5'] },
    { text: 'symptoms persistent ≥6 months', search: ['persistent'], tags: ['DSM-5'] },
    { text: 'school report: difficulties with attention and task completion', search: ['school'], tags: ['collateral'] },
    { text: 'sleep onset insomnia, settles late', search: ['sleep'], tags: ['comorbid'] }
  ],
  relevant_negatives: [
    { text: 'no symptoms only present in one setting', search: ['no'], tags: ['DSM-5'] },
    { text: 'no clear trigger or stressor', search: ['no'], tags: ['differential'] },
    { text: 'no mood symptoms predominant', search: ['no'], tags: ['differential'] },
    { text: 'no psychosis or hallucinations', search: ['no'], tags: ['differential'] },
    { text: 'no recent head injury or seizures', search: ['no'], tags: ['differential'] },
    { text: 'no suicidal ideation reported', search: ['no'], tags: ['safety'] },
    { text: 'no self-harm', search: ['no'], tags: ['safety'] },
    { text: 'no substance misuse', search: ['no'], tags: ['differential'] },
    { text: 'no developmental regression', search: ['no'], tags: ['development'] },
    { text: 'no hearing or vision impairment uncorrected', search: ['no'], tags: ['differential'] },
    { text: 'no thyroid symptoms', search: ['no'], tags: ['differential'] }
  ],
  exam_findings: [
    { text: 'appearance: appropriately dressed for age', search: ['appearance'], tags: ['MSE'] },
    { text: 'behaviour: restless in chair, frequent position changes', search: ['restless'], tags: ['MSE'] },
    { text: 'speech: rapid, normal volume', search: ['speech'], tags: ['MSE'] },
    { text: 'mood: euthymic per parent and child report', search: ['mood'], tags: ['MSE'] },
    { text: 'affect: reactive, full range', search: ['affect'], tags: ['MSE'] },
    { text: 'thought form: tangential, jumps between topics', search: ['thought'], tags: ['MSE'] },
    { text: 'thought content: no abnormal beliefs', search: ['no'], tags: ['MSE'] },
    { text: 'perception: no hallucinations elicited', search: ['no'], tags: ['MSE'] },
    { text: 'cognition: oriented, attention reduced on serial 7s', search: ['cognition'], tags: ['MSE'] },
    { text: 'insight: child accepts attention difficulties', search: ['insight'], tags: ['MSE'] },
    { text: 'risk: no SI, no harm to others, no self-harm history', search: ['risk'], tags: ['safety'] },
    { text: 'height and weight on growth centile chart', search: ['growth'], tags: ['baseline'] },
    { text: 'BP 102/64, HR 88 (baseline pre-stimulant consideration)', search: ['BP'], tags: ['baseline'] },
    { text: 'cardiovascular examination unremarkable', search: ['CVS'], tags: ['baseline'] }
  ],
  red_flags: [
    { text: 'suicidal ideation or self-harm', search: ['suicidal'], tags: ['urgent'] },
    { text: 'psychotic symptoms (hallucinations, delusions)', search: ['psychotic'], tags: ['urgent'] },
    { text: 'safeguarding concerns at home or school', search: ['safeguarding'], tags: ['urgent'] },
    { text: 'severe aggression or harm to others', search: ['aggression'], tags: ['urgent'] },
    { text: 'developmental regression or new neurological signs', search: ['regression'], tags: ['urgent'] },
    { text: 'family history of sudden cardiac death (pre-stimulant caution)', search: ['cardiac'], tags: ['screening'] },
    { text: 'tics worsening on stimulant trial', search: ['tics'], tags: ['side-effect'] }
  ],
  investigations: [
    { text: 'Conners 3 parent rating scale: elevated on inattention and hyperactivity', search: ['Conners'], tags: ['rating scale'] },
    { text: 'Conners 3 teacher rating scale: elevated on inattention', search: ['Conners'], tags: ['rating scale'] },
    { text: 'SDQ score: high impact on family and school', search: ['SDQ'], tags: ['rating scale'] },
    { text: 'school report obtained and reviewed', search: ['school'], tags: ['collateral'] },
    { text: 'developmental and birth history reviewed', search: ['developmental'], tags: ['history'] },
    { text: 'hearing and vision tests: normal', search: ['hearing'], tags: ['differential'] },
    { text: 'thyroid function: TSH 1.8 (normal)', search: ['TFT'], tags: ['differential'] },
    { text: 'baseline ECG if stimulant being considered', search: ['ECG'], tags: ['baseline'] }
  ],
  plan_phrases: [
    { text: 'meets DSM-5 criteria for ADHD combined presentation', search: ['DSM-5'], tags: ['diagnosis'] },
    { text: 'multimodal management discussed with family', search: ['multimodal'], tags: ['plan'] },
    { text: 'parent training programme referral', search: ['parent'], tags: ['plan'] },
    { text: 'school liaison: classroom strategies, EHCP review if indicated', search: ['school'], tags: ['plan'] },
    { text: 'sleep hygiene advice provided', search: ['sleep'], tags: ['advice'] },
    { text: 'screen-time guidance discussed', search: ['screen'], tags: ['advice'] },
    { text: 'CBT referral for executive function support', search: ['CBT'], tags: ['plan'] },
    { text: 'medication options discussed: stimulant or non-stimulant', search: ['medication'], tags: ['plan'] },
    { text: 'baseline weight, height, BP and HR documented for monitoring', search: ['baseline'], tags: ['plan'] },
    { text: 'side-effects counselling completed', search: ['counselling'], tags: ['advice'] },
    { text: 'co-existing anxiety screened: GAD-7 mild range', search: ['anxiety'], tags: ['comorbid'] },
    { text: 'NICE NG87 ADHD pathway followed', search: ['NICE'], tags: ['guideline'] },
    { text: 'shared care agreement to be set up with GP', search: ['shared'], tags: ['plan'] }
  ],
  follow_up: [
    { text: 'review in 6 weeks after parent training initiation', search: ['review'], tags: ['routine'] },
    { text: 'titration review every 4 weeks if medication started', search: ['titration'], tags: ['monitoring'] },
    { text: '6-monthly height, weight, BP, HR monitoring', search: ['6 monthly'], tags: ['monitoring'] },
    { text: 'urgent review if mood deterioration or new tics', search: ['urgent'], tags: ['safetynet'] },
    { text: 'ED if new psychotic symptoms or suicidal ideation', search: ['ED'], tags: ['safetynet'] }
  ]
});

// ─── ent-neck-lump ──────────────────────────────────────────

const neckLumpChips = buildWorkflowChips('ent-neck-lump', {
  symptoms: [
    { text: 'left-sided neck lump noticed 6 weeks ago', search: ['neck'], tags: ['presenting'] },
    { text: 'lump enlarging over time', search: ['enlarging'], tags: ['symptom'] },
    { text: 'painless', search: ['painless'], tags: ['character'] },
    { text: 'no overlying skin change', search: ['no'], tags: ['character'] },
    { text: 'age 58 years', search: ['age'], tags: ['demographics'] },
    { text: 'former smoker, 25 pack-years', search: ['smoker'], tags: ['risk factor'] },
    { text: 'occasional alcohol use', search: ['alcohol'], tags: ['risk factor'] },
    { text: 'no recent infection', search: ['no'], tags: ['differential'] },
    { text: 'no recent travel or TB contact', search: ['no'], tags: ['differential'] },
    { text: 'no fevers or night sweats', search: ['no'], tags: ['systemic'] },
    { text: 'no unintentional weight loss', search: ['no'], tags: ['systemic'] },
    { text: 'no dysphagia', search: ['no'], tags: ['ENT symptom'] },
    { text: 'no odynophagia', search: ['no'], tags: ['ENT symptom'] },
    { text: 'no hoarseness', search: ['no'], tags: ['ENT symptom'] },
    { text: 'no haemoptysis', search: ['no'], tags: ['ENT symptom'] },
    { text: 'no otalgia', search: ['no'], tags: ['ENT symptom'] },
    { text: 'no oral lesions noticed', search: ['no'], tags: ['ENT symptom'] }
  ],
  relevant_negatives: [
    { text: 'no thyroid symptoms (heat/cold intolerance, palpitations)', search: ['no'], tags: ['differential'] },
    { text: 'no previous head and neck cancer', search: ['no'], tags: ['history'] },
    { text: 'no previous radiotherapy to neck', search: ['no'], tags: ['history'] },
    { text: 'no immunocompromise or HIV risk factors', search: ['no'], tags: ['history'] },
    { text: 'no recent dental infection', search: ['no'], tags: ['differential'] },
    { text: 'no skin lesions on scalp or face', search: ['no'], tags: ['differential'] },
    { text: 'no other lumps elsewhere (groin, axilla)', search: ['no'], tags: ['differential'] }
  ],
  exam_findings: [
    { text: 'lump in level III of left neck (jugulodigastric region)', search: ['level III'], tags: ['location'] },
    { text: 'size 2.5 x 2 cm', search: ['size'], tags: ['measurement'] },
    { text: 'firm consistency', search: ['firm'], tags: ['character'] },
    { text: 'fixed to underlying tissue', search: ['fixed'], tags: ['character'] },
    { text: 'non-tender', search: ['non-tender'], tags: ['character'] },
    { text: 'overlying skin normal, no erythema', search: ['skin'], tags: ['character'] },
    { text: 'does not move with swallowing or tongue protrusion', search: ['movement'], tags: ['character'] },
    { text: 'no pulsation, no bruit on auscultation', search: ['no'], tags: ['character'] },
    { text: 'no other cervical lymphadenopathy', search: ['no'], tags: ['exam'] },
    { text: 'thyroid not enlarged', search: ['thyroid'], tags: ['exam'] },
    { text: 'no parotid or submandibular swelling', search: ['salivary'], tags: ['exam'] },
    { text: 'oral cavity: no visible lesions, dentition fair', search: ['oral'], tags: ['exam'] },
    { text: 'oropharynx: tonsils symmetrical, no mass', search: ['oropharynx'], tags: ['exam'] },
    { text: 'flexible nasendoscopy: nasopharynx, base of tongue, larynx clear', search: ['nasendoscopy'], tags: ['exam'] },
    { text: 'cranial nerves intact', search: ['cranial'], tags: ['exam'] }
  ],
  red_flags: [
    { text: 'unilateral neck lump >3 weeks in adult >40 years (2-week wait criteria)', search: ['2WW'], tags: ['cancer'] },
    { text: 'persistent unexplained hoarseness >3 weeks', search: ['hoarseness'], tags: ['cancer'] },
    { text: 'persistent unilateral sore throat', search: ['sore'], tags: ['cancer'] },
    { text: 'unilateral nasal obstruction or epistaxis', search: ['nasal'], tags: ['cancer'] },
    { text: 'unexplained oral ulcer >3 weeks', search: ['oral'], tags: ['cancer'] },
    { text: 'red or red-and-white patch in mouth', search: ['leukoplakia'], tags: ['cancer'] },
    { text: 'unilateral hearing loss with neck mass (nasopharyngeal cancer)', search: ['hearing'], tags: ['cancer'] },
    { text: 'cranial nerve palsy with neck mass', search: ['cranial'], tags: ['cancer'] },
    { text: 'B symptoms: night sweats, weight loss, fever (lymphoma)', search: ['B symptoms'], tags: ['lymphoma'] },
    { text: 'rapidly enlarging neck mass with stridor', search: ['stridor'], tags: ['airway'] }
  ],
  investigations: [
    { text: 'ultrasound neck: hypoechoic node 25mm, loss of fatty hilum, U4 features', search: ['ultrasound'], tags: ['imaging'] },
    { text: 'ultrasound-guided FNAC arranged', search: ['FNAC'], tags: ['cytology'] },
    { text: 'core biopsy if FNAC inadequate', search: ['core'], tags: ['biopsy'] },
    { text: 'CT neck and thorax with contrast: arranged', search: ['CT'], tags: ['imaging'] },
    { text: 'MRI neck if cytology suggests SCC', search: ['MRI'], tags: ['imaging'] },
    { text: 'EBV PCR: pending (consider nasopharyngeal carcinoma)', search: ['EBV'], tags: ['microbiology'] },
    { text: 'HPV p16 testing on biopsy: pending', search: ['HPV'], tags: ['pathology'] },
    { text: 'FBC, U&E, LFT, LDH', search: ['FBC'], tags: ['bloods'] },
    { text: 'TFT: TSH 2.1 (normal)', search: ['TFT'], tags: ['bloods'] },
    { text: 'HIV test offered', search: ['HIV'], tags: ['serology'] }
  ],
  plan_phrases: [
    { text: 'urgent 2-week wait referral to head and neck MDT', search: ['2WW'], tags: ['referral'] },
    { text: 'differential: metastatic SCC, lymphoma, thyroid, salivary, branchial cyst', search: ['differential'], tags: ['diagnosis'] },
    { text: 'patient counselled on possible cancer concern', search: ['counselled'], tags: ['advice'] },
    { text: 'smoking cessation advice and referral', search: ['smoking'], tags: ['advice'] },
    { text: 'alcohol moderation advice', search: ['alcohol'], tags: ['advice'] },
    { text: 'NICE NG12 head and neck cancer suspected pathway', search: ['NICE'], tags: ['guideline'] },
    { text: 'no biopsy in primary care (refer to specialist for FNAC)', search: ['no biopsy'], tags: ['safety'] },
    { text: 'GP letter sent same day', search: ['letter'], tags: ['communication'] },
    { text: 'patient given written information on referral pathway', search: ['written'], tags: ['advice'] },
    { text: 'safety-netting: report change in lump or new symptoms', search: ['safety-net'], tags: ['advice'] },
    { text: 'thyroid lump: triple assessment (USS, FNAC, TFT) if relevant', search: ['thyroid'], tags: ['differential'] }
  ],
  follow_up: [
    { text: 'seen in MDT clinic within 14 days', search: ['MDT'], tags: ['urgent'] },
    { text: 'review with imaging and cytology results', search: ['imaging'], tags: ['routine'] },
    { text: 'urgent review if airway compromise or stridor', search: ['airway'], tags: ['safetynet'] },
    { text: 'attend ED if sudden swelling or breathing difficulty', search: ['ED'], tags: ['safetynet'] },
    { text: 'GP review in 1 week to ensure referral received', search: ['GP'], tags: ['communication'] }
  ]
});

// ─── derm-melanoma-2ww ──────────────────────────────────────

const melanomaChips = buildWorkflowChips('derm-melanoma-2ww', {
  symptoms: [
    { text: 'pigmented lesion on left calf noticed 3 months ago', search: ['pigmented'], tags: ['presenting'] },
    { text: 'lesion has changed in size', search: ['size'], tags: ['ABCDE'] },
    { text: 'lesion has changed in shape', search: ['shape'], tags: ['ABCDE'] },
    { text: 'lesion has changed in colour', search: ['colour'], tags: ['ABCDE'] },
    { text: 'occasional itching of lesion', search: ['itching'], tags: ['symptom'] },
    { text: 'no bleeding from lesion', search: ['no'], tags: ['symptom'] },
    { text: 'no ulceration', search: ['no'], tags: ['symptom'] },
    { text: 'no inflammation around lesion', search: ['no'], tags: ['symptom'] },
    { text: 'previous moderate sun exposure, occasional sunburn', search: ['sun'], tags: ['risk factor'] },
    { text: 'fair skin (Fitzpatrick II)', search: ['Fitzpatrick'], tags: ['risk factor'] },
    { text: 'family history of melanoma in mother', search: ['family'], tags: ['risk factor'] },
    { text: 'no personal history of skin cancer', search: ['no'], tags: ['history'] },
    { text: 'multiple atypical naevi noted previously', search: ['atypical'], tags: ['risk factor'] },
    { text: 'age 47 years', search: ['age'], tags: ['demographics'] },
    { text: 'no immunosuppression', search: ['no'], tags: ['history'] }
  ],
  relevant_negatives: [
    { text: 'no other concerning lesions identified', search: ['no'], tags: ['differential'] },
    { text: 'no lymph node enlargement', search: ['no'], tags: ['examination'] },
    { text: 'no constitutional symptoms', search: ['no'], tags: ['systemic'] },
    { text: 'no recent rapid lesion enlargement', search: ['no'], tags: ['differential'] },
    { text: 'no satellite lesions', search: ['no'], tags: ['examination'] },
    { text: 'no chronic non-healing wound', search: ['no'], tags: ['differential'] },
    { text: 'no previous excision biopsy', search: ['no'], tags: ['history'] },
    { text: 'no immunosuppressive medications', search: ['no'], tags: ['history'] }
  ],
  exam_findings: [
    { text: 'pigmented lesion left calf, 9mm diameter', search: ['lesion'], tags: ['size'] },
    { text: 'A: asymmetry present (left vs right halves differ)', search: ['asymmetry'], tags: ['ABCDE'] },
    { text: 'B: irregular border with notching', search: ['border'], tags: ['ABCDE'] },
    { text: 'C: variegated colour (brown, black, areas of regression)', search: ['colour'], tags: ['ABCDE'] },
    { text: 'D: diameter >7mm', search: ['diameter'], tags: ['ABCDE'] },
    { text: 'E: evolving over 3 months', search: ['evolving'], tags: ['ABCDE'] },
    { text: 'weighted 7-point checklist score: 5 (>3 = refer)', search: ['7-point'], tags: ['scoring'] },
    { text: 'major features: change in size, shape, colour', search: ['major'], tags: ['7-point'] },
    { text: 'minor features: diameter >7mm, inflammation', search: ['minor'], tags: ['7-point'] },
    { text: 'dermoscopy: atypical pigment network, blue-white veil, irregular streaks', search: ['dermoscopy'], tags: ['examination'] },
    { text: 'Glasgow 7-point: change in sensation absent', search: ['Glasgow'], tags: ['scoring'] },
    { text: 'no satellite lesions surrounding', search: ['no'], tags: ['examination'] },
    { text: 'no inguinal lymphadenopathy', search: ['inguinal'], tags: ['examination'] },
    { text: 'full skin examination: no other suspicious lesions', search: ['skin'], tags: ['examination'] },
    { text: 'lesion photograph taken with measuring scale', search: ['photograph'], tags: ['documentation'] }
  ],
  red_flags: [
    { text: 'weighted 7-point checklist ≥3 (refer urgent)', search: ['7-point'], tags: ['referral criteria'] },
    { text: 'change in size, shape or colour of pigmented lesion', search: ['change'], tags: ['ABCDE'] },
    { text: 'new pigmented lesion in adult', search: ['new'], tags: ['ABCDE'] },
    { text: 'bleeding or ulceration of pigmented lesion', search: ['bleeding'], tags: ['ABCDE'] },
    { text: 'lesion with diameter >7mm and changing', search: ['7mm'], tags: ['ABCDE'] },
    { text: 'inflammation or change in sensation', search: ['inflammation'], tags: ['ABCDE'] },
    { text: 'satellite lesions or in-transit metastases', search: ['satellite'], tags: ['advanced'] },
    { text: 'palpable regional lymph nodes', search: ['nodes'], tags: ['advanced'] },
    { text: 'subungual pigmentation Hutchinson sign', search: ['Hutchinson'], tags: ['ABCDE'] },
    { text: 'amelanotic lesion with bleeding or ulceration', search: ['amelanotic'], tags: ['atypical'] }
  ],
  investigations: [
    { text: 'dermoscopy performed and documented', search: ['dermoscopy'], tags: ['imaging'] },
    { text: 'clinical photography with measuring scale', search: ['photography'], tags: ['imaging'] },
    { text: 'no incisional biopsy in primary care', search: ['no'], tags: ['safety'] },
    { text: 'no shave biopsy of pigmented lesion', search: ['no'], tags: ['safety'] },
    { text: 'excisional biopsy at pigmented lesion clinic', search: ['excisional'], tags: ['biopsy'] },
    { text: 'sentinel lymph node biopsy considered if Breslow >0.8mm', search: ['sentinel'], tags: ['staging'] },
    { text: 'staging CT and LDH if confirmed melanoma', search: ['staging'], tags: ['advanced'] }
  ],
  plan_phrases: [
    { text: 'urgent 2-week wait referral to pigmented lesion clinic', search: ['2WW'], tags: ['referral'] },
    { text: 'NICE NG12 suspected cancer pathway', search: ['NICE'], tags: ['guideline'] },
    { text: 'patient counselled on melanoma concern and need for urgent excision', search: ['counselled'], tags: ['advice'] },
    { text: 'no excision in primary care (preserve full thickness for histology)', search: ['no'], tags: ['safety'] },
    { text: 'sun protection advice: SPF 50, hat, avoid midday sun', search: ['sun'], tags: ['advice'] },
    { text: 'self-skin examination monthly with mirror', search: ['self-skin'], tags: ['advice'] },
    { text: 'photograph of lesion with date for monitoring', search: ['photograph'], tags: ['documentation'] },
    { text: 'all naevi >5mm or atypical to be reviewed at clinic', search: ['naevi'], tags: ['plan'] },
    { text: 'first-degree relatives advised on skin checks', search: ['relatives'], tags: ['advice'] },
    { text: 'GP letter and clinical photograph sent', search: ['letter'], tags: ['communication'] },
    { text: 'safety-netting: return if rapid change or bleeding', search: ['safety-net'], tags: ['advice'] },
    { text: 'differential: dysplastic naevus, seborrhoeic keratosis, BCC pigmented variant', search: ['differential'], tags: ['diagnosis'] }
  ],
  follow_up: [
    { text: 'seen at pigmented lesion clinic within 14 days', search: ['14 days'], tags: ['urgent'] },
    { text: 'review excision histology when available', search: ['histology'], tags: ['routine'] },
    { text: 'Breslow thickness, ulceration and margins to be reported', search: ['Breslow'], tags: ['routine'] },
    { text: 'attend earlier if sudden bleeding or rapid change', search: ['return'], tags: ['safetynet'] },
    { text: 'GP follow-up after histology to plan surveillance', search: ['GP'], tags: ['routine'] }
  ]
});

// ─── emergency-anaphylaxis ──────────────────────────────────

const anaphylaxisChips = buildWorkflowChips('emergency-anaphylaxis', {
  symptoms: [
    { text: 'sudden onset whole-body urticaria 15 minutes after peanut exposure', search: ['urticaria'], tags: ['skin'] },
    { text: 'lip and tongue swelling', search: ['swelling'], tags: ['mucosa'] },
    { text: 'throat tightness, "lump in throat"', search: ['throat'], tags: ['airway'] },
    { text: 'stridor on inspiration', search: ['stridor'], tags: ['airway'] },
    { text: 'wheeze and shortness of breath', search: ['wheeze'], tags: ['breathing'] },
    { text: 'voice change, hoarse', search: ['voice'], tags: ['airway'] },
    { text: 'feeling faint, dizzy on standing', search: ['dizzy'], tags: ['circulation'] },
    { text: 'palpitations', search: ['palpitations'], tags: ['circulation'] },
    { text: 'sense of impending doom', search: ['doom'], tags: ['general'] },
    { text: 'abdominal cramping and vomiting', search: ['abdominal'], tags: ['GI'] },
    { text: 'known peanut allergy since age 5', search: ['known'], tags: ['history'] },
    { text: 'previous mild reaction with skin only', search: ['previous'], tags: ['history'] },
    { text: 'no current EpiPen prescribed', search: ['no'], tags: ['history'] },
    { text: 'asthma diagnosed, on inhaled corticosteroid', search: ['asthma'], tags: ['comorbid'] },
    { text: 'symptoms started within 30 minutes of exposure', search: ['minutes'], tags: ['timing'] }
  ],
  relevant_negatives: [
    { text: 'no loss of consciousness', search: ['no'], tags: ['severity'] },
    { text: 'no chest pain', search: ['no'], tags: ['differential'] },
    { text: 'no central cyanosis', search: ['no'], tags: ['severity'] },
    { text: 'no recurrence of symptoms', search: ['no'], tags: ['biphasic'] },
    { text: 'no underlying cardiac disease', search: ['no'], tags: ['comorbid'] },
    { text: 'not on beta-blockers (would limit adrenaline)', search: ['no'], tags: ['medication'] },
    { text: 'not pregnant', search: ['no'], tags: ['comorbid'] }
  ],
  exam_findings: [
    { text: 'A: airway patent, mild laryngeal oedema, voice hoarse', search: ['airway'], tags: ['ABCDE'] },
    { text: 'B: RR 26, SpO2 94% RA, expiratory wheeze bilaterally', search: ['breathing'], tags: ['ABCDE'] },
    { text: 'C: HR 122 sinus, BP 88/56, CRT 3 seconds', search: ['circulation'], tags: ['ABCDE'] },
    { text: 'D: GCS 15, alert', search: ['disability'], tags: ['ABCDE'] },
    { text: 'E: widespread urticaria over trunk and limbs', search: ['exposure'], tags: ['ABCDE'] },
    { text: 'lip swelling and angio-oedema visible', search: ['angio-oedema'], tags: ['mucosa'] },
    { text: 'tongue swollen but airway not occluded', search: ['tongue'], tags: ['airway'] },
    { text: 'no facial cyanosis', search: ['no'], tags: ['airway'] },
    { text: 'peripheries warm and well perfused after fluid', search: ['perfusion'], tags: ['circulation'] },
    { text: 'NEWS2 score 7 on arrival', search: ['NEWS2'], tags: ['scoring'] },
    { text: 'meets Sampson clinical criteria for anaphylaxis (skin + respiratory + GI)', search: ['Sampson'], tags: ['diagnosis'] },
    { text: 'Resuscitation Council UK criteria met (sudden onset, A/B/C compromise, skin involvement)', search: ['Resus'], tags: ['diagnosis'] }
  ],
  red_flags: [
    { text: 'airway compromise: stridor, hoarseness, tongue swelling', search: ['airway'], tags: ['urgent'] },
    { text: 'breathing compromise: severe wheeze, persistent SpO2 <94%', search: ['breathing'], tags: ['urgent'] },
    { text: 'circulatory compromise: BP <90 systolic, syncope', search: ['shock'], tags: ['urgent'] },
    { text: 'cardiac arrest', search: ['arrest'], tags: ['urgent'] },
    { text: 'persistent symptoms despite adrenaline', search: ['persistent'], tags: ['refractory'] },
    { text: 'biphasic reaction risk: severe initial reaction, asthma, delayed adrenaline', search: ['biphasic'], tags: ['risk'] },
    { text: 'recurrence of symptoms within 72 hours (biphasic)', search: ['recurrence'], tags: ['biphasic'] },
    { text: 'asthmatic with respiratory symptoms (higher mortality)', search: ['asthma'], tags: ['risk'] },
    { text: 'beta-blocker user with refractory hypotension (consider glucagon)', search: ['beta-blocker'], tags: ['refractory'] }
  ],
  investigations: [
    { text: 'ECG: sinus tachycardia, no ischaemic changes', search: ['ECG'], tags: ['monitoring'] },
    { text: 'continuous SpO2 and BP monitoring', search: ['monitoring'], tags: ['observation'] },
    { text: 'mast cell tryptase: sample 1 immediately, sample 2 at 1-2 hours, sample 3 at 24 hours', search: ['tryptase'], tags: ['bloods'] },
    { text: 'FBC, U&E, glucose', search: ['FBC'], tags: ['bloods'] },
    { text: 'venous blood gas: lactate 2.4, pH 7.34', search: ['gas'], tags: ['bloods'] },
    { text: 'troponin if chest pain (Kounis syndrome consideration)', search: ['troponin'], tags: ['cardiac'] },
    { text: 'CXR: no pulmonary oedema', search: ['CXR'], tags: ['imaging'] }
  ],
  plan_phrases: [
    { text: 'IM adrenaline given to anterolateral mid-thigh (clinician dose for weight)', search: ['adrenaline'], tags: ['medication'] },
    { text: 'high-flow oxygen via non-rebreathe mask', search: ['oxygen'], tags: ['airway'] },
    { text: 'patient laid flat with legs elevated', search: ['flat'], tags: ['position'] },
    { text: 'large-bore IV access bilaterally', search: ['IV'], tags: ['procedure'] },
    { text: 'IV fluid bolus given for hypotension', search: ['fluid'], tags: ['circulation'] },
    { text: 'second dose IM adrenaline at 5 minutes if no improvement', search: ['second'], tags: ['medication'] },
    { text: 'nebulised salbutamol for bronchospasm', search: ['salbutamol'], tags: ['medication'] },
    { text: 'nebulised adrenaline for stridor (clinician decision)', search: ['nebulised'], tags: ['medication'] },
    { text: 'IM or IV antihistamine after stabilisation', search: ['antihistamine'], tags: ['medication'] },
    { text: 'corticosteroid given (clinician decision)', search: ['corticosteroid'], tags: ['medication'] },
    { text: 'allergen identified and avoided', search: ['allergen'], tags: ['plan'] },
    { text: 'two adrenaline auto-injectors prescribed on discharge', search: ['EpiPen'], tags: ['discharge'] },
    { text: 'auto-injector training given to patient and family', search: ['training'], tags: ['advice'] },
    { text: 'written anaphylaxis emergency action plan provided', search: ['plan'], tags: ['advice'] },
    { text: 'allergy clinic referral for confirmatory testing', search: ['allergy'], tags: ['referral'] },
    { text: 'Resuscitation Council UK 2021 anaphylaxis algorithm followed', search: ['Resus'], tags: ['guideline'] }
  ],
  follow_up: [
    { text: 'observation minimum 6 hours after symptom resolution', search: ['observation'], tags: ['biphasic'] },
    { text: 'observation 12 hours if asthmatic, severe reaction or biphasic risk', search: ['12 hours'], tags: ['biphasic'] },
    { text: 'allergy clinic referral within 4-6 weeks', search: ['allergy'], tags: ['referral'] },
    { text: 'GP review within 1 week to ensure auto-injector training', search: ['GP'], tags: ['routine'] },
    { text: 'return immediately if recurrence of symptoms', search: ['return'], tags: ['safetynet'] },
    { text: '999 if any suspicion of recurrence', search: ['999'], tags: ['safetynet'] }
  ]
});

// ─── Build clinical_workflows.json entries ──────────────────

const newClinicalWorkflows = {
  'peds-fever-infant': {
    workflow_id: 'peds-fever-infant',
    specialty_id: 'Pediatrics',
    chief_complaint: 'Fever in infant',
    chief_complaint_aliases: ['febrile infant', 'neonatal fever', 'infant fever'],
    diagnosis: 'Fever under 3 months',
    diagnosis_aliases: ['neonatal fever', 'infant pyrexia'],
    history_layout_id: 'Pediatrics',
    filters: { age_min_months: 0, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'R50.9', icd_label: 'Fever', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'peds-fever-child': {
    workflow_id: 'peds-fever-child',
    specialty_id: 'Pediatrics',
    chief_complaint: 'Fever in child',
    chief_complaint_aliases: ['febrile child', 'paediatric fever', 'child fever'],
    diagnosis: 'Viral fever',
    diagnosis_aliases: ['paediatric fever', 'viral illness'],
    history_layout_id: 'Pediatrics',
    filters: { age_min_months: 3, age_max_years: 5, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'R50.9', icd_label: 'Fever', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'ophth-diabetic-retinopathy-screening': {
    workflow_id: 'ophth-diabetic-retinopathy-screening',
    specialty_id: 'Ophthalmology',
    chief_complaint: 'Diabetic eye screening',
    chief_complaint_aliases: ['DESP', 'diabetic retinopathy screening'],
    diagnosis: 'Diabetic retinopathy review',
    diagnosis_aliases: ['DR screening', 'retinopathy grading'],
    history_layout_id: 'Ophthalmology',
    filters: { age_min_months: null, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'E11.319', icd_label: 'Type 2 diabetes mellitus with unspecified diabetic retinopathy', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'psych-adhd-assessment': {
    workflow_id: 'psych-adhd-assessment',
    specialty_id: 'Psychiatry / Mental Health',
    chief_complaint: 'ADHD assessment',
    chief_complaint_aliases: ['attention deficit', 'hyperactivity assessment'],
    diagnosis: 'ADHD',
    diagnosis_aliases: ['attention deficit hyperactivity disorder', 'hyperkinetic disorder'],
    history_layout_id: 'Psychiatry / Mental Health',
    filters: { age_min_months: null, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'F90.2', icd_label: 'Attention-deficit hyperactivity disorder, combined type', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'ent-neck-lump': {
    workflow_id: 'ent-neck-lump',
    specialty_id: 'ENT',
    chief_complaint: 'Neck lump',
    chief_complaint_aliases: ['cervical mass', 'neck mass', 'lymphadenopathy'],
    diagnosis: 'Neck lump for investigation',
    diagnosis_aliases: ['suspected head and neck cancer', 'cervical lymphadenopathy'],
    history_layout_id: 'ENT',
    filters: { age_min_months: null, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'R22.1', icd_label: 'Localized swelling, mass and lump, neck', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'derm-melanoma-2ww': {
    workflow_id: 'derm-melanoma-2ww',
    specialty_id: 'Dermatology',
    chief_complaint: 'Suspicious pigmented lesion',
    chief_complaint_aliases: ['mole change', 'changing naevus', 'suspected melanoma'],
    diagnosis: 'Suspected melanoma',
    diagnosis_aliases: ['pigmented lesion 2WW', 'suspicious mole'],
    history_layout_id: 'Dermatology',
    filters: { age_min_months: null, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'D48.5', icd_label: 'Neoplasm of uncertain behavior of skin', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  },
  'emergency-anaphylaxis': {
    workflow_id: 'emergency-anaphylaxis',
    specialty_id: 'Emergency / Urgent Care',
    chief_complaint: 'Anaphylaxis',
    chief_complaint_aliases: ['severe allergic reaction', 'anaphylactic shock'],
    diagnosis: 'Anaphylaxis',
    diagnosis_aliases: ['anaphylactic reaction', 'severe allergy'],
    history_layout_id: 'General Medicine / GP',
    filters: { age_min_months: null, age_max_years: null, sex: null },
    icd_metadata: { icd_system: 'ICD-10-CM', icd_code: 'T78.2XXA', icd_label: 'Anaphylactic shock, unspecified, initial encounter', icd_verified: false, icd_source: null },
    chip_groups: CHIP_GROUPS_FULL,
    min_sections: ['hpi']
  }
};

module.exports = {
  newClinicalWorkflows,
  newChipsByWorkflow: {
    'peds-fever-infant': infantChips,
    'peds-fever-child': childChips,
    'ophth-diabetic-retinopathy-screening': dmRetinopathyChips,
    'psych-adhd-assessment': adhdChips,
    'ent-neck-lump': neckLumpChips,
    'derm-melanoma-2ww': melanomaChips,
    'emergency-anaphylaxis': anaphylaxisChips
  }
};

if (require.main === module) {
  for (const [wfId, chips] of Object.entries(module.exports.newChipsByWorkflow)) {
    const groupCounts = {};
    for (const c of chips) {
      groupCounts[c.group] = (groupCounts[c.group] || 0) + 1;
    }
    console.log(`${wfId}: ${chips.length} chips`, JSON.stringify(groupCounts));
  }
}
