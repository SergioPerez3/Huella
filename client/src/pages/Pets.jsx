import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { getPets } from "../services/petService.js";
import PetCard from "../components/PetCard.jsx";
import { FiPlus, FiHeart } from 'react-icons/fi';
import PageHeader from '../components/PageHeader.jsx';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPets()
      .then((res) => setPets(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <PageHeader
        icon={FiHeart}
        title="Mis mascotas"
        subtitle="Las fichas de toda tu familia peluda"
      >
        <Link to="/pets/new" className="btn btn-primary">
          <FiPlus aria-hidden="true" /> Añadir mascota
        </Link>
      </PageHeader>

      {error && <p role="alert">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && pets.length === 0 && (
        <div className="card empty-state">
          <FaPaw aria-hidden="true" size={40} />
          <h2>Aún no tienes mascotas</h2>
          <p className="muted">
            Añade la primera para empezar a organizar sus cuidados.
          </p>
          <Link to="/pets/new" className="btn btn-primary">
            Añadir mascota
          </Link>
        </div>
      )}

      {pets.length > 0 && (
        <div className="pet-grid">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Pets;
