import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const sections = useRef([]);

  /* GSAP SECTION ANIMATIONS */
  useEffect(() => {
    sections.current.forEach((sec) => {
      if (!sec) return;

      gsap.from(sec, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 80%",
        },
      });
    });
  }, []);

  /* HASH BASED DIRECT JUMP (IMPORTANT FIX) */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const section = document.getElementById(id);

      if (section) {
        // wait for DOM + GSAP layout
        setTimeout(() => {
          section.scrollIntoView({ behavior: "auto" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            The World’s <span>Most Advanced</span><br />
            AI Interview Platform
          </h1>

          <p>
            100% audio-only AI interviews with real human-like questions,
            follow-ups, and detailed performance evaluation.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/access")}
            >
              Start Interview
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/#how-it-works")}
            >
              How it Works
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
            alt="AI Interview"
          />
        </div>
      </section>

      {/* WHY AI INTERVIEW */}
      <section
        className="feature-grid"
        ref={(el) => (sections.current[0] = el)}
      >
        <h2>
          Why <span className="highlight">AI Interviews</span>?
        </h2>

        <div className="grid">
          <div className="card card-blue">
            <div className="icon">🤖</div>
            <h3>AI-Powered, Human-Centric</h3>
            <p>
              Experience interviews that feel natural and conversational
              while AI evaluates answers with precision.
            </p>
          </div>

          <div className="card card-purple">
            <div className="icon">⚖️</div>
            <h3>Fair & Structured Assessment</h3>
            <p>
              Every candidate is assessed on the same parameters,
              ensuring fairness and consistency.
            </p>
          </div>

          <div className="card card-green">
            <div className="icon">🎯</div>
            <h3>Improves Confidence & Clarity</h3>
            <p>
              Practice real interview scenarios and improve clarity,
              confidence, and communication.
            </p>
          </div>

          <div className="card card-orange">
            <div className="icon">📄</div>
            <h3>Instant Feedback & Reports</h3>
            <p>
              Receive detailed AI-generated feedback, scores,
              and a downloadable PDF report instantly.
            </p>
          </div>
        </div>

        {/* MOVING STRIP */}
        <div className="scroll-strip">
          <div className="scroll-track">
            <span>🎙 Real Interview Simulation</span>
            <span>📊 Grammar & Pronunciation Analysis</span>
            <span>🧠 Smart Follow-up Questions</span>
            <span>⏱ 15-Minute Timed Interviews</span>
            <span>📧 Gmail Report Delivery</span>
            <span>📈 Track Improvement Over Time</span>

            {/* duplicate */}
            <span>🎙 Real Interview Simulation</span>
            <span>📊 Grammar & Pronunciation Analysis</span>
            <span>🧠 Smart Follow-up Questions</span>
            <span>⏱ 15-Minute Timed Interviews</span>
            <span>📧 Gmail Report Delivery</span>
            <span>📈 Track Improvement Over Time</span>
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section
        className="split-section"
        ref={(el) => (sections.current[1] = el)}
      >
        <div className="split-content">
          <div className="text">
            <h2>
              How <span className="highlight">AI Interview</span> Helps You
            </h2>

            <p className="desc">
              Our AI-driven interview system simulates real-world
              interview environments and helps you improve with
              every attempt.
            </p>

            <ul>
              <li><span className="bullet-icon">🎙</span> Real interview-style questioning</li>
              <li><span className="bullet-icon">🧠</span> Smart follow-up questions</li>
              <li><span className="bullet-icon">📊</span> Grammar & pronunciation analysis</li>
              <li><span className="bullet-icon">🚀</span> Confidence & clarity improvement</li>
            </ul>
          </div>

          <div className="image">
            <img
              src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b"
              alt="Interview Skills"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="steps"
        ref={(el) => (sections.current[2] = el)}
      >
        <h2>How It Works</h2>

        <div className="step-grid">
          <div className="step">1️⃣ Enter Details</div>
          <div className="step">2️⃣ Select Interview Type</div>
          <div className="step">3️⃣ Give Audio Interview</div>
          <div className="step">4️⃣ Get PDF Feedback</div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contact" className="footer">
        <img
          src="https://dummyimage.com/120x40/000/fff&text=e-Definers"
          alt="e-Definers"
        />
        <p>Built by e-Definers</p>
      </footer>

    </div>
  );
}
