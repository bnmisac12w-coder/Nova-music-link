const fs=require('fs');
let s=fs.readFileSync('server.mjs','utf8');
const a='if (url.pathname === "/api/trending") {';
if(!s.includes(a)){console.log('server: hedef bulunamadi');process.exit(1)}
s=s.replace(a,`if (url.pathname === "/api/trending-tr") {
      const c = globalThis.__trTR || (globalThis.__trTR = { t: 0, d: [] });
      if (Date.now() - c.t > 3600000 || !c.d.length) {
        try {
          const r = await fetch("https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json", { signal: AbortSignal.timeout(10000) });
          const j = await r.json();
          c.d = j.feed.results.map(x => x.artistName + " " + x.name);
          c.t = Date.now();
        } catch (e) { console.log("trending-tr hata:", e.message); }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(c.d));
    }
    `+a);
fs.writeFileSync('server.mjs',s);
let h=fs.readFileSync('public/index.html','utf8');
const o="search('turkish').then(function(r){L.tr=r;homeRows()}).catch(function(){L.tr=[];homeRows()});";
if(!h.includes(o)){console.log('index: hedef bulunamadi');process.exit(1)}
h=h.replace(o,"fetch('/api/trending-tr').then(function(r){return r.json()}).then(async function(list){var out=[];await Promise.all(list.slice(0,15).map(async function(q,i){try{var r=await search(q);if(r[0])out[i]=r[0]}catch(e){}}));L.tr=out.filter(Boolean);homeRows()}).catch(function(){L.tr=[];homeRows()});");
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
