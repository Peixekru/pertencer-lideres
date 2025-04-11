import { saveUserCourseImageToDB } from '../services/uploadImageService.js';

export const uploadUserCourseImage = async (req, res) => {
  const { userCourseId } = req.params;

  // As URLs da imagem redimensionada e do thumbnail estarão disponíveis em req
  if (!req.resizedImageUrl || !req.thumbnailUrl) {
    return res.status(500).json({ message: 'Erro ao processar a imagem.' });
  }

  const { resizedImageUrl, thumbnailUrl } = req;

  try {
    const result = await saveUserCourseImageToDB(userCourseId, resizedImageUrl, thumbnailUrl);
    res.status(201).json({
      message: 'Imagem enviada e processada com sucesso!',
      imageUrl: resizedImageUrl,
      thumbnailUrl: thumbnailUrl,
      galleryId: result.galleryId
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar informações da imagem.' });
  }
};