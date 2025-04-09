import { SidebarItem } from "../types";

export const extractTitle = (markdown: string): string => {
  const titleMatch = markdown.match(/^#\s+(.*)$/m);
  return titleMatch ? titleMatch[1].trim() : "Untitled Document";
};

export const parseSidebar = (content: string): SidebarItem[] => {
  const lines = content.split("\n").filter((line) => line.trim());
  const items: SidebarItem[] = [];
  let currentCategory: SidebarItem | null = null;

  for (const line of lines) {
    const categoryMatch = line.match(/^-\s+(.+)$/);
    if (categoryMatch) {
      currentCategory = {
        type: "category",
        label: categoryMatch[1].trim(),
        items: [],
      };
      items.push(currentCategory);
      continue;
    }

    const linkMatch = line.match(/^\s+-\s+\[(.*?)\]\((.*?)\)$/);
    if (linkMatch && currentCategory && currentCategory.items) {
      const [_, label, path] = linkMatch;

      const cleanPath = path.trim().endsWith(".md")
        ? path.trim().slice(0, -3)
        : path.trim();

      currentCategory.items.push({
        type: "doc",
        label: label.trim(),
        id: `/${cleanPath}`,
      });
    }
  }

  return items;
};

export const hasLocalModifications = (path: string): boolean => {
  try {
    const localEditsJson = localStorage.getItem("local_markdown_edits");
    if (!localEditsJson) return false;

    const localEdits = JSON.parse(localEditsJson);
    return localEdits.some((edit) => edit.path === path);
  } catch (error) {
    console.error("Error checking local modifications:", error);
    return false;
  }
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const simplifyPath = (path: string): string => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};
