import { useEffect, useMemo, useRef, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { getAge } from "../../utils/age.js";
import { buildPosterHtml } from "../../utils/posterHtml.js";

const LostPosterCard = ({ pet, active, getQr }) => {
  const [form, setForm] = useState({
    place: "",
    date: "",
    features: "",
    alert: "",
    reward: "",
    ownerName: pet.emergency?.ownerName || "",
    phone: pet.emergency?.ownerPhone || "",
    includeQr: true,
  });
  const [error, setError] = useState("");
  const [qr, setQr] = useState(null);
  const [scale, setScale] = useState(0.4);
  const previewRef = useRef(null);

  // QR de la tarjeta de emergencia (solo si está activa)
  useEffect(() => {
    setQr(active && form.includeQr ? getQr() || null : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, form.includeQr]);

  // Ajusta la hoja A4 (794 px) al ancho disponible
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setScale(el.clientWidth / 794));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const age = getAge(pet.birthDate);
  const previewHtml = useMemo(
    () => buildPosterHtml({ pet, extra: form, qr, age, preview: true }),
    [pet, form, qr, age],
  );

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone.trim()) return setError("Añade un teléfono de contacto");

    // Se abre antes de generar nada, para que el navegador no lo bloquee
    const win = window.open("", "_blank");
    if (!win) {
      return setError(
        "Tu navegador ha bloqueado la ventana. Permite las ventanas emergentes para esta página.",
      );
    }
    win.document.write(buildPosterHtml({ pet, extra: form, qr, age }));
    win.document.close();
  };

  return (
    <form className="card form poster-card" onSubmit={handleSubmit}>
      <h2>Cartel de «Se busca»</h2>
      <p className="muted">
        Si {pet.name} se pierde, crea un cartel con su foto y tus datos para
        imprimirlo o guardarlo en PDF. Lo que escribas aquí no se guarda: solo
        se usa para este cartel.
      </p>

      <div className="poster-layout">
        <div className="poster-fields">
          <div className="form-row">
            <div className="field">
              <label htmlFor="po-place">¿Dónde se perdió?</label>
              <input
                id="po-place"
                name="place"
                maxLength={100}
                placeholder="Ej: Parque del Retiro, cerca del estanque"
                value={form.place}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="po-date">Fecha</label>
              <input
                id="po-date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="po-features">Señas particulares</label>
            <input
              id="po-features"
              name="features"
              maxLength={140}
              placeholder="Ej: Pelo marrón, mancha blanca en el pecho, collar azul"
              value={form.features}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="po-alert">Aviso importante (opcional)</label>
              <input
                id="po-alert"
                name="alert"
                maxLength={100}
                placeholder="Ej: Necesita medicación diaria"
                value={form.alert}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="po-reward">Recompensa (opcional)</label>
              <input
                id="po-reward"
                name="reward"
                maxLength={60}
                placeholder="Ej: Se gratificará"
                value={form.reward}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="po-owner">Tu nombre</label>
              <input
                id="po-owner"
                name="ownerName"
                maxLength={60}
                value={form.ownerName}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="po-phone">Teléfono de contacto</label>
              <input
                id="po-phone"
                type="tel"
                name="phone"
                maxLength={30}
                placeholder="+34 600 000 000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              name="includeQr"
              checked={form.includeQr && active}
              disabled={!active}
              onChange={handleChange}
            />
            <span>
              Incluir el QR de la tarjeta de emergencia
              {!active && " (actívala y guarda para poder usarlo)"}
            </span>
          </label>

          {error && <p role="alert">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <FiPrinter aria-hidden="true" /> Crear cartel
            </button>
          </div>
        </div>

        <div className="poster-preview">
          <p className="muted">Vista previa</p>
          <div className="poster-frame" ref={previewRef}>
            <iframe
              title="Vista previa del cartel"
              srcDoc={previewHtml}
              style={{ transform: `scale(${scale})` }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LostPosterCard;
