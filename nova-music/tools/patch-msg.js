const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('nova-gec-acilir')){console.log('zaten var');process.exit(0)}
const code=`<script>/*nova-gec-acilir*/
(function(){
var a=document.querySelector('audio')||window.audio;
var el=document.getElementById('pArtist');
if(!a||!el)return;
var old=null;
function bekle(){if(a.src.indexOf('/api/yt')<0)return;if(old===null)old=el.textContent;el.textContent='⏳ Geç açılabilir, bekle…'}
function bitti(){if(old!==null){el.textContent=old;old=null}}
a.addEventListener('loadstart',bekle);
a.addEventListener('playing',bitti);
a.addEventListener('error',bitti);
})();
</script>`;
if(!h.includes('</body>')){console.log('body bulunamadi');process.exit(1)}
h=h.replace('</body>',code+'\n</body>');
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
