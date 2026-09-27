import { Router } from "express";
import {
  getPublishedExamYears,
  getPublishedPaper,
  listPublishedExams,
  listQuestionBank,
} from "../controllers/public.controller.js";
import studyRoutes from "./study.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Uttoron API is running" });
});

router.get("/question-bank", listQuestionBank);
router.get("/exams", listPublishedExams);
router.get("/exams/:slug", getPublishedExamYears);
router.get("/exams/:slug/:year", getPublishedPaper);
router.use(studyRoutes);

export default router;
