import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import useAuth from "../hooks/useAuth.js";
import Logo from "./Logo.jsx";

const Topbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="menu-btn"
        onClick={onMenu}
        aria-label="Abrir menú"
      >
        <FiMenu aria-hidden="true" />
      </button>
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
