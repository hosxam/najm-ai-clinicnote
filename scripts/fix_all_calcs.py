"""Replace calculateFromUI and fix return formats."""
with open('calculator-tools.js', 'rb') as f:
    raw = f.read()

# Find the exact old pattern using CRLF
old = b'} else if (calculatorId === "mrc_dyspnea_scale") {\r\n      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\r\n    } else {\r\n      result = { ok: false, error: "Calculator is not available." };\r\n    }\r\n    setResult'

new = b'} else if (calculatorId === "mrc_dyspnea_scale") {\r\n      result = classifyMRCDyspnea(byId("calc-mrc-grade").value);\r\n    } else if (calculatorId === "nyha") {\r\n      result = calculateNYHA(Number(byId("calc-nyha-grade").value));\r\n    } else if (calculatorId === "killip") {\r\n      result = calculateKillip(Number(byId("calc-killip-class").value));\r\n    } else if (calculatorId === "sirs") {\r\n      var _t=Number(byId("calc-sirs-temp").value)||undefined;\r\n      var _h=Number(byId("calc-sirs-hr").value)||undefined;\r\n      var _r=Number(byId("calc-sirs-rr").value)||undefined;\r\n      var _w=Number(byId("calc-sirs-wbc").value)||undefined;\r\n      result=calculateSIRS(_t,_h,_r,_w);\r\n    } else if (calculatorId === "qsofa") {\r\n      var _rr=Number(byId("calc-qsofa-rr").value)||undefined;\r\n      var _sbp=Number(byId("calc-qsofa-sbp").value)||undefined;\r\n      var _gcs=byId("calc-qsofa-gcs").value==="yes";\r\n      result=calculateQSOFA(_rr,_sbp,_gcs);\r\n    } else if (calculatorId === "fib4") {\r\n      result = calculateFIB4(\r\n        Number(byId("calc-fib4-age").value),\r\n        Number(byId("calc-fib4-ast").value),\r\n        Number(byId("calc-fib4-alt").value),\r\n        Number(byId("calc-fib4-plt").value)\r\n      );\r\n    } else if (calculatorId === "child_pugh") {\r\n      result = calculateChildPugh(\r\n        Number(byId("calc-child-bili").value),\r\n        Number(byId("calc-child-alb").value),\r\n        Number(byId("calc-child-inr").value),\r\n        byId("calc-child-ascites").value,\r\n        byId("calc-child-encephalopathy").value\r\n      );\r\n    } else {\r\n      result = { ok: false, error: "Calculator is not available." };\r\n    }\r\n    setResult'

if old in raw:
    print("Found old pattern")
    raw = raw.replace(old, new, 1)
    print("Replaced")
else:
    print("NOT found - checking bytes...")
    idx = raw.find(b'mrc_dyspnea_scale") {')
    if idx >= 0:
        chunk = raw[idx:idx+300]
        print(repr(chunk))

# Now fix the new function return formats to use {ok:true, ...}
# Rewrite all 6 new functions with the correct format
import re

# Replace NYHA
old_func = b'function calculateNYHA(grade) {\n    var grades = {1:\'Class I: No limitation of physical activity.\',2:\'Class II: Slight limitation of physical activity.\',3:\'Class III: Marked limitation of physical activity.\',4:\'Class IV: Unable to carry on any physical activity without discomfort.\'};\n    return {text:\'NYHA functional class: \'+grades[grade]+\' Clinician interpretation required.\',value:grade};\n  }'
new_func = b'function calculateNYHA(grade) {\n    var grades = {1:\'Class I: No limitation of physical activity.\',2:\'Class II: Slight limitation of physical activity.\',3:\'Class III: Marked limitation of physical activity.\',4:\'Class IV: Unable to carry on any physical activity without discomfort.\'};\n    var g=Number(grade);\n    if(!g||g<1||g>4)return{ok:false,error:"Select NYHA grade (1-4)."};\n    return{ok:true,calculatorId:"nyha",value:g,text:"NYHA functional class: "+grades[g]+".",safetyNote:"NYHA class is a documentation tool. Does not establish diagnosis or treatment."};\n  }'
if old_func in raw:
    raw = raw.replace(old_func, new_func, 1)
    print("Fixed NYHA")

