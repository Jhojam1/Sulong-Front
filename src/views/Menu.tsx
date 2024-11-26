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
  lastUpdatedDate: string | null;
  image: string;
}

const API_URL = 'http://localhost:8080/api';

const LOCATIONS = [
  { id: '1', name: 'Sede Concepcion' },
  { id: '2', name: 'Sede Zaragocilla' },
  { id: '3', name: 'Sede Pie de la popa' },
];

export default function Menu() {
  const { userRole, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderLocation, setOrderLocation] = useState('');
  const [orderObservations, setOrderObservations] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editFormData, setEditFormData] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/Dish/getDish`, {
        headers: headers
      });
      setDishes(response.data);
      setError('');
    } catch (error: any) {
      console.error('Error loading dishes:', error);
      setError('Error al cargar los platos. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
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
      const headers = getAuthHeaders();

      const requestData = {
        id: editFormData.id,
        name: editFormData.name,
        description: editFormData.description,
        price: editFormData.price,
        state: editFormData.state,
        amount: editFormData.amount,
        maxDailyAmount: editFormData.maxDailyAmount,
        ordersToday: editFormData.ordersToday || 0,
        lastUpdatedDate: editFormData.lastUpdatedDate || null,
        image: editFormData.image
      };

      await axios.put(
          `${API_URL}/Dish/uptDish/${editFormData.id}`,
          requestData,
          {
            headers: {
              ...headers,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
      );

      setShowEditModal(false);
      setEditFormData(null);
      loadDishes();
      setError('');
    } catch (error: any) {
      let errorMessage = 'Error al actualizar el plato. ';

      if (error.response?.status === 403) {
        errorMessage += 'No tiene permisos para realizar esta acción.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }

      setError(errorMessage);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      const headers = getAuthHeaders();

      if (!selectedItem || !orderLocation) {
        setError('Por favor complete todos los campos requeridos.');
        return;
      }

      const orderData = {
        dishId: selectedItem.id,
        location: orderLocation,
        observations: orderObservations
      };

      await axios.post(`${API_URL}/Order/createOrder`, orderData, { headers });

      setShowOrderModal(false);
      setSelectedItem(null);
      setOrderLocation('');
      setOrderObservations('');
      loadDishes();
    } catch (error: any) {
      setError('Error al crear el pedido. Por favor, intente nuevamente.');
    }
  };

  const isAvailable = (dish: MenuItem) => {
    return dish.state === 'Disponible' &&
        dish.amount > 0 &&
        (!dish.maxDailyAmount || dish.ordersToday < dish.maxDailyAmount);
  };

  const canManageMenu = userRole === 'admin' || userRole === 'cashier';
  const isRegularUser = userRole === 'user';

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (isRegularUser) {
      return matchesSearch && isAvailable(dish);
    }

    return matchesSearch;
  });

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Menú del Día
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                    placeholder="Buscar platos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {canManageMenu && (
                  <Button
                      onClick={() => navigate('/menu/new')}
                      className="w-full sm:w-auto"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nuevo Plato
                  </Button>
              )}
            </div>
          </div>

          {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
          )}

          {filteredDishes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                      ? 'No se encontraron platos que coincidan con tu búsqueda.'
                      : 'No hay platos disponibles en este momento.'}
                </p>
              </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                        }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-indigo-600">
                    ${item.price}
                  </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isAvailable(item)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {isAvailable(item) ? 'Disponible' : 'No Disponible'}
                  </span>

                      {canManageMenu ? (
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="ml-2"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                      ) : (
                          isAvailable(item) && (
                              <Button
                                  size="sm"
                                  onClick={() => handleOrder(item)}
                                  className="ml-2"
                              >
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
        </div>

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