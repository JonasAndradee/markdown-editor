import React, { useEffect } from "react";
import { useMarkdownStore } from "@site/src/store";

// Este componente envolve toda a aplicação e é executado em todas as páginas
export default function Root({ children }) {
  const { fetchLocalEdits } = useMarkdownStore();

  useEffect(() => {
    // Carrega as edições locais quando a aplicação inicializa
    fetchLocalEdits();
  }, [fetchLocalEdits]);

  return <>{children}</>;
}
