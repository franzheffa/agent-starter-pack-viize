cat << 'EOF' > Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml uv.lock README.md ./
COPY app ./app

# Installer les dépendances
RUN pip install --no-cache-dir uvicorn && \
    pip install --no-cache-dir -e . && \
    uv sync --frozen

EXPOSE 8080

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

