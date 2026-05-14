# PILOT_WORKFLOW_INVENTORY.md

**Project:** Najm AI ClinicNote — Workflow Inventory  
**Date:** 2026-05-14  
**Target:** 80 workflows across 8 specialties  

> This is a planning document. Workflows listed here are proposed for CSV/JSON generation.
> Chips and full data are NOT included in this file. Only workflow identifiers and metadata.

---

## General Medicine / GP (18 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `gp-fever-urti` | Fever — Viral URTI | complaint | Most common acute presentation in primary care | low | yes | yes |
| `gp-cough-bronchitis` | Cough — Acute Bronchitis | complaint | Second most common. Differentiates viral vs bacterial | low | yes | yes |
| `gp-chest-pain-gerd` | Chest Pain — GERD | complaint | Common benign cause that must rule out cardiac causes | high | yes | yes |
| `gp-headache-migraine` | Headache — Migraine/Tension | complaint | Top 5 OPD complaint. Broad differential | medium | yes | yes |
| `gp-abdominal-pain-gastritis` | Abdominal Pain — Gastritis | complaint | Very common. Broad differential | medium | yes | yes |
| `gp-dizziness-vertigo` | Dizziness — Vestibular | complaint | Common diagnostic challenge | high | yes | yes |
| `gp-urinary-symptoms-uti` | Dysuria — UTI | complaint | Common in women | low | yes | yes |
| `gp-back-pain-mechanical` | Low Back Pain — Mechanical | complaint | Extremely common. Overlap with ortho | medium | yes | yes |
| `gp-rash-urticaria` | Rash — Urticaria | complaint | Common skin presentation in GP. Overlap with derm | low | yes | no |
| `gp-fatigue-anaemia` | Fatigue — Anaemia workup | complaint | Vague complaint with broad differential | medium | yes | yes |
| `gp-sore-throat-pharyngitis` | Sore Throat — Pharyngitis | complaint | Overlap with ENT. Common in GP | low | yes | yes |
| `gp-constipation-ibs` | Constipation — IBS | complaint | Chronic presentation | low | yes | yes |
| `gp-insomnia-primary` | Insomnia — Primary | complaint | Sleep complaint. Overlap with psych | low | no | no |
| `gp-weight-loss-unexplained` | Weight Loss — Unexplained | complaint | Serious symptom requiring workup | high | yes | yes |
| `gp-joint-pain-osteoarthritis` | Joint Pain — Osteoarthritis | complaint | Chronic MSK. Overlap with ortho | low | yes | yes |
| `gp-eye-redness-conjunctivitis` | Red Eye — Conjunctivitis | complaint | Common eye complaint in GP. Overlap with ophth | low | yes | no |
| `gp-hypertension-followup` | Hypertension — Follow-up | diagnosis_followup | One of the most common chronic disease follow-ups | low | yes | yes |
| `gp-diabetes-followup` | Diabetes — Follow-up | diagnosis_followup | Extremely common chronic follow-up | medium | yes | yes |

## Pediatrics (12 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `peds-fever-infant` | Fever in Infant (<3mo) | complaint | High-risk. Needs distinct workflow from older children | high | yes | yes |
| `peds-fever-child` | Fever in Child (>3mo) | complaint | Extremely common | medium | yes | yes |
| `peds-cough-bronchiolitis` | Cough — Bronchiolitis | complaint | Common in infants/toddlers. Distinct from adult bronchitis | medium | yes | yes |
| `peds-ear-pain-ottitis-media` | Ear Pain — Acute Otitis Media | complaint | Very common pediatric diagnosis | low | yes | yes |
| `peds-diarrhea-gastroenteritis` | Diarrhea — Acute Gastroenteritis | complaint | Dehydration risk | medium | yes | yes |
| `peds-rash-viral-exanthem` | Rash — Viral Exanthem | complaint | Common. Differentiates viral vs allergic vs serious | low | yes | no |
| `peds-sore-throat-strep` | Sore Throat — Strep Pharyngitis | complaint | Common in school-age children | low | yes | yes |
| `peds-vomiting-gastroenteritis` | Vomiting — Acute Gastroenteritis | complaint | Dehydration risk in young children | medium | yes | yes |
| `peds-abdominal-pain-constipation` | Abdominal Pain — Constipation | complaint | Common functional cause | low | yes | no |
| `peds-wheezing-asthma` | Wheezing — Asthma Exacerbation | complaint | Common in children with known asthma | high | yes | yes |
| `peds-urinary-symptoms-uti` | Dysuria — UTI | complaint | High risk of renal scarring in young children | medium | yes | yes |
| `peds-well-child-check` | Well Child Check | visit_admin | Routine preventive visit. Growth and development | low | no | no |

