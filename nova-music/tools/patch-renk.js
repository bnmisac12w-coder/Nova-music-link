const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
if(h.includes('nova-renk')){console.log('zaten var');process.exit(0)}
if(!h.includes('</body>')){console.log('body bulunamadi');process.exit(1)}
const code=`<style>/*nova-renk*/
#novaLists{background:linear-gradient(160deg,rgba(108,92,231,.38),rgba(0,184,217,.16))!important;border:1px solid rgba(140,120,255,.45)!important}
#novaFavs{background:linear-gradient(160deg,rgba(255,60,120,.34),rgba(255,150,60,.15))!important;border:1px solid rgba(255,90,130,.45)!important}
#novaLists>div:first-child{color:#cfc6ff!important}
#novaFavs>div:first-child{color:#ffa6c1!important}
.nv-c0>button:first-child{background:linear-gradient(90deg,#6c5ce7,#a855f7)!important;color:#fff!important}
.nv-c1>button:first-child{background:linear-gradient(90deg,#0984e3,#00cec9)!important;color:#fff!important}
.nv-c2>button:first-child{background:linear-gradient(90deg,#e84393,#ff7675)!important;color:#fff!important}
.nv-c3>button:first-child{background:linear-gradient(90deg,#00b894,#55a3ff)!important;color:#fff!important}
.nv-c4>button:first-child{background:linear-gradient(90deg,#f39c12,#e17055)!important;color:#fff!important}
.nv-track{background:linear-gradient(90deg,var(--a),rgba(255,255,255,.04))!important;border-left:4px solid var(--b)!important}
.nv-t0{--a:rgba(108,92,231,.38);--b:#a855f7}
.nv-t1{--a:rgba(9,132,227,.38);--b:#00cec9}
.nv-t2{--a:rgba(232,67,147,.38);--b:#ff7675}
.nv-t3{--a:rgba(0,184,148,.36);--b:#55a3ff}
.nv-t4{--a:rgba(243,156,18,.36);--b:#e17055}
.nv-tf{--a:rgba(255,60,120,.34);--b:#ff4d88}
</style>
<script>/*nova-renk*/
(function(){
var lb=document.getElementById('novaLists'),fb=document.getElementById('novaFavs');
if(!lb||!fb)return;
function paint(){
  var ci=-1;
  Array.prototype.forEach.call(lb.children,function(n,k){
    if(k===0)return;
    if(n.tagName==='BUTTON'){if(ci>=0)n.classList.add('nv-track','nv-t'+(ci%5))}
    else if(n.children.length===3){ci++;n.classList.add('nv-c'+(ci%5))}
  });
  Array.prototype.forEach.call(fb.children,function(n,k){
    if(k>0&&n.tagName==='BUTTON')n.classList.add('nv-track','nv-tf');
  });
}
new MutationObserver(paint).observe(lb,{childList:true});
new MutationObserver(paint).observe(fb,{childList:true});
paint();
})();
</script>`;
h=h.replace('</body>',code+'\n</body>');
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
