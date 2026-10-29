import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import BottomNav from "./BottomNav.jsx";

const AppLayout = () => (
  <div className="app">
    <Sidebar />
    <div className="app-main">
      <Topbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
    <BottomNav />
  </div>
);

export default AppLayout;
