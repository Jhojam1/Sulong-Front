import { Users, Search } from 'lucide-react';
import { Customer } from "../types/Customer.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { customerApi } from "../services/Customer.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import CustomerCard from "../components/Clientes/CustomerCard.tsx";
import CustomerModal from "../components/Clientes/CustomerModal.tsx";
import { useEffect, useState } from "react";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleNewCustomer = async (data: Partial<Customer>, avatarFile?: File) => {
    try {
      const newCustomer = await customerApi.saveCustomer(data);
      if (avatarFile && newCustomer.id) {
        await customerApi.uploadAvatar(newCustomer.id, avatarFile);
      }
      setCustomers([...customers, newCustomer]);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleUpdateCustomer = async (data: Partial<Customer>, avatarFile?: File) => {
    try {
      if (selectedCustomer) {
        const updatedCustomer = await customerApi.saveCustomer({ ...data, id: selectedCustomer.id });
        if (avatarFile) {
          await customerApi.uploadAvatar(selectedCustomer.id, avatarFile);
        }
        setCustomers(customers.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.numberIdentification.toString().includes(searchQuery) ||
      customer.mail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchQuery))
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
            <Button onClick={() => setIsNewModalOpen(true)}>
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
                  onEdit={() => handleEdit(customer)}
              />
          ))}
        </div>

        <CustomerModal
            isOpen={isNewModalOpen}
            onClose={() => setIsNewModalOpen(false)}
            onSubmit={handleNewCustomer}
            title="Nuevo Cliente"
        />

        <CustomerModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCustomer(null);
            }}
            onSubmit={handleUpdateCustomer}
            customer={selectedCustomer || undefined}
            title="Editar Cliente"
        />
      </div>
  );
}