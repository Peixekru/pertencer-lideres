import app from './src/app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('🛑 Servidor encerrado');
        process.exit(0);
    });
});
