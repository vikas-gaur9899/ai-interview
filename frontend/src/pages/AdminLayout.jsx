import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          {children}
        </div>
      </div>

    </div>
  );
}