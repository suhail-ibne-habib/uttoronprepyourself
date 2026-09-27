import { Subject } from "../models/subject.model.js";
import { StudyTopic } from "../models/studyTopic.model.js";
import { slugify } from "./helpers.js";
import { ntrcaEnglishLessons } from "./ntrcaEnglishLessons.js";

async function ensureEnglishSubject() {
  let subject = await Subject.findOne({ slug: "english" });
  if (subject) return subject;
  subject = await Subject.create({
    name: "English",
    slug: "english",
    description: "NTRCA and board English grammar and usage.",
    status: "active",
    examIds: [],
  });
  return subject;
}

async function upsertLesson(subjectId, lesson, parentId, order) {
  const slug = lesson.slug || slugify(lesson.title);
  const body = {
    subjectId,
    parentId,
    title: lesson.title,
    slug,
    aliases: lesson.aliases || [],
    summary: lesson.summary || null,
    body: String(lesson.body || "").trim(),
    order: lesson.order ?? order,
    status: "published",
  };

  const existing = await StudyTopic.findOne({ subjectId, slug });
  if (!existing) {
    return StudyTopic.create(body);
  }

  existing.aliases = [
    ...new Set([...(existing.aliases || []), ...(body.aliases || [])]),
  ];
  if (!existing.body || existing.body.length < 40) {
    existing.set({ ...body, aliases: existing.aliases });
  }
  await existing.save();
  return existing;
}

export async function seedStudyTopics() {
  const english = await ensureEnglishSubject();
  let created = 0;

  for (const [index, lesson] of ntrcaEnglishLessons.entries()) {
    const parent = await upsertLesson(english._id, lesson, null, (index + 1) * 10);
    if (parent.createdAt && Date.now() - parent.createdAt.getTime() < 4000) created += 1;
    for (const [childIndex, child] of (lesson.children || []).entries()) {
      const row = await upsertLesson(
        english._id,
        child,
        parent._id,
        child.order ?? (index + 1) * 10 + childIndex + 1,
      );
      if (row.createdAt && Date.now() - row.createdAt.getTime() < 4000) created += 1;
    }
  }

  const count = await StudyTopic.countDocuments({ subjectId: english._id });
  console.log(`Study lessons ready: ${count} English topics`);
}
