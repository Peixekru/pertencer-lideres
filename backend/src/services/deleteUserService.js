import pool from '../config/database.js';

export const deleteUserByIdInDB = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};