# Replace Killip
old_func2 = b'function calculateKillip(killipClass) {\n    var classes = {1:\'Class I: No clinical signs of heart failure.\',2:\'Class II: Signs of heart failure.\',3:\'Class III: Acute pulmonary oedema.\',4:\'Class IV: Cardiogenic shock.\'};\n    return {text:\'Killip class: \'+(classes[killipClass]||\'Invalid.\')+\' Clinician interpretation required.\',value:killipClass};\n  }'
new_func2 = b'function calculateKillip(killipClass) {\n    var classes = {1:\'Class I: No clinical signs of heart failure.\',2:\'Class II: Signs of heart failure.\',3:\'Class III: Acute pulmonary oedema.\',4:\'Class IV: Cardiogenic shock.\'};\n    var k=Number(killipClass);\n    if(!k||k<1||k>4)return{ok:false,error:"Select Killip class (1-4)."};\n    return{ok:true,calculatorId:"killip",value:k,text:"Killip class: "+classes[k]+".",safetyNote:"Killip class documents clinical severity. Does not determine management."};\n  }'
if old_func2 in raw:
    raw = raw.replace(old_func2, new_func2, 1)
    print("Fixed Killip")

# Replace SIRS
old_func3 = b'function calculateSIRS(temp,hr,rr,wbc) {\n    var c=0; if(temp!==undefined&&(temp<36||temp>38))c++; if(hr!==undefined&&hr>90)c++; if(rr!==undefined&&rr>20)c++; if(wbc!==undefined&&(wbc<4||wbc>12))c++;\n    return {text:\'SIRS criteria: \'+c+\'/4. \'+(c>=2?\'Two or more criteria present. \':\'Less than 2 criteria. \')+\'Clinician interpretation required.\',value:c};\n  }'
new_func3 = b'function calculateSIRS(temp,hr,rr,wbc) {\n    var c=0; if(temp!==undefined&&(temp<36||temp>38))c++; if(hr!==undefined&&hr>90)c++; if(rr!==undefined&&rr>20)c++; if(wbc!==undefined&&(wbc<4||wbc>12))c++;\n    return{ok:true,calculatorId:"sirs",value:c,text:"SIRS criteria: "+c+"/4. "+(c>=2?"Two or more criteria present.":"Less than 2 criteria.")+" Clinician interpretation required.",safetyNote:"SIRS criteria are documentation aids. Do not determine sepsis management independently."};\n  }'
if old_func3 in raw:
    raw = raw.replace(old_func3, new_func3, 1)
    print("Fixed SIRS")

# Replace qSOFA
old_func4 = b'function calculateQSOFA(rr,sbp,gcsBelow) {\n    var c=0; if(rr!==undefined&&rr>=22)c++; if(sbp!==undefined&&sbp<=100)c++; if(gcsBelow)c++;\n    return {text:\'qSOFA: \'+c+\'/3. \'+(c>=2?\'Higher risk. \':\'Low score. \')+\'Clinician interpretation required.\',value:c};\n  }'
new_func4 = b'function calculateQSOFA(rr,sbp,gcsBelow) {\n    var c=0; if(rr!==undefined&&rr>=22)c++; if(sbp!==undefined&&sbp<=100)c++; if(gcsBelow)c++;\n    return{ok:true,calculatorId:"qsofa",value:c,text:"qSOFA: "+c+"/3. "+(c>=2?"Higher risk of in-hospital mortality.":"Low qSOFA score.")+" Clinician interpretation required.",safetyNote:"qSOFA is a screening tool. Does not determine sepsis management. Clinical assessment required."};\n  }'
if old_func4 in raw:
    raw = raw.replace(old_func4, new_func4, 1)
    print("Fixed qSOFA")

