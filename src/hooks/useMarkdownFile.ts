import { useEffect, useState } from "react";
import { useMarkdownStore } from "../store";
import { useLocation } from "@docusaurus/router";

export const useMarkdownFile = () => {
  const location = useLocation();
  const { fetchFile, currentFile, isLoading } = useMarkdownStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdownFromPath = async () => {
      try {
        // Remove o primeiro caractere '/' e acrescenta '.md' se necessário
        let path = location.pathname;
        if (path === "/") {
          path = "/homepage";
        }

        path = path.startsWith("/") ? path : `/${path}`;

        if (!path.endsWith(".md")) {
          path = `${path}.md`;
        }

        await fetchFile(`/docs${path}`);
        setError(null);
      } catch (err) {
        console.error("Error loading markdown file:", err);
        setError("Failed to load document");
      }
    };

    loadMarkdownFromPath();
  }, [location.pathname, fetchFile]);

  return {
    file: currentFile,
    isLoading,
    error,
  };
};
