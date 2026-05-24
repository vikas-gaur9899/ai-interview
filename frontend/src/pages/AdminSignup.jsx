import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!name || !email || !phone || !password) {
      setError("All fields are required");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses allowed");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const signup = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/admin/signup", {
        name,
        email,
        phone,
        password
      });

      setSuccess("✅ Request sent for approval");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-card">
        <h2>Admin Signup</h2>
        <p className="admin-sub">Request admin access</p>

        <input
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <button onClick={signup} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <span
          className="admin-link"
          onClick={() => navigate("/admin/login")}
        >
          Back to Login
        </span>
      </div>
    </div>
  );
}