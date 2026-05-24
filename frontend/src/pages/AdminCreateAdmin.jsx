import { useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";

export default function AdminCreateAdmin() {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  // ❌ Only super admin allowed
  if (admin?.role !== "super_admin") {
    return <h2 style={{ padding: "40px" }}>Access Denied</h2>;
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    course: ""
  });

  const [password, setPassword] = useState("");
  const [sendMail, setSendMail] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // ✅ Remove leading spaces
    if (name === "name" || name === "course") {
      value = value.replace(/^\s+/, "");
    }

    // ✅ Avoid multiple spaces in name
    if (name === "name") {
      value = value.replace(/\s{2,}/g, " ");
    }

    // ✅ Phone only numbers
    if (name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      setError("");
      setMsg("");
      setPassword("");

      // ✅ Trim all values
      const cleaned = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        course: form.course.trim()
      };

      // ❌ Required validation
      if (
        !cleaned.name ||
        !cleaned.email ||
        !cleaned.phone ||
        !cleaned.gender ||
        !cleaned.course
      ) {
        return setError("All fields are required");
      }

      // ❌ Name validation
      if (!/^[A-Za-z\s]+$/.test(cleaned.name)) {
        return setError("Name must contain only letters");
      }

      // ❌ Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleaned.email)) {
        return setError("Invalid email");
      }

      // ❌ Phone validation (India)
      if (!/^[6-9]\d{9}$/.test(cleaned.phone)) {
        return setError("Invalid phone number");
      }

      // 🚀 API CALL
      const res = await API.post("/admin/create-admin", {
        ...cleaned,
        sendEmail: sendMail
      });

      setPassword(res.data.password);
      setMsg("✅ Admin created successfully");

      // 🔄 Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        course: ""
      });

    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-create-wrapper">

        {/* LEFT PANEL */}
        <div className="admin-create-left">
          <img src="/images/admincreate.jpg" alt="AI" />
          <h2>Create Admin</h2>
          <p>Super admin can create and manage admins</p>
        </div>

        {/* RIGHT FORM */}
        <div className="admin-create-right">
          <div className="admin-create-card">

            <h2>Create Admin</h2>

            {/* NAME */}
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            {/* EMAIL */}
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            {/* PHONE */}
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            {/* GENDER */}
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* COURSE */}
            <input
              name="course"
              placeholder="Course Teaching"
              value={form.course}
              onChange={handleChange}
            />

            {/* EMAIL OPTION */}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={sendMail}
                onChange={(e) => setSendMail(e.target.checked)}
              />
              Send password to email
            </label>

            {/* BUTTON */}
            <button onClick={submit}>
              Create Admin
            </button>

            {/* PASSWORD BOX */}
            {password && (
              <div className="password-box">
                <p>Password: {password}</p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(password)
                  }
                >
                  Copy Password
                </button>
              </div>
            )}

            {/* MESSAGE */}
            {msg && <div className="admin-success">{msg}</div>}
            {error && <div className="admin-error">{error}</div>}

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}