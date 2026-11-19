const fs=require('fs');
let L=fs.readFileSync('public/index.html','utf8').split('\n');
const i=L.findIndex(x=>x.startsWith("fetch('/api/trending-tr')")||x.startsWith("search('turkish')"));
if(i<0){console.log('satir bulunamadi');process.exit(1)}
L[i]="fetch('/api/tr-list').then(function(r){return r.json()}).then(function(list){L.tr=list.map(function(x){return{id:x.id,name:x.name,artist:x.artist,art:x.art,url:'/api/yt?q='+encodeURIComponent(x.yt)}});homeRows()}).catch(function(){L.tr=[];homeRows()});";
fs.writeFileSync('public/index.html',L.join('\n'));
console.log('TAMAM');
