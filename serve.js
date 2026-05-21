const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.png':'image/png','.jpg':'image/jpeg',
  '.svg':'image/svg+xml','.ico':'image/x-icon','.md':'text/markdown','.txt':'text/plain'
};
http.createServer((req,res)=>{
  let p = req.url.split('?')[0];
  if(p==='/')p='/index.html';
  const fp = path.join(__dirname, p);
  fs.readFile(fp,(e,d)=>{
    if(e){res.writeHead(404);res.end('Not found');return;}
    const ext = path.extname(fp);
    res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream'});
    res.end(d);
  });
}).listen(8085,()=>console.log('Server on 8085'));
