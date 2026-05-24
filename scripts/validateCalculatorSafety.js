const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CALC_PATH = path.join(ROOT, 'calculator-tools.js');
const ACTIVE_UI_PATH = path.join(ROOT, 'calculator-active-ui.js');
const INDEX_PATH = path.join(ROOT, 'index.html');

const errors = [];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function containsUnsafeClinicalPhrase(text) {
  const lower = text.toLowerCase();
  const disallowed = [
    'prescribe',
    'start antibiotic',
    'start insulin',
    'send to er',
    'call emergency services',
    'nhs approved',
    'nice compliant',
    'dha approved',
    'mohap approved'
  ];
  return disallowed.find((phrase) => lower.includes(phrase));
}

function containsDiagnosisInstruction(text) {
  const lower = text.toLowerCase();
  if (!lower.includes('diagnose')) return false;
  return !(
    lower.includes('do not diagnose') ||
    lower.includes('does not diagnose') ||
    lower.includes('not diagnose')
  );
}

const calculatorFiles = [CALC_PATH, ACTIVE_UI_PATH];
for (const filePath of calculatorFiles) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${path.basename(filePath)} must exist.`);
    continue;
  }
  const calc = read(filePath);
  const fileLabel = path.basename(filePath);

  const forbiddenRuntimeTerms = [
    /\bfetch\s*\(/i,
    /\bXMLHttpRequest\b/i,
    /\bsendBeacon\b/i,
    /\bWebSocket\b/i,
    /\bEventSource\b/i,
    /\blocalStorage\b/i,
    /\bsessionStorage\b/i,
    /\bindexedDB\b/i,
    /\bdocument\.cookie\b/i
  ];
  for (const pattern of forbiddenRuntimeTerms) {
    assert(!pattern.test(calc), `${fileLabel} contains forbidden runtime term: ${pattern}`);
  }

  assert(!/https?:\/\//i.test(calc), `${fileLabel} must not contain external API URLs.`);
  assert(!/import\s|require\s*\(/i.test(calc), `${fileLabel} must not import third-party libraries.`);

  const unsafePhrase = containsUnsafeClinicalPhrase(calc);
  assert(!unsafePhrase, `${fileLabel} contains disallowed clinical phrase "${unsafePhrase}".`);
  assert(!containsDiagnosisInstruction(calc), `${fileLabel} contains diagnosis wording outside a safety negation.`);
}

if (fs.existsSync(CALC_PATH)) {
  const calc = read(CALC_PATH);

  const requiredFunctions = [
    'calculateBMI',
    'calculatePackYears',
    'calculateMAP',
    'calculateShockIndex',
    'classifyMRCDyspnea',
    'clearCalculatorInputs',
    'getCalculatorSafetyFooter'
  ];
  for (const fn of requiredFunctions) {
    assert(calc.includes(fn), `calculator-tools.js missing ${fn}.`);
  }

  assert(calc.includes('Calculator values are processed locally in your browser'), 'calculator safety footer text is missing.');
}

if (!fs.existsSync(INDEX_PATH)) {
  errors.push('index.html must exist.');
} else {
  const index = read(INDEX_PATH);
  assert(index.includes('calculator-tools.js'), 'index.html must include calculator-tools.js.');
  assert(index.includes('calculator-high-impact.js'), 'index.html must include calculator-high-impact.js.');
  assert(index.includes('calculator-active-ui.js'), 'index.html must include calculator-active-ui.js.');
  assert(index.includes('id="page-calculators"'), 'index.html must include calculator page.');
  assert(index.includes('get("calc") === "v1"'), 'index.html must read the ?calc=v1 routing signal (calculators auto-land alias).');
  assert(index.includes('get("legacy") !== "1"'), 'index.html must support the ?legacy=1 kill-switch (Step 2 promotion of calculators to always-on).');
  assert(!index.includes('id="calculatorNavLink"'), 'hidden duplicate calculator nav link must not be present.');
  assert(index.includes('href="./calculators/">Calculator Tools</a>'), 'public calculator nav must use the clean Calculator Tools link.');
  assert(index.includes('isCalculatorRouteRequested()?\'calculators\''), 'startup routing must auto-route to calculators only when ?calc=v1 explicit signal is present.');
}

if (errors.length) {
  console.error('Calculator safety validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Calculator safety validation passed.');
