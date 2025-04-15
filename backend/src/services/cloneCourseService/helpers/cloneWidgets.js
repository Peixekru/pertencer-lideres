export const cloneWidgets = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [widgetsToClone] = await conn.query(
        `SELECT id as template_widget_id, config 
     FROM user_course_widgets 
     WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
    );

    for (const widget of widgetsToClone) {
        if (!widget.config || typeof widget.config !== 'object') continue;

        await conn.query(
            `INSERT INTO user_course_widgets (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
            [
                newUserCourseId,
                JSON.stringify(widget.config),
                sourceTemplateUserCourseId
            ]
        );
    }
};