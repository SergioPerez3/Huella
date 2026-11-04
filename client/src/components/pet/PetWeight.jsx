import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getWeights,
  createWeight,
  updateWeight,
  deleteWeight,
} from "../../services/weightService.js";
import {
  formatDate,
  formatShortDate,
  toDateInput,
} from "../../utils/format.js";
import ConfirmDialog from "../ConfirmDialog.jsx";

const today = () => new Date().toISOString().slice(0, 10);

const PetWeight = ({ petId }) => {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ date: today(), kg: "" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    getWeights(petId)
      .then((res) => {
        setWeights(res.data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [petId, version]);

  const refresh = () => setVersion((v) => v + 1);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ date: today(), kg: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body = { date: form.date, kg: Number(form.kg) };
      if (editingId) await updateWeight(petId, editingId, body);
      else await createWeight(petId, body);
      resetForm();
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (weight) => {
    setEditingId(weight._id);
    setForm({ date: toDateInput(weight.date), kg: String(weight.kg) });
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteWeight(petId, toDelete._id);
      if (editingId === toDelete._id) resetForm();
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setToDelete(null);
      setBusy(false);
    }
  };

  const latest = weights.at(-1);
  const previous = weights.at(-2);
  const diff = latest && previous ? latest.kg - previous.kg : null;
  const chartData = weights.map((w) => ({
    date: formatShortDate(w.date),
    kg: w.kg,
  }));

  return (
    <div className="stack">
      <form className="card weight-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="weight-date">Fecha</label>
          <input
            id="weight-date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="weight-kg">Peso (kg)</label>
          <input
            id="weight-kg"
            type="number"
            name="kg"
            step="0.1"
            min="0.1"
            value={form.kg}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Añadir peso"}
        </button>
        {editingId && (
          <button type="button" className="btn btn-ghost" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && weights.length === 0 && (
        <div className="card empty-state">
          <p className="muted">
            Aún no hay pesos registrados. Añade el primero.
          </p>
        </div>
      )}

      {latest && (
        <div className="stat-row">
          <div className="card">
            <p className="muted">Peso actual</p>
            <p className="stat">{latest.kg} kg</p>
            <p className="muted">{formatDate(latest.date)}</p>
          </div>
          {diff !== null && (
            <div className="card">
              <p className="muted">Cambio respecto al anterior</p>
              <p className="stat">
                {diff > 0 ? "+" : ""}
                {diff.toFixed(1)} kg
              </p>
            </div>
          )}
        </div>
      )}

      {weights.length >= 2 && (
        <div className="card">
          <h2>Evolución del peso</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 16, right: 16, bottom: 0, left: -16 }}
              >
                <CartesianGrid stroke="#e8e2d4" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[
                    (min) => Math.floor(min - 1),
                    (max) => Math.ceil(max + 1),
                  ]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [`${value} kg`, "Peso"]} />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="#1c7a5a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {weights.length > 0 && (
        <ul className="card weight-list">
          {[...weights].reverse().map((w) => (
            <li key={w._id}>
              <time dateTime={w.date}>{formatDate(w.date)}</time>
              <strong>{w.kg} kg</strong>
              <button
                type="button"
                className="icon-btn"
                onClick={() => startEdit(w)}
                aria-label="Editar peso"
                title="Editar"
              >
                <FiEdit2 aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-btn danger"
                onClick={() => setToDelete(w)}
                aria-label="Eliminar peso"
                title="Eliminar"
              >
                <FiTrash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        busy={busy}
        title="¿Eliminar este peso?"
        message="El registro desaparecerá del historial y del gráfico."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default PetWeight;
