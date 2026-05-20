"""Add extra Uro/Neph chips to reach ~360."""
import csv, os

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data_csv_working', 'workflow_chips_urology_nephrology.csv')

with open(CSV_PATH, 'r') as f:
    rows = list(csv.DictReader(f))
seen = set((r['workflow_id'], r['group'], r['chip_text']) for r in rows)
mo = {}
for r in rows: k=(r['workflow_id'],r['group']); o=int(r['order']); mo[k]=max(mo.get(k,0),o)

def add(wf,g,t,s):
    if (wf,g,t) in seen: return
    k=(wf,g); o=mo.get(k,0)+1; mo[k]=o
    rows.append({'workflow_id':wf,'specialty_id':'Urology / Nephrology','chip_id':f'{wf}-{g}-{o}','group':g,'chip_text':t,'order':str(o),'search_terms':s,'tags':'urology_nephrology'})

# uro-dysuria-uti-symptoms +5
add('uro-dysuria-uti-symptoms','symptoms','previous UTI history reviewed','UTI, prior, recurrent')
add('uro-dysuria-uti-symptoms','exam_findings','glucose checked if performed','glucose, diabetes')
add('uro-dysuria-uti-symptoms','red_flags','recurrent UTI in male','recurrent, male')
add('uro-dysuria-uti-symptoms','investigations','imaging reviewed if available','ultrasound, KUB')
add('uro-dysuria-uti-symptoms','plan_phrases','recurrent UTI plan discussed if applicable','recurrent, UTI, prophylaxis')

# uro-hematuria +6
add('uro-hematuria','symptoms','family history of urological cancer reviewed','family, cancer, bladder, kidney')
add('uro-hematuria','symptoms','recent urinary tract infection context reviewed','recent, UTI, infection')
add('uro-hematuria','exam_findings','blood pressure documented if measured','BP, blood, pressure')
add('uro-hematuria','red_flags','recurrent visible hematuria','recurrent, visible')
add('uro-hematuria','plan_phrases','clinician-entered plan documented','plan, management')
add('uro-hematuria','follow_up','sooner if worsening','sooner, worsening')

# uro-luts-bph +6
add('uro-luts-bph','symptoms','flow rate context reviewed if assessed','flow, rate, uroflowmetry')
add('uro-luts-bph','exam_findings','neurological examination documented if relevant','neurological, reflexes')
add('uro-luts-bph','red_flags','acute retention with BPH','acute, retention')
add('uro-luts-bph','red_flags','haematuria with LUTS','haematuria, blood')
add('uro-luts-bph','investigations','bladder scan reviewed if performed','bladder, scan, PVR')
add('uro-luts-bph','follow_up','sooner if worsening','sooner, worsening')

# uro-renal-colic-followup +6
add('uro-renal-colic-followup','symptoms','metabolic workup context reviewed if relevant','metabolic, calcium, urate')
add('uro-renal-colic-followup','symptoms','hydration context reviewed','hydration, fluid, intake')
add('uro-renal-colic-followup','exam_findings','vitals documented if measured','vitals, BP, pulse')
add('uro-renal-colic-followup','investigations','stone analysis result reviewed if available','stone, analysis, composition')
add('uro-renal-colic-followup','plan_phrases','preventative advice documented if discussed','prevention, diet, fluid')
add('uro-renal-colic-followup','follow_up','sooner if recurrence','sooner, recurrent')

# uro-urinary-retention-documentation +7
add('uro-urinary-retention-documentation','symptoms','trauma or surgery history reviewed if relevant','trauma, surgery, pelvic')
add('uro-urinary-retention-documentation','symptoms','pain severity documented if applicable','pain, severity')
add('uro-urinary-retention-documentation','exam_findings','pelvic examination documented if clinically appropriate','pelvic, DRE')
add('uro-urinary-retention-documentation','red_flags','suspected cauda equina','cauda, equina, spine')
add('uro-urinary-retention-documentation','red_flags','haematuria with retention','haematuria, blood')
add('uro-urinary-retention-documentation','plan_phrases','trial without catheter discussed if applicable','TWOC, catheter, removal')
add('uro-urinary-retention-documentation','follow_up','sooner if recurrent','sooner, recurrent')

