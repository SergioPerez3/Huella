import { NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import { mainNav, settingsNav } from "./navItems.js";

const Sidebar = () => (
  <aside className="sidebar">
    <Logo />
    <nav aria-label="Principal">
      {[...mainNav, settingsNav].map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} title={label}>
          <Icon aria-hidden="true" size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
