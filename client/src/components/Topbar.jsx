import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../hooks/useAuth.js";
import Logo from "./Logo.jsx";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Logo className="topbar-logo" />
      <Link to="/settings" className="user-chip">
        <span className="avatar">{user?.name?.[0]?.toUpperCase()}</span>
        <span className="user-name">{user?.name}</span>
      </Link>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={handleLogout}
        aria-label="Cerrar sesión"
      >
        <FiLogOut aria-hidden="true" />
        <span className="logout-text">Salir</span>
      </button>
    </header>
  );
};

export default Topbar;
