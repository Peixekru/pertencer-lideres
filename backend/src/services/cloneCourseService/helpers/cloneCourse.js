// Clona um curso template
export const cloneCourse = async (conn, templateCourseId, spaceId) => {
  // Buscar dados do curso template original
  const [courseRows] = await conn.query(
    `SELECT title, subtitle, version 
    FROM courses
    WHERE id = ? AND is_template = 1`,
    [templateCourseId]
  );
  // Verifica se encontrou o curso template
  if (!courseRows || courseRows.length === 0) {
    throw new Error(`Curso template com ID ${templateCourseId} não encontrado.`);
  }
  const templateCourse = courseRows[0];

  // Criar o novo curso (clone) na tabela 'courses'
  const [insertCourseResult] = await conn.query(
    `INSERT INTO courses (
      title,
      subtitle,
      version,
      is_template,
      template_course_id,
      space_id,
      created_at
    ) VALUES (?, ?, ?, 0, ?, ?, NOW())`,
    [
      templateCourse.title,       // Título do novo curso
      templateCourse.subtitle,    // Subtítulo do novo curso
      templateCourse.version,     // Versão do novo curso
      templateCourseId,           // ID do curso template original
      spaceId                     // ID do espaço / agrupador
    ]
  );
  // Obtém e valida o ID do novo curso criado
  const newCourseId = insertCourseResult.insertId;
  if (!newCourseId) {
    throw new Error("Falha ao inserir novo curso.");
  }

  // Retorna o ID do novo curso e os dados do template
  return { newCourseId, templateCourse };
};