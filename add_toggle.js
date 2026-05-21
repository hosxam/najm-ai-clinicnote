const fs = require('fs');
const path = 'C:/Users/ASUS/najm-ai-clinicnote/index.html';
let content = fs.readFileSync(path, 'utf-8');

// The exact end pattern (with Windows line ending)
const target = 'remove("open")}})})';

// Find it
const endIdx = content.lastIndexOf(target);
console.log('Found at index:', endIdx);

// Build the replacement
// Replace everything from renderClinicNoteFormActions to the end of the handler
const searchStart = content.indexOf('renderClinicNoteFormActions()', endIdx - 400);
console.log('Search start at:', searchStart);

const exactOld = content.slice(searchStart, endIdx + target.length + 2); // +2 for \r\n
console.log('Exact old length:', exactOld.length);
console.log('Exact old:', JSON.stringify(exactOld.slice(0, 100)) + '...' + JSON.stringify(exactOld.slice(-20)));

const toggleJS = `renderClinicNoteFormActions());document.getElementById("navToggle").addEventListener("click",function(){document.getElementById("navLinks").classList.toggle("open")});window.addEventListener("resize",function(){if(window.innerWidth>640){document.getElementById("navLinks").classList.remove("open")}});applySavedTheme()})\nfunction toggleTheme(){var isLight=document.documentElement.getAttribute("data-theme")==="light";var newTheme=isLight?"dark":"light";document.documentElement.setAttribute("data-theme",newTheme);try{localStorage.setItem("clinicnote-theme",newTheme)}catch(e){}document.getElementById("themeIcon").innerHTML=newTheme==="light"?"\u2600":"\u263E"}\nfunction applySavedTheme(){try{var saved=localStorage.getItem("clinicnote-theme");if(saved){document.documentElement.setAttribute("data-theme",saved);if(document.getElementById("themeIcon"))document.getElementById("themeIcon").innerHTML=saved==="light"?"\u2600":"\u263E"}}catch(e){}}\r\n`;

content = content.replace(exactOld, toggleJS);
fs.writeFileSync(path, content, 'utf-8');
console.log('OK - JS toggle functions added');
