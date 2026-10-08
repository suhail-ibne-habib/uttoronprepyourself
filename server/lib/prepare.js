import connectDB from "../db/index.js";
import { initAuth } from "./auth.js";
import { seedAdmin } from "./seedAdmin.js";
import { seedStudyTopics } from "./seedStudyTopics.js";
import { migrateOffExamSubjects } from "./migrateExamSubjects.js";
import { Question } from "../models/question.model.js";
import { Subject } from "../models/subject.model.js";
import { StudyTopic } from "../models/studyTopic.model.js";

let pending;

export function prepare() {
  if (!pending) {
    pending = (async () => {
      await connectDB();
      initAuth();
      if (process.env.VERCEL) return;

      await migrateOffExamSubjects();
      await Promise.all([
        Question.syncIndexes(),
        Subject.syncIndexes(),
        StudyTopic.syncIndexes(),
      ]);
      await seedAdmin();
      await seedStudyTopics();
    })();
  }
  return pending;
}
