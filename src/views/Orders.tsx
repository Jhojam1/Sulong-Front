import React, { useState } from 'react';
import { ClipboardList, Search, Filter, Eye, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  date: Date;
  location: string;
  observations?: string;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Juan Pérez',
    items: [
      { name: 'Hamburguesa Clásica', quantity: 2, price: 12.99 },
      { name: 'Papas Fritas', quantity: 1, price: 4.99 }
    ],
    total: 30.97,
    status: 'pending',
    date: new Date('2024-03-10T14:30:00'),
    location: 'Sede Central',
    observations: 'Sin cebolla en las hamburguesas'
  },
  {
    id: 'ORD002',
    customerName: 'María García',
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 14.99 },
      { name: 'Ensalada César', quantity: 1, price: 8.99 }
    ],
    total: 23.98,
    status: 'preparing',
    date: new Date('2024-03-10T14:15:00'),
    location: 'Sede Norte'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function Orders() {
  const { userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('');

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Implementar cambio de estado
    console.log(`Cambiando estado del pedido ${orderId} a ${newStatus}`);
    setSelectedOrder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
          Pedidos
        </h1>
        {userRole === 'admin' && (
          <div className="flex space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Input
                placeholder="Buscar pedidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="preparing">En preparación</option>
              <option value="ready">Listos</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {SAMPLE_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle del pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Detalle del Pedido #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Cliente</p>
                <p className="text-base">{selectedOrder.customerName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Sede</p>
                <p className="text-base">{selectedOrder.location}</p>
              </div>

              {selectedOrder.observations && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Observaciones</p>
                  <p className="text-base">{selectedOrder.observations}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cambiar Estado
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    <option value="">Seleccionar nuevo estado</option>
                    <option value="pending">Pendiente</option>
                    <option value="preparing">En preparación</option>
                    <option value="ready">Listo</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cerrar
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, orderStatus)}
                      disabled={!orderStatus}
                    >
                      Actualizar Estado
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}