import axios from 'axios';
import { Company, Headquarter } from '../types/Setting';

const API_URL = 'http://localhost:8080/api';

// Configura Axios con un interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Obtén el token almacenado
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class SettingsService {
    // Company endpoints
    async getCompanies(): Promise<Company[]> {
        try {
            const response = await axios.get(`${API_URL}/Company/getCompany`);
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async createCompany(companyData: Partial<Company>): Promise<Company> {
        try {
            const response = await axios.post(
                `${API_URL}/Company/saveCompany`,
                companyData
            );
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async updateCompany(id: number, companyData: Partial<Company>): Promise<Company> {
        try {
            const response = await axios.put(
                `${API_URL}/Company/updateCompany/${id}`,
                companyData
            );
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    // Headquarter endpoints
    async getHeadquarters(): Promise<Headquarter[]> {
        try {
            const response = await axios.get(`${API_URL}/Headquarter/getHeadquarter`);
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async createHeadquarter(headquarterData: Partial<Headquarter>): Promise<Headquarter> {
        try {
            const response = await axios.post(
                `${API_URL}/Headquarter/saveHeadquarter`,
                headquarterData
            );
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async updateHeadquarter(id: number, headquarterData: Partial<Headquarter>): Promise<Headquarter> {
        try {
            const response = await axios.put(
                `${API_URL}/Headquarter/updateHeadquarter/${id}`,
                headquarterData
            );
            return response.data;
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    // Configuration endpoints
    async updateCutoffTime(newTime: string): Promise<void> {
        try {
            await axios.put(`${API_URL}/ConfigHr/actConfigHr`, null, {
                params: { newTime }
            });
        } catch (error: any) {
            this.handleAuthError(error);
            throw error;
        }
    }

    // Manejo de errores de autenticación
    private handleAuthError(error: any) {
        if (error.response?.status === 403) {
            console.error('Authentication error: Please log in again');
            // Aquí puedes implementar lógica adicional, como redirigir al usuario a la página de login
        }
    }
}

export const settingsService = new SettingsService();
