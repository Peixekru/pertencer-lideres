import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());

// Conexão com MySQL (mantida conforme solicitado)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint de verificação melhorado
app.get('/api/check', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.status(200).json({ 
            status: 'OK',
            database: rows[0].result === 2 ? 'CONNECTED' : 'ERROR'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed'
        });
    }
});

app.get('/api/cards', async (req, res) => {
    try {
        const [cards] = await pool.query('SELECT id, title, content FROM card');
        
        res.status(200).json(cards);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Falha na conexão com o banco de dados'
        });
    }
});

// Iniciar servidor com desligamento gracioso
const server = app.listen(3000, () => {
    console.log(`Backend rodando em http://localhost:3000`);
});

process.on('SIGINT', () => {
    pool.end();
    server.close(() => {
        console.log('Conexões do banco e servidor encerradas');
        process.exit(0);
    });
});