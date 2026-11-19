    (function(){
      var b=document.getElementById('toggleAddList');
      var list=document.getElementById('addList');
      var arrow=document.getElementById('addListArrow');
      if(!b||!list||!arrow)return;
      b.addEventListener('click',function(){
        var open=list.style.display==='none';
        list.style.display=open?'':'none';
        arrow.textContent=open?'⌃':'⌄';
      });
    })();
