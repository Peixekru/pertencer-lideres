// /src/middlewares/uploadCsvMiddleware.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define o diretório - uploads/temp
const uploadDir = path.join(process.cwd(), 'uploads', 'temp');

// Garante que o diretório de upload exista
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    // Atualiza log para refletir o nome genérico
    console.log(`[Middleware Upload CSV] Diretório de upload temporário criado: ${uploadDir}`);
  }
} catch (error) {
  console.error(`[Middleware Upload CSV] Erro ao criar diretório de upload ${uploadDir}:`, error);
}

// --- Configuração de armazenamento (storage) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync(uploadDir)) {
      cb(null, uploadDir); // Salva na subpasta /uploads/temp/
    } else {
      cb(new Error(`Diretório de upload temporário não encontrado ou inacessível: ${uploadDir}`), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// --- Filtro para CSV
const fileFilter = (req, file, cb) => {
  // ... (código do filtro inalterado) ...
  const allowedMimes = ['text/csv', 'application/vnd.ms-excel'];
  const allowedExts = ['.csv'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(fileExt)) {
    cb(null, true);
  } else {
    console.warn(`[Middleware Upload CSV] Arquivo rejeitado: ${file.originalname} (Tipo: ${file.mimetype}, Ext: ${fileExt})`);
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Apenas arquivos .csv são permitidos.'), false);
  }
};

// --- Configuração final do Multer
const uploadCsv = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export default uploadCsv;