# Google Forms Field Specification

All forms must include the required no-PHI warning in the form description before any fields.

## Form A: Suggest a Template / Give Feedback

Required warning:

> Do not submit patient names, medical record numbers, phone numbers, exact dates of birth, addresses, Emirates ID, insurance IDs, clinical notes, or any patient-identifiable information.

Fields:

1. Role
   - Type: multiple choice
   - Options: Doctor, Intern, Resident, Medical student, Clinic owner, Other

2. Specialty
   - Type: multiple choice
   - Options: General Medicine / GP, Orthopedics / MSK, Pediatrics, ENT, Dermatology, OB/GYN, Ophthalmology, Psychiatry / Mental Health, Emergency / Urgent Care, Cardiology, Neurology, Other

3. Country / region
   - Type: short answer

4. What is missing?
   - Type: multiple choice
   - Options: New specialty, New workflow/complaint, Better output wording, More patient instructions, More referral templates, Medical report improvement, Export issue, Other

5. Missing template or workflow name
   - Type: short answer

6. Output format needed
   - Type: multiple choice
   - Options: SOAP, EMR summary, Referral, Patient instructions, Medical report draft, Follow-up note, Other

7. How often would you use this?
   - Type: multiple choice
   - Options: Daily, Weekly, Occasionally, Not sure

8. Optional feedback
   - Type: paragraph
   - Helper text: General product feedback only. Do not include patient details, clinical notes, or generated outputs.

9. Optional email
   - Type: short answer

10. Interested in future Najm AI Scribe updates?
    - Type: multiple choice
    - Options: Yes, No

## Form B: Bug Report

Required warning:

> Do not include patient information, clinical notes, generated outputs, or screenshots containing patient data.

Fields:

1. What went wrong?
   - Type: multiple choice
   - Options: Search issue, Chips not loading, Output issue, Copy/export issue, Medical Report issue, Mobile issue, Page not loading, Other

2. Page/tool affected
   - Type: multiple choice
   - Options: OPD Note Builder, Medical Report Draft, Referral, Patient Instructions, SEO page, Other

3. Browser/device
   - Type: short answer

4. Steps to reproduce
   - Type: paragraph
   - Helper text: Use generic steps only. Do not paste clinical notes or generated output.

5. Screenshot link if available
   - Type: short answer
   - Helper text: Only share screenshots that contain no patient data.

6. Optional email
   - Type: short answer

## Form C: Najm AI Scribe Interest

Required warning:

> Do not submit patient data or consultation recordings. This is only an interest form for future updates.

Fields:

1. I am a:
   - Type: multiple choice
   - Options: Doctor, Clinic owner, Hospital/clinic manager, Research collaborator, Other

2. Specialty / clinic type
   - Type: short answer

3. Country / region
   - Type: short answer

4. What are you interested in?
   - Type: multiple choice
   - Options: AI Scribe updates, Clinic pilot, Research collaboration, Hospital deployment, Pricing later, Other

5. Current documentation pain point
   - Type: multiple choice
   - Options: OPD notes, Referrals, Medical reports, Patient instructions, EMR workload, Audio transcription, Other

6. Optional message
   - Type: paragraph
   - Helper text: Do not include patient data, clinical notes, or consultation recordings.

7. Email
   - Type: short answer

