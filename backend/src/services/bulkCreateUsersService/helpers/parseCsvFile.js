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

        const { login = '', password = '', spaceId = '', role = '' } = row;

        const trimmedLogin = login.trim();
        const trimmedPassword = password.trim();
        const trimmedSpaceId = parseInt(spaceId.trim(), 10);
        const trimmedRole = role.trim();

        const user = {
          login: trimmedLogin,
          password: trimmedPassword,
          spaceId: trimmedSpaceId,
          role: trimmedRole,
          lineNumber,
        };

        const isValid = trimmedLogin && trimmedPassword && !isNaN(trimmedSpaceId) && trimmedRole;

        if (isValid) { validUsers.push(user) }
        else {
          initialFailureCount++;
          errors.push({
            line: lineNumber,
            login: trimmedLogin || 'N/A',
            error: 'Dados obrigatórios ausentes ou inválidos.',
          });
        }
      })
      .on('end', () => {
        resolve({ validUsers, initialFailureCount, processedRowCount, errors });
      })
      .on('error', reject);
  });
};
