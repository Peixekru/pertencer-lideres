// Clona um curso template incluindo todos os campos necessários
export const cloneCourse = async (conn, templateCourseId, spaceId) => {
  // Buscar dados completos do curso template original
  const [courseRows] = await conn.query(
    `SELECT
      title,
      subtitle,
      version,
      in_app_tutorial,
      background_color_1,
      background_color_2,
      background_image_url
    FROM courses
    WHERE id = ? AND is_template = 1`,
    [templateCourseId]
  );

  if (!courseRows || courseRows.length === 0) {
    throw new Error(
      `Curso template com ID ${templateCourseId} não encontrado.`
    );
  }
  const templateCourse = courseRows[0];

  const query = `
    INSERT INTO courses (
      title,
      subtitle,
      version,
      space_id,
      template_course_id,
      in_app_tutorial,
      background_color_1,
      background_color_2,
      background_image_url,
      is_template,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  const values = [
    templateCourse.title,
    templateCourse.subtitle,
    templateCourse.version,
    spaceId,
    templateCourseId,
    JSON.stringify(templateCourse.in_app_tutorial),
    templateCourse.background_color_1,
    templateCourse.background_color_2,
    templateCourse.background_image_url,
    0, // is_template
  ];

  const [insertCourseResult] = await conn.query(query, values);

  const newCourseId = insertCourseResult.insertId;
  if (!newCourseId) {
    throw new Error("Falha ao inserir novo curso.");
  }

  return { newCourseId, templateCourse };
};
