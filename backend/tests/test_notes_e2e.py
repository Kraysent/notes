import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.database import run_migrations
from main import DB_NAME, Settings, get_app


@pytest.fixture
def temp_db() -> Path:
    temp_dir = Path(tempfile.mkdtemp())
    db_path = temp_dir / DB_NAME

    run_migrations(db_path)
    yield db_path

    if db_path.exists():
        db_path.unlink()
    if temp_dir.exists():
        temp_dir.rmdir()


@pytest.fixture
def client(temp_db: Path) -> TestClient:
    test_settings = Settings(path_prefix=temp_db.parent)
    app = get_app(test_settings)
    test_client = TestClient(app)
    yield test_client


def test_create_note_and_get_note(client: TestClient) -> None:
    note_data = {"title": "Test Note", "content": "This is a test note"}

    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    created_note = create_response.json()
    assert created_note["title"] == "Test Note"
    assert created_note["content"] == "This is a test note"

    get_response = client.get("/api/note", params={"title": "Test Note"})
    assert get_response.status_code == 200
    retrieved_note = get_response.json()
    assert retrieved_note["title"] == "Test Note"
    assert retrieved_note["content"] == "This is a test note"


def test_create_note_update_content_and_get_note(client: TestClient) -> None:
    note_data = {"title": "Update Test Note", "content": "Original content"}

    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    created_note = create_response.json()
    assert created_note["content"] == "Original content"

    update_data = {"title": "Update Test Note", "content": "Updated content"}

    update_response = client.put("/api/note", json=update_data)
    assert update_response.status_code == 200
    updated_note = update_response.json()
    assert updated_note["title"] == "Update Test Note"
    assert updated_note["content"] == "Updated content"

    get_response = client.get("/api/note", params={"title": "Update Test Note"})
    assert get_response.status_code == 200
    retrieved_note = get_response.json()
    assert retrieved_note["content"] == "Updated content"


def test_create_note_change_title_and_get_note(client: TestClient) -> None:
    note_data = {"title": "Old Title", "content": "Note content"}

    create_response = client.put("/api/note", json=note_data)
    assert create_response.status_code == 200
    create_response.json()

    title_update_data = {"old_title": "Old Title", "new_title": "New Title"}

    update_title_response = client.patch("/api/note/title", json=title_update_data)
    assert update_title_response.status_code == 200
    updated_note = update_title_response.json()
    assert updated_note["title"] == "New Title"

    get_old_title_response = client.get("/api/note", params={"title": "Old Title"})
    assert get_old_title_response.status_code == 404
    assert "No note found" in get_old_title_response.json()["detail"]

    get_new_title_response = client.get("/api/note", params={"title": "New Title"})
    assert get_new_title_response.status_code == 200
    retrieved_note = get_new_title_response.json()
    assert retrieved_note["title"] == "New Title"
    assert retrieved_note["content"] == "Note content"


def test_search_notes(client: TestClient) -> None:
    note1_data = {"title": "Python Tutorial", "content": "Learn Python programming"}
    note2_data = {"title": "JavaScript Guide", "content": "Learn JavaScript basics"}

    create_response1 = client.put("/api/note", json=note1_data)
    assert create_response1.status_code == 200

    create_response2 = client.put("/api/note", json=note2_data)
    assert create_response2.status_code == 200

    list_response = client.get("/api/notes", params={"page": 1, "page_size": 50})
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert len(list_data["notes"]) == 2
    assert list_data["total"] == 2

    titles = {note["title"] for note in list_data["notes"]}
    assert "Python Tutorial" in titles
    assert "JavaScript Guide" in titles

    search_response = client.get("/api/notes", params={"page": 1, "page_size": 50, "query": "Python"})
    assert search_response.status_code == 200
    search_data = search_response.json()
    assert len(search_data["notes"]) == 1
    assert search_data["total"] == 1
    assert search_data["notes"][0]["title"] == "Python Tutorial"

    empty_query_response = client.get("/api/notes", params={"page": 1, "page_size": 50, "query": ""})
    assert empty_query_response.status_code == 200
    empty_query_data = empty_query_response.json()
    assert len(empty_query_data["notes"]) == 2
    assert empty_query_data["total"] == 2
