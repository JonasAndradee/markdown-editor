import React, { useState } from "react";
import { LocalEdit } from "../types";
import { useHistory } from "@docusaurus/router";
import DiffViewer from "./DiffViewer";
import { formatDate, simplifyPath } from "../utils/markdown";

interface EditedFilesListProps {
  edits: LocalEdit[];
  onViewFile: (path: string) => void;
}

const EditedFilesList: React.FC<EditedFilesListProps> = ({
  edits,
  onViewFile,
}) => {
  const [expandedEditId, setExpandedEditId] = useState<string | null>(null);
  const history = useHistory();

  const toggleExpand = (editId: string) => {
    if (expandedEditId === editId) {
      setExpandedEditId(null);
    } else {
      setExpandedEditId(editId);
    }
  };

  if (edits.length === 0) {
    return (
      <div className="empty-edits">
        <p>No locally edited files found.</p>
        <button
          className="button button--primary"
          onClick={() => history.push("/")}
        >
          Go to Documentation
        </button>
      </div>
    );
  }

  return (
    <div className="edited-files-list">
      <h2>Locally Modified Files</h2>
      <p className="list-description">
        The following files have been modified locally. Click on a file to view
        the changes.
      </p>

      <div className="files-grid">
        {edits.map((edit, index) => (
          <div key={index} className="file-card">
            <div className="file-card-header">
              <h3>{simplifyPath(edit.path)}</h3>
              <span className="file-card-date">
                Edited {formatDate(edit.editedAt)}
              </span>
            </div>

            <div className="file-card-actions">
              <button
                className="button button--primary"
                onClick={() => onViewFile(edit.path)}
              >
                View Document
              </button>
              <button
                className="button button--secondary"
                onClick={() => toggleExpand(`edit-${index}`)}
              >
                {expandedEditId === `edit-${index}`
                  ? "Hide Changes"
                  : "Show Changes"}
              </button>
            </div>

            {expandedEditId === `edit-${index}` && (
              <div className="file-card-diff">
                <DiffViewer localEdit={edit} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditedFilesList;
