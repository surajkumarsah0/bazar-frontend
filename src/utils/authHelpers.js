import { authAPI } from '../services/api';

export const fetchUserProfile = async () => {
  const response = await authAPI.getProfile();
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await authAPI.login({ email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const registerUser = async (name, email, password, role) => {
  const response = await authAPI.register({ name, email, password, role });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// pure helpers — no React component here
export const calculateTotalPrice = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);
};

export const calculateTotalItems = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};
