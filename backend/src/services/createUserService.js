import pool from '../config/database.js';
import { cloneCourseHierarchy } from './cloneCourseService/cloneCourseService.js';


export const createUserInDB = async (login, hashedPassword, refreshToken, spaceId, role) => {
  let conn;
  try {
    conn = await pool.getConnection();
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

    // 3. Busca os cursos templates vinculados ao space e à role
    const [coursesToClone] = await conn.query(
      `SELECT c.id, c.version FROM courses c JOIN space_role_course_templates srt ON c.id = srt.course_template_id
      WHERE srt.space_id = ? AND srt.role = ? AND c.is_template = 1`, [spaceId, role]
    );

    // 4. Clona os cursos template (se houver)
    if (coursesToClone.length > 0) {
      for (const course of coursesToClone) {
        const newUserCourseId = await cloneCourseHierarchy(conn, course.id, userId, spaceId);
        if (!newUserCourseId) {
          throw new Error(`Falha ao clonar o curso template com id ${course.id}.`);
        }
      }
    }

    await conn.commit();
    return userId;

  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};