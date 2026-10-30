import { useState } from "react";
import { Link } from "react-router-dom";

const toForm = (pet = {}) => ({
  name: pet.name || "",
  species: pet.species || "dog",
  breed: pet.breed || "",
  birthDate: pet.birthDate ? pet.birthDate.slice(0, 10) : "",
  sex: pet.sex || "",
  microchip: pet.microchip || "",
  allergies: (pet.allergies || []).join(", "),
  notes: pet.notes || "",
});

const toBody = (form) => ({
  ...form,
  sex: form.sex || null,
  birthDate: form.birthDate || null,
  allergies: form.allergies
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean),
});

const PetForm = ({ initialPet, onSubmit, submitLabel, cancelTo }) => {
  const [form, setForm] = useState(toForm(initialPet));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(toBody(form));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="species">Especie</label>
        <select
          id="species"
          name="species"
          value={form.species}
          onChange={handleChange}
        >
          <option value="dog">Perro</option>
          <option value="cat">Gato</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="breed">Raza</label>
        <input
          id="breed"
          name="breed"
          value={form.breed}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="birthDate">Fecha de nacimiento</label>
        <input
          id="birthDate"
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="sex">Sexo</label>
        <select id="sex" name="sex" value={form.sex} onChange={handleChange}>
          <option value="">Sin indicar</option>
          <option value="male">Macho</option>
          <option value="female">Hembra</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="microchip">Microchip</label>
        <input
          id="microchip"
          name="microchip"
          value={form.microchip}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="allergies">Alergias (separadas por comas)</label>
        <input
          id="allergies"
          name="allergies"
          value={form.allergies}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="notes">Observaciones</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="form-actions">
        <Link to={cancelTo} className="btn btn-ghost">
          Cancelar
        </Link>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PetForm;
