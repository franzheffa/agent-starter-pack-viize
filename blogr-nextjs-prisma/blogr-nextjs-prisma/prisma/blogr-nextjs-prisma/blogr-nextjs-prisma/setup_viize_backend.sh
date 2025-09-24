#!/usr/bin/env bash
set -euo pipefail

# --- Réglages ---
REPO_DIR="$(pwd)"
GATEWAY="${1:-https://agent-smith-heffa-112329442315.us-central1.run.app}"

echo "➡️  Repo: $REPO_DIR"
echo "➡️  GATEWAY: $GATEWAY"
echo

# --- Backups (si fichiers existent) ---
ts=$(date +%Y%m%d-%H%M%S)
for f in vercel.json api/agent.js index.html; do
  if [ -f "$f" ]; then
    mkdir -p .backup
    cp "$f" ".backup/${f}.${ts}.bak"
    echo "🔸 Backup: $f -> .backup/${f}.${ts}.bak"
  fi
done
echo

# --- 1) vercel.json (vars lisibles côté client si besoin) ---
cat > vercel.json <<JSON
{
  "version": 2,
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "$GATEWAY",
    "NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL": "$GATEWAY"
  },
  "functions": {
    "api/*.ts": { "runtime": "nodejs20" },
    "api/*.js": { "runtime": "nodejs20" }
  }
}
JSON
echo "✅ vercel.json écrit"

# --- 2) /api/agent.js (ESM, compatible \"type\":\"module\") ---
mkdir -p api
cat > api/agent.js <<'JS'
export default async function handler(req, res) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL;
    if (!base) return res.status(500).json({ error: 'API base URL missing' });

    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, base });
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const upstream = await fetch(`${base}/agents/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });

    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
JS
echo "✅ api/agent.js écrit (ESM)"

# --- 3) index.html de test ---
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
echo "✅ index.html écrit"

# --- 4) Git push ---
git add vercel.json api/agent.js index.html
git commit -m "fix(api): ESM handler + vercel.json + test page" || true
git push origin HEAD:main

echo
echo "✅ Fichiers poussés. Déploiement Vercel en cours."
echo "Test santé (gateway):  curl -s $GATEWAY/health || true"
echo "Quand Vercel est prêt: ouvre /api/agent (GET) puis POST depuis la page racine."
