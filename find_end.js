const fs = require('fs');
const path = 'C:/Users/ASUS/najm-ai-clinicnote/index.html';
let content = fs.readFileSync(path, 'utf-8');

// Find the DOMContentLoaded handler
const dlIdx = content.indexOf('DOMContentLoaded');
if (dlIdx < 0) { console.log('DOMContentLoaded NOT found'); process.exit(1); }

// The handler starts after DOMContentLoaded and ends with }) followed by newline
const handlerStart = content.indexOf('function(){', dlIdx);
if (handlerStart < 0) { console.log('function(){ not found'); process.exit(1); }

// Find the end - the }) that closes this function
// It's: {{...}})  where the last }) closes the DOMContentLoaded callback and ()
// Let me find the exact end
const snippet = content.slice(handlerStart, handlerStart + 1500);
console.log('--- Handler content (last 600 chars) ---');
console.log(snippet.slice(-600));
console.log('--- End ---');

// Now find: the handler ends with })}\n before the next line
// Let me find the exact pattern
const endPattern = 'remove("open")}})';
const endIdx = content.lastIndexOf(endPattern);
if (endIdx < 0) {
  console.log('Pattern remove("open")}}) NOT found');
  process.exit(1);
}
const afterEnd = content.slice(endIdx, endIdx + 20);
console.log('Ending snippet:', JSON.stringify(afterEnd));
