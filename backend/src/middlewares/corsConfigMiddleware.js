import cors from "cors";
import "dotenv/config";

// Lista de origens permitidas, vindas do .env
// - FRONTEND_URL_VITE: ambiente de desenvolvimento com Vite
// - FRONTEND_URL_DIST: frontend buildado sendo servido localmente
// - FRONTEND_URL_PROD: domínio principal de produção
// - FRONTEND_URL_ADMN: domínio da área administrativa

const allowedOrigins = [
  process.env.FRONTEND_URL_VITE,
  process.env.FRONTEND_URL_DIST,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_ADMN,
].filter(Boolean); // Remove entradas vazias ou undefined

const corsOptions = {
  origin: (origin, callback) => {
    // Em dev, exibe no console a origem da requisição
    if (process.env.NODE_ENV !== "production") {
      console.log("Origin:", origin);
    }

    // Permite requisições sem 'origin' (ex: curl, apps móveis, backend interno)
    if (!origin) {
      return callback(null, true);
    }

    // Permite se a origem estiver na lista de confiáveis
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      // Bloqueia se não for uma origem conhecida
      return callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },

  // Permite envio de cookies/autenticação entre domínios
  credentials: true,
};

// Exporta o middleware CORS configurado
export default cors(corsOptions);

/*
// ⚠️ CORS totalmente liberado — apenas para testes
const corsOptions = {
  origin: true, // Aceita qualquer origem
  credentials: true, // Permite cookies/autenticação
};

export default cors(corsOptions);
*/
