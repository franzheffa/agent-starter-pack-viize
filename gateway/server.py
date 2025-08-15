import os, json, requests
from fastapi import FastAPI
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part

app = FastAPI()

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")
MODEL    = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
ECHO_URL = os.getenv("ECHO_URL")  # injecté au build

class EchoIn(BaseModel):
    text: str

class GeminiIn(BaseModel):
    prompt: str
    imageUrl: str | None = None

@app.get("/health")
def health():
    return {"status":"ok","service":"agent-gateway","agents":{"echo": True, "gemini": True}}

@app.post("/agents/echo")
def agent_echo(body: EchoIn):
    r = requests.post(f"{ECHO_URL}/api", json={"message": body.text}, timeout=15)
    r.raise_for_status()
    return r.json()

@app.post("/agents/gemini")
def agent_gemini(body: GeminiIn):
    try:
        if not PROJECT:
            return {"ok": False, "from":"gateway", "status": 500, "detail": "GOOGLE_CLOUD_PROJECT is not set"}
        vertexai.init(project=PROJECT, location=LOCATION)
        model = GenerativeModel(MODEL)

        parts: list = []
        if body.imageUrl:
            # laisse Vertex inférer le mime-type; si besoin préciser "image/jpeg"
            parts.append(Part.from_uri(body.imageUrl))
        parts.append(body.prompt)

        resp = model.generate_content(parts)
        return {"ok": True, "from":"gateway", "text": getattr(resp, "text", str(resp))}
    except Exception as e:
        return {"ok": False, "from":"gateway", "status": 500, "raw": "Internal Server Error", "detail": str(e)}
