import { Exam } from "../models/exam.model.js";
import { Question } from "../models/question.model.js";
import { Subject } from "../models/subject.model.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";
import { pick, examSlug } from "../lib/helpers.js";

const examFields = [
  "name",
  "examType",
  "examNumber",
  "year",
  "level",
  "description",
  "duration",
  "negativeMarking",
  "status",
];

export const listExams = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.examType) filter.examType = req.query.examType;
  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.slug) filter.slug = req.query.slug;

  const exams = await Exam.find(filter).sort({ year: -1, createdAt: -1 });
  res.json({ success: true, data: exams });
});

export const getExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) throw new ApiError(404, "Exam not found");
  res.json({ success: true, data: exam });
});

export const createExam = asyncHandler(async (req, res) => {
  const body = pick(req.body, examFields);

  if (!body.name || !body.examType || !body.year) {
    throw new ApiError(400, "name, examType and year are required");
  }

  body.slug = examSlug(body);
  if (!body.slug) throw new ApiError(400, "Could not build a slug from exam type and level");
  const exam = await Exam.create(body);
  res.status(201).json({ success: true, data: exam });
});

export const updateExam = asyncHandler(async (req, res) => {
  const body = pick(req.body, examFields);

  const current = await Exam.findById(req.params.id);
  if (!current) throw new ApiError(404, "Exam not found");

  const nextExam = { ...current.toObject(), ...body };
  body.slug = examSlug(nextExam);

  const exam = await Exam.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: exam });
});

export const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findByIdAndDelete(req.params.id);
  if (!exam) throw new ApiError(404, "Exam not found");

  await Promise.all([
    Question.deleteMany({ examId: exam._id }),
    Subject.updateMany({ examIds: exam._id }, { $pull: { examIds: exam._id } }),
  ]);

  res.json({ success: true, message: "Exam deleted" });
});
