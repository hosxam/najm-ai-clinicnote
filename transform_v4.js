const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'najm-ai-clinicnote/v4_advanced_encounter.js');
let content = fs.readFileSync(filePath, 'utf8');

// Step 1: Remove _v4norm, _v4section (already replaced with buildV4NoteModel and V4_FOOTER - just ensure they're gone)
// Actually they were replaced in the first edit. Let me check.

// Step 2: Remove old helper functions (they may still exist or were partially replaced)
// Remove _v4collectPlanOpts, _v4collectExamItems, _v4collectInvItems, _v4cleanText
content = content.replace(/  function _v4collectPlanOpts\(\) \{[\s\S]*?    return opts;\n  \}\n/g, '');
content = content.replace(/  function _v4collectExamItems\(\) \{[\s\S]*?    return items;\n  \}\n/g, '');
content = content.replace(/  function _v4collectInvItems\(\) \{[\s\S]*?    return items;\n  \}\n/g, '');
content = content.replace(/  function _v4cleanText\(text\) \{[\s\S]*?      \.trim\(\);\n  \}\n/g, '');

// Step 3: Remove old pipeline functions
// cleanV4OutputPhrase
content = content.replace(/  function cleanV4OutputPhrase\(text\) \{[\s\S]*?    return text;\n  \}\n\n/g, '');
// cleanV4OutputLines
content = content.replace(/  function cleanV4OutputLines\(lines\) \{[\s\S]*?    return out;\n  \}\n\n/g, '');
// mergeFollowUpFragments
content = content.replace(/  function mergeFollowUpFragments\(lines\) \{[\s\S]*?    return lines;\n  \}\n\n/g, '');
// combinePlanPairs
content = content.replace(/  function combinePlanPairs\(lines\) \{[\s\S]*?    return lines;\n  \}\n\n/g, '');
// polishV4Line
content = content.replace(/  function polishV4Line\(text\) \{[\s\S]*?    return text;\n  \}\n\n/g, '');
// collectV4State
content = content.replace(/  function collectV4State\(\) \{[\s\S]*?    return raw;\n  \}\n\n/g, '');
// normalizeV4State
content = content.replace(/  function normalizeV4State\(raw\) \{[\s\S]*?    return raw;\n  \}\n\n/g, '');
// routeV4Content
content = content.replace(/  function routeV4Content\(normalized\) \{[\s\S]*?    return route;\n  \}\n/g, '');

// Step 4: Remove duplicate RENDERERS section marker that was added
content = content.replace(/\n  \/\/ ================================================================\n  \/\/  RENDERERS\n  \/\/ ================================================================\n\n/g, '\n');

// Step 5: Remove duplicate collectRawState (the second one)
// Find the first collectRawState and keep only it
const rawStateMatch = content.match(/(  function collectRawState\(\) \{[\s\S]*?    \};\n  \})/);
if (rawStateMatch) {
  const firstRawState = rawStateMatch[1];
  // Remove the second occurrence
  content = content.replace(firstRawState + '\n\n  function collectRawState() {', firstRawState + '\n');
}

// Step 6: Remove duplicate SIDEBAR section header if any
content = content.replace(/\n  \/\/ ================================================================\n  \/\/  SIDEBAR\n  \/\/ ================================================================\n  \/\/ ================================================================\n  \/\/  SIDEBAR\n  \/\/ ================================================================\n/g, '\n  // ================================================================\n  //  SIDEBAR\n  // ================================================================\n');

// Step 7: Add transformPromptToNoteText and normalizeV4SelectionsToNoteModel between buildV4NoteModel and collectRawState
const noteModelEnd = '    };\n  }';
const rawStateStart = '\n  function collectRawState() {';

