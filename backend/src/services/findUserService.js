import pool from '../config/database.js';

export const findUserByLogin = async (login) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
  return rows[0] || null;
};

export const findUserByIdAndToken = async (userId, token) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND refresh_token = ?', [userId, token]);
  return rows[0] || null;
};