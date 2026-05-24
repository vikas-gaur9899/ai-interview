import Interview from "../model/Interview.js";
import ScheduledInterview from "../model/ScheduledInterview.js";
import Student from "../model/Student.js";

import { generateQuestion } from "../services/interviewEngine.service.js";
import { INTERVIEW_DURATION_SECONDS } from "../constants/interview.constants.js";

import { evaluateInterview } from "../services/evaluation.service.js";
import { generatePDF } from "../services/pdf.service.js";
import { sendReportEmail } from "../services/mail.services.js";
import { generateTTS } from "../services/tts.service.js";
import { askLLM } from "../services/groq.service.js";

/* =========================
   START INTERVIEW
========================= */

export const startInterview = async (req, res) => {

  try {

    console.log(
      "🚀 START INTERVIEW API HIT"
    );

    const { studentId, token } = req.body;

    console.log(
      "🪪 studentId:",
      studentId
    );

    console.log(
      "🔑 token:",
      token
    );

    if (!studentId || !token) {

      console.log(
        "❌ Missing studentId or token"
      );

      return res.status(400).json({
        message: "Missing studentId or token"
      });

    }

    console.log(
      "🔍 FINDING SCHEDULED INTERVIEW..."
    );

    const scheduled =
      await ScheduledInterview.findOne({ token });

    console.log(
      "📄 scheduled:",
      scheduled
    );

    if (!scheduled) {

      console.log(
        "❌ Invalid token"
      );

      return res.status(404).json({
        message: "Invalid token"
      });

    }

    if (
      String(scheduled.studentId) !==
      String(studentId)
    ) {

      console.log(
        "❌ Token does not belong to student"
      );

      return res.status(400).json({
        message:
          "Token does not belong to this student"
      });

    }

    if (scheduled.used) {

      console.log(
        "❌ Token already used"
      );

      return res.status(400).json({
        message: "Token already used"
      });

    }

    if (
      !scheduled.expiryTime ||
      new Date() >
        new Date(scheduled.expiryTime)
    ) {

      console.log(
        "❌ Token expired"
      );

      return res.status(400).json({
        message: "Token expired"
      });

    }

    console.log(
      "👤 FINDING STUDENT..."
    );

    const student = await Student.findOne({
      studentId
    });

    console.log(
      "👤 student:",
      student
    );

    const userName =
      student?.name || "Candidate";

    const validLevels = [
      "level1",
      "level2",
      "level3"
    ];

    let level = null;

    if (scheduled.level === "1") {
      level = "level1";
    } else if (scheduled.level === "2") {
      level = "level2";
    } else if (scheduled.level === "3") {
      level = "level3";
    } else if (
      validLevels.includes(scheduled.level)
    ) {
      level = scheduled.level;
    }

    const validDifficulty = [
      "easy",
      "medium",
      "hard"
    ];

    let difficulty = null;

    if (
      validDifficulty.includes(
        scheduled.difficulty
      )
    ) {
      difficulty = scheduled.difficulty;
    }

    console.log(
      "📝 CREATING INTERVIEW..."
    );

    const interview =
      await Interview.create({
        studentId: String(studentId),

        scheduledInterviewId:
          scheduled._id,

        interviewType:
          scheduled.interviewType,

        level,

        difficulty,

        dsaTopics:
          (scheduled.topics || []).map(
            (t) => t.trim()
          ),

        startTime: new Date()
      });

    console.log(
      "✅ INTERVIEW CREATED:",
      interview._id
    );

    /* ================= AI QUESTION ================= */

    console.log(
      "🔥 GENERATING QUESTION..."
    );

    const qObj = await generateQuestion({
      interviewType:
        scheduled.interviewType,

      level,

      difficulty,

      dsaTopics:
        scheduled.topics || [],

      userName
    });

    console.log(
      "✅ QUESTION GENERATED:",
      qObj
    );

    interview.questions.push({
      question: qObj.question
    });

    await interview.save();

    console.log(
      "💾 QUESTION SAVED"
    );

    /* ================= TTS ================= */

    console.log(
      "🎤 GENERATING TTS..."
    );

    const audioUrl =
      await generateTTS(qObj.question);

    console.log(
      "✅ TTS GENERATED:",
      audioUrl
    );

    /* ================= RESPONSE ================= */

    console.log(
      "📦 SENDING RESPONSE..."
    );

    res.json({
      interviewId: interview._id,

      question: qObj.question,

      interviewType:
        scheduled.interviewType,

      audioUrl
    });

  } catch (err) {

    console.error(
      "❌ START INTERVIEW ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to start interview"
    });

  }

};

/* =========================
   SUBMIT ANSWER
========================= */

