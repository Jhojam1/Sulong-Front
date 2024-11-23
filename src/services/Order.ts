import axios from 'axios';
import {Order} from "../types/Order.ts";

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

    async createOrder(orderData: Partial<Order>): Promise<Order> {
        try {
            const response = await axios.post(`${API_URL}/Order/saveOrder`, orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId: number, state: string): Promise<Order> {
        try {
            const response = await axios.put(`${API_URL}/orders/${orderId}`, { state });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();