import cors from 'cors'
import 'dotenv/config';

// Defina os domínios permitidos em desenvolvimento e produção
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,        // Dev URL
  process.env.FRONTEND_URL_PROD,       // Prod URL
  process.env.FRONTEND_URL_ADMN,       // Admin URL
  // ... outros domínios 
]

const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin:', origin); // Log para verificar a origem da requisição

    if (!origin) {
      // Permite requests sem origin (como em curl ou mobile)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
  credentials: true,
};

export default cors(corsOptions)
