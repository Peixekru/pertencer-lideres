import pool from "../config/database.js";

export const completeLesson = async (userId, lessonId) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, completed_at)
      VALUES (?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW(), updated_at = NOW()`,
      [userId, lessonId]
    );
    return { success: true, lessonId };
  } finally {
    conn.release();
  }
};
