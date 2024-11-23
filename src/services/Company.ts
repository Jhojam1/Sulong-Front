import axios from 'axios';
import { Company } from '../types/Customer';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            // Handle token expiration
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export const companyApi = {
    getAllCompanies: async (): Promise<Company[]> => {
        try {
            const response = await axiosInstance.get('/Company/getCompany');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Error al obtener las empresas';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    saveCompany: async (company: Partial<Company>): Promise<Company> => {
        try {
            const response = await axiosInstance.post('/Company/saveCompany', company);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Error al guardar la empresa';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    updateCompany: async (id: number, company: Partial<Company>): Promise<Company> => {
        try {
            const response = await axiosInstance.put(`/Company/updateCompany/${id}`, company);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Error al actualizar la empresa';
                throw new Error(errorMessage);
            }
            throw error;
        }
    }
};