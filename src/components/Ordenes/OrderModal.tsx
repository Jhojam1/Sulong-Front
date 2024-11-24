import React from 'react';
import { X } from 'lucide-react';
import { Order, OrderStatus } from "../../types/Order.ts";
import Button from "../ui/Button";

interface OrderModalProps {
    order: Order;
    onClose: () => void;
    onStatusChange: (orderId: number, status: OrderStatus) => void;
    isAdmin: boolean;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Entregado', label: 'Entregado' },
    { value: 'Cancelado', label: 'Cancelado' }
];

export const OrderModal: React.FC<OrderModalProps> = ({
                                                          order,
                                                          onClose,
                                                          onStatusChange,
                                                          isAdmin
                                                      }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus>(order.state as OrderStatus);

    const handleStatusChange = () => {
        if (selectedStatus !== order.state) {
            onStatusChange(order.id, selectedStatus);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Pedido #{order.id}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                            <p className="mt-1 text-lg font-medium">{order.user.fullName}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Sede</h3>
                            <p className="mt-1 text-lg font-medium">{order.headquarter.name}</p>
                        </div>
                    </div>

                    {order.observation && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Observaciones</h3>
                            <p className="mt-1 text-lg">{order.observation}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium mb-4">Detalles del Plato</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-medium">{order.dish.name}</span>
                                <span className="text-lg font-bold">${order.dish.price}</span>
                            </div>
                            <p className="text-gray-600">{order.dish.description}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Total</span>
                            <span className="text-xl font-bold">${order.dish.price}</span>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium mb-4">Estado del Pedido</h3>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="px-6"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleStatusChange}
                                    disabled={selectedStatus === order.state}
                                    className="px-6"
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    )}

                    {!isAdmin && (
                        <div className="border-t border-gray-200 pt-6 flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={onClose}
                                className="px-6"
                            >
                                Cerrar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};