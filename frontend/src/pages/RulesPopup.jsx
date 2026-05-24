import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import Navbar from "./Navbar";

/* ====================================================
   RULES POPUP PAGE
==================================================== */

export default function RulesPopup() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  /* ====================================================
     AGREEMENT STATE
  ==================================================== */

  const [accepted, setAccepted] =
    useState(false);

  /* ====================================================
     LOADING STATE
  ==================================================== */

  const [loading, setLoading] =
    useState(false);

  /* ====================================================
     GET TOKEN FROM URL
  ==================================================== */

  const params =
    new URLSearchParams(
      location.search
    );

  const token =
    params.get("token");

  /* ====================================================
     AUTO SCROLL TOP
  ==================================================== */

  useEffect(() => {

    window.scrollTo(0, 0);

  }, []);

  /* ====================================================
     START INTERVIEW
  ==================================================== */

  const start = async () => {

    if (!accepted) return;

    setLoading(true);

    /* ====================================================
       SMALL DELAY FOR UX
    ==================================================== */

    setTimeout(() => {

      navigate(
        `/interview-room/${token}`
      );

    }, 800);

  };

  return (
    <>
      <Navbar />

      {/* ====================================================
         MAIN WRAPPER
      ==================================================== */}

      <div className="rules-page-wrapper">

        {/* ====================================================
           RULE CARD
        ==================================================== */}

        <div className="rules-card">

          {/* ====================================================
             HEADER
          ==================================================== */}

          <div className="rules-header">

            <h1>
              AI Interview Guidelines
            </h1>

            <p>
              Please carefully read all instructions before starting your interview.
            </p>

          </div>

          {/* ====================================================
             RULES GRID
          ==================================================== */}

          <div className="rules-grid">

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🔒
              </div>

              <div>

                <h3>
                  One-Time Secure Access
                </h3>

                <p>
                  Your interview token can only be used once.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                📷
              </div>

              <div>

                <h3>
                  Camera Must Stay ON
                </h3>

                <p>
                  Camera access is mandatory during the interview session.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🎤
              </div>

              <div>

                <h3>
                  Microphone Permission
                </h3>

                <p>
                  Allow microphone access for technical and HR rounds.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🚫
              </div>

              <div>

                <h3>
                  No Back Navigation
                </h3>

                <p>
                  Using browser back navigation is restricted during interview.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🔄
              </div>

              <div>

                <h3>
                  No Page Refresh
                </h3>

                <p>
                  Refreshing or reopening the page may terminate your session.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🖥
              </div>

              <div>

                <h3>
                  Fullscreen Monitoring
                </h3>

                <p>
                  The interview system monitors fullscreen activity.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                ⚠
              </div>

              <div>

                <h3>
                  Tab Switching Restricted
                </h3>

                <p>
                  Avoid changing browser tabs during the interview.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                ⏱
              </div>

              <div>

                <h3>
                  Timed Questions
                </h3>

                <p>
                  Every question has a limited answering duration.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                💻
              </div>

              <div>

                <h3>
                  Practical Round Rules
                </h3>

                <p>
                  Copy, paste, and right-click actions are restricted in coding rounds.
                </p>

              </div>

            </div>

            {/* ====================================================
               RULE ITEM
            ==================================================== */}

            <div className="rule-item">

              <div className="rule-icon">
                🤖
              </div>

              <div>

                <h3>
                  AI Evaluation Enabled
                </h3>

                <p>
                  Your answers, communication, and coding responses are AI evaluated.
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================
             WARNING BOX
          ==================================================== */}

          <div className="rules-warning-box">

            ⚠ Any suspicious activity may automatically terminate the interview session.

          </div>

          {/* ====================================================
             AGREEMENT
          ==================================================== */}

          <div className="rules-agreement">

            <input
              type="checkbox"
              id="agree"
              checked={accepted}
              onChange={() =>
                setAccepted(
                  !accepted
                )
              }
            />

            <label htmlFor="agree">

              I have read and understood all interview rules and guidelines.

            </label>

          </div>

          {/* ====================================================
             START BUTTON
          ==================================================== */}

          <button
            className={`rules-start-btn ${
              accepted
                ? "active"
                : "disabled"
            }`}
            onClick={start}
            disabled={!accepted || loading}
          >

            {loading
              ? "Launching Interview..."
              : "Start Interview"}

          </button>

        </div>

      </div>
    </>
  );

}