import { Router } from "express";
import {
  getStudySubject,
  getStudyTopic,
  listStudyHome,
} from "../controllers/study.controller.js";

const router = Router();

router.get("/study", listStudyHome);
router.get("/study/:subjectSlug", getStudySubject);
router.get("/study/:subjectSlug/:topicSlug", getStudyTopic);

export default router;
