const fs=require('fs');
let L=fs.readFileSync('public/index.html','utf8').split('\n');
const i=L.findIndex(x=>x.startsWith("fetch('/api/trending-tr')"));
if(i<0){console.log('satir bulunamadi');process.exit(1)}
L[i]=`fetch('/api/trending-tr').then(function(r){return r.json()}).then(async function(list){var seen={},out=[];function add(t){if(t&&!seen[t.id]){seen[t.id]=1;out.push(t)}}var res=await Promise.all(list.map(async function(q){try{var r=await search(q);return r[0]}catch(e){}}));res.forEach(add);if(out.length<20){var ex=await Promise.all(['turkish','türkçe pop','türkçe rap','turkish trap','anadolu'].map(async function(q){try{return await search(q)}catch(e){return[]}}));ex.forEach(function(a){a.forEach(function(t){if(out.length<20)add(t)})})}L.tr=out;homeRows()}).catch(function(){L.tr=[];homeRows()});`;
fs.writeFileSync('public/index.html',L.join('\n'));
console.log('TAMAM');
