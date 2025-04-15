export const cloneBadges = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [badgesToClone] = await conn.query(
        `SELECT id as template_badge_id, config 
     FROM user_course_badges 
     WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
    );

    for (const badge of badgesToClone) {
        if (!badge.config || typeof badge.config !== 'object') continue;

        await conn.query(
            `INSERT INTO user_course_badges (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
            [
                newUserCourseId,
                JSON.stringify(badge.config),
                sourceTemplateUserCourseId
            ]
        );
    }
};