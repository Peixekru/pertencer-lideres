import express from 'express';
import { getUserCoursesController, getUserCourseFullController } from '../controllers/userCoursesController.js';

const router = express.Router();

router.get('/users/:userId/courses', getUserCoursesController);
router.get('/user-courses/:userCourseId/full', getUserCourseFullController);

export default router;
