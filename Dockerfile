FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ ./
RUN yarn build

FROM python:3.12-slim AS backend

WORKDIR /app

RUN pip install --no-cache-dir uv

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

EXPOSE 8000

CMD ["sh", "-c", "mkdir -p \"${PREFIX:-/app/data}\" && uv run python main.py --host \"${HOST:-0.0.0.0}\" --port \"${PORT:-8000}\" --db-prefix \"${PREFIX:-/app/data}\" --cors-origins \"${CORS_ORIGINS:-}\" --static-dir ./static"]

