import fs from 'fs';
import csv from 'csv-parser';

export const parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
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
          errors.push({
            line: lineNumber,
            login: login || 'N/A',
            error: 'Dados obrigatórios ausentes ou inválidos.',
          });
        } else {
          validUsers.push({ login, password, spaceId, role, lineNumber });
        }
      })
      .on('end', () => {
        resolve({
          validUsers,
          initialFailureCount,
          processedRowCount,
          errors,
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
