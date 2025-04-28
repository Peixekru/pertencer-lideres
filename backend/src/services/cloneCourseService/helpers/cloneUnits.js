// Função para clonar unidades de um curso template com todos os campos
export const cloneUnits = async (conn, templateCourseId, newCourseId) => {
  // Busca todas as unidades do curso template com todos os campos
  const [units] = await conn.query(
    `SELECT
      id,
      title,
      order_index,
      image_url,
      progress,
      ai_review,
      is_completed
    FROM units
    WHERE course_id = ?
    ORDER BY order_index ASC, id ASC`,
    [templateCourseId]
  );

  // Mapa para armazenar relação entre IDs antigos e novos
  const unitIdMap = {};

  // Para cada unidade encontrada
  for (const unit of units) {

    const query = `
      INSERT INTO units (
        course_id,
        title,
        order_index,
        image_url,
        progress,
        ai_review,
        is_completed,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [
      newCourseId,
      unit.title,
      unit.order_index,
      unit.image_url,
      unit.progress || 0,
      JSON.stringify(unit.ai_review), // <---- Stringify direto no array
      unit.is_completed || 0,
    ];


    // Insere a unidade no novo curso com todos os campos
    const [unitResult] = await conn.query(query, values);

    // Obtém e valida o ID da nova unidade
    const newUnitId = unitResult.insertId;
    if (!newUnitId) {
      throw new Error(`Falha ao clonar unidade template ID ${unit.id}.`);
    }

    // Armazena o mapeamento de IDs
    unitIdMap[unit.id] = newUnitId;
  }

  // Retorna o mapa de IDs para uso na clonagem das lições
  return unitIdMap;
};