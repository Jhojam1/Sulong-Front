import React, { useEffect, useState } from 'react';
import { Order } from '../types/Order';
import {useAuth} from "../contexts/AuthContext.tsx";
import {orderService} from "../services/Order.ts";

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) {
          throw new Error('Usuario no encontrado');
        }
        const userOrders = await orderService.getUserOrders(user.id);
        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Mis Pedidos
        </h1>

        {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No tienes pedidos realizados</p>
            </div>
        ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
              ))}
            </div>
        )}
      </div>
  );
}