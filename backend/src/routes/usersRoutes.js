import express from 'express';
import {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/usersController.js';

const router = express.Router();

router.post('/users', createUser);         // Cadastro
router.get('/users', listUsers);           // Listagem
router.get('/users/:id', getUser);         // Buscar por ID
router.put('/users/:id', updateUser);      // Atualizar
router.delete('/users/:id', deleteUser);   // Deletar

export default router;
