import { useNavigate } from "react-router-dom";

/* ====================================================
   ADMIN NAVBAR
==================================================== */

export default function AdminNavbar() {

  const navigate =
    useNavigate();

  /* ====================================================
     SAFE ADMIN PARSE
  ==================================================== */

  let admin = null;

  try {

    admin = JSON.parse(

      localStorage.getItem(
        "adminInfo"
      )

    );

  } catch (err) {

    console.error(
      "ADMIN PARSE ERROR:",
      err
    );

  }

  /* ====================================================
     LOGOUT
  ==================================================== */

  const logout = () => {

    /* ================= CLEAR STORAGE ================= */

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminInfo"
    );

    /* ================= REDIRECT ================= */

    navigate(

      "/admin/login",

      {

        replace: true

      }

    );

  };

  /* ====================================================
     UI
  ==================================================== */

  return (

    <div className="admin-navbar premium-navbar">

      {/* ====================================================
         LEFT
      ==================================================== */}

      <div className="admin-left">

        <strong className="admin-name">

          {

            admin?.email ||

            "Admin"

          }

        </strong>

        <div className="nav-links">

          <span
            onClick={() =>

              navigate(
                "/admin/dashboard"
              )

            }
          >

            Home

          </span>

          <span
            onClick={() =>

              navigate(
                "/admin/requests"
              )

            }
          >

            Requests

          </span>

        </div>

      </div>

      {/* ====================================================
         RIGHT
      ==================================================== */}

      <div className="admin-right">

        <span
          onClick={() =>

            navigate(
              "/admin/change-password"
            )

          }
        >

          Change Password

        </span>

        <button
          onClick={logout}
        >

          Logout

        </button>

      </div>

    </div>

  );

}