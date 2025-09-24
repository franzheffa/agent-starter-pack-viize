#!/usr/bin/env bash
set -euo pipefail
cd ~/agent-starter-pack-viize

# ⇣ 1) URL de ton gateway Cloud Run (modifiable en argument)
GATEWAY="${1:-https://agent-smith-heffa-112329442315.us-central1.run.app}"
echo "GATEWAY = $GATEWAY"

# ⇣ 2) vercel.json avec les vars que le front peut lire
cat > vercel.json <<JSON
{
  "version": 2,
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "$GATEWAY",
    "NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL": "$GATEWAY"
  }
}
JSON

# ⇣ 3) Fonction Vercel /api/agent :
# - GET  => health (évite le 405)
# - POST => proxy vers /agents/echo sur le gateway
mkdir -p api
cat > api/agent.js <<'JS'
export default async function handler(req, res) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL;
  if (!base) return res.status(500).json({ error: 'API base URL missing' });

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, base });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const upstream = await fetch(`${base}/agents/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });
    const data = await upstream.json();
    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upstream error' });
  }
}
JS

# ⇣ 4) Page statique minimaliste (index.html) pour tester depuis le navigateur
cat > index.html <<'HTML'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Buttertech • Agent Gateway</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;padding:2rem;background:#0b0b0b;color:#fafafa}
  .card{max-width:800px;margin:0 auto;padding:1.5rem;border-radius:16px;background:#161616;box-shadow:0 10px 30px rgba(0,0,0,.25)}
  h1{font-size:1.5rem;margin:0 0 1rem}
  textarea{width:100%;min-height:110px;padding:.75rem;border-radius:12px;border:1px solid #2a2a2a;background:#0f0f0f;color:#fff}
  button{margin-top:.75rem;padding:.75rem 1rem;border:0;border-radius:12px;background:#4f46e5;color:#fff;font-weight:600;cursor:pointer}
  .out{white-space:pre-wrap;background:#0f0f0f;border:1px solid #2a2a2a;border-radius:12px;padding:.75rem;margin-top:1rem;min-height:70px}
  .ok{color:#22c55e;font-weight:600}.err{color:#ef4444;font-weight:600}.meta{font-size:.85rem;opacity:.8;margin-bottom:1rem}
</style>
</head>
<body>
  <div class="card">
    <h1>Buttertech – Agent (Echo)</h1>
    <div class="meta" id="meta">Vérification connexion…</div>
    <textarea id="msg" placeholder="Écris un message…">Bonjour</textarea>
    <button id="send">Envoyer</button>
    <div class="out" id="out"></div>
  </div>
<script>
async function health(){
  try{
    const r=await fetch('/api/agent'); const j=await r.json();
    document.getElementById('meta').innerHTML = r.ok ? '<span class="ok">Connecté</span> → '+(j.base||'') : '<span class="err">Hors ligne</span>';
  }catch{ document.getElementById('meta').innerHTML='<span class="err">Hors ligne</span>'; }
}
document.getElementById('send').onclick=async()=>{
  const out=document.getElementById('out'); out.textContent='…';
  try{
    const r=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:document.getElementById('msg').value})});
    const j=await r.json(); out.textContent=JSON.stringify(j,null,2);
  }catch(e){ out.textContent='Erreur: '+e.message; }
};
health();
</script>
</body></html>
HTML

git add vercel.json api/agent.js index.html
git commit -m "web: /api/agent proxy + health + page de test"
git push origin HEAD:main
echo
echo "✅ Poussé sur GitHub. Vercel va lancer un nouveau déploiement."
echo "• Test santé backend:  curl -s $GATEWAY/health | jq ."
echo "• Quand le déploiement est prêt: ouvre https://<ton-domaine-ou-url-vercel>/  puis /api/agent (GET) doit répondre { ok: true, base: ... }"
