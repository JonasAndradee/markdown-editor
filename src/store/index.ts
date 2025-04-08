import { create } from "zustand";
import { getFileContent, listFiles } from "../services/api";
import {
  getLocalEdit,
  saveLocalEdit as saveEdit,
  deleteLocalEdit,
  getLocalEdits as getLSEdits,
} from "../services/localStorageService";
import { MarkdownFile, SidebarItem, LocalEdit } from "../types";

interface MarkdownStore {
  // State
  currentFile: MarkdownFile | null;
  sidebarItems: SidebarItem[];
  isLoading: boolean;
  isEditing: boolean;
  editContent: string;
  localEdits: LocalEdit[];

  // Actions
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
      // First, get the _sidebar.md file to build navigation
      const sidebarContent = await getFileContent("/docs/_sidebar.md");

      // Parse the sidebar content to create navigation structure
      const sidebarItems = parseSidebarContent(sidebarContent);

      set({ sidebarItems, isLoading: false });
    } catch (error) {
      console.error("Error fetching sidebar:", error);
      set({ isLoading: false });
    }
  },

  fetchFile: async (path: string) => {
    set({ isLoading: true });
    try {
      // Get the raw content from the API
      const content = await getFileContent(path);

      // Check if we have local edits
      const localEdit = getLocalEdit(path);

      const fileName = path.split("/").pop() || "";

      // Determine if there are local modifications
      const isModified = !!localEdit;

      // Create the file object
      const file: MarkdownFile = {
        path,
        name: fileName,
        // If there's a local edit, use that content, otherwise use the original
        content: localEdit ? localEdit.content : content,
        lastModified: new Date().toISOString(),
        isModified,
      };

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

    // Create a local edit record
    const localEdit: LocalEdit = {
      path: currentFile.path,
      name: currentFile.name,
      content: editContent,
      originalContent,
      editedAt: new Date().toISOString(),
    };

    // Save to localStorage
    saveEdit(localEdit);

    // Update the current file with modified status
    set({
      currentFile: {
        ...currentFile,
        content: editContent,
        isModified: true,
      },
      isEditing: false,
    });

    // Refresh the list of local edits
    get().fetchLocalEdits();
  },

  discardChanges: () => {
    const { currentFile } = get();

    if (!currentFile) return;

    // Just exit edit mode without saving
    set({
      isEditing: false,
      editContent: currentFile.content,
    });
  },

  fetchLocalEdits: () => {
    // Get all local edits from localStorage
    const edits = getLSEdits();
    set({ localEdits: edits });
  },
}));

// Helper function to parse the sidebar content into a navigation structure
function parseSidebarContent(content: string): SidebarItem[] {
  const lines = content.split("\n").filter((line) => line.trim());

  const items: SidebarItem[] = [];

  lines.forEach((line) => {
    // Match markdown links: * [Link Text](/path)
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
