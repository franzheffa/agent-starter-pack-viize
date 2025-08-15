from fastapi import FastAPI, Request
from pydantic import BaseModel
import os

app = FastAPI(title="agent-starter-pack-viize")

@app.get("/")
def root():
    return {"ok": True, "service": os.environ.get("K_SERVICE", "local")}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "revision": os.environ.get("K_REVISION", "local"),
        "service": os.environ.get("K_SERVICE", "local"),
    }

class Message(BaseModel):
    message: str | None = None

@app.post("/api")
async def api(msg: Message):
    return {"reply": f"Echo: {msg.message or ''}"}
