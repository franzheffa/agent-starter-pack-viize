import os, requests
from fastapi import FastAPI
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part

app = FastAPI()

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")
MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
ECHO_URL = os.getenv("GATEWAY_BACKEND_ECHO_URL")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "agent-gateway",
        "agents": {"echo": True, "gemini": True},
        "project": PROJECT, "location": LOCATION, "model": MODEL
    }

class EchoReq(BaseModel):
    text: str = ""

@app.post("/agents/echo")
def echo(req: EchoReq):
    return {"reply": f"Echo: {req.text}"}

class GeminiReq(BaseModel):
    prompt: str
    imageUrl: str | None = None

@app.post("/agents/gemini")
def gemini(req: GeminiReq):
    if not PROJECT:
        return {"ok": False, "from": "gateway", "status": 500, "detail": "GOOGLE_CLOUD_PROJECT not set"}
    vertexai.init(project=PROJECT, location=LOCATION)
    model = GenerativeModel(MODEL)

    parts: list = [req.prompt]
    if req.imageUrl:
        r = requests.get(req.imageUrl, timeout=10)
        r.raise_for_status()
        mime = r.headers.get("content-type", "image/jpeg").split(";")[0]
        parts.append(Part.from_bytes(r.content, mime_type=mime))

    resp = model.generate_content(parts)
    out = getattr(resp, "text", None)
    if out is None and getattr(resp, "candidates", None):
        out = "".join(getattr(p, "text", "") for p in resp.candidates[0].content.parts)
    return {"ok": True, "text": out}
