import { Question } from "../models/question.model.js";
import { Exam } from "../models/exam.model.js";

export async function questionsForExam(examId, questionFilter = {}) {
  const questions = await Question.find({
    examId,
    ...questionFilter,
  }).sort({ questionNo: 1 });

  return { questions };
}

export async function syncExamStats(examId) {
  const { questions } = await questionsForExam(examId, {
    status: { $ne: "archived" },
  });

  await Exam.findByIdAndUpdate(examId, {
    totalQuestions: questions.length,
    totalMarks: questions.reduce((sum, question) => sum + (question.mark || 0), 0),
  });
}
