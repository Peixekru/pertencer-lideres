import { getUserByIdFromDb } from '../services/getUserByIdService.js';

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserByIdFromDb(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};