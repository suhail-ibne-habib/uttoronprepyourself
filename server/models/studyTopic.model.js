import mongoose from "mongoose";

const studyTopicSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyTopic",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    aliases: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: null,
      trim: true,
    },
    body: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true },
);

studyTopicSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

export const StudyTopic =
  mongoose.models.StudyTopic || mongoose.model("StudyTopic", studyTopicSchema);
