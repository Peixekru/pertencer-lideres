// Função para clonar badges de um curso template para um novo curso
export const cloneBadges = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca todos os badges do curso template que devem ser clonados
  const [badgesToClone] = await conn.query(
    `SELECT id as template_badge_id, config 
      FROM user_course_badges 
      WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Itera sobre cada badge encontrado
  for (const badge of badgesToClone) {
    // Verifica se a configuração do badge é válida (objeto não nulo)
    if (!badge.config || typeof badge.config !== 'object') continue;

    // Insere o badge clonado na tabela de badges
    await conn.query(
      `INSERT INTO user_course_badges (
        user_course_id,  
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
      [
        newUserCourseId,                // ID do novo curso do usuário
        JSON.stringify(badge.config),   // Configuração do badge serializada
        sourceTemplateUserCourseId      // ID do curso template original
      ]
    );
  }
};