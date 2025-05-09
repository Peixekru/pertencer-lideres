import express from "express";
import { getCourseByUserCourseIdController } from "../controllers/getCourseByUserCourseIdController.js";
import { getUnitsByUserCourseIdController } from "../controllers/getUnitsByUserCourseIdController.js";
import { getLessonsByUnitIdController } from "../controllers/getLessonsByUnitIdController.js";
import { getSettingsByUserCourseIdController } from "../controllers/getSettingsByUserCourseIdController.js";
import { updateSettingsByUserCourseIdController } from "../controllers/putSettingsByUserCourseIdController.js";
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
  /*authenticateToken,*/ getLessonsByUnitIdController
);
router.get(
  "/settings/:userCourseId",
  /*authenticateToken,*/ getSettingsByUserCourseIdController
);
router.put(
  "/settings/:userCourseId",
  /*authenticateToken,*/ updateSettingsByUserCourseIdController
);

export default router;
