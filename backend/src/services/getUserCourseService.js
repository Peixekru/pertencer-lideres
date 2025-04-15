import pool from '../config/database.js';

export const getUserCourseFromDB = async (userCourseId) => {
  const conn = await pool.getConnection();
  try {
    // 1. Busca user_course e course data
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

    // 2. Busca unidades
    const [units] = await conn.query(
      `SELECT id, course_id, title, image_url, progress FROM units WHERE course_id = ? ORDER BY order_index ASC`,
      [userCourse.course_id]
    );

    // 3. Busca lições para cada unidade
    for (const unit of units) {
      const [lessons] = await conn.query(
        `SELECT id, unit_id, title, image_url, duration, content_url, rating, is_completed FROM lessons WHERE unit_id = ? ORDER BY order_index ASC`,
        [unit.id]
      );
      unit.lessons = lessons;
    }

    // 4. Busca os widgets associados ao user_course
    const [widgets] = await conn.query(
      `SELECT id, config FROM user_course_widgets WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 5. Busca os badges associados ao user_course
    const [badges] = await conn.query(
      `SELECT id, config FROM user_course_badges WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 6. Busca os settings associados ao user_course
    const [settings] = await conn.query(
      `SELECT id, config FROM user_course_settings WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 7. Busca os accessibilitys associados ao user_course
    const [accessibility] = await conn.query(
      `SELECT id, config FROM user_course_accessibility WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 8. Busca as fotos da galeria associadas ao user_course
    const [gallery] = await conn.query(
      `SELECT id, thumb_url, image_url, is_public FROM user_course_gallery WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 8. Busca as capsulas do tempo associadas ao user_course
    const [time_capsule] = await conn.query(
      `SELECT id, start_date, send_date, email_adress, style, message FROM user_course_time_capsule WHERE user_course_id = ?`,
      [userCourseId]
    );

    // 10. Busca a configuração do AI Chat associada ao user_course
    const [ai_chat] = await conn.query(
      `SELECT id, welcome_message, avatar_image_url, ai_model_name FROM user_course_ai_chat WHERE user_course_id = ? AND is_template = 0`,
      [userCourseId]
    );


    // 9. Monta o objeto final
    return { ...userCourse, units, widgets, badges, settings, accessibility, gallery, time_capsule, ai_chat };

  } finally {
    conn.release();
  }
};