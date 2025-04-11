import pool from '../config/database.js';

export const getUserByIdFromDb = async (id) => {
  const [rows] = await pool.query('SELECT id, login, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};