// Find where buildV4NoteModel ends and collectRawState starts
const modelEndIdx = content.indexOf('  function collectRawState() {');
if (modelEndIdx >= 0) {
  // Find the blank line before collectRawState
  const beforeRawState = content.lastIndexOf('\n\n', modelEndIdx);
  const insertPoint = beforeRawState >= 0 ? beforeRawState : modelEndIdx;
  
  const newFunctions = `

  function transformPromptToNoteText(text) {
    if (!text) return '';
    text = String(text).trim();
    var omitPhrases = /^(temperature|heart rate|pulse|respiratory rate|oxygen saturation|blood pressure|weight( and bmi)?|general appearance|gait|hydrat(ion| status|ion status)|oropharyngeal examination|cervical lymphadenopathy|chest (wall examination|auscultation)|meningeal signs|tonsillar appearance|fundal height|fetal (heart auscultation|movement)|lower limb oedema|throat examination|otoscopy|respiratory effort|abdominal examination|skin rash|non-blanching rash|capillary refill|urine output context|lumbar range of motion|spinal tenderness|straight leg raise|crossed straight leg raise|lower limb (power|sensation|reflexes)|saddle sensation|neurovascular status|foot inspection|peripheral pulses|monofilament sensation|injection sites|parent or guardian report context|general appearance and activity level)$/i;
    text = text.replace(/\\s*documented\\s+if\\s+(assessed|measured|discussed|clinician\\s+decided|arranged|relevant(\\s+and\\s+assessed)?)\\s*\\.?\\s*$/i, '');
    text = text.replace(/\\s*recorded\\s+if\\s+measured\\s*\\.?\\s*$/i, '');
    text = text.replace(/\\s*reviewed\\s+if\\s+(available|ordered|relevant|performed)\\s*\\.?\\s*$/i, '');
    text = text.replace(/\\s*documented\\s+only\\s+if\\s+clinician\\s+(decided|did so|arranged)\\s*\\.?\\s*$/i, '');
    text = text.replace(/\\s*documented\\s+if\\s+(the\\s+)?clinician\\s+(decided|did so|arranged)\\s*\\.?\\s*$/i, '');
    text = text.replace(/\\s*reviewed\\s+or\\s+discussed\\s*(documented\\s+if\\s+clinician\\s+did\\s+so)?\\s*\\.?\\s*$/i, '');
    text = text.replace(/^Rapid test result$/i, 'Rapid test');
    text = text.replace(/^(Cbc|Crp|Chest imaging|HbA1c|Renal function|Lipid profile|Urine acr|Home glucose log|Previous imaging|X-ray|Mri report|Inflammatory markers|Urinalysis|Cultures|Blood pressure trend|Antenatal labs|Glucose screening result|Ultrasound report|Urine dipstick)$/i, '$1 reviewed');
    text = text.replace(/^supportive care( advice| discussed)?$/i, 'Supportive care advised');
    text = text.replace(/^return precautions$/i, 'Return precautions discussed');
    text = text.replace(/^follow-up arranged$/i, 'Follow-up arranged');
    text = text.replace(/^hydration and rest advice$/i, 'Hydration and rest advised');
    text = text.replace(/^lifestyle advice$/i, 'Lifestyle advice discussed');
    text = text.replace(/^activity modification$/i, 'Activity modification discussed');
    text = text.replace(/^red flags explained$/i, 'Red flags explained');
    text = text.replace(/^parent or guardian advice$/i, 'Parent or guardian advice discussed');
    text = text.replace(/^hydration and feeding advice$/i, 'Hydration and feeding advised');
    text = text.replace(/^antenatal counseling$/i, 'Antenatal counseling discussed');
    text = text.replace(/^warning symptoms$/i, 'Warning symptoms discussed');
    if (omitPhrases.test(text)) return '';
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.?!]$/.test(text)) text += '.';
    return text;
  }

  function normalizeV4SelectionsToNoteModel(state$) {
    var model = buildV4NoteModel(state$);
    var ges = window.V4_ENCOUNTER_STATE;
    var hf = ges.history.fields || state$.historyFields || {};
    model.subjective.symptoms = (ges.selectedChips.symptoms || []).map(function(s) { return s.toLowerCase(); });
    model.subjective.associatedSymptoms = (ges.customEntries.symptoms || []).slice();
    for (var k in hf) {
      var v = (hf[k] || '').trim();
      if (!v) continue;
      var kl = k.toLowerCase();
      if (kl.indexOf('duration') >= 0 && kl.indexOf('duration') < 5) {
        model.subjective.duration = v;
      } else if (kl.indexOf('negatives') >= 0) {
        var negParts = v.split(/[,;]+/).map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
        for (var ni = 0; ni < negParts.length; ni++) {
          if (model.subjective.relevantNegatives.indexOf(negParts[ni]) < 0) model.subjective.relevantNegatives.push(negParts[ni]);
        }
      } else if (kl.indexOf('associated') >= 0 || kl.indexOf('symptoms_if') >= 0) {
        model.subjective.associatedSymptoms.push(v);
      } else if (kl.indexOf('additional') >= 0) {
      } else if (!model.subjective.chiefConcern) {
        model.subjective.chiefConcern = v;
      }
    }
    var negs = (ges.selectedChips.relevant_negatives || []).concat(ges.customEntries.relevant_negatives || []);
    for (var ni2 = 0; ni2 < negs.length; ni2++) {
      var n = negs[ni2].toLowerCase().trim();
      if (n && model.subjective.relevantNegatives.indexOf(n) < 0) model.subjective.relevantNegatives.push(n);
    }
    var examChips = (ges.selectedChips.exam_findings || []).concat(ges.customEntries.exam_findings || []);
    for (var ei = 0; ei < examChips.length; ei++) {
      var cleaned = transformPromptToNoteText(examChips[ei]);
      if (cleaned) model.objective.examFindings.push(cleaned);
    }
    var exam = getExamDetails(state$.workflowId);
    if (exam && exam.exam_groups) {
      for (var gi = 0; gi < exam.exam_groups.length; gi++) {
        var group = exam.exam_groups[gi];
        for (var pi = 0; pi < group.prompts.length; pi++) {
          var key = group.group_id + '::' + group.prompts[pi].prompt_id;
          if (state$.examConfirmations[key]) {
            var cleaned2 = transformPromptToNoteText(group.prompts[pi].prompt_text);
            if (cleaned2) model.objective.examFindings.push(cleaned2);
          }
        }
      }
    }
    var examSeen = {};
    model.objective.examFindings = model.objective.examFindings.filter(function(f) {
      var key = f.toLowerCase().trim();
      if (!key || examSeen[key]) return false;
      examSeen[key] = true;
      return true;
    });
    var invChips = (ges.selectedChips.investigations || []).concat(ges.customEntries.investigations || []);
    for (var ii = 0; ii < invChips.length; ii++) {
      var cleanedInv = transformPromptToNoteText(invChips[ii]);
      if (cleanedInv) model.objective.investigations.push(cleanedInv);
    }
    var inv = getInvestigationOptions(state$.workflowId);
    if (inv && inv.investigation_groups) {
      for (var ivi = 0; ivi < inv.investigation_groups.length; ivi++) {
        var ig = inv.investigation_groups[ivi];
        for (var oi = 0; oi < ig.options.length; oi++) {
          var ikey = ig.group_id + '::' + ig.options[oi].option_id;
          if (state$.investigationConfirmations[ikey]) {
            var cleanedInv2 = transformPromptToNoteText(ig.options[oi].option_text);
            if (cleanedInv2) model.objective.investigations.push(cleanedInv2);
          }
        }
      }
    }
    var invSeen = {};
    model.objective.investigations = model.objective.investigations.filter(function(f) {
      var key = f.toLowerCase().trim();
      if (!key || invSeen[key]) return false;
      invSeen[key] = true;
      return true;
    });
    model.assessment.impression = state$.impression || '[not documented]';
    var planChips = (ges.selectedChips.plan_phrases || []).concat(ges.customEntries.plan_phrases || []);
    for (var pci = 0; pci < planChips.length; pci++) {
      var cleanedPlan = transformPromptToNoteText(planChips[pci]);
      if (cleanedPlan) model.plan.advice.push(cleanedPlan);
    }
    var planOpts = getPlanOptions(state$.workflowId);
    if (planOpts && planOpts.plan_option_groups) {
      for (var pgi = 0; pgi < planOpts.plan_option_groups.length; pgi++) {
        var pg = planOpts.plan_option_groups[pgi];
        for (var poi = 0; poi < pg.options.length; poi++) {
          var opt = pg.options[poi];
          if (state$.planConfirmations[opt.option_id]) {
            var cleanedOpt = transformPromptToNoteText(opt.option_text);
            if (!cleanedOpt) continue;
            var cat = (opt.option_category || '').toLowerCase();
            if (cat === 'follow_up') {
              model.plan.followUp.push(cleanedOpt);
            } else if (cat === 'safety_netting') {
              model.plan.safetyNetting.push(cleanedOpt);
            } else if (cat.indexOf('referral') >= 0) {
              model.plan.referrals.push(cleanedOpt);
            } else if (cat.indexOf('investigation') >= 0 || cat.indexOf('diagnostic') >= 0) {
              model.plan.investigations.push(cleanedOpt);
            } else {
              model.plan.advice.push(cleanedOpt);
            }
          }
        }
      }
    }
    if (state$.planText) {
      model.plan.advice.push(state$.planText);
    }
    var fupChips = (ges.selectedChips.follow_up || []).concat(ges.customEntries.follow_up || []);
    for (var fci = 0; fci < fupChips.length; fci++) {
      var cleanedFup = transformPromptToNoteText(fupChips[fci]);
      if (cleanedFup) model.plan.followUp.push(cleanedFup);
    }
    var planAdviceSeen = {};
    model.plan.advice = model.plan.advice.filter(function(a) {
      var key = a.toLowerCase().trim();
      if (!key || planAdviceSeen[key]) return false;
      planAdviceSeen[key] = true;
      return true;
    });
    return model;
  }

`;
  content = content.slice(0, insertPoint) + content.slice(insertPoint);
  content = content.slice(0, insertPoint) + newFunctions + content.slice(insertPoint);
}

