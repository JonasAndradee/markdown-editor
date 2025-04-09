import { useEffect, useState } from "react";
import { useMarkdownStore } from "../store";
import { useLocation } from "@docusaurus/router";

export const useMarkdownFile = () => {
  const location = useLocation();
  const { fetchFile, currentFile, isLoading } = useMarkdownStore();
  const [error, setError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    if (!hasInitialLoad) {
      const loadInitialFile = async () => {
        try {
          await fetchFile("/docs/homepage.md");
          setError(null);
          setHasInitialLoad(true);
        } catch (err) {
          console.error("Error loading initial markdown file:", err);
          setError("Failed to load initial document");
          setHasInitialLoad(true);
        }
      };

      loadInitialFile();
    }
  }, [fetchFile, hasInitialLoad]);

  return {
    file: currentFile,
    isLoading,
    error,
  };
};
