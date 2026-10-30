import { FiFileText, FiImage, FiTrash2 } from "react-icons/fi";
import { formatSize } from "../utils/file.js";

const DocumentItem = ({ doc, onDelete }) => (
  <li className="doc-item">
    {doc.mimeType === "application/pdf" ? (
      <FiFileText aria-hidden="true" />
    ) : (
      <FiImage aria-hidden="true" />
    )}
    <a href={doc.url} target="_blank" rel="noopener noreferrer">
      {doc.name}
    </a>
    <span className="muted">{formatSize(doc.size)}</span>
    <button
      type="button"
      className="icon-btn"
      onClick={() => onDelete(doc)}
      aria-label={`Eliminar ${doc.name}`}
    >
      <FiTrash2 aria-hidden="true" />
    </button>
  </li>
);

export default DocumentItem;
