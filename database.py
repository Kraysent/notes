import sqlite3
from pathlib import Path
from typing import Optional

DATABASE_PATH: Optional[Path] = None
MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def set_database_path(db_path: Path) -> None:
    global DATABASE_PATH
    DATABASE_PATH = db_path


def get_db_connection() -> sqlite3.Connection:
    if DATABASE_PATH is None:
        raise RuntimeError("Database path not set. Call set_database_path() first.")
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def run_migrations() -> None:
    if DATABASE_PATH is None:
        raise RuntimeError("Database path not set. Call set_database_path() first.")
    if not DATABASE_PATH.exists():
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    conn = get_db_connection()
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
    
    migration_files = sorted(
        [f for f in MIGRATIONS_DIR.glob("*.sql")],
        key=lambda x: int(x.stem.split("_")[0])
    )
    
    for migration_file in migration_files:
        version = int(migration_file.stem.split("_")[0])
        if version > current_version:
            with open(migration_file, "r") as f:
                migration_sql = f.read()
            
            cursor.executescript(migration_sql)
            cursor.execute(
                "INSERT INTO schema_migrations (version) VALUES (?)",
                (version,)
            )
            conn.commit()
    
    conn.close()


def init_db() -> None:
    run_migrations()

