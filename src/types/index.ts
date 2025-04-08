export interface MarkdownFile {
  path: string;
  name: string;
  content: string;
  lastModified: string;
  isModified: boolean;
}

export interface LocalEdit {
  path: string;
  name: string;
  content: string;
  originalContent: string;
  editedAt: string;
}

export interface SidebarItem {
  type: "category" | "doc";
  label: string;
  items?: SidebarItem[];
  id?: string;
}

export interface BitbucketResponse {
  values: BitbucketFile[];
  next?: string;
}

export interface BitbucketFile {
  path: string;
  type: string;
  links: {
    self: {
      href: string;
    };
  };
}
