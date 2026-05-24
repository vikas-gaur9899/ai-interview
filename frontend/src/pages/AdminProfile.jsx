import AdminLayout from "./AdminLayout";

export default function AdminProfile() {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  return (
    <AdminLayout>

      <div className="profile-card">
        <h2>Admin Profile</h2>

        <p><strong>Email:</strong> {admin?.email}</p>
        <p><strong>Role:</strong> {admin?.role}</p>

      </div>

    </AdminLayout>
  );
}