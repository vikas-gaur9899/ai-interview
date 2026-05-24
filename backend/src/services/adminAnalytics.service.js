import Interview from "../model/Interview.js";
import Student from "../model/Student.js";

/* ====================================================
   GET STUDENT ANALYTICS
==================================================== */

export const getStudentAnalytics = async (
  studentId
) => {

  /* ====================================================
     FETCH ALL INTERVIEWS
  ==================================================== */

  const interviews =
    await Interview.find({
      studentId
    }).sort({
      createdAt: 1
    });

  /* ====================================================
     FETCH STUDENT
  ==================================================== */

  const student =
    await Student.findOne({
      studentId
    });

  /* ====================================================
     INTERVIEW STATS
  ==================================================== */

  const stats = {

    total:
      interviews.length,

    technical:
      interviews.filter(
        (i) =>
          i.interviewType ===
          "technical"
      ).length,

    hr:
      interviews.filter(
        (i) =>
          i.interviewType ===
          "hr"
      ).length,

    practical:
      interviews.filter(
        (i) =>
          i.interviewType ===
          "practical"
      ).length

  };

  /* ====================================================
     CHART DATA
  ==================================================== */

  const charts = {

    technical: [],

    hr: [],

    practical: []

  };

  /* ====================================================
     PREPARE CHARTS
  ==================================================== */

  interviews.forEach((i) => {

    charts[
      i.interviewType
    ]?.push({

      date:
        new Date(
          i.createdAt
        ).toLocaleDateString(),

      score:
        i.scores?.overall || 0

    });

  });

  /* ====================================================
     ALL SCORES
  ==================================================== */

  const scores = interviews
    .map(
      (i) =>
        i.scores?.overall
    )
    .filter(Boolean);

  /* ====================================================
     AVERAGE SCORE
  ==================================================== */

  const avgScore =

    scores.length > 0

      ? Math.round(

          scores.reduce(
            (a, b) => a + b,
            0
          ) / scores.length

        )

      : 0;

  /* ====================================================
     BEST SCORE
  ==================================================== */

  const bestScore =

    scores.length > 0

      ? Math.max(...scores)

      : 0;

  /* ====================================================
     LAST SCORE
  ==================================================== */

  const lastScore =

    scores.length > 0

      ? scores[
          scores.length - 1
        ]

      : 0;

  /* ====================================================
     TYPE-WISE AVERAGE STORAGE
  ==================================================== */

  const typeAvg = {

    technical: [],

    hr: [],

    practical: []

  };

  /* ====================================================
     STORE TYPE SCORES
  ==================================================== */

  interviews.forEach((i) => {

    if (i.scores?.overall) {

      typeAvg[
        i.interviewType
      ]?.push(
        i.scores.overall
      );

    }

  });

  /* ====================================================
     CALCULATE TYPE AVERAGES
  ==================================================== */

  const avgByType = {

    technical:

      typeAvg.technical.length > 0

        ? Math.round(

            typeAvg.technical.reduce(
              (a, b) => a + b,
              0
            ) /
              typeAvg.technical.length

          )

        : 0,

    hr:

      typeAvg.hr.length > 0

        ? Math.round(

            typeAvg.hr.reduce(
              (a, b) => a + b,
              0
            ) /
              typeAvg.hr.length

          )

        : 0,

    practical:

      typeAvg.practical.length > 0

        ? Math.round(

            typeAvg.practical.reduce(
              (a, b) => a + b,
              0
            ) /
              typeAvg.practical.length

          )

        : 0

  };

  /* ====================================================
     DETECT WEAKEST AREA
  ==================================================== */

  const weakestArea =
    Object.keys(avgByType)
      .reduce((a, b) =>

        avgByType[a] <
        avgByType[b]

          ? a

          : b

      );

  /* ====================================================
     ALERT SYSTEM
  ==================================================== */

  let alert = null;

  if (avgScore < 50) {

    alert =
      "⚠ Overall performance is very low";

  }

  else if (lastScore < avgScore) {

    alert =
      "📉 Performance dropping recently";

  }

  else if (avgScore > 80) {

    alert =
      "🚀 Excellent performance";

  }

  /* ====================================================
     INTERVIEW HISTORY
  ==================================================== */

  const history = interviews.map(
    (i) => ({

      date:
        i.createdAt,

      type:
        i.interviewType,

      score:
        i.scores?.overall || 0,

      result:
        i.scores?.overall >= 75

          ? "Good"

          : "Needs Improvement",

      pdf:
        i.pdfReportPath

    })
  );

  /* ====================================================
     FINAL RESPONSE
  ==================================================== */

  return {

    student: {

      name:
        student?.name ||
        "Unknown",

      course:
        student?.course ||
        "-"

    },

    stats,

    charts,

    metrics: {

      avgScore,

      bestScore,

      lastScore

    },

    insights: {

      weakestArea,

      avgByType,

      alert

    },

    history

  };

};