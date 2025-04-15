import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// --- NOVA FUNÇÃO ---
// Gera um refresh token inicial ANTES do usuário ter um ID
export const generateInitialRefreshToken = () => {
  // Payload pode ser vazio ou conter outra info se necessário, mas não o userId
  const payload = {};
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
// --- FIM DA NOVA FUNÇÃO ---

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const updateRefreshToken = async (userId, refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
};

export const clearRefreshToken = async (refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);
};