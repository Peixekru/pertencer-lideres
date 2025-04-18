// Importa serviços auxiliares necessários
import { hashPassword } from '../../../utils/cryptService.js';
import { generateInitialRefreshToken } from '../../../utils/tokenService.js';
import { findUserByLogin } from '../../findUserService.js';
import { createUserInDB } from '../../createUserService.js';

// Função para criar um usuário a partir de uma linha do CSV
export const createUserFromRow = async (userRow) => {
  const { login, password, spaceId, role } = userRow;

  try {
    // Verifica se o usuário já existe
    const existingUser = await findUserByLogin(login);
    if (existingUser) {
      return { success: false, error: 'Login já existente.' };
    }

    // Criptografa a senha e gera token de refresh inicial
    const hashedPassword = await hashPassword(password);
    const refreshToken = generateInitialRefreshToken();  // Gera token JWT inicial

    // Cria o usuário no banco de dados
    await createUserInDB(login, hashedPassword, refreshToken, spaceId, role);

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao processar o usuário.'
    };
  }
};
