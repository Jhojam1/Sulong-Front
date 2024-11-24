import React from 'react';
import { OrderStatus } from "../../types/Order.ts";

const statusColors: Record<OrderStatus, string> = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Entregado': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800'
};

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
        {status}
    </span>
);