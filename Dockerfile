FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080 \
    APP_MODULE=app.server:app

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copie du code
COPY . /app

# Dépendances Python
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir uvicorn && \
    pip install --no-cache-dir .

EXPOSE 8080
CMD ["sh","-lc","uvicorn ${APP_MODULE} --host 0.0.0.0 --port ${PORT}"]
