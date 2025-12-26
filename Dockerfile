FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ ./
RUN yarn build

FROM ghcr.io/astral-sh/uv:debian-slim AS backend

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY backend/ ./backend/
COPY main.py ./
COPY --from=frontend-builder /app/frontend/dist ./static

ENV PREFIX=/app/data
ENV HOST=0.0.0.0
ENV PORT=8000
ENV CORS_ORIGINS=

RUN mkdir -p /app/data

CMD ["sh", "-c", "mkdir -p \"${PREFIX}\" && uv run python main.py --host \"${HOST}\" --port \"${PORT:-8000}\" --path-prefix \"${PREFIX}\" --cors-origins \"${CORS_ORIGINS}\""]
