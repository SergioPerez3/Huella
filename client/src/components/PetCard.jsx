import { FaPaw } from "react-icons/fa";
import { getAge } from "../utils/age.js";

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Otro" };

const PetCard = ({ pet }) => {
  const details = [
    pet.breed || speciesLabel[pet.species],
    getAge(pet.birthDate),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="card pet-card">
      <div className="pet-card-photo">
        {pet.photo?.url ? (
          <img src={pet.photo.url} alt={pet.name} />
        ) : (
          <FaPaw aria-hidden="true" />
        )}
      </div>
      <div className="pet-card-body">
        <h2>{pet.name}</h2>
        <p className="muted">{details}</p>
      </div>
    </article>
  );
};

export default PetCard;
