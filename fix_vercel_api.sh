#!/usr/bin/env bash
set -euo pipefail

# --------- Réglages ----------
GATEWAY="${1:-https://agent-gateway-fqsvjamshq-ew.a.run.app}"
echo "GATEWAY = $GATEWAY"

# --------- Nettoyage / backup ----------
mkdir -p .backup api public
ts=$(date +%Y%m%d-%H%M%S)
[ -f api/agent.ts ] && cp api/agent.ts ".backup/agent.ts.$ts.bak" && git rm -f api/agent.ts || true
[ -f api/agent.js ] && cp api/agent.js ".backup/agent.js.$ts.bak" && git rm -f api/agent.js || true

# --------- vercel.json ----------
cat > vercel.json <<JSON
{
  "version": 2,
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "$GATEWAY",
    "NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL": "$GATEWAY"
  },
  "functions": {
    "api/*.cjs": { "runtime": "nodejs20" }
  }
}
JSON
echo "✅ vercel.json écrit"

# --------- .gitignore : ne PAS ignorer api/ ----------
touch .gitignore
# ajoute des règles d'exception en fin de fichier (écrasent un éventuel 'api/' plus haut)
printf "\n# keep api for Vercel\n!api/\n!api/**\n" >> .gitignore

# --------- API Vercel en CommonJS (pas d'ESM ici) ----------
cat > api/agent.cjs <<'CJS'
module.exports = async function (req, res) {
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
    const r = await fetch(base + "/agents/echo", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });

    const data = await r.json().catch(() => ({}));
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
CJS
echo "✅ api/agent.cjs écrit"

# --------- Page de test (statique) ----------
cat > public/index.html <<'HTML'
<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
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
<div class="card">
  <h1>Buttertech – Agent (Echo)</h1>
  <div class="meta" id="meta">Vérification connexion…</div>
  <textarea id="msg">Bonjour</textarea>
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
    const r=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:document.getElementById('msg').value})});
    const j=await r.json(); out.textContent=JSON.stringify(j,null,2);
  }catch(e){ out.textContent='Erreur: '+e.message; }
};
health();
</script>
HTML
echo "✅ public/index.html écrit"

# --------- Git: commit, rebase, push ----------
git add -f vercel.json api/agent.cjs public/index.html .gitignore
git commit -m "vercel: switch API to CommonJS (.cjs), serve public/, unignore api" || true
git fetch origin
git rebase -X theirs origin/main || true
git push origin HEAD:main

echo
echo "✅ Push ok. Dans Vercel, attends la fin du déploiement puis teste :"
echo "• GET  https://<ton-app>.vercel.app/api/agent"
echo "• Ouvre https://<ton-app>.vercel.app/ et envoie un message."
