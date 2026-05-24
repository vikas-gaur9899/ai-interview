import { askLLM } from "./groq.service.js";

/* ====================================================
   SANITIZE FINAL RESULT
==================================================== */

const sanitizeFinalResult = (raw) => {

  if (!raw || typeof raw !== "string") {
    return "Borderline";
  }

  const val =
    raw.toLowerCase().trim();

  if (val.includes("strong pass")) {
    return "Strong Pass";
  }

  if (val.includes("pass")) {
    return "Pass";
  }

  if (val.includes("fail")) {
    return "Fail";
  }

  return "Borderline";

};

/* ====================================================
   SAFE NUMBER
==================================================== */

const safeNum = (val) => {

  const n = Number(val);

  if (isNaN(n)) {
    return 0;
  }

  return Math.min(
    Math.max(
      Math.round(n),
      0
    ),
    100
  );

};

/* ====================================================
   EVALUATE INTERVIEW
==================================================== */

export const evaluateInterview =
  async (interview) => {

    /* ====================================================
       INTERVIEW TYPE
    ==================================================== */

    const isPractical =
      interview.interviewType ===
      "practical";

    /* ====================================================
       DYNAMIC JSON FORMAT
    ==================================================== */

    const jsonFormat =
      isPractical

        ? `
{
  "logicBuilding": number (0-100),
  "syntaxAccuracy": number (0-100),
  "problemSolving": number (0-100),
  "codeQuality": number (0-100),
  "correctness": number (0-100),
  "overall": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "summary": string,
  "insights": string[],
  "improvements": string[],
  "finalResult": "Strong Pass" | "Pass" | "Borderline" | "Fail"
}
`

        : `
{
  "communication": number (0-100),
  "confidence": number (0-100),
  "technicalKnowledge": number (0-100),
  "correctness": number (0-100),
  "overall": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "summary": string,
  "insights": string[],
  "improvements": string[],
  "finalResult": "Strong Pass" | "Pass" | "Borderline" | "Fail"
}
`;

    /* ====================================================
       PRACTICAL RULES
    ==================================================== */

    const practicalRules = isPractical
      ? `

========================
PRACTICAL INTERVIEW RULES
========================

The candidate is a FRESHER.

VERY IMPORTANT:

- Do NOT behave like a senior Google interviewer
- Do NOT be overly harsh
- Minor syntax mistakes are acceptable
- Type annotations are OPTIONAL
- Simple logic is acceptable
- If logic is correct, give good marks
- Encourage the candidate
- Keep feedback SHORT and realistic
- Avoid huge paragraphs

========================
SCORING GUIDE
========================

Correct logic + good syntax:
70-90

Partially correct:
40-65

Attempted but weak:
20-40

Skipped:
0-10

========================
STRICT FEEDBACK RULE
========================

BAD:
Huge detailed criticism.

GOOD:
"Good attempt. Logic is correct."

GOOD:
"Correct approach but syntax needs improvement."

GOOD:
"Nice implementation for a fresher."

========================
VERY IMPORTANT
========================

If candidate code works logically:
DO NOT give extremely low marks.

`
      : "";

    /* ====================================================
       PROMPT
    ==================================================== */

    const prompt = `

You are a professional AI Interview Evaluator working at e-Definers Technologies.

========================
STRICT OUTPUT RULES
========================

- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT add explanations
- Do NOT add extra keys
- NEVER leave keys empty
- Summary must always be realistic

========================
JSON FORMAT
========================

${jsonFormat}

========================
FINAL RESULT RULES
========================

overall >= 85:
Strong Pass

overall >= 70:
Pass

overall >= 50:
Borderline

overall < 50:
Fail

========================
INTERVIEW TYPE
========================

Interview Type:
${interview.interviewType}

Difficulty:
${interview.difficulty || "N/A"}

${practicalRules}

========================
EVALUATION RULES
========================

TECHNICAL:
- Evaluate conceptual clarity
- Communication
- Technical understanding
- Accuracy

HR:
- Evaluate confidence
- Fluency
- Personality
- Communication

PRACTICAL:
- Evaluate logic
- Syntax
- Problem solving
- Code quality
- Correctness

========================
SPECIAL CASES
========================

If answer is "__SKIPPED__":
- Give low marks
- Add weakness

If answer is "__EMPTY__":
- Give low marks
- Add weakness

If answer is partially correct:
- Give partial credit

========================
QUESTIONS & ANSWERS
========================

${interview.questions.map((q, i) => {

  let answer = "__SKIPPED__";

  if (isPractical) {

    answer =
      q.code &&
      q.code !== "__SKIPPED__"

        ? q.code

        : "__SKIPPED__";

  } else {

    answer =
      q.answer &&
      q.answer !== "__SKIPPED__"

        ? q.answer

        : "__SKIPPED__";

  }

  return `

Question ${i + 1}:
${q.question}

Answer:
${answer}

`;

}).join("\n")}

========================
IMPORTANT
========================

- Keep evaluation realistic
- Fresher-friendly evaluation
- No harsh criticism
- Give practical partial credit
- Return ONLY JSON

`;

    /* ====================================================
       CALL AI
    ==================================================== */

    const rawResponse =
      await askLLM(prompt);

    const cleaned =
      rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    /* ====================================================
       BUILD RESULT
    ==================================================== */

    const buildResult = (
      parsed
    ) => {

      if (isPractical) {

        return {

          logicBuilding:
            safeNum(
              parsed.logicBuilding
            ),

          syntaxAccuracy:
            safeNum(
              parsed.syntaxAccuracy
            ),

          problemSolving:
            safeNum(
              parsed.problemSolving
            ),

          codeQuality:
            safeNum(
              parsed.codeQuality
            ),

          correctness:
            safeNum(
              parsed.correctness
            ),

          overall:
            safeNum(
              parsed.overall
            ),

          strengths:
            Array.isArray(
              parsed.strengths
            )
              ? parsed.strengths
              : [],

          weaknesses:
            Array.isArray(
              parsed.weaknesses
            )
              ? parsed.weaknesses
              : [],

          summary:
            typeof parsed.summary ===
            "string"

              ? parsed.summary

              : "Candidate showed average coding performance.",

          insights:
            Array.isArray(
              parsed.insights
            )
              ? parsed.insights
              : [],

          improvements:
            Array.isArray(
              parsed.improvements
            )
              ? parsed.improvements
              : [],

          finalResult:
            sanitizeFinalResult(
              parsed.finalResult
            )

        };

      }

      /* ====================================================
         NON PRACTICAL
      ==================================================== */

      return {

        communication:
          safeNum(
            parsed.communication
          ),

        confidence:
          safeNum(
            parsed.confidence
          ),

        technicalKnowledge:
          safeNum(
            parsed.technicalKnowledge
          ),

        correctness:
          safeNum(
            parsed.correctness
          ),

        overall:
          safeNum(
            parsed.overall
          ),

        strengths:
          Array.isArray(
            parsed.strengths
          )
            ? parsed.strengths
            : [],

        weaknesses:
          Array.isArray(
            parsed.weaknesses
          )
            ? parsed.weaknesses
            : [],

        summary:
          typeof parsed.summary ===
          "string"

            ? parsed.summary

            : "Candidate showed mixed performance during the interview.",

        insights:
          Array.isArray(
            parsed.insights
          )
            ? parsed.insights
            : [],

        improvements:
          Array.isArray(
            parsed.improvements
          )
            ? parsed.improvements
            : [],

        finalResult:
          sanitizeFinalResult(
            parsed.finalResult
          )

      };

    };

    /* ====================================================
       TRY NORMAL PARSE
    ==================================================== */

    try {

      const parsed =
        JSON.parse(cleaned);

      return buildResult(parsed);

    } catch (err) {

      console.error(
        "❌ Evaluation Parse Failed"
      );

      /* ====================================================
         REPAIR
      ==================================================== */

      try {

        const repaired =
          cleaned
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        const parsed =
          JSON.parse(repaired);

        return buildResult(parsed);

      } catch {

        console.error(
          "❌ Repair Failed"
        );

        /* ====================================================
           FALLBACK
        ==================================================== */

        if (isPractical) {

          return {

            logicBuilding: 0,
            syntaxAccuracy: 0,
            problemSolving: 0,
            codeQuality: 0,
            correctness: 0,
            overall: 0,
            strengths: [],
            weaknesses: [
              "Evaluation failed"
            ],
            summary:
              "Interview evaluation failed.",
            insights: [],
            improvements: [],
            finalResult: "Fail"

          };

        }

        return {

          communication: 0,
          confidence: 0,
          technicalKnowledge: 0,
          correctness: 0,
          overall: 0,
          strengths: [],
          weaknesses: [
            "Evaluation failed"
          ],
          summary:
            "Interview evaluation failed.",
          insights: [],
          improvements: [],
          finalResult: "Fail"

        };

      }

    }

  };