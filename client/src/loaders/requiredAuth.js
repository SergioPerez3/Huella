import { redirect } from 'react-router-dom';
import { getMe } from '../services/authService.js';

export const requiredAuth = async () => {
  try {
    await getMe();
    return null;
  } catch {
    return redirect('/login');
  }
};