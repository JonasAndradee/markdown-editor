import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { LocalEdit } from "../types";

interface DiffViewerProps {
  localEdit: LocalEdit;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ localEdit }) => {
  return (
    <BrowserOnly>
      {() => {
        const { diffLines } = require("diff");

        const differences = diffLines(
          localEdit.originalContent,
          localEdit.content
        );

        return (
          <div className="diff-container">
            <div className="diff-columns">
              <div className="diff-column">
                <div className="diff-header">Original Document</div>
                <pre>
                  {differences.map((part, index) => {
                    if (!part.added) {
                      return (
                        <div
                          key={index}
                          className={
                            part.removed ? "diff-removed" : "diff-unchanged"
                          }
                        >
                          {part.value}
                        </div>
                      );
                    }
                    return null;
                  })}
                </pre>
              </div>

              <div className="diff-column">
                <div className="diff-header">Modified Document</div>
                <pre>
                  {differences.map((part, index) => {
                    if (!part.removed) {
                      return (
                        <div
                          key={index}
                          className={
                            part.added ? "diff-added" : "diff-unchanged"
                          }
                        >
                          {part.value}
                        </div>
                      );
                    }
                    return null;
                  })}
                </pre>
              </div>
            </div>
          </div>
        );
      }}
    </BrowserOnly>
  );
};

export default DiffViewer;
