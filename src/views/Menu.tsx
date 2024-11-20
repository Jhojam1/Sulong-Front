import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, ShoppingCart, Edit2, X, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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

  const LOCATIONS = [
    { id: '1', name: 'Sede Concepcion' },
    { id: '2', name: 'Sede Zaragocilla' },
    { id: '3', name: 'Sede Pie de la popa' },
  ];

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
    return dish.ordersToday < dish.maxDailyAmount && dish.state === 'DISPONIBLE';
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
                      <p className="text-sm text-gray-500">
                        Pedidos hoy: {item.ordersToday}/{item.maxDailyAmount}
                      </p>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Editar Plato</h2>
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditFormData(null);
                      }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitEdit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Nombre del producto"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Precio"
                        type="number"
                        step="0.01"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                        required
                    />

                    <Input
                        label="Cantidad total"
                        type="number"
                        value={editFormData.amount}
                        onChange={(e) => setEditFormData({ ...editFormData, amount: parseInt(e.target.value) })}
                        required
                    />

                    <Input
                        label="Cantidad máxima diaria"
                        type="number"
                        value={editFormData.maxDailyAmount}
                        onChange={(e) => setEditFormData({ ...editFormData, maxDailyAmount: parseInt(e.target.value) })}
                        required
                    />

                    <Input
                        label="URL de la imagen"
                        type="url"
                        value={editFormData.image}
                        onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                        required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          value={editFormData.state}
                          onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                          required
                      >
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="NO_DISPONIBLE">No Disponible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        required
                    />
                  </div>

                  {editFormData.image && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vista previa
                        </label>
                        <img
                            src={editFormData.image}
                            alt="Preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x300';
                            }}
                        />
                      </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditFormData(null);
                        }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Save className="h-5 w-5 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Modal de Pedido */}
        {showOrderModal && selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Realizar Pedido</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={orderLocation}
                        onChange={(e) => setOrderLocation(e.target.value)}
                        required
                    >
                      <option value="">Seleccionar sede</option>
                      {LOCATIONS.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        value={orderObservations}
                        onChange={(e) => setOrderObservations(e.target.value)}
                        placeholder="Instrucciones especiales para su pedido..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmitOrder} disabled={!orderLocation}>
                      Confirmar Pedido
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}