# Speed Optimization Plan

## Goal

Reduce OPD note generation time to under 60 seconds by giving doctors a safe, editable starting point for common workflows.

## Current Issue

The current OPD workflow is safe and flexible, but the doctor starts from many blank or unselected choices. For high-volume complaints, that creates repeated clicking before the doctor can enter the final impression and plan.

## Speed Preset Principle

Future Speed Optimization should pre-load common default chips for selected workflows:

Specialty -> Workflow -> default chips pre-selected -> doctor unticks or adjusts -> doctor enters impression and plan -> Generate Note.

Defaults are suggestions only. They must never imply that something was assessed, ruled out, diagnosed, or treated unless the doctor keeps that item selected.

## Maximum Always-Visible Mandatory Fields

Speed mode should keep no more than 7 always-visible mandatory fields:

1. Specialty
2. Chief Complaint / Workflow
3. Duration
4. Key Positives
5. Key Negatives / Red Flags Ruled Out
6. Doctor-Entered Impression
7. Doctor-Entered Plan

## Optional Collapsed Sections

The following sections can remain collapsed unless needed:

- Examination details
- Investigations
- Referral
- Follow-up interval
- Additional history

## Safety Rules

- Defaults are suggestions only.
- Doctors must be able to untick any default.
- Select only what was assessed, discussed, reviewed, or documented.
- Do not invent diagnoses.
- Do not invent treatments.
- Do not include medication dosing in presets.
- Do not add emergency management instructions to presets.
- Doctor-entered impression and doctor-entered plan remain required.
- Clinician review is required before use.

## Step 10A Scope

This phase creates only:

- A data schema for speed presets.
- A starter `data/speed_presets.json` file for 10 high-value workflows.
- A validator to ensure presets reference existing workflow chips safely.

This phase does not change the live UI, preselect chips in the app, or change output generation logic.
