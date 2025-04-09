import axios from "axios";
import { BitbucketFile } from "../types";

const WORKSPACE = "allintra";
const REPO_SLUG = "teste-front-end";
const BRANCH = "main";
const BASE_PATH = "/docs";
const BASE_URL = `https://api.bitbucket.org/2.0/repositories/${WORKSPACE}/${REPO_SLUG}`;

const mockToken = "mock_token";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Intercepted API request:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const listFiles = async (
  path: string = BASE_PATH
): Promise<BitbucketFile[]> => {
  try {
    const response = await api.get(`/src/${BRANCH}${path}`);
    return response.data.values;
  } catch (error) {
    console.error("Error listing files:", error);
    return mockListFiles(path);
  }
};

export const getFileContent = async (path: string): Promise<string> => {
  try {
    const response = await api.get(`/src/${BRANCH}${path}`, {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting file content:", error);
    return mockGetFileContent(path);
  }
};

function mockListFiles(path: string): BitbucketFile[] {
  if (path === "/docs") {
    return [
      {
        path: "/docs/homepage.md",
        type: "file",
        links: { self: { href: "/docs/homepage.md" } },
      },
      {
        path: "/docs/_sidebar.md",
        type: "file",
        links: { self: { href: "/docs/_sidebar.md" } },
      },
      {
        path: "/docs/adapters.md",
        type: "file",
        links: { self: { href: "/docs/adapters.md" } },
      },
      {
        path: "/docs/providers.md",
        type: "file",
        links: { self: { href: "/docs/providers.md" } },
      },
      {
        path: "/docs/starting.md",
        type: "file",
        links: { self: { href: "/docs/starting.md" } },
      },
    ];
  }
  return [];
}

function mockGetFileContent(path: string): string {
  const fileMap: Record<string, string> = {
    "/docs/homepage.md": "# Homepage\n\nWelcome to the documentation!",
    "/docs/_sidebar.md": `
      * [Home](/homepage)
      * [Getting Started](/starting)
      * [Adapters](/adapters)
      * [Providers](/providers)
    `,
    "/docs/adapters.md": "# Adapters\n\nInformation about adapters.",
    "/docs/providers.md": "# Providers\n\nInformation about providers.",
    "/docs/starting.md":
      "# Getting Started\n\nHow to get started with the application.",
  };

  return fileMap[path] || "# File Not Found";
}

export default api;
