import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiPrinter,
  FiRefreshCw,
} from "react-icons/fi";
import {
  updateEmergency,
  regenerateEmergency,
} from "../../services/petService.js";
import ConfirmDialog from "../ConfirmDialog.jsx";
import LostPosterCard from "./LostPosterCard.jsx";

const toForm = (e = {}) => ({
  enabled: Boolean(e.enabled),
  ownerName: e.ownerName || "",
  ownerPhone: e.ownerPhone || "",
  vetContact: e.vetContact || "",
  instructions: e.instructions || "",
  conditions: e.conditions || "",
  showAllergies: Boolean(e.showAllergies),
  showMedication: Boolean(e.showMedication),
  showConditions: Boolean(e.showConditions),
});

const PetEmergency = ({ pet, onChange }) => {
  const [form, setForm] = useState(toForm(pet.emergency));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const qrBox = useRef(null);

  const token = pet.emergency?.publicToken;
  const url = token ? `${window.location.origin}/e/${token}` : "";
  const active = Boolean(pet.emergency?.enabled && token);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.enabled && !form.ownerPhone.trim()) {
      return setError("Añade un teléfono de contacto para activar la tarjeta");
    }
    setError("");
    setSaving(true);
    try {
      const res = await updateEmergency(pet._id, form);
      onChange({ ...pet, emergency: res.data.emergency });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar. Cópialo manualmente.");
    }
  };

  const handleDownload = () => {
    const canvas = qrBox.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `qr-${pet.name}.png`;
    link.click();
  };

  const handleRegenerate = async () => {
    setBusy(true);
    try {
      const res = await regenerateEmergency(pet._id);
      onChange({ ...pet, emergency: res.data.emergency });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="emergency-grid">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Tarjeta de emergencia</h2>
        <p className="muted">
          Si {pet.name} se pierde, quien escanee su QR verá esta ficha y podrá
          avisarte. Solo se muestra lo que actives aquí.
        </p>

        <label className="check-row">
          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
          />
          <span>Activar tarjeta pública</span>
        </label>

        <div className="form-row">
          <div className="field">
            <label htmlFor="em-owner">Tu nombre</label>
            <input
              id="em-owner"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="em-phone">Teléfono de contacto</label>
            <input
              id="em-phone"
              type="tel"
              name="ownerPhone"
              placeholder="+34 600 000 000"
              value={form.ownerPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="em-vet">Veterinario (opcional)</label>
          <input
            id="em-vet"
            name="vetContact"
            placeholder="Clínica y teléfono"
            value={form.vetContact}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="em-instructions">
            Instrucciones para quien la encuentre
          </label>
          <textarea
            id="em-instructions"
            name="instructions"
            placeholder="Ej: Es muy tímido, ofrécele agua y llámame."
            value={form.instructions}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="em-conditions">Condiciones médicas</label>
          <textarea
            id="em-conditions"
            name="conditions"
            placeholder="Ej: Epilepsia controlada"
            value={form.conditions}
            onChange={handleChange}
          />
        </div>

        <fieldset className="check-group">
          <legend>Mostrar en la ficha pública</legend>
          <label className="check-row">
            <input
              type="checkbox"
              name="showAllergies"
              checked={form.showAllergies}
              onChange={handleChange}
            />
            <span>Alergias</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              name="showMedication"
              checked={form.showMedication}
              onChange={handleChange}
            />
            <span>Medicación actual</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              name="showConditions"
              checked={form.showConditions}
              onChange={handleChange}
            />
            <span>Condiciones médicas</span>
          </label>
        </fieldset>

        <p className="muted">
          Cualquiera que tenga el enlace o el QR podrá ver estos datos. No
          compartas información sensible.
        </p>

        {error && <p role="alert">{error}</p>}
        {saved && (
          <p role="status" className="form-success">
            Cambios guardados
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      <div className="card qr-panel">
        {active ? (
          <>
            <div className="qr-label">
              <strong className="qr-label-title">¡Me he perdido!</strong>
              <div className="qr-box" ref={qrBox}>
                <QRCodeCanvas
                  value={url}
                  size={512}
                  level="M"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <span className="qr-label-name">{pet.name}</span>
              <span className="qr-label-hint">
                Escanea para avisar a mi familia
              </span>
            </div>

            <p className="qr-url" title={url}>
              {url}
            </p>

            <div className="qr-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <FiCheck aria-hidden="true" />
                ) : (
                  <FiCopy aria-hidden="true" />
                )}{" "}
                {copied ? "Copiado" : "Copiar enlace"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleDownload}
              >
                <FiDownload aria-hidden="true" /> Descargar QR
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => window.print()}
              >
                <FiPrinter aria-hidden="true" /> Imprimir etiqueta
              </button>
              <a
                className="btn btn-ghost btn-sm"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver ficha pública
              </a>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmOpen(true)}
              >
                <FiRefreshCw aria-hidden="true" /> Regenerar enlace
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p className="muted">
              Activa la tarjeta y guarda para generar el enlace y el código QR.
            </p>
          </div>
        )}
      </div>
      <LostPosterCard
        pet={pet}
        active={active}
        getQr={() =>
          qrBox.current?.querySelector("canvas")?.toDataURL("image/png")
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        busy={busy}
        title="¿Regenerar el enlace?"
        message="El QR y el enlace actuales dejarán de funcionar. Si ya imprimiste el QR para el collar, tendrás que imprimir el nuevo."
        confirmLabel="Regenerar"
        onConfirm={handleRegenerate}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default PetEmergency;
