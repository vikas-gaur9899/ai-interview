import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminNavbar from "./AdminNavbar";
import API from "../api/api";

import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer

} from "recharts";

/* ====================================================
   ADMIN STUDENT ANALYTICS PAGE
==================================================== */

export default function AdminStudent() {

  /* ====================================================
     ROUTE PARAMS
  ==================================================== */

  const { id: studentId } =
    useParams();

  const navigate =
    useNavigate();

  /* ====================================================
     STATES
  ==================================================== */

  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState("");

  /* ====================================================
     FETCH STUDENT ANALYTICS
  ==================================================== */

  useEffect(() => {

    const fetchStudent =
      async () => {

        try {

          const res =
            await API.get(

              `/admin/student/${studentId}`

            );

          console.log(
            "📦 STUDENT DATA:",
            res.data
          );

          setData(res.data);

        } catch (err) {

          console.error(err);

          setError(

            err.response?.data?.message ||

            "Failed to load data"

          );

        }

      };

    fetchStudent();

  }, [studentId]);

  return (
    <>
      <AdminNavbar />

      <div className="student-page">

        {/* ====================================================
           HEADER
        ==================================================== */}

        {data && (

          <div className="student-header">

            <h2>
              {data.student.name}
            </h2>

            <p>
              {data.student.course}
            </p>

          </div>

        )}

        {/* ====================================================
           ALERT BOX
        ==================================================== */}

        {data?.insights?.alert && (

          <div className="alert-box">

            {data.insights.alert}

          </div>

        )}

        {/* ====================================================
           STATS CARDS
        ==================================================== */}

        {data && (

          <div className="student-stats">

            {/* TOTAL */}

            <div className="stat-card glow">

              Total
              <br />

              <strong>
                {data.stats.total}
              </strong>

            </div>

            {/* TECHNICAL */}

            <div className="stat-card">

              Technical
              <br />

              <strong>
                {data.stats.technical}
              </strong>

            </div>

            {/* HR */}

            <div className="stat-card">

              HR
              <br />

              <strong>
                {data.stats.hr}
              </strong>

            </div>

            {/* PRACTICAL */}

            <div className="stat-card">

              Practical
              <br />

              <strong>
                {data.stats.practical}
              </strong>

            </div>

          </div>

        )}

        {/* ====================================================
           INSIGHTS SECTION
        ==================================================== */}

        {data && (

          <div className="student-insights">

            {/* AVG SCORE */}

            <div className="insight-card">

              Avg Score
              <br />

              <strong>
                {data.metrics.avgScore}
              </strong>

            </div>

            {/* BEST SCORE */}

            <div className="insight-card">

              Best Score
              <br />

              <strong>
                {data.metrics.bestScore}
              </strong>

            </div>

            {/* LAST SCORE */}

            <div className="insight-card">

              Last Score
              <br />

              <strong>
                {data.metrics.lastScore}
              </strong>

            </div>

            {/* WEAKEST AREA */}

            <div className="insight-card highlight">

              Weak Area
              <br />

              <strong>

                {data.insights
                  .weakestArea
                  ?.toUpperCase()}

              </strong>

            </div>

          </div>

        )}

        {/* ====================================================
           PERFORMANCE CHARTS
        ==================================================== */}

        {data && (

          <div className="student-charts">

            {[
              "technical",
              "hr",
              "practical"
            ].map((type) => (

              <div
                key={type}
                className="chart-box"
              >

                <h4>

                  {type.toUpperCase()}
                  {" "}
                  Performance

                </h4>

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >

                  <LineChart
                    data={
                      data.charts[type]
                    }
                  >

                    <XAxis
                      dataKey="date"
                    />

                    <YAxis />

                    <Tooltip />

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <Line
                      type="monotone"
                      dataKey="score"
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            ))}

          </div>

        )}

        {/* ====================================================
           INTERVIEW HISTORY
        ==================================================== */}

        {data && (

          <div className="student-history">

            <h3>
              Interview History
            </h3>

            <table>

              <thead>

                <tr>

                  <th>Date</th>

                  <th>Type</th>

                  <th>Score</th>

                  <th>Result</th>

                  <th>PDF</th>

                </tr>

              </thead>

              <tbody>

                {data.history.map(
                  (item, i) => (

                    <tr key={i}>

                      {/* DATE */}

                      <td>

                        {new Date(
                          item.date
                        ).toLocaleDateString()}

                      </td>

                      {/* TYPE */}

                      <td>

                        {item.type}

                      </td>

                      {/* SCORE */}

                      <td>

                        {item.score ?? "-"}

                      </td>

                      {/* RESULT */}

                      <td>

                        {item.score >= 75

                          ? "✅ Good"

                          : "⚠ Improve"}

                      </td>

                      {/* PDF */}

                      <td>

                        {item.pdf ? (

                          <a
                            href={item.pdf}
                            target="_blank"
                            rel="noreferrer"
                          >

                            Download

                          </a>

                        ) : "-"}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

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
           BACK BUTTON
        ==================================================== */}

        <button
          className="admin-back"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >

          ← Back

        </button>

      </div>
    </>
  );
}