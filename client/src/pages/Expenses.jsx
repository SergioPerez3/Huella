import { useState } from "react";
import usePets from "../hooks/usePets.js";
import PetExpenses from "../components/pet/PetExpenses.jsx";

const Expenses = () => {
  const pets = usePets();
  const [petId, setPetId] = useState("");

  return (
    <section>
      <div className="page-header">
        <h1>Gastos</h1>
        <select
          aria-label="Filtrar por mascota"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
        >
          <option value="">Todas las mascotas</option>
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>
      <PetExpenses petId={petId} pets={pets} />
    </section>
  );
};

export default Expenses;
