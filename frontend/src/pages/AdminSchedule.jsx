import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import API from "../api/api";

export default function AdminSchedule() {

  /* ====================================================
     FORM STATE
  ==================================================== */

  const [form, setForm] = useState({

    studentId: "",

    interviewType: "technical",

    /* ====================================================
       COMMON DIFFICULTY
       Used for Technical + HR + Practical
    ==================================================== */

    difficulty: "",

    topics: "",

    date: "",

    startTime: "",

    endTime: ""

  });

  /* ====================================================
     SUCCESS MESSAGE
  ==================================================== */

  const [msg, setMsg] = useState("");

  /* ====================================================
     ERROR MESSAGE
  ==================================================== */

  const [error, setError] = useState("");

  /* ====================================================
     FIELD ERRORS
  ==================================================== */

  const [errors, setErrors] = useState({});

  /* ====================================================
     HANDLE INPUT CHANGE
  ==================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    /* ====================================================
       ONLY NUMBERS FOR STUDENT ID
    ==================================================== */

    if (name === "studentId") {

      const numeric =
        value.replace(/\D/g, "");

      setForm({

        ...form,

        studentId: numeric

      });

    } else {

      setForm({

        ...form,

        [name]: value

      });

    }

  };

  /* ====================================================
     HANDLE INTERVIEW TYPE CHANGE
  ==================================================== */

  const handleTypeChange = (e) => {

    const type = e.target.value;

    setForm({

      ...form,

      interviewType: type,

      difficulty: ""

    });

  };

  /* ====================================================
     FIELD VALIDATION
  ==================================================== */

  const validateField = (
    name,
    value
  ) => {

    let err = "";

    /* ====================================================
       REQUIRED FIELD CHECK
    ==================================================== */

    if (
      !value &&
      [
        "studentId",
        "date",
        "startTime",
        "endTime"
      ].includes(name)
    ) {

      err = "Required field";

    }

    /* ====================================================
       STUDENT ID VALIDATION
    ==================================================== */

    if (
      name === "studentId" &&
      !/^\d+$/.test(value)
    ) {

      err = "Only numbers allowed";

    }

    setErrors((prev) => ({

      ...prev,

      [name]: err

    }));

  };

  /* ====================================================
     HANDLE BLUR
  ==================================================== */

  const handleBlur = (e) => {

    validateField(
      e.target.name,
      e.target.value
    );

  };

  /* ====================================================
     SUBMIT INTERVIEW
  ==================================================== */

  const submit = async () => {

    try {

      setError("");

      setMsg("");

      /* ====================================================
         REQUIRED VALIDATION
      ==================================================== */

      if (
        !form.studentId ||
        !form.date ||
        !form.startTime ||
        !form.endTime
      ) {

        setError(
          "Please fill all required fields"
        );

        return;

      }

      /* ====================================================
         DIFFICULTY VALIDATION
      ==================================================== */

      if (!form.difficulty) {

        setError(
          "Please select difficulty"
        );

        return;

      }

      /* ====================================================
         DATE VALIDATION
      ==================================================== */

      const now = new Date();

      const selected = new Date(
        `${form.date}T${form.startTime}`
      );

      if (selected < now) {

        setError(
          "Cannot schedule interview in the past"
        );

        return;

      }

      /* ====================================================
         TIME VALIDATION
      ==================================================== */

      const start = new Date(
        `${form.date}T${form.startTime}`
      );

      const end = new Date(
        `${form.date}T${form.endTime}`
      );

      if (end <= start) {

        setError(
          "End time must be greater than start time"
        );

        return;

      }

      /* ====================================================
         FINAL PAYLOAD
      ==================================================== */

      const payload = {

        studentId:
          form.studentId,

        interviewType:
          form.interviewType,

        /* ====================================================
           COMMON DIFFICULTY
        ==================================================== */

        difficulty:
          form.difficulty,

        topics: form.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),

        date:
          form.date,

        startTime:
          form.startTime,

        endTime:
          form.endTime

      };

      console.log(
        "📤 FINAL PAYLOAD:",
        payload
      );

      /* ====================================================
         API CALL
      ==================================================== */

      await API.post(
        "/admin/schedule",
        payload
      );

      /* ====================================================
         SUCCESS MESSAGE
      ==================================================== */

      setMsg(
        "✅ Interview Scheduled + Token Sent"
      );

      /* ====================================================
         RESET FORM
      ==================================================== */

      setForm({

        studentId: "",

        interviewType: "technical",

        difficulty: "",

        topics: "",

        date: "",

        startTime: "",

        endTime: ""

      });

    } catch (err) {

      console.error(err);

      setError(

        err.response?.data?.message ||

        "Error"

      );

    }

  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-create-wrapper">

        {/* ====================================================
           LEFT SECTION
        ==================================================== */}

        <div className="admin-create-left">

          <img
            src="/images/interviewschedule.jpg"
            alt="AI"
          />

          <h2>
            Schedule Interview
          </h2>

          <p>
            Assign interviews with AI evaluation
          </p>

        </div>

        {/* ====================================================
           RIGHT SECTION
        ==================================================== */}

        <div className="admin-create-right">

          <div className="admin-create-card">

            <h2>
              Schedule Interview
            </h2>

            {/* ====================================================
               STUDENT ID
            ==================================================== */}

            <input
              name="studentId"
              placeholder="Student ID"
              value={form.studentId}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.studentId && (

              <p className="field-error">
                {errors.studentId}
              </p>

            )}

            {/* ====================================================
               INTERVIEW TYPE
            ==================================================== */}

            <select
              name="interviewType"
              value={form.interviewType}
              onChange={handleTypeChange}
            >

              <option value="technical">
                Technical
              </option>

              <option value="hr">
                HR
              </option>

              <option value="practical">
                Practical
              </option>

            </select>

            {/* ====================================================
               COMMON DIFFICULTY
            ==================================================== */}

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >

              <option value="">
                Select Difficulty
              </option>

              <option value="easy">
                Easy
              </option>

              <option value="intermediate">
                Intermediate
              </option>

              <option value="hard">
                Hard
              </option>

            </select>

            {/* ====================================================
               TOPICS
            ==================================================== */}

            <input
              name="topics"
              placeholder="Topics (React, Node, DBMS)"
              value={form.topics}
              onChange={handleChange}
            />

            {/* ====================================================
               DATE
            ==================================================== */}

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.date && (

              <p className="field-error">
                {errors.date}
              </p>

            )}

            {/* ====================================================
               START TIME
            ==================================================== */}

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.startTime && (

              <p className="field-error">
                {errors.startTime}
              </p>

            )}

            {/* ====================================================
               END TIME
            ==================================================== */}

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.endTime && (

              <p className="field-error">
                {errors.endTime}
              </p>

            )}

            {/* ====================================================
               ERROR MESSAGE
            ==================================================== */}

            {error && (

              <div className="admin-error">
                {error}
              </div>

            )}

            {/* ====================================================
               SUCCESS MESSAGE
            ==================================================== */}

            {msg && (

              <div className="admin-success">
                {msg}
              </div>

            )}

            {/* ====================================================
               SUBMIT BUTTON
            ==================================================== */}

            <button onClick={submit}>

              Schedule Interview

            </button>

          </div>

        </div>

      </div>
    </>
  );
}