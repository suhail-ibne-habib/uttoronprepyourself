import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    examIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exam",
        },
      ],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Subject =
  mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
