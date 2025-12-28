import Editor from "@monaco-editor/react";

export interface RawEditorProps {
  note: string;
  onNoteChange: (note: string) => void;
}

function RawEditor(props: RawEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={props.note}
      onChange={(value) => props.onNoteChange(value || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        lineNumbers: "on",
        wordWrap: "on",
        padding: { top: 20, bottom: 20 },
        scrollBeyondLastLine: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "off",
        tabCompletion: "off",
        wordBasedSuggestions: "off",
        parameterHints: { enabled: false },
      }}
    />
  );
}

export default RawEditor;
