const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
// 1) eski gri yazı yamasını kaldır
const a1=h.indexOf('<script>/*nova-gec-acilir*/');
if(a1>=0){const a2=h.indexOf('</script>',a1);if(a2>0)h=h.slice(0,a1)+h.slice(a2+9)}
// 2) balonu yenile
const s=h.indexOf("if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/");
const mark="audio.addEventListener('error',f)}";
const e=h.indexOf(mark,s);
if(s<0||e<0){console.log('hedef bulunamadi');process.exit(1)}
const code=`if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/var g=document.getElementById('novaToast');if(!g){g=document.createElement('div');g.id='novaToast';g.style.cssText='position:fixed;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 16px;border-radius:20px;font-size:14px;z-index:99999;display:none';document.body.appendChild(g)}g.textContent='⏳ Geç açılabilir, bekle…';g.style.display='block';var ok=function(){g.style.display='none';audio.removeEventListener('playing',ok);audio.removeEventListener('error',bad)};var bad=function(){g.textContent='Açılamadı, tekrar dene';setTimeout(function(){g.style.display='none'},3000);audio.removeEventListener('playing',ok);audio.removeEventListener('error',bad)};audio.addEventListener('playing',ok);audio.addEventListener('error',bad)}`;
h=h.slice(0,s)+code+h.slice(e+mark.length);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
