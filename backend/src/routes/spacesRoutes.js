import express from "express";
import { getSpaceSettingsByName } from "../controllers/getSpaceSettingsByNameController.js";

const router = express.Router();

router.get("/space/:urlParam", getSpaceSettingsByName); // configuraçãose do space

export default router;
