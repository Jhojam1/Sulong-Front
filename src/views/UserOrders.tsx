import React from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
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
    items: [
      { name: 'Hamburguesa Clásica', quantity: 2, price: 12.99 },
      { name: 'Papas Fritas', quantity: 1, price: 4.99 }
    ],
    total: 30.97,
    status: 'delivered',
    date: new Date('2024-03-10T14:30:00'),
    location: 'Sede Central',
    observations: 'Sin cebolla en las hamburguesas'
  },
  {
    id: 'ORD002',
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

const statusIcons = {
  pending: Clock,
  preparing: Package,
  ready: CheckCircle,
  delivered: CheckCircle,
  cancelled: XCircle
};

export default function UserOrders() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Mis Pedidos
      </h1>

      <div className="space-y-6">
        {SAMPLE_ORDERS.map((order) => {
          const StatusIcon = statusIcons[order.status];
          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.date.toLocaleDateString()} {order.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusColors[order.status]}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sede:</span> {order.location}
                    </p>
                    {order.observations && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Observaciones:</span> {order.observations}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}