import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { updatePet } from "../../services/petService.js";

const PetFeeding = ({ pet, onUpdated }) => {
  const feeding = pet.feeding || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ food: "", amount: "", schedule: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = () => {
    setForm({
      food: feeding.food || "",
      amount: feeding.amount || "",
      schedule: feeding.schedule || "",
    });
    setError("");
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await updatePet(pet._id, { feeding: form });
      onUpdated(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stack">
      {editing ? (
        <form className="card form" onSubmit={handleSubmit}>
          <h2>Alimentación habitual</h2>
          <div className="field">
            <label htmlFor="food">Alimento (marca o tipo)</label>
            <input
              id="food"
              name="food"
              placeholder="Ej: Pienso adulto de pollo"
              value={form.food}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Cantidad</label>
            <input
              id="amount"
              name="amount"
              placeholder="Ej: 250 g al día"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="schedule">Horarios</label>
            <input
              id="schedule"
              name="schedule"
              placeholder="Ej: 8:00 y 19:00"
              value={form.schedule}
              onChange={handleChange}
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card">
          <div className="card-head">
            <h2>Alimentación habitual</h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={startEdit}
            >
              <FiEdit2 aria-hidden="true" /> Editar
            </button>
          </div>
          <dl className="info-list">
            {[
              ["Alimento", feeding.food],
              ["Cantidad", feeding.amount],
              ["Horarios", feeding.schedule],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h2>Alergias e intolerancias</h2>
          <Link to={`/pets/${pet._id}/edit`} className="btn btn-ghost btn-sm">
            <FiEdit2 aria-hidden="true" /> Editar
          </Link>
        </div>
        {pet.allergies?.length ? (
          <ul className="chip-list">
            {pet.allergies.map((allergy) => (
              <li key={allergy} className="chip chip-allergy">
                {allergy}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Ninguna registrada.</p>
        )}
      </div>
    </div>
  );
};

export default PetFeeding;
