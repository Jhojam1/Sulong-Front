import React from 'react';
import { X, Save } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

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

interface EditDishModalProps {
    editFormData: MenuItem;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onChange: (updatedData: MenuItem) => void;
}

export default function EditDishModal({
                                          editFormData,
                                          onClose,
                                          onSubmit,
                                          onChange
                                      }: EditDishModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Editar Plato</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nombre del producto"
                            value={editFormData.name}
                            onChange={(e) => onChange({ ...editFormData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Precio"
                            type="number"
                            step="0.01"
                            value={editFormData.price}
                            onChange={(e) => onChange({ ...editFormData, price: e.target.value })}
                            required
                        />

                        <Input
                            label="Cantidad total"
                            type="number"
                            value={editFormData.amount}
                            onChange={(e) => onChange({ ...editFormData, amount: parseInt(e.target.value) })}
                            required
                        />

                        <Input
                            label="Cantidad máxima diaria"
                            type="number"
                            value={editFormData.maxDailyAmount}
                            onChange={(e) => onChange({ ...editFormData, maxDailyAmount: parseInt(e.target.value) })}
                            required
                        />

                        <Input
                            label="URL de la imagen"
                            type="url"
                            value={editFormData.image}
                            onChange={(e) => onChange({ ...editFormData, image: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={editFormData.state}
                                onChange={(e) => onChange({ ...editFormData, state: e.target.value })}
                                required
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="No Disponible">No Disponible</option>
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
                            onChange={(e) => onChange({ ...editFormData, description: e.target.value })}
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
                            onClick={onClose}
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
    );
}