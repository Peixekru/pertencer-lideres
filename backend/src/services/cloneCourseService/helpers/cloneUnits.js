// Função para clonar unidades de um curso template com todos os campos
export const cloneUnits = async (conn, templateCourseId, newCourseId) => {
  // Busca todas as unidades do curso template (sem campos removidos)
  const [units] = await conn.query(
    `SELECT
      id,
      title,
      order_index,
      image_url,
      ai_review
    FROM units
    WHERE course_id = ?
    ORDER BY order_index ASC, id ASC`,
    [templateCourseId]
  );

  const unitIdMap = {};

  for (const unit of units) {
    const query = `
      INSERT INTO units (
        course_id,
        title,
        order_index,
        image_url,
        ai_review,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;

    const values = [
      newCourseId,
      unit.title,
      unit.order_index,
      unit.image_url,
      JSON.stringify(unit.ai_review),
    ];

    const [unitResult] = await conn.query(query, values);

    const newUnitId = unitResult.insertId;
    if (!newUnitId) {
      throw new Error(`Falha ao clonar unidade template ID ${unit.id}.`);
    }

    unitIdMap[unit.id] = newUnitId;
  }

  return unitIdMap;
};
