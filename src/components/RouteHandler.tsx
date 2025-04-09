import React from "react";
import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import { useMarkdownStore } from "../store";
import { useNotification } from "./NotificationSystem";

const RouteHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const { currentFile } = useMarkdownStore();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (currentFile?.isModified) {
      addNotification("This document has local modifications.", "info", 3000);
    }
  }, [currentFile?.path, currentFile?.isModified, addNotification]);

  return <>{children}</>;
};

export default RouteHandler;
