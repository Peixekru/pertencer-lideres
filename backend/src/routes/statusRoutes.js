import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/status', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');

        res.status(200).json({
            status: 'OK',
            database: rows[0].result === 2 ? 'CONNECTED' : 'ERROR'
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Falha na conexão com o banco de dados'
        });
    }
});

export default router;
