frontend-run:
	cd frontend && make run

install:
	uv sync

run:
	uv run python main.py --path-prefix ./data

test:
	uv run ruff check .
	uv run ruff format --check .
	uv run pytest backend/tests/

fix:
	uv run ruff check --fix --unsafe-fixes .
	uv run ruff format .
