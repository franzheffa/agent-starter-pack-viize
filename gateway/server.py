import os, base64, mimetypes, logging
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import vertexai
from vertexai.generative_models import GenerativeModel, Part, GenerationConfig
from google.cloud import texttospeech

logging.basicConfig(level=logging.INFO)
app = FastAPI()

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")

# Liste de modèles tentés en cascade (tu peux forcer via GEMINI_MODEL)
PREFERRED = [
    os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]

def _init():
    if not PROJECT: raise RuntimeError("GOOGLE_CLOUD_PROJECT non défini")
    vertexai.init(project=PROJECT, location=LOCATION)

def _get_model():
    _init()
    last_exc = None
    for mid in PREFERRED:
        try:
            m = GenerativeModel(mid)
            logging.info(f"Using model: {mid}")
            return m, mid
        except Exception as e:
            last_exc = e
            logging.warning(f"Model {mid} not available: {e}")
    raise last_exc

def mime_from_url(url: str) -> str:
    guess = mimetypes.guess_type(url)[0]
    return guess or "image/jpeg"

class EchoIn(BaseModel):
    text: str

class GeminiIn(BaseModel):
    prompt: str
    imageUrl: Optional[str] = None

class TtsIn(BaseModel):
    text: str
    languageCode: str = "fr-FR"
    voice: str = "fr-FR-Neural2-A"

@app.get("/health")
def health():
    try:
        _, mid = _get_model()
        return {"status":"ok","service":"agent-gateway","model":mid,"agents":{"echo":True,"gemini":True,"tts":True}}
    except Exception as e:
        return {"status":"fail","error":str(e)}

@app.post("/agents/echo")
def echo(inp: EchoIn):
    return {"reply": f"Echo: {inp.text}"}

@app.post("/agents/gemini")
def gemini(inp: GeminiIn):
    try:
        model, mid = _get_model()
        parts = [inp.prompt]
        if inp.imageUrl:
            parts.append(Part.from_uri(uri=inp.imageUrl, mime_type=mime_from_url(inp.imageUrl)))
        out = model.generate_content(
            parts,
            generation_config=GenerationConfig(temperature=0.7, max_output_tokens=1024),
        )
        text = out.text or ""
        return {"ok": True, "model": mid, "text": text}
    except Exception as e:
        logging.exception("gemini error")
        return {"ok": False, "from":"gateway", "status": 500, "raw": "Internal Server Error", "detail": str(e)}

@app.post("/voice/tts")
def voice(inp: TtsIn):
    try:
        client = texttospeech.TextToSpeechClient()
        ssml = inp.text
        synthesis_input = texttospeech.SynthesisInput(text=ssml)
        voice = texttospeech.VoiceSelectionParams(language_code=inp.languageCode, name=inp.voice)
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        resp = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        return {"ok": True, "audio_b64": base64.b64encode(resp.audio_content).decode("utf-8")}
    except Exception as e:
        logging.exception("tts error")
        return {"ok": False, "detail": str(e)}
