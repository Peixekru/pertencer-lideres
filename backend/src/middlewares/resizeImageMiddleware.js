import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Se não houver arquivo, passa para o próximo middleware/handler
  }

  const originalImagePath = req.file.path;
  const originalFilename = req.file.filename;
  const filenameWithoutExtension = path.parse(originalFilename).name;
  const uploadDir = path.join(process.cwd(), 'uploads/gallery');
  const resizedDir = path.join(uploadDir, 'resized');
  const thumbnailDir = path.join(uploadDir, 'thumbnails');

  await fs.mkdir(resizedDir, { recursive: true });
  await fs.mkdir(thumbnailDir, { recursive: true });

  const resizedFilename = `${filenameWithoutExtension}_resized.webp`;
  const thumbnailFilename = `${filenameWithoutExtension}_thumb.webp`;

  const resizedImagePath = path.join(resizedDir, resizedFilename);
  const thumbnailImagePath = path.join(thumbnailDir, thumbnailFilename);

  try {
    await sharp(originalImagePath)
      .resize({ width: 1200 })
      .toFile(resizedImagePath);

    await sharp(originalImagePath)
      .resize({ width: 300, height: 200, fit: 'cover' })
      .toFile(thumbnailImagePath);

    await fs.unlink(originalImagePath); // Limpar o arquivo temporário

    // Adiciona as URLs redimensionada e do thumbnail ao objeto req para uso no controller
    req.resizedImageUrl = `/uploads/gallery/resized/${resizedFilename}`;
    req.thumbnailUrl = `/uploads/gallery/thumbnails/${thumbnailFilename}`;

    next(); // Passa para o próximo middleware ou handler
  } catch (error) {
    console.error('Erro ao processar a imagem:', error);
    return res.status(500).json({ message: 'Erro ao processar a imagem.' });
  }
};

export default resizeImage;