import { NavLink } from "react-router-dom";
import { mainNav } from "./navItems.js";

const BottomNav = () => (
  <nav className="bottom-nav" aria-label="Principal móvil">
    {mainNav.map(({ to, short, Icon }) => (
      <NavLink key={to} to={to}>
        <Icon aria-hidden="true" size={20} />
        <span>{short}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
