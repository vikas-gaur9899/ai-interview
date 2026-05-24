import Admin from "../model/Admin.js";
import Student from "../model/Student.js";
import ScheduledInterview from "../model/ScheduledInterview.js";

import {
  hashPassword,
  comparePassword
} from "../utils/password.js";

import {
  signToken
} from "../utils/jwt.js";

import {
  generateToken
} from "../utils/generateToken.js";

import {
  getStudentAnalytics
} from "../services/adminAnalytics.service.js";

import {
  sendReportEmail
} from "../services/mail.services.js";

/* ====================================================
   ADMIN LOGIN (JWT)
==================================================== */

export const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        message:
          "Email and password required"

      });

    }

    const admin =
      await Admin.findOne({

        email:
          email.toLowerCase()

      });

    if (!admin) {

      return res.status(404).json({

        message:
          "Admin not found"

      });

    }

    const match =
      await comparePassword(

        password,
        admin.password

      );

    if (!match) {

      return res.status(401).json({

        message:
          "Invalid credentials"

      });

    }

    const token =
      signToken({

        id: admin._id,

        role: admin.role,

        email: admin.email

      });

    res.json({

      token,

      admin: {

        id: admin._id,

        email: admin.email,

        role: admin.role,

        name: admin.name

      }

    });

  } catch (err) {

    console.error(
      "Login error:",
      err
    );

    res.status(500).json({

      message:
        "Login failed"

    });

  }

};

/* ====================================================
   VERIFY ADMIN
==================================================== */

export const verifyAdmin = (
  req,
  res
) => {

  res.json({

    valid: true,

    admin: req.admin

  });

};

/* ====================================================
   CHANGE PASSWORD
==================================================== */

export const changePassword = async (
  req,
  res
) => {

  try {

    const adminId =
      req.admin.id;

    const {
      password
    } = req.body;

    if (!password) {

      return res.status(400).json({

        message:
          "Password required"

      });

    }

    const hash =
      await hashPassword(
        password
      );

    await Admin.findByIdAndUpdate(

      adminId,

      {
        password: hash
      }

    );

    res.json({

      message:
        "Password updated"

    });

  } catch (err) {

    console.error(
      "Change password error:",
      err
    );

    res.status(500).json({

      message:
        "Error updating password"

    });

  }

};

/* ====================================================
   CREATE ADMIN
==================================================== */

export const createAdmin = async (
  req,
  res
) => {

  try {

    let {

      name,
      email,
      phone,
      gender,
      course,
      sendEmail

    } = req.body;

    name =
      name?.trim();

    email = email
      ?.trim()
      .toLowerCase();

    phone =
      phone?.trim();

    course =
      course?.trim();

    if (

      !name ||
      !email ||
      !phone ||
      !gender ||
      !course

    ) {

      return res.status(400).json({

        message:
          "All fields required"

      });

    }

    if (
      !/^[A-Za-z\s]+$/.test(name)
    ) {

      return res.status(400).json({

        message:
          "Name must contain only letters"

      });

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {

      return res.status(400).json({

        message:
          "Invalid email"

      });

    }

    if (
      !/^[6-9]\d{9}$/.test(phone)
    ) {

      return res.status(400).json({

        message:
          "Invalid phone number"

      });

    }

    const adminExists =
      await Admin.findOne({

        $or: [
          { email },
          { phone }
        ]

      });

    if (adminExists) {

      return res.status(400).json({

        message:
          "Admin already exists"

      });

    }

    const studentExists =
      await Student.findOne({

        $or: [
          { email },
          { phone }
        ]

      });

    if (studentExists) {

      return res.status(400).json({

        message:
          "Email/Phone belongs to a student"

      });

    }

    const rawPassword =

      Math.random()
        .toString(36)
        .slice(-4)

      +

      Math.random()
        .toString(36)
        .slice(-4)

      +

      "@1";

    const hashed =
      await hashPassword(
        rawPassword
      );

    const admin =
      await Admin.create({

        name,
        email,
        phone,
        gender,
        course,

        password:
          hashed,

        role: "admin"

      });

    if (sendEmail) {

      await sendReportEmail(

        email,

        null,

        `Your Admin Account is created.\n\nEmail: ${email}\nPassword: ${rawPassword}`

      );

    }

    res.json({

      message:
        "Admin created successfully",

      admin,

      password:
        rawPassword

    });

  } catch (err) {

    console.error(
      "Create admin error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to create admin"

    });

  }

};

