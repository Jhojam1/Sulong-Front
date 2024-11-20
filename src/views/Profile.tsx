import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+34 612 345 678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Mi Perfil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700"
              >
                <Camera className="h-4 w-4 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Foto de Perfil</h3>
              <p className="text-sm text-gray-500">
                JPG o PNG. Máximo 1MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Contraseña Actual"
              type="password"
              placeholder="Dejar en blanco si no desea cambiar"
            />

            <Input
              label="Nueva Contraseña"
              type="password"
              placeholder="Dejar en blanco si no desea cambiar"
            />

            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="Dejar en blanco si no desea cambiar"
            />
          </div>

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