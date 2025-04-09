import pool from '../config/database.js';
import { cloneCourseHierarchy } from '../services/cloneCourseService.js';

// Buscar usuário por login
export const findUserByLogin = async (login) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
  return rows[0] || null;
};

// Buscar por ID e Refresh Token (usado no auth)
export const findUserByIdAndToken = async (userId, token) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND refresh_token = ?', [userId, token]);
  return rows[0] || null;
};

// Atualizar refresh token
export const updateRefreshToken = async (userId, refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
};

// Limpar refresh token
export const clearRefreshToken = async (refreshToken) => {
  await pool.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);
};






export const createUserInDB = async (login, hashedPassword, refreshToken, spaceId, role) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Cria o usuário
    const [userResult] = await conn.query(
      'INSERT INTO users (login, password, refresh_token, created_at) VALUES (?, ?, ?, NOW())',
      [login, hashedPassword, refreshToken]
    );

    const userId = userResult.insertId;

    // 2. Associa o usuário ao space com a role
    await conn.query(
      'INSERT INTO user_spaces (user_id, space_id, role, joined_at) VALUES (?, ?, ?, NOW())',
      [userId, spaceId, role]
    );

    console.log('Usuário vinculado ao space com sucesso');

    // 3. Busca os cursos templates vinculados ao space e à role
    const [courses] = await conn.query(
      `
      SELECT c.id, c.version
      FROM courses c
      JOIN space_role_course_templates srt ON c.id = srt.course_template_id
      WHERE srt.space_id = ? AND srt.role = ?
      `,
      [spaceId, role]
    );

    // 4. Clona os cursos template (já vincula ao usuário dentro da função)
    for (const course of courses) {
      const clonedCourseId = await cloneCourseHierarchy(conn, course.id, userId, userId, spaceId);

      if (!clonedCourseId) {
        throw new Error(`Falha ao clonar o curso template com id ${course.id}`);
      }

      console.log('Curso clonado e vinculado ao usuário com sucesso:', {
        userId,
        clonedCourseId,
        version: course.version,
      });
    }

    await conn.commit();
    return userId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};







// Listar todos
export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, login, created_at FROM users');
  return rows;
};

// Buscar por ID
export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, login, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

// Atualizar login e/ou senha
export const updateUserInDB = async (id, login, password) => {
  const [result] = await pool.query(
    'UPDATE users SET login = ?, password = ? WHERE id = ?',
    [login, password, id]
  );
  return result.affectedRows > 0;
};

// Deletar
export const deleteUserInDB = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
