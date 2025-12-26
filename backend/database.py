import logging
import sqlite3
from pathlib import Path

logger = logging.getLogger(__name__)

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def get_db_connection(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def run_migrations(db_path: Path) -> None:
    if not db_path.exists():
        db_path.parent.mkdir(parents=True, exist_ok=True)

    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    cursor.execute("SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1")
    result = cursor.fetchone()
    current_version = result[0] if result else 0

    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"), key=lambda x: int(x.stem.split("_")[0]))

    for migration_file in migration_files:
        version = int(migration_file.stem.split("_")[0])
        if version > current_version:
            logger.debug(f"Running migration {migration_file.name}")
            with migration_file.open() as f:
                migration_sql = f.read()

            cursor.executescript(migration_sql)
            cursor.execute("INSERT INTO schema_migrations (version) VALUES (?)", (version,))
            conn.commit()

    conn.close()
