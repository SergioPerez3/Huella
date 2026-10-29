import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