export const submitAnswer = async (req, res) => {

  try {

    console.log(
      "📥 SUBMIT ANSWER HIT"
    );

    const {
      interviewId,
      answer,
      skipped
    } = req.body;

    console.log(
      "🆔 interviewId:",
      interviewId
    );

    console.log(
      "✍️ answer:",
      answer
    );

    const interview =
      await Interview.findById(interviewId);

    console.log(
      "📄 interview:",
      interview?._id
    );

    if (!interview) {

      console.log(
        "❌ Interview not found"
      );

      return res.status(404).json({
        message: "Interview not found"
      });

    }

    const elapsedSeconds =
      (Date.now() -
        interview.startTime.getTime()) /
      1000;

    if (
      elapsedSeconds >
      INTERVIEW_DURATION_SECONDS
    ) {

      console.log(
        "⏱ Interview completed by timer"
      );

      interview.completed = true;

      interview.endTime = new Date();

      await interview.save();

      return res.json({
        completed: true
      });

    }

    /* ================= SAVE ANSWER ================= */

    const lastQ =
      interview.questions[
        interview.questions.length - 1
      ];

    const finalAnswer =
      skipped ||
      answer === "__SKIPPED__"
        ? "__SKIPPED__"
        : answer;

    if (
      interview.interviewType ===
      "practical"
    ) {

      lastQ.code = finalAnswer;

    } else {

      lastQ.answer = finalAnswer;

    }

    console.log(
      "💾 ANSWER SAVED"
    );

    /* ================= AI FEEDBACK ================= */

    try {

      console.log(
        "🤖 GENERATING FEEDBACK..."
      );

      const feedbackPrompt = `
Question:
${lastQ.question}

Candidate Answer:
${
  interview.interviewType ===
  "practical"
    ? lastQ.code
    : lastQ.answer
}

Give short feedback in 2-3 lines.
`;

      const feedback =
        await askLLM(feedbackPrompt);

      lastQ.feedback = feedback;

      console.log(
        "✅ FEEDBACK GENERATED"
      );

    } catch (e) {

      console.log(
        "❌ FEEDBACK FAILED"
      );

      lastQ.feedback = "";

    }

    /* ================= STUDENT ================= */

    const student = await Student.findOne({
      studentId: interview.studentId
    });

    const userName =
      student?.name || "Candidate";

    /* ================= NEXT QUESTION ================= */

    console.log(
      "🔥 GENERATING NEXT QUESTION..."
    );

    const nextQ = await generateQuestion({
      interviewType:
        interview.interviewType,

      level: interview.level,

      difficulty:
        interview.difficulty,

      dsaTopics:
        interview.dsaTopics || [],

      lastQnA: lastQ,

      userName
    });

    console.log(
      "✅ NEXT QUESTION:",
      nextQ
    );

    interview.questions.push({
      question: nextQ.question
    });

    await interview.save();

    console.log(
      "💾 NEXT QUESTION SAVED"
    );

    /* ================= NEXT TTS ================= */

    console.log(
      "🎤 GENERATING NEXT TTS..."
    );

    const audioUrl =
      await generateTTS(nextQ.question);

    console.log(
      "✅ NEXT TTS:",
      audioUrl
    );

    console.log(
      "📦 SENDING NEXT RESPONSE..."
    );

    res.json({
      completed: false,

      question: nextQ.question,

      interviewType:
        interview.interviewType,

      audioUrl
    });

  } catch (err) {

    console.error(
      "❌ SUBMIT ANSWER ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to submit answer"
    });

  }

};

/* =========================
   END INTERVIEW
========================= */

export const endInterview = async (
  req,
  res
) => {

  try {

    const { interviewId } = req.body;

    await Interview.findByIdAndUpdate(
      interviewId,
      {
        completed: true,
        endTime: new Date()
      }
    );

    res.json({
      message: "Interview ended"
    });

  } catch (err) {

    console.error(
      "End interview error:",
      err
    );

    res.status(500).json({
      message: "Failed to end interview"
    });

  }

};

/* =========================
   FINALIZE INTERVIEW
========================= */

export const finalizeInterview = async (
  req,
  res
) => {

  try {

    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        message: "Interview ID required"
      });
    }

    const interview =
      await Interview.findById(
        interviewId
      );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    if (interview.completed) {
      return res.json({
        message:
          "Interview already finalized",
        interviewId
      });
    }

    let evaluation;

    try {

      evaluation =
        await evaluateInterview(
          interview
        );

    } catch (e) {

      console.error(
        "❌ Evaluation failed, using fallback"
      );

      evaluation = {
        grammar: 0,
        correctness: 0,
        pronunciation: 0,
        confidence: 0,
        overall: 0,

        strengths: [],

        weaknesses: [
          "Evaluation failed due to AI error"
        ],

        summary:
          "Interview evaluation could not be completed properly.",

        insights: [],

        improvements: [],

        finalResult: "Fail"
      };

    }

    const pdfPath =
      await generatePDF(
        interview,
        evaluation
      );

    interview.scores = evaluation;

    interview.strengths =
      evaluation.strengths;

    interview.weaknesses =
      evaluation.weaknesses;

    interview.finalResult =
      evaluation.finalResult;

    interview.pdfReportPath = pdfPath;

    interview.completed = true;

    interview.endTime = new Date();

    await interview.save();

    if (
      interview.scheduledInterviewId
    ) {

      await ScheduledInterview.findByIdAndUpdate(
        interview.scheduledInterviewId,
        {
          used: true
        }
      );

    }

    res.json({
      message:
        "Interview evaluated successfully",

      interviewId,

      closingMessage:
        "That concludes your interview. Thank you for your time."
    });

  } catch (err) {

    console.error(
      "Finalize interview error:",
      err
    );

    res.status(500).json({
      message:
        "Failed to finalize interview"
    });

  }

};

/* =========================
   SEND EMAIL
========================= */

export const sendInterviewEmail = async (
  req,
  res
) => {

  try {

    const {
      interviewId,
      email
    } = req.body;

    const interview =
      await Interview.findById(
        interviewId
      );

    if (
      !interview ||
      !interview.pdfReportPath
    ) {
      return res.status(404).json({
        message: "PDF not found"
      });
    }

    await sendReportEmail(
      email,
      interview.pdfReportPath
    );

    res.json({
      message: "PDF sent successfully"
    });

  } catch (err) {

    console.error("Email error:", err);

    res.status(500).json({
      message: "Failed to send email"
    });

  }

};