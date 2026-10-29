import rateLimit from "express-rate-limit";

const skip = () => process.env.NODE_ENV === "test";

const build = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    skip,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { message: "Too many requests, try again later" } },
  });

export const authLimiter = build(15 * 60 * 1000, 20);
export const publicLimiter = build(60 * 1000, 60);
