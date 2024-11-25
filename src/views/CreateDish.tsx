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
    ordersToday?: number; // Añadimos este campo que parece requerir el backend
}

const initialFormData: DishFormData = {
    name: '',
    description: '',
    price: '',
    state: 'Disponible',
    amount: 0,
    maxDailyAmount: 0,
    image: '',
    ordersToday: 0, // Inicializamos con 0 para evitar el null
};

export default function CreateDish() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<DishFormData>(initialFormData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Validaciones básicas
            if (!formData.name.trim()) throw new Error('El nombre del plato es requerido');
            if (!formData.price.trim()) throw new Error('El precio es requerido');
            if (formData.amount < 0) throw new Error('La cantidad no puede ser negativa');
            if (formData.maxDailyAmount < 0) throw new Error('La cantidad máxima diaria no puede ser negativa');

            // Log de los datos antes de enviar
            console.log('Token:', token);
            console.log('Datos a enviar:', JSON.stringify(formData, null, 2));

            const response = await axios.post(`${API_URL}/Dish/saveDish`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }).catch(error => {
                // Log detallado del error
                console.error('Error completo:', error);
                console.error('Respuesta del servidor:', error.response);
                console.error('Datos de la respuesta:', error.response?.data);
                console.error('Estado de la respuesta:', error.response?.status);
                console.error('Headers de la respuesta:', error.response?.headers);
                throw error;
            });

            // Log de la respuesta exitosa
            console.log('Respuesta exitosa:', response.data);

            if (response.data) {
                navigate('/menu');
            }
        } catch (error: any) {
            console.error('Error creating dish:', error);
            setError(error.response?.data?.message || error.message || 'Error al crear el plato. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedValue = name === 'amount' || name === 'maxDailyAmount' ? parseInt(value) || 0 : value;

        // Log del cambio de valor
        console.log(`Campo ${name} actualizado:`, updatedValue);

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: updatedValue,
            };
            console.log('Nuevo estado del formulario:', newData);
            return newData;
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Botón volver - Responsive */}
                <div className="mb-4 sm:mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/menu')}
                        className="w-full sm:w-auto hover:bg-gray-200 flex items-center justify-center"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Volver al Menú
                    </Button>
                </div>

                {/* Encabezado principal - Responsive */}
                <div className="bg-indigo-600 text-center py-4 sm:py-6 rounded-lg shadow-md mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3">
                        <Utensils className="h-6 w-6 sm:h-8 sm:w-8" />
                        Crear Nuevo Plato
                    </h1>
                </div>

                {/* Debug Info - Solo visible en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg overflow-auto">
                        <h3 className="font-bold mb-2">Debug Info:</h3>
                        <pre className="text-xs">{JSON.stringify(formData, null, 2)}</pre>
                    </div>
                )}

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Contenido del formulario - Responsive */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <DishFormField
                                label="Nombre del Plato"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Arroz con Pollo"
                                required
                            />

                            <DishFormField
                                label="Precio"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Ej: 15000"
                                type="text"
                                required
                            />

                            <DishFormField
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe el plato..."
                                className="sm:col-span-2"
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

                            {/* Vista previa de la imagen - Responsive */}
                            {formData.image && (
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vista previa de la imagen
                                    </label>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                        <img
                                            src={formData.image}
                                            alt="Vista previa del plato"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/400x300?text=Error+de+imagen';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <DishFormField
                                label="Cantidad Total"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                required
                            />

                            <DishFormField
                                label="Cantidad Máxima Diaria"
                                name="maxDailyAmount"
                                value={formData.maxDailyAmount}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                required
                            />
                        </div>

                        {/* Botones - Responsive */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/menu')}
                                className="w-full sm:w-auto hover:bg-gray-100"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
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