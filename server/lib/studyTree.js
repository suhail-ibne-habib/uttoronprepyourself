import { slugify } from "./helpers.js";

export function topicLabels(question) {
  return [
    ...(question.primaryTopics || []),
    ...(question.secondaryTopics || []),
    ...(question.tertiaryTopics || []),
  ]
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export function uniqueLabels(labels) {
  const seen = new Set();
  const result = [];
  for (const label of labels) {
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(label);
  }
  return result;
}

export function matchDirectoryEntry(label, directory) {
  const slug = slugify(label);
  const lower = label.toLowerCase();
  return directory.find((item) => {
    if (item.slug === slug) return true;
    if (String(item.title).toLowerCase() === lower) return true;
    return (item.aliases || []).some((alias) => String(alias).toLowerCase() === lower);
  });
}

export function tagsForQuestion(question, subject, directory = []) {
  const labels = uniqueLabels(topicLabels(question));
  return labels.map((label) => {
    const hit = matchDirectoryEntry(label, directory);
    const subjectSlug = subject?.slug || hit?.subjectSlug;
    return {
      label,
      href: subjectSlug ? `/study/${subjectSlug}/${hit?.slug || slugify(label)}` : null,
    };
  });
}

export function serializeTopic(topic, subjectSlug) {
  const row = topic.toObject ? topic.toObject() : topic;
  return {
    id: String(row._id),
    title: row.title,
    slug: row.slug,
    aliases: row.aliases || [],
    summary: row.summary,
    body: row.body || "",
    parentId: row.parentId ? String(row.parentId) : null,
    order: row.order || 0,
    href: subjectSlug ? `/study/${subjectSlug}/${row.slug}` : null,
  };
}

export function buildTopicTree(topics, subjectSlug) {
  const nodes = topics.map((topic) => ({
    ...serializeTopic(topic, subjectSlug),
    children: [],
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const roots = [];

  for (const node of nodes) {
    const parent = node.parentId ? byId.get(node.parentId) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortNodes = (list) => {
    list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    list.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  return roots;
}

export function flattenTree(tree) {
  const flat = [];
  const walk = (nodes) => {
    for (const node of nodes) {
      flat.push(node);
      walk(node.children || []);
    }
  };
  walk(tree);
  return flat;
}

export function breadcrumbsFor(topic, byId, subject) {
  const crumbs = [
    { label: "Study", href: "/study" },
    { label: subject.name, href: `/study/${subject.slug}` },
  ];
  const chain = [];
  let current = topic;
  while (current) {
    chain.unshift({
      label: current.title,
      href: `/study/${subject.slug}/${current.slug}`,
    });
    current = current.parentId ? byId.get(String(current.parentId)) : null;
  }
  return [...crumbs, ...chain];
}