/* ====================================================
   DELETE ADMIN
==================================================== */

export const deleteAdmin = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    if (
      req.admin.id === id
    ) {

      return res.status(400).json({

        message:
          "You cannot delete yourself"

      });

    }

    const admin =
      await Admin.findById(id);

    if (!admin) {

      return res.status(404).json({

        message:
          "Admin not found"

      });

    }

    if (
      admin.role ===
      "super_admin"
    ) {

      return res.status(403).json({

        message:
          "Cannot delete super admin"

      });

    }

    await Admin.findByIdAndDelete(id);

    res.json({

      message:
        "Admin deleted successfully"

    });

  } catch (err) {

    console.error(
      "Delete admin error:",
      err
    );

    res.status(500).json({

      message:
        "Delete failed"

    });

  }

};

/* ====================================================
   CREATE STUDENT
==================================================== */

export const createStudent = async (
  req,
  res
) => {

  try {

    let {

      studentId,
      name,
      course,
      teacherName,
      courseDuration,
      email

    } = req.body;

    studentId =
      studentId?.trim();

    name =
      name?.trim();

    course =
      course?.trim();

    teacherName =
      teacherName?.trim();

    courseDuration =
      courseDuration?.trim();

    email = email
      ?.trim()
      .toLowerCase();

    if (

      !studentId ||
      !name ||
      !email

    ) {

      return res.status(400).json({

        message:
          "Missing required fields"

      });

    }

    if (
      !/^[A-Za-z\s]+$/.test(name)
    ) {

      return res.status(400).json({

        message:
          "Name must contain only letters"

      });

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {

      return res.status(400).json({

        message:
          "Invalid email"

      });

    }

    const exists =
      await Student.findOne({

        studentId

      });

    if (exists) {

      return res.status(400).json({

        message:
          "Student already exists"

      });

    }

    const student =
      await Student.create({

        studentId,
        name,
        course,
        teacherName,
        courseDuration,
        email

      });

    res.json({

      message:
        "Student created successfully",

      student

    });

  } catch (err) {

    console.error(
      "Create student error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to create student"

    });

  }

};

/* ====================================================
   SCHEDULE INTERVIEW
==================================================== */

export const scheduleInterview = async (
  req,
  res
) => {

  try {

    const {

      studentId,
      interviewType,
      level,
      difficulty,
      topics,
      date,
      startTime,
      endTime

    } = req.body;

    const validInterviewTypes = [

      "technical",
      "hr",
      "practical"

    ];

    if (

      !validInterviewTypes.includes(
        interviewType
      )

    ) {

      return res.status(400).json({

        message:
          "Invalid interview type"

      });

    }

    const student =
      await Student.findOne({

        studentId

      });

    if (!student) {

      return res.status(404).json({

        message:
          "Student not found"

      });

    }

    const now =
      new Date();

    const interviewStart =
      new Date(
        `${date}T${startTime}`
      );

    if (
      interviewStart < now
    ) {

      return res.status(400).json({

        message:
          "Cannot schedule interview in the past"

      });

    }

    const existingInterview =
      await ScheduledInterview.findOne({

        studentId,
        interviewType,
        date,
        startTime,
        endTime,
        used: false

      });

    if (existingInterview) {

      return res.status(400).json({

        message:
          "Interview already scheduled for this time and type"

      });

    }

    const token =
      generateToken();

    const expiryTime =
      new Date(
        `${date}T${endTime}`
      );

    const interview =
      await ScheduledInterview.create({

        studentId,
        interviewType,
        level,
        difficulty,
        topics,
        date,
        startTime,
        endTime,
        token,
        expiryTime,
        used: false

      });

    const link =
`${process.env.FRONTEND_URL}/access`;

    const message = `
Hello ${student.name},

Your AI Interview has been scheduled.

Interview Type: ${interviewType}

${
  interviewType === "practical"
    ? `Difficulty: ${difficulty}\n`
    : ""
}

Date: ${date}

Time: ${startTime} - ${endTime}

Token: ${token}

Link:
${link}
`;

    await sendReportEmail(

      student.email,

      null,

      message

    );

    res.json({

      message:
        "Interview scheduled successfully",

      token,

      interview

    });

  } catch (err) {

    console.error(
      "Schedule interview error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to schedule interview"

    });

  }

};

