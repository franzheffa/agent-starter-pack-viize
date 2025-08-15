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
