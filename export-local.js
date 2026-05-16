(function(){
  "use strict";

  var REVIEW_FOOTER = "Draft generated from clinician-entered de-identified information. Review, edit, and approve before use. Do not include patient identifiers unless handled inside your approved clinical system.";

  function getReviewFooter(){
    return REVIEW_FOOTER;
  }

  function sanitizeFilename(input){
    var value = String(input || "clinicnote-export").toLowerCase();
    value = value.replace(/[^a-z0-9._-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");
    if(!value) value = "clinicnote-export";
    if(value.length > 90) value = value.slice(0,90).replace(/[-.]+$/,"");
    return value;
  }

  function normalizeText(value){
    return String(value || "").replace(/\r\n/g,"\n").replace(/\r/g,"\n").trim();
  }

  function ensureFooter(text){
    var body = normalizeText(text);
    if(body.indexOf(REVIEW_FOOTER) >= 0) return body;
    return body + "\n\n" + REVIEW_FOOTER;
  }

  function contextLines(context){
    var lines = [];
    var ctx = context || {};
    for(var key in ctx){
      if(!Object.prototype.hasOwnProperty.call(ctx,key)) continue;
      var value = ctx[key];
      if(value === null || value === undefined || value === "") continue;
      lines.push(String(key) + ": " + String(value));
    }
    return lines;
  }

  function buildExportText(title, bodyText, context){
    var lines = [];
    var safeTitle = normalizeText(title || "Najm AI ClinicNote Export");
    lines.push(safeTitle);
    var ctxLines = contextLines(context);
    if(ctxLines.length){
      lines.push("");
      for(var i=0;i<ctxLines.length;i++) lines.push(ctxLines[i]);
    }
    lines.push("");
    lines.push(ensureFooter(bodyText));
    return lines.join("\n");
  }

  function escapeHtml(value){
    return String(value || "").replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }

  function buildExportDocument(title, bodyText, context){
    var safeTitle = normalizeText(title || "Najm AI ClinicNote Export");
    var ctxLines = contextLines(context);
    var contextHtml = "";
    if(ctxLines.length){
      contextHtml = "<dl class=\"context\">" + ctxLines.map(function(line){
        var split = line.indexOf(": ");
        var key = split >= 0 ? line.slice(0,split) : "Context";
        var value = split >= 0 ? line.slice(split + 2) : line;
        return "<div><dt>"+escapeHtml(key)+"</dt><dd>"+escapeHtml(value)+"</dd></div>";
      }).join("") + "</dl>";
    }
    var body = ensureFooter(bodyText);
    return "<!doctype html><html><head><meta charset=\"utf-8\"><title>"+escapeHtml(safeTitle)+"</title><style>body{font-family:Arial,sans-serif;color:#0f172a;margin:32px;line-height:1.55}h1{font-size:22px;margin:0 0 14px}.context{border:1px solid #dbe4ee;border-radius:10px;padding:12px;margin:0 0 18px;background:#f8fafc}.context div{display:flex;gap:12px;margin:3px 0}.context dt{min-width:110px;font-weight:700;color:#334155}.context dd{margin:0;color:#475569}pre{white-space:pre-wrap;font:13px/1.6 Consolas,Menlo,monospace;border-top:1px solid #e2e8f0;padding-top:18px}.footer{margin-top:22px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#475569}@media print{body{margin:20mm}.no-print{display:none}}</style></head><body><h1>"+escapeHtml(safeTitle)+"</h1>"+contextHtml+"<pre>"+escapeHtml(body)+"</pre><div class=\"footer\">Created locally in the browser. Nothing is uploaded or stored by Najm AI.</div></body></html>";
  }

  function exportTextFile(filenameBase, title, bodyText, context){
    var filename = sanitizeFilename(filenameBase || "clinicnote-export");
    if(filename.slice(-4) !== ".txt") filename += ".txt";
    var text = buildExportText(title, bodyText, context);
    var blob = new Blob([text],{type:"text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(function(){URL.revokeObjectURL(url)},1000);
    return {ok:true,filename:filename};
  }

  function printOutput(title, bodyText, context){
    var frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden","true");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0";
    document.body.appendChild(frame);
    var html = buildExportDocument(title, bodyText, context);
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(function(){
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } finally {
        setTimeout(function(){
          if(frame && frame.parentNode) frame.parentNode.removeChild(frame);
        },60000);
      }
    },100);
    return {ok:true};
  }

  window.ClinicNoteExport = {
    exportTextFile:exportTextFile,
    printOutput:printOutput,
    buildExportDocument:buildExportDocument,
    sanitizeFilename:sanitizeFilename,
    getReviewFooter:getReviewFooter
  };
})();

