import "dotenv/config";
import dns from "node:dns";
import express from "express";
import connectDB from "./db/connect.js";
import { initAuth } from "./lib/auth.js";
import { seedAdmin } from "./lib/seedAdmin.js";
import { createApp } from "./createApp.js";
import { Question } from "./models/question.model.js";
import { Subject } from "./models/subject.model.js";
import { migrateOffExamSubjects } from "./lib/migrateExamSubjects.js";
import { seedStudyTopics } from "./lib/seedStudyTopics.js";
import { StudyTopic } from "./models/studyTopic.model.js";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dns.setDefaultResultOrder("ipv4first");
} catch {
  dns.setDefaultResultOrder("ipv4first");
}

async function boot() {
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
  return createApp();
}

const app = await boot();

export default app;
void express;

if (!process.env.VERCEL) {
  const port = process.env.PORT || 8080;
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  server.on("error", (error) => {
    console.error(`Server failed to listen on port ${port}: ${error.message}`);
    process.exit(1);
  });
}
