import { redirect } from "react-router-dom";
import { getMe } from "../services/authService.js";

export const redirectIfAuth = async () => {
  try {
    await getMe();
    return redirect("/dashboard");
  } catch {
    return null;
  }
};
