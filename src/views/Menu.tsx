import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, ShoppingCart, Edit2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EditDishModal from '../components/EditDishModal';
import OrderModal from '../components/OrderModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  state: string;
  amount: number;
  maxDailyAmount: number;
  ordersToday: number;
  lastUpdatedDate: string;
  image: string;
}

const API_URL = 'http://localhost:8080/api';

const LOCATIONS = [
  { id: '1', name: 'Sede Concepcion' },
  { id: '2', name: 'Sede Zaragocilla' },
  { id: '3', name: 'Sede Pie de la popa' },
];

export default function Menu() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderLocation, setOrderLocation] = useState('');
  const [orderObservations, setOrderObservations] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editFormData, setEditFormData] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Dish/getDish`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDishes(response.data);
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  };

  const handleOrder = (item: MenuItem) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditFormData(item);
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/Dish/uptDish/${editFormData.id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowEditModal(false);
      setEditFormData(null);
      loadDishes();
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const handleSubmitOrder = () => {
    setShowOrderModal(false);
    setSelectedItem(null);
    setOrderLocation('');
    setOrderObservations('');
  };

  const filteredDishes = dishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAvailable = (dish: MenuItem) => {
    return dish.ordersToday < dish.maxDailyAmount &&
        dish.state.toLowerCase() === 'disponible';
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Menú del Día
          </h1>
          <div className="flex space-x-4 w-full sm:w-auto">
            {userRole === 'admin' && (
                <>
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Input
                        placeholder="Buscar en el menú..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <Button onClick={() => navigate('/menu/new')}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nuevo Plato
                  </Button>
                </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((item) => (
              <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300';
                    }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">${item.price}</span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                <span
                    className={`px-2 py-1 text-xs rounded-full ${
                        isAvailable(item) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {isAvailable(item) ? 'Disponible' : 'No Disponible'}
                </span>
                    {userRole === 'admin' ? (
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                    ) : (
                        isAvailable(item) && (
                            <Button onClick={() => handleOrder(item)}>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Ordenar
                            </Button>
                        )
                    )}
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Modal de Edición */}
        {showEditModal && editFormData && (
            <EditDishModal
                editFormData={editFormData}
                onClose={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                }}
                onSubmit={handleSubmitEdit}
                onChange={setEditFormData}
            />
        )}

        {/* Modal de Pedido */}
        {showOrderModal && selectedItem && (
            <OrderModal
                selectedItem={selectedItem}
                locations={LOCATIONS}
                orderLocation={orderLocation}
                orderObservations={orderObservations}
                onLocationChange={setOrderLocation}
                onObservationsChange={setOrderObservations}
                onClose={() => setShowOrderModal(false)}
                onSubmit={handleSubmitOrder}
            />
        )}
      </div>
  );
}