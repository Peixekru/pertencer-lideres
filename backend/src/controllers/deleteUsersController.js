import { deleteUserByIdInDB } from '../services/deleteUserService.js';

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteUserByIdInDB(id);
    if (!success) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};
