import { useState, useEffect } from "react";
import { getDashboard } from "../services/dashboardService.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Mascotas: {data.pets.length}</p>
      <p>Tareas atrasadas: {data.tasks.overdue}</p>
      <p>Gasto del mes: {(data.monthExpenses.total / 100).toFixed(2)} €</p>
    </section>
  );
};

export default Dashboard;
