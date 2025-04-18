// Importa o serviço de criação em massa de usuários
import { bulkCreateUsersService } from '#bulkCreateUsersService';

export const bulkCreateUsersController = async (req, res) => {
  // Verifica se o arquivo CSV foi enviado na requisição
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo CSV não enviado.' });
  }

  try {
    // Serviço para processar o arquivo CSV
    const result = await bulkCreateUsersService(req.file);
    // Extrai os resultados do processamento
    const { successCount, failedCount, errors, totalRows } = result;

    // Retorna com status 207 (Multi-Status) se houver falhas, 200 se tudo ok
    res.status(failedCount > 0 ? 207 : 200).json({
      message: `Processamento concluído. ${successCount} usuários criados, ${failedCount} falhas.`,
      totalRowsProcessed: totalRows,        // Total de linhas processadas
      successfullyCreated: successCount,    // Número de sucessos
      failedCount,                          // Número de falhas
      errors                                // Detalhes dos erros ocorridos
    });

  } catch (error) {
    // Loga e retorna erros inesperados
    console.error('[ERROR Bulk Create] Falha:', error);
    res.status(500).json({
      message: 'Erro interno ao processar o arquivo.',
      error: error.message
    });
  }
};