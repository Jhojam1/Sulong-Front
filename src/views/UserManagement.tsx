import { Users, Search, Edit2, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {useState} from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  lastOrder: Date;
  avatar: string;
  status: 'Activo' | 'Inactivo';
}

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'C001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+34 612 345 678',
    address: 'Calle Mayor 123, Madrid',
    orders: 15,
    totalSpent: 458.75,
    lastOrder: new Date('2024-03-09'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Activo',
  },
  {
    id: 'C002',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+34 623 456 789',
    address: 'Avenida Libertad 45, Barcelona',
    orders: 8,
    totalSpent: 234.5,
    lastOrder: new Date('2024-03-08'),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Inactivo',
  },
  {
    id: 'C003',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    phone: '+34 634 567 890',
    address: 'Plaza España 7, Valencia',
    orders: 23,
    totalSpent: 687.25,
    lastOrder: new Date('2024-03-10'),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Activo',
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);

  // Filtrar clientes por búsqueda
  const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
            customer.id === id
                ? {
                  ...customer,
                  status: customer.status === 'Activo' ? 'Inactivo' : 'Activo',
                }
                : customer
        )
    );
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Clientes
          </h1>
          <div className="flex space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Input
                  placeholder="Buscar clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button>
              <Users className="h-5 w-5 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
              <div
                  key={customer.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                        className="h-12 w-12 rounded-full"
                        src={customer.avatar}
                        alt={customer.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">Cliente #{customer.id}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {customer.address}
                    </div>
                  </div>

                  {/* Muestra el total de pedidos y total gastado en paralelo */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold">Total de Pedidos:</span>
                      <span className="ml-2">{customer.orders}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold">Total Gastado:</span>
                      <span className="ml-2">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="secondary" size="sm">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center"
                        onClick={() => toggleStatus(customer.id)}
                    >
                  <span
                      className={`h-3 w-3 rounded-full ${customer.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'} mr-2`}
                  ></span>
                      {customer.status}
                    </Button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}
