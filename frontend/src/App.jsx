import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import InterviewRoom from "./pages/InterviewRoom";
import InterviewComplete from "./pages/InterviewComplete";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudent from "./pages/AdminStudent";

import InterviewAccess from "./pages/InterviewAccess";
import RulesPopup from "./pages/RulesPopup";

import AdminSchedule from "./pages/AdminSchedule";
import AdminProfile from "./pages/AdminProfile";
import ChangePassword from "./pages/ChangePassword";

import AdminCreateStudent from "./pages/AdminCreateStudent";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";

import AdminEditStudent from "./pages/AdminEditStudent";
import AdminCreateAdmin from "./pages/AdminCreateAdmin";
import AdminManageAdmins from "./pages/AdminManageAdmins";

console.log("app file loaded");

/* ====================================================
   MAIN APP ROUTES
==================================================== */

export default function App() {

  return (

    <Routes>

      {/* ====================================================
         USER ROUTES
      ==================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

     

      {/* ====================================================
         INTERVIEW ACCESS FALLBACK
         IMPORTANT:
         Prevents route crash on /interview-room
      ==================================================== */}

      <Route
        path="/interview-room"
        element={<InterviewAccess />}
      />

      {/* ====================================================
         TOKEN BASED INTERVIEW ROOM
      ==================================================== */}

      <Route
        path="/interview-room/:token"
        element={<InterviewRoom />}
      />

      {/* ====================================================
         INTERVIEW COMPLETE
      ==================================================== */}

      <Route
        path="/completed/:interviewId"
        element={<InterviewComplete />}
      />

      {/* ====================================================
         ADMIN LOGIN
      ==================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ====================================================
         CREATE ADMIN
      ==================================================== */}

      <Route
        path="/admin/create-admin"
        element={
          <AdminProtectedRoute>

            <AdminCreateAdmin />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         MANAGE ADMINS
      ==================================================== */}

      <Route
        path="/admin/manage-admins"
        element={
          <AdminProtectedRoute>

            <AdminManageAdmins />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         ADMIN DASHBOARD
      ==================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>

            <AdminDashboard />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         ADMIN STUDENT DETAILS
      ==================================================== */}

      <Route
        path="/admin/student/:id"
        element={
          <AdminProtectedRoute>

            <AdminStudent />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         INTERVIEW ACCESS PAGE
      ==================================================== */}

      <Route
        path="/access"
        element={<InterviewAccess />}
      />

      {/* ====================================================
         RULES PAGE
      ==================================================== */}

      <Route
        path="/rules"
        element={<RulesPopup />}
      />

      {/* ====================================================
         CREATE STUDENT
      ==================================================== */}

      <Route
        path="/admin/create-student"
        element={<AdminCreateStudent />}
      />

      {/* ====================================================
         SCHEDULE INTERVIEW
      ==================================================== */}

      <Route
        path="/admin/schedule"
        element={
          <AdminProtectedRoute>

            <AdminSchedule />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         ADMIN PROFILE
      ==================================================== */}

      <Route
        path="/admin/profile"
        element={
          <AdminProtectedRoute>

            <AdminProfile />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         CHANGE PASSWORD
      ==================================================== */}

      <Route
        path="/admin/change-password"
        element={
          <AdminProtectedRoute>

            <ChangePassword />

          </AdminProtectedRoute>
        }
      />

      {/* ====================================================
         EDIT STUDENT
      ==================================================== */}

      <Route
        path="/admin/edit-student"
        element={
          <AdminProtectedRoute>

            <AdminEditStudent />

          </AdminProtectedRoute>
        }
      />

    </Routes>

  );

}