import { Users, Search } from 'lucide-react';
import {Customer} from "../types/Customer.ts";
import {useAuth} from "../contexts/AuthContext.tsx";
import {customerApi} from "../services/Customer.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import CustomerCard from "../components/Clientes/CustomerCard.tsx";
import {useEffect, useState} from "react";


export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  const loadCustomers = async () => {
    try {
      const data = await customerApi.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: number, currentState: string) => {
    try {
      const newState = currentState === 'Activo' ? 'Inactivo' : 'Activo';
      await customerApi.updateCustomerStatus(id, newState);
      setCustomers(customers.map(customer =>
          customer.id === id ? { ...customer, state: newState } : customer
      ));
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

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
              <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onStatusToggle={handleStatusToggle}
              />
          ))}
        </div>
      </div>
  );
}