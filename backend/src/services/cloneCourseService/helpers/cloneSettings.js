// Função para clonar as configurações de um curso template
export const cloneSettings = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações do template no banco de dados
  const [settingsToClone] = await conn.query(
    `SELECT id as template_settings_id, config 
    FROM user_course_settings 
    WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Para cada configuração encontrada
  for (const settings of settingsToClone) {
    // Verifica se a configuração é válida (objeto não nulo)
    if (!settings.config || typeof settings.config !== 'object') continue;

    // Insere a configuração clonada na tabela
    await conn.query(
      `INSERT INTO user_course_settings (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
      [
        newUserCourseId,                  // ID do novo curso
        JSON.stringify(settings.config),  // Configuração serializada
        sourceTemplateUserCourseId        // ID do curso template
      ]
    );
  }
};