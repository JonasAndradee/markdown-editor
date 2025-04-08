import { useState, useCallback } from "react";
import { getFileContent, listFiles } from "../services/api";
import { BitbucketFile } from "../types";

export const useBitbucketAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFileContent = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const content = await getFileContent(path);
      setIsLoading(false);
      return content;
    } catch (err) {
      console.error("Error fetching file content:", err);
      setError("Failed to fetch file content");
      setIsLoading(false);
      return null;
    }
  }, []);

  const fetchDirectoryFiles = useCallback(
    async (path: string = "/docs"): Promise<BitbucketFile[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const files = await listFiles(path);
        setIsLoading(false);
        return files;
      } catch (err) {
        console.error("Error fetching directory files:", err);
        setError("Failed to fetch directory files");
        setIsLoading(false);
        return [];
      }
    },
    []
  );

  return {
    fetchFileContent,
    fetchDirectoryFiles,
    isLoading,
    error,
  };
};
