import pool from '../config/database.js';

export const getUserCoursesFromDB = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [courses] = await conn.query(
      `
      SELECT uc.id AS user_course_id, uc.joined_at, uc.current_version,
      c.id AS course_id, c.title, c.subtitle, c.version, c.is_template
      FROM user_courses uc JOIN courses c ON uc.course_id = c.id WHERE uc.user_id = ?
      `,
      [userId]
    );
    return courses;
  } finally {
    conn.release();
  }
};