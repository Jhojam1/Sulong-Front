import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  fullName: string;
  numberIdentification: number;
  state: string;
  mail: string;
  role: string;
}

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/User/getUser`);
  return response.data;
};

const createUser = async (userData: Omit<User, 'id'>) => {
  const response = await axios.post(`${API_URL}/User/saveUser`, userData);
  return response.data;
};

const updateUser = async (id: number, userData: Partial<User>) => {
  const response = await axios.put(`${API_URL}/User/updateUser/${id}`, userData);
  return response.data;
};

const uploadAvatar = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await axios.post(`${API_URL}/user-avatar/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getAvatarUrl = (id: number) => `${API_URL}/user-avatar/${id}/avatar`;

export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  uploadAvatar,
  getAvatarUrl,
};