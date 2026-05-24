import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import Student from "../model/Student.js";

import cloudinary
from "../config/cloudinary.js";

/* ====================================================
   GENERATE PDF REPORT
==================================================== */

export const generatePDF = async (
  interview,
  evaluation
) => {

  /* ====================================================
     FETCH STUDENT
  ==================================================== */

  const student =
    await Student.findOne({

      studentId:
        interview.studentId

    });

  const name =
    student?.name ||
    "Candidate";

  const course =
    student?.course ||
    "N/A";

  const email =
    student?.email ||
    "N/A";

  /* ====================================================
     CREATE REPORT FOLDER
  ==================================================== */

  const dir = path.join(
    process.cwd(),
    "reports"
  );

  if (!fs.existsSync(dir)) {

    fs.mkdirSync(dir);

  }

  /* ====================================================
     SAFE FILE NAME
  ==================================================== */

  const safeName =
    name.replace(/\s+/g, "_");

  /* ====================================================
     FILE SETUP
  ==================================================== */

  const filePath = path.join(

    dir,

    `${safeName}_report.pdf`

  );

  const doc =
    new PDFDocument({

      size: "A4",

      margin: 40

    });

  const stream =
    fs.createWriteStream(filePath);

  doc.pipe(stream);

  /* ====================================================
     PERFORMANCE LEVEL
  ==================================================== */

  let performanceLevel =
    "Needs Improvement";

  if (evaluation.overall >= 85) {

    performanceLevel =
      "Excellent";

  } else if (
    evaluation.overall >= 70
  ) {

    performanceLevel =
      "Good";

  } else if (
    evaluation.overall >= 50
  ) {

    performanceLevel =
      "Average";

  }

  /* ====================================================
     HEADER
  ==================================================== */

  doc
    .rect(
      0,
      0,
      doc.page.width,
      120
    )
    .fill("#0A2540");

  doc
    .fillColor("#ffffff")
    .fontSize(26)
    .text(
      "AI Interview Performance Report",
      40,
      40
    );

  doc
    .fontSize(12)
    .fillColor("#cfd8e3")
    .text(
      "e-Definers Technologies",
      40,
      75
    );

  /* ====================================================
     CANDIDATE DETAILS
  ==================================================== */

  doc
    .roundedRect(
      40,
      140,
      doc.page.width - 80,
      110,
      10
    )
    .fill("#f5f7fb");

  doc
    .fillColor("#000")
    .fontSize(12);

  doc.text(
    `Name: ${name}`,
    60,
    160
  );

  doc.text(
    `Interview Type: ${interview.interviewType}`,
    60,
    180
  );

  doc.text(
    `Difficulty: ${interview.difficulty || "N/A"}`,
    60,
    200
  );

  doc.text(
    `Course: ${course}`,
    320,
    160
  );

  doc.text(
    `Email: ${email}`,
    320,
    180
  );

  doc.text(
    `Performance: ${performanceLevel}`,
    320,
    200
  );

  let y = 290;

  /* ====================================================
     EXECUTIVE SUMMARY
  ==================================================== */

  doc
    .fontSize(18)
    .fillColor("#0A2540")
    .text(
      "Executive Summary",
      40,
      y
    );

  y += 30;

  doc
    .fontSize(11)
    .fillColor("#333")
    .text(

      evaluation.summary ||

      "The candidate demonstrated average performance during the interview.",

      40,
      y,

      {
        width: 520,
        align: "justify"
      }

    );

  y += 80;

  /* ====================================================
     STRENGTHS
  ==================================================== */

  doc
    .fontSize(16)
    .fillColor("#0A2540")
    .text(
      "Key Strengths",
      40,
      y
    );

  y += 25;

  (
    evaluation.strengths || []
  ).forEach((point) => {

    doc
      .circle(
        45,
        y + 5,
        2
      )
      .fill("#2ecc71");

    doc
      .fillColor("#333")
      .fontSize(11)
      .text(
        point,
        55,
        y,
        {
          width: 500
        }
      );

    y += 22;

  });

  y += 15;

  /* ====================================================
     WEAKNESSES
  ==================================================== */

  doc
    .fontSize(16)
    .fillColor("#0A2540")
    .text(
      "Areas of Improvement",
      40,
      y
    );

  y += 25;

  (
    evaluation.weaknesses || []
  ).forEach((point) => {

    doc
      .circle(
        45,
        y + 5,
        2
      )
      .fill("#e74c3c");

    doc
      .fillColor("#333")
      .fontSize(11)
      .text(
        point,
        55,
        y,
        {
          width: 500
        }
      );

    y += 22;

  });

  y += 20;

  /* ====================================================
     BAR DRAWER
  ==================================================== */

  const drawBar = (
    label,
    value,
    yPos,
    color
  ) => {

    const safeValue =
      Number(value) || 0;

    doc
      .fillColor("#000")
      .fontSize(11)
      .text(
        label,
        40,
        yPos
      );

    /* ================= BACKGROUND ================= */

    doc
      .roundedRect(
        220,
        yPos + 5,
        220,
        12,
        6
      )
      .fill("#e5e7eb");

    /* ================= FILLED BAR ================= */

    doc
      .roundedRect(
        220,
        yPos + 5,
        safeValue * 2,
        12,
        6
      )
      .fill(color);

    /* ================= SCORE ================= */

    doc
      .fillColor("#000")
      .fontSize(10)
      .text(
        `${safeValue}/100`,
        460,
        yPos
      );

  };

  /* ====================================================
     PERFORMANCE SCORES
  ==================================================== */

  doc
    .fontSize(18)
    .fillColor("#0A2540")
    .text(
      "Performance Scores",
      40,
      y
    );

  y += 35;

  drawBar(
    "Confidence",
    evaluation.confidence,
    y,
    "#2ecc71"
  );

  y += 28;

  drawBar(
    "Communication",
    evaluation.communication,
    y,
    "#3498db"
  );

  y += 28;

  drawBar(
    "Technical Knowledge",
    evaluation.technicalKnowledge,
    y,
    "#9b59b6"
  );

  y += 28;

  drawBar(
    "Problem Solving",
    evaluation.problemSolving,
    y,
    "#f39c12"
  );

  y += 28;

  drawBar(
    "Correctness",
    evaluation.correctness,
    y,
    "#16a085"
  );

  y += 28;

  drawBar(
    "Overall Performance",
    evaluation.overall,
    y,
    "#e74c3c"
  );

  y += 60;

  /* ====================================================
     HIRING RECOMMENDATION
  ==================================================== */

  doc
    .fontSize(18)
    .fillColor("#0A2540")
    .text(
      "Hiring Recommendation",
      40,
      y
    );

  y += 30;

  let recommendation =
    "Needs significant improvement before industry readiness.";

  if (
    evaluation.overall >= 85
  ) {

    recommendation =
      "Strongly recommended for internship and entry-level opportunities.";

  } else if (
    evaluation.overall >= 70
  ) {

    recommendation =
      "Recommended for internship and fresher-level opportunities.";

  } else if (
    evaluation.overall >= 50
  ) {

    recommendation =
      "Can improve with additional mentorship and consistent practice.";

  }

  doc
    .fontSize(11)
    .fillColor("#333")
    .text(

      recommendation,

      40,
      y,

      {
        width: 520,
        align: "justify"
      }

    );

  /* ====================================================
     QUESTIONS PAGE
  ==================================================== */

  doc.addPage();

  doc
    .fontSize(22)
    .fillColor("#0A2540")
    .text(
      "Interview Questions & Answers"
    );

  doc.moveDown();

  interview.questions.forEach(
    (q, i) => {

      doc
        .fontSize(13)
        .fillColor("#0A2540")
        .text(
          `Q${i + 1}: ${q.question}`
        );

      let responseText =
        "Skipped by candidate";

      if (
        interview.interviewType ===
        "practical"
      ) {

        responseText =

          q.code &&
          q.code !== "__SKIPPED__"

            ? q.code

            : "Skipped by candidate";

      } else {

        responseText =

          q.answer &&
          q.answer !== "__SKIPPED__"

            ? q.answer

            : "Skipped by candidate";

      }

      doc
        .fontSize(11)
        .fillColor("#444")
        .text(
          `Answer: ${responseText}`
        );

      if (q.feedback) {

        doc
          .fontSize(10)
          .fillColor("#2563eb")
          .text(
            `AI Feedback: ${q.feedback}`
          );

      }

      doc.moveDown();

    }
  );

  /* ====================================================
     FINAL RESULT PAGE
  ==================================================== */

  doc.addPage();

  doc
    .fontSize(26)
    .fillColor("#0A2540")
    .text(
      "Final Evaluation",
      {
        align: "center"
      }
    );

  doc.moveDown();

  doc
    .fontSize(20)
    .fillColor(

      evaluation.finalResult ===
      "Strong Pass"

        ? "#27ae60"

        : evaluation.finalResult ===
          "Pass"

        ? "#2ecc71"

        : evaluation.finalResult ===
          "Borderline"

        ? "#f39c12"

        : "#e74c3c"

    )
    .text(

      evaluation.finalResult,

      {
        align: "center"
      }

    );

  doc.moveDown(2);

  doc
    .fontSize(13)
    .fillColor("#333")
    .text(

      "This AI-generated report reflects the candidate's interview performance based on technical understanding, communication quality, confidence, and problem-solving ability.",

      {
        align: "center",
        width: 500
      }

    );

  /* ====================================================
     WATERMARK
  ==================================================== */

  doc
    .opacity(0.06)
    .fontSize(70)
    .fillColor("#0A2540")
    .rotate(
      -30,
      {
        origin: [300, 400]
      }
    )
    .text(
      "e-Definers",
      90,
      400
    );

  /* ====================================================
     FINALIZE PDF
  ==================================================== */

  doc.end();

  /* ====================================================
     WAIT FOR FILE WRITE
  ==================================================== */

  await new Promise(
    (resolve, reject) => {

      stream.on(
        "finish",
        resolve
      );

      stream.on(
        "error",
        reject
      );

    }
  );

  /* ====================================================
     CLOUDINARY UPLOAD
  ==================================================== */

  const uploadResult =
    await cloudinary.uploader.upload(

      filePath,

      {

        resource_type: "raw",

        folder:
          "ai-interview-reports",

        format: "pdf",

        use_filename: true,

        unique_filename: true

      }

    );

  /* ====================================================
     DOWNLOADABLE URL
  ==================================================== */

  const downloadUrl =
    uploadResult.secure_url.replace(

      "/raw/upload/",

      "/raw/upload/fl_attachment/"

    );

  /* ====================================================
     DELETE LOCAL FILE
  ==================================================== */

  if (fs.existsSync(filePath)) {

    fs.unlinkSync(filePath);

  }

  /* ====================================================
     RETURN URL
  ==================================================== */

  return downloadUrl;

};