# Étape 1: Build
# Utilise une image Python officielle comme image de base
FROM python:3.10-slim as builder

# Définit le répertoire de travail
WORKDIR /app

# Empêche Python d'écrire des fichiers.pyc
ENV PYTHONDONTWRITEBYTECODE 1
# Assure que la sortie de Python n'est pas mise en mémoire tampon
ENV PYTHONUNBUFFERED 1

# Installe les dépendances système si nécessaire
# RUN apt-get update && apt-get install -y...

# Installe les dépendances Python
COPY requirements.txt.
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Étape 2: Final
FROM python:3.10-slim

WORKDIR /app

# Copie les dépendances pré-compilées de l'étape de build
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt.
RUN pip install --no-cache /wheels/*

# Copie le code de l'application
COPY..

# Expose le port sur lequel l'application s'exécute
EXPOSE 8080

# Commande pour exécuter l'application avec Uvicorn
# Le port est défini à 8080, comme attendu par Cloud Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
