import express from "express";

import {
  updateStudent,
  login,
  getStudentDashboard,
  createStudent,
  scheduleInterview,
  changePassword,
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdmin,
  verifyAdmin
} from "../controllers/admin.controller.js";

import auth from "../middlewares/auth.middleware.js";

import {
  superAdminOnly
} from "../middlewares/role.middleware.js";

const router = express.Router();

/* ====================================================
   PUBLIC ROUTES
==================================================== */

// 🔐 Admin Login
router.post(
  "/login",
  login
);

/* ====================================================
   AUTH VERIFY
==================================================== */

// ✅ Verify Token
router.get(
  "/verify",
  auth,
  verifyAdmin
);

/* ====================================================
   ADMIN PROTECTED ROUTES
==================================================== */

// 🔐 Change Password
router.post(
  "/change-password",
  auth,
  changePassword
);

// 🔍 Student Dashboard
router.get(
  "/student/:studentId",
  auth,
  getStudentDashboard
);

// ✏️ Update Student
router.put(
  "/student/:studentId",
  auth,
  updateStudent
);

// ➕ Create Student
router.post(
  "/student",
  auth,
  createStudent
);

// 📅 Schedule Interview
router.post(
  "/schedule",
  auth,
  scheduleInterview
);

/* ====================================================
   SUPER ADMIN ROUTES
==================================================== */

// 📋 Get All Admins
router.get(
  "/all",
  auth,
  superAdminOnly,
  getAllAdmins
);

// ✏️ Update Admin
router.put(
  "/admin/:id",
  auth,
  superAdminOnly,
  updateAdmin
);

// ➕ Create Admin
router.post(
  "/create-admin",
  auth,
  superAdminOnly,
  createAdmin
);

// 🗑 Delete Admin
router.delete(
  "/admin/:id",
  auth,
  superAdminOnly,
  deleteAdmin
);

export default router;