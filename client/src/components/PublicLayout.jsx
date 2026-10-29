import { Outlet } from "react-router-dom";
import Logo from "./Logo.jsx";

const PublicLayout = () => (
  <div className="public-layout">
    <div className="public-box">
      <Logo />
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  </div>
);

export default PublicLayout;
