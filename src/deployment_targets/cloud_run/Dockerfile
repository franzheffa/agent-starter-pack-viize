FROM python:3.11-slim

WORKDIR /code

COPY ./pyproject.toml ./README.md ./uv.lock ./
COPY ./app ./app

RUN pip install --no-cache-dir uvicorn && \
    pip install --no-cache-dir ".[all]" || true && \
    uv sync --frozen

EXPOSE 8080

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8080"]
