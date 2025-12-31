import { useState, useEffect } from "react";
import { MdOutlineAutorenew, MdCheck, MdClear } from "react-icons/md";
import { ViewMode, SaveStatus } from "../types";
import {
  client,
} from "../api";
import RawEditor from "./editor/RawEditor";
import MarkdownView from "./editor/MarkdownView";
import { saveNoteEndpointApiNoteCodePut } from "../client";

export interface NoteEditorProps {
  note: string;
  setNote: (note: string) => void;
  viewMode: ViewMode;
  code: string;
  title: string;
}

function NoteEditor(props: NoteEditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Saved);

  function setNoteWithLog(note: string) {
    console.log("setNote called with note:", note);
    props.setNote(note);
  }

  useEffect(() => {
    if (
      !props.code ||
      !props.code.trim() ||
      !props.title ||
      !props.title.trim()
    ) {
      setSaveStatus(SaveStatus.Unsaved);
      return;
    }

    setSaveStatus(SaveStatus.Saving);
    saveNoteEndpointApiNoteCodePut({
      client,
      path: { code: props.code },
      body: {
        title: props.title,
        content: props.note,
      },
    })
      .then((response) => {
        if (response.error || !response.data) {
          throw new Error("Failed to save note");
        }
        setSaveStatus(SaveStatus.Saved);
      })
      .catch((error) => {
        console.error("Failed to save note:", error);
        setSaveStatus(SaveStatus.Unsaved);
      });
  }, [props.note, props.code, props.title]);

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
