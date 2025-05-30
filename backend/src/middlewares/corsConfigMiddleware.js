import "../config/envSetup.js";
import cors from "cors";

// Lista de origens confiáveis definidas via variável de ambiente
// FRONTEND_URL deve ser especificada em cada .env.<ambiente>
// Exemplo: http://159.203.185.226:8081, http://159.203.185.226:8081

// Converte a variável FRONTEND_URL (separada por vírgulas) em um array de origens permitidas.
// Remove espaços em branco e barras finais para garantir que 'http://159.203.185.226:8081' e 'http://localhost:5173/'
// sejam tratados como equivalentes durante a verificação de CORS.

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) =>
      url.trim().replace(/\/$/, "")
    )
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Loga a origem da requisição em ambientes não-produtivos (útil para debug)
    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 Requisição de origem:", origin);
    }

    // Permite requisições sem origem (ex: curl, Postman, servidores internos)
    if (!origin) {
      return callback(null, true);
    }

    // Permite se a origem estiver explicitamente autorizada no .env
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Rejeita a requisição se a origem não for reconhecida
    return callback(new Error(`🚫 CORS bloqueado para origem: ${origin}`));
  },

  // Permite o envio de cookies/autenticação entre domínios (requerido com credentials: true no frontend)
  credentials: true,
};

// Exporta o middleware configurado para uso no app Express
export default cors(corsOptions);