# uro-flank-pain +5
add('uro-flank-pain','symptoms','urine output reviewed if relevant','urine, output, oliguria')
add('uro-flank-pain','symptoms','trauma history reviewed if relevant','trauma, injury, kidney')
add('uro-flank-pain','exam_findings','urinalysis reviewed if performed','urinalysis, dipstick')
add('uro-flank-pain','investigations','blood tests reviewed if ordered','blood, FBC, CRP')
add('uro-flank-pain','follow_up','sooner if worsening','sooner, worsening')

# uro-frequency-urgency +6
add('uro-frequency-urgency','symptoms','pelvic floor context reviewed if relevant','pelvic, floor, prolapse')
add('uro-frequency-urgency','symptoms','menstrual or menopausal context reviewed if relevant','menopausal, hormonal')
add('uro-frequency-urgency','exam_findings','pelvic examination documented if clinically appropriate','pelvic, prolapse')
add('uro-frequency-urgency','plan_phrases','bladder training discussed if applicable','bladder, training, exercises')
add('uro-frequency-urgency','plan_phrases','fluid management advice documented if discussed','fluid, caffeine, timing')
add('uro-frequency-urgency','follow_up','sooner if worsening','sooner, worsening')

# neph-ckd-followup +6
add('neph-ckd-followup','symptoms','dietary context reviewed if relevant','diet, salt, protein, potassium')
add('neph-ckd-followup','symptoms','fluid status reviewed if relevant','fluid, oedema, weight')
add('neph-ckd-followup','exam_findings','fluid status documented if assessed','fluid, JVP, oedema')
add('neph-ckd-followup','red_flags','significant proteinuria with declining function','proteinuria, eGFR')
add('neph-ckd-followup','plan_phrases','bone mineral metabolism discussed if relevant','bone, mineral, CKD-MBD')
add('neph-ckd-followup','follow_up','sooner if worsening','sooner, worsening')

# neph-proteinuria +6
add('neph-proteinuria','symptoms','medication history reviewed if relevant','medication, ACE, ARB')
add('neph-proteinuria','exam_findings','vitals documented if measured','vitals, BP')
add('neph-proteinuria','red_flags','nephrotic syndrome features if present','nephrotic, oedema, protein')
add('neph-proteinuria','plan_phrases','medication plan documented if clinician decided','medication, ACE, ARB')
add('neph-proteinuria','plan_phrases','safety-netting documented if discussed','safety, netting')
add('neph-proteinuria','follow_up','sooner if worsening','sooner, worsening')

# neph-electrolyte-abnormality-review +7
add('neph-electrolyte-abnormality-review','symptoms','dietary intake reviewed if relevant','diet, K, salt, intake')
add('neph-electrolyte-abnormality-review','symptoms','GI losses reviewed if relevant','GI, diarrhoea, vomiting')
add('neph-electrolyte-abnormality-review','exam_findings','ECG reviewed if performed by clinician','ECG, EKG, tracing')
add('neph-electrolyte-abnormality-review','red_flags','cardiac arrhythmia symptoms','arrhythmia, palpitations')
add('neph-electrolyte-abnormality-review','red_flags','signs of neuromuscular irritability','neuromuscular, tetany, Chvostek')
add('neph-electrolyte-abnormality-review','plan_phrases','clinician-entered plan documented','plan, management')
add('neph-electrolyte-abnormality-review','follow_up','sooner if abnormal','sooner, abnormal')

with open(CSV_PATH, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['workflow_id','specialty_id','chip_id','group','chip_text','order','search_terms','tags'])
    w.writeheader(); w.writerows(rows)

from collections import Counter
for wf_id, count in sorted(Counter(r['workflow_id'] for r in rows).items()):
    print(f'  {wf_id}: {count}')
print(f'Total: {len(rows)}')
