import { Subject } from "../models/subject.model.js";
import { StudyTopic } from "../models/studyTopic.model.js";
import { Question } from "../models/question.model.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";
import { escapeRegex, pick, slugify } from "../lib/helpers.js";
import {
  buildTopicTree,
  flattenTree,
  serializeTopic,
  tagsForQuestion,
  uniqueLabels,
  topicLabels,
  matchDirectoryEntry,
} from "../lib/studyTree.js";

export async function loadTopicDirectory() {
  const rows = await StudyTopic.find({ status: "published" }).populate(
    "subjectId",
    "slug name",
  );
  return rows
    .filter((row) => row.subjectId)
    .map((row) => ({
      title: row.title,
      slug: row.slug,
      aliases: row.aliases || [],
      subjectSlug: row.subjectId.slug,
      href: `/study/${row.subjectId.slug}/${row.slug}`,
    }));
}

async function subjectBySlug(slug) {
  const subject = await Subject.findOne({
    slug,
    status: { $ne: "inactive" },
  });
  if (!subject) throw new ApiError(404, "Subject not found");
  return subject;
}

async function extraTopicsFromQuestions(subject, directory) {
  const questions = await Question.find({
    subjectId: subject._id,
    status: "published",
  }).select("primaryTopics secondaryTopics tertiaryTopics");

  const extras = [];
  const seen = new Set((directory || []).map((item) => item.slug));
  for (const question of questions) {
    for (const label of uniqueLabels(topicLabels(question))) {
      if (matchDirectoryEntry(label, directory)) continue;
      const slug = slugify(label);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      extras.push({
        id: `q-${slug}`,
        title: label,
        slug,
        aliases: [],
        summary: "From the question bank. A full lesson will appear here as it is written.",
        body: "",
        parentId: null,
        order: 500,
        href: `/study/${subject.slug}/${slug}`,
        children: [],
        stub: true,
      });
    }
  }
  return extras;
}

async function relatedQuestions(subject, topic) {
  const names = uniqueLabels([topic.title, ...(topic.aliases || [])]);
  if (!names.length) return [];
  const topicMatch = names.flatMap((name) => {
    const rx = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    return [
      { primaryTopics: rx },
      { secondaryTopics: rx },
      { tertiaryTopics: rx },
    ];
  });
  const questions = await Question.find({
    subjectId: subject._id,
    status: "published",
    $or: topicMatch,
  })
    .sort({ questionNo: 1 })
    .limit(8)
    .populate("examId", "name slug year");

  return questions.map((question) => ({
    id: String(question._id),
    number: question.questionNo,
    stem: question.question,
    exam: question.examId?.name || "",
    href: question.examId
      ? `/question-bank/${question.examId.slug}/${question.examId.year}`
      : null,
  }));
}

export const listStudyHome = asyncHandler(async (_req, res) => {
  const subjects = await Subject.find({ status: "active" }).sort({ name: 1 });
  const counts = await StudyTopic.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$subjectId", total: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((row) => [String(row._id), row.total]));

  res.json({
    success: true,
    data: subjects.map((subject) => ({
      id: String(subject._id),
      name: subject.name,
      slug: subject.slug,
      description: subject.description,
      href: `/study/${subject.slug}`,
      lessonCount: countMap.get(String(subject._id)) || 0,
    })),
  });
});

export const getStudySubject = asyncHandler(async (req, res) => {
  const subject = await subjectBySlug(req.params.subjectSlug);
  const articles = await StudyTopic.find({
    subjectId: subject._id,
    status: "published",
  });
  const tree = buildTopicTree(articles, subject.slug);
  const extras = await extraTopicsFromQuestions(subject, articles);
  const fullTree = extras.length
    ? [
        ...tree,
        {
          id: "from-bank",
          title: "From question bank",
          slug: "from-question-bank",
          href: null,
          children: extras,
          stub: true,
        },
      ]
    : tree;

  res.json({
    success: true,
    data: {
      subject: {
        id: String(subject._id),
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      },
      tree: fullTree,
      lessons: flattenTree(fullTree).filter((item) => item.href),
    },
  });
});

export const getStudyTopic = asyncHandler(async (req, res) => {
  const subject = await subjectBySlug(req.params.subjectSlug);
  const articles = await StudyTopic.find({
    subjectId: subject._id,
    status: "published",
  });
  const tree = buildTopicTree(articles, subject.slug);
  const extras = await extraTopicsFromQuestions(subject, articles);
  const fullTree = extras.length
    ? [
        ...tree,
        {
          id: "from-bank",
          title: "From question bank",
          slug: "from-question-bank",
          href: null,
          children: extras,
          stub: true,
        },
      ]
    : tree;

  const flat = flattenTree(fullTree).filter((item) => item.href);
  const index = flat.findIndex((item) => item.slug === req.params.topicSlug);
  let topic = articles.find((row) => row.slug === req.params.topicSlug);

  if (!topic) {
    const stub = extras.find((row) => row.slug === req.params.topicSlug);
    if (!stub) throw new ApiError(404, "Lesson not found");
    topic = {
      _id: stub.id,
      title: stub.title,
      slug: stub.slug,
      aliases: [],
      summary: stub.summary,
      body: "",
      parentId: null,
    };
  }

  const byId = new Map(articles.map((row) => [String(row._id), row]));
  const crumbs = [
    { label: "Study", href: "/study" },
    { label: subject.name, href: `/study/${subject.slug}` },
  ];
  if (topic.parentId && byId.get(String(topic.parentId))) {
    const parent = byId.get(String(topic.parentId));
    crumbs.push({
      label: parent.title,
      href: `/study/${subject.slug}/${parent.slug}`,
    });
  }
  crumbs.push({
    label: topic.title,
    href: `/study/${subject.slug}/${topic.slug}`,
  });

  const currentIndex = index >= 0 ? index : flat.findIndex((item) => item.slug === topic.slug);

  res.json({
    success: true,
    data: {
      subject: {
        id: String(subject._id),
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      },
      topic: {
        id: String(topic._id),
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        body: topic.body || "",
        aliases: topic.aliases || [],
      },
      breadcrumbs: crumbs,
      tree: fullTree,
      previous: currentIndex > 0 ? flat[currentIndex - 1] : null,
      next: currentIndex >= 0 ? flat[currentIndex + 1] || null : null,
      relatedQuestions: await relatedQuestions(subject, topic),
    },
  });
});

