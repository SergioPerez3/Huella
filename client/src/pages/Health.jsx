import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllHealthRecords } from "../services/healthService.js";
import {
  getAllDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/documentService.js";
import usePets from "../hooks/usePets.js";
import { healthTypes } from "../utils/health.js";
import { formatDate } from "../utils/format.js";
import { dayDiff, dueText } from "../utils/dates.js";
import DocumentCard from "../components/DocumentCard.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { FiActivity } from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";

const MAX_SIZE = 5 * 1024 * 1024;

const tabs = [
  { key: "followup", label: "Seguimiento" },
  { key: "history", label: "Informes e historial" },
  { key: "files", label: "Archivos" },
];

const Health = () => {
  const pets = usePets();
  const [tab, setTab] = useState("followup");
  const [petId, setPetId] = useState("");
  const [records, setRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [upload, setUpload] = useState({ petId: "", name: "", file: null });
  const [fileKey, setFileKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => setVersion((v) => v + 1);

  useEffect(() => {
    setLoading(true);
    const params = petId ? { petId } : {};
    Promise.all([getAllHealthRecords(params), getAllDocuments(params)])
      .then(([recordsRes, docsRes]) => {
        setRecords(recordsRes.data);
        setDocuments(docsRes.data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [petId, version]);

  const petName = (id) => pets.find((p) => p._id === id)?.name;

  const followUps = records
    .filter((r) => r.nextDueDate && dayDiff(r.nextDueDate) >= 0)
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

  const activeTreatments = records.filter(
    (r) =>
      r.type === "treatment" &&
      (!r.treatment?.endDate || dayDiff(r.treatment.endDate) >= 0),
  );

  const handleUpload = async (e) => {
    e.preventDefault();
    const target = upload.petId || pets[0]?._id;
    if (!target) return setError("Primero añade una mascota");
    if (!upload.file) return setError("Selecciona un archivo");
    if (upload.file.size > MAX_SIZE)
      return setError("El archivo no puede superar los 5 MB");

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", upload.file);
      if (upload.name.trim()) formData.append("name", upload.name.trim());
      await uploadDocument(target, formData);
      setUpload({ petId: upload.petId, name: "", file: null });
      setFileKey((k) => k + 1);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteDocument(toDelete.petId, toDelete._id);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setToDelete(null);
      setBusy(false);
    }
  };

  const renderRecord = (record, extra) => (
    <li key={record._id} className="health-row">
      <div className="health-main">
        <strong>{record.title}</strong>
        <span className="muted">
          {healthTypes[record.type]} · {formatDate(record.date)}
        </span>
        {record.type === "treatment" && record.treatment?.drug && (
          <span className="muted">
            {record.treatment.drug}
            {record.treatment.dose && ` · ${record.treatment.dose}`}
          </span>
        )}
        {record.notes && <p className="health-notes">{record.notes}</p>}
      </div>
      <div className="health-side">
        <Link to={`/pets/${record.petId}?tab=health`} className="pet-tag">
          {petName(record.petId)}
        </Link>
        {extra}
      </div>
    </li>
  );

  return (
    <section>
      <PageHeader
        icon={FiActivity}
        title="Salud"
        subtitle="Seguimiento, informes y archivos"
      />

      <div className="toolbar">
        <nav
          className="tabs tabs-inline"
          role="tablist"
          aria-label="Secciones de salud"
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <select
          aria-label="Filtrar por mascota"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
        >
          <option value="">Todas las mascotas</option>
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p role="alert">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && tab === "followup" && (
        <div className="stack">
          <section className="card">
            <h2>Próximas revisiones y vacunas</h2>
            {followUps.length === 0 ? (
              <p className="muted">
                No hay nada programado. Al crear un registro de salud puedes
                indicar su próxima fecha.
              </p>
            ) : (
              <ul className="health-list">
                {followUps.map((record) => {
                  const days = dayDiff(record.nextDueDate);
                  return renderRecord(
                    record,
                    <span
                      className={`health-due ${days <= 7 ? "is-soon" : ""}`}
                    >
                      {formatDate(record.nextDueDate)} · {dueText(days)}
                    </span>,
                  );
                })}
              </ul>
            )}
          </section>

          <section className="card">
            <h2>Tratamientos activos</h2>
            {activeTreatments.length === 0 ? (
              <p className="muted">No hay tratamientos en curso.</p>
            ) : (
              <ul className="health-list">
                {activeTreatments.map((record) =>
                  renderRecord(
                    record,
                    record.treatment?.endDate && (
                      <span className="health-due">
                        Hasta {formatDate(record.treatment.endDate)}
                      </span>
                    ),
                  ),
                )}
              </ul>
            )}
          </section>
        </div>
      )}

      {!loading && tab === "history" && (
        <section className="card">
          {records.length === 0 ? (
            <p className="muted">
              Todavía no hay registros de salud. Añádelos desde la ficha de cada
              mascota.
            </p>
          ) : (
            <ul className="health-list">
              {records.map((record) => renderRecord(record))}
            </ul>
          )}
        </section>
      )}

      {!loading && tab === "files" && (
        <div className="stack">
          <form className="card upload-form" onSubmit={handleUpload}>
            <div className="field">
              <label htmlFor="upload-pet">Mascota</label>
              <select
                id="upload-pet"
                value={upload.petId || pets[0]?._id || ""}
                onChange={(e) =>
                  setUpload({ ...upload, petId: e.target.value })
                }
              >
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="upload-name">Nombre (opcional)</label>
              <input
                id="upload-name"
                placeholder="Ej: Radiografía cadera"
                value={upload.name}
                onChange={(e) => setUpload({ ...upload, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="upload-file">
                Archivo (imagen o PDF, máx. 5 MB)
              </label>
              <input
                key={fileKey}
                id="upload-file"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  setUpload({ ...upload, file: e.target.files[0] || null })
                }
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </button>
          </form>

          {documents.length === 0 ? (
            <div className="card empty-state">
              <p className="muted">No hay archivos todavía.</p>
            </div>
          ) : (
            <ul className="doc-grid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  doc={doc}
                  petName={petName(doc.petId)}
                  onDelete={setToDelete}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        busy={busy}
        title="¿Eliminar este archivo?"
        message="Se borrará también de la nube y no se podrá recuperar."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default Health;
