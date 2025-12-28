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
	cd frontend && yarn prettier --check .
	cd frontend && yarn lint


fix:
	uv run ruff check --fix --unsafe-fixes .
	uv run ruff format .
	cd frontend && yarn prettier --write .
	cd frontend && yarn lint --fix
