import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { requiredAuth } from "./loaders/requiredAuth.js";
import PublicLayout from "./components/PublicLayout.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pets from "./pages/Pets.jsx";
import PetNew from "./pages/PetNew.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    element: <AppLayout />,
    loader: requiredAuth,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "pets", element: <Pets /> },
      { path: "pets/new", element: <PetNew /> },
      { path: "calendar", element: <ComingSoon title="Calendario" /> },
      { path: "tasks", element: <ComingSoon title="Tareas" /> },
      { path: "expenses", element: <ComingSoon title="Gastos" /> },
      { path: "settings", element: <ComingSoon title="Configuración" /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
