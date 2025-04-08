import React from "react";
import { useMarkdownStore } from "../store";
import BrowserOnly from "@docusaurus/BrowserOnly";

const MarkdownEditor: React.FC = () => {
  const {
    editContent,
    updateEditContent,
    saveLocalEdit,
    discardChanges,
    currentFile,
  } = useMarkdownStore();

  const handleSave = () => {
    saveLocalEdit();
  };

  const handleDiscard = () => {
    discardChanges();
  };

  // We use BrowserOnly to ensure this component only renders in the browser
  return (
    <BrowserOnly>
      {() => {
        // We'll use Monaco Editor for a rich editing experience
        const MonacoEditor = require("@monaco-editor/react").default;

        return (
          <div className="editor-container">
            <div className="editor-header">
              <h2>Editing: {currentFile?.name}</h2>
              <div className="editor-actions">
                <button className="save-button" onClick={handleSave}>
                  Save Locally
                </button>
                <button className="discard-button" onClick={handleDiscard}>
                  Discard Changes
                </button>
              </div>
            </div>
            <MonacoEditor
              height="70vh"
              language="markdown"
              theme="vs-dark"
              value={editContent}
              onChange={updateEditContent}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        );
      }}
    </BrowserOnly>
  );
};

export default MarkdownEditor;
