import app from "./src/app.js";

// Lê as variáveis do .env para servidor
const isProduction = process.env.NODE_ENV === "production"; // Verifica se está em produção

// Usa as variáveis conforme o ambiente ( Produção ou Desenvolvimento)

const HOST = isProduction
  ? process.env.SERVER_HOST_PROD
  : process.env.SERVER_HOST_DEV;
const PORT = Number(
  isProduction ? process.env.SERVER_PORT_PROD : process.env.SERVER_PORT_DEV
);

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("❌ Servidor encerrado");
    process.exit(0);
  });
});
