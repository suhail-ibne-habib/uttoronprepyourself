import { Router } from "express";
import { validateId } from "../middleware/auth.middleware.js";
import {
  createExam,
  deleteExam,
  getExam,
  listExams,
  updateExam,
} from "../controllers/exam.controller.js";

const router = Router();

router.get("/", listExams);
router.post("/", createExam);
router.get("/:id", validateId(), getExam);
router.patch("/:id", validateId(), updateExam);
router.delete("/:id", validateId(), deleteExam);

export default router;
