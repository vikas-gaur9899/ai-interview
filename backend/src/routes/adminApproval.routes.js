import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { superAdminOnly } from "../middlewares/role.middleware.js";
import {
  getPendingAdmins,
  approveAdmin,
  rejectAdmin
} from "../controllers/adminApproval.controller.js";

const router = express.Router();

router.get("/pending", auth, superAdminOnly, getPendingAdmins);
router.patch("/approve/:id", auth, superAdminOnly, approveAdmin);
router.delete("/reject/:id", auth, superAdminOnly, rejectAdmin);

export default router;
