import axios from 'axios';
import {Customer} from "../types/Customer.ts";

const API_URL = 'http://localhost:8080/api';

export const customerApi = {
    getAllCustomers: async () => {
        const response = await axios.get<Customer[]>(`${API_URL}/User/getUser`);
        return response.data;
    },

    updateCustomerStatus: async (id: number, state: string) => {
        const response = await axios.put<Customer>(`${API_URL}/User/updateUser/${id}`, { state });
        return response.data;
    },

    saveCustomer: async (data: Partial<Customer>) => {
        const response = await axios.post<Customer>(`${API_URL}/User/saveUser`, data);
        return response.data;
    },

    uploadAvatar: async (userId: number, file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await axios.post(`${API_URL}/UserAvatar/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAvatarUrl: (userId: number) => `${API_URL}/UserAvatar/${userId}/avatar`,
};