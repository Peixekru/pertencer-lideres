export const cloneCourseHierarchy = async (conn, templateCourseId, userId, spaceId) => {
  try {
    // PASSO 1: Buscar dados do curso template original
    const [courseRows] = await conn.query(
      'SELECT title, subtitle, version FROM courses WHERE id = ? AND is_template = 1',
      [templateCourseId]
    );
    if (!courseRows || courseRows.length === 0) {
      throw new Error(`Curso template com ID ${templateCourseId} não encontrado.`);
    }
    const templateCourse = courseRows[0];

    // PASSO 2: Criar o novo curso (clone) na tabela 'courses'
    const [insertCourseResult] = await conn.query(
      `INSERT INTO courses (title, subtitle, version, is_template, template_course_id, space_id, created_at)
      VALUES (?, ?, ?, 0, ?, ?, NOW())`, // is_template = 0 para o clone
      [templateCourse.title, templateCourse.subtitle, templateCourse.version, templateCourseId, spaceId]
    );
    const newCourseId = insertCourseResult.insertId;
    if (!newCourseId) {
      throw new Error("Falha ao inserir novo curso.");
    }

    // PASSO 3: Clonar as unidades do curso template para o novo curso
    const [units] = await conn.query(
      'SELECT id, title, order_index, image_url, progress FROM units WHERE course_id = ? ORDER BY order_index ASC, id ASC',
      [templateCourseId]
    );

    const unitIdMap = {};
    for (const unit of units) {
      const [unitResult] = await conn.query(
        'INSERT INTO units (course_id, title, order_index, image_url, progress) VALUES (?, ?, ?, ?, ?)',
        [newCourseId, unit.title, unit.order_index, unit.image_url, unit.progress]
      );
      const newUnitId = unitResult.insertId;
      if (!newUnitId) {
        throw new Error(`Falha ao clonar unidade template ID ${unit.id}.`);
      }
      unitIdMap[unit.id] = newUnitId;
    }

    // PASSO 4: Clonar as lições de cada unidade template para as novas unidades
    for (const oldUnitId in unitIdMap) {
      const newUnitId = unitIdMap[oldUnitId];
      const [lessons] = await conn.query(
        'SELECT title, content_url, order_index, image_url, duration, rating, is_completed FROM lessons WHERE unit_id = ? ORDER BY order_index ASC, id ASC',
        [oldUnitId]
      );
      for (const lesson of lessons) {
        await conn.query(
          'INSERT INTO lessons (unit_id, title, content_url, order_index, image_url, duration, rating, is_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [newUnitId, lesson.title, lesson.content_url, lesson.order_index, lesson.image_url, lesson.duration, lesson.rating, lesson.is_completed]
        );
      }
    }

    // PASSO 5: Criar o vínculo do usuário com o curso clonado na tabela 'user_courses'
    const [userCourseResult] = await conn.query(
      `INSERT INTO user_courses (user_id, course_id, current_version) VALUES (?, ?, ?)`,
      [userId, newCourseId, templateCourse.version]
    );
    const newUserCourseId = userCourseResult.insertId;
    if (!newUserCourseId) {
      throw new Error("Falha ao inserir registro em user_courses.");
    }

    // PASSO 6: Identificar a instância 'user_course' do template original
    const [[templateUserCourse]] = await conn.query(
      'SELECT id FROM user_courses WHERE course_id = ? ORDER BY id ASC LIMIT 1',
      [templateCourseId]
    );
    const sourceTemplateUserCourseId = templateUserCourse?.id;

    // PASSO 7: Buscar os widgets associados à instância template
    let widgetsToClone = [];
    if (sourceTemplateUserCourseId) {
      [widgetsToClone] = await conn.query(
        `SELECT id as template_widget_id, config FROM user_course_widgets WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
      );
    }



    // PASSO 6 (antigo PASSO 15): Buscar as fotos da galeria associadas à instância template (SEM is_template)
    let galleryToClone = [];
    if (sourceTemplateUserCourseId) {
      [galleryToClone] = await conn.query(
        `SELECT thumb_url, image_url, is_public
        FROM user_course_gallery
        WHERE user_course_id = ?`,
        [sourceTemplateUserCourseId]
      );
    }

    // PASSO 7 (antigo PASSO 16): Clonar as fotos da galeria para o novo 'user_course' do usuário
    for (const image of galleryToClone) {
      await conn.query(
        `INSERT INTO user_course_gallery (user_course_id, thumb_url, image_url, is_public, template_user_course_id, uploaded_at)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          newUserCourseId,
          image.thumb_url,
          image.image_url,
          image.is_public,
          sourceTemplateUserCourseId
        ]
      );
    }




    // PASSO 8: Clonar os widgets para o novo 'user_course' do usuário
    for (const widget of widgetsToClone) {
      if (!widget.config || typeof widget.config !== 'object') {
        continue;
      }
      await conn.query(
        `INSERT INTO user_course_widgets (user_course_id, config, is_template, template_user_course_id)
        VALUES (?, ?, 0, ?)`,
        [
          newUserCourseId,
          JSON.stringify(widget.config),
          sourceTemplateUserCourseId
        ]
      );
    }

    // PASSO 9: Buscar os badges associados à instância template
    let badgesToClone = [];
    if (sourceTemplateUserCourseId) {
      [badgesToClone] = await conn.query(
        `SELECT id as template_badge_id, config FROM user_course_badges WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
      );
    }

    // PASSO 10: Clonar os badges para o novo 'user_course' do usuário
    for (const badge of badgesToClone) {
      if (!badge.config || typeof badge.config !== 'object') {
        continue;
      }
      await conn.query(
        `INSERT INTO user_course_badges (user_course_id, config, is_template, template_user_course_id)
        VALUES (?, ?, 0, ?)`,
        [
          newUserCourseId,
          JSON.stringify(badge.config),
          sourceTemplateUserCourseId
        ]
      );
    }

    // PASSO 11: Buscar os settings associados à instância template
    let settingsToClone = [];
    if (sourceTemplateUserCourseId) {
      [settingsToClone] = await conn.query(
        `SELECT id as template_settings_id, config FROM user_course_settings WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
      );
    }

    // PASSO 12: Clonar os settings para o novo 'user_course' do usuário
    for (const settings of settingsToClone) {
      if (!settings.config || typeof settings.config !== 'object') {
        continue;
      }
      await conn.query(
        `INSERT INTO user_course_settings (user_course_id, config, is_template, template_user_course_id)
        VALUES (?, ?, 0, ?)`,
        [
          newUserCourseId,
          JSON.stringify(settings.config),
          sourceTemplateUserCourseId
        ]
      );
    }

    // PASSO 13: Buscar os accessibility associados à instância template
    let accessibilityToClone = [];
    if (sourceTemplateUserCourseId) {
      [accessibilityToClone] = await conn.query(
        `SELECT id as template_accessibility_id, config FROM user_course_settings WHERE user_course_id = ? AND is_template = 1`,
        [sourceTemplateUserCourseId]
      );
    }

    // PASSO 14: Clonar os accessibility para o novo 'user_course' do usuário
    for (const accessibility of accessibilityToClone) {
      if (!accessibility.config || typeof accessibility.config !== 'object') {
        continue;
      }
      await conn.query(
        `INSERT INTO user_course_accessibility (user_course_id, config, is_template, template_user_course_id)
        VALUES (?, ?, 0, ?)`,
        [
          newUserCourseId,
          JSON.stringify(accessibility.config),
          sourceTemplateUserCourseId
        ]
      );
    }


    // PASSO 11 (antigo PASSO 9): Retornar o ID da associação usuário-curso criada
    return newUserCourseId;

  } catch (error) {
    console.error("[ERROR cloneCourseService] Erro durante a execução de cloneCourseHierarchy:", error);
    throw error;
  }
};