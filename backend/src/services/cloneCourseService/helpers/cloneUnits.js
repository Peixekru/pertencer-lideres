export const cloneUnits = async (conn, templateCourseId, newCourseId) => {
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
};