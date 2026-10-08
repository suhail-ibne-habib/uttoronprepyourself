import { Exam } from "../models/exam.model.js";
import { Subject } from "../models/subject.model.js";
import { Question } from "../models/question.model.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";
import { parseExplanation } from "../lib/helpers.js";
import { tagsForQuestion } from "../lib/studyTree.js";
import { loadTopicDirectory } from "./study.controller.js";

function serializeQuestion(question, subject, directory = [], { hideAnswers = false } = {}) {
  const topicTags = tagsForQuestion(question, subject, directory);
  return {
    id: String(question._id),
    number: question.questionNo,
    topic: question.primaryTopics?.[0] || subject?.name || "",
    topicTags,
    primaryTopics: question.primaryTopics || [],
    secondaryTopics: question.secondaryTopics || [],
    tertiaryTopics: question.tertiaryTopics || [],
    marks: question.mark,
    stem: question.question,
    options: question.options,
    correctKey: hideAnswers ? null : question.answerKey,
    explanation: hideAnswers ? null : parseExplanation(question.explanation),
    difficulty: question.difficulty,
    language: question.language,
    questionType: question.questionType,
    passage: question.passage || null,
    image: question.image?.url || null,
    source: question.source || null,
    subject: subject
      ? { id: String(subject._id), name: subject.name, slug: subject.slug }
      : null,
  };
}

export const listQuestionBank = asyncHandler(async (_req, res) => {
  const papers = await Exam.find({ status: "published" }).sort({
    examType: 1,
    level: 1,
    year: -1,
    name: 1,
  });

  res.json({
    success: true,
    data: {
      examTypes: [...new Set(papers.map((paper) => paper.examType))],
      levels: [...new Set(papers.map((paper) => paper.level))],
      years: [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a),
      exams: papers.map((paper) => ({
        id: String(paper._id),
        name: paper.name,
        slug: paper.slug,
        examType: paper.examType,
        level: paper.level,
        year: paper.year,
        examNumber: paper.examNumber,
        totalQuestions: paper.totalQuestions,
      })),
    },
  });
});

export const listPublishedExams = asyncHandler(async (_req, res) => {
  const papers = await Exam.find({ status: "published" }).sort({
    name: 1,
    year: -1,
  });

  const grouped = new Map();
  for (const paper of papers) {
    const current = grouped.get(paper.slug) || {
      slug: paper.slug,
      name: paper.name,
      examType: paper.examType,
      level: paper.level,
      description: paper.description,
      years: [],
      papers: [],
    };
    current.years.push(paper.year);
    current.papers.push({
      id: paper._id,
      year: paper.year,
      totalQuestions: paper.totalQuestions,
      totalMarks: paper.totalMarks,
      duration: paper.duration,
    });
    grouped.set(paper.slug, current);
  }

  res.json({ success: true, data: [...grouped.values()] });
});

export const getPublishedExamYears = asyncHandler(async (req, res) => {
  const papers = await Exam.find({
    slug: req.params.slug,
    status: "published",
  }).sort({ year: -1 });

  if (!papers.length) throw new ApiError(404, "Exam not found");

  res.json({
    success: true,
    data: {
      slug: papers[0].slug,
      name: papers[0].name,
      examType: papers[0].examType,
      level: papers[0].level,
      description: papers[0].description,
      years: papers.map((paper) => paper.year),
      papers,
    },
  });
});

export const getPublishedPaper = asyncHandler(async (req, res) => {
  const year = Number(req.params.year);
  if (!year) throw new ApiError(400, "Invalid year");

  const exam = await Exam.findOne({
    slug: req.params.slug,
    year,
    status: "published",
  });
  if (!exam) throw new ApiError(404, "Paper not found");

  const subjects = await Subject.find({
    examIds: exam._id,
    status: { $ne: "inactive" },
  }).select("name slug");

  const questions = await Question.find({
    examId: exam._id,
    status: "published",
  })
    .populate("subjectId", "name slug status")
    .sort({ questionNo: 1 });

  const directory = await loadTopicDirectory();
  const hideAnswers = req.query.for === "test";
  const subjectQuery = req.query.subject;
  const filtered = subjectQuery
    ? questions.filter((question) => question.subjectId?.slug === subjectQuery)
    : questions;

  const counts = new Map();
  for (const question of questions) {
    const key = String(question.subjectId?._id || question.subjectId || "");
    const current = counts.get(key) || { totalQuestions: 0, totalMarks: 0 };
    current.totalQuestions += 1;
    current.totalMarks += question.mark || 0;
    counts.set(key, current);
  }

  res.json({
    success: true,
    data: {
      id: exam._id,
      exam: exam.name,
      examSlug: exam.slug,
      year: exam.year,
      examType: exam.examType,
      level: exam.level,
      description: exam.description,
      duration: exam.duration,
      negativeMarking: exam.negativeMarking,
      totalMarks: exam.totalMarks,
      totalQuestions: filtered.length,
      subjects: subjects.map((subject) => {
        const stats = counts.get(String(subject._id)) || {
          totalQuestions: 0,
          totalMarks: 0,
        };
        return {
          id: subject._id,
          name: subject.name,
          slug: subject.slug,
          ...stats,
        };
      }),
      questions: filtered.map((question) =>
        serializeQuestion(question, question.subjectId, directory, { hideAnswers }),
      ),
    },
  });
});

export const submitPaper = asyncHandler(async (req, res) => {
  const year = Number(req.params.year);
  if (!year) throw new ApiError(400, "Invalid year");

  const exam = await Exam.findOne({
    slug: req.params.slug,
    year,
    status: "published",
  });
  if (!exam) throw new ApiError(404, "Paper not found");

  const questions = await Question.find({
    examId: exam._id,
    status: "published",
  })
    .populate("subjectId", "name slug status")
    .sort({ questionNo: 1 });

  const directory = await loadTopicDirectory();
  const answers = req.body?.answers && typeof req.body.answers === "object" ? req.body.answers : {};
  const correctMark = 1;
  const mistakePenalty = 0.25;

  let scored = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const missed = [];

  for (const question of questions) {
    const selectedKey = answers[String(question._id)] || null;
    const isCorrect = Boolean(selectedKey) && selectedKey === question.answerKey;
    if (!selectedKey) skipped += 1;
    else if (isCorrect) {
      correct += 1;
      scored += correctMark;
    } else {
      wrong += 1;
      scored -= mistakePenalty;
    }

    if (!isCorrect) {
      missed.push({
        ...serializeQuestion(question, question.subjectId, directory),
        selectedKey,
        skipped: !selectedKey,
      });
    }
  }

  const maxMarks = questions.length * correctMark;

  res.json({
    success: true,
    data: {
      exam: exam.name,
      year: exam.year,
      total: questions.length,
      correct,
      wrong,
      skipped,
      scored: Math.round(scored * 100) / 100,
      maxMarks,
      correctMark,
      mistakePenalty,
      missed,
    },
  });
});
