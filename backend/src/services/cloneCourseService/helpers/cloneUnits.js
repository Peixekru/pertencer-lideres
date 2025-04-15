// Função para clonar unidades de um curso template
export const cloneUnits = async (conn, templateCourseId, newCourseId) => {
  // Busca todas as unidades do curso template
  const [units] = await conn.query(
    `SELECT id, title, order_index, image_url, progress 
    FROM units 
    WHERE course_id = ? ORDER BY order_index ASC, id ASC`,
    [templateCourseId]
  );

  // Mapa para armazenar relação entre IDs antigos e novos
  const unitIdMap = {};

  // Para cada unidade encontrada
  for (const unit of units) {
    // Insere a unidade no novo curso
    const [unitResult] = await conn.query(
      `INSERT INTO units (
        course_id,
        title,
        order_index,
        image_url,
        progress
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        newCourseId,        // ID do novo curso
        unit.title,         // Título da unidade
        unit.order_index,   // Índice de ordem
        unit.image_url,     // URL da imagem
        unit.progress       // Progresso da unidade
      ]
    );

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
