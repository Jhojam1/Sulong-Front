import React from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUp,
  ArrowDown,
  BarChart2
} from 'lucide-react';

const stats = [
  {
    title: 'Ventas Totales',
    value: '$12,345',
    change: '+12.5%',
    trend: 'up'
  },
  {
    title: 'Pedidos Hoy',
    value: '45',
    change: '+8.1%',
    trend: 'up'
  },
  {
    title: 'Clientes Nuevos',
    value: '12',
    change: '-2.4%',
    trend: 'down'
  },
  {
    title: 'Ticket Promedio',
    value: '$27.50',
    change: '+4.3%',
    trend: 'up'
  }
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${
                stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-gray-500">vs. último mes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Ventas por Hora
          </h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <BarChart2 className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Productos Más Vendidos
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Producto {item}
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 100)} unidades
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${(Math.random() * 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}