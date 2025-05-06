import { getSpaceSettingsByNameFromDb } from '../services/getSpaceSettingsByNameService.js';

// Controlador para buscar um espaço pelo parâmetro da URL
export const getSpaceSettingsByName = async (req, res) => {
  // Extrai o parâmetro da URL
  const { urlParam } = req.params;
  // Verifica se o parâmetro está presente na requisição
  if (!urlParam) {
    return res.status(400).json({ message: 'Parâmetro space ausente.' });
  }
  try {
    // Busca as configurações do espaço no banco de dados
    const settings = await getSpaceSettingsByNameFromDb(urlParam);
    // Verifica se o espaço foi encontrado
    if (!settings) {
      return res.status(404).json({ message: 'Space não encontrado' });
    }
    // Retorna as configurações do espaço em formato JSON
    res.json(settings);
  } catch (error) {
    // Loga e retorna erros durante a busca
    console.error(`Erro ao buscar space para param '${urlParam}':`, error);
    res.status(500).json({
      message: 'Erro interno ao buscar configurações do espaço.',
      error: error.message
    });
  }
};