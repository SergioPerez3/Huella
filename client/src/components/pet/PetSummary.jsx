import { useState, useEffect } from "react";
import { getWeights } from "../../services/weightService.js";

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Otro" };
const sexLabel = { male: "Macho", female: "Hembra" };

const PetSummary = ({ pet }) => {
  const [weight, setWeight] = useState(undefined);

  useEffect(() => {
    getWeights(pet._id)
      .then((res) => setWeight(res.data.at(-1) || null))
      .catch(() => setWeight(null));
  }, [pet._id]);

  const rows = [
    ["Especie", speciesLabel[pet.species]],
    ["Raza", pet.breed],
    ["Sexo", sexLabel[pet.sex]],
    [
      "Fecha de nacimiento",
      pet.birthDate && new Date(pet.birthDate).toLocaleDateString("es-ES"),
    ],
    ["Peso actual", weight === undefined ? "..." : weight && `${weight.kg} kg`],
    ["Microchip", pet.microchip],
    [
      "Alergias",
      pet.allergies?.length ? pet.allergies.join(", ") : "Ninguna registrada",
    ],
    ["Observaciones", pet.notes],
  ];

  return (
    <div className="card">
      <h2>Información general</h2>
      <dl className="info-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default PetSummary;
