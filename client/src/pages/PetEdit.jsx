import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPet, updatePet } from "../services/petService.js";
import PetForm from "../components/PetForm.jsx";

const PetEdit = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPet(petId)
      .then((res) => setPet(res.data))
      .catch((err) => setError(err.message));
  }, [petId]);

  const handleSubmit = async (body) => {
    await updatePet(petId, body);
    navigate(`/pets/${petId}`);
  };

  if (error) return <p role="alert">{error}</p>;
  if (!pet) return <p className="muted">Cargando...</p>;

  return (
    <section>
      <div className="page-header">
        <h1>Editar a {pet.name}</h1>
      </div>
      <PetForm
        initialPet={pet}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        cancelTo={`/pets/${petId}`}
      />
    </section>
  );
};

export default PetEdit;
