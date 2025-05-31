import express from "express";
import { getCourseByUserCourseIdController } from "../controllers/getCourseByUserCourseIdController.js";
import { getUnitsByUserCourseIdController } from "../controllers/getUnitsByUserCourseIdController.js";
import { getLessonsByUnitIdController } from "../controllers/getLessonsByUnitIdController.js";
import { getSettingsByUserCourseIdController } from "../controllers/getSettingsByUserCourseIdController.js";
import { getProgressByUserCourseController } from "../controllers/getProgressByUserCourseController.js";
import { completeLessonController } from "../controllers/completeLessonController.js";
import { updateSettingsByUserCourseIdController } from "../controllers/putSettingsByUserCourseIdController.js";
import { rateLessonController } from "../controllers/rateLesson.controller.js";

import { verifyLessonsFromUnit } from "../middlewares/verifyLessonsFromUnit.js";
//import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/course/:userCourseId",
  /*authenticateToken,*/
  getCourseByUserCourseIdController
);
router.get(
  "/units/:userCourseId",
  /*authenticateToken,*/ getUnitsByUserCourseIdController
);
router.get(
  "/lessons/:unitId",
  /*authenticateToken,*/ verifyLessonsFromUnit,
  getLessonsByUnitIdController
);
router.get(
  "/settings/:userCourseId",
  /*authenticateToken,*/ getSettingsByUserCourseIdController
);
router.get(
  "/users/:userId/courses/:courseId/progress",
  /*authenticateToken,*/ getProgressByUserCourseController
);
router.post(
  "/lessons/:lessonId/complete",
  /*authenticateToken,*/ completeLessonController
);
router.patch(
  "/lessons/:lessonId/rating",
  /* authenticateToken, */
  rateLessonController
);

router.put(
  "/settings/:userCourseId",
  /*authenticateToken,*/ updateSettingsByUserCourseIdController
);

export default router;
