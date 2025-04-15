export const cloneTimeCapsule = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [templateCapsules] = await conn.query(
        `SELECT style, message 
     FROM user_course_time_capsule 
     WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
    );

    for (const templateCapsule of templateCapsules) {
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
                newUserCourseId,
                templateCapsule.style,
                templateCapsule.message
            ]
        );
    }
};