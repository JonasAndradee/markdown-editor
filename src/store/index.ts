import { create } from "zustand";
import { getFileContent, listFiles } from "../services/api";
import {
  getLocalEdit,
  saveLocalEdit as saveEdit,
  deleteLocalEdit,
  getLocalEdits as getLSEdits,
} from "../services/localStorageService";
import { MarkdownFile, SidebarItem, LocalEdit } from "../types";
import { parseSidebar } from "../utils/markdown";

interface MarkdownStore {
  currentFile: MarkdownFile | null;
  sidebarItems: SidebarItem[];
  isLoading: boolean;
  isEditing: boolean;
  editContent: string;
  localEdits: LocalEdit[];

  fetchSidebar: () => Promise<void>;
  fetchFile: (path: string) => Promise<void>;
  setEditMode: (isEditing: boolean) => void;
  updateEditContent: (content: string) => void;
  saveLocalEdit: () => void;
  discardChanges: () => void;
  fetchLocalEdits: () => void;
}

export const useMarkdownStore = create<MarkdownStore>((set, get) => ({
  currentFile: null,
  sidebarItems: [],
  isLoading: false,
  isEditing: false,
  editContent: "",
  localEdits: [],

  fetchSidebar: async () => {
    set({ isLoading: true });
    try {
      const sidebarContent = await getFileContent("/docs/_sidebar.md");

      const items = parseSidebar(sidebarContent);

      console.log("Sidebar items parsed:", items);

      set({ sidebarItems: items, isLoading: false });
    } catch (error) {
      console.error("Error fetching sidebar:", error);

      set({
        sidebarItems: [
          { type: "doc", label: "Home", id: "/homepage" },
          { type: "doc", label: "Getting Started", id: "/starting" },
          { type: "doc", label: "Adapters", id: "/adapters" },
          { type: "doc", label: "Providers", id: "/providers" },
        ],
        isLoading: false,
      });
    }
  },

  fetchFile: async (path: string) => {
    set({ isLoading: true });
    try {
      const normalizedPath = path.startsWith("/docs") ? path : `/docs/${path}`;

      const content = await getFileContent(normalizedPath);

      const localEdit = getLocalEdit(normalizedPath);

      const fileName = normalizedPath.split("/").pop() || "";

      const isModified = !!localEdit;

      const file: MarkdownFile = {
        path: normalizedPath,
        name: fileName,
        content: localEdit ? localEdit.content : content,
        lastModified: new Date().toISOString(),
        isModified,
      };

      console.log("Loaded file:", file.name); // Debug

      set({
        currentFile: file,
        isLoading: false,
        isEditing: false,
        editContent: file.content,
      });
    } catch (error) {
      console.error("Error fetching file:", error);
      set({ isLoading: false });
    }
  },

  setEditMode: (isEditing: boolean) => {
    const { currentFile } = get();
    if (currentFile) {
      set({
        isEditing,
        editContent: currentFile.content,
      });
    }
  },

  updateEditContent: (content: string) => {
    set({ editContent: content });
  },

  saveLocalEdit: () => {
    const { currentFile, editContent } = get();

    if (!currentFile) return;

    const existingEdit = getLocalEdit(currentFile.path);
    const originalContent = existingEdit
      ? existingEdit.originalContent
      : currentFile.content;

    const localEdit: LocalEdit = {
      path: currentFile.path,
      name: currentFile.name,
      content: editContent,
      originalContent,
      editedAt: new Date().toISOString(),
    };

    saveEdit(localEdit);

    set({
      currentFile: {
        ...currentFile,
        content: editContent,
        isModified: true,
      },
      isEditing: false,
    });

    get().fetchLocalEdits();
  },

  discardChanges: () => {
    const { currentFile } = get();

    if (!currentFile) return;

    set({
      isEditing: false,
      editContent: currentFile.content,
    });
  },

  fetchLocalEdits: () => {
    const edits = getLSEdits();
    set({ localEdits: edits });
  },
}));

function parseSidebarContent(content: string): SidebarItem[] {
  const lines = content.split("\n").filter((line) => line.trim());

  const items: SidebarItem[] = [];

  lines.forEach((line) => {
    const match = line.match(/\*\s+\[(.*?)\]\((.*?)\)/);

    if (match) {
      const [_, label, path] = match;

      items.push({
        type: "doc",
        label: label.trim(),
        id: path.trim(),
      });
    }
  });

  return items;
}
