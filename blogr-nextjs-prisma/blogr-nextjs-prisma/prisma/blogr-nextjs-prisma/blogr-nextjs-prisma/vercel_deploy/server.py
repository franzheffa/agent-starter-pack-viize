import os
from typing import Optional, Iterator, List, Union
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse, StreamingResponse, Response
from pydantic import BaseModel

# Vertex AI (Modèles Génératifs)
import vertexai
from vertexai.generative_models import GenerativeModel, Part
# Text-to-Speech (TTS)
from google.cloud import texttospeech as tts

# --- Configuration ---
PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("VERTEX_LOCATION", "us-central1")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# --- Initialisation de l'application FastAPI ---
app = FastAPI(
    title="AI Agent Gateway",
    description="Un service FastAPI fournissant un accès à divers agents d'IA.",
    version="1.0.0",
)

# --- Variables Globales ---
_model: Optional[GenerativeModel] = None

# --- Fonctions Utilitaires ---
def _init_vertex():
    """Initialise le client Vertex AI et le GenerativeModel si ce n'est pas déjà fait."""
    global _model
    if _model is None:
        vertexai.init(project=PROJECT, location=LOCATION)
        _model = GenerativeModel(MODEL_NAME)
    return _model

def _prepare_gemini_contents(inp: "GeminiIn") -> List[Union[str, Part]]:
    """Prépare la liste de contenus pour le modèle Gemini, en gérant les entrées multimodales."""
    if inp.imageUrl:
        # Pour les prompts multimodaux, combine l'URI de l'image et le texte.
        return [Part.from_uri(inp.imageUrl, mime_type="image/jpeg"), inp.prompt]
    # Pour les prompts textuels uniquement.
    return [inp.prompt]

# --- Modèles Pydantic ---
class EchoIn(BaseModel):
    text: str = ""

class GeminiIn(BaseModel):
    prompt: str
    imageUrl: Optional[str] = None

# --- Points d'API (Endpoints) ---
@app.get("/health", tags=["System"])
def health():
    """Endpoint de vérification pour confirmer le statut du service et sa configuration."""
    return {
        "status": "ok",
        "service": "agent-smith-heffa",
        "model": MODEL_NAME,
        "agents": {"echo": True, "gemini": True, "tts": True}
    }

@app.post("/agents/echo", tags=["Agents"])
def echo(inp: EchoIn):
    """Un agent simple qui répète le texte reçu en entrée."""
    return {"reply": f"Echo: {inp.text}"}

@app.post("/agents/gemini", tags=["Agents"])
def gemini(inp: GeminiIn, stream: int = 0):
    """
    Interagit avec le modèle Gemini.
    - `stream=1`: Retourne une réponse en streaming.
    - `stream=0`: Retourne une réponse JSON complète.
    """
    model = _init_vertex()
    contents = _prepare_gemini_contents(inp)

    if stream:
        def response_generator() -> Iterator[bytes]:
            """Fonction générateur pour les réponses en streaming."""
            for chunk in model.generate_content(contents, stream=True):
                text_chunk = ""
                try:
                    # Extraction robuste du texte du chunk, compatible avec différentes versions du SDK.
                    if hasattr(chunk, "text"):
                        text_chunk = chunk.text
                    else:
                        # Fallback pour les anciennes versions du SDK
                        part = chunk.candidates[0].content.parts[0]
                        text_chunk = getattr(part, "text", "") or ""
                except (IndexError, AttributeError):
                    # Ignorer les chunks qui ne contiennent pas de texte.
                    text_chunk = ""

                if text_chunk:
                    yield text_chunk.encode("utf-8")
        
        return StreamingResponse(response_generator(), media_type="text/plain; charset=utf-8")
    else:
        response = model.generate_content(contents)
        return JSONResponse({
            "ok": True,
            "model": MODEL_NAME,
            "text": getattr(response, "text", "")
        })

@app.post("/agents/tts", tags=["Agents"])
def tts_mp3(text: str = Body(..., media_type="text/plain", description="Texte à synthétiser en parole (max 5000 caractères).")):
    """
    Convertit du texte en parole via Google Cloud TTS et retourne un fichier audio MP3.
    """
    client = tts.TextToSpeechClient()
    
    # Préparation de la requête de synthèse
    synthesis_input = tts.SynthesisInput(text=text[:5000]) # Limite à 5000 caractères
    voice_params = tts.VoiceSelectionParams(language_code="fr-FR", name="fr-FR-Neural2-C")
    audio_config = tts.AudioConfig(audio_encoding=tts.AudioEncoding.MP3)
    
    request = tts.SynthesizeSpeechRequest(
        input=synthesis_input,
        voice=voice_params,
        audio_config=audio_config
    )
    
    # Synthèse de la parole et récupération du contenu audio
    response = client.synthesize_speech(request=request)
    
    # Retourne le contenu audio dans une réponse HTTP de type MP3
    return Response(content=response.audio_content, media_type="audio/mpeg")
