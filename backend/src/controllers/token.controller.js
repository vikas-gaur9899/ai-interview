import ScheduledInterview from "../model/ScheduledInterview.js";
import Student from "../model/Student.js";

export const validateToken = async (req, res) => {
  try {
    let { token, studentId, name } = req.body;

    // ✅ Trim inputs
    token = token?.trim();
    studentId = studentId?.trim();
    name = name?.trim();

    // ✅ Step 1: Find interview using token
    const interview = await ScheduledInterview.findOne({ token });

    if (!interview) {
      return res.status(404).json({ message: "Invalid token" });
    }

    // ✅ Step 2: Check studentId matches interview
    if (interview.studentId !== studentId) {
      return res.status(400).json({ message: "Student ID does not match token" });
    }

    // ✅ Step 3: Get student from Student collection
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Step 4: Compare names
    if (student.name.trim().toLowerCase() !== name.toLowerCase()) {
      return res.status(400).json({ message: "Student name does not match" });
    }

    // ✅ Existing validations (NO CHANGE)
    if (interview.used) {
      return res.status(400).json({ message: "Token already used" });
    }

    const now = new Date();

    if (now > interview.expiryTime) {
      return res.status(400).json({ message: "Token expired" });
    }

    res.json({ message: "Valid token" });

  } catch (err) {
    res.status(500).json({ message: "Validation failed" });
  }
};