// Step 8: Update debug panel in updateSidebar to use new API
const oldDebug = `      var raw = collectV4State();
      var route = routeV4Content(normalizeV4State(raw));
      var dbg = '<div style="font-weight:700;margin-bottom:8px;color:#0c4a6e;font-size:12px">[DEBUG] V4 Pipeline</div>';
      dbg += '<div>Workflow: ' + esc(raw.workflowId) + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Selected chips:</div>';
      for (var dg in raw.chips) {
        dbg += '<div>' + dg + ': ' + (raw.chips[dg]||[]).length + ' items</div>';
      }
      dbg += '<div style="margin-top:6px;font-weight:600">History fields:</div>';
      var histCount = 0;
      for (var fk in raw.historyFields) { if (raw.historyFields[fk]) histCount++; }
      dbg += '<div>filled: ' + histCount + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Routed content:</div>';
      dbg += '<div>historyLines: ' + (route.historyLines||[]).length + '</div>';
      dbg += '<div>relevantNegativeLines: ' + (route.relevantNegativeLines||[]).length + '</div>';
      dbg += '<div>examinationLines: ' + (route.examinationLines||[]).length + '</div>';
      dbg += '<div>investigationLines: ' + (route.investigationLines||[]).length + '</div>';
      dbg += '<div>assessmentLines: ' + (route.assessmentLines||[]).length + '</div>';
      dbg += '<div>planLines: ' + (route.planLines||[]).length + '</div>';
      dbg += '<div>followUpLines: ' + (route.followUpLines||[]).length + '</div>';`;

