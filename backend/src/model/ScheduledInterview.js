import mongoose from "mongoose";

/* ====================================================
   SCHEDULED INTERVIEW SCHEMA
==================================================== */

const scheduledInterviewSchema =
new mongoose.Schema({

  /* ====================================================
     STUDENT ID
  ==================================================== */

  studentId: {

    type: String,

    required: true,

    trim: true,

    index: true

  },

  /* ====================================================
     INTERVIEW TYPE
  ==================================================== */

  interviewType: {

    type: String,

    enum: [
      "technical",
      "hr",
      "practical"
    ],

    required: true,

    index: true

  },

  /* ====================================================
     DIFFICULTY
  ==================================================== */

  difficulty: {

    type: String,

    enum: [
      "easy",
      "intermediate",
      "hard"
    ],

    required: true

  },

  /* ====================================================
     TOPICS
  ==================================================== */

  topics: {

    type: [String],

    default: []

  },

  /* ====================================================
     DATE
  ==================================================== */

  date: {

    type: String,

    required: true,

    trim: true,

    index: true

  },

  /* ====================================================
     START TIME
  ==================================================== */

  startTime: {

    type: String,

    required: true,

    trim: true

  },

  /* ====================================================
     END TIME
  ==================================================== */

  endTime: {

    type: String,

    required: true,

    trim: true

  },

  /* ====================================================
     ACCESS TOKEN
  ==================================================== */

  token: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    index: true

  },

  /* ====================================================
     TOKEN EXPIRY
  ==================================================== */

  expiryTime: {

    type: Date,

    required: true,

    index: true

  },

  /* ====================================================
     USED STATUS
  ==================================================== */

  used: {

    type: Boolean,

    default: false,

    index: true

  }

}, {

  timestamps: true

});

/* ====================================================
   AUTO DELETE EXPIRED TOKENS
==================================================== */

scheduledInterviewSchema.index(
  { expiryTime: 1 },
  { expireAfterSeconds: 0 }
);

/* ====================================================
   EXPORT
==================================================== */

export default mongoose.model(
  "ScheduledInterview",
  scheduledInterviewSchema
);