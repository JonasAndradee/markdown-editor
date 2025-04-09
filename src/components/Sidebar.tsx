import React, { useEffect, useState, useCallback } from "react";
import { useMarkdownStore } from "../store";
import { SidebarItem } from "../types";
import { useHistory, useLocation } from "@docusaurus/router";

const Sidebar: React.FC = () => {
  const { sidebarItems, fetchSidebar, fetchFile } = useMarkdownStore();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!sidebarLoaded) {
      const loadSidebar = async () => {
        setIsLoading(true);
        try {
          await fetchSidebar();

          const initialExpanded: Record<string, boolean> = {};
          sidebarItems.forEach((item, index) => {
            if (item.type === "category") {
              initialExpanded[`category-${index}`] = true;
            }
          });
          setExpandedCategories(initialExpanded);

          setSidebarLoaded(true);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading sidebar:", error);
          setIsLoading(false);
          setSidebarLoaded(true);
        }
      };

      loadSidebar();
    }
  }, [fetchSidebar, sidebarItems, sidebarLoaded]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  const handleNavigation = useCallback(
    (item: SidebarItem) => {
      if (item.type === "doc" && item.id) {
        const filePath = item.id.endsWith(".md")
          ? `/docs${item.id}`
          : `/docs${item.id}.md`;

        fetchFile(filePath);

        history.replace({
          pathname: "/",
          search: `?doc=${item.id.replace(/\.md$/, "")}`,
        });
      }
    },
    [fetchFile, history]
  );

  const hasLocalModificationsForPath = useCallback((path: string) => {
    const localEdits = useMarkdownStore.getState().localEdits;
    return localEdits.some((edit) => edit.path === path);
  }, []);

  const renderSidebarItems = useCallback(
    (items: SidebarItem[], level = 0) => {
      return items.map((item, index) => {
        const categoryId = `category-${level}-${index}`;

        if (item.type === "category") {
          const isExpanded = expandedCategories[categoryId] || false;

          return (
            <li key={categoryId} className="sidebar-category">
              <div
                className="sidebar-category-header"
                onClick={() => toggleCategory(categoryId)}
              >
                <span
                  className={`category-icon ${
                    isExpanded ? "expanded" : "collapsed"
                  }`}
                >
                  {isExpanded ? "▼" : "►"}
                </span>
                <span className="category-label">{item.label}</span>
              </div>

              {isExpanded && item.items && (
                <ul className="sidebar-items nested">
                  {renderSidebarItems(item.items, level + 1)}
                </ul>
              )}
            </li>
          );
        }

        const currentDoc = new URLSearchParams(location.search).get("doc");
        const itemId = item.id?.replace(/\.md$/, "").replace(/^\//, "");
        const isActive =
          currentDoc === itemId || (!currentDoc && itemId === "homepage");

        return (
          <li
            key={`doc-${level}-${index}`}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => handleNavigation(item)}
          >
            <span className="item-label">{item.label}</span>
            {item.id && hasLocalModificationsForPath(`/docs${item.id}.md`) && (
              <span className="modified-badge" title="Modified locally">
                *
              </span>
            )}
          </li>
        );
      });
    },
    [
      expandedCategories,
      toggleCategory,
      location.search,
      handleNavigation,
      hasLocalModificationsForPath,
    ]
  );

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3>Documentation</h3>
      </div>
      <nav className="sidebar-nav">
        {isLoading ? (
          <div className="sidebar-loading">Carregando menu...</div>
        ) : sidebarItems.length > 0 ? (
          <ul className="sidebar-items root">
            {renderSidebarItems(sidebarItems)}
          </ul>
        ) : (
          <div className="sidebar-empty">Nenhum documento encontrado</div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
