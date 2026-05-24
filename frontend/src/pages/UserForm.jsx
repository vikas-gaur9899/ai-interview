import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function UserForm() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    mobile: "",
    course: ""
  });

  // Indian mobile validation: starts with 6-9 & total 10 digits
  const isValidIndianNumber = (num) => /^[6-9]\d{9}$/.test(num);

  const submit = () => {
    if (!user.name || !user.mobile || !user.course) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidIndianNumber(user.mobile)) {
      alert("Enter a valid Indian mobile number");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/interview-type");
  };

  return (
    <>
      {/* SAME NAVBAR AS HOME */}
      <Navbar />

      <section className="ai-form-section">
        <div className="ai-form-wrapper">

          {/* LEFT IMAGE */}
          <div className="ai-form-image">
            <img src="/images/form-image.jpg" alt="AI Interview" />
            <div className="ai-form-image-content">
              <h3>AI Audio Interviews</h3>
              <p>Human-like questions · Smart evaluation · PDF report</p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="ai-form">
            <h2>Apply for AI Interview</h2>
            <p className="subtitle">Enter your details to begin</p>

            <input
              type="text"
              placeholder="Full Name"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              value={user.mobile}
              onChange={(e) =>
                setUser({
                  ...user,
                  mobile: e.target.value.replace(/\D/g, "")
                })
              }
            />

            <select
              value={user.course}
              onChange={(e) =>
                setUser({ ...user, course: e.target.value })
              }
            >
              <option value="">Select Course</option>
              <option>Web Developer</option>
              <option>Video Editing</option>
              <option>AI / ML Engineer</option>
              <option>Deep Learning</option>
              <option>Data Analyst</option>
              <option>Data Science</option>
            </select>

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button
                className="back-btn"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>

              <button onClick={submit}>
                Continue →
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
