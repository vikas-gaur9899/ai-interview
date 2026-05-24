import { useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../api/api";

export default function AdminLogin() {

  const navigate =
    useNavigate();

  /* ================= STATES ================= */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ================= LOGIN ================= */

  const login = async () => {

    /* ================= VALIDATION ================= */

    if (!email || !password) {

      setError(
        "Enter email and password"
      );

      return;

    }

    try {

      setLoading(true);

      setError("");

      const res =
        await API.post(

          "/admin/login",

          {

            email:
              email.trim().toLowerCase(),

            password

          }

        );

      /* ================= SAVE TOKEN ================= */

      localStorage.setItem(

        "adminToken",

        res.data.token

      );

      /* ================= SAVE ADMIN ================= */

      localStorage.setItem(

        "adminInfo",

        JSON.stringify(
          res.data.admin
        )

      );

      /* ================= REDIRECT ================= */

      navigate(
        "/admin/dashboard"
      );

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(

        err.response?.data?.message ||

        "Login failed"

      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= UI ================= */

  return (

    <div className="admin-auth-page">

      <div className="admin-card">

        {/* ================= BACK ================= */}

        <span

          className="admin-link"

          onClick={() => navigate("/")}

          style={{

            cursor: "pointer",

            display: "inline-block",

            marginBottom: "10px"

          }}

        >

          ← Back to Home

        </span>

        {/* ================= TITLE ================= */}

        <h2>

          Admin Login

        </h2>

        <p className="admin-sub">

          Login to Admin Panel

        </p>

        {/* ================= EMAIL ================= */}

        <input

          type="email"

          placeholder="Admin Gmail"

          value={email}

          autoComplete="email"

          onChange={(e) =>

            setEmail(
              e.target.value
            )

          }

        />

        {/* ================= PASSWORD ================= */}

        <input

          type="password"

          placeholder="Password"

          value={password}

          autoComplete="current-password"

          onChange={(e) =>

            setPassword(
              e.target.value
            )

          }

          onKeyDown={(e) => {

            if (e.key === "Enter") {

              login();

            }

          }}

        />

        {/* ================= ERROR ================= */}

        {

          error && (

            <div className="admin-error">

              {error}

            </div>

          )

        }

        {/* ================= BUTTON ================= */}

        <button

          onClick={login}

          disabled={loading}

        >

          {

            loading

              ? "Logging in..."

              : "Login"

          }

        </button>

        {/* ================= CREATE ADMIN ================= */}

        <span

          className="admin-link"

          onClick={() =>

            navigate("/admin/signup")

          }

        >

          Create admin account

        </span>

      </div>

    </div>

  );

}