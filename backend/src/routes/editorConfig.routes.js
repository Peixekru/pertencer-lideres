import { Router } from "express";

import {
  getSpaceConfig,
  updateSpaceConfig,
} from "../controllers/editorConfig.controller.js";
import { resetSpaceSettings } from "../controllers/editorConfig.controller.js";

import {
  getCourseConfig,
  updateCourseConfig,
} from "../controllers/editorConfig.controller.js";
import { resetCourseConfig } from "../controllers/editorConfig.controller.js";

import {
  getUnits,
  updateUnits,
  resetUnits,
} from "../controllers/editorConfig.controller.js";

import { uploadImage } from "../controllers/editorConfig.controller.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" }); // salva em /uploads temporariamente

router.get("/space", getSpaceConfig);
router.put("/space", updateSpaceConfig);
router.post("/space/reset", resetSpaceSettings);

router.get("/course", getCourseConfig);
router.put("/course", updateCourseConfig);
router.post("/course/reset", resetCourseConfig);

router.get("/unit", getUnits);
router.put("/unit", updateUnits);
router.post("/unit/reset", resetUnits);

router.post("/uploads", upload.single("file"), uploadImage);

export default router;
