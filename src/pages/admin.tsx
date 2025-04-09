import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import { useMarkdownStore } from "@site/src/store";
import { useHistory } from "@docusaurus/router";
import { formatDate } from "@site/src/utils/markdown";

export default function Admin() {
  const { localEdits, fetchLocalEdits } = useMarkdownStore();
  const history = useHistory();

  useEffect(() => {
    fetchLocalEdits();
  }, [fetchLocalEdits]);

  const handleViewDocument = (path: string) => {
    const docPath = path.replace("/docs/", "").replace(".md", "");

    history.push(`/?doc=${docPath}`);
  };

  const handleShowChanges = (edit) => {
    const diffContainerId = `diff-${edit.path.replace(/[^a-zA-Z0-9]/g, "-")}`;
    const diffContainer = document.getElementById(diffContainerId);

    if (diffContainer) {
      diffContainer.classList.toggle("hidden");
    }
  };

  return (
    <Layout
      title="Admin Area"
      description="View and manage locally edited markdown files"
    >
      <div className="container margin-vert--lg">
        <h1>Administrador</h1>
        <p>
          Esta área mostra todos os arquivos markdown que foram editados
          localmente. Você pode ver as diferenças entre as versões original e
          modificada.
        </p>

        <h2>Arquivos modificados localmente</h2>
        <p>
          Os seguintes arquivos foram modificados localmente. Clique em um
          arquivo para visualizar as alterações.
        </p>

        {localEdits.length === 0 ? (
          <div className="empty-message">
            Nenhum arquivo modificado localmente encontrado.
          </div>
        ) : (
          <div className="files-grid">
            {localEdits.map((edit, index) => (
              <div key={index} className="file-card">
                <div className="file-header">
                  <h3>{edit.name}</h3>
                  <p className="file-date">
                    Editado {formatDate(edit.editedAt)}
                  </p>
                </div>
                <div className="file-actions">
                  <button
                    className="view-button"
                    onClick={() => handleViewDocument(edit.path)}
                  >
                    Visualizar Documento
                  </button>
                  <button
                    className="changes-button"
                    onClick={() => handleShowChanges(edit)}
                  >
                    Mostrar Mudanças
                  </button>
                </div>
                <div
                  id={`diff-${edit.path.replace(/[^a-zA-Z0-9]/g, "-")}`}
                  className="diff-container hidden"
                >
                  <div className="diff-header">
                    <h4>Mudanças</h4>
                  </div>
                  <div className="diff-content">
                    <div className="original-content">
                      <h5>Original</h5>
                      <pre>{edit.originalContent}</pre>
                    </div>
                    <div className="modified-content">
                      <h5>Modificado</h5>
                      <pre>{edit.content}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
