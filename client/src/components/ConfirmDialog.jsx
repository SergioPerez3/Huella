import { useEffect, useRef } from "react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  busy,
  onConfirm,
  onCancel,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dialog" onCancel={onCancel}>
      <h2>{title}</h2>
      <p className="muted">{message}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Eliminando..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
