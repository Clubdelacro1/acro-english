const CACHE="acro-v202610171114", FONTS="acro-fonts";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","guardadas.json"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// Con conexión trae lo último; si no hay señal (o tarda más de 3 s) usa la copia guardada
function netFirst(req){
  const net=fetch(req).then(r=>{ if(r.ok){ const c=r.clone(); caches.open(CACHE).then(ca=>ca.put(req,c)); } return r; });
  const slow=new Promise(res=>setTimeout(res,3000)).then(()=>caches.match(req,{ignoreSearch:true}));
  return Promise.race([net.catch(()=>caches.match(req,{ignoreSearch:true})),slow.then(r=>r||net)])
    .then(r=>r||caches.match("index.html"));
}
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin) e.respondWith(netFirst(e.request));
  else if(/(^|\.)(fonts\.googleapis|fonts\.gstatic)\.com$/.test(u.hostname))
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ const c=res.clone(); caches.open(FONTS).then(ca=>ca.put(e.request,c)); return res; })));
});
