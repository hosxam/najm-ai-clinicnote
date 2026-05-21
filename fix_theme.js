const fs = require('fs');
const path = 'C:/Users/ASUS/najm-ai-clinicnote/index.html';
let content = fs.readFileSync(path, 'utf-8');

const target = 'renderClinicNoteFormActions());document.getElementById("navToggle").addEventListener("click",function(){document.getElementById("navLinks").classList.toggle("open")});window.addEventListener("resize",function(){if(window.innerWidth>640){document.getElementById("navLinks").classList.remove("open")}})})';

const replacement = 'renderClinicNoteFormActions());document.getElementById("navToggle").addEventListener("click",function(){document.getElementById("navLinks").classList.toggle("open")});window.addEventListener("resize",function(){if(window.innerWidth>640){document.getElementById("navLinks").classList.remove("open")}});applySavedTheme()})\nfunction toggleTheme(){var isLight=document.documentElement.getAttribute("data-theme")==="light";var newTheme=isLight?"dark":"light";document.documentElement.setAttribute("data-theme",newTheme);try{localStorage.setItem("clinicnote-theme",newTheme)}catch(e){}document.getElementById("themeIcon").innerHTML=newTheme==="light"?"\u2600":"\u263E"}\nfunction applySavedTheme(){try{var saved=localStorage.getItem("clinicnote-theme");if(saved){document.documentElement.setAttribute("data-theme",saved);if(document.getElementById("themeIcon"))document.getElementById("themeIcon").innerHTML=saved==="light"?"\u2600":"\u263E"}}catch(e){}}\n';

const count = content.split(target).length - 1;
console.log(`Found ${count} occurrence(s)`);

if (count === 1) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf-8');
  console.log('OK - JS toggle added');
} else {
  console.log('NOT found or too many');
  const idx = content.indexOf('DOMContentLoaded');
  if (idx >= 0) console.log('DOMContentLoaded at', idx, '...' + content.slice(idx + 200, idx + 600));
}
