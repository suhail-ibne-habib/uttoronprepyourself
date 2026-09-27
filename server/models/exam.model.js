import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    examType: {
      type: String,
      required: true,
      enum: ["ntrca", "bpsc", "primary", "bank", "other"],
      index: true,
    },
    examNumber: {
      type: Number,
      default: null,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["school", "school-2", "college", "primary", "other"],
      default: "other",
    },
    description: {
      type: String,
      default: null,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    negativeMarking: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);

examSchema.index(
  { examType: 1, examNumber: 1, year: 1, level: 1 },
  { unique: true },
);

examSchema.index({ slug: 1, year: 1 }, { unique: true });

export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
