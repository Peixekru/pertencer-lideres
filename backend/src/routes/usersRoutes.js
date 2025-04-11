import express from 'express';
import { deleteUserById } from '../controllers/deleteUsersController.js';

import { createUser } from '../controllers/createUserController.js';
import { getAllUsers } from '../controllers/getAllUsersController.js';
import { getUserById } from '../controllers/getUserByIdController.js';
import { updateUserById } from '../controllers/updateUserByIdController.js';

const router = express.Router();

router.post('/users', createUser);               // Cadastro
router.get('/users', getAllUsers);               // Listagem
router.get('/users/:id', getUserById);           // Buscar por ID
router.put('/users/:id', updateUserById);        // Atualizar
router.delete('/users/:id', deleteUserById);     // Deletar

export default router;
