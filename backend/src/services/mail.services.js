import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

/* ====================================================
   TRANSPORT
==================================================== */

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.MAIL_USER,

      pass:
        process.env.MAIL_PASS

    }

  });

/* ====================================================
   SEND REPORT EMAIL
==================================================== */

export const sendReportEmail =
  async (

    to,

    pdfPath = null,

    customText = null,

    studentName = "Candidate"

  ) => {

    try {

      /* ====================================================
         REPORT EMAIL HTML
      ==================================================== */

      const reportHTML = `

<div style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 30px;">

  <div style="max-width: 700px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">

    <!-- HEADER -->

    <div style="background: #0A2540; color: white; padding: 30px; text-align: center;">

      <h1 style="margin:0;">
        e-Definers Technologies
      </h1>

      <p style="margin-top:10px; color:#dbe7f3;">
        AI Interview Evaluation Report
      </p>

    </div>

    <!-- BODY -->

    <div style="padding: 35px; color: #333; line-height: 1.7;">

      <h2 style="margin-top:0;">
        Hello ${studentName},
      </h2>

      <p>
        Thank you for attending your AI Interview session with 
        <strong>e-Definers Technologies</strong>.
      </p>

      <p>
        Your interview evaluation has been completed successfully.
        The report contains a detailed AI-based analysis of your:
      </p>

      <ul>
        <li>Technical Knowledge</li>
        <li>Communication Skills</li>
        <li>Confidence Level</li>
        <li>Problem Solving Ability</li>
        <li>Overall Performance</li>
      </ul>

      <p>
        You can download your complete interview report using the button below.
      </p>

      <!-- BUTTON -->

      <div style="margin: 35px 0; text-align:center;">

        <a
          href="${pdfPath}"
          style="
            background:#0A2540;
            color:white;
            padding:14px 30px;
            border-radius:8px;
            text-decoration:none;
            font-weight:bold;
            display:inline-block;
          "
        >
          Download Interview Report
        </a>

      </div>

      <p>
        We appreciate your participation and encourage you to continue improving your skills through consistent learning and practice.
      </p>

      <p>
        We wish you great success in your future career journey.
      </p>

      <br/>

      <p>
        Best Regards,<br/>
        <strong>e-Definers Technologies</strong><br/>
        AI Interview Platform Team
      </p>

    </div>

    <!-- FOOTER -->

    <div style="background:#f1f5f9; padding:20px; text-align:center; font-size:12px; color:#666;">

      © ${new Date().getFullYear()} e-Definers Technologies.
      All rights reserved.

    </div>

  </div>

</div>

`;

      /* ====================================================
         SCHEDULE EMAIL HTML
      ==================================================== */

      const scheduleHTML = `

<div style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 30px;">

  <div style="max-width: 700px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">

    <!-- HEADER -->

    <div style="background: #0A2540; color: white; padding: 30px; text-align: center;">

      <h1 style="margin:0;">
        e-Definers Technologies
      </h1>

      <p style="margin-top:10px; color:#dbe7f3;">
        AI Interview Platform
      </p>

    </div>

    <!-- BODY -->

    <div style="padding: 35px; color: #333; line-height: 1.7;">

      <h2 style="margin-top:0;">
        Hello ${studentName},
      </h2>

      <p>
        Your AI Interview has been scheduled successfully with 
        <strong>e-Definers Technologies</strong>.
      </p>

      <div style="background:#f8fafc; padding:20px; border-radius:10px; margin:25px 0;">

        <pre style="white-space:pre-wrap; font-family:Arial; margin:0;">${customText || ""}</pre>

      </div>

      <p>
        Please ensure:
      </p>

      <ul>
        <li>Stable internet connection</li>
        <li>Quiet environment</li>
        <li>Microphone access enabled</li>
        <li>Fullscreen mode during interview</li>
      </ul>

      <p>
        We wish you the very best for your interview.
      </p>

      <br/>

      <p>
        Best Regards,<br/>
        <strong>e-Definers Technologies</strong><br/>
        AI Interview Platform Team
      </p>

    </div>

    <!-- FOOTER -->

    <div style="background:#f1f5f9; padding:20px; text-align:center; font-size:12px; color:#666;">

      © ${new Date().getFullYear()} e-Definers Technologies.
      All rights reserved.

    </div>

  </div>

</div>

`;

      /* ====================================================
         MAIL OPTIONS
      ==================================================== */

      const mailOptions = {

        from:
          process.env.MAIL_USER,

        to,

        subject:

          pdfPath

            ? "Your AI Interview Report – e-Definers Technologies"

            : "AI Interview Scheduled – e-Definers Technologies",

        html:

          pdfPath

            ? reportHTML

            : scheduleHTML

      };

      /* ====================================================
         SEND MAIL
      ==================================================== */

      await transporter.sendMail(
        mailOptions
      );

      console.log(
        "✅ Email sent to:",
        to
      );

    } catch (err) {

      console.error(
        "❌ Email error:",
        err
      );

      throw err;

    }

  };