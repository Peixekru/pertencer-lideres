// Função para clonar badges de um curso template para um novo curso
export const cloneBadges = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca todos os badges do curso template, incluindo todos os campos
  const [badgesToClone] = await conn.query(
    `SELECT 
      config, 
      is_template, 
      template_user_course_id
    FROM user_course_badges 
    WHERE user_course_id = ?`,
    [sourceTemplateUserCourseId]
  );

  // Itera sobre cada badge encontrado
  for (const badge of badgesToClone) {
    // Insere o badge clonado na tabela de badges, incluindo todos os campos
    await conn.query(
      `INSERT INTO user_course_badges (
        user_course_id,  
        config, 
        is_template, 
        template_user_course_id,
        updated_at
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        newUserCourseId,                 // ID do novo curso do usuário
        JSON.stringify(badge.config),    // Configuração do badge (já é JSON)
        0,                               // is_template para o novo badge é 0
        badge.template_user_course_id,   // ID do curso template original (pode ser nulo)
        new Date()                       // Data e hora da clonagem
      ]
    );
  }
};