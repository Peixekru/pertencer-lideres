import fs from 'fs';
import path from 'path';

export const removeTempFile = async (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log(`[INFO Bulk Create] Arquivo removido com sucesso: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`[WARN Bulk Create] Falha ao remover arquivo: ${path.basename(filePath)}`, err);
  }
};
