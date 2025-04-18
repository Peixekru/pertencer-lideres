// Importa funções auxiliares para processamento do CSV
import {
  parseCsvFile,
  validateUserRow,
  createUserFromRow,
  removeTempFile,
} from './index.js';

// Função principal que orquestra todo o processo de criação em massa de usuários via CSV
export const bulkCreateUsersService = async (file) => {
  // Obtém caminho do arquivo temporário
  const filePath = file.path;

  // Processa o arquivo CSV e obtém dados iniciais
  const {
    validUsers: csvRows,
    processedRowCount,
    initialFailureCount,
    errors: initialErrors,
  } = await parseCsvFile(filePath);

  // Arrays para armazenar usuários válidos e erros
  const usersToCreate = [];
  const errors = [...initialErrors];

  // Valida cada linha do CSV
  for (const [index, row] of csvRows.entries()) {
    // Calcula número da linha (+2 para compensar cabeçalho e índice base 0)
    const lineNumber = index + 2;
    const { isValid, user, error } = validateUserRow(row, lineNumber);

    // Adiciona usuário válido ou erro ao array correspondente
    isValid ? usersToCreate.push(user) : errors.push(error);
  };

  // Contadores para resultados finais
  let successCount = 0;
  let creationFailures = 0;

  // Cria cada usuário válido
  for (const user of usersToCreate) {
    try {
      await createUserFromRow(user);
      successCount++;
    } catch (err) {
      creationFailures++;
      errors.push({
        line: user.lineNumber,
        login: user.login,
        error: err.message || 'Erro desconhecido',
      });
    }
  }

  // Remove arquivo temporário após processamento
  await removeTempFile(filePath);

  // Retorna estatísticas do processamento
  return {
    successCount,
    failedCount: initialFailureCount + creationFailures,
    errors,
    totalRows: processedRowCount,
  };
};

