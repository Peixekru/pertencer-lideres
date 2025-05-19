export const cloneLessons = async (conn, unitIdMap) => {
  for (const oldUnitId in unitIdMap) {
    const newUnitId = unitIdMap[oldUnitId];

    const [lessons] = await conn.query(
      `SELECT 
        title, 
        content_url, 
        order_index, 
        image_url, 
        duration, 
        rating,
        content_type,
        badge,
        ai_review
      FROM lessons 
      WHERE unit_id = ? ORDER BY order_index ASC, id ASC`,
      [oldUnitId]
    );

    for (const lesson of lessons) {
      await conn.query(
        `INSERT INTO lessons (
          unit_id,
          title,
          content_url,
          order_index,
          image_url,
          duration,
          rating,
          content_type,
          badge,
          ai_review
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUnitId,
          lesson.title,
          lesson.content_url,
          lesson.order_index,
          lesson.image_url,
          lesson.duration,
          lesson.rating,
          lesson.content_type,
          lesson.badge,
          JSON.stringify(lesson.ai_review),
        ]
      );
    }
  }
};
