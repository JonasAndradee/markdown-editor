import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Sidebar from "@site/src/components/Sidebar";
import MarkdownViewer from "@site/src/components/MarkdownViewer";
import { useLocation } from "@docusaurus/router";
import { useMarkdownStore } from "@site/src/store";

export default function Home() {
  const location = useLocation();
  const { fetchFile } = useMarkdownStore();

  const currentDoc = new URLSearchParams(location.search).get("doc");
  const documentTitle = currentDoc || "Homepage";

  useEffect(() => {
    const loadDocument = async () => {
      if (currentDoc) {
        const docPath = currentDoc.endsWith(".md")
          ? currentDoc
          : `${currentDoc}.md`;
        await fetchFile(docPath);
      } else {
        await fetchFile("homepage.md");
      }
    };

    loadDocument();
  }, [currentDoc, fetchFile]);

  return (
    <Layout
      title={`${documentTitle} - Documentation Viewer`}
      description="View and edit markdown documentation"
    >
      <div className="container main-container">
        <div className="row main-row">
          <div className="col col--3 sidebar-column">
            <Sidebar />
          </div>
          <div className="col col--9 content-column">
            <MarkdownViewer />
          </div>
        </div>
      </div>
    </Layout>
  );
}
