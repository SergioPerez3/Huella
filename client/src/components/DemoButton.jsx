import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import useAuth from "../hooks/useAuth.js";

const DemoButton = ({ className = "btn btn-demo" }) => {
  const { demo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    setLoading(true);
    try {
      await demo();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={loading}
      >
        <FiPlay aria-hidden="true" />
        {loading ? "Preparando la demo…" : "Probar demo"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default DemoButton;
