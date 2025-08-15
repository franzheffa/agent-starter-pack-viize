import os
from typing import Optional
from fastapi import FastAPI, Request
from sse_starlette.sse import EventSourceResponse
from fastapi.responses import StreamingResponse

from google import genai
from google.genai import types
from google.cloud import texttospeech

app = FastAPI()

PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "europe-west1")
DEFAULT_MODEL = os.getenv("GEMINI_MODEL","gemini-2.5-flash")

# IMPORTANT : initialisation Vertex (pas d'API key nécessaire sur Cloud Run)
client = genai.Client(vertexai=True, project=PROJECT, location=LOCATION)

@app.get("/health")
def health():
    return {"status":"ok","service":"agent-gateway","model":DEFAULT_MODEL,"agents":{"echo":True,"gemini":True,"tts":True},"project":PROJECT,"location":LOCATION}

@app.post("/agents/echo")
async def echo(req: Request):
    body = await req.json()
    return {"reply": f"Echo: {body.get('text','')}"}

def to_contents(prompt:str, image_url:Optional[str]):
    parts=[types.Part.from_text(prompt or "")]
    if image_url:
        parts.append(types.Part.from_uri(image_url, "image/jpeg"))
    return [types.Content(role="user", parts=parts)]

@app.post("/agents/gemini")
async def gemini(req: Request):
    b = await req.json()
    model = b.get("model") or DEFAULT_MODEL
    contents = to_contents(b.get("prompt",""), b.get("imageUrl"))
    resp = client.responses.generate(model=model, contents=contents)
    return {"ok": True, "model": model, "text": resp.output_text or ""}

@app.post("/agents/gemini/stream")
async def gemini_stream(req: Request):
    b = await req.json()
    model = b.get("model") or DEFAULT_MODEL
    contents = to_contents(b.get("prompt",""), b.get("imageUrl"))

    def gen():
        try:
            with client.responses.stream(model=model, contents=contents) as stream:
                for ev in stream:
                    if ev.type == "response.output_text.delta":
                        yield f"data: {{\"event\":\"delta\",\"data\":{ev.delta!r}}}\n\n"
                    elif ev.type == "response.completed":
                        yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {{\"event\":\"error\",\"data\":{str(e)!r}}}\n\n"

    return EventSourceResponse(gen())

@app.get("/voice")
def tts(text: str = "Bonjour de Buttertech."):
    tts_client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code="fr-FR", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=1.0)
    audio = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
    return StreamingResponse(iter([audio.audio_content]), media_type="audio/mpeg")
