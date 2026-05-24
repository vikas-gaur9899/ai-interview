import { useState } from "react";
import API from "../api/api";
import AdminLayout from "./AdminLayout";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const changePassword = async () => {
    try {
      await API.post("/admin/change-password", { password });
      setMsg("Password updated");
    } catch {
      setMsg("Error");
    }
  };

  return (
    <AdminLayout>

      <div className="dashboard-card">
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={changePassword}>Update</button>

        {msg && <p>{msg}</p>}
      </div>

    </AdminLayout>
  );
}