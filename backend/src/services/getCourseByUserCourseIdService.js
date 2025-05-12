import pool from "../config/database.js";

export const getCourseByUserCourseId = async (userCourseId) => {
  const conn = await pool.getConnection();
  try {
    const [[course]] = await conn.query(
      `SELECT
        c.id,
        c.in_app_tutorial,
        c.title,
        c.subtitle,
        c.background_color_1,
        c.background_color_2,
        c.background_image_url
      FROM courses c
      JOIN user_courses uc ON uc.course_id = c.id
      WHERE uc.id = ?`,
      [userCourseId]
    );
    return course;
  } finally {
    conn.release();
  }
};
