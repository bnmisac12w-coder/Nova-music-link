const fs=require('fs');
let s=fs.readFileSync('server.mjs','utf8');
if(s.includes('/api/tr-list')){console.log('zaten var');process.exit(0)}
const a='if (url.pathname === "/api/yt") {';
if(!s.includes(a)){console.log('hedef bulunamadi');process.exit(1)}
const code=
'if (url.pathname === "/api/tr-list") {\n'+
'      const c = globalThis.__trL || (globalThis.__trL = { t: 0, d: [] });\n'+
'      if (Date.now() - c.t > 3600000 || !c.d.length) {\n'+
'        try {\n'+
'          const r = await fetch("https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json", { signal: AbortSignal.timeout(10000) });\n'+
'          const j = await r.json();\n'+
'          c.d = j.feed.results.map(x => ({ id: "yt-" + x.id, name: x.name, artist: x.artistName, art: (x.artworkUrl100 || "").replace("100x100", "300x300"), yt: x.artistName + " " + x.name }));\n'+
'          c.t = Date.now();\n'+
'        } catch (e) { console.log("tr-list hata:", e.message); }\n'+
'      }\n'+
'      res.writeHead(200, { "Content-Type": "application/json" });\n'+
'      return res.end(JSON.stringify(c.d));\n'+
'    }\n    ';
s=s.replace(a,code+a);
fs.writeFileSync('server.mjs',s);
console.log('TAMAM');
