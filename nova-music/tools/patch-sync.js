const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('nova-sync')){console.log('zaten var');process.exit(0)}
if(!h.includes('</body>')){console.log('body bulunamadi');process.exit(1)}
const code=`<script>/*nova-sync*/
(function(){
var db=window.novaDb;if(!db)return;
var uid=null,pulling=false,timer=null;
var rawSet=Storage.prototype.setItem;
function lj(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function setLocal(k,v){rawSet.call(localStorage,k,JSON.stringify(v))}
async function push(){
  if(!uid)return;
  try{await db.from('user_data').upsert({user_id:uid,favs:lj('nova_favs'),playlists:lj('nova_playlists'),updated_at:new Date().toISOString()})}catch(e){}
}
Storage.prototype.setItem=function(k,v){
  rawSet.apply(this,arguments);
  if(!pulling&&uid&&(k==='nova_favs'||k==='nova_playlists')){clearTimeout(timer);timer=setTimeout(push,1500)}
};
async function pull(){
  pulling=true;
  try{
    var r=await db.from('user_data').select('favs,playlists').eq('user_id',uid).maybeSingle();
    if(r.error)return;
    if(r.data){
      setLocal('nova_favs',r.data.favs||[]);
      setLocal('nova_playlists',r.data.playlists||[]);
      if(typeof L!=='undefined')L.fav=r.data.favs||[];
      if(typeof render==='function')render();
      if(window.novaRenderAbout)window.novaRenderAbout();
    }else{await push()}
  }catch(e){}finally{pulling=false}
}
function setUser(u){
  if(u&&u.id!==uid){uid=u.id;setTimeout(pull,0)}
  else if(!u){uid=null}
}
db.auth.getSession().then(function(s){setUser(s.data&&s.data.session&&s.data.session.user)});
db.auth.onAuthStateChange(function(ev,sess){setUser(sess&&sess.user)});
})();
</script>`;
h=h.replace('</body>',code+'\n</body>');
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
