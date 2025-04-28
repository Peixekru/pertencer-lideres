# Pertencer Líderes - Documentação do Projeto

## 1. Visão Geral do Projeto

Aplicação web full-stack desenvolvida para a plataforma "Pertencer Líderes". Consiste em um
frontend Vue.js, um backend Node.js (Express) e um banco de dados MySQL gerenciado via Docker.
A aplicação oferece funcionalidades para autenticação de usuários, gerenciamento de cursos,
entrega de conteúdo e potencialmente outras funcionalidades relacionadas à plataforma.

## 2. Estrutura do Projeto

/pertencer-lideres
├── .git/
├── .gitignore
├── backend/
│ ├── node_modules/
│ ├── uploads/
│ ├── src/
│ │ ├── config/
│ │ │ └── database.js
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ │ ├── authMiddleware.js
│ │ │ ├── resizeImageMiddleware.js
│ │ │ └── uploadCsvMiddleware.js
│ │ ├── services/
│ │ │ ├── bulkCreateUsersService/
│ │ │ │ ├── helpers/
│ │ │ │ │ ├── createUserFromRow.js
│ │ │ │ │ ├── parseCsvFile.js
│ │ │ │ │ ├── removeTempFile.js
│ │ │ │ │ └── validateUserRow.js
│ │ │ │ ├── bulkCreateUsersService.js
│ │ │ │ └── index.js
│ │ │ ├── cloneCourseService/
│ │ │ │ ├── helpers/
│ │ │ │ │ └── cloneUserCourse.js
│ │ │ │ ├── cloneCourseService.js
│ │ │ │ └── index.js
│ │ │ ├── getAllUsersService.js
│ │ │ ├── getUserCoursesService.js
│ │ │ └── uploadImageService.js
│ │ └── app.js
│ ├── bulk_create_user_temlpate.csv
│ ├── package.json
│ ├── requests.rest
│ ├── server.js
│ └── temp.json
├── database/
│ ├── data/
│ ├── docker-compose.yml
│ ├── pertencer_db.erd
│ └── pertencer_db.sql
├── frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
├── shared/
│ ├── README.md
│ ├── logger.js
│ ├── loggerConfig.js
│ └── stringifyArgs.js
└── package.json

## 3. Backend /pertencer-lideres/backend

O backend é construído usando Node.js e o framework Express. Ele lida com requisições API,
interage com o banco de dados, gerencia autenticação e processa uploads de arquivos.

### 3.1. Configuração

1.  Navegue até o diretório do backend: pertencer-lideres/backend

2.  Instale as dependências: npm install
3.  Crie modifique o arquivo `.env` e configure as variáveis de ambiente para:

- Conexão com o banco de dados
  - `DB_HOST`,
  - `DB_USER`,
  - `DB_PASSWORD`,
  - `DB_NAME`,
  - `DB_PORT`,
- Segredos JWT
  - `JWT_SECRET`,
  - `REFRESH_TOKEN_SECRET`
- Portas do servidor
  - `SERVER_HOST_DEV`
  - `SERVER_PORT_DEV`,
  - `SERVER_HOST_PROD`,
  - `SERVER_PORT_PROD`

4.  Inicie o servidor de desenvolvimento: npm run dev
    Isso usa o `nodemon` para reinicializações automáticas em mudanças de arquivo.

5.  Inicie o servidor de produção: npm run prod

### 3.2. Funcionalidades e Módulos Chave

- **Servidor API:** Usa Express (`/backend/src/app.js`) para definir
  rotas e middlewares. O servidor é iniciado em `/backend/server.js`.

- **Autenticação:** Implementa autenticação baseada em JWT
  (`/backend/src/middlewares/authMiddleware.js`) com tokens de
  acesso e refresh. A lógica de login e atualização de token reside nos
  controllers/services de autenticação.

- **Interação com Banco de Dados:** Usa `mysql2/promise`
  (`/backend/src/config/database.js`) para conectar ao banco de dados MySQL.
  Serviços como `/backend/src/services/getAllUsersService.js` e
  `/backend/src/controllers/getUserCoursesController.js` lidam com a
  recuperação e manipulação de dados.

- **Uploads de Arquivos:** Usa `multer`
  (`/backend/src/middlewares/uploadCsvMiddleware.js`) para lidar com uploads
  de arquivos (ex: CSV para criação de usuários em massa, imagens para galeria).

