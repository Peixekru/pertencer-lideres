import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import corsConfig from './middlewares/corsConfigMiddleware.js';
// Routes
import authRoutes from './routes/authRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import userCoursesRoutes from './routes/userCoursesRoutes.js';

// Inicializa o Express
const app = express();

// Middlewares
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

// Caminho para a pasta 'dist' gerada pelo Vite
const frontendDistPath = path.join(process.cwd(), '../frontend/dist');

// Rotas da API
app.use('/api', statusRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', userCoursesRoutes);

// Servindo arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Servindo os arquivos estáticos da build do Vue
app.use(express.static(frontendDistPath));

// Captura todas as outras rotas (SPA), mas ignora /api e /uploads pra não interferir nas rotas do backend
app.get('*', (req, res, next) => {
  (req.path.startsWith('/api') || req.path.startsWith('/uploads'))
    ? next()
    : res.sendFile(path.join(frontendDistPath, 'index.html'));
});

export default app;
