import { FaPaw } from "react-icons/fa";

const Logo = ({ className = "" }) => (
  <div className={`logo ${className}`}>
    <FaPaw aria-hidden="true" />
    <span>Huella</span>
  </div>
);

export default Logo;
