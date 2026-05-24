import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        E-DEFINERS
      </div>

      <div className="nav-links">
        <span onClick={() => navigate("/")}>Home</span>

        <span onClick={() => navigate("/#how-it-works")}>
          How it works
        </span>

        <span onClick={() => navigate("/#contact")}>
          Contact
        </span>
      </div>

      <button
  className="nav-btn"
  onClick={() => navigate("/admin/login")}
>
  Admin Login
</button>

    </nav>
  );
}
