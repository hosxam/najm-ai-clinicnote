#!/usr/bin/env python3
"""Expand diagnosis_index.csv with supplementary synonym/lay_term rows."""

import csv

# Read existing
with open('diagnosis_index.csv', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    existing = list(reader)
    fields = reader.fieldnames

# Read clinical_workflows for spec mapping
wf_spec = {}
with open('clinical_workflows.csv', newline='', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        wf_spec[r['workflow_id']] = r['specialty_id']

# Track existing IDs and pairs
existing_ids = set(r['entry_id'] for r in existing)

def make_id(prefix, wf_id, label):
    slug = label.lower().replace(' ','_').replace('/','_or_').replace(',','').replace('(','').replace(')','').replace('-','_')
    eid = f'{prefix}-{wf_id}-{slug}'
    base = eid
    n = 1
    while eid in existing_ids:
        n += 1
        eid = f'{base}-{n}'
    existing_ids.add(eid)
    return eid

new_rows = []

def add(typ, label, aliases, wf_id, icd_sys='', icd_code='', icd_label='', icd_ver='FALSE', icd_src=''):
    spec = wf_spec[wf_id]
    new_rows.append({
        'entry_id': make_id(typ, wf_id, label),
        'type': typ,
        'label': label,
        'aliases': aliases,
        'specialty_ids': spec,
        'workflow_ids': wf_id,
        'icd_system': icd_sys,
        'icd_code': icd_code,
        'icd_label': icd_label,
        'icd_verified': icd_ver,
        'icd_source': icd_src
    })

# ============ GP (18 wf, add ~2-3 per wf) ============
add('synonym','Cold symptoms','common cold, runny nose, sneezing, nasal congestion','gp-fever-urti')
add('synonym','Flu-like illness','influenza-like symptoms, viral illness, myalgia fever','gp-fever-urti')
add('lay_term','Upper respiratory infection','URI, upper respiratory tract infection, resp infection','gp-fever-urti')
add('synonym','Persistent cough','chronic cough, lingering cough, cough not improving','gp-cough')
add('lay_term','Chesty cough','congested cough, phlegm cough, mucus','gp-cough')
add('lay_term','Throat infection','sore throat infection, bacterial throat, viral throat','gp-sore-throat')
add('synonym','Painful swallowing','odynophagia, difficulty swallowing, dysphagia','gp-sore-throat')
add('lay_term','Tension headache type','stress headache, muscle tension headache, band headache','gp-headache')
add('lay_term','Migraine with aura','aura, light sensitivity, nausea with headache, throbbing','gp-headache')
add('synonym','Lightheadedness','dizziness feeling, faint, presyncope, woozy','gp-dizziness')
add('synonym','Balance difficulty','unsteady gait, feeling off balance, disequilibrium','gp-dizziness')
add('synonym','Chronic fatigue','persistent tiredness, long-term fatigue, ongoing exhaustion','gp-fatigue')
add('lay_term','Low energy','lack of energy, sluggish, weak feeling, malaise','gp-fatigue')
add('synonym','Upper abdominal pain','epigastric pain, gastric discomfort, stomach pain upper','gp-abdominal-pain')
add('lay_term','Indigestion','dyspepsia, bloating, gas, upset stomach after meals','gp-abdominal-pain')
add('synonym','Nausea or queasiness','feeling sick, queasy, sick to stomach','gp-nausea')
add('lay_term','Stomach bug','gastro bug, food poisoning, viral gastroenteritis','gp-nausea')
add('lay_term','Loose stools','watery stool, frequent stools, bowel frequency','gp-diarrhea')
add('lay_term','Tummy bug','stomach virus, intestinal infection, viral diarrhea','gp-diarrhea')
add('synonym','Hard stool','difficult bowel movement, straining, incomplete evacuation','gp-constipation')
add('lay_term','Irregular bowels','bowel issues, chronic constipation, laxative use','gp-constipation')
add('synonym','Heartburn type pain','burning chest, acid reflux, GERD symptoms, retrosternal burning','gp-chest-pain')
add('synonym','Chest pressure','pressure in chest, tight chest, non-cardiac chest pain','gp-chest-pain')
add('synonym','Skipped heartbeats','heart skipping, ectopic beats, missed beats','gp-palpitations')
add('lay_term','Fast heart rate','tachycardia, pounding heart, fluttering, racing heart','gp-palpitations')
add('synonym','Breathlessness','dyspnoea, breathing difficulty, gasping for air','gp-shortness-of-breath')
add('lay_term','Wheezing episodes','difficulty breathing out, chest tightness breathing','gp-shortness-of-breath')
add('synonym','Blood pressure check','HTN follow up, BP monitoring, hypertension check','gp-hypertension-followup')
add('synonym','Hypertension meds review','antihypertensive review, BP medication check','gp-hypertension-followup')
add('synonym','Glucose level review','sugar level review, diabetes monitoring, glucose check','gp-diabetes-followup')
add('synonym','HbA1c follow up','diabetic control review, long term glucose check','gp-diabetes-followup')
add('synonym','Thyroid function review','TSH check, TFT follow-up, thyroid blood work','gp-thyroid-followup')
add('lay_term','Thyroid medication review','levothyroxine check, thyroid hormone meds','gp-thyroid-followup')
add('synonym','Cholesterol check','lipid profile review, lipid follow-up, statin review','gp-dyslipidemia-followup')
add('synonym','Statin therapy review','lipid medication, cholesterol management, fat levels','gp-dyslipidemia-followup')
add('synonym','Investigation results review','lab results discussion, diagnostic tests review, blood panel','gp-lab-result-review')
add('synonym','Blood work review','CBC review, biochemistry review, lab report discussion','gp-lab-result-review')

# ============ Peds (12 wf) ============
add('synonym','Child high temperature','baby fever, infant fever, child pyrexia','peds-fever')
add('lay_term','Feverish child','warm child, hot to touch, temperature child','peds-fever')
add('synonym','Child runny nose','baby congestion, infant cold, child nasal discharge','peds-cough')
add('lay_term','Baby chesty','infant cough, baby coughing, child congested','peds-cough')
add('synonym','Child dehydration risk','vomiting child fluids, baby not keeping milk, diarrhea dehydration','peds-vomiting-diarrhea')
add('lay_term','Baby stomach bug','child gastroenteritis, infant diarrhea vomiting','peds-vomiting-diarrhea')
add('lay_term','Child spots','baby spots, skin rash child, child skin bumps','peds-rash')
add('synonym','Child skin redness','baby skin irritation, child allergic skin, infant rash','peds-rash')
add('synonym','Baby not eating','infant poor appetite, child refusing food, baby low milk intake','peds-poor-feeding')
add('lay_term','Infant feeding problem','baby feeding difficulty, poor suckling','peds-poor-feeding')
add('synonym','Child earache','baby ear infection, infant ear pulling, toddler ear pain','peds-ear-pain')
add('lay_term','Ear infection child','otitis media child, middle ear infection','peds-ear-pain')
add('synonym','Child tummy pain','baby stomach ache, child belly ache, toddler abdominal pain','peds-abdominal-pain')
add('synonym','Child growth check','well baby visit, growth monitoring child, developmental check','peds-routine-followup')
add('lay_term','Baby health check','infant physical exam, well child exam, routine pediatric','peds-routine-followup')
add('synonym','Childhood immunisation','baby vaccine schedule, infant shots, vaccination reminder','peds-vaccination')
add('lay_term','Baby shots','vaccine visit child, immunisation appointment','peds-vaccination')
add('synonym','Poor weight gain child','weight loss child, short stature concern, small for age','peds-growth-concern')
add('lay_term','Child not growing','growth delay, baby not gaining weight properly','peds-growth-concern')
add('synonym','Speech delay','child not talking, language delay, communication delay','peds-development-concern')
add('synonym','Motor delay','not walking late, crawling delay, gross motor delay','peds-development-concern')
add('synonym','School absence note','child medical certificate, school fitness note','peds-school-note')
add('lay_term','Doctor note child','sick certificate child, school excuse','peds-school-note')

# ============ OB/GYN (10 wf) ============
add('synonym','Pregnancy care','maternity check up, pregnancy monitoring, obstetrics follow up','obgyn-antenatal-followup')
add('synonym','ANC visit','antenatal clinic, routine pregnancy exam, pregnancy check','obgyn-antenatal-followup')
add('synonym','Lower abdomen pain female','adnexal tenderness, pelvic discomfort female','obgyn-pelvic-pain')
add('lay_term','Womb pain','pelvic cramping, lower abdominal pain gynecology','obgyn-pelvic-pain')
add('synonym','Abnormal uterine bleeding','AUB, heavy periods, irregular cycles, metrorrhagia','obgyn-irregular-bleeding')
add('lay_term','Spotting between periods','intermenstrual bleeding, breakthrough bleeding','obgyn-irregular-bleeding')
add('synonym','Abnormal discharge female','vaginal itching, discharge odor, vulvar irritation','obgyn-vaginal-discharge')
add('lay_term','Yeast infection','vaginal thrush, candida symptoms, itching discharge','obgyn-vaginal-discharge')
add('synonym','Birth control','contraceptive pill, IUD, family planning discussion','obgyn-contraception')
add('lay_term','Preventing pregnancy','contraception advice, hormonal contraception','obgyn-contraception')
add('synonym','Painful menstruation','period cramps, menstrual pain, severe period pain','obgyn-dysmenorrhea')
add('lay_term','Bad period pain','dysmenorrhea treatment, menstrual cramping severe','obgyn-dysmenorrhea')
add('synonym','Post delivery check','postpartum assessment, after birth follow up','obgyn-postnatal-followup')
add('lay_term','After birth check','six week check, postnatal recovery','obgyn-postnatal-followup')
add('synonym','First trimester symptoms','early gestation, pregnancy confirmation, nausea pregnancy','obgyn-early-pregnancy')
add('synonym','Pregnancy bleeding early','threatened miscarriage, spotting pregnant','obgyn-early-pregnancy')
add('synonym','Hormone therapy review','HRT follow up, menopausal hormone treatment','obgyn-menopause')
add('lay_term','Change of life','perimenopause management, menopause transition treatment','obgyn-menopause')
add('synonym','Trying to conceive','subfertility workup, preconception counseling, infertility assessment','obgyn-fertility')
add('synonym','Recurrent pregnancy loss','miscarriage recurrent, habitual abortion workup','obgyn-fertility')

# ============ Ortho/MSK (12 wf) ============
add('synonym','Lumbar pain','lower spine pain, lumbosacral pain, back ache','msk-low-back-pain')
add('lay_term','Bad back','mechanical back pain, back strain, back injury','msk-low-back-pain')
add('synonym','Cervicalgia','stiff neck, cervical strain, neck ache, neck injury','msk-neck-pain')
add('lay_term','Wry neck','torticollis, neck muscle spasm','msk-neck-pain')
add('synonym','Painful knee','swollen knee, crepitus knee, difficulty bending knee','msk-knee-pain')
add('lay_term','Knee arthritis','degenerative knee, osteoarthritis knee','msk-knee-pain')
add('synonym','Rotator cuff problem','shoulder impingement, frozen shoulder, tendinitis shoulder','msk-shoulder-pain')
add('lay_term','Shoulder stiffness','difficulty raising arm, frozen shoulder, adhesive capsulitis','msk-shoulder-pain')
add('synonym','Groin pain','hip arthritis, degenerative hip, coxarthrosis','msk-hip-pain')
add('lay_term','Hip stiffness','difficulty walking hip, hip joint pain','msk-hip-pain')
add('synonym','Heel pain','plantar fasciitis, painful heel, heel spur','msk-ankle-pain')
add('lay_term','Foot injury','ankle sprain, twisted foot, foot strain','msk-ankle-pain')
add('synonym','Median nerve symptoms','carpal tunnel, hand numbness, finger tingling','msk-wrist-hand-pain')
add('lay_term','Wrist strain','tenosynovitis, repetitive strain injury wrist','msk-wrist-hand-pain')
add('synonym','Twisted ankle','ankle ligament injury, inversion injury ankle','msk-acute-sprain')
add('lay_term','Soft tissue injury','muscle strain, ligament tear grade 1','msk-acute-sprain')
add('synonym','Cast check','fracture healing review, orthopaedic fracture follow up','msk-fracture-followup')
add('lay_term','Bone healing check','broken bone recovery, x ray check fracture','msk-fracture-followup')
add('synonym','Post-surgical assessment','surgery wound check, post ortho op, recovery follow up','msk-post-op-followup')
add('synonym','Joint replacement follow up','TKR check, THR follow up, arthroplasty review','msk-post-op-followup')
add('synonym','OA management','degenerative joint disease, arthritis follow up','msk-osteoarthritis-followup')
add('lay_term','Arthritis review','joint pain chronic, osteoarthritis treatment review','msk-osteoarthritis-followup')
add('synonym','Athletic injury','training injury, sport trauma, gym injury','msk-sports-injury')
add('lay_term','Running injury','exercise-related injury, muscle tear sports','msk-sports-injury')

# ============ ENT (8 wf) ============
add('synonym','Painful ear','earache, ear infection, otalgia','ent-ear-pain')
add('lay_term','Middle ear infection','otitis media infection, ear drum inflammation','ent-ear-pain')
add('synonym','Reduced hearing','deafness, muffled hearing, hypoacusis','ent-hearing-complaint')
add('lay_term','Hearing difficulty','hard of hearing, poor hearing','ent-hearing-complaint')
add('synonym','Ringing ears','ear buzzing, tinnitus noise, ear humming','ent-tinnitus')
add('lay_term','Noise in ear','whistling ear, hissing in ear','ent-tinnitus')
add('synonym','Spinning sensation','vertigo attack, BPPV, positional vertigo','ent-dizziness-vertigo')
add('lay_term','Room spinning','disequilibrium, balance problem inner ear','ent-dizziness-vertigo')
add('synonym','Stuffy nose','blocked nasal passages, nasal obstruction, nostril blocked','ent-nasal-congestion')
add('lay_term','Sinus congestion','postnasal drip, catarrh, rhinitis','ent-nasal-congestion')
add('synonym','Facial pressure','frontal headache, sinus headache, cheek pain','ent-sinus-symptoms')
add('synonym','Sinus pain','sinus infection, maxillary sinusitis, ethmoid sinusitis','ent-sinus-symptoms')
add('synonym','Swollen tonsils','tonsillitis, infected tonsils, throat infection','ent-sore-throat')
add('lay_term','Strep throat','streptococcal pharyngitis, bacterial sore throat','ent-sore-throat')
add('synonym','Hoarseness','raspy voice, lost voice, strained voice','ent-voice-complaint')
add('lay_term','Vocal strain','laryngitis, singer voice problem','ent-voice-complaint')

# ============ Derm (8 wf) ============
add('synonym','Skin redness','red patches skin, erythema, skin irritation','derm-rash')
add('lay_term','Itchy skin','pruritus, skin allergy, contact reaction','derm-rash')
add('synonym','Pimples','zits, breakouts, acne spots, comedones','derm-acne')
add('synonym','Acne follow up','acne treatment review, acne medication check','derm-acne')
add('synonym','Dry itchy skin','atopic eczema, skin inflammation, allergic dermatitis','derm-eczema')
add('lay_term','Eczema flare up','dermatitis flare, skin flare management','derm-eczema')
add('synonym','Ringworm','tinea infection, athlete foot, jock itch, skin fungus','derm-fungal-infection')
add('lay_term','Skin fungal infection','dermatophyte infection, candida skin','derm-fungal-infection')
add('synonym','Hives','welts, raised bumps, allergic reaction skin','derm-urticaria')
add('lay_term','Allergic skin reaction','urticarial rash, angioedema','derm-urticaria')
add('synonym','Surgical wound check','post procedure wound, stitches removal, wound healing check','derm-wound-review')
add('lay_term','Scar assessment','wound dressing check, infection wound','derm-wound-review')
add('synonym','Mole check','changing mole, atypical nevus, skin cancer screening','derm-skin-lesion-review')
add('synonym','Skin growth evaluation','skin papule, nodule check, lesion suspicious','derm-skin-lesion-review')
add('synonym','Thinning hair','balding, receding hairline, shedding hair','derm-hair-loss')
add('synonym','Patchy hair loss','alopecia areata, bald patch, hair fall','derm-hair-loss')

# ============ Ophth (6 wf) ============
add('synonym','Pink eye','ocular redness, bloodshot eye, scleral injection','ophth-red-eye')
add('lay_term','Eye irritation','gritty eye, scratchy eye, irritated eye','ophth-red-eye')
add('synonym','Sharp eye pain','corneal abrasion, foreign body sensation, keratitis','ophth-eye-pain')
add('synonym','Photophobia','light sensitivity, painful to light','ophth-eye-pain')
add('synonym','Blurry vision','visual disturbance, decreased vision, cloudy vision','ophth-vision-change')
add('lay_term','Double vision','diplopia, vision problem, sight difficulty','ophth-vision-change')
add('synonym','Sticky eyes','crusty eyes, eye discharge, watery eye','ophth-eye-discharge')
add('lay_term','Eye mucus','pus in eye, conjunctivitis discharge','ophth-eye-discharge')
add('synonym','CL related problem','contact lens intolerance, CL pain, contact lens complication','ophth-contact-lens-complaint')
add('synonym','Contact lens overwear','CL overwear syndrome, dry eye contacts','ophth-contact-lens-complaint')
add('lay_term','Eye injury','ocular trauma, hit in eye, foreign body eye','ophth-eye-trauma')
add('synonym','Chemical eye exposure','chemical splash eye, eye burn','ophth-eye-trauma')

# ============ Psych (6 wf) ============
add('synonym','Worrying','anxiety symptoms, nervousness, tension, unease','psych-anxiety')
add('synonym','Generalised anxiety','GAD review, anxiety management, worry excessive','psych-anxiety')
add('synonym','Sadness','feeling down, depressed mood, unhappiness','psych-low-mood')
add('lay_term','Depression symptoms','MDD symptoms, low mood persistent, loss of interest','psych-low-mood')
add('synonym','Trouble sleeping','insomnia, can not sleep, poor sleep quality','psych-sleep-difficulty')
add('lay_term','Can not fall asleep','sleep initiation difficulty, waking up often','psych-sleep-difficulty')
add('synonym','Overwhelmed feeling','adjustment reaction, coping difficulty, life stress','psych-stress-symptoms')
add('synonym','Burnout','stress management, work related stress, emotional exhaustion','psych-stress-symptoms')
add('lay_term','Panic attack','sudden fear attack, rapid heart anxiety, hyperventilation','psych-panic-symptoms')
add('synonym','Panic disorder review','recurrent panic attacks, agoraphobia symptoms','psych-panic-symptoms')
add('synonym','Antidepressant review','SSRI follow up, mood stabiliser check, psychiatric med management','psych-medication-followup')
add('synonym','Psychiatry check in','mental health review, medication adherence psychiatry','psych-medication-followup')

# Give clear row count for each specialty
spec_counts = {}
spec_new = {}
for r in new_rows:
    w = r['workflow_ids']
    spec = wf_spec.get(w, 'unknown')
    spec_new[spec] = spec_new.get(spec, 0) + 1
    spec_counts[spec] = spec_counts.get(spec, 0) + 1

print('New rows by specialty:')
for s in sorted(spec_new):
    print(f'  {s}: {spec_new[s]}')

# Combine all and write
all_rows = existing + new_rows

with open('diagnosis_index.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader()
    w.writerows(all_rows)

print(f'\nWrote {len(all_rows)} total rows ({len(existing)} existing + {len(new_rows)} new)')
print(f'Workflow coverage: {len(set(r["workflow_ids"] for r in all_rows))}')
