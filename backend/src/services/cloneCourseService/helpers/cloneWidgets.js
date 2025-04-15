// Função para clonar widgets de um curso template
export const cloneWidgets = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca todos os widgets configurados no curso template
  const [widgetsToClone] = await conn.query(
    `SELECT id as template_widget_id, config 
    FROM user_course_widgets 
    WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Para cada widget encontrado no template
  for (const widget of widgetsToClone) {
    // Verifica se a configuração do widget é válida
    if (!widget.config || typeof widget.config !== 'object') continue;

    // Insere o widget clonado na tabela de widgets
    await conn.query(
      `INSERT INTO user_course_widgets (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
      [
        newUserCourseId,                  // ID do novo curso do usuário
        JSON.stringify(widget.config),    // Configuração do widget serializada
        sourceTemplateUserCourseId        // ID do curso template original
      ]
    );
  }
};