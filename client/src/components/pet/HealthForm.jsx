import { useState } from "react";
import { healthTypes } from "../../utils/health.js";
import { toDateInput } from "../../utils/format.js";

const toForm = (record) => ({
  type: record?.type || "vaccine",
  date: toDateInput(record?.date) || new Date().toISOString().slice(0, 10),
  title: record?.title || "",
  notes: record?.notes || "",
  nextDueDate: toDateInput(record?.nextDueDate),
  drug: record?.treatment?.drug || "",
  dose: record?.treatment?.dose || "",
  startDate: toDateInput(record?.treatment?.startDate),
  endDate: toDateInput(record?.treatment?.endDate),
});

const toBody = (f) => {
  const body = {
    type: f.type,
    date: f.date,
    title: f.title,
    notes: f.notes,
    nextDueDate: f.nextDueDate || null,
  };
  if (f.type === "treatment") {
    body.treatment = {
      drug: f.drug,
      dose: f.dose,
      startDate: f.startDate || null,
      endDate: f.endDate || null,
    };
  }
  return body;
};

const HealthForm = ({ record, onSubmit, onCancel }) => {
  const [form, setForm] = useState(toForm(record));
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
      <h2>{record ? "Editar registro" : "Nuevo registro"}</h2>
      <div className="form-row">
        <div className="field">
          <label htmlFor="type">Tipo</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {Object.entries(healthTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="date">Fecha</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          placeholder="Ej: Vacuna de la rabia"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="notes">Notas</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label htmlFor="nextDueDate">Próxima fecha (revisión o dosis)</label>
        <input
          id="nextDueDate"
          type="date"
          name="nextDueDate"
          value={form.nextDueDate}
          onChange={handleChange}
        />
      </div>
      {form.type === "treatment" && (
        <>
          <div className="form-row">
            <div className="field">
              <label htmlFor="drug">Medicamento</label>
              <input
                id="drug"
                name="drug"
                value={form.drug}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="dose">Dosis indicada</label>
              <input
                id="dose"
                name="dose"
                value={form.dose}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="startDate">Inicio</label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="endDate">Fin</label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default HealthForm;
