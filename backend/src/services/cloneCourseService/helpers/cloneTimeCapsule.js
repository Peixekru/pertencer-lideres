// Função para clonar as configurações da cápsula do tempo
export const cloneTimeCapsule = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações de Time Capsule do curso template
  const [templateCapsules] = await conn.query(
    `SELECT style, message 
      FROM user_course_time_capsule 
      WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Para cada configuração de Time Capsule encontrada
  for (const templateCapsule of templateCapsules) {
    // Insere uma nova Time Capsule para o novo curso
    await conn.query(
      `INSERT INTO user_course_time_capsule (
        user_course_id, 
        start_date, 
        send_date, 
        email_adress, 
        style, 
        message, 
        is_template
      ) VALUES (?, NULL, NULL, NULL, ?, ?, 0)`,
      [
        newUserCourseId,          // ID do novo curso
        templateCapsule.style,    // Estilo da Time Capsule
        templateCapsule.message   // Mensagem da Time Capsule
      ]
    );
  }
};