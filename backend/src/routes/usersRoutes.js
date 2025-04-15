import express from 'express';

// ---FAZER: deletar os cursos vinculados ao usuário quando ele for removido ---
import { deleteUserById } from '../controllers/deleteUsersController.js';
// ---FAZER: deletar os cursos vinculados ao usuário quando ele for removido ---

import { createUser } from '../controllers/createUserController.js';
import { getAllUsers } from '../controllers/getAllUsersController.js';
import { getUserById } from '../controllers/getUserByIdController.js';
import { updateUserById } from '../controllers/updateUserByIdController.js';
import { bulkCreateUsersController } from '../controllers/bulkCreateUsersController.js';

import uploadCsv from '../middlewares/uploadCsvMiddleware.js';

// (Opcional: Importe seu middleware de autenticação/autorização)
// import { isAdmin } from '../middlewares/authMiddleware.js'; 


const router = express.Router();

router.post('/users', createUser);               // Cadastro
router.get('/users', getAllUsers);               // Listagem
router.get('/users/:id', getUserById);           // Buscar por ID
router.put('/users/:id', updateUserById);        // Atualizar
router.delete('/users/:id', deleteUserById);     // Deletar

// --- Rota Adicionada para Upload em Massa
router.post('/users/bulk-upload', /* Exemplo: isAdmin, */ uploadCsv.single('csvFile'), bulkCreateUsersController);
// --- Fim da Rota Adicionada

export default router;
