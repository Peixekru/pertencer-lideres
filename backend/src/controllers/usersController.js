// src/controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUserInDB,
  getAllUsers,
  getUserById,
  updateUserInDB,
  deleteUserInDB,
  findUserByLogin
} from '../services/usersService.js';





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

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userId = await createUserInDB(login, hashedPassword, refreshToken, spaceId, role);

    res.status(201).json({
      user: {
        id: userId,
        login,
        spaceId,
        role
      },
      refreshToken
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};






export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

export const updateUser = async (req, res) => {
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

    const success = await updateUserInDB(id, login, hashedPassword);
    if (!success) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteUserInDB(id);
    if (!success) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};
