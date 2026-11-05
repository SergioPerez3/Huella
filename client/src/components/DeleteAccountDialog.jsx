import { useEffect, useRef, useState } from "react";

const DeleteAccountDialog = ({ open, onConfirm, onCancel }) => {
  const ref = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) {
      setPassword("");
      setError("");
      setBusy(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog" onCancel={onCancel}>
      <form className="form" onSubmit={handleSubmit}>
        <h2>¿Eliminar tu cuenta?</h2>
        <p className="muted">
          Se borrarán tu cuenta y todos sus datos: mascotas, salud, tareas,
          gastos y archivos. No se puede deshacer.
        </p>
        <div className="field">
          <label htmlFor="delete-password">
            Escribe tu contraseña para confirmar
          </label>
          <input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            disabled={busy || !password}
          >
            {busy ? "Eliminando..." : "Eliminar cuenta"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default DeleteAccountDialog;
