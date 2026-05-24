import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "./AdminNavbar";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      // ✅ FIXED ROUTE
      const res = await API.get("/admin/pending");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    try {
      // ✅ FIXED METHOD (PATCH)
      await API.patch(`/admin/approve/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    try {
      await API.delete(`/admin/reject/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <>
    <AdminNavbar />

    <div className="admin-dashboard-wrapper">

      <div className="dashboard-header">
        <h2>📩 Admin Requests</h2>
        <p>Approve or reject pending admin access requests</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {requests.length === 0 && (
        <p style={{ opacity: 0.7 }}>No pending requests</p>
      )}

      <div className="request-grid">
        {requests.map((r) => (
          <div key={r._id} className="request-card premium-card">

            <div className="request-info">
              <h3>{r.name}</h3>
              <p>{r.email}</p>
            </div>

            <div className="request-actions">
              <button
                className="approve-btn"
                onClick={() => approve(r._id)}
              >
                ✅ Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => reject(r._id)}
              >
                ❌ Reject
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  </>
);
}