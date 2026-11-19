const fs=require('fs');
let h=fs.readFileSync('public/index.html','utf8');
const a="g.style.opacity='0'},4000)}";
if(!h.includes(a)){console.log('hedef bulunamadi');process.exit(1)}
h=h.replace(a,"g.style.opacity='0'},2000)}");
fs.writeFileSync('public/index.html',h);
console.log('TAMAM');
