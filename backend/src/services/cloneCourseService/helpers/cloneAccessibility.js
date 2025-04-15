// Função para clonar as configurações de acessibilidade de um curso template
export const cloneAccessibility = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações de acessibilidade do curso template
  const [accessibilityToClone] = await conn.query(
    `SELECT id as template_accessibility_id, config
    FROM user_course_settings
    WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Itera sobre cada configuração encontrada
  for (const accessibility of accessibilityToClone) {
    // Verifica se a configuração é válida (objeto não nulo)
    if (!accessibility.config || typeof accessibility.config !== 'object') continue;

    // Insere a configuração clonada na tabela de acessibilidade
    await conn.query(
      `INSERT INTO user_course_accessibility (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
      [
        newUserCourseId,                        // ID do novo curso do usuário
        JSON.stringify(accessibility.config),   // Configuração serializada
        sourceTemplateUserCourseId              // ID do curso template original
      ]
    );
  }
};