import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";

export default function AdminManageAdmins() {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  // ❌ Only super admin allowed
  if (admin?.role !== "super_admin") {
    return <h2 style={{ padding: "40px" }}>Access Denied</h2>;
  }

  const [admins, setAdmins] = useState([]);
  const [editAdmin, setEditAdmin] = useState(null);
  const [error, setError] = useState("");

  /* ================= FETCH ADMINS ================= */
  const fetchAdmins = async () => {
    try {
      const res = await API.get("/admin/all");
      console.log("Admins:", res.data); // 🔍 debug
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= DELETE ADMIN ================= */
  const deleteAdmin = async (id) => {
    try {
      await API.delete(`/admin/admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  /* ================= HANDLE EDIT ================= */
  const handleEdit = (admin) => {
    setEditAdmin({ ...admin });
  };

  /* ================= UPDATE ADMIN ================= */
  const updateAdmin = async () => {
    try {
      await API.put(`/admin/admin/${editAdmin._id}`, {
        name: editAdmin.name.trim(),
        email: editAdmin.email.trim(),
        phone: editAdmin.phone.trim(),
        course: editAdmin.course.trim()
      });

      setEditAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      setError("Update failed");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-wrapper">

        {/* HEADER */}
        <div className="dashboard-header">
          <h2>👨‍💼 Manage Admins</h2>
          <p>Delete or manage admin accounts</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {/* ADMIN LIST */}
        <div className="request-grid">
          {admins.length === 0 && (
            <p style={{ color: "white" }}>No admins found</p>
          )}

          {admins.map((a) => (
            <div key={a._id} className="request-card premium-card">

              <div className="request-info">
                <h3>{a.name}</h3>
                <p>{a.email}</p>
                <p>{a.course}</p>
              </div>

              <div className="request-actions">

                {/* UPDATE */}
                <button
                  className="approve-btn"
                  onClick={() => handleEdit(a)}
                >
                  ✏️ Update
                </button>

                {/* DELETE */}
                <button
                  className="reject-btn"
                  onClick={() => deleteAdmin(a._id)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          ))}
        </div>

        {/* ================= EDIT MODAL ================= */}
        {editAdmin && (
          <div className="admin-edit-modal">

            <div className="admin-create-card">

              <h2>Edit Admin</h2>

              <input
                value={editAdmin.name}
                onChange={(e) =>
                  setEditAdmin({ ...editAdmin, name: e.target.value })
                }
              />

              <input
                value={editAdmin.email}
                onChange={(e) =>
                  setEditAdmin({ ...editAdmin, email: e.target.value })
                }
              />

              <input
                value={editAdmin.phone}
                onChange={(e) =>
                  setEditAdmin({ ...editAdmin, phone: e.target.value })
                }
              />

              <input
                value={editAdmin.course}
                onChange={(e) =>
                  setEditAdmin({ ...editAdmin, course: e.target.value })
                }
              />

              <button onClick={updateAdmin}>
                Save Changes
              </button>

              <button
                onClick={() => setEditAdmin(null)}
                style={{ marginTop: "10px", background: "#555" }}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}