# Visualizador de Markdown Docusaurus

Este projeto é um visualizador e editor de documentação Markdown que consome arquivos de um repositório Bitbucket, permitindo a visualização, edição local e comparação de documentos.

## 📋 Funcionalidades

- Leitura e renderização de arquivos Markdown do repositório Bitbucket
- Navegação entre documentos através de um menu de navegação
- Edição local de documentos com salvamento no navegador
- Área administrativa para visualização de documentos modificados localmente
- Comparação visual entre a versão original e a versão editada localmente

## 🚀 Requisitos

- Node.js 16.x ou superior
- NPM 7.x ou superior

## 🛠️ Instalação

Siga as etapas abaixo para configurar o projeto localmente:

1. Clone o repositório:
```bash
git clone https://github.com/JonasAndradee/markdown-editor.git
cd markdown-editor
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. O aplicativo estará disponível em: `http://localhost:3000`

## 📦 Dependências Principais

- **Docusaurus**: Framework para criação de sites de documentação
- **React**: Biblioteca para construção da interface
- **Zustand**: Gerenciamento de estado global
- **React Hook Form + Yup**: Gerenciamento e validação de formulários
- **Axios**: Cliente HTTP para comunicação com a API do Bitbucket
- **Diff**: Biblioteca para comparação de textos
- **Markdown-to-jsx**: Renderização de Markdown

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Breadcrumbs.tsx       # Navegação por breadcrumbs
│   ├── DiffViewer.tsx        # Visualizador de diferenças
│   ├── MarkdownEditor.tsx    # Editor de Markdown
│   ├── MarkdownRenderer.tsx  # Renderizador de Markdown
│   ├── MarkdownViewer.tsx    # Visualizador de Markdown
│   ├── NotificationSystem.tsx # Sistema de notificações
│   └── Sidebar.tsx           # Menu de navegação lateral
├── hooks/              # Hooks personalizados
│   ├── useBitbucketAPI.ts    # Comunicação com a API do Bitbucket
│   ├── useLocalStorage.ts    # Persistência no localStorage
│   └── useMarkdownFile.ts    # Carregamento de arquivos Markdown
├── pages/              # Páginas da aplicação
│   ├── admin.tsx            # Área administrativa
│   └── index.tsx            # Página principal
├── services/           # Serviços
│   ├── api.ts               # Comunicação com a API do Bitbucket
│   └── localStorageService.ts # Serviço de armazenamento local
├── store/              # Gerenciamento de estado
│   └── index.ts             # Store Zustand
├── types/              # Definições de tipos TypeScript
│   └── index.ts             # Interfaces e tipos da aplicação
├── utils/              # Utilitários
│   └── markdown.ts          # Funções de manipulação de Markdown
└── css/                # Estilos
    └── custom.css           # Estilos personalizados
```

## 🔄 Fluxo da Aplicação

1. Ao iniciar, a aplicação carrega o arquivo `homepage.md` do repositório e o estrutura de navegação a partir do arquivo `_sidebar.md`.
2. Os documentos são renderizados com formatação Markdown.
3. Os usuários podem navegar entre os documentos através do menu lateral.
4. É possível editar documentos, que são salvos localmente no navegador.
5. Na área de administração, os usuários podem ver todos os documentos modificados localmente e comparar as mudanças com a versão original.

## 🎨 Personalização

### Temas
O projeto utiliza o sistema de temas do Docusaurus, que inclui suporte para modo claro/escuro. Você pode personalizar as cores e outros aspectos visuais editando o arquivo `src/css/custom.css`.

### Comportamento
Para modificar o comportamento da aplicação, você pode editar os componentes principais em `src/components/` e a lógica de estado em `src/store/`.

## 📝 Notas de Desenvolvimento

- A aplicação utiliza parâmetros de consulta (query params) para navegação entre documentos, mantendo a estrutura SPA.
- O estado global é gerenciado com Zustand, permitindo acessar dados de documentos e modificações locais em toda a aplicação.
- As modificações locais são armazenadas usando localStorage para persistência entre sessões.

## ⚠️ Solução de Problemas

Se encontrar problemas ao executar o projeto, verifique:

1. **Versão do Node.js**: Execute `node -v` para confirmar que está usando uma versão compatível.
2. **Dependências**: Certifique-se de que todas as dependências foram instaladas corretamente com `npm install`.
3. **Porta em uso**: Se a porta 3000 estiver em uso, você pode modificar a porta no arquivo `docusaurus.config.js`.
