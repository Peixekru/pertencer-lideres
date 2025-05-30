// Carrega as variáveis do arquivo .env
import "./src/config/envSetup.js";

// Importa a instância do app Express configurado em app.js
import app from "./src/app.js";

// Determina o ambiente com base no NODE_ENV ou usa "development" como padrão
const env = process.env.NODE_ENV || "development";

// Configurações do servidor ou usa localhost:3000 como padrão
const HOST = process.env.SERVER_HOST || "localhost";
const PORT = Number(process.env.SERVER_PORT || 3000);

// Inicia o servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT} [${env}]`);
});

// Escuta sinais de encerramento (Ctrl+C, etc.) e encerra o servidor com segurança
process.on("SIGINT", () => {
  server.close(() => {
    console.log("❌ Servidor encerrado");
    process.exit(0);
  });
});
