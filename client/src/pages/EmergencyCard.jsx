import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { getEmergencyCard } from "../services/publicService.js";

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Mascota" };

const EmergencyCard = () => {
  const { token } = useParams();
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    getEmergencyCard(token)
      .then((res) => {
        setCard(res.data);
        setStatus("ok");
      })
      .catch((err) => setStatus(err.status === 404 ? "notfound" : "error"));
  }, [token]);

  const phone = card?.ownerPhone?.replace(/[^\d+]/g, "");

  return (
    <div className="sos-page">
      <header className="sos-header">
        <FaPaw aria-hidden="true" /> Huella · Ficha de emergencia
      </header>

      <main className="sos-main">
        {status === "loading" && <p className="muted">Cargando...</p>}
        {status === "notfound" && (
          <div className="card sos-card">
            <h1>Tarjeta no disponible</h1>
            <p className="muted">
              Esta tarjeta no existe o su dueño la ha desactivado.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="card sos-card">
            <h1>No se pudo cargar</h1>
            <p className="muted">Inténtalo de nuevo en unos minutos.</p>
          </div>
        )}

        {status === "ok" && (
          <div className="card sos-card">
            <div className="sos-pet">
              <div className="sos-photo">
                {card.photo ? (
                  <img src={card.photo} alt={card.name} />
                ) : (
                  <FaPaw aria-hidden="true" />
                )}
              </div>
              <h1>{card.name}</h1>
              <p className="muted">
                {[speciesLabel[card.species], card.breed]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <p className="sos-lead">
              Si has encontrado a {card.name}, por favor avisa a su familia.
              ¡Gracias!
            </p>

            {phone && (
              <a href={`tel:${phone}`} className="sos-call">
                <FiPhone aria-hidden="true" />
                <span>
                  Llamar a {card.ownerName || "su familia"}
                  <small>{card.ownerPhone}</small>
                </span>
              </a>
            )}

            <dl className="sos-info">
              {card.instructions && (
                <div>
                  <dt>Instrucciones</dt>
                  <dd>{card.instructions}</dd>
                </div>
              )}
              {card.vetContact && (
                <div>
                  <dt>Veterinario</dt>
                  <dd>{card.vetContact}</dd>
                </div>
              )}
              {card.allergies?.length > 0 && (
                <div>
                  <dt>Alergias</dt>
                  <dd>{card.allergies.join(", ")}</dd>
                </div>
              )}
              {card.medication?.length > 0 && (
                <div>
                  <dt>Medicación actual</dt>
                  <dd>
                    {card.medication
                      .map((m) => [m.drug, m.dose].filter(Boolean).join(" "))
                      .join(", ")}
                  </dd>
                </div>
              )}
              {card.conditions && (
                <div>
                  <dt>Condiciones médicas</dt>
                  <dd>{card.conditions}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmergencyCard;
