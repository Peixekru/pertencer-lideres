import pool from "../config/database.js";

export const getSettingsByUserCourseId = async (userCourseId) => {
  const conn = await pool.getConnection();
  try {
    const [[settings]] = await conn.query(
      `SELECT config FROM user_course_settings WHERE user_course_id = ?`,
      [userCourseId]
    );
    return settings?.config || {};
  } finally {
    conn.release();
  }
};
