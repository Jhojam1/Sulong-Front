import axios from 'axios';
import { Customer } from "../types/Customer.ts";

const API_URL = 'http://localhost:8080/api';

// Crear una instancia de axios con configuración base
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token a todas las peticiones
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const customerApi = {
    getAllCustomers: async () => {
        const response = await axiosInstance.get<Customer[]>('/User/getUser');
        return response.data;
    },

    updateCustomerStatus: async (id: number, state: string) => {
        const response = await axiosInstance.put<Customer>(`/User/updateUser/${id}`, { state });
        return response.data;
    },

    saveCustomer: async (data: Partial<Customer>) => {
        const response = await axiosInstance.post<Customer>('/User/saveUser', data);
        return response.data;
    },

    uploadAvatar: async (userId: number, file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axiosInstance.post(`/UserAvatar/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    },

    getAvatar: async (userId: number) => {
        try {
            const response = await axiosInstance.get(`/UserAvatar/${userId}/avatar`, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            throw error;
        }
    }
};