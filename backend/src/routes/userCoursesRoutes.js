import express from "express";

import { getUserCourses } from "../controllers/getUserCoursesController.js";
import { getUserCourse } from "../controllers/getUserCourseController.js";
import { uploadUserCourseImage } from "../controllers/uploadImageController.js";

// Midelwares
/*import { authenticateToken } from "../middlewares/authMiddleware.js";*/

import upload from "../middlewares/uploadMiddleware.js";
import resizeImage from "../middlewares/resizeImageMiddleware.js";

const router = express.Router();

router.get(
  "/users/:userId/courses",
  /*authenticateToken,*/
  getUserCourses
); // Listagem de cursos

router.get(
  "/user-courses/:userCourseId/course",
  /*authenticateToken,*/
  getUserCourse
); // Dados de um curso completo

// Upload de imagem
router.post(
  "/user-courses/:userCourseId/gallery/upload",
  /*authenticateToken,*/
  upload.single("image"),
  resizeImage,
  uploadUserCourseImage
);

export default router;
