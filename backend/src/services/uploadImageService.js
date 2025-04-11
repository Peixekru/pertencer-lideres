import pool from '../config/database.js';

export const saveUserCourseImageToDB = async (userCourseId, imageUrl, thumbnailUrl) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO user_course_gallery (user_course_id, image_url, thumb_url, uploaded_at) VALUES (?, ?, ?, NOW())`,
      [userCourseId, imageUrl, thumbnailUrl]
    );
    conn.release();
    return { galleryId: result.insertId };
  } catch (error) {
    console.error('Erro ao salvar informações da imagem no banco de dados:', error);
    throw error;
  }
};