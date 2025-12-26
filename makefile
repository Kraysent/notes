frontend-run:
	cd frontend && make run

install:
	uv sync

run:
	uv run python main.py --path-prefix ./data

test:
	uv run pytest backend/tests/
