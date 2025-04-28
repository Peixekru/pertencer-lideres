// Função para clonar as configurações da cápsula do tempo
export const cloneTimeCapsule = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações de Time Capsule do curso template, incluindo todos os campos relevantes
  const [templateCapsules] = await conn.query(
    `SELECT 
      start_date, 
      send_date, 
      email_adress, 
      style, 
      message,
      is_template,
      template_user_course_id
    FROM user_course_time_capsule 
    WHERE user_course_id = ?`,
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
        updated_at,
        is_template,
        template_user_course_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        newUserCourseId,                          // ID do novo curso do usuário
        templateCapsule.start_date,               // Data de início da Time Capsule
        templateCapsule.send_date,                // Data de envio da Time Capsule
        templateCapsule.email_adress,             // Endereço de e-mail da Time Capsule
        templateCapsule.style,                    // Estilo da Time Capsule
        templateCapsule.message,                  // Mensagem da Time Capsule
        new Date(),                               // Data e hora de quando a cápsula foi clonada
        templateCapsule.template_user_course_id   // ID do curso template original (pode ser nulo)
      ]
    );
  }
};