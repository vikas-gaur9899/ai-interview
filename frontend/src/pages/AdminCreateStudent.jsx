import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import API from "../api/api";

export default function AdminCreateStudent() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    course: "",
    teacherName: "",
    courseDuration: "",
    email: ""
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // 🔥 field errors

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "studentId") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, studentId: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ FIELD VALIDATION (REAL-TIME)
  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "This field is required";
    }

    if (name === "studentId") {
      if (!/^\d+$/.test(value)) {
        errorMsg = "Only numbers allowed";
      } else if (value.length < 4) {
        errorMsg = "Minimum 4 digits required";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        errorMsg = "Invalid email format";
      }
    }

    if (name === "name") {
      if (/\d/.test(value)) {
        errorMsg = "Name cannot contain numbers";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // ✅ ON BLUR (FOCUS OUT)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // ✅ FINAL VALIDATION (ON SUBMIT)
  const validate = () => {
    if (!form.studentId || !form.name || !form.course || !form.email) {
      return "All fields are required";
    }

    if (!/^\d+$/.test(form.studentId)) {
      return "Student ID must contain only numbers";
    }

    if (form.studentId.length < 4) {
      return "Student ID must be at least 4 digits";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Enter a valid email address";
    }

    if (/\d/.test(form.name)) {
      return "Name should not contain numbers";
    }

    return null;
  };

  // ✅ SUBMIT
  const submit = async () => {
    try {
      setError("");
      setMsg("");

      const validationError = validate();
      if (validationError) {
        return setError(validationError);
      }

      await API.post("/admin/student", form);

      setMsg("✅ Student created successfully");

      setForm({
        studentId: "",
        name: "",
        course: "",
        teacherName: "",
        courseDuration: "",
        email: ""
      });

      setErrors({}); // reset errors

    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-create-wrapper">
        
        {/* LEFT IMAGE */}
        <div className="admin-create-left">
          <img src="/images/studentcreate.jpg" alt="AI" />
          <h2>Create Student</h2>
          <p>Manage students and track their interview performance</p>
        </div>

        {/* RIGHT FORM */}
        <div className="admin-create-right">
          <div className="admin-create-card">
            <h2>Create Student</h2>

            {/* Student ID */}
            <input
              name="studentId"
              placeholder="Student ID"
              value={form.studentId}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.studentId && <p className="field-error">{errors.studentId}</p>}

            {/* Name */}
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}

            {/* Course */}
            <input
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.course && <p className="field-error">{errors.course}</p>}

            {/* Teacher */}
            <input
              name="teacherName"
              placeholder="Teacher Name"
              value={form.teacherName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Duration */}
            <input
              name="courseDuration"
              placeholder="Course Duration"
              value={form.courseDuration}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Email */}
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}

            {error && <div className="admin-error">{error}</div>}
            {msg && <div className="admin-success">{msg}</div>}

            <button onClick={submit}>Create Student</button>
          </div>
        </div>

      </div>
    </>
  );
}