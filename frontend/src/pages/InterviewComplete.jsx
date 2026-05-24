import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

export default function InterviewComplete() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [showExitPopup, setShowExitPopup] = useState(false);

  const { interviewId } = useParams();
  console.log("interview id in complete page ", interviewId);

  /* ====================================================
     BLOCK BACK BUTTON — show popup instead
  ==================================================== */

  useEffect(() => {

    // Push two entries so there is always one to consume
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);

    const blockBack = () => {
      // Push again to keep the stack full
      window.history.pushState(null, "", window.location.href);
      // Show the popup
      setShowExitPopup(true);
    };

    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };

  }, []);

  /* ====================================================
     SEND EMAIL
  ==================================================== */

  const sendEmail = async () => {
    if (!email) {
      alert("Please enter Gmail");
      return;
    }

    try {
      setStatus("Sending...");

      await axios.post("http://localhost:5000/api/interview/send-email", {
        interviewId: interviewId,
        email
      });

      setStatus("✅ PDF sent to your Gmail");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send email");
    }
  };

  return (
    <>
      <Navbar />

      {/* ====================================================
         BACK BUTTON POPUP
      ==================================================== */}

      {showExitPopup && (
        <div className="exit-popup-overlay">
          <div className="exit-popup-card">

            <h3>⚠ Leave this page?</h3>

            <p>
              Your interview is already submitted. If you go back,
              you will not be able to return to this report page.
            </p>

            <div className="exit-popup-actions">

              <button
                className="exit-popup-stay"
                onClick={() => setShowExitPopup(false)}
              >
                Stay on Page
              </button>

              <button
                className="exit-popup-leave"
                onClick={() => {
                  // Remove the listeners then navigate away
                  window.location.href = "/";
                }}
              >
                Go to Home
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ====================================================
         MAIN CONTENT
      ==================================================== */}

      <section className="complete-section">
        <div className="complete-wrapper">

          {/* LEFT IMAGE */}
          <div className="complete-image">
            <img
              src="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
              alt="Interview Complete"
            />
            <div className="complete-image-overlay">
              <h3>Interview Completed 🎉</h3>
              <p>Your AI-generated report is ready</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="complete-card">
            <h2>Interview Finished</h2>
            <p className="complete-sub">
              Enter your Gmail to receive a detailed PDF report
            </p>

            <input
              type="email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendEmail}>
              📩 Send PDF to Gmail
            </button>

            {status && (
              <div className="complete-status">
                {status}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}