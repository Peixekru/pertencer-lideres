import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { createUserInDB } from './createUserService.js';
import { hashPassword } from '../utils/cryptService.js';
import { findUserByLogin } from './findUserService.js';
import { generateInitialRefreshToken } from '../utils/tokenService.js';

export const bulkCreateUsersService = (file) => {
  return new Promise((resolve, reject) => {
    const filePath = file.path;

    const validUsers = [];
    const errors = [];
    let processedRowCount = 0;
    let initialFailureCount = 0;

    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        processedRowCount++;
        const lineNumber = processedRowCount + 1;

        const login = row.login?.trim();
        const password = row.password?.trim();
        const spaceId = parseInt(row.spaceId?.trim(), 10);
        const role = row.role?.trim();

        if (!login || !password || !spaceId || !role || isNaN(spaceId)) {
          initialFailureCount++;
          errors.push({ line: lineNumber, login: login || 'N/A', error: 'Dados obrigatórios ausentes ou inválidos.' });
        } else {
          validUsers.push({ login, password, spaceId, role, lineNumber });
        }
      })
      .on('end', async () => {
        let successCount = 0;
        let creationFailures = 0;

        for (const user of validUsers) {
          try {
            const exists = await findUserByLogin(user.login);
            if (exists) throw new Error('Login já existente.');

            const hashed = await hashPassword(user.password);
            const token = generateInitialRefreshToken();

            await createUserInDB(user.login, hashed, token, user.spaceId, user.role);
            successCount++;
          } catch (err) {
            creationFailures++;
            errors.push({
              line: user.lineNumber,
              login: user.login,
              error: `Falha na criação: ${err.message}`
            });
          }
        }

        // Remove o arquivo
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`[WARN Bulk Create] Falha ao remover arquivo: ${path.basename(filePath)}`, err);
        }

        resolve({
          successCount,
          failedCount: initialFailureCount + creationFailures,
          errors,
          totalRows: processedRowCount
        });
      })
      .on('error', (err) => {
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (_) { }
        reject(err);
      });
  });
};