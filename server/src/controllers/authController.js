import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import pick from "../utils/pick.js";
import { deleteAccountData } from "../services/accountService.js";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  timezone: u.timezone,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: { message: "Name, email and password are required" } });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: { message: "Password must have at least 6 characters" },
      });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res
        .status(409)
        .json({ error: { message: "Email already registered" } });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    res.cookie("token", signToken(user._id), cookieOptions);
    res.status(201).json({ data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: { message: "Email and password are required" } });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }
    res.cookie("token", signToken(user._id), cookieOptions);
    res.status(200).json({ data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ data: { message: "Logged out" } });
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(401).json({ error: { message: "Not authenticated" } });
    res.status(200).json({ data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

const isValidTimezone = (timezone) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const data = pick(req.body, ["name", "timezone"]);
    if (data.timezone !== undefined && !isValidTimezone(data.timezone)) {
      return res.status(400).json({ error: { message: "Invalid timezone" } });
    }
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(401).json({ error: { message: "Not authenticated" } });
    Object.assign(user, data);
    await user.save();
    res.status(200).json({ data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ error: { message: "Password is required" } });

    const user = await User.findById(req.user.id).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }
    await deleteAccountData(user._id);
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ data: { message: "Account deleted" } });
  } catch (error) {
    next(error);
  }
};
