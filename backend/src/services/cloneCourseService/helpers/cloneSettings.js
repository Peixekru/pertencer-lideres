// Função para clonar as configurações de um curso template
export const cloneSettings = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações do template no banco de dados, incluindo todos os campos relevantes
  const [settingsToClone] = await conn.query(
    `SELECT 
      config, 
      is_template, 
      template_user_course_id
    FROM user_course_settings 
    WHERE user_course_id = ?`,
    [sourceTemplateUserCourseId]
  );

  // Para cada configuração encontrada
  for (const settings of settingsToClone) {
    // Insere a configuração clonada na tabela, incluindo todos os campos
    await conn.query(
      `INSERT INTO user_course_settings (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id,
        updated_at
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        newUserCourseId,                     // ID do novo curso do usuário
        JSON.stringify(settings.config),     // Configuração (já é JSON)
        0,                                   // is_template para a nova configuração é 0
        settings.template_user_course_id,    // ID do curso template original (pode ser nulo)
        new Date()                           // Data e hora da clonagem
      ]
    );
  }
};