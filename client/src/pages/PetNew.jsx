import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPet } from "../services/petService.js";

const initialForm = {
  name: "",
  species: "dog",
  breed: "",
  birthDate: "",
  sex: "",
};

const PetNew = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== ""),
      );
      await createPet(body);
      navigate("/pets");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <h1>Nueva mascota</h1>
      </div>
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
        {error && <p role="alert">{error}</p>}
        <div className="form-actions">
          <Link to="/pets" className="btn btn-ghost">
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PetNew;
