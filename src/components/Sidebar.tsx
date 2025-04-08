import React, { useEffect } from "react";
import { useMarkdownStore } from "../store";
import { SidebarItem } from "../types";
import { useHistory, useLocation } from "@docusaurus/router";
import { useBitbucketAPI } from "../hooks";
import { parseSidebar } from "../utils/markdown";

const Sidebar: React.FC = () => {
  const { sidebarItems, fetchFile } = useMarkdownStore();
  const { fetchFileContent, isLoading } = useBitbucketAPI();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const loadSidebar = async () => {
      try {
        const sidebarContent = await fetchFileContent("/docs/_sidebar.md");
        if (sidebarContent) {
          const items = parseSidebar(sidebarContent);
          // Atualizar a store com os itens do sidebar
          // Na implementação atual, isso não é feito diretamente aqui
          // porque fetchSidebar já cuida disso
        }
      } catch (error) {
        console.error("Error loading sidebar:", error);
      }
    };

    loadSidebar();
  }, [fetchFileContent]);

  const handleNavigation = (item: SidebarItem) => {
    if (item.type === "doc" && item.id) {
      // Remove leading slash if present
      const path = item.id.startsWith("/") ? item.id : `/${item.id}`;

      // Fetch the file content
      fetchFile(`/docs${path}.md`);

      // Navigate to the page
      history.push(path);
    }
  };

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items.map((item, index) => {
      if (item.type === "category" && item.items) {
        return (
          <li key={index} className="sidebar-category">
            <div className="sidebar-category-label">{item.label}</div>
            <ul className="sidebar-items nested">
              {renderSidebarItems(item.items)}
            </ul>
          </li>
        );
      }

      return (
        <li
          key={index}
          className={`sidebar-item ${
            location.pathname === item.id ? "active" : ""
          }`}
          onClick={() => handleNavigation(item)}
        >
          {item.label}
          {item.id && hasLocalModificationsForPath(`/docs${item.id}.md`) && (
            <span className="modified-badge" title="Modified locally">
              *
            </span>
          )}
        </li>
      );
    });
  };

  // Função auxiliar para verificar se há modificações locais
  const hasLocalModificationsForPath = (path: string) => {
    const localEdits = useMarkdownStore.getState().localEdits;
    return localEdits.some((edit) => edit.path === path);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3>Documentation</h3>
      </div>
      <nav className="sidebar-nav">
        {isLoading ? (
          <div className="sidebar-loading">Loading navigation...</div>
        ) : (
          <ul className="sidebar-items">{renderSidebarItems(sidebarItems)}</ul>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
