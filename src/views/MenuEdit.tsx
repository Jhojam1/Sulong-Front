import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function MenuEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: '',
    state: 'DISPONIBLE',
    amount: 100,
    maxDailyAmount: 50,
    image: '',
  });

  useEffect(() => {
    if (id) {
      loadDish();
    }
  }, [id]);

  const loadDish = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dish/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading dish:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dishData = {
        ...formData,
        price: formData.price?.toString(),
      };

      if (id) {
        await axios.put(`${API_URL}/dish/updateDish/${id}`, dishData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${API_URL}/dish/saveDish`, dishData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate('/menu');
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {id ? 'Editar' : 'Nuevo'} Item del Menú
            </h1>
            <Button variant="secondary" size="sm" onClick={() => navigate('/menu')}>
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                  label="Nombre del producto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
              />

              <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
              />

              <Input
                  label="Cantidad total"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                  required
              />

              <Input
                  label="Cantidad máxima diaria"
                  type="number"
                  value={formData.maxDailyAmount}
                  onChange={(e) => setFormData({ ...formData, maxDailyAmount: parseInt(e.target.value) })}
                  required
              />

              <Input
                  label="URL de la imagen"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
              />
            </div>

            {formData.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista previa
                  </label>
                  <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300';
                      }}
                  />
                </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="h-5 w-5 mr-2" />
                {id ? 'Guardar Cambios' : 'Crear Plato'}
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
}