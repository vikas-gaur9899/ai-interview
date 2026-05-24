import { useState } from "react";

import Navbar from "./Navbar";

import {
  useNavigate
} from "react-router-dom";

import API from "../api/api";

/* ====================================================
   INTERVIEW ACCESS PAGE
==================================================== */

export default function InterviewAccess() {

  const navigate =
    useNavigate();

  /* ====================================================
     STATES
  ==================================================== */

  const [token, setToken] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [name, setName] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ====================================================
     VALIDATE ACCESS TOKEN
  ==================================================== */

  const validateAccess =
    async () => {

      /* ====================================================
         REQUIRED FIELD VALIDATION
      ==================================================== */

      if (
        !token ||
        !studentId ||
        !name
      ) {

        setError(
          "All fields are required"
        );

        return;

      }

      try {

        setLoading(true);

        setError("");

        /* ====================================================
           VALIDATE TOKEN
        ==================================================== */

        await API.post(
          "/token/validate",
          {

            token,

            studentId,

            name

          }
        );

        /* ====================================================
           SAVE STUDENT SESSION
        ==================================================== */

        localStorage.setItem(
          "studentId",
          studentId
        );

        localStorage.setItem(
          "studentName",
          name
        );

        /* ====================================================
           REDIRECT TO RULES PAGE
           TOKEN WILL GO IN URL
        ==================================================== */

        navigate(
          `/rules?token=${token}`
        );

      } catch (err) {

        console.error(err);

        const message =

          err.response?.data?.message ||

          "Invalid access";

        /* ====================================================
           SHOW ALERT FOR SPECIFIC ERRORS
        ==================================================== */

        if (

          message ===
            "Student ID does not match token"

          ||

          message ===
            "Student name does not match"

        ) {

          alert(message);

        }

        setError(message);

      } finally {

        setLoading(false);

      }

    };

  return (
    <>
      <Navbar />

      <section className="ai-form-section">

        <div className="ai-form-wrapper">

          <div className="ai-form">

            {/* ====================================================
               TITLE
            ==================================================== */}

            <h2>
              Interview Access
            </h2>

            <p className="subtitle">

              Enter your token to start interview

            </p>

            {/* ====================================================
               INTERVIEW TOKEN
            ==================================================== */}

            <input
              placeholder="Interview Token"
              value={token}
              onChange={(e) =>
                setToken(
                  e.target.value
                )
              }
            />

            {/* ====================================================
               STUDENT ID
            ==================================================== */}

            <input
              placeholder="Student ID"
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value
                )
              }
            />

            {/* ====================================================
               FULL NAME
            ==================================================== */}

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            {/* ====================================================
               ERROR MESSAGE
            ==================================================== */}

            {error && (

              <div className="form-error">

                {error}

              </div>

            )}

            {/* ====================================================
               VALIDATE BUTTON
            ==================================================== */}

            <button
              onClick={
                validateAccess
              }
              disabled={loading}
            >

              {loading

                ? "Validating..."

                : "Validate & Continue"}

            </button>

          </div>

        </div>

      </section>
    </>
  );

}