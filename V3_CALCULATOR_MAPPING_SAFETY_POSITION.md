# V3 Calculator Mapping Safety Position

## Purpose

The v3 calculator workflow map is a data-only architecture layer for future optional calculator suggestions. It connects existing ClinicNote workflows to calculator IDs that may be relevant for documentation context.

## Safety Position

Calculator mappings are optional documentation suggestions only. A mapping does not mean a calculator is required, clinically indicated, or appropriate for every patient with that complaint.

Calculator mappings must not:

- diagnose a condition
- recommend treatment
- recommend referral or disposition
- recommend investigations
- imply guideline compliance
- claim endorsement from NHS, NICE, DHA, MOHAP, or any authority
- insert calculator results into notes automatically

High-risk calculators remain registry-only unless a later phase separately implements, verifies, tests, and reviews them.

## Clinician Control

Any future calculator suggestion must be clinician-controlled. The clinician decides whether a calculator is relevant, enters values manually, interprets the result, and decides whether any result belongs in a note.

Local policy, source verification, and clinician judgment apply.

## Privacy

This mapping file does not collect values. Future calculator use must remain client-side unless a later privacy review explicitly approves a different architecture. No patient information should leave the browser.

## Current Status

This phase does not change the live UI. It does not surface suggestions, implement new formulas, or change OPD or Medical Report generation.
