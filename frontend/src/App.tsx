import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import NoteEditor from "./components/NoteEditor";
import NotesSidebar, { type NotesSidebarRef } from "./components/NotesSidebar";
import { ViewMode } from "./types";
import { client } from "./api";
import { getKeybinding, matchesKeybinding } from "./keybindings";
import { generateSlug } from "./utils";
import settings from "./settings.json";
import {
  downloadNoteEndpointApiNoteCodeDownloadGet,
  getNoteEndpointApiNoteCodeGet,
  saveNoteEndpointApiNoteCodePut,
  updateTitleEndpointApiNoteTitlePatch,
} from "./client";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Raw);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null
      ? saved === "true"
      : settings.collapseSidebarByDefault;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<NotesSidebarRef>(null);

  function switchNote(code: string, title: string, content: string) {
    setCode(code);
    setTitle(title);
    setNote(content);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("query");

    if (queryParam) {
      setSearchQuery(queryParam);
    }

    const pathname = window.location.pathname;
    const noteMatch = pathname.match(/^\/note\/(.+)$/);
    if (noteMatch) {
      const noteCode = decodeURIComponent(noteMatch[1]);
      getNoteEndpointApiNoteCodeGet({ client, path: { code: noteCode } })
        .then((response) => {
          if (response.error || !response.data) {
            throw new Error("Failed to get note");
          }
          switchNote(
            response.data.code,
            response.data.title,
            response.data.content,
          );
        })
        .catch((error) => {
          console.error("Failed to load note:", error);
        });
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (code && code.trim()) {
      url.pathname = `/note/${encodeURIComponent(code)}`;
    } else {
      url.pathname = "/";
    }
    window.history.replaceState({}, "", url.toString());
  }, [code]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (searchQuery && searchQuery.trim()) {
      url.searchParams.set("query", searchQuery.trim());
    } else {
      url.searchParams.delete("query");
    }
    window.history.replaceState({}, "", url.toString());
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      const viewToggleBinding = getKeybinding("view.toggle");
      if (viewToggleBinding && matchesKeybinding(e, viewToggleBinding)) {
        e.preventDefault();
        setViewMode((prevMode) =>
          prevMode === ViewMode.Raw ? ViewMode.Markdown : ViewMode.Raw,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleTitleSubmit(submittedTitle: string) {
    if (!submittedTitle.trim()) {
      return;
    }

    const newCode = generateSlug(submittedTitle);

    if (code && code.trim()) {
      updateTitleEndpointApiNoteTitlePatch({
        client,
        body: {
          old_code: code,
          new_code: newCode,
          new_title: submittedTitle,
        },
      })
        .then((response) => {
          if (response.error || !response.data) {
            throw new Error("Failed to update title");
          }
        })
        .catch((error) => {
          console.error("Failed to update title:", error);
        });
    } else {
      saveNoteEndpointApiNoteCodePut({
        client,
        path: { code: newCode },
        body: {
          title: submittedTitle,
          content: note,
        },
      })
        .then((response) => {
          if (response.error || !response.data) {
            throw new Error("Failed to save note");
          }
        })
        .catch((error) => {
          console.error("Failed to save note:", error);
        });
    }
    setCode(newCode);
    setTitle(submittedTitle);
    sidebarRef.current?.refresh();
  }

  function handleNoteClick(noteCode: string) {
    getNoteEndpointApiNoteCodeGet({ client, path: { code: noteCode } })
      .then((response) => {
        if (response.error || !response.data) {
          throw new Error("Failed to get note");
        }
        switchNote(
          response.data.code,
          response.data.title,
          response.data.content,
        );
      })
      .catch((error) => {
        console.error("Failed to load note:", error);
      });
  }

  function handleNewNote() {
    switchNote("", "", "");
  }

  function handleDownloadNote() {
    if (code && code.trim()) {
      downloadNoteEndpointApiNoteCodeDownloadGet({ client, path: { code } })
        .then((response) => {
          if (response.error || !response.response) {
            throw new Error("Failed to download note");
          }
          return response.response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${code}.md`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch((error) => {
          console.error("Failed to download note:", error);
        });
    }
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header
        title={title}
        onTitleSubmit={handleTitleSubmit}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewNote={handleNewNote}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onDownloadNote={handleDownloadNote}
      />
      <div className="flex-1 flex overflow-hidden">
        <NoteEditor
          note={note}
          setNote={setNote}
          viewMode={viewMode}
          code={code}
          title={title}
        />
        {!isSidebarCollapsed && (
          <NotesSidebar
            ref={sidebarRef}
            onNoteClick={handleNoteClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>
    </div>
  );
}

export default App;
