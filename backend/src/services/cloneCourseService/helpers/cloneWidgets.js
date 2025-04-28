// Função para clonar widgets de um curso template
export const cloneWidgets = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca todos os widgets configurados no curso template, incluindo todos os campos relevantes
  const [widgetsToClone] = await conn.query(
    `SELECT 
      config, 
      is_template, 
      template_user_course_id
    FROM user_course_widgets 
    WHERE user_course_id = ?`,
    [sourceTemplateUserCourseId]
  );

  // Para cada widget encontrado no template
  for (const widget of widgetsToClone) {
    // Insere o widget clonado na tabela de widgets, incluindo todos os campos
    await conn.query(
      `INSERT INTO user_course_widgets (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id,
        updated_at
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        newUserCourseId,                  // ID do novo curso do usuário
        JSON.stringify(widget.config),    // Configuração do widget (já é JSON)
        0,                                // is_template para o novo widget é 0 (não é template)
        widget.template_user_course_id,   // ID do curso template original (pode ser nulo)
        new Date()                        // Data e hora de quando o widget foi clonado
      ]
    );
  }
};