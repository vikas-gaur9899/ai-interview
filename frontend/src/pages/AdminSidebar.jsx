import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  return (
    <div className="admin-sidebar premium-sidebar">

      <h2 className="logo">🚀 AI Panel</h2>

      <div className="menu">
        <span onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </span>

        <span onClick={() => navigate("/admin/create-student")}>
          Create Student
        </span>

        <span onClick={() => navigate("/admin/schedule")}>
          Schedule
        </span>

        <span onClick={() => navigate("/admin/profile")}>
          Profile
        </span>

        <span onClick={() => navigate("/admin/edit-student")}>
          Edit Student
        </span>

        {/* 🔥 ONLY SUPER ADMIN */}
        {admin?.role === "super_admin" && (
          <>
            <span onClick={() => navigate("/admin/create-admin")}>
              Create Admin
            </span>

            <span onClick={() => navigate("/admin/manage-admins")}>
              Manage Admins
            </span>
          </>
        )}
      </div>

    </div>
  );
}