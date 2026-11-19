const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('novaLists')){console.log('zaten var');process.exit(0)}
const c1='<div class="card" id="novaAbout" style="margin-top:20px"></div>';
if(!h.includes(c1)){console.log('kart bulunamadi');process.exit(1)}
h=h.replace(c1,'<div class="card" id="novaLists" style="margin-top:20px"></div><div class="card" id="novaFavs" style="margin-top:20px"></div>');
const s=h.indexOf('/*nova-about*/');
const endM='renderAbout();\n})();';
const e=h.indexOf(endM,s);
if(s<0||e<0){console.log('script bulunamadi');process.exit(1)}
const old='$(\'#pHeart\')';
const code=`/*nova-about*/
(function(){
var K='nova_playlists',openI=-1;
function load(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
function el(tag,css,txt){var e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!==undefined)e.textContent=txt;return e}
window.novaAsk=function(title,def,cb){
  var o=el('div','position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:100002;display:flex;align-items:center;justify-content:center;padding:20px');
  var bx=el('div','width:100%;max-width:340px;background:#1a1a1f;color:#fff;border-radius:18px;padding:18px');
  bx.appendChild(el('div','font-weight:700;font-size:17px;margin-bottom:12px',title));
  var inp=el('input','width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:16px');
  inp.value=def||'';inp.placeholder='Liste adı';inp.maxLength=40;
  var row=el('div','display:flex;gap:8px;margin-top:12px');
  var no=el('button','flex:1;padding:12px;border:0;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;font-size:15px','İptal');
  var ok=el('button','flex:1;padding:12px;border:0;border-radius:10px;background:#6c5ce7;color:#fff;font-size:15px;font-weight:600','Kaydet');
  no.onclick=function(){o.remove()};
  function go(){var n=inp.value.trim();if(!n)return;o.remove();cb(n.slice(0,40))}
  ok.onclick=go;inp.onkeydown=function(ev){if(ev.key==='Enter')go()};
  row.appendChild(no);row.appendChild(ok);bx.appendChild(inp);bx.appendChild(row);o.appendChild(bx);document.body.appendChild(o);
  setTimeout(function(){inp.focus();inp.select()},50);
};
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
  var lb=document.getElementById('novaLists'),fb=document.getElementById('novaFavs');
  if(!lb||!fb)return;
  lb.innerHTML='';fb.innerHTML='';
  var pl=load();
  lb.appendChild(el('div','font-weight:700;font-size:16px;margin-bottom:10px','Listelerim ('+pl.length+')'));
  if(!pl.length)lb.appendChild(el('div','opacity:.6;font-size:13px','Henüz liste yok. Çalardaki liste düğmesiyle oluştur.'));
  pl.forEach(function(p,i){
    var head=el('div','display:flex;gap:6px;margin-bottom:6px');
    var b=el('button','flex:1;min-width:0;text-align:left;padding:12px;border:0;border-radius:10px;background:rgba(108,92,231,.25);color:inherit;font-size:15px;font-weight:600',(openI===i?'▾ ':'▸ ')+p.name+' ('+p.tracks.length+')');
    b.onclick=function(){openI=(openI===i?-1:i);renderAbout()};
    var rn=el('button','padding:12px;border:0;border-radius:10px;background:rgba(255,255,255,.1);color:inherit;font-size:13px','Ad');
    rn.onclick=function(){window.novaAsk('Liste adı',p.name,function(n){var a=load();a[i].name=n;save(a);renderAbout()})};
    var d=el('button','padding:12px;border:0;border-radius:10px;background:rgba(255,80,80,.2);color:inherit;font-size:13px','Sil');
    d.onclick=function(){if(confirm('"'+p.name+'" listesi silinsin mi?')){var a=load();a.splice(i,1);save(a);openI=-1;renderAbout()}};
    head.appendChild(b);head.appendChild(rn);head.appendChild(d);lb.appendChild(head);
    if(openI===i){
      if(!p.tracks.length)lb.appendChild(el('div','opacity:.6;font-size:13px;margin:0 0 8px 6px','Liste boş.'));
      p.tracks.forEach(function(t,j){lb.appendChild(trackRow(p.tracks,j))});
    }
  });
  var fav=L.fav||[];
  fb.appendChild(el('div','font-weight:700;font-size:16px;margin-bottom:10px','Favoriler ('+fav.length+')'));
  if(!fav.length)fb.appendChild(el('div','opacity:.6;font-size:13px','Henüz favori yok.'));
  fav.forEach(function(t,i){fb.appendChild(trackRow(fav,i))});
}
window.novaRenderAbout=renderAbout;
var nb=document.querySelector('button[data-v="about"]');
if(nb)nb.addEventListener('click',function(){setTimeout(renderAbout,0)});
renderAbout();
})();`;
h=h.slice(0,s)+code+h.slice(e+endM.length);
// liste adı sorma: prompt yerine uygulama penceresi
const p1="var n=prompt('Liste adı:');if(!n||!n.trim())return;var a=load();a.push({name:n.trim().slice(0,40),tracks:[]});save(a);addTo(a.length-1,t);close()";
if(h.includes(p1)){h=h.replace(p1,"window.novaAsk('Yeni liste','',function(n){var a=load();a.push({name:n,tracks:[]});save(a);addTo(a.length-1,t);close();if(window.novaRenderAbout)window.novaRenderAbout()})")}
else console.log('uyari: prompt kismi bulunamadi, ad sorma eski haliyle kaldi');
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
