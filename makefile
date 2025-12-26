frontend-run:
	cd frontend && make run

install:
	uv sync

run:
	uv run python main.py

test:
	uv run python -m pytest backend/tests/
