import axios from 'axios';
import { UserTemp } from '../types/UserRegister';


const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userApi = {
  registerUser: async (userData: Partial<UserTemp>): Promise<UserTemp> => {
    try {
      const response = await axiosInstance.post('/TempUser/saveTempUser', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error al registrar el usuario';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
};