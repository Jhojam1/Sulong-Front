import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import {useAuth} from "../contexts/AuthContext.tsx";
import {Order, OrderStatus} from "../types/Order.ts";
import {orderService} from "../services/Order.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import {OrderModal} from "../components/Ordenes/OrderModal.tsx";
import {OrderStatusBadge} from "../components/Ordenes/OrderStatus.tsx";


export default function Orders() {
  const { userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState(() => {
    const colombiaDate = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const today = new Date(colombiaDate);
    today.setHours(0, 0, 0, 0);
    return today;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      setError('Error al actualizar el estado del pedido');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    newDate.setHours(0, 0, 0, 0);
    setDateFilter(newDate);
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.fechaPedido);
    const colombiaOrderDate = new Date(orderDate.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    colombiaOrderDate.setHours(0, 0, 0, 0);

    const matchesSearch = order.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.state === statusFilter;
    const matchesDate = colombiaOrderDate.getTime() === dateFilter.getTime();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Pedidos
          </h1>
          {userRole === 'admin' && (
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Input
                      placeholder="Buscar pedidos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative flex-grow sm:flex-grow-0">
                  <div className="relative">
                    <input
                        type="date"
                        value={dateFilter.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10 text-gray-700"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
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
                  Plato
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
              {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.dish.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.dish.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.state as OrderStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.fechaPedido).toLocaleDateString('es-ES', {
                        timeZone: 'America/Bogota',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                      >
                        Ver detalles
                      </Button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
            <OrderModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
                isAdmin={userRole === 'admin'}
            />
        )}
      </div>
  );
}