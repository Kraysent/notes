import { useState, useEffect } from "react";
import { MdOutlineAutorenew, MdCheck, MdClear } from "react-icons/md";
import { ViewMode, SaveStatus } from "../types";
import { saveNote } from "../api";
import RawEditor from "./editor/RawEditor";
import MarkdownView from "./editor/MarkdownView";

export interface NoteEditorProps {
  note: string;
  setNote: (note: string) => void;
  viewMode: ViewMode;
  title: string;
}

function NoteEditor(props: NoteEditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved);

  function setNoteWithLog(note: string) {
    console.log("setNote called with note:", note);
    props.setNote(note);
  }

  useEffect(() => {
    if (!props.title || !props.title.trim()) {
      setSaveStatus(SaveStatus.Unsaved);
      return;
    }

    setSaveStatus(SaveStatus.Saving);
    saveNote(props.title, props.note)
      .then(() => {
        setSaveStatus(SaveStatus.Saved);
      })
      .catch((error) => {
        console.error("Failed to save note:", error);
        setSaveStatus(SaveStatus.Unsaved);
      });
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
        <RawEditor note={props.note} setNote={setNoteWithLog} />
      ) : (
        <MarkdownView note={props.note} setNote={setNoteWithLog} />
      )}
    </div>
  );
}

export default NoteEditor;
