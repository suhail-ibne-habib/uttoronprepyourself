export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ordinal(value) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) return "";
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[num % 10] || "th";
  return `${num}${suffix}`;
}

export function examSlug({ examType, examNumber, level }) {
  return slugify([examType, ordinal(examNumber), level].filter(Boolean).join("-"));
}

export function pick(source, keys) {
  const result = {};
  for (const key of keys) {
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

export function parseExplanation(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // html or plain text
  }
  if (/<[a-z][\s\S]*>/i.test(value)) return { html: value };
  return { body: value };
}

export function stringifyExplanation(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
