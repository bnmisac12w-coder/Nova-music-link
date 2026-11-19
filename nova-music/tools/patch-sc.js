const fs = require('fs');

let s = fs.readFileSync('server.mjs', 'utf8');
const a = 'if (url.pathname === "/api/trending") {';
const endpoint = `if (url.pathname === "/api/sc-resolve") {
      const u = url.searchParams.get("u") || "";
      let h = "";
      try { h = new URL(u).hostname; } catch {}
      if (h !== "on.soundcloud.com") { res.writeHead(400); return res.end("Geçersiz link"); }
      const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const f = new URL(r.url);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ url: f.origin + f.pathname }));
    }
    `;
if (!s.includes(a)) { console.log('server.mjs: yer bulunamadi'); process.exit(1); }
s = s.replace(a, () => endpoint + a);
fs.writeFileSync('server.mjs', s);

let h = fs.readFileSync('public/index.html', 'utf8');
const b = "var raw=$('#ytIn').value.trim(),id=ytId(raw),url='',item=null;";
const fix = `var raw=$('#ytIn').value.trim();
    var sm=raw.match(/https?:\\/\\/on\\.soundcloud\\.com\\/[\\w-]+/i);
    if(sm){try{var rr=await fetch('/api/sc-resolve?u='+encodeURIComponent(sm[0]));if(rr.ok){raw=(await rr.json()).url}}catch(e){}}
    raw=raw.replace(/(soundcloud\\.com\\/[^?\\s]+)\\?\\S*/i,function(m,p){return p});
    var id=ytId(raw),url='',item=null;`;
if (!h.includes(b)) { console.log('index.html: yer bulunamadi'); process.exit(1); }
h = h.replace(b, () => fix);
fs.writeFileSync('public/index.html', h);
console.log('Yama uygulandi');
