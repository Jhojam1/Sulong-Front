import axios from 'axios';
import { TempUser, UserRegistration } from '../types/user';

const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const userService = {
    getTempUsers: async (): Promise<TempUser[]> => {
        try {
            const response = await axiosInstance.get('/TempUser/getTempUser');
            return response.data;
        } catch (error) {
            console.error('Error fetching temp users:', error);
            throw error;
        }
    },

    registerUser: async (userData: UserRegistration) => {
        try {
            const response = await axiosInstance.post('/auth/registerUser', {
                id: userData.id,
                fullName: userData.fullName,
                numberIdentification: userData.numberIdentification,
                mail: userData.mail,
                password: userData.password,
                numberPhone: userData.numberPhone,
                role: userData.role,
                state: userData.state,
                company: userData.company
            });

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data || 'Error al registrar el usuario';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    deleteTempUser: async (id: number) => {
        try {
            await axiosInstance.delete(`/TempUser/deleteTempUser/${id}`);
        } catch (error) {
            console.error('Error deleting temp user:', error);
            throw error;
        }
    }
};