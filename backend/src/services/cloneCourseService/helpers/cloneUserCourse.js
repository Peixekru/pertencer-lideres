// Função para criar a relação entre usuário e curso
export const cloneUserCourse = async (conn, userId, newCourseId, version) => {
  // Insere o registro vinculando o usuário ao novo curso, incluindo todos os campos
  const [userCourseResult] = await conn.query(
    `INSERT INTO user_courses (
      user_id,
      course_id,
      current_version,
      joined_at
    ) VALUES (?, ?, ?, ?)`,
    [
      userId,         // ID do usuário
      newCourseId,    // ID do novo curso
      version,         // Versão do curso
      new Date()       // Data e hora de quando o usuário se juntou ao curso (agora)
    ]
  );

  // Obtém o ID do novo registro criado
  const newUserCourseId = userCourseResult.insertId;

  // Verifica se a inserção foi bem-sucedida
  if (!newUserCourseId) {
    throw new Error("Falha ao inserir registro em user_courses.");
  }

  // Retorna o ID da nova relação usuário-curso
  return newUserCourseId;
};