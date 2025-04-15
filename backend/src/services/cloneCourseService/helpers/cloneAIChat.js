export const cloneAiChat = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [templateChats] = await conn.query(
        `SELECT welcome_message, avatar_image_url, prompt_instructions, ai_model_name 
     FROM user_course_ai_chat 
     WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
    );

    for (const templateChat of templateChats) {
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
                newUserCourseId,
                templateChat.welcome_message,
                templateChat.avatar_image_url,
                templateChat.prompt_instructions,
                templateChat.ai_model_name,
                sourceTemplateUserCourseId
            ]
        );
    }
};