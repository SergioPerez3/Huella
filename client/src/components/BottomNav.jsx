import { NavLink } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { mainNav } from "./navItems.js";

const BottomNav = ({ onMore }) => (
  <nav className="bottom-nav" aria-label="Principal móvil">
    {mainNav
      .filter((item) => item.mobile)
      .map(({ to, short, Icon }) => (
        <NavLink key={to} to={to}>
          <Icon aria-hidden="true" size={20} />
          <span>{short}</span>
        </NavLink>
      ))}
    <button type="button" onClick={onMore}>
      <FiMoreHorizontal aria-hidden="true" size={20} />
      <span>Más</span>
    </button>
  </nav>
);

export default BottomNav;
