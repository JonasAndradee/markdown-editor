import React from "react";
import { useMarkdownStore } from "../store";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useMarkdownFile } from "../hooks";
import { formatDate } from "../utils/markdown";

const MarkdownViewer: React.FC = () => {
  const { isEditing, setEditMode } = useMarkdownStore();

  const { file, isLoading, error } = useMarkdownFile();

  if (isLoading) {
    return <div className="loading">Loading document...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!file) {
    return (
      <div className="empty-state">
        Select a document from the sidebar to view it.
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="markdown-container">
        <div className="markdown-header">
          <h1>{file.name}</h1>
          <div className="markdown-meta">
            {file.isModified && (
              <span className="modified-indicator">Modified locally</span>
            )}
            <span className="date-indicator">
              Last updated: {formatDate(file.lastModified)}
            </span>
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit
            </button>
          </div>
        </div>
        <div className="markdown-content">
          <BrowserOnly>
            {() => {
              const { MDXContent } = require("@theme/MDXContent");
              return (
                <MDXContent>
                  <div dangerouslySetInnerHTML={{ __html: file.content }} />
                </MDXContent>
              );
            }}
          </BrowserOnly>
        </div>
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
