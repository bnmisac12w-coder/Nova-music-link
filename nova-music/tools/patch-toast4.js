const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
const s=h.indexOf("if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/");
if(s<0){console.log('hedef bulunamadi');process.exit(1)}
const m="},5000)}";
const e=h.indexOf(m,s);
if(e<0){console.log('son bulunamadi');process.exit(1)}
const code=`if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/var g=document.getElementById('novaToast');if(!g){g=document.createElement('div');g.id='novaToast';g.style.cssText='position:fixed;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 16px;border-radius:20px;font-size:14px;z-index:99999;opacity:0;transition:opacity 1s ease;pointer-events:none';document.body.appendChild(g)}g.textContent='⏳ Geç açılabilir, bekle…';g.style.display='block';clearTimeout(window.__toastT);g.style.opacity='0';void g.offsetWidth;g.style.opacity='1';window.__toastT=setTimeout(function(){g.style.opacity='0'},4000)}`;
h=h.slice(0,s)+code+h.slice(e+m.length);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
