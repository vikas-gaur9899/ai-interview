import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useEffect } from "react";
export default function AdminDashboard() {
  useEffect(() => {
  const admin = localStorage.getItem("adminInfo");
  if (!admin) {
    navigate("/admin/login", { replace: true });
  }
}, []);

  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");

  return (
  <AdminLayout>

    <div className="admin-dashboard-wrapper">

      <div className="dashboard-header">
        <h2>🚀 Admin Dashboard</h2>
        <p>Manage students, interviews & analytics</p>
      </div>

      {/* SEARCH */}
      <div className="dashboard-card premium-card">
        <h3>🔍 Search Student</h3>

        <div className="search-box">
          <input
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <button onClick={() => navigate(`/admin/student/${studentId}`)}>
            Search
          </button>
        </div>
      </div>

      {/* QUICK ACTION */}
      <div className="quick-actions premium-actions">
        <button onClick={() => navigate("/admin/create-student")}>
          ➕ Create Student
        </button>

        <button onClick={() => navigate("/admin/schedule")}>
          📅 Schedule Interview
        </button>
      </div>

    </div>

  </AdminLayout>
);
}