const fs=require('fs');
const f='public/index.html';
let h=fs.readFileSync(f,'utf8');
if(h.includes('id="ytIn"')){console.log('Zaten uygulanmış');process.exit(0)}

const A='const L={trend:[],res:[],fav:[]};';
const B='const on=cur()&&cur().id===t.id,pl=on&&!audio.paused;';
const C="audio.paused?audio.play():audio.pause();$('#player').classList.add('show')";
const D="$('#v-home').classList.toggle('on',v!=='about');";
const E="if(v==='add'||v==='search')openSearch(true);else if(v==='home')openSearch(false);";
const F='<div id="fav" style="margin-top:14px"></div>';
const G='<div id="player">';
const H='</main>';
const I='@media (prefers-reduced-motion';
const J='L.fav=loadFavs();render();loadTrend();';
for(const s of [A,B,C,D,E,F,G,H,I,J]){
  if(!h.includes(s)){console.log('Eşleşme yok, değişiklik yapılmadı:\n'+s);process.exit(1)}
}
fs.writeFileSync(f+'.bak4',h);

const CSS=`.btn{width:100%;padding:14px;border-radius:14px;background:var(--g);color:#06140b;font-weight:700;font-size:16px;margin-top:12px}
.btn:disabled{opacity:.5}
.tin{width:100%;margin-top:12px;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--tx);font:inherit;font-size:16px;outline:0}
.tin:focus{border-color:var(--g)}
`;

const YTWRAP='<div id="ytWrap" style="position:fixed;right:0;bottom:0;width:2px;height:2px;opacity:.01;overflow:hidden;pointer-events:none;z-index:-1"><div id="ytBox"></div></div>\n';

const HOME_ADD=F+`
    <div class="sec"><div><div class="eb">KÜTÜPHANE</div><h2>Eklediklerim</h2></div></div>
    <div id="addHome" style="margin-top:14px"></div>`;

const ADDVIEW=`<section class="view" id="v-add">
    <div class="eb" style="margin-top:34px">YOUTUBE</div>
    <h2 style="font-size:30px;font-weight:700;letter-spacing:-.03em;margin-top:6px">Şarkı ekle</h2>
    <div class="card" style="margin-top:20px">
      <b style="color:var(--tx);font-size:16px">YouTube linki</b>
      <input class="tin" id="ytIn" type="url" inputmode="url" placeholder="https://youtu.be/..." autocomplete="off">
      <button class="btn" id="ytAdd">Ekle</button>
      <div id="ytMsg" style="margin-top:12px;font-size:14px;min-height:18px"></div>
    </div>
    <div class="sec"><div><div class="eb">KÜTÜPHANE</div><h2>Eklediklerim</h2></div></div>
    <div id="addList" style="margin-top:14px"></div>
  </section>
`;

const NAV_NEW="$('#v-home').classList.toggle('on',v!=='about'&&v!=='add');$('#v-add').classList.toggle('on',v==='add');";
const SEARCH_NEW="if(v==='search')openSearch(true);else openSearch(false);";
const CLICK_NEW="togglePlay();$('#player').classList.add('show')";