/* ====================================================
   STUDENT DASHBOARD
==================================================== */

export const getStudentDashboard = async (
  req,
  res
) => {

  try {

    const {
      studentId
    } = req.params;

    const data =
      await getStudentAnalytics(
        studentId
      );

    if (

      !data ||
      !data.student?.name

    ) {

      return res.status(404).json({

        message:
          "Student not found"

      });

    }

    res.json(data);

  } catch (err) {

    console.error(
      "Dashboard error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to fetch student dashboard"

    });

  }

};

/* ====================================================
   UPDATE STUDENT
==================================================== */

export const updateStudent = async (
  req,
  res
) => {

  try {

    const {
      studentId
    } = req.params;

    if (
      req.body.studentId
    ) {

      return res.status(400).json({

        message:
          "Student ID cannot be updated"

      });

    }

    const allowedFields = [

      "name",
      "email",
      "course",
      "teacherName",
      "courseDuration"

    ];

    const updateData = {};

    for (let key of allowedFields) {

      if (
        req.body[key] !== undefined
      ) {

        updateData[key] =
          req.body[key];

      }

    }

    const student =
      await Student.findOne({

        studentId

      });

    if (!student) {

      return res.status(404).json({

        message:
          "Student not found"

      });

    }

    const updatedStudent =
      await Student.findOneAndUpdate(

        { studentId },

        {
          $set: updateData
        },

        {
          new: true
        }

      );

    res.json({

      message:
        "Student updated successfully",

      student:
        updatedStudent

    });

  } catch (err) {

    console.error(
      "Update student error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to update student"

    });

  }

};

/* ====================================================
   GET ALL ADMINS
==================================================== */

export const getAllAdmins = async (
  req,
  res
) => {

  try {

    const admins =
      await Admin.find({

        role: "admin"

      }).select("-password");

    res.json(admins);

  } catch (err) {

    console.error(
      "Fetch admins error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to fetch admins"

    });

  }

};

/* ====================================================
   UPDATE ADMIN
==================================================== */

export const updateAdmin = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const allowedFields = [

      "name",
      "phone",
      "gender",
      "course"

    ];

    const updateData = {};

    for (let key of allowedFields) {

      if (
        req.body[key] !== undefined
      ) {

        updateData[key] =
          req.body[key];

      }

    }

    const admin =
      await Admin.findById(id);

    if (!admin) {

      return res.status(404).json({

        message:
          "Admin not found"

      });

    }

    if (
      admin.role ===
      "super_admin"
    ) {

      return res.status(403).json({

        message:
          "Super admin cannot be updated"

      });

    }

    const updatedAdmin =
      await Admin.findByIdAndUpdate(

        id,

        {
          $set: updateData
        },

        {
          new: true
        }

      ).select("-password");

    res.json({

      message:
        "Admin updated successfully",

      admin:
        updatedAdmin

    });

  } catch (err) {

    console.error(
      "Update admin error:",
      err
    );

    res.status(500).json({

      message:
        "Failed to update admin"

    });

  }

};