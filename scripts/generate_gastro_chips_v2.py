#!/usr/bin/env python3
"""Generate Gastroenterology chips matching V5A-2D exact specification."""
import csv, os

OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_gastroenterology.csv')

def chip(wf, group, text, order, search="", tags="gastroenterology"):
    return {
        "workflow_id": wf,
        "specialty_id": "Gastroenterology",
        "chip_id": f"{wf}-{group}-{order}",
        "group": group,
        "chip_text": text,
        "order": str(order),
        "search_terms": search,
        "tags": tags,
    }

rows = []

# ═══ A. gastro-gerd ═══
wf = "gastro-gerd"
for i, (t, s) in enumerate([
    ("reflux symptoms", "reflux, GERD, acid"),
    ("heartburn", "heartburn, burning"),
    ("regurgitation", "regurgitation"),
    ("epigastric discomfort", "epigastric, discomfort, pain"),
    ("post-prandial symptoms documented", "postprandial, after, meals"),
    ("nocturnal symptoms reviewed", "nocturnal, night, lying"),
    ("trigger foods reviewed", "trigger, food, spicy, fatty"),
    ("medication use reviewed", "medication, PPI, antacid"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no dysphagia reported", "dysphagia, swallowing"),
    ("no odynophagia reported", "odynophagia, painful, swallowing"),
    ("no weight loss reported", "weight, loss"),
    ("no vomiting blood reported", "vomiting, blood, hematemesis"),
    ("no black stools reported", "black, stools, melena"),
    ("no persistent vomiting reported", "persistent, vomiting"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("epigastric tenderness documented if assessed", "epigastric, tenderness"),
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("general appearance documented if assessed", "appearance, well"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("dysphagia", "dysphagia, swallowing"),
    ("odynophagia", "odynophagia, painful, swallowing"),
    ("unintentional weight loss", "weight, loss"),
    ("gastrointestinal bleeding symptoms", "GI, bleeding, hematemesis, melena"),
    ("persistent vomiting", "vomiting, persistent"),
    ("anaemia if documented", "anaemia, anemia, IDA, iron"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("previous endoscopy report reviewed if available", "endoscopy, OGD, EGD"),
    ("H. pylori result reviewed if available", "H. pylori, HP, breath, test"),
    ("blood tests reviewed if ordered", "blood, FBC, iron"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle advice documented if discussed", "lifestyle, diet, weight"),
    ("medication plan documented if clinician decided", "medication, PPI, antacid"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, OGD"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks", "six, eight, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ B. gastro-abdominal-pain ═══
wf = "gastro-abdominal-pain"
for i, (t, s) in enumerate([
    ("abdominal pain", "abdominal, pain, stomach ache"),
    ("location documented", "location, site, quadrant"),
    ("duration documented", "duration, how long"),
    ("character documented", "character, colicky, sharp, dull"),
    ("radiation reviewed", "radiation, referred"),
    ("relation to meals and bowels reviewed", "meals, food, bowel, motion"),
    ("nausea and vomiting reviewed", "nausea, vomiting"),
    ("bowel habit reviewed", "bowel, habit, stool"),
    ("urinary symptoms reviewed", "urinary, dysuria, frequency"),
    ("fever reviewed", "fever, temperature"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no GI bleeding reported", "GI, bleeding, hematemesis, melena"),
    ("no persistent vomiting reported", "vomiting, persistent"),
    ("no severe worsening pain reported", "severe, worsening, pain"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal tenderness documented if assessed", "tenderness, palpation"),
    ("guarding or rebound documented if assessed", "guarding, rebound, peritonism"),
    ("bowel sounds documented if assessed", "bowel, sounds"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("peritoneal signs if assessed", "peritoneal, guarding, rebound, rigidity"),
    ("GI bleeding", "haematemesis, melena, bleeding"),
    ("unexplained weight loss", "weight, loss"),
    ("jaundice", "jaundice, icterus"),
    ("abdominal mass", "mass, palpable"),
    ("fever with abdominal pain", "fever, sepsis"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("urinalysis reviewed if performed", "urinalysis, urine, dipstick"),
    ("blood tests reviewed if ordered", "blood, FBC, LFT, CRP"),
    ("imaging reviewed if available", "ultrasound, CT, X-ray"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, surgery"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ C. gastro-ibs-symptoms ═══
wf = "gastro-ibs-symptoms"
for i, (t, s) in enumerate([
    ("IBS symptoms", "IBS, irritable, bowel"),
    ("abdominal pain or discomfort reviewed", "abdominal, pain, discomfort, cramping"),
    ("bloating reviewed", "bloating, distension"),
    ("bowel habit pattern documented", "bowel, habit, alternating"),
    ("diarrhoea and constipation pattern reviewed", "diarrhoea, diarrhea, constipation"),
    ("symptom relation to stress or food reviewed", "stress, food, trigger"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no rectal bleeding reported", "rectal, bleeding, PR"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no nocturnal diarrhea reported", "nocturnal, night, diarrhea"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("abdominal tenderness documented if assessed", "tenderness"),
    ("general appearance documented if assessed", "appearance"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("rectal bleeding", "rectal, bleeding"),
    ("unexplained weight loss", "weight, loss"),
    ("nocturnal symptoms", "nocturnal, night"),
    ("family history of colorectal cancer", "family, history, CRC"),
    ("onset after age 50", "age, older, new onset"),
    ("iron deficiency anaemia", "anaemia, IDA"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("blood tests reviewed if ordered", "blood, FBC, CRP, coeliac"),
    ("stool tests reviewed if ordered", "stool, calprotectin, culture"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle and diet advice documented if discussed", "lifestyle, diet, FODMAP"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, dietetics"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("6-8 weeks", "six, eight, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ D. gastro-constipation ═══
wf = "gastro-constipation"
for i, (t, s) in enumerate([
    ("constipation", "constipation"),
    ("duration documented", "duration, how long"),
    ("stool frequency documented", "frequency, how often, bowel"),
    ("stool consistency documented", "consistency, Bristol, hard"),
    ("straining reviewed", "straining, difficulty"),
    ("incomplete emptying reviewed", "incomplete, evacuation"),
    ("diet and fluid context reviewed", "diet, fibre, fluid, water"),
    ("medication history reviewed if relevant", "medication, laxative, opioid"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no rectal bleeding reported", "rectal, bleeding"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no severe abdominal pain reported", "severe, abdominal, pain"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("rectal examination documented if clinically appropriate and assessed", "rectal, PR, DRE"),
    ("abdominal distension documented if assessed", "distension, bloating"),
    ("general appearance documented if assessed", "appearance"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("new onset after age 50", "new, onset, age"),
    ("rectal bleeding with constipation", "bleeding, PR"),
    ("unexplained weight loss", "weight, loss"),
    ("family history of colorectal cancer", "family, CRC"),
    ("acute abdominal distension", "acute, distension, obstruction"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("blood tests reviewed if ordered", "blood, FBC, TFT, calcium"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, laxative"),
    ("lifestyle and dietary advice documented if discussed", "diet, fibre, fluid"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ E. gastro-diarrhea ═══
wf = "gastro-diarrhea"
for i, (t, s) in enumerate([
    ("diarrhoea", "diarrhoea, diarrhea, loose stools"),
    ("duration documented", "duration, acute, chronic"),
    ("stool frequency documented", "frequency, how often"),
    ("stool consistency documented", "consistency, watery, Bristol"),
    ("blood or mucus reviewed", "blood, mucus, slime"),
    ("fever reviewed", "fever, temperature"),
    ("vomiting reviewed", "vomiting"),
    ("travel or food exposure reviewed", "travel, food, poisoning, foreign"),
    ("hydration context reviewed", "hydration, drinking, output"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no blood in stool reported", "blood, in, stool"),
    ("no severe dehydration symptoms reported", "severe, dehydration, dry, dizzy"),
    ("no persistent high fever reported", "persistent, high, fever"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("hydration documented if assessed", "hydration, mucous, turgor, skin"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("bloody diarrhoea", "bloody, dysentery"),
    ("severe dehydration", "dehydration, dry"),
    ("persistent diarrhoea over 6 weeks", "persistent, chronic"),
    ("unexplained weight loss", "weight, loss"),
    ("nocturnal symptoms", "nocturnal, night"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("stool tests reviewed if ordered", "stool, culture, MC+S"),
    ("blood tests reviewed if ordered", "blood, FBC, CRP, U+E"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ F. gastro-rectal-bleeding ═══
wf = "gastro-rectal-bleeding"
for i, (t, s) in enumerate([
    ("rectal bleeding", "rectal, bleeding, PR, blood"),
    ("bleeding colour documented", "colour, bright, dark, red"),
    ("amount and frequency documented", "amount, frequency, volume"),
    ("relation to stool documented", "relation, on, paper, mixed"),
    ("pain on defecation reviewed", "pain, defecation, anal"),
    ("change in bowel habit reviewed", "change, bowel, habit"),
    ("weight loss reviewed", "weight, loss"),
    ("anticoagulant use reviewed if relevant", "anticoagulant, aspirin, warfarin, DOAC"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no dizziness or syncope reported if applicable", "dizziness, syncope, faint"),
    ("no black stools reported if applicable", "black, tarry, melena"),
    ("no significant unintentional weight loss reported if applicable", "weight, loss"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("rectal examination documented if clinically appropriate and assessed", "rectal, PR, DRE"),
    ("vitals documented if measured", "vitals, BP, pulse"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("haemodynamic instability if assessed", "haemodynamic, low, BP, tachy"),
    ("significant or persistent bleeding", "persistent, significant"),
    ("weight loss with rectal bleeding", "weight, loss"),
    ("family history of colorectal cancer", "family, CRC"),
    ("age over 50 with new bleeding", "age, new, over 50"),
    ("change in bowel habit with bleeding", "change, bowel, habit"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("CBC reviewed if ordered", "CBC, FBC, Hb, haemoglobin"),
    ("previous colonoscopy or endoscopy report reviewed if available", "colonoscopy, OGD, scope"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, colonoscopy"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ G. gastro-liver-enzyme-review ═══
wf = "gastro-liver-enzyme-review"
for i, (t, s) in enumerate([
    ("liver enzyme review", "LFT, liver, enzymes"),
    ("result type documented", "AST, ALT, ALP, GGT, type"),
    ("trend and comparison reviewed", "trend, comparison, previous"),
    ("alcohol history reviewed", "alcohol, drinking"),
    ("medication and supplement history reviewed", "medication, statin, paracetamol, supplement"),
    ("viral hepatitis risk context reviewed if relevant", "hepatitis, B, C, viral"),
    ("abdominal pain, jaundice and pruritus reviewed", "pain, jaundice, itching, RUQ"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no jaundice reported", "jaundice, yellow, icterus"),
    ("no dark urine or pale stool reported", "dark, urine, pale, stool"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("hepatomegaly documented if assessed", "hepatomegaly, liver, enlarged"),
    ("signs of chronic liver disease documented if assessed", "spider, naevi, palmar, erythema"),
    ("general appearance documented if assessed", "appearance, jaundice"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("significant transaminitis", "transaminitis, high, ALT, AST"),
    ("obstructive LFT pattern", "obstructive, ALP, GGT"),
    ("jaundice", "jaundice, icterus"),
    ("signs of decompensated liver disease", "ascites, encephalopathy, varices"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("liver function tests reviewed", "LFT, AST, ALT, ALP, GGT"),
    ("previous results compared if available", "previous, comparison, trend"),
    ("ultrasound report reviewed if available", "ultrasound, liver, US"),
    ("viral hepatitis serology reviewed if ordered", "hepatitis, B, C, serology"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("follow-up testing documented if arranged by clinician", "follow-up, repeat, LFT, interval"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, hepatology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("3 months", "three, months"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ H. gastro-jaundice-documentation ═══
wf = "gastro-jaundice-documentation"
for i, (t, s) in enumerate([
    ("jaundice", "jaundice, icterus, yellow"),
    ("duration documented", "duration, how long"),
    ("dark urine reviewed", "dark, urine, tea, coloured"),
    ("pale stool reviewed", "pale, stool, clay, coloured"),
    ("pruritus reviewed", "pruritus, itching"),
    ("abdominal pain reviewed", "pain, RUQ"),
    ("fever reviewed", "fever, temperature"),
    ("weight loss reviewed", "weight, loss"),
    ("medication and alcohol history reviewed", "medication, alcohol, drugs"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no significant abdominal trauma reported if applicable", "trauma, injury"),
    ("no known hepatitis exposure reported if applicable", "hepatitis, exposure"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("scleral icterus documented if assessed", "scleral, icterus, eyes"),
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("hepatomegaly documented if assessed", "hepatomegaly, liver"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("rapidly rising bilirubin", "rapid, rising, bilirubin"),
    ("signs of liver failure if assessed", "liver, failure, ascites, encephalopathy"),
    ("fever with jaundice", "fever, cholangitis"),
    ("right upper quadrant tenderness", "RUQ, tenderness"),
    ("unexplained weight loss", "weight, loss"),
    ("palpable gallbladder", "gallbladder, palpable, Courvoisier"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("liver function tests reviewed if ordered", "LFT, ALT, AST, ALP"),
    ("bilirubin reviewed if ordered", "bilirubin, direct, indirect"),
    ("ultrasound or imaging reviewed if available", "ultrasound, CT, MRCP"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, hepatology"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("1-2 weeks", "one, two, weeks"),
    ("2-4 weeks", "two, four, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ I. gastro-dysphagia ═══
wf = "gastro-dysphagia"
for i, (t, s) in enumerate([
    ("dysphagia", "dysphagia, swallowing, difficulty"),
    ("duration documented", "duration, how long"),
    ("solids versus liquids context documented", "solids, liquids, both"),
    ("progression reviewed", "progressive, worsening"),
    ("odynophagia reviewed", "odynophagia, painful, swallowing"),
    ("reflux symptoms reviewed", "reflux, heartburn, GERD"),
    ("weight loss reviewed", "weight, loss"),
    ("regurgitation reviewed", "regurgitation, food, back"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no weight loss reported if applicable", "weight, loss"),
    ("no vomiting blood reported", "hematemesis, blood, vomit"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("general examination documented if assessed", "general, appearance, nutrition"),
    ("oral and throat examination documented if assessed", "oral, throat, mouth"),
    ("vitals documented if measured", "vitals, BP, pulse"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("rapidly progressive dysphagia", "rapid, progressive"),
    ("weight loss with dysphagia", "weight, loss"),
    ("odynophagia", "odynophagia, painful"),
    ("age over 50 with new dysphagia", "age, new, onset"),
    ("hoarseness or cervical lymphadenopathy", "hoarseness, lymph, node"),
    ("relevant GI family history", "family, GI, oesophageal"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("previous endoscopy report reviewed if available", "OGD, EGD, endoscopy"),
    ("blood tests reviewed if ordered", "blood, FBC, iron"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology, OGD"),
    ("follow-up documented if arranged", "follow, up"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("2-4 weeks", "two, four, weeks"),
    ("4-6 weeks", "four, six, weeks"),
    ("sooner if worsening", "sooner, worsening"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ═══ J. gastro-post-endoscopy-followup ═══
wf = "gastro-post-endoscopy-followup"
for i, (t, s) in enumerate([
    ("post-endoscopy follow-up", "post, endoscopy, followup"),
    ("procedure type documented", "procedure, OGD, colonoscopy, type"),
    ("indication reviewed", "indication, reason, scope"),
    ("findings reviewed if available", "findings, result, scope"),
    ("symptoms after procedure reviewed", "symptoms, recovery, after"),
    ("medication and advice review documented if relevant", "medication, PPI, change, advice"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no post-procedure bleeding reported", "bleeding, post, scope"),
    ("no severe abdominal pain reported", "severe, abdominal, pain"),
    ("no fever reported", "fever, temperature"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
    ("general appearance documented if assessed", "appearance"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("significant post-procedure bleeding", "post, bleeding, scope"),
    ("unexplained abdominal pain after procedure", "pain, after, scope"),
    ("perforation signs if suspected", "perforation, peritonitis, fever"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("endoscopy report reviewed", "endoscopy, OGD, colonoscopy, report"),
    ("histology or pathology reviewed if available", "histology, pathology, biopsy"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("follow-up plan documented if arranged", "follow-up, plan, interval"),
    ("referral documented if clinician decided", "referral, gastroenterology, follow-up"),
    ("safety-netting documented if discussed", "safety, netting"),
], 1): rows.append(chip(wf, "plan_phrases", t, i, s))

for i, (t, s) in enumerate([
    ("4-6 weeks", "four, six, weeks"),
    ("3-6 months", "three, six, months"),
    ("1 year if surveillance needed", "one, year, surveillance"),
    ("sooner if symptoms recur", "sooner, recurrence"),
    ("PRN", "PRN, as needed"),
], 1): rows.append(chip(wf, "follow_up", t, i, s))

# ── Write CSV ──
headers = ["workflow_id","specialty_id","chip_id","group","chip_text","order","search_terms","tags"]

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=headers)
    w.writeheader()
    w.writerows(rows)

print(f"Written {len(rows)} rows")

from collections import Counter
for wf_id, count in sorted(Counter(r["workflow_id"] for r in rows).items()):
    print(f"  {wf_id}: {count} chips")
print(f"Total: {len(rows)} chips")
