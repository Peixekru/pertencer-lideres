// Função para clonar a galeria de imagens de um curso template para um novo curso
export const cloneGallery = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
  // Busca todas as imagens da galeria do curso template, incluindo todos os campos
  const [galleryToClone] = await conn.query(
    `SELECT 
      thumb_url, 
      image_url, 
      is_public,
      uploaded_at,
      template_user_course_id
    FROM user_course_gallery 
    WHERE user_course_id = ?`,
    [sourceTemplateUserCourseId]
  );

  // Para cada imagem encontrada na galeria template
  for (const image of galleryToClone) {
    // Insere uma nova entrada na galeria do novo curso
    await conn.query(
      `INSERT INTO user_course_gallery (
        user_course_id, 
        thumb_url, 
        image_url, 
        is_public, 
        uploaded_at,
        template_user_course_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newUserCourseId,                 // ID do novo curso do usuário
        image.thumb_url,                 // URL da miniatura
        image.image_url,                 // URL da imagem original
        image.is_public,                 // Flag se é pública
        image.uploaded_at,               // Data e hora do upload
        image.template_user_course_id    // ID do curso template original (pode ser nulo)
      ]
    );
  }
};