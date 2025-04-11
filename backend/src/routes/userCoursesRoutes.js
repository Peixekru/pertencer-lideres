import express from 'express';
import { getUserCourse } from '../controllers/getUserCourseController.js';
import { getUserCourses } from '../controllers/getUserCoursesController.js';

import { uploadUserCourseImage } from '../controllers/uploadImageController.js'; // Importe o novo controller
import upload from '../middlewares/uploadMiddleware.js'; // Importe o middleware de 
import resizeImage from '../middlewares/resizeImageMiddleware.js'; // O novo middleware de redimensionamento


const router = express.Router();

router.get('/users/:userId/courses', getUserCourses);               // Listagem de cursos
router.get('/user-courses/:userCourseId/course', getUserCourse);    // Dados de um curso

// Nova rota para o upload de imagem
router.post('/user-courses/:userCourseId/gallery/upload', upload.single('image'), resizeImage, uploadUserCourseImage);

export default router;
