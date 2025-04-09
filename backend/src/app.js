import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

import userCoursesRoutes from './routes/userCoursesRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', statusRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);

app.use('/api', userCoursesRoutes);

export default app;