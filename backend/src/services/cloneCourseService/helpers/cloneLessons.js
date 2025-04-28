// Função para clonar lições de unidades de um curso template
export const cloneLessons = async (conn, unitIdMap) => {
  // Itera sobre o mapeamento de IDs de unidades (antigo ID -> novo ID)
  for (const oldUnitId in unitIdMap) {
    const newUnitId = unitIdMap[oldUnitId];

    // Busca todas as lições da unidade template, incluindo todos os campos
    const [lessons] = await conn.query(
      `SELECT 
        title, 
        content_url, 
        order_index, 
        image_url, 
        duration, 
        rating, 
        is_completed,
        content_type,
        active_badge,
        ai_review
      FROM lessons 
      WHERE unit_id = ? ORDER BY order_index ASC, id ASC`,
      [oldUnitId]
    );

    // Para cada lição encontrada na unidade template
    for (const lesson of lessons) {
      // Insere a lição na nova unidade, incluindo todos os campos
      await conn.query(
        `INSERT INTO lessons (
          unit_id,
          title,
          content_url,
          order_index,
          image_url,
          duration,
          rating,
          is_completed,
          content_type,
          active_badge,
          ai_review
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUnitId,                        // ID da nova unidade
          lesson.title,                     // Título da lição
          lesson.content_url,               // URL do conteúdo da lição
          lesson.order_index,               // Índice de ordem da lição
          lesson.image_url,                 // URL da imagem da lição
          lesson.duration,                  // Duração da lição
          lesson.rating,                    // Avaliação da lição
          lesson.is_completed,              // Indica se a lição está concluída
          lesson.content_type,              // Tipo de conteúdo da lição
          lesson.active_badge,              // ID do badge ativo para a lição
          JSON.stringify(lesson.ai_review)  // Dados de revisão da IA (JSON)
        ]
      );
    }
  }
};