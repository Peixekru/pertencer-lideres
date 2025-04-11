import bcrypt from 'bcryptjs';
import { findUserByLogin } from '../services/findUserService.js';
import { updateUserByIdInDB } from '../services/updateUserByIdService.js';

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }

  try {
    const existingUser = await findUserByLogin(login);
    if (existingUser && existingUser.id !== Number(id)) {
      return res.status(400).json({ message: 'Login já está em uso por outro usuário' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const success = await updateUserByIdInDB(id, login, hashedPassword);
    if (!success) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};