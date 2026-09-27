import { StudyTopic } from "../models/studyTopic.model.js";
import { escapeRegex, slugify } from "./helpers.js";

function labels(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
}

export async function findCoveredLesson(subjectId, title) {
  const trimmed = String(title || "").trim();
  if (!trimmed || !subjectId) return null;
  const slug = slugify(trimmed);
  const exact = new RegExp(`^${escapeRegex(trimmed)}$`, "i");

  return StudyTopic.findOne({
    subjectId,
    $or: [{ slug }, { title: exact }, { aliases: exact }],
  });
}

async function uniqueSlug(subjectId, title) {
  const base = slugify(title) || "topic";
  let slug = base;
  let n = 2;
  while (await StudyTopic.findOne({ subjectId, slug }).select("_id")) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

async function ensureLesson(subjectId, title, parentId = null) {
  const existing = await findCoveredLesson(subjectId, title);
  if (existing) return existing;

  return StudyTopic.create({
    subjectId,
    parentId,
    title: title.trim(),
    slug: await uniqueSlug(subjectId, title),
    aliases: [],
    summary: `Started from a question topic: ${title.trim()}`,
    body: "",
    status: "published",
    order: 400,
  });
}

export async function ensureStudyLessons({
  subjectId,
  primaryTopics,
  secondaryTopics,
  tertiaryTopics,
}) {
  if (!subjectId) return;

  const primary = labels(primaryTopics);
  const secondary = labels(secondaryTopics);
  const tertiary = labels(tertiaryTopics);

  const parents = [];
  for (const title of primary) {
    parents.push(await ensureLesson(subjectId, title, null));
  }

  const parentId = parents[0]?._id || null;
  const mid = [];
  for (const title of secondary) {
    mid.push(await ensureLesson(subjectId, title, parentId));
  }

  const childParent = mid[0]?._id || parentId;
  for (const title of tertiary) {
    await ensureLesson(subjectId, title, childParent);
  }
}
