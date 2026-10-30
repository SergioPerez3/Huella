import { useNavigate } from "react-router-dom";
import { createPet } from "../services/petService.js";
import PetForm from "../components/PetForm.jsx";

const PetNew = () => {
  const navigate = useNavigate();

  const handleSubmit = async (body) => {
    const res = await createPet(body);
    navigate(`/pets/${res.data._id}`);
  };

  return (
    <section>
      <div className="page-header">
        <h1>Nueva mascota</h1>
      </div>
      <PetForm onSubmit={handleSubmit} submitLabel="Guardar" cancelTo="/pets" />
    </section>
  );
};

export default PetNew;
