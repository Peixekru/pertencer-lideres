import { getAllUsersFromDb } from '../services/getAllUsersService.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDb();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};