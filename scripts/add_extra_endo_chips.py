"""Add extra Endo chips to reach ~360."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_endocrinology.csv')

with open(CSV_PATH, 'r') as f:
    existing = list(csv.DictReader(f))

max_order = {}
for r in existing:
    k=(r['workflow_id'],r['group']); o=int(r['order'])
    max_order[k]=max(max_order.get(k,0),o)

def add(wf,g,t,s):
    k=(wf,g); o=max_order.get(k,0)+1; max_order[k]=o
    existing.append({'workflow_id':wf,'specialty_id':'Endocrinology',
        'chip_id':f'{wf}-{g}-{o}','group':g,'chip_text':t,
        'order':str(o),'search_terms':s,'tags':'endocrinology'})

# per-workflow additions
add('endo-diabetes-followup','symptoms','kidney function context reviewed if relevant','kidney, renal, nephropathy')
add('endo-diabetes-followup','symptoms','cardiovascular risk context reviewed if relevant','cardiac, CVD, risk')
add('endo-diabetes-followup','exam_findings','retinal examination documented if assessed','retinal, eye, fundoscopy')
add('endo-diabetes-followup','plan_phrases','annual review items discussed if applicable','annual, review, checks')

add('endo-thyroid-symptoms','symptoms','skin and hair changes reviewed if relevant','skin, hair, dry, brittle')
add('endo-thyroid-symptoms','symptoms','menstrual changes reviewed if relevant','menstrual, period, cycle')
add('endo-thyroid-symptoms','exam_findings','skin and hair examination documented if assessed','skin, hair, texture')
add('endo-thyroid-symptoms','plan_phrases','referral documented if clinician decided','referral, endocrinology')
add('endo-thyroid-symptoms','follow_up','sooner if worsening','sooner, worsening')

add('endo-hypothyroidism-followup','symptoms','myxoedema symptoms reviewed if relevant','myxoedema, facial, puffiness')
add('endo-hypothyroidism-followup','symptoms','heart rate changes reviewed','heart, rate, bradycardia')
add('endo-hypothyroidism-followup','exam_findings','skin and hair examination documented if assessed','skin, dry, hair, loss')
add('endo-hypothyroidism-followup','exam_findings','reflexes documented if assessed','reflexes, delayed, relaxation')
add('endo-hypothyroidism-followup','follow_up','sooner if symptom change','sooner, change')

add('endo-hyperthyroidism-followup','symptoms','fatigue and sleep reviewed','fatigue, sleep, insomnia')
add('endo-hyperthyroidism-followup','symptoms','neck discomfort reviewed','neck, discomfort, goiter')
add('endo-hyperthyroidism-followup','exam_findings','skin examination documented if assessed','skin, warm, moist')
add('endo-hyperthyroidism-followup','follow_up','sooner if worsening','sooner, worsening')

add('endo-obesity-counseling-documentation','symptoms','eating patterns reviewed','eating, patterns, binge, emotional')
add('endo-obesity-counseling-documentation','symptoms','weight loss attempts reviewed','weight, loss, attempts, history')
add('endo-obesity-counseling-documentation','symptoms','mental health context reviewed if relevant','mental, health, mood')
add('endo-obesity-counseling-documentation','exam_findings','vitals documented if measured','vitals, pulse, temp')
add('endo-obesity-counseling-documentation','plan_phrases','goal setting documented if discussed','goal, target, weight')
add('endo-obesity-counseling-documentation','follow_up','sooner if needed','sooner, needed')

add('endo-hypoglycemia-review','symptoms','driving and safety context reviewed','driving, safety, DVLA')
add('endo-hypoglycemia-review','symptoms','alcohol context reviewed if relevant','alcohol, drinking')
add('endo-hypoglycemia-review','exam_findings','glucose meter reviewed if available','meter, device, reading')
add('endo-hypoglycemia-review','plan_phrases','education documented if discussed','education, hypo, awareness')
add('endo-hypoglycemia-review','follow_up','sooner if recurrent','sooner, recurrent')

add('endo-pcos-metabolic-review','symptoms','skin changes reviewed','skin, acanthosis, nigricans, acne')
add('endo-pcos-metabolic-review','symptoms','mood and mental health reviewed','mood, anxiety, depression')
add('endo-pcos-metabolic-review','exam_findings','waist circumference documented if measured','waist, obesity, central')
add('endo-pcos-metabolic-review','exam_findings','acanthosis nigricans documented if assessed','acanthosis, nigricans')
add('endo-pcos-metabolic-review','plan_phrases','fertility referral discussed if applicable','fertility, conception, IVF')
add('endo-pcos-metabolic-review','follow_up','sooner if symptom change','sooner, change')

add('endo-osteoporosis-followup','symptoms','previous DEXA results reviewed if available','DEXA, previous, T-score')
add('endo-osteoporosis-followup','symptoms','secondary causes reviewed if relevant','secondary, causes, steroid')
add('endo-osteoporosis-followup','exam_findings','kyphosis documented if assessed','kyphosis, posture, spine')
add('endo-osteoporosis-followup','exam_findings','height measured if documented','height, loss, measurement')
add('endo-osteoporosis-followup','plan_phrases','falls prevention discussed if applicable','falls, prevention, balance')
add('endo-osteoporosis-followup','follow_up','sooner if new fracture','sooner, fracture')

add('endo-adrenal-incidentaloma-referral','symptoms','family history reviewed if relevant','family, MEN, adrenal')
add('endo-adrenal-incidentaloma-referral','symptoms','medication history reviewed if relevant','medication, steroid, exogenous')
add('endo-adrenal-incidentaloma-referral','exam_findings','signs of hormone excess documented if assessed','Cushing, aldosterone, signs')
add('endo-adrenal-incidentaloma-referral','plan_phrases','hormonal workup plan documented if clinician decided','workup, cortisol, metanephrines')
add('endo-adrenal-incidentaloma-referral','follow_up','sooner if symptoms develop','sooner, symptoms')

add('endo-pituitary-symptoms-documentation','symptoms','thirst and urine output reviewed if relevant','thirst, polydipsia, DI')
add('endo-pituitary-symptoms-documentation','symptoms','bone and joint pain reviewed if relevant','bone, joint, pain, acromegaly')
add('endo-pituitary-symptoms-documentation','exam_findings','visual acuity documented if assessed','visual, acuity, Snellen')
add('endo-pituitary-symptoms-documentation','exam_findings','hand and foot size documented if relevant','hand, foot, acromegaly')
add('endo-pituitary-symptoms-documentation','plan_phrases','multidisciplinary referral documented if clinician arranged','MDT, pituitary, neurosurgery')
add('endo-pituitary-symptoms-documentation','follow_up','sooner if new symptoms','sooner, new')

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['workflow_id','specialty_id','chip_id','group','chip_text','order','search_terms','tags'])
    w.writeheader(); w.writerows(existing)

from collections import Counter
for wf_id, count in sorted(Counter(r['workflow_id'] for r in existing).items()):
    print(f'  {wf_id}: {count}')
print(f'Total: {len(existing)}')
