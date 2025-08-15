from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import os

# Vertex AI (Gemini)
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import requests

app = FastAPI(title="Agent Gateway")

class EchoIn(BaseModel):
    text: Optional[str] = None
    message: Optional[str] = None

class GeminiIn(BaseModel):
    prompt: str
    imageUrl: Optional[str] = None

def _init_vertex():
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("PROJECT_ID")
    if not project:
        raise RuntimeError("No GCP project in env (GOOGLE_CLOUD_PROJECT/PROJECT_ID)")
    location = os.environ.get("VERTEX_LOCATION", "europe-west1")
    vertexai.init(project=project, location=location)
    model_name = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    return GenerativeModel(model_name)

@app.get("/health")
def health():
    return {"ok": True, "service": "agent-gateway", "agents": {"echo": True, "gemini": True}}

@app.post("/agents/echo")
def echo(body: EchoIn):
    txt = body.text or body.message or ""
    return {"reply": f"Echo: {txt}"}

@app.post("/agents/gemini")
def gemini(body: GeminiIn):
    try:
        model = _init_vertex()
        parts = [body.prompt]
        if body.imageUrl:
            r = requests.get(body.imageUrl, timeout=10)
            r.raise_for_status()
            mime = (r.headers.get("content-type") or "image/jpeg").split(";")[0]
            parts.append(Part.from_data(mime_type=mime, data=r.content))
        resp = model.generate_content(parts)
        return {"ok": True, "from": "gateway", "model": model.model_name, "text": resp.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