## OB/GYN (10 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `obgyn-vaginal-discharge-candidiasis` | Vaginal Discharge — Candidiasis | complaint | Most common vaginal complaint | low | yes | yes |
| `obgyn-vaginal-discharge-bv` | Vaginal Discharge — Bacterial Vaginosis | complaint | Second most common. Differentiates from candidiasis | low | yes | yes |
| `obgyn-pelvic-pain-pid` | Pelvic Pain — PID | complaint | Serious. Needs prompt treatment | high | yes | yes |
| `obgyn-abnormal-uterine-bleeding` | Abnormal Uterine Bleeding | complaint | Common gynecological complaint. Broad differential | medium | yes | yes |
| `obgyn-amenorrhea-pregnancy` | Amenorrhea — Pregnancy | complaint | Common presentation. First step is pregnancy test | low | yes | yes |
| `obgyn-dysmenorrhea-primary` | Dysmenorrhea — Primary | complaint | Common | low | yes | no |
| `obgyn-prenatal-first-visit` | Pregnancy — First Prenatal Visit | diagnosis_followup | Initial booking | low | yes | yes |
| `obgyn-prenatal-routine` | Pregnancy — Routine Antenatal | diagnosis_followup | Standard follow-up | low | no | yes |
| `obgyn-contraception-counseling` | Contraception Counseling | visit_admin | Non-illness visit | low | no | no |
| `obgyn-menopause-symptoms` | Menopause — Symptoms | complaint | Common perimenopausal presentation | low | yes | yes |

## Orthopedics / MSK (12 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `msk-low-back-pain-mechanical` | Low Back Pain — Mechanical | complaint | Top MSK complaint | medium | yes | yes |
| `msk-neck-pain-cervical` | Neck Pain — Cervical Strain | complaint | Common | medium | yes | yes |
| `msk-knee-pain-osteoarthritis` | Knee Pain — Osteoarthritis | complaint | Common chronic joint pain | low | yes | yes |
| `msk-shoulder-pain-rotator-cuff` | Shoulder Pain — Rotator Cuff | complaint | Common | low | yes | yes |
| `msk-ankle-sprain` | Ankle Sprain | complaint | Acute injury. Common in OPD | low | yes | no |
| `msk-wrist-pain-carpal-tunnel` | Wrist Pain — Carpal Tunnel | complaint | Common neuropathic MSK | low | yes | yes |
| `msk-hip-pain-osteoarthritis` | Hip Pain — Osteoarthritis | complaint | Common in elderly | low | yes | yes |
| `msk-elbow-pain-epicondylitis` | Elbow Pain — Epicondylitis | complaint | Tennis/golfer elbow | low | yes | no |
| `msk-foot-pain-plantar-fasciitis` | Foot Pain — Plantar Fasciitis | complaint | Common | low | yes | no |
| `msk-fracture-suspected` | Limb Pain — Suspected Fracture | complaint | Acute trauma | medium | yes | yes |
| `msk-gout-flare` | Joint Pain — Gout Flare | complaint | Acute monoarthritis | low | yes | yes |
| `msk-post-op-followup` | Post-Op Follow-up | diagnosis_followup | Surgical follow-up common in ortho OPD | low | yes | no |

## ENT (8 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `ent-sore-throat-streptococcal` | Sore Throat — Strep Pharyngitis | complaint | Top ENT complaint | low | yes | yes |
| `ent-ear-pain-ottitis-media` | Ear Pain — Acute Otitis Media | complaint | Common | low | yes | yes |
| `ent-hearing-loss-conductive` | Hearing Loss — Conductive | complaint | Common referral to ENT | low | yes | yes |
| `ent-nasal-congestion-sinusitis` | Nasal Congestion — Sinusitis | complaint | Common | low | yes | yes |
| `ent-dizziness-vertigo` | Dizziness — BPPV | complaint | Vestibular. Common in ENT OPD | medium | yes | yes |
| `ent-epistaxis-nosebleed` | Nosebleed — Epistaxis | complaint | Common ENT presentation | medium | yes | yes |
| `ent-lump-neck-lymphadenopathy` | Lump in Neck — Lymphadenopathy | complaint | Differential includes infection vs malignancy | high | yes | yes |
| `ent-hoarseness-laryngitis` | Hoarseness — Laryngitis | complaint | Common voice complaint | low | yes | no |

