const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
const s=h.indexOf("if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/");
const eMark="},0)}";
const e=h.indexOf(eMark,s);
if(s<0||e<0){console.log('hedef bulunamadi');process.exit(1)}
const code=`if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/var g=document.getElementById('novaToast');if(!g){g=document.createElement('div');g.id='novaToast';g.style.cssText='position:fixed;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 16px;border-radius:20px;font-size:14px;z-index:99999;display:none';document.body.appendChild(g)}g.textContent='⏳ Geç açılabilir, bekle…';g.style.display='block';var f=function(){g.style.display='none';audio.removeEventListener('playing',f);audio.removeEventListener('error',f)};audio.addEventListener('playing',f);audio.addEventListener('error',f)}`;
h=h.slice(0,s)+code+h.slice(e+eMark.length);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
