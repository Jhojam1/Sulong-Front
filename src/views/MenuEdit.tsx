import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { MenuItem } from '../types';

export default function MenuEdit() {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic here
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Editar Item del Menú
          </h1>
          <Button variant="secondary" size="sm">
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
              label="Categoría"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <Input
              label="Precio"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />

            <Input
              label="URL de la imagen"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
              Disponible para ordenar
            </label>
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
              />
            </div>
          )}

          <div className="flex justify-end">
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