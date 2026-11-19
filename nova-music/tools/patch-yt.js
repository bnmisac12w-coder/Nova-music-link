const fs=require('fs');
let s=fs.readFileSync('server.mjs','utf8');
if(s.includes('/api/yt"')){console.log('zaten var');process.exit(0)}
const a='if (url.pathname.startsWith("/api/stream/")) {';
if(!s.includes(a)){console.log('hedef bulunamadi');process.exit(1)}
const code=
'if (url.pathname === "/api/yt") {\n'+
'      const q = (url.searchParams.get("q") || "").slice(0, 120);\n'+
'      if (!q) { res.writeHead(400); return res.end("q yok"); }\n'+
'      const C = globalThis.__ytC || (globalThis.__ytC = {});\n'+
'      let hit = C[q];\n'+
'      if (!hit || Date.now() - hit.t > 18000000) {\n'+
'        const { execFile } = await import("node:child_process");\n'+
'        const link = await new Promise((ok) => execFile("yt-dlp", ["--js-runtimes","node","--remote-components","ejs:github","-f","bestaudio[ext=m4a]/bestaudio","-g","ytsearch1:" + q], { timeout: 40000 }, (e, out) => ok(e ? "" : out.trim().split("\\n")[0])));\n'+
'        if (!link) { res.writeHead(502); return res.end("YouTube linki alinamadi"); }\n'+
'        hit = C[q] = { t: Date.now(), u: link };\n'+
'      }\n'+
'      res.writeHead(302, { Location: hit.u });\n'+
'      return res.end();\n'+
'    }\n    ';
s=s.replace(a,code+a);
fs.writeFileSync('server.mjs',s);
console.log('TAMAM');
