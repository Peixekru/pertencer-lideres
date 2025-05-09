import pool from "../config/database.js";

export const updateSettingsByUserCourseId = async (userCourseId, newConfig) => {
  const conn = await pool.getConnection();
  try {
    const [[{ config: currentConfig }]] = await conn.query(
      "SELECT config FROM user_course_settings WHERE user_course_id = ?",
      [userCourseId]
    );

    const current =
      typeof currentConfig === "string"
        ? JSON.parse(currentConfig)
        : currentConfig;
    const mergedConfig = { ...current, ...newConfig };

    await conn.query(
      "UPDATE user_course_settings SET config = ? WHERE user_course_id = ?",
      [JSON.stringify(mergedConfig), userCourseId]
    );

    return mergedConfig;
  } finally {
    conn.release();
  }
};
