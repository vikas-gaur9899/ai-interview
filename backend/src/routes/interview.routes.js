import express from "express";
import {
  startInterview,
  submitAnswer,
  endInterview
} from "../controllers/interview.controller.js";
import { finalizeInterview } from "../controllers/interview.controller.js";
import { sendInterviewEmail } from "../controllers/interview.controller.js"

const router = express.Router();

router.post("/start", startInterview);// all worl until interview room one  answer triggered

router.post("/answer", submitAnswer);
router.post("/end", endInterview);
router.post("/finalize", finalizeInterview);
router.post("/send-email", sendInterviewEmail);

export default router;
// skip function create 