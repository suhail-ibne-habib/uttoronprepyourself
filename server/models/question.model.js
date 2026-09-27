import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["a", "b", "c", "d", "e"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },

    page: {
      type: Number,
      min: 1,
      default: null,
    },

    questionNo: {
      type: Number,
      min: 1,
      default: null,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    // =========================
    // RELATION
    // =========================

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    // =========================
    // QUESTION
    // =========================

    questionNo: {
      type: Number,
      required: true,
      min: 1,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // OPTIONS
    // =========================

    options: {
      type: [optionSchema],

      validate: {
        validator(options) {
          return options.length >= 2 && options.length <= 5;
        },

        message: "A question must have between 2 and 5 options.",
      },
    },

    answerKey: {
      type: String,
      enum: ["a", "b", "c", "d", "e"],
      required: true,
    },

    // =========================
    // QUESTION TYPE
    // =========================

    questionType: {
      type: String,

      enum: [
        "mcq",
        "true_false",
        "written",
        "fill_blank",
        "matching",
        "comprehension",
      ],

      default: "mcq",
      index: true,
    },

    // =========================
    // MARKING
    // =========================

    mark: {
      type: Number,
      default: 1,
      min: 0,
    },

    // =========================
    // CLASSIFICATION
    // =========================

    difficulty: {
      type: String,

      enum: ["easy", "medium", "hard"],

      default: "medium",
      index: true,
    },

    primaryTopics: {
      type: [String],
      default: [],
      index: true,
    },

    secondaryTopics: {
      type: [String],
      default: [],
      index: true,
    },

    tertiaryTopics: {
      type: [String],
      default: [],
      index: true,
    },

    // =========================
    // EXPLANATION
    // =========================

    explanation: {
      type: String,
      default: null,
      trim: true,
    },

    // =========================
    // LANGUAGE
    // =========================

    language: {
      type: String,

      enum: ["en", "bn"],

      default: "en",
      index: true,
    },

    // =========================
    // PASSAGE / CONTEXT
    // =========================

    passage: {
      type: String,
      default: null,
      trim: true,
    },

    passageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passage",
      default: null,
      index: true,
    },

    // =========================
    // SOURCE
    // =========================

    source: {
      type: sourceSchema,
      default: null,
    },

    // =========================
    // IMAGE
    // =========================

    image: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },
    },

    // =========================
    // VERIFICATION
    // =========================

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    reviewStatus: {
      type: String,

      enum: [
        "pending",
        "reviewed",
        "approved",
        "rejected",
      ],

      default: "pending",

      index: true,
    },

    // =========================
    // PUBLICATION
    // =========================

    status: {
      type: String,

      enum: [
        "draft",
        "published",
        "archived",
      ],

      default: "draft",

      index: true,
    },

    // =========================
    // USER / AUDIT
    // =========================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

questionSchema.index(
  {
    examId: 1,
    subjectId: 1,
    questionNo: 1,
  },
  {
    unique: true,
  }
);

questionSchema.index({
  examId: 1,
  difficulty: 1,
});

questionSchema.index({
  examId: 1,
  questionType: 1,
});

questionSchema.index({
  examId: 1,
  status: 1,
});

export const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);