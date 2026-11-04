import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Logo from "./Logo.jsx";
import { mainNav, settingsNav } from "./navItems.js";

const MobileMenu = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="mobile-menu-backdrop" onClick={onClose} />
      <aside className="mobile-menu-panel" aria-label="Menú de navegación">
        <div className="mobile-menu-head">
          <Logo />
          <button
            type="button"
            className="menu-btn menu-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Principal">
          {[...mainNav, settingsNav].map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}>
              <Icon aria-hidden="true" size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileMenu;
