import os, httpx
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
BACKEND = "https://agent-starter-pack-viize-fqsvjamshq-ew.a.run.app"

@app.get("/health")
def health():
    return {"status":"ok","service":"agent-gateway","agents":{"echo":True,"gemini":True}}

async def _post_json(url: str, payload: dict):
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload)
        if r.status_code >= 400:
            raise HTTPException(status_code=r.status_code, detail=r.text)
        return r.json()

@app.post("/agents/echo")
async def proxy_echo(req: Request):
    body = await req.json()
    return await _post_json(f"{BACKEND}/api", body)

@app.post("/agents/gemini")
async def proxy_gemini(req: Request):
    body = await req.json()
    return await _post_json(f"{BACKEND}/api/gemini", body)
