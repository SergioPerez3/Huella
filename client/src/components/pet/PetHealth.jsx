import { useState, useEffect, useRef } from "react";
import { FiPlus, FiPaperclip, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from "../../services/healthService.js";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/documentService.js";
import { healthTypes } from "../../utils/health.js";
import { formatDate } from "../../utils/format.js";
import { validateFile } from "../../utils/file.js";
import HealthForm from "./HealthForm.jsx";
import DocumentItem from "../DocumentItem.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";

const PetHealth = ({ petId }) => {
  const fileInput = useRef(null);
  const attachTo = useRef(null);

  const [records, setRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState("");
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getHealthRecords(petId, { type }), getDocuments(petId)])
      .then(([recordsRes, docsRes]) => {
        setRecords(recordsRes.data);
        setDocuments(docsRes.data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [petId, type, version]);

  const refresh = () => setVersion((v) => v + 1);
  const docsOf = (recordId) => documents.filter((d) => d.recordId === recordId);
  const isOverdue = (date) => new Date(date) < new Date();

  const handleSave = async (body) => {
    if (editing === "new") await createHealthRecord(petId, body);
    else await updateHealthRecord(petId, editing._id, body);
    setEditing(null);
    refresh();
  };

  const startAttach = (recordId) => {
    attachTo.current = recordId;
    fileInput.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateFile(file);
    if (problem) return setError(problem);

    const recordId = attachTo.current;
    setError("");
    setUploadingId(recordId);
    try {
      const formData = new FormData();
      formData.append("recordId", recordId);
      formData.append("file", file);
      const res = await uploadDocument(petId, formData);
      setDocuments((docs) => [res.data, ...docs]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleConfirm = async () => {
    setBusy(true);
    try {
      if (confirm.kind === "record")
        await deleteHealthRecord(petId, confirm.item._id);
      else await deleteDocument(petId, confirm.item._id);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirm(null);
      setBusy(false);
    }
  };

  const isRecord = confirm?.kind === "record";

  return (
    <div className="stack">
      <div className="toolbar">
        <select
          aria-label="Filtrar por tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(healthTypes).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setEditing("new")}
        >
          <FiPlus aria-hidden="true" /> Añadir registro
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {editing && (
        <HealthForm
          key={editing === "new" ? "new" : editing._id}
          record={editing === "new" ? null : editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="muted">Cargando...</p>}

      {!loading && records.length === 0 && (
        <div className="card empty-state">
          <p className="muted">
            Todavía no hay registros de salud. Añade la primera vacuna, visita o
            tratamiento.
          </p>
        </div>
      )}

      <ul className="timeline">
        {records.map((record) => (
          <li key={record._id} className="card record">
            <div className="record-head">
              <span className={`chip chip-${record.type}`}>
                {healthTypes[record.type]}
              </span>
              <h3>{record.title}</h3>
              <time dateTime={record.date}>{formatDate(record.date)}</time>
            </div>

            {record.notes && <p>{record.notes}</p>}

            {record.type === "treatment" && record.treatment?.drug && (
              <p className="muted">
                {[record.treatment.drug, record.treatment.dose]
                  .filter(Boolean)
                  .join(" · ")}
                {record.treatment.startDate &&
                  ` · del ${formatDate(record.treatment.startDate)}`}
                {record.treatment.endDate &&
                  ` al ${formatDate(record.treatment.endDate)}`}
              </p>
            )}

            {record.nextDueDate && (
              <p>
                <span
                  className={`chip ${isOverdue(record.nextDueDate) ? "chip-warn" : ""}`}
                >
                  {isOverdue(record.nextDueDate) ? "Vencida" : "Próxima"}:{" "}
                  {formatDate(record.nextDueDate)}
                </span>
              </p>
            )}

            {docsOf(record._id).length > 0 && (
              <ul className="doc-list">
                {docsOf(record._id).map((doc) => (
                  <DocumentItem
                    key={doc._id}
                    doc={doc}
                    onDelete={(d) => setConfirm({ kind: "document", item: d })}
                  />
                ))}
              </ul>
            )}

            <div className="record-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => startAttach(record._id)}
                disabled={uploadingId === record._id}
              >
                <FiPaperclip aria-hidden="true" />{" "}
                {uploadingId === record._id
                  ? "Subiendo..."
                  : "Adjuntar archivo"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setEditing(record)}
              >
                <FiEdit2 aria-hidden="true" /> Editar
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirm({ kind: "record", item: record })}
              >
                <FiTrash2 aria-hidden="true" /> Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFile}
        hidden
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        title={
          isRecord ? "¿Eliminar este registro?" : "¿Eliminar este documento?"
        }
        message={
          isRecord
            ? "Los documentos adjuntos se conservan en la pestaña Documentos."
            : "El archivo se borrará de forma definitiva."
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default PetHealth;
