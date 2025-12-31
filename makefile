frontend-run:
	cd frontend && make run

install:
	uv sync

run:
	uv run python main.py --path-prefix ./data

test:
	uv run ruff check --quiet .
	uv run ruff format --check --quiet .
	uv run pytest -qq backend/tests/
	cd frontend && yarn --silent tsc --noEmit
	cd frontend && yarn --silent prettier --log-level silent --check .
	cd frontend && yarn --silent lint
	cd frontend && yarn --silent vitest run

fix:
	uv run ruff format --quiet .
	uv run ruff check --fix --unsafe-fixes --quiet .
	cd frontend && yarn --silent prettier --write --list-different .
	cd frontend && yarn --silent lint --fix
