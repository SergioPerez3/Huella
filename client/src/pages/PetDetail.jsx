import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiCamera } from "react-icons/fi";
import { getPet, deletePet, uploadPetPhoto } from "../services/petService.js";
import { getAge } from "../utils/age.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import PetSummary from "../components/pet/PetSummary.jsx";
import PetHealth from "../components/pet/PetHealth.jsx";
import PetDocuments from "../components/pet/PetDocuments.jsx";

const tabs = [
  { key: "summary", label: "Resumen" },
  { key: "health", label: "Salud" },
  { key: "feeding", label: "Alimentación" },
  { key: "weight", label: "Peso" },
  { key: "expenses", label: "Gastos" },
  { key: "documents", label: "Documentos" },
];

const PetDetail = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInput = useRef(null);

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const requestedTab = searchParams.get("tab");
  const currentTab = tabs.some((t) => t.key === requestedTab)
    ? requestedTab
    : "summary";

  useEffect(() => {
    getPet(petId)
      .then((res) => setPet(res.data))
      .catch((err) =>
        err.status === 404 ? setNotFound(true) : setError(err.message),
      )
      .finally(() => setLoading(false));
  }, [petId]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return setError("La imagen no puede superar 5 MB");

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await uploadPetPhoto(petId, formData);
      setPet(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePet(petId);
      navigate("/pets");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <p className="muted">Cargando...</p>;
  if (notFound) {
    return (
      <div className="card empty-state">
        <h2>Mascota no encontrada</h2>
        <Link to="/pets" className="btn btn-primary">
          Volver a mis mascotas
        </Link>
      </div>
    );
  }
  if (!pet) return <p role="alert">{error}</p>;

  const details = [pet.breed, getAge(pet.birthDate)]
    .filter(Boolean)
    .join(" · ");

  return (
    <section>
      <Link to="/pets" className="back-link">
        ← Volver
      </Link>

      <div className="pet-header">
        <div className="pet-photo">
          {pet.photo?.url ? (
            <img src={pet.photo.url} alt={pet.name} />
          ) : (
            <FaPaw aria-hidden="true" />
          )}
        </div>
        <div className="pet-header-info">
          <div>
            <h1>{pet.name}</h1>
            <p className="muted">{details || "Sin más datos"}</p>
          </div>
          <div className="pet-actions">
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              hidden
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => fileInput.current.click()}
              disabled={uploading}
            >
              <FiCamera aria-hidden="true" />{" "}
              {uploading ? "Subiendo..." : "Cambiar foto"}
            </button>
            <Link to={`/pets/${petId}/edit`} className="btn btn-ghost btn-sm">
              <FiEdit2 aria-hidden="true" /> Editar
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfirmOpen(true)}
            >
              <FiTrash2 aria-hidden="true" /> Eliminar
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>

      <nav className="tabs" role="tablist" aria-label="Secciones de la mascota">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={currentTab === key}
            onClick={() => setSearchParams({ tab: key })}
          >
            {label}
          </button>
        ))}
      </nav>

      <div role="tabpanel">
        {currentTab === "summary" && <PetSummary pet={pet} />}
        {currentTab === "health" && <PetHealth petId={petId} />}
        {currentTab === "documents" && <PetDocuments petId={petId} />}
        {!["summary", "health", "documents"].includes(currentTab) && (
          <div className="card empty-state">
            <p className="muted">Próximamente</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        busy={deleting}
        title={`¿Eliminar a ${pet.name}?`}
        message="Se borrarán también su historial de salud, pesos, tareas, gastos y documentos. No se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
};

export default PetDetail;
