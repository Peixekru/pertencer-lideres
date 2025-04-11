import pool from '../config/database.js';

export const getAllUsersFromDb = async () => {
  const [rows] = await pool.query('SELECT id, login, created_at FROM users');
  return rows;
};