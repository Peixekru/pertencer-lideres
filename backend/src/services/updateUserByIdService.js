import pool from '../config/database.js';

export const updateUserByIdInDB = async (id, login, password) => {
  const [result] = await pool.query(
    'UPDATE users SET login = ?, password = ? WHERE id = ?',
    [login, password, id]
  );
  return result.affectedRows > 0;
};