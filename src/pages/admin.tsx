import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import { useMarkdownStore } from "@site/src/store";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { formatDistance } from "date-fns";

export default function Admin() {
  const { localEdits, fetchLocalEdits, fetchFile } = useMarkdownStore();

  useEffect(() => {
    fetchLocalEdits();
  }, [fetchLocalEdits]);

  const handleViewFile = (path: string) => {
    fetchFile(path);
    window.location.href = "/";
  };

  const renderDiffViewer = (
    originalContent: string,
    modifiedContent: string
  ) => {
    return (
      <BrowserOnly>
        {() => {
          const { createTwoFilesPatch } = require("diff");
          const patch = createTwoFilesPatch(
            "Original",
            "Modified",
            originalContent,
            modifiedContent
          );

          return (
            <pre className="diff-view">
              {patch.split("\n").map((line: string, i: number) => {
                let className = "";
                if (line.startsWith("+")) className = "diff-added";
                if (line.startsWith("-")) className = "diff-removed";

                return (
                  <div key={i} className={className}>
                    {line}
                  </div>
                );
              })}
            </pre>
          );
        }}
      </BrowserOnly>
    );
  };

  return (
    <Layout title="Admin" description="Administration area">
      <div className="container margin-vert--lg">
        <h1>Administration</h1>

        {localEdits.length === 0 ? (
          <div className="empty-state">No locally edited files found.</div>
        ) : (
          <>
            <h2>Locally Modified Files</h2>
            <div className="card-container">
              {localEdits.map((edit, index) => (
                <div key={index} className="card margin-bottom--md">
                  <div className="card__header">
                    <h3>{edit.name}</h3>
                    <p className="text--small text--italic">
                      Edited{" "}
                      {formatDistance(new Date(edit.editedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="card__body">
                    <button
                      className="button button--primary margin-right--sm"
                      onClick={() => handleViewFile(edit.path)}
                    >
                      View Document
                    </button>
                    <button
                      className="button button--secondary"
                      onClick={() =>
                        document
                          .getElementById(`diff-${index}`)
                          ?.classList.toggle("hidden")
                      }
                    >
                      Show/Hide Changes
                    </button>

                    <div id={`diff-${index}`} className="margin-top--md hidden">
                      {renderDiffViewer(edit.originalContent, edit.content)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
