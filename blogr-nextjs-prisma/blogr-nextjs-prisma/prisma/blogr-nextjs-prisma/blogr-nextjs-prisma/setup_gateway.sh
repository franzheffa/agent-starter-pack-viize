#!/usr/bin/env bash
set -euo pipefail

# --------- Config de base ----------
PROJECT="buttertech-ai-platform"
REGION="us-central1"
GATEWAY_SERVICE="agent-smith-heffa"
ECHO_AGENT_SERVICE="agent-starter-pack-viize"   # ton agent déjà déployé (endpoint /api)
# -----------------------------------

echo "==> Repo courant : $(pwd)"
test -d .git || { echo "Ce dossier n'est pas un repo git."; exit 1; }

# 1) Récupère l’URL de l’agent echo déjà en prod
ECHO_URL="$(gcloud run services describe "$ECHO_AGENT_SERVICE" --region "$REGION" --format='value(status.url)')"
if [[ -z "${ECHO_URL}" ]]; then
  echo "Impossible de lire l'URL du service $ECHO_AGENT_SERVICE"; exit 1
fi
echo "ECHO_URL = $ECHO_URL"

# 2) Arborescence gateway
mkdir -p gateway

# 3) Code FastAPI du gateway (proxy)
cat > gateway/server.py <<'PY'
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import os, httpx

app = FastAPI(title="Agent Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # serre ensuite sur ton domaine Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AGENTS = {
    "echo": os.environ.get("ECHO_URL"),  # /api en POST
    # ajoute d'autres agents ici: "vision": os.environ.get("VISION_URL"), etc.
}

@app.get("/health")
def health():
    return {"status": "ok", "service": "agent-gateway", "agents": {k: bool(v) for k,v in AGENTS.items()}}

async def _forward(client: httpx.AsyncClient, method: str, url: str, req: Request):
    params = dict(req.query_params)
    headers = {k:v for k,v in req.headers.items() if k.lower() not in ("host","content-length","transfer-encoding")}
    content = None
    # tente JSON, sinon binaire brut (ex: fichiers)
    try:
        content = await req.json()
        resp = await client.request(method, url, json=content, params=params, headers=headers, timeout=60)
    except Exception:
        body = await req.body()
        resp = await client.request(method, url, content=body, params=params, headers=headers, timeout=60)

    ctype = resp.headers.get("content-type","")
    if "application/json" in ctype:
        return JSONResponse(status_code=resp.status_code, content=resp.json())
    return PlainTextResponse(status_code=resp.status_code, content=resp.text)

@app.api_route("/agents/{agent}{path:path}", methods=["GET","POST","PUT","PATCH","DELETE","OPTIONS"])
async def route_agent(agent: str, path: str, request: Request):
    base = AGENTS.get(agent)
    if not base:
        raise HTTPException(404, f"Unknown agent '{agent}'")
    # si /agents/echo  -> redirige vers /api (par défaut)
    target_path = path if path.strip() else "/api"
    url = base.rstrip("/") + target_path
    async with httpx.AsyncClient() as client:
        return await _forward(client, request.method, url, request)
PY

# 4) Dockerfile spécifique au gateway
cat > Dockerfile.gateway <<'DOCKER'
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY gateway /app/gateway
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir fastapi==0.115.2 uvicorn==0.35.0 httpx==0.28.1

EXPOSE 8080
CMD ["uvicorn","gateway.server:app","--host","0.0.0.0","--port","8080"]
DOCKER

# 5) Cloud Build pour builder/pusher l'image et déployer sur Cloud Run (gateway)
cat > cloudbuild.gateway.yaml <<'YAML'
steps:
- name: gcr.io/cloud-builders/docker
  args: ['build',
         '-f','Dockerfile.gateway',
         '-t','gcr.io/$PROJECT_ID/agent-gateway:${BUILD_ID}',
         '-t','gcr.io/$PROJECT_ID/agent-gateway:latest',
         '.']
- name: gcr.io/cloud-builders/docker
  args: ['push','gcr.io/$PROJECT_ID/agent-gateway:${BUILD_ID}']
- name: gcr.io/cloud-builders/docker
  args: ['push','gcr.io/$PROJECT_ID/agent-gateway:latest']
- name: gcr.io/google.com/cloudsdktool/cloud-sdk
  entrypoint: gcloud
  args:
    - run
    - deploy
    - agent-gateway
    - --image=gcr.io/$PROJECT_ID/agent-gateway:${BUILD_ID}
    - --region=europe-west1
    - --allow-unauthenticated
    - --platform=managed
    - --set-env-vars=ECHO_URL=${_ECHO_URL}
images:
- gcr.io/$PROJECT_ID/agent-gateway:${BUILD_ID}
- gcr.io/$PROJECT_ID/agent-gateway:latest
options:
  logging: CLOUD_LOGGING_ONLY
YAML

# 6) Commit + push (déclenche rien d'automatique, on va build manuellement)
git add gateway/server.py Dockerfile.gateway cloudbuild.gateway.yaml
git commit -m "feat(gateway): FastAPI proxy + Cloud Run deploy (agent-gateway)"
git push origin HEAD:main

# 7) Build & Deploy du gateway avec substitution ECHO_URL
gcloud config set project "$PROJECT" >/dev/null
gcloud builds submit --config=cloudbuild.gateway.yaml --substitutions=_ECHO_URL="$ECHO_URL"

# 8) Récupère l'URL du gateway et branche Vercel via vercel.json
GW_URL="$(gcloud run services describe "$GATEWAY_SERVICE" --region "$REGION" --format='value(status.url)')"
echo "GATEWAY URL = $GW_URL"

cat > vercel.json <<JSON
{
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "${GW_URL}"
  }
}
JSON

git add vercel.json
git commit -m "chore(vercel): NEXT_PUBLIC_API_BASE_URL=${GW_URL}"
git push origin HEAD:main

# 9) Tests rapides
echo "==> Test /health"
curl -s "${GW_URL}/health" | sed 's/.*/[health] &/'
echo "==> Test proxy echo (/agents/echo -> ${ECHO_URL}/api)"
curl -s -X POST "${GW_URL}/agents/echo" -H "Content-Type: application/json" -d '{"message":"Bonjour"}' | sed 's/.*/[echo] &/'

echo "DONE."
