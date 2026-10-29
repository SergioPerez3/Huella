import { Link } from "react-router-dom";

const NotFound = () => (
  <section>
    <h1>404</h1>
    <p>Página no encontrada</p>
    <Link to="/dashboard">Volver</Link>
  </section>
);

export default NotFound;