const newDebug = `      var raw = collectRawState();
      var model = normalizeV4SelectionsToNoteModel(raw);
      var dbg = '<div style="font-weight:700;margin-bottom:8px;color:#0c4a6e;font-size:12px">[DEBUG] V4 Pipeline</div>';
      dbg += '<div>Workflow: ' + esc(raw.workflowId) + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Subjective:</div>';
      dbg += '<div>symptoms: ' + (model.subjective.symptoms.length + model.subjective.associatedSymptoms.length) + ' items</div>';
      dbg += '<div>negatives: ' + model.subjective.relevantNegatives.length + ' items</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Objective:</div>';
      dbg += '<div>examFindings: ' + model.objective.examFindings.length + ' items</div>';
      dbg += '<div>investigations: ' + model.objective.investigations.length + ' items</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Assessment:</div>';
      dbg += '<div>impression: ' + (model.assessment.impression !== '[not documented]' ? 'Entered' : 'Not entered') + '</div>';
      dbg += '<div style="margin-top:6px;font-weight:600">Plan:</div>';
      dbg += '<div>advice: ' + model.plan.advice.length + ' items</div>';
      dbg += '<div>safetyNetting: ' + model.plan.safetyNetting.length + ' items</div>';
      dbg += '<div>followUp: ' + model.plan.followUp.length + ' items</div>';`;

if (content.includes(oldDebug)) {
  content = content.replace(oldDebug, newDebug);
} else {
  // Fallback: the debug panel may have already been modified by earlier edits
  console.log('Debug panel pattern not found - checking for partial match');
}

// Step 9: Fix duplicate _v4norm/_v4section creation (replace with empty if they got duplicated)
// Check if _v4norm still exists (old code)
const v4normMatch = content.match(/  function _v4norm\(t\) \{ return String\(t\)/);
if (v4normMatch) {
  console.log('Warning: _v4norm still found in file');
}

// Step 10: Check for stray _v4collectPlanOpts references
if (content.includes('_v4collectPlanOpts()') || content.includes('_v4collectExamItems()') || content.includes('_v4collectInvItems()')) {
  console.log('ERROR: Residual references to old functions found');
}

// Step 11: Write the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done. File written successfully.');
