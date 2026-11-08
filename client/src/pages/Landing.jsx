import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import {
  FiHeart,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiCheck,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
  FiGithub,
  FiUserPlus,
} from "react-icons/fi";
import Logo from "../components/Logo.jsx";
import ServiceArt from "../components/ServiceArt.jsx";

const Photo = ({ src, alt = "", className = "" }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`photo ${className}`}>
      {failed ? (
        <FaPaw aria-hidden="true" />
      ) : (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
    </div>
  );
};

const features = [
  {
    Icon: FiHeart,
    title: "Salud al día",
    text: "Vacunas, tratamientos, informes y radiografías en un solo sitio.",
  },
  {
    Icon: FiCalendar,
    title: "Calendario y tareas",
    text: "Paseos, medicación y citas, con repeticiones automáticas.",
  },
  {
    Icon: FiDollarSign,
    title: "Gastos claros",
    text: "Resumen mensual por categoría y por mascota.",
  },
  {
    Icon: FiShield,
    title: "QR de emergencia",
    text: "Para el collar: quien la encuentre te llama al momento.",
  },
];

const steps = [
  { title: "Crea tu cuenta", text: "Gratis y en menos de un minuto." },
  { title: "Añade a tu mascota", text: "Foto, datos básicos y alergias." },
  {
    title: "Organiza su día a día",
    text: "Tareas, salud y gastos, siempre a mano.",
  },
];

const Landing = () => (
  <div className="landing">
    <header className="l-nav">
      <Logo />
      <nav className="l-links" aria-label="Secciones">
        <a href="#funciones">Funciones</a>
        <a href="#servicios">Servicios</a>
        <a href="#emergencia">Tarjeta de emergencia</a>
        <a href="#como-funciona">Cómo funciona</a>
      </nav>
      <div className="l-nav-actions">
        <Link to="/login" className="btn btn-ghost">
          Entrar
        </Link>
        <Link to="/register" className="btn btn-primary">
          Crear cuenta
        </Link>
      </div>
    </header>

    <main>
      <section className="l-section l-hero">
        <div>
          <span className="l-eyebrow">
            <FaPaw aria-hidden="true" /> La app para cuidar de tu mascota
          </span>
          <h1>Todo lo que necesita tu mascota, en un solo lugar</h1>
          <p className="l-lead">
            Salud, tareas, gastos y una tarjeta con QR para que vuelva a casa si
            alguna vez se pierde.
          </p>
          <div className="l-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Crear cuenta gratis <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
          <ul className="l-checks">
            <li>
              <FiCheck aria-hidden="true" /> Salud al día
            </li>
            <li>
              <FiCheck aria-hidden="true" /> Calendario y tareas
            </li>
            <li>
              <FiCheck aria-hidden="true" /> Gastos claros
            </li>
            <li>
              <FiCheck aria-hidden="true" /> QR para el collar
            </li>
          </ul>
        </div>

        <div className="collage" aria-hidden="true">
          <div className="collage-blob" />
          <Photo src="/landing/hero-dog.jpg" className="photo-main" />
          <Photo src="/landing/hero-cat.jpg" className="photo-second" />
          <div className="float-card fc-visit">
            <span className="fc-icon">
              <FiCalendar />
            </span>
            <div>
              <strong>Próxima cita</strong>
              <span className="muted">06 ene · Revisión anual</span>
            </div>
          </div>
          <div className="float-card fc-ok">
            <FiHeart /> Saludable
          </div>
          <div className="float-card fc-qr">
            <span className="mini-qr" />
            <div>
              <strong>Tarjeta de emergencia</strong>
              <span className="muted">Escanea y avisa</span>
            </div>
          </div>
        </div>
      </section>

      <section className="l-section" id="servicios">
        <div className="l-head">
          <h2>Encuentra servicios cerca de ti</h2>
          <p className="muted">
            Veterinarios, peluquerías, residencias y más, ordenados por
            distancia en cualquier ciudad.
          </p>
        </div>
        <div className="l-services">
          {[
            ["veterinarios", "Veterinarios", "Clínicas y urgencias"],
            ["peluquerias", "Peluquerías", "Baño, corte y cuidado"],
            ["residencias", "Residencias", "Para cuando viajas"],
            ["paseadores", "Paseadores", "Y cuidadores de confianza"],
          ].map(([key, title, text]) => (
            <article key={key} className="l-service">
              <ServiceArt category={key} />
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="l-section" id="funciones">
        <div className="l-head">
          <h2>Todo bajo control, sin esfuerzo</h2>
          <p className="muted">
            Una sola app para lo importante de su día a día.
          </p>
        </div>
        <div className="l-features">
          {features.map(({ Icon, title, text }) => (
            <article key={title} className="card l-feature">
              <span className="l-icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="l-section" id="emergencia">
        <div className="l-split">
          <div>
            <span className="l-eyebrow">
              <FiShield aria-hidden="true" /> Tarjeta de emergencia
            </span>
            <h2>Si se pierde, que vuelva a casa</h2>
            <p className="l-lead">
              Cada mascota tiene su ficha pública con un código QR que puedes
              llevar en el collar.
            </p>
            <ul className="l-list">
              <li>
                <FiCheckCircle aria-hidden="true" />{" "}
                <span>Imprime el QR y ponlo en su collar.</span>
              </li>
              <li>
                <FiCheckCircle aria-hidden="true" />{" "}
                <span>
                  Tú eliges qué datos se ven: teléfono, alergias, medicación…
                </span>
              </li>
              <li>
                <FiCheckCircle aria-hidden="true" />{" "}
                <span>
                  Quien la encuentre te llama con un solo toque, sin necesidad
                  de cuenta.
                </span>
              </li>
            </ul>
          </div>

          <div className="phone" aria-hidden="true">
            <div className="phone-bar">Huella · Ficha de emergencia</div>
            <div className="phone-body">
              <Photo src="/landing/hero-cat.jpg" className="phone-photo" />
              <strong>Mof</strong>
              <span className="muted">Gato · Siamés</span>
              <span className="phone-call">
                <FiPhone /> Llamar a Sergio
              </span>
              <div className="phone-row">
                <b>Instrucciones</b>Es tímido, ofrécele agua y llámame.
              </div>
              <div className="phone-row">
                <b>Alergias</b>Pollo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="l-band">
        <h2>Porque ellos también forman parte de tu vida</h2>
      </section>

      <section className="l-section" id="como-funciona">
        <div className="l-head">
          <h2>Empieza en tres pasos</h2>
        </div>
        <div className="l-steps">
          {steps.map(({ title, text }, index) => (
            <article key={title} className="card l-step">
              <span className="l-step-num">{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="l-section">
        <div className="l-final">
          <h2>Dale a tu mascota el cuidado que se merece</h2>
          <p>Empieza hoy, es gratis.</p>
          <Link to="/register" className="btn btn-light btn-lg">
            <FiUserPlus aria-hidden="true" /> Crear cuenta gratis
          </Link>
        </div>
      </section>
    </main>

    <footer className="l-footer">
      <div className="l-footer-inner">
        <Logo />
        <nav aria-label="Enlaces">
          <Link to="/login">Entrar</Link>
          <Link to="/register">Crear cuenta</Link>
          <a
            href="https://github.com/SergioPerez3/Huella"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiGithub aria-hidden="true" /> Código en GitHub
          </a>
        </nav>
        <small>© 2026 Huella · Hecho con cariño por Sergio Pérez</small>
      </div>
    </footer>
  </div>
);

export default Landing;
