import React from "react";
import { useMarkdownStore } from "../store";
import BrowserOnly from "@docusaurus/BrowserOnly";

const MarkdownViewer: React.FC = () => {
  const { currentFile, isLoading, isEditing, setEditMode } = useMarkdownStore();

  if (isLoading) {
    return <div className="loading">Loading document...</div>;
  }

  if (!currentFile) {
    return (
      <div className="empty-state">
        Select a document from the sidebar to view it.
      </div>
    );
  }

  const renderContent = () => {
    // Docusaurus has built-in markdown rendering that we'll use
    // This is handled automatically when we pass markdown to the content
    return (
      <div className="markdown-container">
        <div className="markdown-header">
          <h1>{currentFile.name}</h1>
          {currentFile.isModified && (
            <span className="modified-indicator">Modified locally</span>
          )}
          <button className="edit-button" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: currentFile.content }}
        />
      </div>
    );
  };

  return (
    <div className={`markdown-viewer ${isEditing ? "edit-mode" : ""}`}>
      {isEditing ? (
        <BrowserOnly>
          {() => {
            const MarkdownEditor = require("./MarkdownEditor").default;
            return <MarkdownEditor />;
          }}
        </BrowserOnly>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default MarkdownViewer;
