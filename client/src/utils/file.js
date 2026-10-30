const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const validateFile = (file) => {
  if (!allowed.includes(file.type))
    return "Solo se admiten JPG, PNG, WebP o PDF";
  if (file.size > 5 * 1024 * 1024) return "El archivo no puede superar 5 MB";
  return "";
};

export const formatSize = (bytes = 0) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(Math.round(bytes / 1024), 1)} KB`;