## Dermatology (8 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `derm-itchy-rash-contact-dermatitis` | Itchy Rash — Contact Dermatitis | complaint | Common | low | yes | no |
| `derm-itchy-rash-atopic-dermatitis` | Itchy Rash — Atopic Dermatitis/Eczema | complaint | Very common. Chronic | low | yes | no |
| `derm-acne-vulgaris` | Acne — Vulgaris | complaint | Extremely common in adolescents | low | yes | no |
| `derm-skin-lesion-suspicious` | Skin Lesion — Suspicious | complaint | Malignancy concern | high | yes | no |
| `derm-fungal-infection-tinea` | Rash — Fungal (Tinea) | complaint | Common superficial infection | low | yes | yes |
| `derm-psoriasis-plaque` | Scaly Plaques — Psoriasis | complaint | Chronic autoimmune skin condition | low | yes | yes |
| `derm-wart-viral` | Skin Growth — Viral Wart | complaint | Common benign lesion | low | yes | no |
| `derm-urticaria-hives` | Hives — Urticaria | complaint | Common allergic presentation | low | yes | no |

## Ophthalmology (6 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `ophth-red-eye-conjunctivitis` | Red Eye — Conjunctivitis | complaint | Most common eye complaint | low | yes | yes |
| `ophth-red-eye-keratitis` | Red Eye — Keratitis | complaint | Vision-threatening. Differentiates from conjunctivitis | high | yes | yes |
| `ophth-vision-loss-sudden` | Vision Loss — Sudden | complaint | Emergency | high | yes | yes |
| `ophth-dry-eye` | Dry Eye | complaint | Very common chronic problem | low | yes | no |
| `ophth-eye-trauma` | Eye Trauma | complaint | Acute presentation | high | yes | yes |
| `ophth-glaucoma-screening` | Glaucoma — Screening/Follow-up | diagnosis_followup | Chronic disease follow-up | low | yes | yes |

## Psychiatry / Mental Health (6 workflows)

| workflow_id | display_name | mode | rationale | safety | red_flags | ICD |
|------------|-------------|------|----------|--------|-----------|-----|
| `psych-depression-major-depressive` | Depression — Major Depressive Episode | complaint | Top psychiatric presentation | high | yes | yes |
| `psych-anxiety-generalized` | Anxiety — Generalized Anxiety | complaint | Extremely common | medium | yes | no |
| `psych-panic-attack` | Panic Attack / Panic Disorder | complaint | Distinct from GAD. ER/high care overlap | high | yes | yes |
| `psych-insomnia-primary` | Insomnia — Primary | complaint | Sleep complaint. Overlap with GP | low | no | no |
| `psych-bipolar-followup` | Bipolar — Follow-up | diagnosis_followup | Chronic mood disorder | high | yes | yes |
| `psych-ptsd-assessment` | PTSD — Assessment | complaint | Trauma-related | high | yes | no |

---

## Summary

| Specialty | Planned |
|-----------|---------|
| General Medicine / GP | 18 |
| Pediatrics | 12 |
| OB/GYN | 10 |
| Orthopedics / MSK | 12 |
| ENT | 8 |
| Dermatology | 8 |
| Ophthalmology | 6 |
| Psychiatry / Mental Health | 6 |
| **Total** | **80** |

## Mode Key

- **complaint**: Patient presents with a symptom. Workflow guides differential and documentation.
- **diagnosis_followup**: Patient has an established diagnosis. Workflow guides follow-up documentation.
- **visit_admin**: Non-illness visit (check-up, counseling, certificate). Minimal clinical content.

## Safety Risk Key

- **low**: Routine. Unlikely to miss serious condition if workflow is followed.
- **medium**: Requires awareness. Patient could deteriorate if not escalated.
- **high**: Potentially serious or life-threatening. Must include red flags and escalation prompts.

## Planned Workflow Counts vs Target

| Specialty | Target | Planned | Status |
|-----------|--------|---------|--------|
| General Medicine / GP | 18 | 18 | Meets target |
| Pediatrics | 12 | 12 | Meets target |
| OB/GYN | 10 | 10 | Meets target |
| Orthopedics / MSK | 12 | 12 | Meets target |
| ENT | 8 | 8 | Meets target |
| Dermatology | 8 | 8 | Meets target |
| Ophthalmology | 6 | 6 | Meets target |
| Psychiatry / Mental Health | 6 | 6 | Meets target |
| **Total** | **80** | **80** | **Meets target** |
