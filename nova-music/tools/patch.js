const fs=require('fs');
const f='public/index.html';
let h=fs.readFileSync(f,'utf8');
if(h.includes('id="tgShuf"')){console.log('Zaten uygulanmış');process.exit(0)}
fs.writeFileSync(f+'.bak2',h);

const CSS=`.srow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0;border-top:1px solid var(--line)}
.srow:first-child{border-top:0;padding-top:0}
.srow.col{flex-direction:column;align-items:flex-start}
.srow b{display:block;color:var(--tx);font-size:16px;font-weight:600}
.srow small{color:var(--mut);font-size:13px}
.sw{display:flex;gap:12px}
.sw button{width:32px;height:32px;border-radius:50%;border:2px solid transparent}
.sw button.on{border-color:#fff}
.tg{width:50px;height:30px;border-radius:15px;background:#3a3d42;position:relative;flex:none;transition:background .2s}
.tg::after{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .2s}
.tg.on{background:var(--g)}.tg.on::after{transform:translateX(20px)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chips button{padding:8px 14px;border-radius:20px;border:1px solid var(--line);color:var(--mut);font-size:14px}
.chips button.on{border-color:var(--g);color:var(--g)}
.danger{width:100%;padding:14px;border-radius:14px;border:1px solid #5a2a2a;color:#ff6b6b;font-weight:600}
`;

const HTML=`<section class="view" id="v-about">
    <div class="eb" style="margin-top:34px">AYARLAR</div>
    <h2 style="font-size:30px;font-weight:700;letter-spacing:-.03em;margin-top:6px">Hakkımda</h2>
    <div class="card" style="margin-top:20px">
      <div class="srow col"><div><b>Vurgu rengi</b><small>Uygulamanın ana rengi</small></div><div class="sw" id="sw" style="margin-top:12px"></div></div>
      <div class="srow"><div><b>Karıştır</b><small>Sıradaki şarkı rastgele seçilir</small></div><button class="tg" id="tgShuf" aria-label="Karıştır"></button></div>
      <div class="srow"><div><b>Tekrar</b><small>Şarkı bitince başa sarar</small></div><button class="tg" id="tgRep" aria-label="Tekrar"></button></div>
      <div class="srow col"><div><b>Uyku zamanlayıcı</b><small id="slLeft">Kapalı</small></div><div class="chips" id="chSleep"></div></div>
    </div>
    <div class="card"><div class="srow col" style="padding:0;border:0"><div><b style="color:var(--tx);font-size:16px">Favoriler</b><small>Bu cihazdaki tüm favorileri siler</small></div></div><div style="margin-top:14px"><button class="danger" id="clrFav">Favorileri temizle</button></div></div>
    <div class="card"><h3>NOVA Music</h3>Şarkı ara, trend listeyi dinle, favorilerini sakla. Favoriler ve ayarlar bu cihazda, tarayıcıda saklanır.</div>
  </section>`;

const JS=`(function(){
  var K='nova_set',D={c:'#1ed760',shuf:false,rep:false},S;
  try{S=Object.assign({},D,JSON.parse(localStorage.getItem(K)))}catch(e){S=Object.assign({},D)}
  function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
  var COLORS=['#1ed760','#a855f7','#3b82f6','#f97316','#ec4899'];
  function dark(h){var n=parseInt(h.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    return 'rgb('+Math.round(r*.16+10)+','+Math.round(g*.16+10)+','+Math.round(b*.16+10)+')'}
  function applyColor(){var s=document.documentElement.style;s.setProperty('--g',S.c);s.setProperty('--gd',dark(S.c))}
  function sw(){var b=$('#sw');b.innerHTML='';COLORS.forEach(function(c){
    var x=document.createElement('button');x.style.background=c;x.setAttribute('aria-label',c);
    if(c===S.c)x.className='on';x.onclick=function(){S.c=c;save();applyColor();sw()};b.appendChild(x)})}
  function tg(){$('#tgShuf').classList.toggle('on',S.shuf);$('#tgRep').classList.toggle('on',S.rep);audio.loop=S.rep}
  $('#tgShuf').onclick=function(){S.shuf=!S.shuf;save();tg()};
  $('#tgRep').onclick=function(){S.rep=!S.rep;save();tg()};

  var _step=step;
  step=function(d){
    if(S.shuf&&d>0&&queue.length>1){var n;do{n=Math.floor(Math.random()*queue.length)}while(n===idx);play(queue,n)}
    else _step(d)
  };

  var sm=0,sT=null,sI=null,sEnd=0;
  function left(){var el=$('#slLeft');if(!sEnd){el.textContent='Kapalı';return}
    var s=Math.max(0,Math.round((sEnd-Date.now())/1000));
    el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' sonra duracak'}
  function chips(){var b=$('#chSleep');b.innerHTML='';
    [[0,'Kapalı'],[15,'15 dk'],[30,'30 dk'],[60,'60 dk']].forEach(function(o){
      var x=document.createElement('button');x.textContent=o[1];if(o[0]===sm)x.className='on';
      x.onclick=function(){setSleep(o[0])};b.appendChild(x)})}
  function setSleep(m){
    clearTimeout(sT);clearInterval(sI);sEnd=0;sm=m;
    if(m){sEnd=Date.now()+m*60000;
      sT=setTimeout(function(){audio.pause();sEnd=0;sm=0;clearInterval(sI);left();chips()},m*60000);
      sI=setInterval(left,1000)}
    chips();left()}

  $('#clrFav').onclick=function(){
    if(!L.fav.length)return;
    if(confirm('Tüm favoriler silinsin mi?')){L.fav=[];saveFavs();render()}};

  applyColor();sw();tg();chips();left();
})();`;

const a=h.indexOf('@media (prefers-reduced-motion');
const reAbout=/<section class="view" id="v-about">[\s\S]*?<\/section>/;
const marker='L.fav=loadFavs();render();loadTrend();';
if(a<0||!reAbout.test(h)||!h.includes(marker)){console.log('Eşleşme yok, hiçbir şey değişmedi');process.exit(1)}
h=h.slice(0,a)+CSS+h.slice(a);
h=h.replace(reAbout,()=>HTML);
h=h.replace(marker,()=>JS+'\n'+marker);
fs.writeFileSync(f,h);
console.log('Tamam');