# Replace FIB-4
old_func5 = b'function calculateFIB4(age,ast,alt,plt) {\n    if(!age||!ast||!alt||!plt||ast<=0||alt<=0||plt<=0)return null;\n    var f=(age*ast)/(plt*Math.sqrt(alt));\n    var cat=f<1.30?\'Low probability of advanced fibrosis.\':f>2.67?\'Higher probability. Further evaluation indicated.\':\'Indeterminate range.\';\n    return {text:\'FIB-4: \'+f.toFixed(2)+\'. \'+cat+\' Clinician interpretation required.\',value:f};\n  }'
new_func5 = b'function calculateFIB4(age,ast,alt,plt) {\n    var a=Number(age),as=Number(ast),al=Number(alt),p=Number(plt);\n    if(!a||!as||!al||!p||as<=0||al<=0||p<=0)return{ok:false,error:"Enter age, AST, ALT, and platelets as positive numbers."};\n    var f=(a*as)/(p*Math.sqrt(al));\n    var cat=f<1.30?"Low probability of advanced fibrosis.":f>2.67?"Higher probability. Further evaluation indicated.":"Indeterminate range.";\n    return{ok:true,calculatorId:"fib4",value:f,text:"FIB-4: "+f.toFixed(2)+". "+cat,safetyNote:"FIB-4 is a non-invasive fibrosis index. Does not replace liver biopsy or clinical assessment."};\n  }'
if old_func5 in raw:
    raw = raw.replace(old_func5, new_func5, 1)
    print("Fixed FIB-4")

# Replace Child-Pugh
old_func6 = b'function calculateChildPugh(bilirubin,albumin,inr,ascites,encephalopathy) {\n    var bPts=bilirubin<=2?1:bilirubin<=3?2:3; var aPts=albumin>=3.5?1:albumin>=2.8?2:3;\n    var iPts=inr<1.7?1:inr<2.3?2:3; var ascPts=ascites===\'none\'?1:ascites===\'mild\'?2:3;\n    var encPts=encephalopathy===\'none\'?1:encephalopathy===\'grade1-2\'?2:3;\n    var total=bPts+aPts+iPts+ascPts+encPts;\n    var cls=total<=6?\'Child-Pugh A\':total<=9?\'Child-Pugh B\':\'Child-Pugh C\';\n    return {text:\'Child-Pugh: \'+total+\' (\'+cls+\'). Clinician interpretation required.\',value:total};\n  }'
new_func6 = b'function calculateChildPugh(bilirubin,albumin,inr,ascites,encephalopathy) {\n    var bili=Number(bilirubin),alb=Number(albumin),inrVal=Number(inr);\n    if(isNaN(bili)||isNaN(alb)||isNaN(inrVal))return{ok:false,error:"Enter bilirubin, albumin, and INR."};\n    var bPts=bili<=2?1:bili<=3?2:3; var aPts=alb>=3.5?1:alb>=2.8?2:3;\n    var iPts=inrVal<1.7?1:inrVal<2.3?2:3;\n    var ascPts=ascites==="none"?1:ascites==="mild"?2:3;\n    var encPts=encephalopathy==="none"?1:encephalopathy==="grade1-2"?2:3;\n    var total=bPts+aPts+iPts+ascPts+encPts;\n    var cls=total<=6?"Child-Pugh A":total<=9?"Child-Pugh B":"Child-Pugh C";\n    return{ok:true,calculatorId:"child_pugh",value:total,text:"Child-Pugh: "+total+" ("+cls+").",safetyNote:"Child-Pugh score documents liver disease severity. Does not determine management. Clinical assessment required."};\n  }'
if old_func6 in raw:
    raw = raw.replace(old_func6, new_func6, 1)
    print("Fixed Child-Pugh")

with open('calculator-tools.js', 'wb') as f:
    f.write(raw)
print(f"Size: {len(raw)} bytes")
