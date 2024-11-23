import React from 'react';
import { X } from 'lucide-react';
import {Order, OrderStatus} from "../../types/Order.ts";
import Button from "../ui/Button.tsx";


interface OrderModalProps {
    order: Order;
    onClose: () => void;
    onStatusChange: (orderId: number, status: OrderStatus) => void;
    isAdmin: boolean;
}

export const OrderModal: React.FC<OrderModalProps> = ({
                                                          order,
                                                          onClose,
                                                          onStatusChange,
                                                          isAdmin
                                                      }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | ''>('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Detalle del Pedido #{order.id}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Cliente</p>
                        <p className="text-base">{order.user.fullName}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Sede</p>
                        <p className="text-base">{order.headquarter.name}</p>
                    </div>

                    {order.observation && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Observaciones</p>
                            <p className="text-base">{order.observation}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Plato</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>{order.dish.name}</span>
                                <span>${order.dish.price}</span>
                            </div>
                            <p className="text-sm text-gray-600">{order.dish.description}</p>
                        </div>
                    </div>

                    {isAdmin && order.state === 'PENDIENTE' && (
                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cambiar Estado
                            </label>
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                            >
                                <option value="">Seleccionar nuevo estado</option>
                                <option value="ENTREGADO">Entregado</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>

                            <div className="mt-4 flex justify-end space-x-2">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedStatus) {
                                            onStatusChange(order.id, selectedStatus);
                                        }
                                    }}
                                    disabled={!selectedStatus}
                                >
                                    Actualizar Estado
                                </Button>
                            </div>
                        </div>
                    )}

                    {(!isAdmin || order.state !== 'PENDIENTE') && (
                        <div className="border-t pt-4 flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={onClose}
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