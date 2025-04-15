export const cloneUserCourse = async (conn, userId, newCourseId, version) => {
  const [userCourseResult] = await conn.query(
    `INSERT INTO user_courses (user_id, course_id, current_version) VALUES (?, ?, ?)`,
    [userId, newCourseId, version]
  );

  const newUserCourseId = userCourseResult.insertId;
  if (!newUserCourseId) {
    throw new Error("Falha ao inserir registro em user_courses.");
  }

  return newUserCourseId;
};