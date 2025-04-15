export const cloneAccessibility = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  const [accessibilityToClone] = await conn.query(
    `SELECT id as template_accessibility_id, config FROM user_course_settings WHERE user_course_id = ? AND is_template = 1`,
    [sourceTemplateUserCourseId]
  );

  for (const accessibility of accessibilityToClone) {
    if (!accessibility.config || typeof accessibility.config !== 'object') continue;

    await conn.query(
      `INSERT INTO user_course_accessibility (
        user_course_id, 
        config, 
        is_template, 
        template_user_course_id
      ) VALUES (?, ?, 0, ?)`,
      [
        newUserCourseId,
        JSON.stringify(accessibility.config),
        sourceTemplateUserCourseId
      ]
    );
  }
};