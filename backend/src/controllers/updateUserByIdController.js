// Funções do serviço de criptografia, banco de dados e criptografia
import { findUserByLogin } from '../services/findUserService.js';
import { updateUserByIdInDB } from '../services/updateUserByIdService.js';
import { hashPassword } from '../utils/cryptService.js';

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }

  try {
    // Verifica se o novo login já está em uso por outro usuário
    const existingUser = await findUserByLogin(login);
    if (existingUser && existingUser.id !== Number(id)) {
      return res.status(400).json({ message: 'Login já está em uso por outro usuário' });
    }

    // Hashea a nova senha usando o serviço de criptografia
    const hashedPassword = await hashPassword(password);

    // Atualizar o usuário no banco de dados
    const success = await updateUserByIdInDB(id, login, hashedPassword); // Passa o hash gerado pelo serviço
    if (!success) {
      // Se updateUserByIdInDB retornar false
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Se responde com sucesso
    res.json({ message: 'Usuário atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};