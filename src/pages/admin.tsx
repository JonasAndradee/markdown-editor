import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import { useMarkdownStore } from "@site/src/store";
import { useHistory } from "@docusaurus/router";
import EditedFilesList from "@site/src/components/EditedFilesList";

export default function Admin() {
  const { localEdits, fetchLocalEdits, fetchFile } = useMarkdownStore();
  const history = useHistory();

  useEffect(() => {
    fetchLocalEdits();
  }, [fetchLocalEdits]);

  const handleViewFile = (path: string) => {
    fetchFile(path);
    // Extrair o caminho para navegação
    const routePath = path.replace("/docs", "").replace(".md", "");
    history.push(routePath);
  };

  return (
    <Layout
      title="Admin Area"
      description="View and manage locally edited markdown files"
    >
      <div className="container margin-vert--lg">
        <div className="admin-header">
          <h1>Administration</h1>
          <p>
            This area shows all markdown files that have been edited locally.
            You can view the differences between the original and modified
            versions.
          </p>
        </div>

        <EditedFilesList edits={localEdits} onViewFile={handleViewFile} />
      </div>
    </Layout>
  );
}
