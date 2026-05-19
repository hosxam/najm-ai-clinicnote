const fs=require('fs'),path=require('path'),ROOT=path.resolve(__dirname,'..');
function rj(fp){return JSON.parse(fs.readFileSync(fp,'utf8'))}
const errors=[],warnings=[];
function fail(m){errors.push(m)}
function warn(m){warnings.push(m)}

const wfs=rj(path.join(ROOT,'data/clinical_workflows.json'));
const wfIds=new Set(wfs.map(w=>w.workflow_id));
console.log('=== V4 Full Coverage Audit ===');
console.log('Total workflows:',wfs.length);

const history=rj(path.join(ROOT,'data/v4_workflow_history_drafts.json'));
const exam=rj(path.join(ROOT,'data/v4_workflow_exam_details.json'));
const inv=rj(path.join(ROOT,'data/v4_investigation_options.json'));
const plan=rj(path.join(ROOT,'data/v4_plan_options.json'));
const presets=rj(path.join(ROOT,'data/speed_presets.json'));
const chips=rj(path.join(ROOT,'data/workflow_chips.json'));
const diagData=rj(path.join(ROOT,'data/diagnosis_index.json'));
const diagEntries=diagData.entries||{};
const diagWfIds=new Set();
Object.values(diagEntries).forEach(e=>{if(e&&e.workflow_ids)(Array.isArray(e.workflow_ids)?e.workflow_ids:e.workflow_ids.split(',')).forEach(id=>diagWfIds.add(id.trim()))});

const hIds=new Set(history.map(e=>e.workflow_id));
const eIds=new Set(exam.map(e=>e.workflow_id));
const iIds=new Set(inv.map(e=>e.workflow_id));
const pIds=new Set(plan.map(e=>e.workflow_id));
const sIds=new Set(presets.map(e=>e.workflow_id));
const cIds=new Set(chips.map(e=>e.workflow_id));

let covered=0;
wfs.forEach(w=>{var id=w.workflow_id;
  var has=hIds.has(id)&&eIds.has(id)&&iIds.has(id)&&pIds.has(id)&&sIds.has(id)&&cIds.has(id);
  if(has)covered++;else{if(!hIds.has(id))warn(id+': missing history');if(!eIds.has(id))warn(id+': missing exam');if(!iIds.has(id))warn(id+': missing inv');if(!pIds.has(id))warn(id+': missing plan');if(!sIds.has(id))warn(id+': missing preset');if(!cIds.has(id))warn(id+': missing chips');if(!diagWfIds.has(id))warn(id+': missing diag index')}
});
console.log('Fully covered:',covered+'/'+wfs.length);
if(covered!==wfs.length)fail('Only '+covered+'/'+wfs.length+' fully covered');

history.forEach(e=>{if(!wfIds.has(e.workflow_id))fail('Stale history: '+e.workflow_id)});
exam.forEach(e=>{if(!wfIds.has(e.workflow_id))fail('Stale exam: '+e.workflow_id)});
inv.forEach(e=>{if(!wfIds.has(e.workflow_id))fail('Stale inv: '+e.workflow_id)});
plan.forEach(e=>{if(!wfIds.has(e.workflow_id))fail('Stale plan: '+e.workflow_id)});

const FORBIDDEN=['recommended treatment','must prescribe','must refer','required investigation','start medication','give medication','guideline recommends','nhs approved','nice compliant','dha approved','mohap approved','send to er','urgent admission','give adrenaline','start antibiotics','ct required','rule out mi','sepsis pathway'];
function check(data,label){var t=JSON.stringify(data).toLowerCase();FORBIDDEN.forEach(p=>{if(t.indexOf(p)>=0)warn(label+': forbidden '+p)})}
check(history,'History');check(plan,'Plan');check(inv,'Investigations');check(exam,'Exam');

console.log('Errors:'+errors.length+' Warnings:'+warnings.length);
if(errors.length){console.error('FAILURES:');errors.forEach(e=>console.error('  FAIL: '+e))}
if(warnings.length)console.log('WARNINGS:');warnings.forEach(w=>console.log('  WARN: '+w));
if(errors.length===0){console.log('V4 full coverage validated: '+covered+'/'+wfs.length);process.exit(0)}else process.exit(1)
