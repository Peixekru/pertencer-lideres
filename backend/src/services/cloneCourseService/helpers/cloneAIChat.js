// Função para clonar as configurações do chat de IA de um curso template
export const cloneAiChat = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca as configurações do chat de IA do curso template
  const [templateChats] = await conn.query(
    `SELECT welcome_message, avatar_image_url, prompt_instructions, ai_model_name 
      FROM user_course_ai_chat 
      WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  // Para cada configuração de chat encontrada
  for (const templateChat of templateChats) {
    // Insere uma nova configuração de chat para o novo curso
    await conn.query(
      `INSERT INTO user_course_ai_chat (
        user_course_id, 
        welcome_message, 
        avatar_image_url, 
        prompt_instructions, 
        ai_model_name, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, ?, ?, ?, 0, ?)`,
      [
        newUserCourseId,                     // ID do novo curso do usuário
        templateChat.welcome_message,        // Mensagem de boas-vindas
        templateChat.avatar_image_url,       // URL do avatar
        templateChat.prompt_instructions,    // Instruções do prompt
        templateChat.ai_model_name,          // Nome do modelo de IA
        sourceTemplateUserCourseId           // ID do curso template original
      ]
    );
  }
};