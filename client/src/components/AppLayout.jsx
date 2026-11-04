import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import BottomNav from "./BottomNav.jsx";
import MobileMenu from "./MobileMenu.jsx";

const AppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar />
      <div className="app-main">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <BottomNav onMore={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default AppLayout;
