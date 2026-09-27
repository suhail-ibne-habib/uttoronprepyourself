import { Router } from "express";
import { validateId } from "../middleware/auth.middleware.js";
import {
  createQuestion,
  createQuestionsBulk,
  deleteQuestion,
  getQuestion,
  listQuestions,
  updateQuestion,
} from "../controllers/question.controller.js";

const router = Router();

router.get("/", listQuestions);
router.post("/", createQuestion);
router.post("/bulk", createQuestionsBulk);
router.get("/:id", validateId(), getQuestion);
router.patch("/:id", validateId(), updateQuestion);
router.delete("/:id", validateId(), deleteQuestion);

export default router;
