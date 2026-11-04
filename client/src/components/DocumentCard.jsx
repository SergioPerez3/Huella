import { useState } from "react";
import {
  FiFileText,
  FiImage,
  FiDownload,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { formatSize } from "../utils/file.js";
import { thumbnailUrl, downloadUrl } from "../utils/cloudinary.js";

const DocumentCard = ({ doc, petName, onDelete }) => {
  const [thumbFailed, setThumbFailed] = useState(false);
  const isPdf = doc.mimeType === "application/pdf";
  const Fallback = isPdf ? FiFileText : FiImage;

  return (
    <li className="doc-card">
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="doc-thumb"
        aria-label={`Ver ${doc.name}`}
      >
        {thumbFailed ? (
          <Fallback aria-hidden="true" size={36} />
        ) : (
          <img
            src={thumbnailUrl(doc)}
            alt=""
            loading="lazy"
            onError={() => setThumbFailed(true)}
          />
        )}
        {isPdf && <span className="doc-badge">PDF</span>}
      </a>
      <div className="doc-info">
        <strong title={doc.name}>{doc.name}</strong>
        {petName && <span className="pet-tag">{petName}</span>}
        <span className="muted">{formatSize(doc.size)}</span>
      </div>
      <div className="doc-actions">
        <a
          className="icon-btn"
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver en grande"
          title="Ver en grande"
        >
          <FiExternalLink aria-hidden="true" />
        </a>
        <a
          className="icon-btn"
          href={downloadUrl(doc)}
          aria-label="Descargar"
          title="Descargar"
        >
          <FiDownload aria-hidden="true" />
        </a>
        <button
          type="button"
          className="icon-btn danger"
          onClick={() => onDelete(doc)}
          aria-label="Eliminar"
          title="Eliminar"
        >
          <FiTrash2 aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default DocumentCard;
