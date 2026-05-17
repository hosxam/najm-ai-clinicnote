const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CALC_PATH = path.join(ROOT, 'calculator-tools.js');
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

if (!fs.existsSync(CALC_PATH)) {
  errors.push('calculator-tools.js must exist.');
} else {
  const calc = read(CALC_PATH);

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
    assert(!pattern.test(calc), `calculator-tools.js contains forbidden runtime term: ${pattern}`);
  }

  assert(!/https?:\/\//i.test(calc), 'calculator-tools.js must not contain external API URLs.');
  assert(!/import\s|require\s*\(/i.test(calc), 'calculator-tools.js must not import third-party libraries.');

  const unsafePhrase = containsUnsafeClinicalPhrase(calc);
  assert(!unsafePhrase, `calculator-tools.js contains disallowed clinical phrase "${unsafePhrase}".`);
  assert(!containsDiagnosisInstruction(calc), 'calculator-tools.js contains diagnosis wording outside a safety negation.');

  const highRiskNames = [
    /\bHEART\s+Score\b/i,
    /\bTIMI\b/i,
    /\bGRACE\b/i,
    /\bWells\b/i,
    /\bNEWS2\b/i,
    /\bGCS\b/i,
    /\bABCD2\b/i,
    /\bCanadian\s+CT\b/i,
    /\bPHQ-9\b/i,
    /\bGAD-7\b/i
  ];
  for (const pattern of highRiskNames) {
    assert(!pattern.test(calc), `calculator-tools.js appears to implement a disallowed calculator: ${pattern}`);
  }

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
  assert(index.includes('id="page-calculators"'), 'index.html must include calculator page.');
  assert(index.includes('id="calculatorNavLink"'), 'index.html must include calculator nav link.');
  assert(index.includes('get("calc") === "v1"'), 'index.html must require calc=v1 feature flag.');
  assert(index.includes('style="display:none">Calculators</a>'), 'calculator nav link must be hidden by default.');
  assert(index.includes('isCalculatorToolsEnabled()?\'calculators\''), 'startup routing must only show calculators when feature flag is enabled.');
}

if (errors.length) {
  console.error('Calculator safety validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Calculator safety validation passed.');
