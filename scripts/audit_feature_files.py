"""Audit local feature files."""
import os, json

files = [
    'index.html',
    'v2_workflow_ui_2.js',
    'v4_advanced_encounter.js',
    'calculator-tools.js',
    'export-local.js',
    'analytics-safe.js',
    'forms-config.js',
    'GENERATED_CLINICAL_DATA.js',
    'data/v3_calculator_registry.json',
    'data/v3_calculator_workflow_map.json',
]

print("=== Local Feature Files ===")
for f in files:
    exists = os.path.isfile(f)
    size = os.path.getsize(f) if exists else 0
    print(f"  {f}: {'EXISTS' if exists else 'MISSING'} ({size} bytes)")

# Check index.html for script references
with open('index.html', 'rb') as f:
    idx = f.read().decode('latin-1')

scripts = ['calculator-tools.js', 'v4_advanced_encounter.js', 'v2_workflow_ui_2.js', 
           'GENERATED_CLINICAL_DATA.js', 'export-local.js', 'forms-config.js',
           'analytics-safe.js', 'v3_history_preview.js', 'v3_exam_preview.js',
           'v3_plan_preview.js', 'v3_calculator_suggestions_preview.js',
           'v3_history_edit.js', 'v3_exam_edit.js', 'v3_plan_edit.js',
           'v3_workbench_preview.js', 'v4_encounter_builder.js',
           'calculator-tools.js']

print("\n=== Script References in index.html ===")
for s in scripts:
    found = s in idx
    print(f"  {s}: {'FOUND' if found else 'MISSING'}")

# Check calculator-tools.js for the 16 calculators
if os.path.isfile('calculator-tools.js'):
    with open('calculator-tools.js', 'rb') as f:
        calc_js = f.read().decode('latin-1')
    
    calculators = ['calculateBMI', 'calculatePackYears', 'calculateMAP', 'calculateShockIndex',
                   'classifyMRCDyspnea', 'calculatePHQ2', 'calculatePHQ9', 'calculateGAD7',
                   'calculateEpworth', 'calculateIPSS', 'calculateNYHA', 'calculateKillip',
                   'calculateSIRS', 'calculateQSOFA', 'calculateFIB4', 'calculateChildPugh']
    
    print("\n=== 16 Calculators in calculator-tools.js ===")
    for c in calculators:
        found = c in calc_js
        print(f"  {c}: {'FOUND' if found else 'MISSING'}")

# Check v4_advanced_encounter.js for calculator integration
if os.path.isfile('v4_advanced_encounter.js'):
    with open('v4_advanced_encounter.js', 'rb') as f:
        v4_js = f.read().decode('latin-1')
    
    features = ['function doCalc', 'function computeCalc', 'function toggleCalcInclude',
                'function renderCalcCard', 'calculatorResults',
                'getRelatedCalcs returns objects']
    
    print("\n=== V4 Advanced Encounter Features ===")
    for f in features:
        if f == 'getRelatedCalcs returns objects':
            found = 'getRelatedCalcs' in v4_js and 'calculator_workflow_mapping' in v4_js
        else:
            found = f in v4_js
        print(f"  {f}: {'FOUND' if found else 'MISSING'}")

# Check GENERATED_CLINICAL_DATA.js for 150 workflows
if os.path.isfile('GENERATED_CLINICAL_DATA.js'):
    with open('GENERATED_CLINICAL_DATA.js', 'rb') as f:
        gd = f.read().decode('latin-1')
    wf_count = gd.count('"workflow_id"')
    print(f"\n=== GENERATED_CLINICAL_DATA.js ===")
    print(f"  workflow_id references: {wf_count}")
    print(f"  Has calculator_workflow_mapping: {'calculator_workflow_mapping' in gd}")
    print(f"  Has nyha: {'nyha' in gd}")
