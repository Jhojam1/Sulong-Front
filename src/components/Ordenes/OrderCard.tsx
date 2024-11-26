import React from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Order } from '../types/Order';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Pedido #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(order.fechaPedido).toLocaleDateString()} {new Date(order.fechaPedido).toLocaleTimeString()}
                        </p>
                    </div>
                    <OrderStatusBadge status={order.state} />
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
              <span>
                1x {order.dish.name}
              </span>
                            <span className="font-medium">
                ${order.dish.price}
              </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total</span>
                            <span className="text-lg font-bold">
                ${order.dish.price}
              </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Sede:</span> {order.headquarter.name}
                        </p>
                        {order.observation && (
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Observaciones:</span> {order.observation}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}