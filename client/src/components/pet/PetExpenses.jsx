import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getExpenses,
  getExpenseSummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService.js";
import {
  categories,
  formatMoney,
  toCents,
  monthRange,
} from "../../utils/expenses.js";
import { formatDate, toDateInput } from "../../utils/format.js";
import ConfirmDialog from "../ConfirmDialog.jsx";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({
  date: today(),
  amount: "",
  category: "food",
  description: "",
});
const categoryOf = (key) => categories[key] || categories.other;

const PetExpenses = ({ petId }) => {
  const [month, setMonth] = useState(today().slice(0, 7));
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const { from, to } = monthRange(month);
    setLoading(true);
    Promise.all([
      getExpenseSummary({ month, petId }),
      getExpenses({ petId, from, to, limit: 100 }),
    ])
      .then(([summaryRes, listRes]) => {
        setSummary(summaryRes.data);
        setExpenses(listRes.data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [petId, month, version]);

  const refresh = () => setVersion((v) => v + 1);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = toCents(form.amount);
    if (!Number.isFinite(amount) || amount <= 0)
      return setError("Introduce un importe válido");

    setError("");
    setSubmitting(true);
    try {
      const body = {
        petId,
        amount,
        category: form.category,
        date: form.date,
        description: form.description,
      };
      if (editingId) await updateExpense(editingId, body);
      else await createExpense(body);

      const savedMonth = form.date.slice(0, 7);
      resetForm();
      if (savedMonth !== month) setMonth(savedMonth);
      else refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      date: toDateInput(expense.date),
      amount: (expense.amount / 100).toFixed(2),
      category: expense.category,
      description: expense.description || "",
    });
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteExpense(toDelete._id);
      if (editingId === toDelete._id) resetForm();
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setToDelete(null);
      setBusy(false);
    }
  };

  const chartData = (summary?.byCategory || []).map((c) => ({
    name: categoryOf(c.category).label,
    value: c.total,
    color: categoryOf(c.category).color,
  }));

  return (
    <div className="stack">
      <div className="toolbar">
        <div className="field">
          <label htmlFor="expense-month">Mes</label>
          <input
            id="expense-month"
            type="month"
            className="month-picker"
            value={month}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
          />
        </div>
      </div>

      <form className="card expense-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="expense-date">Fecha</label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="expense-amount">Importe (€)</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="expense-category">Categoría</label>
          <select
            id="expense-category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field field-wide">
          <label htmlFor="expense-description">Descripción</label>
          <input
            id="expense-description"
            name="description"
            placeholder="Ej: Saco de pienso 12 kg"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions field-wide">
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Añadir gasto"}
          </button>
        </div>
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && summary?.count === 0 && (
        <div className="card empty-state">
          <p className="muted">No hay gastos en este mes.</p>
        </div>
      )}

      {summary?.count > 0 && (
        <>
          <div className="stat-row">
            <div className="card">
              <p className="muted">Total del mes</p>
              <p className="stat">{formatMoney(summary.total)}</p>
              <p className="muted">
                {summary.count} {summary.count === 1 ? "gasto" : "gastos"}
              </p>
            </div>
          </div>

          <div className="card donut-card">
            <div className="donut-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {chartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatMoney(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="legend">
              {chartData.map((item) => (
                <li key={item.name}>
                  <span className="dot" style={{ background: item.color }} />
                  <span className="legend-label">{item.name}</span>
                  <strong>{formatMoney(item.value)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {expenses.length > 0 && (
        <ul className="card expense-list">
          {expenses.map((expense) => (
            <li key={expense._id}>
              <span
                className="dot"
                style={{ background: categoryOf(expense.category).color }}
              />
              <div className="expense-main">
                <strong>
                  {expense.description || categoryOf(expense.category).label}
                </strong>
                <span className="muted">
                  {categoryOf(expense.category).label} ·{" "}
                  {formatDate(expense.date)}
                </span>
              </div>
              <span className="expense-amount">
                {formatMoney(expense.amount)}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => startEdit(expense)}
                aria-label="Editar gasto"
                title="Editar"
              >
                <FiEdit2 aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-btn danger"
                onClick={() => setToDelete(expense)}
                aria-label="Eliminar gasto"
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
        title="¿Eliminar este gasto?"
        message="Dejará de contar en el resumen del mes."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default PetExpenses;
