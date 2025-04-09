import pool from '../config/database.js';

export const getUserCourses = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [courses] = await conn.query(
      `
      SELECT uc.id AS user_course_id, uc.joined_at, uc.current_version,
      c.id AS course_id, c.title, c.subtitle, c.version, c.is_template
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      WHERE uc.user_id = ?
      `,
      [userId]
    );
    return courses;
  } finally {
    conn.release();
  }
};



export const getUserCourseFull = async (userCourseId) => {
  const conn = await pool.getConnection();
  try {
    // 1. Busca o user_course e os dados do curso
    const [[userCourse]] = await conn.query(
      `
      SELECT 
        uc.id AS user_course_id,
        uc.current_version,
        c.id AS course_id,
        c.title,
        c.subtitle,
        c.version,
        c.is_template
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      WHERE uc.id = ?
      `,
      [userCourseId]
    );

    if (!userCourse) return null;

    // 2. Busca as unidades do curso
    const [units] = await conn.query(
      `
      SELECT id, title, course_id
      FROM units
      WHERE course_id = ?
      ORDER BY id ASC
      `,
      [userCourse.course_id]
    );

    // 3. Para cada unidade, busca as lições
    for (const unit of units) {
      const [lessons] = await conn.query(
        `
        SELECT id, title, unit_id, content_url
        FROM lessons
        WHERE unit_id = ?
        ORDER BY id ASC
        `,
        [unit.id]
      );
      unit.lessons = lessons;
    }

    // 4. Busca os widgets associados ao user_course
    const [widgets] = await conn.query(
      `
      SELECT id, config
      FROM user_course_widgets
      WHERE user_course_id = ?
      `,
      [userCourseId]
    );

    return {
      ...userCourse,
      units,
      widgets,
    };
  } finally {
    conn.release();
  }
};