import { createUserInDB } from '../services/createUserService.js';
import { findUserByLogin } from '../services/findUserService.js';
import { hashPassword } from '../utils/cryptService.js';
import { generateRefreshToken, updateRefreshToken } from '../utils/tokenService.js';

export const createUser = async (req, res) => {
  const { login, password, spaceId, role } = req.body;

  if (!login || !password || !spaceId || !role) {
    return res.status(400).json({ message: 'Login, senha, spaceId e role são obrigatórios' });
  }

  try {
    const existingUser = await findUserByLogin(login);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await hashPassword(password);
    const refreshToken = generateRefreshToken(login);
    const userId = await createUserInDB(login, hashedPassword, refreshToken, spaceId, role);

    await updateRefreshToken(userId, refreshToken);

    res.status(201).json({
      user: { id: userId, login, spaceId, role }, refreshToken
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};