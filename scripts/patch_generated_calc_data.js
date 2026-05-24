#!/usr/bin/env node
/**
 * Surgical patch: replace the cha2ds2_vasc / has_bled / news2 calculator entries
 * inside GENERATED_CLINICAL_DATA.js with their implemented counterparts from
 * the v3 calculator registry, and append the new egfr_ckd_epi entry. Line endings
 * are preserved (CRLF in / CRLF out).
 *
 * This avoids regenerating the whole bundle (which would change every line's EOL
 * and produce a useless multi-megabyte diff).
 *
 * Run after editing data/v3_calculator_registry.json.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GEN_PATH = path.join(ROOT, 'GENERATED_CLINICAL_DATA.js');
const REG_PATH = path.join(ROOT, 'data', 'v3_calculator_registry.json');

const registry = JSON.parse(fs.readFileSync(REG_PATH, 'utf8'));

function findCalc(id) {
  const calc = registry.find((c) => c.calculator_id === id);
  if (!calc) throw new Error(`Calculator ${id} not found in registry`);
  return calc;
}

// Serialize a calculator object as it appears inside the GENERATED_CLINICAL_DATA
// "calculators" map. Indent matches the surrounding 4-space block (calculators
// map keys are at 4 spaces; values open at 4 spaces; properties at 6 spaces).
function serializeCalc(id, obj, indent = '    ') {
  const json = JSON.stringify(obj, null, 2);
  // Re-indent: each line gets 4 leading spaces (matching the calculators-map block)
  const lines = json.split('\n').map((line) => indent + line);
  return `${indent}"${id}": ${lines.join('\n').slice(indent.length)}`;
}

const text = fs.readFileSync(GEN_PATH, 'utf8');

// Detect line ending used by the file
const eol = text.includes('\r\n') ? '\r\n' : '\n';

// Build a regex that matches a single calculator entry inside the calculators map.
// Entry structure: a key name, followed by a JSON object that ends with `    }`
// followed by either `,` (more entries) or nothing (last entry). Because we know
// the indentation (calculators map values use 4-space outer indent + 2-space step),
// we can match from `    "<id>": {` up to the matching `    }` followed by `,` or
// next sibling.
function replaceCalc(haystack, id, replacementObj) {
  // Match from `    "id": {` to the closing `    },` or `    }` line
  const startMarker = `    "${id}": {`;
  const startIdx = haystack.indexOf(startMarker);
  if (startIdx === -1) throw new Error(`Could not find start marker for ${id}`);

  // Walk forward from startIdx, balancing braces
  let i = haystack.indexOf('{', startIdx);
  let depth = 0;
  for (; i < haystack.length; i++) {
    const ch = haystack[i];
    if (ch === '"') {
      // skip string literal
      i++;
      while (i < haystack.length) {
        if (haystack[i] === '\\') {
          i += 2;
          continue;
        }
        if (haystack[i] === '"') break;
        i++;
      }
    } else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (i >= haystack.length) throw new Error(`Could not find end of ${id}`);

  const endIdx = i + 1; // include closing }

  const replacement = serializeCalc(id, replacementObj).replace(/\n/g, eol);
  return haystack.slice(0, startIdx) + replacement + haystack.slice(endIdx);
}

function appendCalc(haystack, id, obj) {
  // Find the closing of the calculators map: the line `  },` that closes it.
  // The calculators map opens with `  "calculators": {` and closes with the
  // matching `  }` at indent 2.
  const calcMapStart = haystack.indexOf(`  "calculators": {`);
  if (calcMapStart === -1) throw new Error('calculators map not found');

  // Walk forward balancing braces from the opening `{` of calculators
  let i = haystack.indexOf('{', calcMapStart);
  let depth = 0;
  for (; i < haystack.length; i++) {
    const ch = haystack[i];
    if (ch === '"') {
      i++;
      while (i < haystack.length) {
        if (haystack[i] === '\\') { i += 2; continue; }
        if (haystack[i] === '"') break;
        i++;
      }
    } else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  // i is now at the closing `}` of the calculators map.
  // Insert before this closing brace, after a comma on the previous entry.
  // We need to add a comma to the previous entry's closing brace.
  const closing = i;
  // Find the previous non-whitespace char before the closing `}` to add `,` after it.
  let j = closing - 1;
  while (j >= 0 && /[\s\r\n]/.test(haystack[j])) j--;
  if (haystack[j] !== '}') throw new Error('expected previous entry to end with }');
  // Insert "," after position j
  const before = haystack.slice(0, j + 1);
  const after = haystack.slice(j + 1);

  const entry = serializeCalc(id, obj).replace(/\n/g, eol);
  return before + ',' + eol + entry + after;
}

let out = text;
out = replaceCalc(out, 'cha2ds2_vasc', findCalc('cha2ds2_vasc'));
out = replaceCalc(out, 'has_bled', findCalc('has_bled'));
out = replaceCalc(out, 'news2', findCalc('news2'));

// Only append egfr_ckd_epi if not already present
if (!out.includes('"egfr_ckd_epi": {')) {
  out = appendCalc(out, 'egfr_ckd_epi', findCalc('egfr_ckd_epi'));
}

fs.writeFileSync(GEN_PATH, out, 'utf8');

// Validate the resulting file is still parseable JS by re-running through Node's
// quick syntax check via vm
const vm = require('vm');
const ctx = { window: {} };
vm.createContext(ctx);
try {
  vm.runInContext(out, ctx, { filename: 'GENERATED_CLINICAL_DATA.js' });
} catch (e) {
  console.error('Syntax error after patch:', e.message);
  process.exit(1);
}

const calcMap = ctx.window.NAJM_CLINICAL_DATA.calculators;
console.log(`Patched. Calculators: ${Object.keys(calcMap).length}`);
console.log('cha2ds2_vasc status:', calcMap.cha2ds2_vasc.implementation_status);
console.log('has_bled status:', calcMap.has_bled.implementation_status);
console.log('news2 status:', calcMap.news2.implementation_status);
console.log('egfr_ckd_epi status:', calcMap.egfr_ckd_epi && calcMap.egfr_ckd_epi.implementation_status);
