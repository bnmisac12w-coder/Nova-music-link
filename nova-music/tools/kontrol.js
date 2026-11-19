(async()=>{
const j=await (await fetch('https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json')).json();
console.log('Apple güncelleme:',j.feed.updated);
for(const [i,x] of j.feed.results.entries()){
  const q=encodeURIComponent(x.artistName+' '+x.name);
  let b='YOK';
  try{
    const r=await (await fetch('https://api.audius.co/v1/tracks/search?query='+q+'&limit=1&app_name=NOVA')).json();
    if(r.data&&r.data[0])b='VAR: '+r.data[0].user.name+' - '+r.data[0].title;
  }catch(e){b='hata'}
  console.log((i+1)+'. '+x.artistName+' - '+x.name+'\n    -> '+b);
}
})();