- **Processamento de Imagens:** Usa `sharp`
  (`/backend/src/middlewares/resizeImageMiddleware.js`) para redimensionar
  imagens enviadas em diferentes formatos (ex: imagem principal, miniatura) e
  as converte para WebP. Os uploads originais são excluídos após o processamento.

- **Criação de Usuários em Massa:** Serviço
  (`/backend/src/services/bulkCreateUsersService/bulkCreateUsersService.js`)
  para analisar arquivos CSV (/backend/src/services/bulkCreateUsersService/
  helpers/parseCsvFile.js) e criar múltiplos usuários. Inclui validação e
  remoção de arquivos temporários (/backend/src/services/bulkCreateUsersService
  /helpers/removeTempFile.js).

- **Clonagem de Cursos:** Serviço
  (`/backend/src/services/cloneCourseService/cloneCourseService.js`) responsável
  por duplicar estruturas de cursos e dados de usuário relacionados
  (`/backend/src/services/cloneCourseService/helpers/cloneUserCourse.js`).

- **Logging Customizado:** Usa o utilitário de logger compartilhado
  (`/shared/logger.js`) por meio de imports definidos no `/backend/package.json`.

### 3.3. Dependências

Dependências chave listadas no /backend/package.json:

- `express`: Framework web
- `mysql2`: Driver do banco de dados
- `jsonwebtoken`: Manipulação de JWT
- `bcryptjs`: Hashing de senhas
- `cors`: Middleware de Cross-Origin Resource Sharing
- `dotenv`: Carregamento de variáveis de ambiente
- `multer`: Manipulação de upload de arquivos
- `sharp`: Processamento de imagens
- `csv-parser`: Análise de arquivos CSV
- `cookie-parser`: Análise de cookies de requisição
- `nodemon`: Utilitário de servidor de desenvolvimento

## 4. Frontend /pertencer-lideres/frontend

    O frontend é uma Single Page Application (SPA) construída usando Vue.js 3,
    Vuetify 3 para componentes de UI, Pinia para gerenciamento de estado e Vite
    como ferramenta de build.

### 4.1. Configuração

1.  Navegue até o diretório do frontend:/pertencer-lideres/frontend

2.  Instale as dependências: npm install

3.  Inicie o servidor de desenvolvimento: npm run dev
    A aplicação estará acessível, tipicamente em `http://localhost:5173`
    veja /frontend/vite.config.js.

4.  Compile para produção: npm run build
    Isso cria arquivos estáticos otimizados no diretório `dist`.

### 4.2. Funcionalidades e Módulos Chave

- **Framework de UI:** Usa Vuetify 3 /frontend/src/plugins/vuetify.js
  para componentes pré-construídos e estilização.

- **Roteamento:** Usa Vue Router /frontend/src/router/index.js
  para navegação entre views. Inclui um guarda de navegação global (`beforeEach`)
  para lidar com verificações de autenticação e tentativas de atualização de
  token para rotas protegidas.

- **Gerenciamento de Estado:** Usa Pinia /frontend/src/main.js
  para gerenciar o estado global da aplicação.

  - Store `auth` /frontend/src/store/auth.js" lida com o estado de autenticação do usuário,
    ações de login/logout, armazenamento de token usando `localStorage` via
    /frontend/src/services/storageService.js, cookies via /frontend/src/utils/cookie.js
    e lógica de atualização de token. Usa `pinia-plugin-persistedstate` para persistir os estados.

  - Store `course` /frontend/src/store/course.js gerencia dados relacionados a cursos,
    buscando cursos do usuário e detalhes específicos do curso.

  - Store `system` /frontend/src/store/system.js" lida com o estado de todo o sistema,
    como preferência de modo escuro e mensagens globais.

- **Comunicação API:** Usa Axios, provavelmente configurado com uma URL base e interceptors em
  /frontend/src/services/axiosInstance.js, para fazer requisições à API do backend.

- **Componentes:**

  - /frontend/src/components/login/Login.vue: Lida com o formulário de login do usuário e interação.

  -/frontend/src/components/Logout.vue: Fornece funcionalidade de logout.

  - /frontend/src/components/SwithTheme.vue: Alterna entre temas claro e escuro usando o
    sistema de temas do Vuetify e a store `system`.

  - /frontend/src/components/CardContent.vue: Componente de exemplo, para exibir conteúdo do curso.

