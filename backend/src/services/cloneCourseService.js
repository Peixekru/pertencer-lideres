export const cloneCourseHierarchy = async (conn, templateCourseId, templateUserCourseId, userId, spaceId) => {
  // 1. Clona o curso base
  const [courseRows] = await conn.query(
    'SELECT title, subtitle, version FROM courses WHERE id = ?',
    [templateCourseId]
  );

  if (!courseRows.length) {
    throw new Error(`Curso template com ID ${templateCourseId} não encontrado.`);
  }

  const templateCourse = courseRows[0];

  const [insertCourseResult] = await conn.query(
    `
    INSERT INTO courses (title, subtitle, version, is_template, template_course_id, space_id, created_at)
    VALUES (?, ?, ?, 0, ?, ?, NOW())
    `,
    [templateCourse.title, templateCourse.subtitle, templateCourse.version, templateCourseId, spaceId]
  );

  const newCourseId = insertCourseResult.insertId;

  // 2. Clona as unidades do curso
  const [units] = await conn.query(
    'SELECT id, title, order_index, image_url, progress FROM units WHERE course_id = ?',
    [templateCourseId]
  );

  const unitIdMap = {}; // Mapeia unidades antigas → novas

  for (const unit of units) {
    const [unitResult] = await conn.query(
      'INSERT INTO units (course_id, title, order_index, image_url, progress) VALUES (?, ?, ?, ?, ?)',
      [newCourseId, unit.title, unit.order_index, unit.image_url, unit.progress]
    );

    unitIdMap[unit.id] = unitResult.insertId;
  }

  // 3. Clona as lições de cada unidade
  for (const oldUnitId of Object.keys(unitIdMap)) {
    const [lessons] = await conn.query(
      'SELECT title, content_url, order_index FROM lessons WHERE unit_id = ?',
      [oldUnitId]
    );

    for (const lesson of lessons) {
      await conn.query(
        'INSERT INTO lessons (unit_id, title, content_url, order_index) VALUES (?, ?, ?, ?)',
        [unitIdMap[oldUnitId], lesson.title, lesson.content_url, lesson.order_index]
      );
    }
  }

  // 4. Cria o vínculo do usuário com o curso clonado
  const [userCourseResult] = await conn.query(
    `
    INSERT INTO user_courses (user_id, course_id, current_version)
    VALUES (?, ?, ?)
    `,
    [userId, newCourseId, templateCourse.version]
  );

  const newUserCourseId = userCourseResult.insertId;

  // 5. Clona os widgets do user_course (baseado no template_user_course_id)
  const [widgets] = await conn.query(
    `
    SELECT config
    FROM user_course_widgets
    WHERE is_template = 1 AND template_user_course_id = ?
    `,
    [templateUserCourseId]
  );

  for (const widget of widgets) {
    await conn.query(
      `
      INSERT INTO user_course_widgets (user_course_id, config, is_template, template_user_course_id)
      VALUES (?, ?, 0, ?)
      `,
      [newUserCourseId, widget.config, templateUserCourseId]
    );
  }

  console.log('Curso clonado com sucesso e vinculado ao usuário');
  return newUserCourseId;
};
