export const notFound = (req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ error: { message } });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: { message: "Duplicated value" } });
  }
  console.error(err);
  res.status(500).json({ error: { message: "Server error" } });
};
