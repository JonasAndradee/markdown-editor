import { LocalEdit } from "../types";

const LOCAL_EDITS_KEY = "local_markdown_edits";

export const saveLocalEdit = (edit: LocalEdit): void => {
  const edits = getLocalEdits();

  // Find if this file already has a local edit
  const existingEditIndex = edits.findIndex((e) => e.path === edit.path);

  if (existingEditIndex >= 0) {
    // Update existing edit
    edits[existingEditIndex] = edit;
  } else {
    // Add new edit
    edits.push(edit);
  }

  localStorage.setItem(LOCAL_EDITS_KEY, JSON.stringify(edits));
};

export const getLocalEdits = (): LocalEdit[] => {
  const editsJson = localStorage.getItem(LOCAL_EDITS_KEY);
  return editsJson ? JSON.parse(editsJson) : [];
};

export const getLocalEdit = (path: string): LocalEdit | null => {
  const edits = getLocalEdits();
  const edit = edits.find((e) => e.path === path);
  return edit || null;
};

export const deleteLocalEdit = (path: string): void => {
  const edits = getLocalEdits();
  const filteredEdits = edits.filter((e) => e.path !== path);
  localStorage.setItem(LOCAL_EDITS_KEY, JSON.stringify(filteredEdits));
};

export const clearAllLocalEdits = (): void => {
  localStorage.removeItem(LOCAL_EDITS_KEY);
};
