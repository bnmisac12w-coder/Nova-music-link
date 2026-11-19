const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('nova-bekle')){console.log('zaten var');process.exit(0)}
const a="audio.src=t.url;audio.play().catch(()=>{});";
if(!h.includes(a)){console.log('hedef bulunamadi');process.exit(1)}
const b=a+"if(t.url.indexOf('/api/yt')===0){/*nova-bekle*/setTimeout(function(){var e=$('#pArtist'),o=e.textContent;e.textContent='⏳ Geç açılabilir, bekle…';audio.addEventListener('playing',function f(){e.textContent=o;audio.removeEventListener('playing',f)})},0)}";
h=h.replace(a,b);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
