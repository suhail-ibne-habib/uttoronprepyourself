import { Subject } from "../models/subject.model.js";
import { Exam } from "../models/exam.model.js";
import { Question } from "../models/question.model.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";
import { pick, slugify } from "../lib/helpers.js";
import { syncExamStats } from "../lib/syncExamStats.js";

function normalizeExamIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(String).filter(Boolean))];
}

async function assertExams(examIds) {
  const wanted = normalizeExamIds(examIds);
  if (!wanted.length) throw new ApiError(400, "Select at least one exam");
  const found = await Exam.find({ _id: { $in: wanted } }).select("_id");
  if (found.length !== wanted.length) {
    throw new ApiError(400, "One or more selected exams were not found");
  }
  return wanted;
}

async function examsForSubject(examIds) {
  if (!examIds?.length) return [];
  return Exam.find({ _id: { $in: examIds } }).select("name slug year examType level");
}

function serializeSubject(subject, exams) {
  return {
    ...subject.toObject(),
    examIds: (subject.examIds || []).map(String),
    exams: exams || [],
  };
}

export const listSubjects = asyncHandler(async (_req, res) => {
  const subjects = await Subject.find().populate("examIds", "name slug year").sort({ name: 1 });
  res.json({
    success: true,
    data: subjects.map((subject) => ({
      ...subject.toObject(),
      exams: subject.examIds || [],
      examIds: (subject.examIds || []).map((exam) => String(exam._id || exam)),
    })),
  });
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) throw new ApiError(404, "Subject not found");
  const exams = await examsForSubject(subject.examIds);
  res.json({ success: true, data: serializeSubject(subject, exams) });
});

export const createSubject = asyncHandler(async (req, res) => {
  const body = pick(req.body, ["name", "code", "description", "status"]);
  if (!body.name) throw new ApiError(400, "name is required");
  body.slug = slugify(body.name);
  const examIds = await assertExams(req.body.examIds);

  const existing = await Subject.findOne({ slug: body.slug });
  if (existing) {
    existing.examIds = [
      ...new Set([...(existing.examIds || []).map(String), ...examIds]),
    ];
    if (body.code) existing.code = body.code;
    if (body.description) existing.description = body.description;
    if (body.status) existing.status = body.status;
    await existing.save();
    const exams = await examsForSubject(existing.examIds);
    return res.json({
      success: true,
      merged: true,
      data: serializeSubject(existing, exams),
    });
  }

  body.examIds = examIds;
  const subject = await Subject.create(body);
  const exams = await examsForSubject(subject.examIds);
  res.status(201).json({ success: true, data: serializeSubject(subject, exams) });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const body = pick(req.body, ["name", "code", "description", "status"]);
  if (body.name) body.slug = slugify(body.name);

  const current = await Subject.findById(req.params.id);
  if (!current) throw new ApiError(404, "Subject not found");

  if (req.body.examIds !== undefined) {
    const nextIds = await assertExams(req.body.examIds);
    const previous = (current.examIds || []).map(String);
    const removed = previous.filter((id) => !nextIds.includes(id));
    body.examIds = nextIds;

    await Promise.all(
      removed.map(async (examId) => {
        await Question.deleteMany({ examId, subjectId: current._id });
        await syncExamStats(examId);
      }),
    );
  }

  const subject = await Subject.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  const exams = await examsForSubject(subject.examIds);
  res.json({ success: true, data: serializeSubject(subject, exams) });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) throw new ApiError(404, "Subject not found");

  const examIds = (subject.examIds || []).map(String);
  await Question.deleteMany({ subjectId: subject._id });
  await Promise.all(examIds.map((examId) => syncExamStats(examId)));

  res.json({ success: true, message: "Subject deleted" });
});
