import { SidebarItem } from "../types";

// Função para extrair título do documento markdown
export const extractTitle = (markdown: string): string => {
  const titleMatch = markdown.match(/^#\s+(.*)$/m);
  return titleMatch ? titleMatch[1].trim() : "Untitled Document";
};

// Função para parsear o arquivo _sidebar.md e gerar a estrutura de navegação
export const parseSidebar = (content: string): SidebarItem[] => {
  const lines = content.split("\n").filter((line) => line.trim());
  const items: SidebarItem[] = [];
  let currentCategory: SidebarItem | null = null;

  for (const line of lines) {
    // Verifica se é um item de categoria (com subtópicos)
    const categoryMatch = line.match(/^#+\s+(.*)$/);
    if (categoryMatch) {
      currentCategory = {
        type: "category",
        label: categoryMatch[1].trim(),
        items: [],
      };
      items.push(currentCategory);
      continue;
    }

    // Verifica se é um link de documento
    const linkMatch = line.match(/\*\s+\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [_, label, path] = linkMatch;
      const linkItem = {
        type: "doc",
        label: label.trim(),
        id: path.trim(),
      };

      if (currentCategory && currentCategory.items) {
        currentCategory.items.push(linkItem);
      } else {
        items.push(linkItem);
      }
    }
  }

  return items;
};

// Funções para verificar se um arquivo foi modificado localmente
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

// Função para formatar datas de forma legível
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

// Função para simplificar caminhos de arquivo
export const simplifyPath = (path: string): string => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};
