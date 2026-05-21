const fs = require('fs');
const path = 'C:/Users/ASUS/najm-ai-clinicnote/index.html';
let content = fs.readFileSync(path, 'utf-8');

// Find the end of the last script tag
const scriptEndMarker = '</script>';
const lastScriptEnd = content.lastIndexOf(scriptEndMarker);
if (lastScriptEnd < 0) { console.log('</script> not found'); process.exit(1); }

// The script content is everything before </script>
// Find the start of this script - it's after the previous </script> or <script>
const scriptStart = content.lastIndexOf('<script>', lastScriptEnd);
if (scriptStart < 0) { console.log('<script> not found'); process.exit(1); }

const beforeScript = content.slice(0, scriptStart + 8); // including <script>
const scriptBody = content.slice(scriptStart + 8, lastScriptEnd);
const afterScript = content.slice(lastScriptEnd);

// Remove the extra ) that was introduced
const wrong = 'renderClinicNoteFormActions());document.getElementById("navToggle")';
const right = 'renderClinicNoteFormActions();document.getElementById("navToggle")';

if (scriptBody.includes(wrong)) {
  const fixed = scriptBody.replace(wrong, right);
  const result = beforeScript + fixed + afterScript;
  fs.writeFileSync(path, result, 'utf-8');
  console.log('Fixed the extra )');
} else if (scriptBody.includes(right)) {
  console.log('Already correct - no extra ) found');
} else {
  console.log('Neither pattern found. Checking...');
  // Show what's around renderClinicNoteFormActions
  const idx = scriptBody.indexOf('renderClinicNoteFormActions');
  if (idx >= 0) {
    console.log('Context:', scriptBody.slice(idx, idx + 120));
  } else {
    console.log('renderClinicNoteFormActions not found either!');
  }
}
