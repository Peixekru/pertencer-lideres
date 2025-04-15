export const cloneSettings = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [settingsToClone] = await conn.query(
        `SELECT id as template_settings_id, config 
     FROM user_course_settings 
     WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
    );

    for (const settings of settingsToClone) {
        if (!settings.config || typeof settings.config !== 'object') continue;

        await conn.query(
            `INSERT INTO user_course_settings (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
            [
                newUserCourseId,
                JSON.stringify(settings.config),
                sourceTemplateUserCourseId
            ]
        );
    }
};