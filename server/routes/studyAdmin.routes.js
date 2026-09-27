import { Router } from "express";
import { validateId } from "../middleware/auth.middleware.js";
import {
  createStudyTopic,
  deleteStudyTopic,
  getStudyTopicAdmin,
  listStudyTopicsAdmin,
  updateStudyTopic,
} from "../controllers/study.controller.js";

const router = Router();

router.get("/", listStudyTopicsAdmin);
router.post("/", createStudyTopic);
router.get("/:id", validateId(), getStudyTopicAdmin);
router.patch("/:id", validateId(), updateStudyTopic);
router.delete("/:id", validateId(), deleteStudyTopic);

export default router;
