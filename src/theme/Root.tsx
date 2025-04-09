import React from "react";
import { NotificationProvider } from "@site/src/components/NotificationSystem";

export default function Root({ children }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
