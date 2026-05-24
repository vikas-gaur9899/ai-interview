import { useState } from "react";
import API from "../api/api";
import AdminNavbar from "./AdminNavbar";

export default function AdminEditStudent() {
  const [studentId, setStudentId] = useState("");
  const [form, setForm] = useState(null);

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // 🔍 FETCH STUDENT
  const fetchStudent = async () => {
    try {
      setError("");
      setMsg("");

      const res = await API.get(`/admin/student/${studentId}`);

      const s = res.data.student;

      setForm({
        name: s.name,
        email: s.email,
        course: s.course,
        teacherName: s.teacherName,
        courseDuration: s.courseDuration
      });

    } catch (err) {
      setError(err.response?.data?.message || "Student not found");
    }
  };

  // ✏️ HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE
  const updateStudent = async () => {
    try {
      setError("");
      setMsg("");
      if (!form.name || !form.email) {
      return setError("Required fields missing");
    }
      await API.put(`/admin/student/${studentId}`, form);

      setMsg("✅ Student updated successfully");

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-create-wrapper">

        <div className="admin-create-card">
          <h2>Edit Student</h2>

          {/* 🔍 SEARCH */}
          <input
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <button onClick={fetchStudent}>Fetch Student</button>

          {/* ✏️ FORM */}
          {form && (
            <>
              <input value={studentId} disabled />

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Course"
              />

              <input
                name="teacherName"
                value={form.teacherName}
                onChange={handleChange}
                placeholder="Teacher Name"
              />

              <input
                name="courseDuration"
                value={form.courseDuration}
                onChange={handleChange}
                placeholder="Course Duration"
              />

              <button onClick={updateStudent}>
                Update Student
              </button>
            </>
          )}

          {error && <div className="admin-error">{error}</div>}
          {msg && <div className="admin-success">{msg}</div>}
        </div>

      </div>
    </>
  );
}