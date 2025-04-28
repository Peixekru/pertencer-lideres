// Função para clonar as configurações de acessibilidade de um curso template
export const cloneAccessibility = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações de acessibilidade do curso template, incluindo todos os campos
  const [accessibilityToClone] = await conn.query(
    `SELECT 
      config
    FROM user_course_accessibility
    WHERE user_course_id = ?`,
    [sourceTemplateUserCourseId]
  );

  // Itera sobre cada configuração encontrada
  for (const accessibility of accessibilityToClone) {
    // Insere a configuração clonada na tabela de acessibilidade
    await conn.query(
      `INSERT INTO user_course_accessibility (
        user_course_id, 
        config
      ) VALUES (?, ?)`,
      [
        newUserCourseId,                        // ID do novo curso do usuário
        JSON.stringify(accessibility.config)    // Configurações de acessibilidade
      ]
    );
  }
};