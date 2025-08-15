set -euo pipefail
PROJECT="buttertech-ai-platform"
REGION="europe-west1"
SERVICE="agent-starter-pack-viize"
cd ~/agent-starter-pack-viize

# Écrit app/server.py (conserve /health et l'echo + ajoute /api/gemini)
cat > app/server.py <<'PY'
import os, logging, requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# --- Vertex AI (service account du service Cloud Run) ---
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, Part
    PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("PROJECT_ID")
    LOCATION   = os.environ.get("VERTEX_LOCATION","europe-west1")
    MODEL_NAME = os.environ.get("GENMODEL_TEXT","gemini-1.5-flash")
    if PROJECT_ID:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        GEMINI = GenerativeModel(MODEL_NAME)
    else:
        GEMINI = None
except Exception as e:
    logging.exception("Vertex AI init failed")
    GEMINI = None

app = FastAPI()

@app.get("/health")
def health():
    return {"status":"ok","service":"agent-starter-pack-viize"}

class EchoReq(BaseModel):
    message: str

@app.post("/api")
def echo(req: EchoReq):
    return {"reply": f"Echo: {req.message}"}

class GeminiReq(BaseModel):
    prompt: str
    image_url: Optional[str] = None  # optionnel pour multimodal

@app.post("/api/gemini")
def gemini(req: GeminiReq):
    if GEMINI is None:
        raise HTTPException(status_code=500, detail="Vertex AI not initialized")
    try:
        parts = [req.prompt]
        if req.image_url:
            r = requests.get(req.image_url, timeout=15)
            r.raise_for_status()
            parts = [Part.from_image(bytes=r.content), req.prompt]
        resp = GEMINI.generate_content(parts)
        txt = getattr(resp, "text", "") or ""
        # fallback (versions de lib plus anciennes)
        if not txt:
            try:
                cand = (resp.candidates or [])[0]
                txt = "".join(getattr(p, "text", "") for p in cand.content.parts)
            except Exception:
                txt = ""
        return {"reply": txt}
    except Exception as e:
        logging.exception("Gemini error")
        raise HTTPException(status_code=500, detail=str(e))
PY

git add app/server.py
git commit -m "feat(api): add /api/gemini (Vertex AI multimodal)" || true
git push origin main

# Assure les prérequis Vertex AI pour le service account runtime
SA="$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(spec.template.spec.serviceAccountName)')"
gcloud services enable aiplatform.googleapis.com --project "$PROJECT"
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" \
  --role="roles/aiplatform.user" >/dev/null

# Rebuild & deploy (Cloud Build → Cloud Run)
gcloud builds submit --config=cloudbuild.yaml --project="$PROJECT"

URL="$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(status.url)')"
echo "Cloud Run URL: $URL"
echo "Test local (Gemini): curl -s -X POST $URL/api/gemini -H 'content-type: application/json' -d '{\"prompt\":\"Dis bonjour\"}'"
