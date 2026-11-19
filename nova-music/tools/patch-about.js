const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('novaAbout')){console.log('zaten var');process.exit(0)}
const a1='<div class="card"><h3>NOVA Music</h3>Şarkı ara, trend listeyi dinle, favorilerini sakla.</div>';
const a2="b.onclick=open;\n})();";
if(!h.includes(a1)){console.log('kart bulunamadi');process.exit(1)}
if(!h.includes(a2)){console.log('script bulunamadi');process.exit(1)}
h=h.replace(a1,a1+'<div class="card" id="novaAbout" style="margin-top:20px"></div>');
const code=a2+`
/*nova-about*/
(function(){
var K='nova_playlists',openI=-1;
function load(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
function el(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!==undefined)e.textContent=txt;return e}
function trackRow(list,i){
  var t=list[i];
  var r=el('button','display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:8px;margin-bottom:6px;border:0;border-radius:10px;background:rgba(255,255,255,.06);color:inherit;font-size:14px');
  var im=el('img','width:40px;height:40px;border-radius:8px;object-fit:cover;background:rgba(255,255,255,.1)');
  if(t.art)im.src=t.art;
  var w=el('div','min-width:0;flex:1');
  w.appendChild(el('div','white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600',t.name||''));
  w.appendChild(el('div','white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.6;font-size:12px',t.artist||''));
  r.appendChild(im);r.appendChild(w);
  r.onclick=function(){play(list,i)};
  return r;
}
function renderAbout(){
  var box=document.getElementById('novaAbout');if(!box)return;
  box.innerHTML='';
  var fav=L.fav||[];
  box.appendChild(el('div','font-weight:700;font-size:16px;margin-bottom:10px','Favoriler ('+fav.length+')'));
  if(!fav.length)box.appendChild(el('div','opacity:.6;font-size:13px;margin-bottom:14px','Henüz favori yok.'));
  fav.forEach(function(t,i){box.appendChild(trackRow(fav,i))});
  var pl=load();
  box.appendChild(el('div','font-weight:700;font-size:16px;margin:18px 0 10px','Listelerim ('+pl.length+')'));
  if(!pl.length)box.appendChild(el('div','opacity:.6;font-size:13px','Henüz liste yok. Çalardaki liste düğmesiyle oluştur.'));
  pl.forEach(function(p,i){
    var head=el('div','display:flex;gap:8px;margin-bottom:6px');
    var b=el('button','flex:1;text-align:left;padding:12px;border:0;border-radius:10px;background:rgba(108,92,231,.25);color:inherit;font-size:15px;font-weight:600',(openI===i?'▾ ':'▸ ')+p.name+' ('+p.tracks.length+')');
    b.onclick=function(){openI=(openI===i?-1:i);renderAbout()};
    var d=el('button','padding:12px;border:0;border-radius:10px;background:rgba(255,80,80,.2);color:inherit;font-size:13px','Sil');
    d.onclick=function(){if(confirm('"'+p.name+'" listesi silinsin mi?')){var a=load();a.splice(i,1);save(a);openI=-1;renderAbout()}};
    head.appendChild(b);head.appendChild(d);box.appendChild(head);
    if(openI===i){
      if(!p.tracks.length)box.appendChild(el('div','opacity:.6;font-size:13px;margin:0 0 8px 6px','Liste boş.'));
      p.tracks.forEach(function(t,j){box.appendChild(trackRow(p.tracks,j))});
    }
  });
}
var nb=document.querySelector('button[data-v="about"]');
if(nb)nb.addEventListener('click',function(){setTimeout(renderAbout,0)});
renderAbout();
})();`;
h=h.replace(a2,code);
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
