import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import {DashboardStats} from "../types/Dashboard.ts";
import {SalesChart} from "../components/Dashboard/SalesChart.tsx";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  const statCards = [
    {
      title: 'Ventas Totales',
      value: stats ? stats.totalSales.toString() : '0',
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pedidos Hoy',
      value: stats ? stats.ordersToday.toString() : '0',
      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Ventas de Hoy',
      value: stats ? `$${stats.totalSalesToday.toFixed(2)}` : '$0',
      icon: <DollarSign className="h-6 w-6 text-orange-600" />,
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Clientes del Sistema',
      value: stats ? stats.newCustomers.toString() : '0',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-100'
    }
  ];

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Pedidos por Mes
            </h2>
            <SalesChart monthlySalesCount={stats?.monthlySalesCount || {}} />
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Productos Más Vendidos
            </h2>
            <div className="space-y-4">
              {stats?.topSellingDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {dish.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {dish.quantity} unidades
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${dish.totalSales.toFixed(2)}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}