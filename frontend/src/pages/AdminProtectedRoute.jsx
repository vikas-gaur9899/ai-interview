import {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";

import API from "../api/api";

export default function AdminProtectedRoute({

  children

}) {

  /* ================= STATE ================= */

  const [loading, setLoading] =
    useState(true);

  const [isValid, setIsValid] =
    useState(false);

  /* ================= VERIFY TOKEN ================= */

  useEffect(() => {

    const verifyAdmin =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "adminToken"
            );

          /* ================= NO TOKEN ================= */

          if (!token) {

            localStorage.removeItem(
              "adminInfo"
            );

            setIsValid(false);

            setLoading(false);

            return;

          }

          /* ================= VERIFY API ================= */

          await API.get(
            "/admin/verify"
          );

          setIsValid(true);

        } catch (err) {

          console.log(
            "❌ AUTH VERIFY FAILED:",
            err
          );

          /* ================= AUTO LOGOUT ================= */

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminInfo"
          );

          setIsValid(false);

        } finally {

          setLoading(false);

        }

      };

    verifyAdmin();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen text-white text-xl">

        Verifying Admin...

      </div>

    );

  }

  /* ================= INVALID ================= */

  if (!isValid) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  }

  /* ================= VALID ================= */

  return children;

}