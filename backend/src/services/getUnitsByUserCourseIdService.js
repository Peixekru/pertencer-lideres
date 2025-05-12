import pool from "../config/database.js";

export const getUnitsByUserCourseId = async (userCourseId) => {
  const conn = await pool.getConnection();
  try {
    const [[{ course_id }]] = await conn.query(
      "SELECT course_id FROM user_courses WHERE id = ?",
      [userCourseId]
    );

    const [units] = await conn.query(
      `SELECT
        id,
        course_id,
        ai_review,
        title,
        image_url,
        order_index
      FROM units
      WHERE course_id = ?
      ORDER BY order_index ASC`,
      [course_id]
    );

    return units;
  } finally {
    conn.release();
  }
};
