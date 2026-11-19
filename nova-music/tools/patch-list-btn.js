const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('nova-pl')){console.log('zaten var');process.exit(0)}
const b1='<button class="hb" id="pHeart" aria-label="Favori"></button>';
const b2="$('#pHeart').onclick=()=>cur()&&toggleFav(cur().id);";
if(!h.includes(b1)||!h.includes(b2)){console.log('hedef bulunamadi');process.exit(1)}
h=h.replace(b1,b1+'<button class="hb" id="pAdd" aria-label="Listeye ekle"></button>');
const code=b2+`
/*nova-pl*/
(function(){
var K='nova_playlists';
function load(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
var b=$('#pAdd');
b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h12M4 11h12M4 16h7M18 13v6M15 16h6"/></svg>';
function msg(t){var g=document.createElement('div');g.textContent=t;g.style.cssText='position:fixed;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 16px;border-radius:20px;font-size:14px;z-index:100001;opacity:0;transition:opacity .5s';document.body.appendChild(g);void g.offsetWidth;g.style.opacity='1';setTimeout(function(){g.style.opacity='0';setTimeout(function(){g.remove()},500)},2000)}
function addTo(i,t){var a=load();if(a[i].tracks.some(function(x){return x.id===t.id})){msg('Zaten bu listede')}else{a[i].tracks.push({id:t.id,name:t.name,artist:t.artist,art:t.art,url:t.url});save(a);msg('"'+a[i].name+'" listesine eklendi')}}
function close(){var o=document.getElementById('novaPL');if(o)o.remove()}
function open(){
var t=cur();if(!t)return;close();
var o=document.createElement('div');o.id='novaPL';
o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100000;display:flex;align-items:flex-end';
o.onclick=function(e){if(e.target===o)close()};
var s=document.createElement('div');
s.style.cssText='width:100%;max-height:70%;overflow:auto;background:#1a1a1f;color:#fff;border-radius:20px 20px 0 0;padding:16px';
var ttl=document.createElement('div');ttl.textContent='Listeye ekle';ttl.style.cssText='font-weight:700;font-size:17px;margin-bottom:12px';s.appendChild(ttl);
function row(txt,fn,accent){var r=document.createElement('button');r.textContent=txt;r.style.cssText='display:block;width:100%;text-align:left;padding:14px;margin-bottom:8px;border:0;border-radius:12px;font-size:15px;color:#fff;background:'+(accent?'#6c5ce7':'rgba(255,255,255,.08)');r.onclick=fn;s.appendChild(r)}
row('+ Yeni liste oluştur',function(){var n=prompt('Liste adı:');if(!n||!n.trim())return;var a=load();a.push({name:n.trim().slice(0,40),tracks:[]});save(a);addTo(a.length-1,t);close()},true);
load().forEach(function(p,i){row(p.name+' ('+p.tracks.length+' şarkı)',function(){addTo(i,t);close()})});
o.appendChild(s);document.body.appendChild(o);
}
b.onclick=open;
})();`;
h=h.replace(b2,code);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
