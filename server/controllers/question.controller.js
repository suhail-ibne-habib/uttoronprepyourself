import { Exam } from "../models/exam.model.js";
import { Subject } from "../models/subject.model.js";
import { Question } from "../models/question.model.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";
import { pick, stringifyExplanation } from "../lib/helpers.js";
import { syncExamStats } from "../lib/syncExamStats.js";
import { ensureStudyLessons } from "../lib/ensureStudyLessons.js";

function splitTopics(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeQuestionInput(payload, fallbacks = {}) {
  const body = pick(payload, [
    "examId",
    "subjectId",
    "questionNo",
    "question",
    "options",
    "answerKey",
    "mark",
    "difficulty",
    "primaryTopics",
    "secondaryTopics",
    "tertiaryTopics",
    "explanation",
    "questionType",
    "language",
    "passage",
    "passageId",
    "source",
    "image",
    "verified",
    "reviewStatus",
    "status",
  ]);

  body.examId = body.examId || fallbacks.examId;
  body.subjectId = body.subjectId || fallbacks.subjectId;

  if (body.primaryTopics !== undefined) body.primaryTopics = splitTopics(body.primaryTopics);
  if (body.secondaryTopics !== undefined) {
    body.secondaryTopics = splitTopics(body.secondaryTopics);
  }
  if (body.tertiaryTopics !== undefined) body.tertiaryTopics = splitTopics(body.tertiaryTopics);

  if (body.explanation !== undefined) {
    body.explanation = stringifyExplanation(body.explanation);
  }

  if (body.source && typeof body.source === "object") {
    body.source = {
      name: body.source.name || null,
      page: body.source.page || null,
      questionNo: body.source.questionNo || null,
    };
  }

  if (body.image && typeof body.image === "object") {
    body.image = {
      url: body.image.url || null,
      publicId: body.image.publicId || null,
    };
  }

  return body;
}

function assertAnswerInOptions(options, answerKey) {
  if (!Array.isArray(options) || !answerKey) return;
  const keys = options.map((option) => option.key);
  if (new Set(keys).size !== keys.length) {
    throw new ApiError(400, "Option keys must be unique");
  }
  if (!keys.includes(answerKey)) {
    throw new ApiError(400, "answerKey must match one of the option keys");
  }
}

function subjectLinkedToExam(subject, examId) {
  return (subject.examIds || []).some((id) => String(id) === String(examId));
}

async function resolveExamAndSubject({ examId, subjectId }) {
  if (!examId || !subjectId) {
    throw new ApiError(400, "Select an exam and a subject");
  }

  const [exam, subject] = await Promise.all([
    Exam.findById(examId),
    Subject.findById(subjectId),
  ]);

  if (!exam) throw new ApiError(404, "Exam not found");
  if (!subject) throw new ApiError(404, "Subject not found");
  if (!subjectLinkedToExam(subject, exam._id)) {
    throw new ApiError(400, "Map this subject to the exam first");
  }

  return { exam, subject };
}

export const listQuestions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.examId) filter.examId = req.query.examId;
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.questionType) filter.questionType = req.query.questionType;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  if (req.query.reviewStatus) filter.reviewStatus = req.query.reviewStatus;

  const questions = await Question.find(filter)
    .populate("examId", "name slug year")
    .populate("subjectId", "name slug")
    .sort({ questionNo: 1 });

  res.json({ success: true, data: questions });
});

export const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id)
    .populate("examId", "name slug year")
    .populate("subjectId", "name slug");
  if (!question) throw new ApiError(404, "Question not found");
  res.json({ success: true, data: question });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const body = normalizeQuestionInput(req.body);
  if (!body.questionNo || !body.question || !body.options || !body.answerKey) {
    throw new ApiError(
      400,
      "questionNo, question, options and answerKey are required",
    );
  }

  assertAnswerInOptions(body.options, body.answerKey);
  const { exam, subject } = await resolveExamAndSubject(body);
  body.examId = exam._id;
  body.subjectId = subject._id;
  body.createdBy = req.user?.id || null;
  body.updatedBy = req.user?.id || null;

  const question = await Question.create(body);
  await ensureStudyLessons({
    subjectId: subject._id,
    primaryTopics: body.primaryTopics,
    secondaryTopics: body.secondaryTopics,
    tertiaryTopics: body.tertiaryTopics,
  });
  await syncExamStats(exam._id);
  res.status(201).json({ success: true, data: question });
});

export const createQuestionsBulk = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body?.questions) ? req.body.questions : null;
  if (!items?.length) {
    throw new ApiError(400, "questions array is required");
  }

  const fallbacks = pick(req.body, ["examId", "subjectId"]);
  const { exam, subject } = await resolveExamAndSubject(fallbacks);
  const created = [];

  for (const item of items) {
    const body = normalizeQuestionInput(item, {
      examId: exam._id,
      subjectId: subject._id,
    });
    body.examId = exam._id;
    body.subjectId = subject._id;
    body.createdBy = req.user?.id || null;
    body.updatedBy = req.user?.id || null;
    assertAnswerInOptions(body.options, body.answerKey);
    created.push(await Question.create(body));
    await ensureStudyLessons({
      subjectId: subject._id,
      primaryTopics: body.primaryTopics,
      secondaryTopics: body.secondaryTopics,
      tertiaryTopics: body.tertiaryTopics,
    });
  }

  await syncExamStats(exam._id);
  res.status(201).json({ success: true, data: created });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const body = normalizeQuestionInput(req.body);
  const current = await Question.findById(req.params.id);
  if (!current) throw new ApiError(404, "Question not found");

  assertAnswerInOptions(
    body.options || current.options,
    body.answerKey || current.answerKey,
  );

  const examId = body.examId || current.examId;
  const subjectId = body.subjectId || current.subjectId;
  if (body.examId || body.subjectId) {
    const { exam, subject } = await resolveExamAndSubject({ examId, subjectId });
    body.examId = exam._id;
    body.subjectId = subject._id;
  }

  body.updatedBy = req.user?.id || null;

  const question = await Question.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  await ensureStudyLessons({
    subjectId: question.subjectId,
    primaryTopics: question.primaryTopics,
    secondaryTopics: question.secondaryTopics,
    tertiaryTopics: question.tertiaryTopics,
  });
  await syncExamStats(question.examId);
  if (String(current.examId) !== String(question.examId)) {
    await syncExamStats(current.examId);
  }
  res.json({ success: true, data: question });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) throw new ApiError(404, "Question not found");
  await syncExamStats(question.examId);
  res.json({ success: true, message: "Question deleted" });
});
