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
