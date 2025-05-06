import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Gera um token de acesso JWT com expiração de 1 hora
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Gera um token de refresh JWT com expiração de 7 dias
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Gera um token de refresh inicial ANTES do usuário ter um ID
// Útil para fluxos de autenticação onde o usuário ainda não está registrado
export const generateInitialRefreshToken = () => {
  // Payload vazio pois o usuário ainda não tem ID
  const payload = {};
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Verifica a validade de um token de refresh
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Atualiza o token de refresh no banco de dados para um usuário específico
export const updateRefreshToken = async (userId, refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
};

// Remove o token de refresh do banco de dados
export const clearRefreshToken = async (refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);
};