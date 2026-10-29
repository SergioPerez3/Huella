import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import { getDashboard } from "../services/dashboardService.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p className="muted">Cargando...</p>;

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>¡Hola, {user?.name}!</h1>
          <p className="muted">Aquí tienes un resumen de lo más importante.</p>
        </div>
      </div>
      <div className="card">
        <p>Mascotas: {data.pets.length}</p>
        <p>Tareas atrasadas: {data.tasks.overdue}</p>
        <p>Gasto del mes: {(data.monthExpenses.total / 100).toFixed(2)} €</p>
      </div>
    </section>
  );
};

export default Dashboard;
