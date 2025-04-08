import React, { useEffect } from "react";
import { useMarkdownStore } from "../store";
import { SidebarItem } from "../types";
import { useHistory, useLocation } from "@docusaurus/router";

const Sidebar: React.FC = () => {
  const { sidebarItems, fetchSidebar, fetchFile } = useMarkdownStore();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    fetchSidebar();
  }, [fetchSidebar]);

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

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3>Documentation</h3>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-items">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`sidebar-item ${
                location.pathname === item.id ? "active" : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
