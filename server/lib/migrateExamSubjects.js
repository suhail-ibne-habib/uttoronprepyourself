import mongoose from "mongoose";

export async function migrateOffExamSubjects() {
  const db = mongoose.connection.db;
  if (!db) return;

  const collections = await db.listCollections().toArray();
  const paper = collections.find((item) => /examsubjects?/i.test(item.name));
  if (!paper) return;

  const docs = await db.collection(paper.name).find().toArray();

  for (const row of docs) {
    if (!row.examId || !row.subjectId) continue;

    await db.collection("subjects").updateOne(
      { _id: row.subjectId },
      { $addToSet: { examIds: row.examId } },
    );

    await db.collection("questions").updateMany(
      { examSubjectId: row._id },
      { $set: { examId: row.examId, subjectId: row.subjectId } },
    );

    if (row.minusMarking) {
      const exam = await db.collection("exams").findOne({ _id: row.examId });
      if ((exam?.negativeMarking || 0) < row.minusMarking) {
        await db.collection("exams").updateOne(
          { _id: row.examId },
          { $set: { negativeMarking: row.minusMarking } },
        );
      }
    }
  }

  await db.collection("questions").updateMany({}, { $unset: { examSubjectId: "" } });
  await db.dropCollection(paper.name);
  console.log(`Moved ${docs.length} subject-exam links onto Subject`);
}
