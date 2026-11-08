import {
  FiMapPin,
  FiClock,
  FiNavigation,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";
import ServiceArt from "./ServiceArt.jsx";

const formatDistance = (km) =>
  km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toFixed(1).replace(".", ",")} km`;

const mapsUrl = (place) =>
  `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

const ServiceCard = ({ place }) => {
  const tel = place.phone ? place.phone.replace(/[^\d+]/g, "") : "";

  return (
    <article className="svc-card">
      <div className="svc-art-wrap">
        <ServiceArt category={place.category} />
        <span className="svc-dist">{formatDistance(place.distanceKm)}</span>
        {place.demo && <span className="svc-demo">Ejemplo</span>}
      </div>

      <div className="svc-body">
        <h3>{place.name}</h3>
        <span className="chip">{place.label}</span>

        <ul className="svc-meta">
          {place.address && (
            <li>
              <FiMapPin aria-hidden="true" /> <span>{place.address}</span>
            </li>
          )}
          {place.hours && (
            <li>
              <FiClock aria-hidden="true" /> <span>{place.hours}</span>
            </li>
          )}
        </ul>

        <div className="svc-actions">
          <a
            className="btn btn-primary btn-sm"
            href={mapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiNavigation aria-hidden="true" /> Cómo llegar
          </a>
          {tel ? (
            <a className="btn btn-ghost btn-sm" href={`tel:${tel}`}>
              <FiPhone aria-hidden="true" /> Llamar
            </a>
          ) : place.website ? (
            <a
              className="btn btn-ghost btn-sm"
              href={place.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <FiGlobe aria-hidden="true" /> Web
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
