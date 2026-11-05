import { useState } from "react";
import usePets from "../hooks/usePets.js";
import PetExpenses from "../components/pet/PetExpenses.jsx";
import { FiDollarSign } from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";

const Expenses = () => {
  const pets = usePets();
  const [petId, setPetId] = useState("");

  return (
    <section>
      <PageHeader
        icon={FiDollarSign}
        title="Gastos"
        subtitle="Controla lo que inviertes en su bienestar"
      >
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
      </PageHeader>
      <PetExpenses petId={petId} pets={pets} />
    </section>
  );
};

export default Expenses;
