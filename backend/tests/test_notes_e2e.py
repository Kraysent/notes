import pytest
import tempfile
from pathlib import Path
from fastapi.testclient import TestClient

from backend.database import run_migrations
from main import app, settings


@pytest.fixture
def temp_db() -> Path:
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = Path(f.name)
    
    run_migrations(db_path)
    yield db_path
    
    if db_path.exists():
        db_path.unlink()


@pytest.fixture
def client(temp_db: Path) -> TestClient:
    original_db_path = settings.database_path
    settings.database_path = temp_db
    
    test_client = TestClient(app)
    yield test_client
    
    settings.database_path = original_db_path


def test_create_note_and_get_note(client: TestClient) -> None:
    note_data = {
        "title": "Test Note",
        "content": "This is a test note"
    }
    
    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    created_note = create_response.json()
    assert created_note["title"] == "Test Note"
    assert created_note["content"] == "This is a test note"
    assert "id" in created_note
    
    get_response = client.get("/api/note", params={"title": "Test Note"})
    assert get_response.status_code == 200
    retrieved_note = get_response.json()
    assert retrieved_note["title"] == "Test Note"
    assert retrieved_note["content"] == "This is a test note"
    assert retrieved_note["id"] == created_note["id"]


def test_create_note_update_content_and_get_note(client: TestClient) -> None:
    note_data = {
        "title": "Update Test Note",
        "content": "Original content"
    }
    
    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    created_note = create_response.json()
    assert created_note["content"] == "Original content"
    
    update_data = {
        "title": "Update Test Note",
        "content": "Updated content"
    }
    
    update_response = client.put("/api/note", json=update_data)
    assert update_response.status_code == 200
    updated_note = update_response.json()
    assert updated_note["title"] == "Update Test Note"
    assert updated_note["content"] == "Updated content"
    assert updated_note["id"] == created_note["id"]
    
    get_response = client.get("/api/note", params={"title": "Update Test Note"})
    assert get_response.status_code == 200
    retrieved_note = get_response.json()
    assert retrieved_note["content"] == "Updated content"
    assert retrieved_note["id"] == created_note["id"]


def test_create_note_change_title_and_get_note(client: TestClient) -> None:
    note_data = {
        "title": "Old Title",
        "content": "Note content"
    }
    
    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    created_note = create_response.json()
    original_id = created_note["id"]
    
    title_update_data = {
        "old_title": "Old Title",
        "new_title": "New Title"
    }
    
    update_title_response = client.patch("/api/note/title", json=title_update_data)
    assert update_title_response.status_code == 200
    updated_note = update_title_response.json()
    assert updated_note["title"] == "New Title"
    assert updated_note["id"] == original_id
    
    get_old_title_response = client.get("/api/note", params={"title": "Old Title"})
    assert get_old_title_response.status_code == 404
    assert "No note found" in get_old_title_response.json()["detail"]
    
    get_new_title_response = client.get("/api/note", params={"title": "New Title"})
    assert get_new_title_response.status_code == 200
    retrieved_note = get_new_title_response.json()
    assert retrieved_note["title"] == "New Title"
    assert retrieved_note["id"] == original_id
    assert retrieved_note["content"] == "Note content"

