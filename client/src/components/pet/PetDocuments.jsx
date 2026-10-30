import { useState, useEffect, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/documentService.js";
import { validateFile } from "../../utils/file.js";
import DocumentItem from "../DocumentItem.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";

const PetDocuments = ({ petId }) => {
  const fileInput = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDocuments(petId)
      .then((res) => setDocuments(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [petId]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateFile(file);
    if (problem) return setError(problem);

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadDocument(petId, formData);
      setDocuments((docs) => [res.data, ...docs]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteDocument(petId, toDelete._id);
      setDocuments((docs) => docs.filter((d) => d._id !== toDelete._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setToDelete(null);
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <div className="toolbar">
        <p className="muted">
          Informes, recetas, radiografías y otros archivos (JPG, PNG, WebP o
          PDF, máx. 5 MB).
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileInput.current.click()}
          disabled={uploading}
        >
          <FiUpload aria-hidden="true" />{" "}
          {uploading ? "Subiendo..." : "Subir documento"}
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && documents.length === 0 && (
        <div className="card empty-state">
          <p className="muted">No hay documentos todavía.</p>
        </div>
      )}

      {documents.length > 0 && (
        <ul className="card doc-list">
          {documents.map((doc) => (
            <DocumentItem key={doc._id} doc={doc} onDelete={setToDelete} />
          ))}
        </ul>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleFile}
        hidden
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        busy={busy}
        title="¿Eliminar este documento?"
        message="El archivo se borrará de forma definitiva."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default PetDocuments;
