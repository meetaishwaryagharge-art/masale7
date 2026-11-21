/* Shared cart — Bhau Korde. Saved in localStorage so every page sees the same cart. */
(function(){
  var KEY="bk_cart_v1", WA="919167834686", U="https://bhaukorde.in/wp-content/uploads/", mem=[];
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(v))return v}catch(e){}return mem}
  function save(c){mem=c;try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}}
  function rs(n){return "₹"+(Math.round(n*100)/100).toString()}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function count(c){return c.reduce(function(n,i){return n+i.qty},0)}
  function total(c){return c.reduce(function(n,i){return n+i.qty*i.price},0)}
  function badge(){var n=count(load());document.querySelectorAll(".cartN").forEach(function(e){e.textContent=n})}
  function toast(t,link){
    var e=document.getElementById("toast");
    if(!e){e=document.createElement("div");e.id="toast";e.className="toast";document.body.appendChild(e)}
    e.innerHTML=esc(t)+(link?' <a href="cart.html">View cart</a>':"");
    e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove("on")},2400)}
  var BK=window.BK={
    rs:rs,
    /* item: {id,name,price,size,img} — same id+size merges into one line */
    add:function(it,silent){
      var c=load(),k=it.id+"|"+(it.size||""),f=c.filter(function(x){return x.key===k})[0];
      if(f)f.qty++;else c.push({key:k,id:it.id,name:it.name,price:+it.price,size:it.size||"",img:it.img||"",qty:1});
      save(c);badge();if(!silent)toast(it.name+" added to cart",true)},
    setQty:function(k,q){var c=load();c=c.map(function(x){if(x.key===k)x.qty=q;return x}).filter(function(x){return x.qty>0});save(c);badge()},
    remove:function(k){save(load().filter(function(x){return x.key!==k}));badge()},
    clear:function(){save([]);badge()},
    items:load,count:function(){return count(load())},total:function(){return total(load())},
    waLink:function(){
      var c=load(),m="Hello Bhau Korde, I would like to order:\n";
      c.forEach(function(i,n){m+=(n+1)+". "+i.name+(i.size?" ("+i.size+")":"")+" x "+i.qty+" = "+rs(i.qty*i.price)+"\n"});
      m+="\nTotal: "+rs(total(c))+"\n(Final price depends on pack size - please confirm.)";
      return "https://wa.me/"+WA+"?text="+encodeURIComponent(m)}
  };
  document.addEventListener("DOMContentLoaded",badge);
  window.addEventListener("storage",badge);window.addEventListener("pageshow",badge);

  /* ---- cart page rendering (only runs where #cartRoot exists) ---- */
  function render(){
    var root=document.getElementById("cartRoot");if(!root)return;
    var c=load();
    if(!c.length){root.innerHTML='<div class="cempty"><i class="bi bi-cart-x"></i><h2>Your cart is empty</h2><p>Looks like you haven’t added any masale or lonche yet.</p><a class="btn" href="blended-spices.html" data-shop="blend">Shop Now</a></div>';return}
    var rows=c.map(function(i){
      var im=i.img?'<img src="'+esc(i.img)+'" alt="'+esc(i.name)+'" onerror="this.replaceWith(document.createTextNode(\'No image\'))">':"No image";
      return '<div class="citem"><div class="ci">'+im+'</div><div><h4>'+esc(i.name)+'</h4>'+(i.size?'<div class="cs">Pack: '+esc(i.size)+'</div>':'')+'<div class="cu">'+rs(i.price)+' each</div></div>'
       +'<div class="cr"><div class="qty"><button data-d="-1" data-k="'+esc(i.key)+'" aria-label="Decrease quantity">&minus;</button><span>'+i.qty+'</span><button data-d="1" data-k="'+esc(i.key)+'" aria-label="Increase quantity">+</button></div>'
       +'<div class="lt">'+rs(i.qty*i.price)+'</div><button class="rm" data-r="'+esc(i.key)+'"><i class="bi bi-trash3"></i> Remove</button></div></div>'}).join("");
    root.innerHTML='<div class="cartpage"><div>'+rows+'<button class="rm cclear" id="cclear"><i class="bi bi-x-circle"></i> Clear cart</button></div>'
     +'<aside class="csum"><h3>Order Summary</h3><div class="row"><span>Items</span><span>'+count(c)+'</span></div><div class="row"><span>Subtotal</span><span>'+rs(total(c))+'</span></div><div class="row tot"><span>Total</span><span>'+rs(total(c))+'</span></div>'
     +'<a class="btn" id="cwa" href="'+BK.waLink()+'" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Order on WhatsApp</a><a class="btn ghost" href="blended-spices.html" style="margin-top:10px">Continue Shopping</a>'
     +'<small>Prices include tax. Final price depends on pack size and delivery — we confirm everything with you on WhatsApp.</small></aside></div>'}
  document.addEventListener("click",function(e){
    var q=e.target.closest("[data-d]"),r=e.target.closest("[data-r]");
    if(q){var k=q.dataset.k,it=load().filter(function(x){return x.key===k})[0];if(it){BK.setQty(k,it.qty+ +q.dataset.d);render()}}
    if(r){BK.remove(r.dataset.r);render()}
    if(e.target.closest("#cclear")){BK.clear();render()}});
  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("storage",render);

  /* ---- Shop Now popup (quick shop) ---- */
  var CAT={"blend":[{"id":"chicken-kolhapuri-ready-mix-masala","name":"Chicken Kolhapuri Ready Mix Masala","min":80,"max":80,"sizes":"","img":null},{"id":"chiken-lolopop-ready-mix","name":"Chicken Lollypop Ready Mix","min":40,"max":40,"sizes":"50 g","img":"2024/03/Untitled-design1.png"},{"id":"chole-masala","name":"Chole Masala","min":40,"max":40,"sizes":"50 g","img":"2024/04/Untitled-design4.png"},{"id":"darbari-sunday-mix-masala","name":"Darbari Sunday Mix Masala","min":95,"max":475,"sizes":"","img":"2024/04/Untitled-design3.png"},{"id":"fikka-masala","name":"Fikka Masala","min":80,"max":160,"sizes":"100 g · 200 g","img":"2024/03/fikaa-masala-1.png"},{"id":"misal-pav-masala","name":"Misal Pav Masala","min":45,"max":45,"sizes":"50 g","img":"2024/04/Untitled-design5.png"},{"id":"moglaei-matan-masala","name":"Moghlai Matan Masala","min":80,"max":80,"sizes":"100 g","img":"2024/03/Untitled-design2.png"},{"id":"pavbhaji-masala","name":"Pav Bhaji Masala","min":40,"max":40,"sizes":"50 g","img":"2024/04/Untitled-design2.png"},{"id":"pulao-masala","name":"Pulao Masala","min":40,"max":40,"sizes":"50 g","img":"2024/04/1.png"},{"id":"rajshahi-biryani-masala","name":"Rajshahi Biryani Masala","min":68,"max":68,"sizes":"50 g","img":"2024/04/2-1.png"},{"id":"ready-mango-pickle-masala","name":"Ready Mango Pickle Masala","min":75,"max":150,"sizes":"100 g · 200 g","img":"2024/04/Untitled-design7.png"},{"id":"sagar-ratn-fish-masala","name":"Sagar Ratna Fish Masala","min":80,"max":400,"sizes":"","img":"2024/03/Untitled-design5.png"},{"id":"sambar-masala","name":"Sambar Masala","min":40,"max":40,"sizes":"50 g","img":"2024/04/3.png"},{"id":"special-bramhni-kala-god-masala","name":"Special Bramhni Kala Goda Masala","min":80,"max":400,"sizes":"","img":"2024/03/special-bramhni-kala-god-masala-1.png"},{"id":"special-koli-aagri-masala","name":"Special Koli Aagri Masala","min":100,"max":500,"sizes":"100 g · 200 g · 500 g","img":"2024/03/Koli_Aagari_Masala_1-600x678.webp"},{"id":"special-malvani-masala","name":"Special Malvani Masala","min":95,"max":475,"sizes":"100 g · 200 g · 500 g","img":"2024/03/Untitled-design6.png"},{"id":"special-rajdrbari-garam-masala-2","name":"Special Rajdarbari Garam Masala","min":90,"max":450,"sizes":"100 g · 200 g · 500 g","img":"2024/03/Untitled-design7.png"},{"id":"super-sunday-bhajlela-mix-masala","name":"Super Sunday Bhajlela Mix Masala","min":90,"max":900,"sizes":"","img":"2024/03/Untitled-design8.png"},{"id":"tandoori-masala","name":"Tandoori Masala","min":80,"max":80,"sizes":"100 g","img":"2025/01/DSC016671-600x800.jpg"}],"powder":[{"id":"jeera-powder","name":"Jeera Powder","min":40,"max":80,"sizes":"50 g · 100 g","img":"2024/04/8.png"},{"id":"special-kashmiri-chili-powder","name":"Special Kashmiri Chili Powder","min":120,"max":600,"sizes":"","img":"2024/04/6.png"},{"id":"special-suruchi-mirchi-powder","name":"Special Suruchi Mirchi Powder","min":80,"max":400,"sizes":"","img":"2024/03/Special-Suruchi-Mirchi-e1711007200796.jpeg"},{"id":"sudha-dhane-powder","name":"Sudha Dhane Powder","min":50,"max":100,"sizes":"100 g · 200 g","img":"2024/04/7.png"},{"id":"suvrna-shudha-halad-powder","name":"Suvrna Shudha Halad Powder","min":60,"max":300,"sizes":"","img":"2024/03/Untitled-design9.png"}],"pickle":[{"id":"aamba-god-lonche","name":"Aamba Goad Lonche","min":75,"max":130,"sizes":"200 g · 500 g","img":"2024/04/13.png"},{"id":"aamba-lonche","name":"Aamba Lonche","min":75,"max":240,"sizes":"","img":"2024/04/9.png"},{"id":"limbi-god-lonche","name":"Limbu Goad Lonche","min":75,"max":130,"sizes":"200 g · 500 g","img":"2024/04/14.png"},{"id":"limbu-lonche","name":"Limbu Lonche","min":75,"max":240,"sizes":"","img":"2024/04/10.png"},{"id":"mirchi-lonche","name":"Mirchi Lonche","min":75,"max":130,"sizes":"200 g · 500 g","img":"2024/04/12.png"},{"id":"mix-lonche","name":"Mix Lonche","min":75,"max":240,"sizes":"","img":"2024/04/11.png"}]};
  var TABS=[["blend","Blended Spices","blended-spices.html"],["powder","Spice Powder","spice-powder.html"],["pickle","Pickle","pickle.html"]];
  function opts(p){var s=p.sizes?p.sizes.split(/\s*\u00b7\s*/):[];
    if(s.length>1){var g=parseFloat(s[0]);return s.map(function(z,i){return {size:z,price:i===0?p.min:i===s.length-1?p.max:Math.round(p.min*parseFloat(z)/g)}})}
    if(s.length===1)return [{size:s[0],price:p.min}];
    return [{size:p.min===p.max?"":"Smallest pack",price:p.min}]}
  var modal,cur="blend",lastFocus;
  function build(){
    modal=document.createElement("div");modal.className="shopmodal";modal.hidden=true;
    modal.innerHTML='<div class="sm-box" role="dialog" aria-modal="true" aria-labelledby="smT"><button class="sm-x" aria-label="Close">&times;</button>'
     +'<h3 id="smT">Shop Now</h3><p class="sm-sub">Pick a category, choose a pack size and add to your cart.</p>'
     +'<div class="sm-tabs" role="tablist">'+TABS.map(function(t){return '<button role="tab" data-tab="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>'
     +'<div class="sm-list" id="smList"></div>'
     +'<div class="sm-foot"><a class="btn ghost" id="smAll" href="#">View all</a><a class="btn" href="cart.html"><i class="bi bi-cart3"></i> Go to cart (<span class="cartN">0</span>)</a></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click",function(e){
      if(e.target===modal||e.target.closest(".sm-x"))return close();
      var t=e.target.closest("[data-tab]");if(t)return show(t.dataset.tab);
      var b=e.target.closest("[data-sadd]");
      if(b){var p=CAT[cur][+b.dataset.sadd],row=b.closest(".sm-row"),s=row.querySelector("select"),o=opts(p),x=o[s?+s.value:0];
        BK.add({id:p.id,name:p.name,price:x.price,size:x.size,img:p.img?U+p.img:""},true);
        b.innerHTML='<i class="bi bi-check2"></i> Added';b.classList.add("done");setTimeout(function(){b.innerHTML='<i class="bi bi-cart-plus"></i> Add';b.classList.remove("done")},1200)}});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!modal.hidden)close()});
  }
  function show(k){
    cur=k;var T=TABS.filter(function(t){return t[0]===k})[0];
    modal.querySelectorAll("[data-tab]").forEach(function(b){b.classList.toggle("on",b.dataset.tab===k);b.setAttribute("aria-selected",b.dataset.tab===k)});
    modal.querySelector("#smAll").href=T[2];modal.querySelector("#smAll").textContent="View all "+T[1];
    modal.querySelector("#smList").innerHTML=CAT[k].map(function(p,n){var o=opts(p);
      var pr=p.min===p.max?rs(p.min):rs(p.min)+" \u2013 "+rs(p.max);
      var sel=o.length>1?'<select aria-label="Pack size for '+esc(p.name)+'">'+o.map(function(x,j){return '<option value="'+j+'">'+esc(x.size)+' \u2013 '+rs(x.price)+'</option>'}).join("")+'</select>':'<span class="sm-sz">'+esc(o[0].size||"")+'</span>';
      return '<div class="sm-row"><div class="sm-im">'+(p.img?'<img src="'+U+p.img+'" alt="" loading="lazy" onerror="this.remove()">':'')+'</div><div class="sm-nm"><b>'+esc(p.name)+'</b><span>'+pr+'</span></div><div class="sm-ac">'+sel+'<button class="btn" data-sadd="'+n+'"><i class="bi bi-cart-plus"></i> Add</button></div></div>'}).join("");
    badge()}
  function open(k){if(!modal)build();lastFocus=document.activeElement;show(CAT[k]?k:"blend");modal.hidden=false;document.body.style.overflow="hidden";modal.querySelector(".sm-x").focus()}
  function close(){modal.hidden=true;document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  BK.openShop=open;
  document.addEventListener("click",function(e){var a=e.target.closest("[data-shop]");
    if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;e.preventDefault();open(a.dataset.shop)});
})();
