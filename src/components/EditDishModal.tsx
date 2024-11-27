import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Input from './ui/Input';

interface MenuItem {
    id?: string;
    name: string;
    price: string | number;
    amount: number;
    maxDailyAmount: number;
    image: string;
    state: 'Disponible' | 'No Disponible';
    description: string;
}

interface EditDishModalProps {
    editFormData: MenuItem;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onChange: (data: MenuItem) => void;
}

export default function EditDishModal({
    editFormData,
    onClose,
    onSubmit,
    onChange
}: EditDishModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(e);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof MenuItem, value: string | number) => {
        onChange({
            ...editFormData,
            [field]: value
        });
    };

    const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MenuItem) => {
        const value = e.target.value;
        // Solo permite números positivos
        if (/^\d*$/.test(value)) {
            handleInputChange(field, value === '' ? 0 : parseInt(value));
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="fixed inset-0 overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl mx-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white rounded-t-lg">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Editar Plato
                            </h2>
                            <button
                                onClick={onClose}
                                className="hover:bg-gray-100 rounded-full p-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto">
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Nombre del plato"
                                                value={editFormData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                required
                                            />

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Precio
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={editFormData.price}
                                                    onChange={(e) => handleNumericInput(e, 'price')}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cantidad total
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={editFormData.amount}
                                                    onChange={(e) => handleNumericInput(e, 'amount')}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Máx. diario
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={editFormData.maxDailyAmount}
                                                    onChange={(e) => handleNumericInput(e, 'maxDailyAmount')}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Estado
                                                </label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={editFormData.state}
                                                    onChange={(e) => handleInputChange('state', e.target.value as 'Disponible' | 'No Disponible')}
                                                    required
                                                >
                                                    <option value="Disponible">Disponible</option>
                                                    <option value="No Disponible">No Disponible</option>
                                                </select>
                                            </div>

                                            <Input
                                                label="URL de la imagen"
                                                type="url"
                                                value={editFormData.image}
                                                onChange={(e) => handleInputChange('image', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none h-[120px]"
                                                value={editFormData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1">
                                        {editFormData.image && (
                                            <div className="sticky top-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Vista previa
                                                </label>
                                                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                                                    <div className="aspect-[4/3]">
                                                        <img
                                                            src={editFormData.image}
                                                            alt="Vista previa del plato"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://via.placeholder.com/400x300?text=Error+de+imagen';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-3 px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <Save className="animate-spin h-5 w-5 mr-2" />
                                            Guardando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Save className="h-5 w-5 mr-2" />
                                            Guardar Cambios
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}