import base64, os, mimetypes, requests
from fastapi import FastAPI
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from google.cloud import texttospeech

app = FastAPI()

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")  # 2.5 flash par défaut
TTS_VOICE = os.getenv("TTS_VOICE", "fr-FR-Neural2-A")

vertexai.init(project=PROJECT, location=LOCATION)
_model = GenerativeModel(MODEL_ID)

class EchoReq(BaseModel):
    text: str

class GeminiReq(BaseModel):
    prompt: str
    imageUrl: str | None = None
    speak: bool = False

@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "agent-gateway",
        "project": PROJECT,
        "location": LOCATION,
        "model": MODEL_ID,
        "agents": {"echo": True, "gemini": True},
    }

@app.post("/agents/echo")
def echo(req: EchoReq):
    return {"reply": f"Echo: {req.text}"}

def _part_from_image(url: str) -> Part:
    # Devine le mime à partir de l'extension (fallback jpeg)
    mime, _ = mimetypes.guess_type(url)
    if not mime:
        mime = "image/jpeg"
    return Part.from_uri(uri=url, mime_type=mime)

def _tts_mp3_b64(text: str) -> str:
    client = texttospeech.TextToSpeechClient()
    input_ = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code=TTS_VOICE.split("-")[0] + "-" + TTS_VOICE.split("-")[1], name=TTS_VOICE)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    audio = client.synthesize_speech(input=input_, voice=voice, audio_config=audio_config)
    return base64.b64encode(audio.audio_content).decode("utf-8")

@app.post("/agents/gemini")
def run_gemini(req: GeminiReq):
    try:
        parts = []
        if req.imageUrl:
            parts.append(_part_from_image(req.imageUrl))
        parts.append(req.prompt)
        resp = _model.generate_content(parts)
        text = (resp.text or "").strip()
        out = {"ok": True, "from": "gateway", "model": MODEL_ID, "text": text}
        if req.speak and text:
            out["audio_b64_mp3"] = _tts_mp3_b64(text)
        return out
    except Exception as e:
        return {"ok": False, "from": "gateway", "status": 500, "error": str(e)}