- **Views:**

  - /frontend/src/views/LoginView.vue: A view principal para a página de login, renderizando
    dinamicamente componentes de login ou esqueci minha senha.

  - /frontend/src/views/HomeView.vue: A view principal após o login bem-sucedido, provavelmente
    exibindo o dashboard do usuário ou lista de cursos. Busca os cursos do usuário ao montar.

- **Estilização:** Usa SCSS /frontend/src/assets/styles/global.scss para estilos globais e
  potencialmente dentro de componentes.

- **Ferramenta de Build:** Usa Vite /frontend/vite.config.js para servidor de desenvolvimento rápido
  e builds de produção otimizadas. A configuração inclui aliases e chunking manual para
  melhor divisão de código.

- **Linting/Formatação:** Usa ESLint /frontend/.eslintrc.cjs e Prettier /frontend/.prettierrc
  para qualidade e consistência do código.

- **Logging Customizado:** Usa o utilitário de logger compartilhado /shared/logger.js através de imports
  definidos no /frontend/package.json.

### 4.3. Dependências

Dependências chave listadas no /frontend/package.json:

- `vue`: Biblioteca principal Vue.js
- `vuetify`: Biblioteca de componentes de UI
- `vue-router`: Roteamento do lado do cliente
- `pinia`: Gerenciamento de estado
- `pinia-plugin-persistedstate`: Persistência de estado Pinia
- `axios`: Cliente HTTP para chamadas API
- `js-cookie`: Utilitário de manipulação de cookies
- `crypto-js`: Criptografia/descriptografia de dados (usado por `storageService`)
- `@mdi/font`: Fonte Material Design Icons
- `vite`: Ferramenta de build
- `@vitejs/plugin-vue`: Plugin Vite para Vue
- `vite-plugin-vuetify`: Plugin Vite para integração Vuetify
- `sass-embedded`: Pré-processador SCSS

## 5. Banco de Dados pertencer-lideres/database

A aplicação usa um banco de dados MySQL.

### 5.1. Configuração

    O banco de dados é gerenciado usando Docker através do arquivo
    /database/docker-compose.yml.

1.  Certifique-se de que o Docker Desktop esteja instalado e em execução.

2.  Navegue até o diretório do banco de dados: /database

3.  Inicie o container MySQL: docker-compose up -d
    Isso iniciará uma instância MySQL na porta 3306, criará o banco de dados
    `pertencer_db` e configurará o usuário `pertencer_user`.
    Os dados são persistidos no volume `./data`.

4.  Pare o container: docker-compose down

### 5.2. Esquema

- O esquema do banco de dados está definido em /database/pertencer_db.sql.

- Um Diagrama Entidade-Relacionamento está disponível em /database/pertencer_db.erd.

- Tabelas chave provavelmente incluem `users`, `courses`, `user_courses`,
  `lessons`, `user_course_gallery`, etc.

## 6. Utilitários Compartilhados /pertencer-lideres/shared

### 6.1. Logger

Um logger customizado /shared/logger.js é fornecido para logging consistente tanto
no frontend quanto no backend.

- **Funcionalidades:** Saída colorida, níveis de log (info, warn, error, debug, log),
  ícones/labels customizados, informação do arquivo/linha chamador,
  saída stringificada, saída em tabela.

- **Configuração:** Cores, ícones e labels são definidos em /shared/loggerConfig.js.
- **Uso:** Importado usando o alias `#logger` tanto no backend quanto no frontend
  backend/package.json, /frontend/package.json.

## 7. Fluxo de Desenvolvimento

1.  **Iniciar Banco de Dados:** Execute `docker-compose up -d` no diretório `/database`.
2.  **Iniciar Backend:** Execute `npm run dev` no diretório `/backend`.
3.  **Iniciar Frontend:** Execute `npm run dev` no diretório `/frontend">`.

## 8. Deploy (Implantação)

- **Backend:** Compile/execute usando `npm run prod`. Requer a configuração de variáveis de
  ambiente de produção (conexão DB, segredos JWT, host/porta do servidor).
  Necessita de um gerenciador de processos (como PM2) ou conteinerização (Docker).

- **Frontend:** Compile usando `npm run build`. Implante o conteúdo do diretório `dist`
  gerado em um servidor de arquivos estáticos (como Nginx, Apache, Vercel, Netlify).
  Certifique-se de que o servidor esteja configurado para lidar com roteamento SPA
  (redirecionar todas as requisições não-estáticas para `index.html`).