const JS=`(function(){
  var AK='nova_added';
  try{L.add=JSON.parse(localStorage.getItem(AK))||[]}catch(e){L.add=[]}
  function saveAdd(){try{localStorage.setItem(AK,JSON.stringify(L.add))}catch(e){}}
  var X='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ytp=null,ytReady=false,ytWant=null,ytPlaying=false,ytTimer=null,ytPend=null;

  window.isPl=function(){var c=cur();if(c&&c.yt)return ytPlaying;return !audio.paused};
  window.togglePlay=function(){
    var c=cur();
    if(c&&c.yt){if(ytp&&ytReady){ytPlaying?ytp.pauseVideo():ytp.playVideo()}return}
    audio.paused?audio.play():audio.pause();
  };
  window.ytPause=function(){if(ytp&&ytReady&&ytPlaying)ytp.pauseVideo()};

  function stopT(){clearInterval(ytTimer);ytTimer=null}
  function tick(){
    if(!ytp||!ytReady)return;
    var d=ytp.getDuration()||0,c=ytp.getCurrentTime()||0,p=d?c/d*1000:0;
    $('#seek').value=p;$('#seek').style.setProperty('--p',p/10+'%');
    $('#tC').textContent=fmt(c);$('#tD').textContent=fmt(d);
  }
  function startT(){stopT();ytTimer=setInterval(tick,500)}
  function repOn(){try{return !!JSON.parse(localStorage.getItem('nova_set')).rep}catch(e){return false}}

  function onSt(e){
    var c=cur();if(!c||!c.yt)return;
    var s=e.data;
    if(s===1){ytPlaying=true;$('#pPlay').innerHTML=PAUSE;startT();render()}
    else if(s===2){ytPlaying=false;$('#pPlay').innerHTML=PLAY;stopT();render()}
    else if(s===0){
      ytPlaying=false;$('#pPlay').innerHTML=PLAY;stopT();
      if(repOn()){ytp.seekTo(0,true);ytp.playVideo()}else{render();step(1)}
    }
  }
  function onErr(){
    var c=cur();if(!c||!c.yt)return;
    ytPlaying=false;$('#pPlay').innerHTML=PLAY;
    $('#pArtist').textContent='Bu video gömülü oynatmaya izin vermiyor';render();
    if(queue.length>1)setTimeout(function(){step(1)},1500);
  }
  function ytInit(cb){
    if(window.YT&&YT.Player){cb();return}
    ytPend=cb;
    window.onYouTubeIframeAPIReady=function(){if(ytPend){var f=ytPend;ytPend=null;f()}};
    if(!document.getElementById('ytapi')){
      var s=document.createElement('script');s.id='ytapi';s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);
    }
  }
  function ytLoad(id){
    ytWant=id;
    if(ytp&&ytReady){ytp.loadVideoById(id);return}
    if(ytp)return;
    ytInit(function(){
      if(ytp)return;
      ytp=new YT.Player('ytBox',{width:200,height:200,videoId:ytWant,
        playerVars:{autoplay:1,playsinline:1,controls:0,rel:0},
        events:{onReady:function(e){ytReady=true;e.target.loadVideoById(ytWant)},onStateChange:onSt,onError:onErr}});
    });
  }
  function ytStop(){ytPlaying=false;stopT();if(ytp&&ytReady)ytp.stopVideo()}

  var _play=play;
  play=function(list,i){
    var t=list[i];
    if(t&&t.yt){
      audio.pause();
      queue=list.slice();idx=i;
      $('#pArt').src=t.art;$('#pTitle').textContent=t.name;
      $('#pArtist').textContent=t.artist?'@'+t.artist.replace(/^@/,''):'';
      $('#player').classList.add('show');requestAnimationFrame(marquee);
      $('#seek').value=0;$('#seek').style.setProperty('--p','0%');
      $('#tC').textContent='0:00';$('#tD').textContent='0:00';
      ytLoad(t.yt);render();
    }else{ytStop();_play(list,i)}
  };

  $('#pPlay').onclick=function(){togglePlay()};
  $('#seek').oninput=function(e){
    var c=cur();
    if(c&&c.yt){if(ytp&&ytReady){var d=ytp.getDuration()||0;if(d)ytp.seekTo(e.target.value/1000*d,true)}}
    else if(audio.duration)audio.currentTime=e.target.value/1000*audio.duration;
  };

  function addRows(){
    return L.add.map(function(t,i){
      var on=cur()&&cur().id===t.id,pl=on&&isPl();
      return '<div class="row'+(on?' on':'')+'" data-l="add" data-i="'+i+'">'
        +'<img src="'+esc(t.art)+'" alt="" loading="lazy">'
        +'<div class="t"><b>'+esc(t.name)+'</b><small>'+(pl?'Şu anda çalıyor…':esc(t.artist||'YouTube'))+'</small></div>'
        +'<button class="pl" aria-label="Çal">'+(pl?PAUSE:PLAY)+'</button>'
        +'<button class="hb" data-del="'+esc(t.id)+'" aria-label="Sil">'+X+'</button></div>';
    }).join('');
  }
  var _render=render;
  render=function(){
    _render();
    var h=L.add.length?addRows():'<div class="empty">Henüz eklediğin şarkı yok. Ekle sekmesinden YouTube linki yapıştır.</div>';
    $('#addList').innerHTML=h;$('#addHome').innerHTML=h;
  };
  function onDel(e){
    var d=e.target.closest('[data-del]');if(!d)return;
    e.stopPropagation();
    var id=d.dataset.del;
    L.add=L.add.filter(function(t){return t.id!==id});
    saveAdd();render();
  }
  $('#addList').addEventListener('click',onDel);
  $('#addHome').addEventListener('click',onDel);

  function ytId(u){
    try{
      var x=new URL(u.indexOf('http')===0?u:'https://'+u),id='';
      if(x.hostname.indexOf('youtu')<0)return '';
      if(x.hostname==='youtu.be')id=x.pathname.split('/')[1]||'';
      else if(x.searchParams.get('v'))id=x.searchParams.get('v');
      else{var p=x.pathname.split('/');if(['shorts','embed','live','v'].indexOf(p[1])>-1)id=p[2]||''}
      return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';
    }catch(e){return ''}
  }
  async function meta(id){
    var u='https://www.youtube.com/watch?v='+id;
    var ends=['https://www.youtube.com/oembed?format=json&url=','https://noembed.com/embed?url='];
    for(var i=0;i<ends.length;i++){
      try{
        var r=await fetch(ends[i]+encodeURIComponent(u));if(!r.ok)continue;
        var j=await r.json();
        if(j&&j.title)return{title:j.title,author:j.author_name||''};
      }catch(e){}
    }
    return{title:'YouTube şarkısı',author:''};
  }
  function msg(t,ok){var m=$('#ytMsg');m.textContent=t;m.style.color=ok?'var(--g)':'var(--mut)'}
  async function addLink(){
    var id=ytId($('#ytIn').value.trim());
    if(!id){msg('Geçerli bir YouTube linki değil.');return}
    if(L.add.some(function(t){return t.id==='yt_'+id})){msg('Bu şarkı zaten ekli.');return}
    var b=$('#ytAdd');b.disabled=true;msg('Bilgiler alınıyor…');
    var info=await meta(id);
    L.add.unshift({id:'yt_'+id,yt:id,name:info.title,artist:info.author,art:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',url:''});
    saveAdd();render();$('#ytIn').value='';b.disabled=false;
    msg('Eklendi: '+info.title,true);
  }
  $('#ytAdd').onclick=addLink;
  $('#ytIn').addEventListener('keydown',function(e){if(e.key==='Enter')addLink()});
})();`;

h=h.replace(A,()=>'const L={trend:[],res:[],fav:[],add:[]};');
h=h.replace(B,()=>'const on=cur()&&cur().id===t.id,pl=on&&isPl();');
h=h.replace(C,()=>CLICK_NEW);
h=h.replace(D,()=>NAV_NEW);
h=h.replace(E,()=>SEARCH_NEW);
h=h.replace(F,()=>HOME_ADD);
h=h.replace(G,()=>YTWRAP+G);
h=h.replace(H,()=>ADDVIEW+H);
h=h.replace(I,()=>CSS+I);
h=h.replace(J,()=>JS+'\n'+J);
h=h.replace('audio.pause();sEnd=0;sm=0',()=>'audio.pause();if(window.ytPause)ytPause();sEnd=0;sm=0');
fs.writeFileSync(f,h);
console.log('Tamam');
