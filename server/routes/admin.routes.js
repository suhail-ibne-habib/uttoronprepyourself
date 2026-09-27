import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";
import { getAdminMe } from "../controllers/admin.controller.js";
import examRoutes from "./exam.routes.js";
import subjectRoutes from "./subject.routes.js";
import questionRoutes from "./question.routes.js";
import studyAdminRoutes from "./studyAdmin.routes.js";
import { suggestTopics } from "../controllers/study.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/me", getAdminMe);
router.get("/topic-suggest", suggestTopics);
router.use("/exams", examRoutes);
router.use("/subjects", subjectRoutes);
router.use("/questions", questionRoutes);
router.use("/study-topics", studyAdminRoutes);

export default router;