export const listStudyTopicsAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.subjectId) filter.subjectId = req.query.subjectId;
  const q = String(req.query.q || "").trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: rx }, { slug: rx }, { aliases: rx }];
  }
  const topics = await StudyTopic.find(filter)
    .populate("subjectId", "name slug")
    .populate("parentId", "title slug")
    .sort({ order: 1, title: 1 })
    .limit(q ? 20 : 200);

  const rows = topics.map((topic) => topic.toObject());
  if (req.query.includeQuestions === "1") {
    const questionFilter = {};
    if (req.query.subjectId) questionFilter.subjectId = req.query.subjectId;
    const questions = await Question.find(questionFilter)
      .select("primaryTopics secondaryTopics tertiaryTopics")
      .limit(800);
    const seen = new Set(
      rows.map((row) => String(row.title || "").toLowerCase()).filter(Boolean),
    );
    const needle = q.toLowerCase();
    for (const question of questions) {
      for (const label of uniqueLabels(topicLabels(question))) {
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        if (needle && !key.includes(needle) && !slugify(label).includes(slugify(q))) {
          continue;
        }
        seen.add(key);
        rows.push({
          _id: `q-${slugify(label)}`,
          title: label,
          slug: slugify(label),
          aliases: [],
          fromQuestion: true,
        });
      }
    }
  }

  res.json({ success: true, data: rows.slice(0, q ? 20 : 200) });
});

export const suggestTopics = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  const subjectId = req.query.subjectId;
  const lessonFilter = {};
  if (subjectId) lessonFilter.subjectId = subjectId;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    lessonFilter.$or = [{ title: rx }, { slug: rx }, { aliases: rx }];
  }

  const lessons = await StudyTopic.find(lessonFilter)
    .select("title slug aliases")
    .sort({ order: 1, title: 1 })
    .limit(40)
    .lean();

  const results = lessons.map((row) => ({
    _id: String(row._id),
    title: row.title,
    slug: row.slug,
    aliases: row.aliases || [],
  }));
  const seen = new Set(results.map((row) => row.title.toLowerCase()));
  const needle = q.toLowerCase();

  const questionFilter = {};
  if (subjectId) questionFilter.subjectId = subjectId;
  const questions = await Question.find(questionFilter)
    .select("primaryTopics secondaryTopics tertiaryTopics")
    .limit(800)
    .lean();

  for (const question of questions) {
    for (const label of uniqueLabels(topicLabels(question))) {
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      if (needle && !key.includes(needle) && !slugify(label).includes(slugify(q))) {
        continue;
      }
      seen.add(key);
      results.push({
        _id: `q-${slugify(label)}`,
        title: label,
        slug: slugify(label),
        aliases: [],
        fromQuestion: true,
      });
    }
  }

  res.json({ success: true, data: results.slice(0, 40) });
});

export const getStudyTopicAdmin = asyncHandler(async (req, res) => {
  const topic = await StudyTopic.findById(req.params.id)
    .populate("subjectId", "name slug")
    .populate("parentId", "title slug");
  if (!topic) throw new ApiError(404, "Lesson not found");
  res.json({ success: true, data: topic });
});

export const createStudyTopic = asyncHandler(async (req, res) => {
  const body = pick(req.body, [
    "subjectId",
    "parentId",
    "title",
    "slug",
    "aliases",
    "summary",
    "body",
    "order",
    "status",
  ]);
  if (!body.subjectId || !body.title) {
    throw new ApiError(400, "subject and title are required");
  }
  const subject = await Subject.findById(body.subjectId);
  if (!subject) throw new ApiError(404, "Subject not found");
  body.slug = slugify(body.slug || body.title);
  if (Array.isArray(body.aliases)) {
    body.aliases = body.aliases.map((item) => String(item).trim()).filter(Boolean);
  }
  if (!body.parentId) body.parentId = null;
  const topic = await StudyTopic.create(body);
  res.status(201).json({ success: true, data: topic });
});

export const updateStudyTopic = asyncHandler(async (req, res) => {
  const body = pick(req.body, [
    "subjectId",
    "parentId",
    "title",
    "slug",
    "aliases",
    "summary",
    "body",
    "order",
    "status",
  ]);
  if (body.title || body.slug) body.slug = slugify(body.slug || body.title);
  if (Array.isArray(body.aliases)) {
    body.aliases = body.aliases.map((item) => String(item).trim()).filter(Boolean);
  }
  if (body.parentId === "") body.parentId = null;
  const topic = await StudyTopic.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!topic) throw new ApiError(404, "Lesson not found");
  res.json({ success: true, data: topic });
});

export const deleteStudyTopic = asyncHandler(async (req, res) => {
  const topic = await StudyTopic.findByIdAndDelete(req.params.id);
  if (!topic) throw new ApiError(404, "Lesson not found");
  await StudyTopic.updateMany({ parentId: topic._id }, { parentId: topic.parentId });
  res.json({ success: true, message: "Lesson deleted" });
});

void serializeTopic;
void tagsForQuestion;
