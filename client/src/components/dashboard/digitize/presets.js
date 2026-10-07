const OPTION_KEYS = ["a", "b", "c", "d", "e"];

function previewSvg(lines) {
  const body = lines
    .map(
      (line, index) =>
        `<text x="36" y="${64 + index * 34}" fill="#f5f5f4" font-family="ui-sans-serif,sans-serif" font-size="22">${escapeXml(line)}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460"><rect width="100%" height="100%" fill="#1c1917"/>${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function emptyDraft() {
  return {
    examId: "",
    subjectId: "",
    questionNo: 1,
    question: "",
    options: OPTION_KEYS.slice(0, 4).map((key) => ({ key, text: "" })),
    answerKey: "a",
    mark: 1,
    difficulty: "medium",
    primaryTopics: [],
    secondaryTopics: [],
    tertiaryTopics: [],
    explanation: "",
    questionType: "mcq",
    language: "en",
    passage: "",
    sourceName: "",
    sourcePage: "",
    sourceQuestionNo: "",
    verified: false,
    reviewStatus: "pending",
    status: "draft",
    imageSrc: "",
    imageTitle: "",
    boxes: [],
    missingDetected: false,
    sampleKey: "",
  };
}

export const SAMPLE_PRESETS = {
  math: {
    ...emptyDraft(),
    sampleKey: "math",
    imageTitle: "Math_Question_04.jpg",
    imageSrc: previewSvg([
      "4. Find the derivative of f(x) = 3x^2 + 5x - 2",
      "",
      "A) f'(x) = 6x + 5",
      "B) f'(x) = 3x + 5",
      "C) f'(x) = 6x^2 + 5",
      "D) f'(x) = 6x - 2",
    ]),
    questionNo: 4,
    question: "Find the derivative of the function f(x) = 3x² + 5x − 2 with respect to x.",
    options: [
      { key: "a", text: "f'(x) = 6x + 5" },
      { key: "b", text: "f'(x) = 3x + 5" },
      { key: "c", text: "f'(x) = 6x² + 5" },
      { key: "d", text: "f'(x) = 6x − 2" },
    ],
    answerKey: "a",
    difficulty: "medium",
    primaryTopics: ["Calculus"],
    explanation: "Power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, and the constant disappears.",
    sourceName: "Math_Question_04.jpg",
    sourceQuestionNo: 4,
    boxes: [
      { top: "8%", left: "4%", width: "92%", height: "18%", tone: "stem", label: "Stem" },
      { top: "34%", left: "4%", width: "44%", height: "16%", tone: "option", label: "A" },
      { top: "34%", left: "52%", width: "44%", height: "16%", tone: "option", label: "B" },
      { top: "58%", left: "4%", width: "44%", height: "16%", tone: "option", label: "C" },
      { top: "58%", left: "52%", width: "44%", height: "16%", tone: "option", label: "D" },
    ],
  },
  science: {
    ...emptyDraft(),
    sampleKey: "science",
    imageTitle: "Chemistry_Elements_Q12.jpg",
    imageSrc: previewSvg([
      "12. Which element has the highest electronegativity?",
      "",
      "A) Oxygen (O)",
      "B) Fluorine (F)",
      "C) Chlorine (Cl)",
      "(Option D cropped off the image)",
    ]),
    questionNo: 12,
    question: "Which element has the highest electronegativity according to the Pauling scale?",
    options: [
      { key: "a", text: "Oxygen (O)" },
      { key: "b", text: "Fluorine (F)" },
      { key: "c", text: "Chlorine (Cl)" },
    ],
    answerKey: "b",
    difficulty: "easy",
    primaryTopics: ["Periodic table"],
    explanation: "Fluorine is 3.98 on the Pauling scale, the highest of all elements.",
    sourceName: "Chemistry_Elements_Q12.jpg",
    sourceQuestionNo: 12,
    missingDetected: true,
    boxes: [
      { top: "8%", left: "4%", width: "92%", height: "18%", tone: "stem", label: "Stem" },
      { top: "36%", left: "4%", width: "88%", height: "14%", tone: "option", label: "A" },
      { top: "54%", left: "4%", width: "88%", height: "14%", tone: "option", label: "B" },
      { top: "72%", left: "4%", width: "88%", height: "14%", tone: "option", label: "C" },
      { top: "88%", left: "4%", width: "40%", height: "8%", tone: "missing", label: "Missing" },
    ],
  },
  history: {
    ...emptyDraft(),
    sampleKey: "history",
    imageTitle: "World_History_Q8.jpg",
    imageSrc: previewSvg([
      "8. In which year did World War II end?",
      "",
      "A) 1939     B) 1941",
      "C) 1945     D) 1950",
    ]),
    questionNo: 8,
    question: "In which year did World War II officially conclude in Europe and the Pacific?",
    options: [
      { key: "a", text: "1939" },
      { key: "b", text: "1941" },
      { key: "c", text: "1945" },
      { key: "d", text: "1950" },
    ],
    answerKey: "c",
    difficulty: "easy",
    primaryTopics: ["World history"],
    explanation: "Germany surrendered in May 1945 and Japan in September 1945.",
    sourceName: "World_History_Q8.jpg",
    sourceQuestionNo: 8,
    boxes: [
      { top: "10%", left: "4%", width: "92%", height: "20%", tone: "stem", label: "Stem" },
      { top: "42%", left: "4%", width: "42%", height: "16%", tone: "option", label: "A" },
      { top: "42%", left: "52%", width: "42%", height: "16%", tone: "option", label: "B" },
      { top: "64%", left: "4%", width: "42%", height: "16%", tone: "option", label: "C" },
      { top: "64%", left: "52%", width: "42%", height: "16%", tone: "option", label: "D" },
    ],
  },
};

export const PRESET_BUTTONS = [
  { key: "math", label: "Math MCQ" },
  { key: "science", label: "Science (missing option)" },
  { key: "history", label: "History Q&A" },
];

export { OPTION_KEYS };
