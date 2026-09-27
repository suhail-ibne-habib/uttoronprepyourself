import { Router } from "express";
import { validateId } from "../middleware/auth.middleware.js";
import {
  createSubject,
  deleteSubject,
  getSubject,
  listSubjects,
  updateSubject,
} from "../controllers/subject.controller.js";

const router = Router();

router.get("/", listSubjects);
router.post("/", createSubject);
router.get("/:id", validateId(), getSubject);
router.patch("/:id", validateId(), updateSubject);
router.delete("/:id", validateId(), deleteSubject);

export default router;
