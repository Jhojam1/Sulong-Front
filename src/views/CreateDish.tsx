import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Utensils } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import DishFormField from "../components/DishFormField.tsx";

const API_URL = 'http://localhost:8080/api';

interface DishFormData {
  name: string;
  description: string;
  price: string;
  state: string;
  amount: number;
  maxDailyAmount: number;
  image: string;
}

const initialFormData: DishFormData = {
  name: '',
  description: '',
  price: '',
  state: 'Disponible',
  amount: 0,
  maxDailyAmount: 0,
  image: '',
};

export default function CreateDish() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DishFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/Dish/saveDish`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/menu');
    } catch (error) {
      console.error('Error creating dish:', error);
      alert('Error al crear el plato. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'maxDailyAmount' ? parseInt(value) || 0 : value,
    }));
  };

  return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón volver */}
          <div className="mb-8 flex items-center">
            <Button
                variant="ghost"
                onClick={() => navigate('/menu')}
                className="mr-4 hover:bg-gray-200"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Volver al Menú
            </Button>
          </div>

          {/* Encabezado principal */}
          <div className="bg-indigo-600 text-center py-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <Utensils className="h-8 w-8" />
              Crear Nuevo Plato
            </h1>
          </div>

          {/* Contenido del formulario */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DishFormField
                    label="Nombre del Plato"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Arroz con Pollo"
                />

                <DishFormField
                    label="Precio"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ej: 15000"
                    type="text"
                />

                <DishFormField
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el plato..."
                    className="md:col-span-2"
                    isTextArea
                />

                <DishFormField
                    label="Estado"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    isSelect
                    options={[
                      { value: 'Disponible', label: 'Disponible' },
                      { value: 'No Disponible', label: 'No Disponible' },
                    ]}
                />

                <DishFormField
                    label="URL de la Imagen"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    type="url"
                />

                {/* Vista previa de la imagen */}
                {formData.image && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vista previa de la imagen</label>
                      <img
                          src={formData.image}
                          alt="Vista previa del plato"
                          className="w-full h-48 object-cover rounded-md shadow-md border"
                      />
                    </div>
                )}

                <DishFormField
                    label="Cantidad Total"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    type="number"
                    min="0"
                />

                <DishFormField
                    label="Cantidad Máxima Diaria"
                    name="maxDailyAmount"
                    value={formData.maxDailyAmount}
                    onChange={handleChange}
                    type="number"
                    min="0"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/menu')}
                    className="hover:bg-gray-100"
                >
                  Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? (
                      <span className="flex items-center">
                    <Upload className="animate-spin h-5 w-5 mr-2" />
                    Creando...
                  </span>
                  ) : (
                      'Crear Plato'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
