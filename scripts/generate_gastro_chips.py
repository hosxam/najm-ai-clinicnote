#!/usr/bin/env python3
"""Generate Gastroenterology chips CSV."""
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
    ("dysphagia or odynophagia", "dysphagia, odynophagia"),
    ("unexplained weight loss", "weight, loss"),
    ("gastrointestinal bleeding", "bleeding, hematemesis, melena"),
    ("persistent vomiting", "vomiting, persistent"),
    ("epigastric mass", "mass, epigastric"),
    ("iron deficiency anaemia", "anaemia, IDA"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("previous endoscopy report reviewed if available", "endoscopy, OGD, EGD"),
    ("previous imaging reviewed if available", "imaging, barium"),
    ("blood tests reviewed if ordered", "blood, FBC, iron"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle modification discussed if applicable", "lifestyle, diet, weight"),
    ("medication plan documented if clinician decided", "medication, PPI, antacid"),
    ("safety-netting documented if discussed", "safety, netting"),
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
    ("onset and duration documented", "onset, duration"),
    ("character documented", "character, colicky, sharp, dull"),
    ("severity documented", "severity, intensity"),
    ("radiation reviewed", "radiation, referred"),
    ("aggravating and relieving factors reviewed", "aggrevating, relieving, food"),
    ("associated nausea or vomiting reviewed", "nausea, vomiting"),
    ("bowel habit reviewed", "bowel, habit, stool"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no fever reported", "fever, temperature"),
    ("no vomiting blood reported", "hematemesis, blood"),
    ("no black stools reported", "melena, black, stool"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no jaundice reported", "jaundice, yellow"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam, palpation"),
    ("tenderness documented if assessed", "tenderness, guarding"),
    ("bowel sounds documented if assessed", "bowel, sounds"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
    ("general appearance documented if assessed", "appearance, distress"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("severe or worsening pain", "severe, worsening"),
    ("peritoneal signs if assessed", "peritoneal, guarding, rigidity"),
    ("haematemesis or melena", "hematemesis, melena, bleeding"),
    ("unexplained weight loss", "weight, loss"),
    ("jaundice", "jaundice, icterus"),
    ("abdominal mass", "mass, palpable"),
    ("fever with abdominal pain", "fever, infection"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("blood tests reviewed if ordered", "blood, FBC, LFT, CRP"),
    ("abdominal imaging reviewed if available", "ultrasound, CT, X-ray"),
    ("previous gastroenterology records reviewed if available", "previous, records"),
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

# ═══ C. gastro-ibs-symptoms ═══
wf = "gastro-ibs-symptoms"
for i, (t, s) in enumerate([
    ("IBS symptoms", "IBS, irritable, bowel"),
    ("abdominal pain reviewed", "abdominal, pain, cramping"),
    ("bloating reviewed", "bloating, distension"),
    ("bowel habit pattern documented", "bowel, habit, alternating"),
    ("constipation reviewed", "constipation"),
    ("diarrhoea reviewed", "diarrhoea, diarrhea"),
    ("urgency reviewed", "urgency, bowel"),
    ("straining reviewed", "straining, incomplete, evacuation"),
    ("symptom triggers reviewed", "trigger, food, stress"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no rectal bleeding reported", "rectal, bleeding, PR"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no nocturnal symptoms reported if applicable", "nocturnal, night"),
    ("no fever reported", "fever"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("abdominal tenderness documented if assessed", "tenderness"),
    ("general appearance documented if assessed", "appearance, well"),
    ("BMI documented if measured", "BMI, weight"),
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
    ("stool studies reviewed if ordered", "stool, calprotectin, culture"),
    ("previous gastroenterology records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle and dietary modification discussed if applicable", "lifestyle, diet, FODMAP"),
    ("medication plan documented if clinician decided", "medication, antispasmodic"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("referral documented if clinician decided", "referral, gastroenterology"),
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
    ("bowel frequency documented", "frequency, how often, bowel"),
    ("stool consistency documented", "consistency, Bristol, hard"),
    ("straining documented", "straining, difficulty"),
    ("sensation of incomplete evacuation reviewed", "incomplete, evacuation"),
    ("laxative use reviewed", "laxative, medication"),
    ("dietary fibre and fluid intake reviewed", "fibre, fluid, water"),
    ("impact on daily life documented", "impact, daily, QOL"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no rectal bleeding reported", "rectal, bleeding"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no abdominal pain reported if applicable", "abdominal, pain"),
    ("no vomiting reported", "vomiting"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("abdominal distension documented if assessed", "distension, bloating"),
    ("rectal examination documented if assessed", "rectal, PR, digital"),
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
    ("previous gastroenterology records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("lifestyle and dietary advice documented if discussed", "lifestyle, fibre, fluid"),
    ("medication plan documented if clinician decided", "laxative, medication"),
    ("safety-netting documented if discussed", "safety, netting"),
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
    ("onset and duration documented", "onset, duration, acute, chronic"),
    ("frequency documented", "frequency, how often"),
    ("stool character documented", "character, watery, bloody"),
    ("urgency reviewed", "urgency, bowel"),
    ("associated abdominal pain reviewed", "abdominal, pain, cramping"),
    ("nausea or vomiting reviewed", "nausea, vomiting"),
    ("fever reviewed", "fever, temperature"),
    ("travel history reviewed if relevant", "travel, foreign"),
    ("medication history reviewed if relevant", "medication, antibiotic"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no rectal bleeding reported", "rectal, bleeding, PR"),
    ("no unintentional weight loss reported", "weight, loss"),
    ("no nocturnal symptoms reported if applicable", "nocturnal, night"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("abdominal tenderness documented if assessed", "tenderness"),
    ("vitals documented if measured", "vitals, BP, pulse, temp"),
    ("general appearance documented if assessed", "appearance"),
    ("hydration assessment documented if assessed", "hydration, mucous, turgor"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("bloody diarrhoea", "bloody, dysentery"),
    ("severe dehydration", "dehydration, dry, turgor"),
    ("persistent diarrhoea over 6 weeks", "persistent, chronic"),
    ("unexplained weight loss", "weight, loss"),
    ("nocturnal symptoms", "nocturnal, night"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("stool studies reviewed if ordered", "stool, culture, MC+S"),
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
    ("amount and colour documented", "amount, colour, bright, dark"),
    ("frequency documented", "frequency, how often"),
    ("associated pain reviewed", "pain, anal"),
    ("bowel habit change reviewed", "bowel, habit, change"),
    ("weight loss reviewed", "weight, loss"),
    ("family history of colorectal cancer reviewed", "family, CRC, bowel cancer"),
    ("anticoagulant use reviewed if relevant", "anticoagulant, aspirin, warfarin"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no melena reported if relevant", "melena, black, tarry"),
    ("no haematemesis reported", "hematemesis, vomiting, blood"),
    ("no significant weight loss reported if applicable", "weight, loss"),
    ("no abdominal mass reported", "mass, palpable"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("rectal examination documented if assessed", "rectal, PR, DRE"),
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("general appearance documented if assessed", "appearance, pale"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("haemodynamic instability if assessed", "haemodynamic, unstable, BP"),
    ("significant or persistent bleeding", "persistent, significant"),
    ("weight loss with rectal bleeding", "weight, loss"),
    ("family history of colorectal cancer", "family, CRC"),
    ("age over 50 with new bleeding", "age, over 50, new"),
    ("change in bowel habit with bleeding", "change, bowel, habit"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("blood tests reviewed if ordered", "blood, FBC, coagulation, iron"),
    ("previous endoscopy reports reviewed if available", "colonoscopy, sigmoidoscopy"),
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
    ("AST and ALT reviewed", "AST, ALT, transaminases"),
    ("ALP and GGT reviewed", "ALP, GGT, cholestatic"),
    ("bilirubin reviewed", "bilirubin, jaundice"),
    ("symptoms reviewed", "symptoms, fatigue, jaundice"),
    ("alcohol history reviewed if relevant", "alcohol, drinking"),
    ("medication history reviewed if relevant", "medication, statin, paracetamol"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("hepatomegaly documented if assessed", "hepatomegaly, liver, enlarged"),
    ("jaundice documented if present", "jaundice, icterus, sclera"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("significant transaminitis", "transaminitis, high, ALT, AST"),
    ("obstructive LFT pattern", "obstructive, ALP, GGT"),
    ("jaundice", "jaundice, icterus"),
    ("right upper quadrant pain", "RUQ, pain"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("previous LFT records reviewed if available", "previous, LFT, trend"),
    ("abdominal imaging reviewed if available", "ultrasound, liver, CT"),
    ("viral hepatitis serology reviewed if ordered", "hepatitis, B, C, serology"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("repeat testing interval documented if clinician decided", "repeat, LFT, interval"),
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
    ("onset and duration documented", "onset, duration, acute"),
    ("colour of urine and stool reviewed", "urine, dark, stool, pale"),
    ("pruritus reviewed", "pruritus, itching"),
    ("abdominal pain reviewed", "abdominal, pain, RUQ"),
    ("weight loss reviewed", "weight, loss"),
    ("alcohol history reviewed", "alcohol"),
    ("medication history reviewed if relevant", "medication, hepatotoxic"),
    ("travel history reviewed if relevant", "travel, hepatitis"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no significant abdominal pain reported if applicable", "pain, abdominal"),
    ("no fever reported if applicable", "fever"),
    ("no haematemesis reported", "hematemesis, bleeding"),
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
    ("right upper quadrant tenderness", "RUQ, tenderness"),
    ("fever with jaundice", "fever, cholangitis"),
    ("unexplained weight loss", "weight, loss"),
    ("palpable gallbladder", "gallbladder, palpable, Courvoisier"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("LFT and bilirubin reviewed", "LFT, bilirubin, ALT, ALP"),
    ("abdominal imaging reviewed if available", "ultrasound, CT, MRCP"),
    ("viral hepatitis serology reviewed if ordered", "hepatitis, A, B, C, E"),
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
    ("onset and duration documented", "onset, duration"),
    ("progressive or intermittent documented", "progressive, intermittent"),
    ("solids versus liquids documented", "solids, liquids, both"),
    ("associated pain reviewed", "pain, odynophagia"),
    ("weight loss reviewed", "weight, loss"),
    ("regurgitation reviewed", "regurgitation, food, coming back"),
    ("choking or aspiration reviewed", "choking, aspiration, cough"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("no weight loss reported if applicable", "weight, loss"),
    ("no haematemesis reported", "hematemesis, blood"),
    ("no persistent vomiting reported", "vomiting, regurgitation"),
    ("no hoarseness reported if relevant", "hoarseness, voice"),
], 1): rows.append(chip(wf, "relevant_negatives", t, i, s))

for i, (t, s) in enumerate([
    ("general appearance documented if assessed", "appearance, nutrition"),
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("BMI documented if measured", "BMI, weight"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("rapidly progressive dysphagia", "rapid, progressive"),
    ("weight loss with dysphagia", "weight, loss"),
    ("odynophagia", "odynophagia, painful, swallowing"),
    ("age over 50 with new dysphagia", "age, over 50, new"),
    ("hoarseness or cervical lymphadenopathy", "hoarseness, lymph, node"),
    ("family history of GI malignancy", "family, GI, cancer"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("previous endoscopy report reviewed if available", "OGD, EGD, endoscopy"),
    ("barium swallow report reviewed if performed", "barium, swallow"),
    ("previous imaging reviewed if available", "imaging, CT"),
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
    ("procedure tolerance reviewed", "tolerance, sedation"),
    ("clinical findings reviewed", "findings, endoscopy, result"),
    ("biopsy results reviewed if available", "biopsy, histology, result"),
    ("symptoms since procedure reviewed", "symptoms, recovery"),
    ("bleeding or pain reviewed", "bleeding, pain, post, procedure"),
    ("medication adjustment reviewed if applicable", "medication, PPI, change"),
], 1): rows.append(chip(wf, "symptoms", t, i, s))

for i, (t, s) in enumerate([
    ("abdominal examination documented if assessed", "abdominal, exam"),
    ("vitals documented if measured", "vitals, BP, pulse"),
    ("general appearance documented if assessed", "appearance"),
], 1): rows.append(chip(wf, "exam_findings", t, i, s))

for i, (t, s) in enumerate([
    ("significant post-procedure bleeding", "post, procedure, bleeding"),
    ("unexplained abdominal pain after procedure", "pain, after, scope"),
    ("perforation signs if suspected", "perforation, peritonitis"),
], 1): rows.append(chip(wf, "red_flags", t, i, s, "gastroenterology,high_safety"))

for i, (t, s) in enumerate([
    ("endoscopy report reviewed if available", "endoscopy, OGD, colonoscopy"),
    ("histology results reviewed if available", "histology, biopsy, pathology"),
    ("previous records reviewed if available", "previous, records"),
], 1): rows.append(chip(wf, "investigations", t, i, s))

for i, (t, s) in enumerate([
    ("clinician-entered plan documented", "plan, management"),
    ("medication plan documented if clinician decided", "medication, PPI, change"),
    ("follow-up interval for repeat endoscopy documented if clinician decided", "repeat, scope, interval"),
    ("safety-netting documented if discussed", "safety, netting"),
    ("follow-up documented if arranged", "follow, up"),
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
