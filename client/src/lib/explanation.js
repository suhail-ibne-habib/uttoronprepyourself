export function isEmptyHtml(html) {
  if (!html) return true;
  return !String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function structuredToHtml(explanation) {
  if (explanation.html) return explanation.html;
  const parts = [];
  if (explanation.heading) {
    parts.push(`<p><strong>${escapeHtml(explanation.heading)}</strong></p>`);
  }
  if (explanation.body) {
    parts.push(`<p>${escapeHtml(explanation.body)}</p>`);
  }
  if (explanation.points?.length) {
    parts.push(
      `<ul>${explanation.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`,
    );
  }
  return parts.join("");
}

export function explanationToHtml(value) {
  if (!value) return "";
  if (typeof value === "object") return structuredToHtml(value);
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return structuredToHtml(parsed);
  } catch {
    // already html or plain text
  }
  return String(value);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function linkTopicsInHtml(html, tags) {
  if (!html || !tags?.length) return html;
  const usable = [...tags]
    .filter((tag) => tag.href && tag.label)
    .sort((a, b) => b.label.length - a.label.length);

  return String(html)
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith("<")) return part;
      let text = part;
      for (const tag of usable) {
        const pattern = new RegExp(`\\b(${escapeRegExp(tag.label)})\\b`, "gi");
        text = text.replace(
          pattern,
          `<a href="${tag.href}" class="topic-link">$1</a>`,
        );
      }
      return text;
    })
    .join("");
}

export function sanitizeExplanationHtml(html) {
  if (!html || typeof window === "undefined") return html || "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, iframe, object, embed, form").forEach((node) => node.remove());
  doc.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      if (/^on/i.test(attr.name) || attr.name === "srcdoc") {
        node.removeAttribute(attr.name);
      }
      if (
        (attr.name === "href" || attr.name === "src") &&
        /^\s*javascript:/i.test(attr.value)
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
}
