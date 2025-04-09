import React from "react";
import { useMarkdownStore } from "../store";
import { useMarkdownFile } from "../hooks";

import ReactMarkdown from "react-markdown";

const MarkdownViewer: React.FC = () => {
  const { isEditing, setEditMode } = useMarkdownStore();
  const { file, isLoading, error } = useMarkdownFile();

  const [MarkdownEditor, setMarkdownEditor] =
    React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    if (isEditing) {
      import("./MarkdownEditor").then((module) => {
        setMarkdownEditor(() => module.default);
      });
    }
  }, [isEditing]);

  if (isLoading) {
    return <div className="loading">Carregando documento...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!file) {
    return (
      <div className="empty-state">
        Selecione um documento na barra lateral para visualizá-lo.
      </div>
    );
  }

  if (isEditing) {
    return MarkdownEditor ? (
      <MarkdownEditor />
    ) : (
      <div>Carregando editor...</div>
    );
  }

  return (
    <div className="markdown-container">
      <div className="document-header">
        <div className="document-title-row">
          <h1 className="document-title">{file.name}</h1>

          <div className="document-actions">
            <div className="document-meta">
              {file.isModified && (
                <span className="modified-indicator">
                  Modificado localmente
                </span>
              )}
            </div>

            <button className="edit-button" onClick={() => setEditMode(true)}>
              Editar Documento
            </button>
          </div>
        </div>
      </div>

      <div className="markdown-content">
        <ReactMarkdown>{file.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;
