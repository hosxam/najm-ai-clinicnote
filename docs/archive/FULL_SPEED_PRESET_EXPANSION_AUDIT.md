# Full Speed Preset Expansion Audit

## Scope

Goal: expand speed presets from the initial high-value subset to all existing OPD workflows.

This phase changes only `data/speed_presets.json` and validation/reporting. It does not add workflows, change workflow chips, change clinical content, or change output generation logic.

## Current Coverage Before Expansion

- Total clinical workflows: 80
- Existing speed presets: 10
- Missing speed presets: 70

## Existing Preset Structure

Each preset uses this schema:

- `workflow_id`
- `preset_name`
- `specialty`
- `default_duration_options`
- `prechecked_symptoms`
- `prechecked_relevant_negatives`
- `prechecked_exam_findings`
- `prechecked_investigations`
- `prechecked_plan_phrases`
- `prechecked_follow_up`
- `collapsed_optional_sections`
- `safety_note`
- `review_required`
- `preset_version`

Referenced chip text must exist in `data/workflow_chips.json` for the same workflow and group.

## Missing Workflows Before Expansion

### General Medicine / GP

- `gp-cough` — Cough / Acute bronchitis
- `gp-sore-throat` — Sore throat / Pharyngitis
- `gp-headache` — Headache / Migraine/Tension headache
- `gp-dizziness` — Dizziness / Vestibular/referred
- `gp-fatigue` — Fatigue / Anaemia workup
- `gp-abdominal-pain` — Abdominal pain / Gastritis
- `gp-nausea` — Nausea/Vomiting / Gastroenteritis
- `gp-diarrhea` — Diarrhea / Acute gastroenteritis
- `gp-constipation` — Constipation / IBS / functional
- `gp-chest-pain` — Chest pain / GERD / reflux
- `gp-palpitations` — Palpitations / Arrhythmia workup
- `gp-shortness-of-breath` — Shortness of breath / Referred
- `gp-thyroid-followup` — Thyroid follow-up / Hypothyroidism
- `gp-dyslipidemia-followup` — Dyslipidemia follow-up / Hyperlipidemia
- `gp-lab-result-review` — Lab result review / Various

### Pediatrics

- `peds-vomiting-diarrhea` — Vomiting / diarrhea / Acute gastroenteritis
- `peds-rash` — Rash / Viral exanthem
- `peds-poor-feeding` — Poor feeding / Feeding difficulty
- `peds-ear-pain` — Ear pain / Acute otitis media
- `peds-abdominal-pain` — Abdominal pain / Constipation / referred
- `peds-routine-followup` — Routine pediatric follow-up / Well child check
- `peds-vaccination` — Vaccination visit / Immunization
- `peds-growth-concern` — Growth concern / Failure to thrive
- `peds-development-concern` — Developmental concern / Developmental delay
- `peds-school-note` — School / sick note / Administrative

### OB/GYN

- `obgyn-antenatal-followup` — Antenatal follow-up / Pregnancy follow-up
- `obgyn-pelvic-pain` — Pelvic pain / PID / adnexal
- `obgyn-irregular-bleeding` — Irregular bleeding / Dysfunctional uterine bleeding
- `obgyn-vaginal-discharge` — Vaginal discharge / Candidiasis / BV
- `obgyn-contraception` — Contraception counseling / Contraception
- `obgyn-dysmenorrhea` — Dysmenorrhea / Primary dysmenorrhea
- `obgyn-postnatal-followup` — Postnatal follow-up / Postnatal care
- `obgyn-early-pregnancy` — Early pregnancy symptoms / Early pregnancy
- `obgyn-menopause` — Menopause symptoms / Perimenopause
- `obgyn-fertility` — Fertility concern / Fertility workup

### Orthopedics / MSK

- `msk-neck-pain` — Neck pain / Cervical strain
- `msk-hip-pain` — Hip pain / Osteoarthritis
- `msk-ankle-pain` — Ankle / foot pain / Sprain / plantar fasciitis
- `msk-wrist-hand-pain` — Wrist / hand pain / Carpal tunnel / strain
- `msk-acute-sprain` — Acute sprain / Ligament injury
- `msk-osteoarthritis-followup` — Osteoarthritis follow-up / Osteoarthritis
- `msk-sports-injury` — Sports injury / Acute sports injury

### ENT

- `ent-ear-pain` — Ear pain / Acute otitis media / OE
- `ent-hearing-complaint` — Hearing complaint / Conductive / sensorineural
- `ent-tinnitus` — Tinnitus / Tinnitus
- `ent-dizziness-vertigo` — Dizziness / vertigo / BPPV / vestibular
- `ent-nasal-congestion` — Nasal congestion / Allergic rhinitis
- `ent-sinus-symptoms` — Sinus symptoms / Sinusitis
- `ent-sore-throat` — Sore throat / Strep pharyngitis
- `ent-voice-complaint` — Voice complaint / Laryngitis

### Dermatology

- `derm-rash` — Rash / Contact dermatitis / eczema
- `derm-acne` — Acne / Acne vulgaris
- `derm-eczema` — Eczema / dermatitis / Atopic dermatitis
- `derm-fungal-infection` — Fungal infection / Tinea / candidiasis
- `derm-urticaria` — Urticaria / Acute urticaria
- `derm-wound-review` — Wound review / Wound / post-procedure
- `derm-skin-lesion-review` — Skin lesion review / Benign / suspicious lesion
- `derm-hair-loss` — Hair loss / Alopecia

### Ophthalmology

- `ophth-red-eye` — Red eye / Conjunctivitis
- `ophth-eye-pain` — Eye pain / Keratitis / corneal abrasion
- `ophth-vision-change` — Vision change / Refractive / cataract
- `ophth-eye-discharge` — Eye discharge / Conjunctivitis
- `ophth-contact-lens-complaint` — Contact lens-related complaint / Contact lens complication
- `ophth-eye-trauma` — Eye trauma / Ocular trauma

### Psychiatry / Mental Health

- `psych-anxiety` — Anxiety / Generalized anxiety disorder
- `psych-low-mood` — Low mood / Major depressive episode
- `psych-sleep-difficulty` — Sleep difficulty / Primary insomnia
- `psych-stress-symptoms` — Stress-related symptoms / Adjustment disorder
- `psych-panic-symptoms` — Panic symptoms / Panic disorder
- `psych-medication-followup` — Medication follow-up / Psychiatric medication review

## Safety Rules Applied

- Use only existing chip text.
- Do not select red-flag chips as positive findings.
- Do not preselect suicidal ideation, self-harm, harm-to-others, severe vision loss, chemical exposure, stridor, unstable vitals, or similar red flags as symptoms.
- Prefer relevant negatives for ruled-out red flags.
- Avoid medication dosing.
- Avoid emergency management instructions.
- Avoid plan phrases containing `as per clinician plan`.
- Avoid highly specific abnormal exam findings when safer generic or normal/documented findings exist.
- Keep all defaults removable.
- Keep doctor-entered impression and doctor-entered plan required before generation.

## Validation Requirements

The validator now checks:

- exactly 80 presets
- every clinical workflow has one preset
- every preset workflow ID exists
- every referenced chip exists in the correct workflow and group
- no duplicate workflow IDs
- `review_required` is true
- `preset_version` exists
- disallowed phrases and medication dose-like text are rejected
- high-risk red flags are not preselected as positive symptoms when detectable
- default chip count is reported
- workflows over 25 default chips are warned
