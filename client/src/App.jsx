import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
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
import NotFound from "./pages/NotFound.jsx";
import PetDetail from "./pages/PetDetail.jsx";
import PetEdit from "./pages/PetEdit.jsx";
import Tasks from "./pages/Tasks.jsx";
import Calendar from "./pages/Calendar.jsx";
import Health from "./pages/Health.jsx";
import Expenses from "./pages/Expenses.jsx";
import Settings from "./pages/Settings.jsx";
// import EmergencyCard from "./pages/EmergencyCard.jsx";
import Landing from "./pages/Landing.jsx";
import { redirectIfAuth } from "./loaders/redirectIfAuth.js";
import Services from "./pages/Services.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Landing />, loader: redirectIfAuth },
  {
    element: <PublicLayout />,
    children: [
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
      { path: "pets/:petId", element: <PetDetail /> },
      { path: "pets/:petId/edit", element: <PetEdit /> },
      { path: "calendar", element: <Calendar /> },
      { path: "tasks", element: <Tasks /> },
      { path: "health", element: <Health /> },
      { path: "expenses", element: <Expenses /> },
      { path: "services", element: <Services /> },
      { path: "settings", element: <Settings /> },
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
