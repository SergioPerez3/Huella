import { createContext, useState, useEffect } from "react";
import {
  getMe,
  loginUser,
  registerUser,
  startDemo,
  logoutUser,
  updateMe,
  deleteMe,
  uploadUserAvatar,
  deleteUserAvatar,
} from "../services/authService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.data);
  };

  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.data);
  };

  const demo = async () => {
    const res = await startDemo();
    setUser(res.data);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };
  const updateProfile = async (data) => {
    const res = await updateMe(data);
    setUser(res.data);
  };

  const removeAccount = async (password) => {
    await deleteMe(password);
    setUser(null);
  };
  const uploadAvatar = async (formData) => {
    const res = await uploadUserAvatar(formData);
    setUser(res.data);
  };

  const removeAvatar = async () => {
    const res = await deleteUserAvatar();
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demo,
        logout,
        updateProfile,
        removeAccount,
        uploadAvatar,
        removeAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
