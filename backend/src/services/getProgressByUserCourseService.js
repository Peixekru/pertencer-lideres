import pool from "../config/database.js";

export const getProgressByUserCourse = async (userId, courseId) => {
  const conn = await pool.getConnection();
  try {
    const [units] = await conn.query(
      `SELECT id, title FROM units WHERE course_id = ? ORDER BY order_index ASC`,
      [courseId]
    );

    let totalLessons = 0;
    let completedLessons = 0;

    for (const unit of units) {
      const [lessons] = await conn.query(
        `SELECT l.id, l.title,
                IF(ulp.is_completed IS NULL, 0, ulp.is_completed) AS is_completed
        FROM lessons l
        LEFT JOIN user_lesson_progress ulp
          ON l.id = ulp.lesson_id AND ulp.user_id = ?
        WHERE l.unit_id = ?
        ORDER BY l.order_index ASC`,
        [userId, unit.id]
      );

      const unitTotal = lessons.length;
      const unitCompleted = lessons.filter((l) => l.is_completed).length;

      totalLessons += unitTotal;
      completedLessons += unitCompleted;

      unit.total_lessons = unitTotal;
      unit.completed_lessons = unitCompleted;
      unit.progress = unitTotal
        ? Math.round((unitCompleted / unitTotal) * 100)
        : 0;
      unit.lessons = lessons;
    }

    return {
      course_progress: totalLessons
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      units,
    };
  } finally {
    conn.release();
  }
};
