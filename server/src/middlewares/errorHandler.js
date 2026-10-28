export const notFound = (req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large (max 5 MB)"
        : err.message;
    return res.status(400).json({ error: { message } });
  }
  if (err.code === "INVALID_FILE") {
    return res.status(400).json({ error: { message: err.message } });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ error: { message } });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: { message: "Invalid value" } });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: { message: "Duplicated value" } });
  }
  console.error(err);
  res.status(500).json({ error: { message: "Server error" } });
};
