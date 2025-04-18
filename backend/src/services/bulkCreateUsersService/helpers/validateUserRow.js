export const validateUserRow = (row, lineNumber) => {
  const login = String(row.login || '').trim();
  const password = String(row.password || '').trim();
  const spaceId = parseInt(String(row.spaceId || '').trim(), 10);
  const role = String(row.role || '').trim();

  if (!login || !password || isNaN(spaceId) || !role) {
    return {
      isValid: false,
      error: {
        line: lineNumber,
        login: login || 'N/A',
        error: 'Dados obrigatórios ausentes ou inválidos.',
      },
    };
  }

  return {
    isValid: true,
    user: { login, password, spaceId, role, lineNumber },
  };
};
