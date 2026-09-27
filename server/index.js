import "dotenv/config";
import dns from "node:dns";
import connectDB from "./db/connect.js";
import { initAuth } from "./lib/auth.js";
import { seedAdmin } from "./lib/seedAdmin.js";
import { createApp } from "./app.js";
import { Question } from "./models/question.model.js";
import { Subject } from "./models/subject.model.js";
import { migrateOffExamSubjects } from "./lib/migrateExamSubjects.js";
import { seedStudyTopics } from "./lib/seedStudyTopics.js";
import { StudyTopic } from "./models/studyTopic.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const start = async () => {
  try {
    await connectDB();
    await migrateOffExamSubjects();
    await Promise.all([
      Question.syncIndexes(),
      Subject.syncIndexes(),
      StudyTopic.syncIndexes(),
    ]);
    initAuth();
    await seedAdmin();
    await seedStudyTopics();

    const app = createApp();
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

start();
