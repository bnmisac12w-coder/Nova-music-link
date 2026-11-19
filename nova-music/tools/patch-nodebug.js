const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
const a=".then(function(r){alert(r.error?'Kayit hatasi: '+r.error.message:'Kaydedildi')})}catch(e){alert('Hata: '+e.message)}";
if(!h.includes(a)){console.log('hedef bulunamadi');process.exit(1)}
h=h.replace(a,".then(function(r){if(r.error)console.log('kayit hatasi',r.error.message)})}catch(e){}");
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
