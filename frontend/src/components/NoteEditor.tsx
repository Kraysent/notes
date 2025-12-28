import { useState, useEffect, useRef } from "react";
import { MdOutlineAutorenew, MdCheck, MdClear } from "react-icons/md";
import { ViewMode, SaveStatus } from "../types";
import { saveNote } from "../api";
import settings from "../settings.json";
import RawEditor from "./editor/RawEditor";
import MarkdownView from "./editor/MarkdownView";

export interface NoteEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
  viewMode: ViewMode;
  title: string;
}

function NoteEditor(props: NoteEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>(props.note);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved);

  useEffect(() => {
    if (!props.title || !props.title.trim()) {
      setSaveStatus(SaveStatus.Unsaved);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (lastSavedContentRef.current === props.note) {
      setSaveStatus(SaveStatus.Saved);
      return;
    }

    setSaveStatus(SaveStatus.Unsaved);

    saveTimeoutRef.current = setTimeout(() => {
      if (lastSavedContentRef.current !== props.note) {
        setSaveStatus(SaveStatus.Saving);
        saveNote(props.title, props.note)
          .then(() => {
            lastSavedContentRef.current = props.note;
            setSaveStatus(SaveStatus.Saved);
          })
          .catch((error) => {
            console.error("Failed to autosave note:", error);
            setSaveStatus(SaveStatus.Unsaved);
          });
      }
    }, settings.autosaveFrequencyMs);

    return () => {
      const timeoutId = saveTimeoutRef.current;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [props.note, props.title]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (
        props.title &&
        props.title.trim() &&
        lastSavedContentRef.current !== props.note
      ) {
        saveNote(props.title, props.note).catch((error) => {
          console.error("Failed to save note on page unload:", error);
        });
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (
        props.title &&
        props.title.trim() &&
        lastSavedContentRef.current !== props.note
      ) {
        saveNote(props.title, props.note).catch((error) => {
          console.error("Failed to save note on unmount:", error);
        });
      }
    };
  }, [props.note, props.title]);

  function getStatusIcon() {
    switch (saveStatus) {
      case SaveStatus.Saved:
        return <MdCheck />;
      case SaveStatus.Saving:
        return <MdOutlineAutorenew />;
      case SaveStatus.Unsaved:
        return <MdClear />;
      default:
        return <MdClear />;
    }
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">{getStatusIcon()}</div>
      {props.viewMode === ViewMode.Raw ? (
        <RawEditor note={props.note} onNoteChange={props.onNoteChange} />
      ) : (
        <MarkdownView note={props.note} />
      )}
    </div>
  );
}

export default NoteEditor;
