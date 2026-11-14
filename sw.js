// Offline cache: app page network-first (so updates arrive), face models/library cache-first.
const V="dc-v1.0";
const HEAVY=["lib/face-api.js","models/ssd_mobilenetv1_model-weights_manifest.json","models/ssd_mobilenetv1_model.bin","models/face_landmark_68_model-weights_manifest.json","models/face_landmark_68_model.bin","models/face_recognition_model-weights_manifest.json","models/face_recognition_model.bin"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(["./","index.html","logo.jpg",...HEAVY])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin&&(u.pathname.includes("/models/")||u.pathname.includes("/lib/"))){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})));return;
  }
  e.respondWith(fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
