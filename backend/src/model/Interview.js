import mongoose from "mongoose";

/* ====================================================
   QUESTION SUB SCHEMA
==================================================== */

const questionSchema =
new mongoose.Schema({

  question: {
    type: String,
    required: true,
    trim: true
  },

  answer: {
    type: String,
    default: "",
    trim: true
  },

  code: {
    type: String,
    default: ""
  },

  feedback: {
    type: String,
    default: "",
    trim: true
  }

}, { _id: false });

/* ====================================================
   INTERVIEW SCHEMA
==================================================== */

const interviewSchema =
new mongoose.Schema({

  studentId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  scheduledInterviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScheduledInterview",
    required: true,
    index: true
  },

  interviewType: {
    type: String,
    enum: ["technical", "hr", "practical"],
    required: true,
    index: true
  },

  difficulty: {
    type: String,
    enum: ["easy", "intermediate", "hard"],
    default: null
  },

  topics: {
    type: [String],
    default: []
  },

  questions: {
    type: [questionSchema],
    default: []
  },

  startTime: {
    type: Date,
    default: Date.now,
    index: true
  },

  endTime: {
    type: Date,
    default: null
  },

  completed: {
    type: Boolean,
    default: false,
    index: true
  },

  scores: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  strengths: {
    type: [String],
    default: []
  },

  weaknesses: {
    type: [String],
    default: []
  },

  /* ====================================================
     FINAL RESULT
     🔥 FIX: Removed enum restriction.
     AI can return any string — we sanitize it in
     evaluation.service.js before saving, so no need
     to restrict here. Plain String prevents the
     ValidatorError crash.
  ==================================================== */

  finalResult: {
    type: String,
    default: ""
  },

  pdfReportPath: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);