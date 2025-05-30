import dotenvFlow from "dotenv-flow";

// Carrega as variáveis de ambiente conforme NODE_ENV
dotenvFlow.config();

// Log básico para garantir carregamento
console.log("Variáveis de ambiente carregadas para:", process.env.NODE_ENV);
