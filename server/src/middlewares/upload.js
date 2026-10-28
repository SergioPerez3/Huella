import multer from "multer";
import { matchesSignature } from "../utils/fileType.js";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

const invalidFile = () => {
  const error = new Error("Invalid file type");
  error.code = "INVALID_FILE";
  return error;
};

const build = (allowed, field) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) =>
      allowed.includes(file.mimetype) ? cb(null, true) : cb(invalidFile()),
  }).single(field);

  return (req, res, next) =>
    upload(req, res, (error) => {
      if (error) return next(error);
      if (!req.file)
        return res.status(400).json({ error: { message: "File is required" } });
      if (!matchesSignature(req.file)) return next(invalidFile());
      next();
    });
};

export const uploadImage = build(IMAGE_TYPES, "photo");
export const uploadDocument = build(DOCUMENT_TYPES, "file");
