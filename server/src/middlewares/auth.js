import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ error: { message: "Not authenticated" } });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired session" } });
  }
};

export default auth;
