import React from "react";
import { useMarkdownStore } from "../store";
import { useNotification } from "./NotificationSystem";

const MarkdownEditor: React.FC = () => {
  const {
    editContent,
    updateEditContent,
    saveLocalEdit,
    discardChanges,
    currentFile,
  } = useMarkdownStore();

  const { addNotification } = useNotification();

  const handleSave = () => {
    saveLocalEdit();
    addNotification("Document saved locally", "success");
  };

  const handleDiscard = () => {
    discardChanges();
    addNotification("Changes discarded", "info");
  };

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
      <textarea
        className="editor-textarea"
        value={editContent}
        onChange={(e) => updateEditContent(e.target.value)}
        rows={20}
      />
    </div>
  );
};

export default MarkdownEditor;
