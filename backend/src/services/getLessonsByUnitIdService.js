// src/services/getLessonsByUnitIdService.js
import pool from "../config/database.js";

export const getLessonsByUnitId = async (unitId) => {
  const conn = await pool.getConnection();
  try {
    const [lessons] = await conn.query(
      `SELECT
        id,
        unit_id,
        title,
        image_url,
        duration,
        content_url,
        rating,
        content_type,
        badge,
        ai_review,
        order_index
      FROM lessons
      WHERE unit_id = ?
      ORDER BY order_index ASC`,
      [unitId]
    );

    return lessons;
  } finally {
    conn.release();
  }
};
