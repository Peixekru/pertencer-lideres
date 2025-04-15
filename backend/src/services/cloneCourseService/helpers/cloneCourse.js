export const cloneCourse = async (conn, templateCourseId, spaceId) => {
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
    VALUES (?, ?, ?, 0, ?, ?, NOW())`,
        [templateCourse.title, templateCourse.subtitle, templateCourse.version, templateCourseId, spaceId]
    );
    const newCourseId = insertCourseResult.insertId;
    if (!newCourseId) {
        throw new Error("Falha ao inserir novo curso.");
    }

    return { newCourseId, templateCourse };
};