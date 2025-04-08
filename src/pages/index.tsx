import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Sidebar from "@site/src/components/Sidebar";
import MarkdownViewer from "@site/src/components/MarkdownViewer";
import { useMarkdownStore } from "@site/src/store";

export default function Home() {
  const { fetchFile } = useMarkdownStore();

  useEffect(() => {
    // Load the homepage document when the application starts
    fetchFile("/docs/homepage.md");
  }, [fetchFile]);

  return (
    <Layout
      title="Documentation Viewer"
      description="View and edit markdown documentation"
    >
      <div className="container">
        <div className="row">
          <div className="col col--3">
            <Sidebar />
          </div>
          <div className="col col--9">
            <MarkdownViewer />
          </div>
        </div>
      </div>
    </Layout>
  );
}
