import axios from 'axios';
import { Order, OrderStatus } from "../types/Order.ts";

const API_URL = 'http://localhost:8080/api';

class OrderService {
    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await axios.get(`${API_URL}/Order/getOrder`);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        try {
            const response = await axios.get(`${API_URL}/Order/findOrder/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    }

    async createOrder(orderData: Partial<Order>): Promise<Order> {
        try {
            const response = await axios.post(`${API_URL}/Order/saveOrder`, orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId: number, state: OrderStatus): Promise<Order> {
        try {
            // Convertir el estado a formato correcto (primera letra mayúscula)
            const formattedState = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();

            // Usar PATCH y enviar el estado como query parameter
            const response = await axios.patch(
                `${API_URL}/Order/updateOrderState/${orderId}/state?state=${formattedState}`
            );
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();