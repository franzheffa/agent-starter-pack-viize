import os
from typing import Optional, Iterator, List, Union
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse, StreamingResponse, Response
from pydantic import BaseModel

# Vertex AI (Generative)
import vertexai
from vertexai.generative_models import GenerativeModel, Part
# TTS
from google.cloud import texttospeech as tts

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")
MODEL_NAME = os.getenv("GEMINI_MODEL","gemini-2.5-flash")

app = FastAPI()
_model: Optional[GenerativeModel] = None

def _init_vertex():
    global _model
    if _model is None:
        vertexai.init(project=PROJECT, location=LOCATION)  # ADC on Cloud Run
        _model = GenerativeModel(MODEL_NAME)
    return _model

@app.get("/health")
def health():
    return {"status":"ok","service":"agent-gateway","model":MODEL_NAME,"agents":{"echo":True,"gemini":True,"tts":True}}

class EchoIn(BaseModel):
    text: str = ""

@app.post("/agents/echo")
def echo(inp: EchoIn):
    return {"reply": f"Echo: {inp.text}"}

class GeminiIn(BaseModel):
    prompt: str
    imageUrl: Optional[str] = None

def _contents(inp: GeminiIn) -> List[Union[str, Part]]:
    if inp.imageUrl:
        return [Part.from_uri(inp.imageUrl, mime_type="image/jpeg"), inp.prompt]
    return [inp.prompt]

@app.post("/agents/gemini")
def gemini(inp: GeminiIn, stream: int = 0):
    model = _init_vertex()
    if stream:
        def gen() -> Iterator[bytes]:
            for chunk in model.generate_content(_contents(inp), stream=True):
                txt = ""
                try:
                    # robust extraction
                    if getattr(chunk, "text", ""):
                        txt = chunk.text
                    else:
                        # older SDK shapes
                        cand = chunk.candidates[0]
                        part = cand.content.parts[0]
                        txt = getattr(part, "text", "") or ""
                except Exception:
                    txt = ""
                if txt:
                    yield txt.encode("utf-8")
        return StreamingResponse(gen(), media_type="text/plain; charset=utf-8")
    else:
        out = model.generate_content(_contents(inp))
        return JSONResponse({"ok": True, "model": MODEL_NAME, "text": getattr(out, "text", "")})

# ---- Text-to-Speech (MP3)
@app.post("/agents/tts")
def tts_mp3(text: str = Body(..., media_type="text/plain")):
    client = tts.TextToSpeechClient()
    req = tts.SynthesizeSpeechRequest(
        input=tts.SynthesisInput(text=text[:5000]),
        voice=tts.VoiceSelectionParams(language_code="fr-FR", name="fr-FR-Neural2-C"),
        audio_config=tts.AudioConfig(audio_encoding=tts.AudioEncoding.MP3)
    )
    audio = client.synthesize_speech(request=req).audio_content
    return Response(content=audio, media_type="audio/mpeg")
